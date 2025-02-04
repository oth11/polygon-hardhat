require("dotenv").config();
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const contractData = JSON.parse(fs.readFileSync("deployed_contract.json"));
  const contractAddress = contractData.address;

  const provider = new ethers.JsonRpcProvider(
    `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = [
    "function getAllNFTs() public view returns (uint256[] memory, string[] memory)"
  ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  try {
    const [ids, uris] = await contract.getAllNFTs();
    console.log("✅ Minted NFTs:");
    ids.forEach((id, index) => console.log(`ID: ${id}, URI: ${uris[index]}`));
  } catch (error) {
    console.error("❌ Failed to fetch NFTs:", error);
  }
}

main();

