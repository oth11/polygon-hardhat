require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");
const readline = require("readline-sync");

async function getMintedNFTs() {
  console.log("\nFetching all minted NFTs...");
  
  try {
    const contractData = JSON.parse(fs.readFileSync("deployed_contract.json"));
    const contractAddress = contractData.address;

    const provider = new ethers.JsonRpcProvider(
      `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = ["function getAllNFTs() public view returns (uint256[] memory, string[] memory)"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const [ids, uris] = await contract.getAllNFTs();

    if (ids.length === 0) {
      console.log("⚠️ No NFTs found.");
      process.exit(1);
    }

    console.log("\n✅ Minted NFTs:");
    ids.forEach((id, index) => console.log(`ID: ${id}, URI: ${uris[index]}`));
    
    return ids;
  } catch (error) {
    console.error("❌ Failed to fetch NFTs:", error);
    process.exit(1);
  }
}

async function burnNFT() {
  // ✅ Get list of NFTs before burning
  const nftIds = await getMintedNFTs();

  // ✅ Prompt user for Token ID to burn
  const tokenId = readline.question("\nEnter the Token ID to burn: ");
  if (isNaN(tokenId) || !nftIds.includes(parseInt(tokenId))) {
    console.error("❌ Invalid Token ID!");
    process.exit(1);
  }

  // ✅ Load contract details
  const contractData = JSON.parse(fs.readFileSync("deployed_contract.json"));
  const contractAddress = contractData.address;

  // ✅ Connect to Polygon Amoy network
  const provider = new ethers.JsonRpcProvider(
    `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // ✅ Define ABI for burnNFT function
  const abi = ["function burnNFT(uint256 tokenId) public"];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log(`Burning NFT with ID: ${tokenId}...`);

  try {
    const tx = await contract.burnNFT(tokenId);
    await tx.wait();
    console.log(`✅ NFT Burned! Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Burning failed:", error);
  }
}

burnNFT();
