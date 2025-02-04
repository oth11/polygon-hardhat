require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");
const readline = require("readline-sync");

async function main() {
  // ✅ Read contract address from JSON file
  const contractData = JSON.parse(fs.readFileSync("deployed_contract.json"));
  const contractAddress = contractData.address;

  // ✅ Get recipient wallet from .env
  const recipient = process.env.RECIPIENT_WALLET;
  if (!recipient) {
    throw new Error("❌ RECIPIENT_WALLET is not set in .env file!");
  }

  // ✅ Ask user for the tokenURI (NFT Metadata URL)
  const tokenURI = readline.question("Enter NFT Metadata URL (e.g., ipfs://Qm.../1.json): ");
  if (!tokenURI) {
    console.error("❌ Token URI is required!");
    process.exit(1);
  }

  // ✅ Use a direct connection without ENS resolution
  const provider = new ethers.JsonRpcProvider(
    `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ✅ Define ABI explicitly to avoid ENS issues
  const abi = [
    "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log(`Minting NFT for ${recipient} with URI: ${tokenURI} on contract ${contractAddress}...`);

  try {
    // ✅ Pass raw address to prevent ENS resolution issue
    const tx = await contract.mintNFT(ethers.getAddress(recipient), tokenURI);
    await tx.wait();
    console.log(`✅ NFT Minted! Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Minting failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
