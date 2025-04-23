const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const swapAbi = [
    "function executeSwap((address userA, address userB, address tokenContract, address nftContract, uint256 tokenAmount, uint256 nftId, uint256 nonce), bytes signatureA, bytes signatureB)",
];

const swapAddress = "Address_of_your_swap_contract";

const relayerPrivateKey = "API_KEY_REPLAYER";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const relayerWallet = new ethers.Wallet(relayerPrivateKey, provider);
const swapContract = new ethers.Contract(swapAddress, swapAbi, relayerWallet);

app.post("/executeSwap", async (req, res) => {
    try {
        const { swapRequest, signatureA, signatureB, relayerAddress } = req.body;
        if (!swapRequest || !signatureA || !signatureB || !relayerAddress) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }
        const tx = await swapContract.executeSwap(
            swapRequest,
            signatureA,
            signatureB,
            relayerAddress
        );
        const receipt = await tx.wait();
        res.json({ success: true, txHash: tx.hash, blockNumber: receipt.blockNumber });
    } catch (error) {
        console.error("Relayer error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Relayer server running on port 3000");
});