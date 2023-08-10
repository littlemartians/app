// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ILittleMartians {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    function mint(address to, uint256 tokenId) external;
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function recoverSigner(bytes32 _messageHashed, uint8 _v, bytes32 _r, bytes32 _s) external pure returns (address);

}