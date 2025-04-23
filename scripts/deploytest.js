const { ethers } = require("hardhat");
const tokenAbi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function mint() returns (bool)",
];
const nftAbi = [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function approve(address to, uint256 tokenId)",
    "function safeMint() returns (uint256)",
];
const swapAbi = [
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "idRequest", "type": "uint256" },
                    { "internalType": "address", "name": "userA", "type": "address" },
                    { "internalType": "address", "name": "userB", "type": "address" },
                    { "internalType": "address", "name": "tokenContract", "type": "address" },
                    { "internalType": "address", "name": "nftContract", "type": "address" },
                    { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" },
                    { "internalType": "uint256", "name": "nftId", "type": "uint256" },
                    { "internalType": "uint256", "name": "nonceA", "type": "uint256" },
                    { "internalType": "uint256", "name": "nonceB", "type": "uint256" }
                ],
                "internalType": "struct VaultSwap.SwapRequest",
                "name": "request",
                "type": "tuple"
            },
            { "internalType": "bytes", "name": "signatureA", "type": "bytes" },
            { "internalType": "bytes", "name": "signatureB", "type": "bytes" }
        ],
        "name": "executeSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user", "type": "address" }
        ],
        "name": "getNonce",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function main() {
    const [deployer, bob, relayer] = await ethers.getSigners();
    console.log("Deployer (User A) address:", deployer.address);
    console.log("Bob (User B) address:", bob.address);
    console.log("Relayer (meta-transaction) address:", relayer.address);

    console.log("Deploying contracts...");

    // TokenERC20
    const tokenYAYA = await ethers.deployContract("TokenYAYA");
    await tokenYAYA.waitForDeployment();
    const tokenAddress = await tokenYAYA.getAddress();
    console.log("TokenYAYA deployed to:", tokenAddress);
    // TokenNFT
    const tokenNFT = await ethers.deployContract("MyTokenNFT");
    await tokenNFT.waitForDeployment();
    const nftAddress = await tokenNFT.getAddress();
    console.log("TokenNFT deployed to:", nftAddress);
    // VaultSwap
    const vaultSwap = await ethers.deployContract("VaultSwap");
    await vaultSwap.waitForDeployment();
    const swapAddress = await vaultSwap.getAddress();
    console.log("VaultSwap deployed to:", swapAddress);

    //Address of contract
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, deployer);
    const nftContract = new ethers.Contract(nftAddress, nftAbi, deployer);
    const swapContract = new ethers.Contract(swapAddress, swapAbi, deployer);


    // Mint token vs NFT
    console.log("Minting tokens and NFT...");
    const tokenTx = await tokenContract.mint();
    await tokenTx.wait();
    const nftTx = await nftContract.connect(bob).safeMint();
    const nftReceipt = await nftTx.wait();
    const nftId = 1


    // Approve token and NFT for VaultSwap contract
    console.log("Approving token and NFT...");
    await tokenContract.approve(swapAddress, ethers.parseEther("1500"));
    await nftContract.connect(bob).approve(swapAddress, nftId);
    console.log("Approvals completed");

    const nonceA = await swapContract.getNonce(deployer.address);
    const nonceB = await swapContract.getNonce(bob.address);

    const swapRequest = {
        idRequest: 1,
        userA: deployer.address,
        userB: bob.address,
        tokenContract: tokenAddress,
        nftContract: nftAddress,
        tokenAmount: ethers.parseEther("1500"),
        nftId,
        nonceA: nonceA,
        nonceB: nonceB,
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

    const signatureA = await deployer.signTypedData(domain, types, swapRequest);
    console.log("Signature A:", signatureA);

    const signatureB = await bob.signTypedData(domain, types, swapRequest);
    console.log("Signature B:", signatureB);

    console.log("Executing swap...");
    const tx = await swapContract.connect(relayer).executeSwap(swapRequest, signatureA, signatureB);
    await tx.wait();
    console.log("Swap executed successfully!");

    const userABalance = await tokenContract.balanceOf(deployer.address);
    const userBBalance = await tokenContract.balanceOf(bob.address);
    const nftOwner = await nftContract.ownerOf(nftId);
    console.log(`User A token balance: ${ethers.formatEther(userABalance)}`);
    console.log(`User B token balance: ${ethers.formatEther(userBBalance)}`);
    console.log(`NFT ID ${nftId} owner: ${nftOwner}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });