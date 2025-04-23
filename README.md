# 🔐 Sample EIP-712 Meta-Transaction Project

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
Chain ID: 1337n
Deploying contracts...
TokenYAYA deployed to: 0xD5ac451B0c50B9476107823Af206eD814a2e2580
MyTokenNFT deployed to: 0xF8e31cb472bc70500f08Cd84917E5A1912Ec8397
VaultSwap deployed to: 0xc0F115A19107322cFBf1cDBC7ea011C19EbDB4F8
Minting tokens and NFT...
Minted tokens for deployer
Minted NFT ID 1 for Bob
User A token balance before: 1500.0
User B token balance before: 0.0
NFT ID 1 owner before: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Token allowance for VaultSwap: 0.0
NFT approved for: 0x0000000000000000000000000000000000000000
Approving token and NFT...
Token approved for VaultSwap
NFT approved for VaultSwap
Token allowance after approve: 1500.0
NFT approved for after approve: 0xc0F115A19107322cFBf1cDBC7ea011C19EbDB4F8
Nonce A: 0, Nonce B: 0
Signing SwapRequest...
SwapRequest: {
  idRequest: 1,
  userA: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  userB: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  tokenContract: '0xD5ac451B0c50B9476107823Af206eD814a2e2580',
  nftContract: '0xF8e31cb472bc70500f08Cd84917E5A1912Ec8397',
  tokenAmount: 1500000000000000000000n,
  nftId: 1,
  nonceA: 0n,
  nonceB: 0n,
  isExecuted: false
}
Signature A: 0x319bbe16127980bfedf3364172d6adb4b284ccea1563da3ad86b192d50f746d33b11779ecd11471e7aa6d19dc24320cf851131eb13fe583f509cef51549697cf1b
Signature B: 0x9d13445162c059c47b95911e71b4b5e13a685da52b57fabb2cb5af5abb4e37e92ca714b0859df22b7705f6102498507bad44bda2d7293d02dfd5e6abd9f9d5241c
Verifying signatures...
EIP-712 Hash: 0x82fde9daf72b4bdf78943f9cb85a9e803fc5459e8236d81bebfe3e1c05002c10
Recovered Signer A: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, Expected: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Recovered Signer B: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, Expected: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Executing swap...
Swap executed successfully! Transaction hash: 0x85934a34097382b0bb3f1ca5867080f7ed6607d841971f4797cd6e79cc0f9bfc
Checking SwapRequest...
SwapRequest details: {
  idRequest: '1',
  userA: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  userB: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  tokenAmount: '1500.0',
  nftId: '1',
  isExecuted: true
}
User A token balance after: 0.0
User B token balance after: 1500.0
NFT ID 1 owner after: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
