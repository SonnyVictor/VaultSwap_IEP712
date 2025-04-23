const { ethers } = require("hardhat");
const nftAbi = require("../artifacts/contracts/mytokenNFT.sol/MyTokenNFT.json").abi;
const tokenAbi = require("../artifacts/contracts/tokenYaya.sol/TokenYAYA.json").abi;
const swapAbi = require("../artifacts/contracts/vaultswap.sol/VaultSwap.json").abi;


async function main() {
    const [deployer, bob, relayer] = await ethers.getSigners();
    console.log("Deployer (User A) address:", deployer.address);
    console.log("Bob (User B) address:", bob.address);
    console.log("Relayer (meta-transaction) address:", relayer.address);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);

    console.log("Deploying contracts...");

    const TokenYAYA = await ethers.getContractFactory("TokenYAYA");
    const tokenYAYA = await TokenYAYA.deploy();
    await tokenYAYA.waitForDeployment();
    const tokenAddress = await tokenYAYA.getAddress();
    console.log("TokenYAYA deployed to:", tokenAddress);

    const MyTokenNFT = await ethers.getContractFactory("MyTokenNFT");
    const tokenNFT = await MyTokenNFT.deploy();
    await tokenNFT.waitForDeployment();
    const nftAddress = await tokenNFT.getAddress();
    console.log("MyTokenNFT deployed to:", nftAddress);

    const VaultSwap = await ethers.getContractFactory("VaultSwap");
    const vaultSwap = await VaultSwap.deploy();
    await vaultSwap.waitForDeployment();
    const swapAddress = await vaultSwap.getAddress();
    console.log("VaultSwap deployed to:", swapAddress);

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, deployer);
    const nftContract = new ethers.Contract(nftAddress, nftAbi, deployer);
    const swapContract = new ethers.Contract(swapAddress, swapAbi, deployer);

    console.log("Minting tokens and NFT...");
    const tokenTx = await tokenContract.mint();
    await tokenTx.wait();
    console.log("Minted tokens for deployer");

    const nftTx = await nftContract.connect(bob).safeMint();
    await nftTx.wait();
    const nftId = 1;
    console.log(`Minted NFT ID ${nftId} for Bob`);

    const userABalanceBefore = await tokenContract.balanceOf(deployer.address);
    const userBBalanceBefore = await tokenContract.balanceOf(bob.address);
    const nftOwnerBefore = await nftContract.ownerOf(nftId);
    const tokenAllowance = await tokenContract.allowance(deployer.address, swapAddress);
    const nftApproved = await nftContract.getApproved(nftId);
    console.log(`User A token balance before: ${ethers.formatEther(userABalanceBefore)}`);
    console.log(`User B token balance before: ${ethers.formatEther(userBBalanceBefore)}`);
    console.log(`NFT ID ${nftId} owner before: ${nftOwnerBefore}`);
    console.log(`Token allowance for VaultSwap: ${ethers.formatEther(tokenAllowance)}`);
    console.log(`NFT approved for: ${nftApproved}`);

    console.log("Approving token and NFT...");
    const tokenApproveTx = await tokenContract.approve(swapAddress, ethers.parseEther("1500"));
    await tokenApproveTx.wait();
    console.log("Token approved for VaultSwap");

    const nftApproveTx = await nftContract.connect(bob).approve(swapAddress, nftId);
    await nftApproveTx.wait();
    console.log("NFT approved for VaultSwap");

    const tokenAllowanceAfter = await tokenContract.allowance(deployer.address, swapAddress);
    const nftApprovedAfter = await nftContract.getApproved(nftId);
    console.log(`Token allowance after approve: ${ethers.formatEther(tokenAllowanceAfter)}`);
    console.log(`NFT approved for after approve: ${nftApprovedAfter}`);

    const nonceA = await swapContract.getNonce(deployer.address);
    const nonceB = await swapContract.getNonce(bob.address);
    console.log(`Nonce A: ${nonceA}, Nonce B: ${nonceB}`);

    const swapRequest = {
        idRequest: 1,
        userA: deployer.address,
        userB: bob.address,
        tokenContract: tokenAddress,
        nftContract: nftAddress,
        tokenAmount: ethers.parseEther("1500"),
        nftId,
        nonceA,
        nonceB,
        isExecuted: false,
    };

    const domain = {
        name: "Swap",
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: swapAddress,
    };

    const types = {
        SwapRequest: [
            { name: "idRequest", type: "uint256" },
            { name: "userA", type: "address" },
            { name: "userB", type: "address" },
            { name: "tokenContract", type: "address" },
            { name: "nftContract", type: "address" },
            { name: "tokenAmount", type: "uint256" },
            { name: "nftId", type: "uint256" },
            { name: "nonceA", type: "uint256" },
            { name: "nonceB", type: "uint256" },
        ],
    };

    console.log("Signing SwapRequest...");
    console.log("SwapRequest:", swapRequest);
    const signatureA = await deployer.signTypedData(domain, types, swapRequest);
    console.log("Signature A:", signatureA);
    const signatureB = await bob.signTypedData(domain, types, swapRequest);
    console.log("Signature B:", signatureB);

    console.log("Verifying signatures...");
    const hash = ethers.TypedDataEncoder.hash(domain, types, swapRequest);
    console.log("EIP-712 Hash:", hash);
    const recoveredSignerA = ethers.verifyTypedData(domain, types, swapRequest, signatureA);
    const recoveredSignerB = ethers.verifyTypedData(domain, types, swapRequest, signatureB);
    console.log(`Recovered Signer A: ${recoveredSignerA}, Expected: ${deployer.address}`);
    console.log(`Recovered Signer B: ${recoveredSignerB}, Expected: ${bob.address}`);

    console.log("Executing swap...");
    const tx = await swapContract.connect(relayer).executeSwap(swapRequest, signatureA, signatureB, {
        gasLimit: 500000,
    });
    await tx.wait();
    console.log("Swap executed successfully! Transaction hash:", tx.hash);

    console.log("Checking SwapRequest...");
    try {
        const swapRequestData = await swapContract.swapRequests(1);
        console.log("SwapRequest details:", {
            idRequest: swapRequestData.idRequest.toString(),
            userA: swapRequestData.userA,
            userB: swapRequestData.userB,
            tokenAmount: ethers.formatEther(swapRequestData.tokenAmount),
            nftId: swapRequestData.nftId.toString(),
            isExecuted: swapRequestData.isExecuted,
        });
    } catch (error) {
        console.error("Error calling getSwapRequest:", error);
        throw error;
    }


    const userABalanceAfter = await tokenContract.balanceOf(deployer.address);
    const userBBalanceAfter = await tokenContract.balanceOf(bob.address);
    const nftOwnerAfter = await nftContract.ownerOf(nftId);
    console.log(`User A token balance after: ${ethers.formatEther(userABalanceAfter)}`);
    console.log(`User B token balance after: ${ethers.formatEther(userBBalanceAfter)}`);
    console.log(`NFT ID ${nftId} owner after: ${nftOwnerAfter}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });