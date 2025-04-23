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
Signature A: 0x300c693df5c8619034d5094be833575a3332a6e082ae7d20c8bc5c10483dd481076be0279990166e5bb245da76c41d851872d546a944d234781d659c76e514b01b
Signature B: 0xe547a08f1d1f5301d826bda2dadd8864f7bf6fb9127dd52ebb293870e5d3227c143bbb4eb338f8bff648b7dd6f77e98dde089b050742d078ac3060bd143245b51b
Executing swap...
Swap executed successfully!
User A token balance: 0.0
User B token balance: 1500.0
NFT ID 1 owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266# 🔐 Sample EIP-712 Meta-Transaction Project

This project demonstrates a simple use case of **EIP-712 signatures** for meta-transactions using Hardhat. It includes:

- A set of smart contracts: `TokenYAYA` (ERC-20), `MyTokenNFT` (ERC-721), and `VaultSwap`.
- A full test and deployment flow with signature generation and relayer execution.

---

## 🧪 Flow project

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
Signature A: 0x300c693df5c8619034d5094be833575a3332a6e082ae7d20c8bc5c10483dd481076be0279990166e5bb245da76c41d851872d546a944d234781d659c76e514b01b
Signature B: 0xe547a08f1d1f5301d826bda2dadd8864f7bf6fb9127dd52ebb293870e5d3227c143bbb4eb338f8bff648b7dd6f77e98dde089b050742d078ac3060bd143245b51b
Executing swap...
Swap executed successfully!
User A token balance: 0.0
User B token balance: 1500.0
NFT ID 1 owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
