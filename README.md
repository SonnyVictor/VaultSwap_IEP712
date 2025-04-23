# Sample EIP 712 Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:



Expected Output
The script will:
Deploy TokenYAYA, MyTokenNFT, and VaultSwap contracts.
Mint tokens for Deployer and an NFT for Bob.
Approve VaultSwap to spend tokens and NFT.
Generate EIP-712 signatures for Deployer and Bob.
Send the executeSwap transaction via the relayer .
Verify the swap results (token and NFT ownership).

```shell

Solution: 
- Developer Deploy contract all contract 
- Developer mint tokenERC20
- Bob mint NFT 721
- Developer and Bob approve contract VaultSwap
- Developer signature
- Bob signature
- Relayer executeSwap contract VaultSwap

Require : node -v: 22
Step1: yarn
Step2: npx hardhat compile
Step3: npx hardhat node
Step4: npx hardhat run scripts/deploytest.js --network localhost
Deployer (User A) address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Bob (User B) address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Relayer (meta-transaction) address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Deploying contracts...
TokenYAYA deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
TokenNFT deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VaultSwap deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
Minting tokens and NFT...
Approving token and NFT...
Approvals completed
Signature A: 0x0ef9f10c0e7a86de3537c0a0a1460ffba25f6c06966f810882daf0fa3782714621991d710bb8d8da889d2cdf92fc1843b552a22adbb952b8f74e1ba14ae363171b
Signature B: 0x8e7cbc3575467334a66845e49a0b7d6d1b87c62f4bb9c8a15d705b16bbe8d946099396951998e80a778cfe51a5e33e136ab05637a2f79614c280da8c339d77951b
Executing swap...
Swap executed successfully!
User A token balance: 0.0
User B token balance: 1500.0
NFT ID 1 owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```
