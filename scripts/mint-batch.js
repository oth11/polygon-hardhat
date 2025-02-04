require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const contractData = JSON.parse(fs.readFileSync("deployed_contract.json"));
  const contractAddress = contractData.address;

  const recipient = process.env.RECIPIENT_WALLET;
  const tokenURI = "ipfs://QmYourMetadataHash/1.json"; // Example
  const amount = 3; // Mint 3 NFTs with the same metadata

  const provider = new ethers.JsonRpcProvider(
    `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = [
    "function mintBatchNFT(address recipient, string memory tokenURI, uint256 amount) public"
  ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log(`Minting ${amount} NFTs for ${recipient} with URI: ${tokenURI}...`);

  try {
    const tx = await contract.mintBatchNFT(recipient, tokenURI, amount);
    await tx.wait();
    console.log(`✅ Batch NFT Minted! Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Minting failed:", error);
  }
}

main();

