const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with address:", deployer.address);

  // Set the base URI (Replace with your IPFS URI)
  const baseURI = "ipfs://your-base-ipfs-hash/";

  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");

  // Deploy the contract
  const contract = await SimpleNFT.deploy(baseURI);
  await contract.waitForDeployment();

  const contractAddress = contract.target; // Correct way to get contract address in ethers v6

  console.log(`NFT Contract deployed at: ${contractAddress}`);

  // ✅ Store the contract address in a JSON file
  const contractData = {
    address: contractAddress
  };

  fs.writeFileSync("deployed_contract.json", JSON.stringify(contractData, null, 2));

  console.log("✅ Contract address saved to deployed_contract.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
