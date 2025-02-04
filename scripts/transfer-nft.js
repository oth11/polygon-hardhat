require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");
const readline = require("readline-sync");

async function main() {
  // ✅ Load the deployed contract address
  const contractData = JSON.parse(fs.readFileSync("deployed_contract.json"));
  const contractAddress = contractData.address;

  // ✅ Prompt user for recipient address
  const recipient = readline.question("Enter recipient wallet address: ");
  if (!ethers.isAddress(recipient)) {
    console.error("❌ Invalid wallet address!");
    process.exit(1);
  }

  // ✅ Prompt user for Token ID
  const tokenId = readline.question("Enter Token ID to transfer: ");
  if (isNaN(tokenId) || parseInt(tokenId) <= 0) {
    console.error("❌ Invalid Token ID!");
    process.exit(1);
  }

  // ✅ Connect to Polygon Amoy network
  const provider = new ethers.JsonRpcProvider(
    `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ✅ Define ABI for transferNFT function
  const abi = ["function transferNFT(address to, uint256 tokenId) public"];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log(`Transferring NFT ID ${tokenId} to ${recipient}...`);

  try {
    // ✅ Execute the transfer transaction
    const tx = await contract.transferNFT(recipient, tokenId);
    await tx.wait();
    console.log(`✅ NFT Transferred! Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Transfer failed:", error);
  }
}

main();

