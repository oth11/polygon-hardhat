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

    // ✅ Mint multiple NFTs with the same metadata
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

    // ✅ Get all minted NFTs
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

    // ✅ Burn an NFT (only the NFT owner can burn it)
    function burnNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        _burn(tokenId);
        delete _tokenMetadata[tokenId];  // Remove metadata reference
    }

    // ✅ Transfer an NFT to another address
    function transferNFT(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        _transfer(msg.sender, to, tokenId);
    }
}

