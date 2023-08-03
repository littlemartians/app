// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ILittleMartians {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function mint(address to, uint256 tokenId) external;
    function tokenURI(uint256 tokenId) external view returns (string memory);
}