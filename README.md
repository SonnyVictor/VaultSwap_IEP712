# 🔐 Sample EIP-712 Meta-Transaction Project

This project demonstrates a simple use case of **EIP-712 signatures** for meta-transactions using Hardhat. It includes:

- A set of smart contracts: `TokenYAYA` (ERC-20), `MyTokenNFT` (ERC-721), and `VaultSwap`.
- A full test and deployment flow with signature generation and relayer execution.

---

## 🧪 What This Project Does

The script performs the following actions:

1. Deploys the contracts: `TokenYAYA`, `MyTokenNFT`, and `VaultSwap`.
2. Mints ERC-20 tokens for **Deployer** and an NFT for **Bob**.
3. Approves `VaultSwap` to spend tokens and NFT.
4. Generates EIP-712 compliant signatures for both Deployer and Bob.
5. Sends the `executeSwap` transaction via a **Relayer**.
6. Verifies final balances and NFT ownership.

---

## 🛠 Prerequisites

- **Node.js v22** or above
- **Yarn** package manager

---

## 🚀 Setup & Deployment Steps

```bash
# Step 1: Install dependencies
yarn

# Step 2: Compile the contracts
npx hardhat compile

# Step 3: Start local Hardhat node
npx hardhat node

# Step 4: Deploy contracts and run the test flow
npx hardhat run scripts/deploytest.js --network localhost


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
