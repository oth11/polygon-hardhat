# polygon-hardhat
# NFT Deployment and Minting Server Documentation

## Introduction

This documentation provides a comprehensive guide on setting up, deploying, and using the NFT deployment and minting server. The server is designed to deploy NFT smart contracts on the Polygon Amoy testnet and provide scripts for minting, transferring, burning, and listing NFTs.

## Prerequisites

Ensure the following dependencies and configurations are set up before proceeding:

- **Node.js** (LTS version)
- **npm** (Node Package Manager)
- **Hardhat** installed globally (`npx hardhat`)
- **Alchemy API key** (for Polygon Amoy RPC)
- **Wallet private key** with test MATIC (for gas fees)
- **A Unix-based server environment**

## Project Structure

```
polygon-hardhat/
├── contracts/
│   ├── SimpleNFT.sol          # NFT Smart Contract
├── scripts/
│   ├── deploy-nft.js          # Deployment Script
│   ├── mint-nft.js            # Minting Script
│   ├── mint-batch.js          # Batch Minting Script
│   ├── get-nfts.js            # Fetching NFT List Script
│   ├── burn-nft.js            # Burn NFT Script
│   ├── transfer-nft.js        # Transfer NFT Script
├── .env                        # Environment Variables
├── hardhat.config.js           # Hardhat Configuration
├── package.json                # Dependencies
├── package-lock.json           # Dependency Lock
├── node_modules/               # Installed Packages
```

## Smart Contract

### `contracts/SimpleNFT.sol`
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    string private _baseTokenURI;
    mapping(uint256 => string) private _tokenMetadata;

    constructor(string memory baseURI) ERC721("SimpleNFT", "SNFT") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function mintBatchNFT(address recipient, string memory tokenURI, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        for (uint256 i = 0; i < amount; i++) {
            _tokenIds++;
            uint256 newItemId = _tokenIds;
            _safeMint(recipient, newItemId);
            _setTokenURI(newItemId, tokenURI);
            _tokenMetadata[newItemId] = tokenURI;
        }
    }

    function getAllNFTs() public view onlyOwner returns (uint256[] memory, string[] memory) {
        uint256 totalMinted = _tokenIds;
        uint256[] memory ids = new uint256[](totalMinted);
        string[] memory uris = new string[](totalMinted);
        for (uint256 i = 0; i < totalMinted; i++) {
            ids[i] = i + 1;
            uris[i] = _tokenMetadata[i + 1];
        }
        return (ids, uris);
    }

    function burnNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        _burn(tokenId);
        delete _tokenMetadata[tokenId];
    }

    function transferNFT(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        _transfer(msg.sender, to, tokenId);
    }
}
```

## Deployment

### `scripts/deploy-nft.js`
```javascript
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with address:", deployer.address);

  const baseURI = "ipfs://your-base-ipfs-hash/";
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const contract = await SimpleNFT.deploy(baseURI);

  await contract.waitForDeployment();

  const contractAddress = contract.target;
  console.log(`NFT Contract deployed at: ${contractAddress}`);

  fs.writeFileSync("deployed_contract.json", JSON.stringify({ address: contractAddress }, null, 2));
  console.log("✅ Contract address saved to deployed_contract.json");
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

### **Deploying the Contract**
Run the following command to deploy the contract to Polygon Amoy:
```sh
npx hardhat run scripts/deploy-nft.js --network polygon_amoy
```

This will generate a `deployed_contract.json` file with the contract address.

## Conclusion

This document provides a complete guide to deploying an NFT smart contract and interacting with it via various scripts. Ensure that your environment is correctly configured before proceeding with deployments and NFT transactions.

---

For more details, refer to the [GitHub Docs on Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

