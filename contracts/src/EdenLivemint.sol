// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { IEdenLivemint } from "./IEdenLivemint.sol";

contract EdenLivemint is ERC721, ERC721URIStorage, Ownable, IEdenLivemint {
    using Strings for uint256;

    // Mapping to track minted tokens
    mapping (uint256 => bool) private _mintedTokens;

    constructor(string memory name, string memory symbol, address initialOwner) 
        ERC721(name, symbol) 
        Ownable(initialOwner)
    {
    }

    function supportsInterface(bytes4 interfaceId) 
        public view override(ERC721, ERC721URIStorage, IEdenLivemint) // include IEdenLivemint here
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage, IEdenLivemint) // include IEdenLivemint here
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function mint(address to, uint256 tokenId) public onlyOwner {
        require(!_mintedTokens[tokenId], "Token already minted");

        _mintedTokens[tokenId] = true;
        _mint(to, tokenId);
    }

}
