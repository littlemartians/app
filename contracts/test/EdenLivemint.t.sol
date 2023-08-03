// In tests/EdenLivemint.t.sol
pragma solidity ^0.8.0;

import "../src/EdenLivemint.sol";

contract EdenLivemintTest is EdenLivemint {
    constructor(string memory name, string memory symbol, address initialOwner)
        EdenLivemint(name, symbol, initialOwner)
    {}

    function testMint() public {
        address to = address(this);
        uint256 tokenId = 1;
        
        // Perform the mint
        mint(to, tokenId);
        
        // Check that the token was minted
        assert(ownerOf(tokenId) == to);
    }
}
