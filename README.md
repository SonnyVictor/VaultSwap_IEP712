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
