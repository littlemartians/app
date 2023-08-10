// In tests/EdenLivemint.t.sol
pragma solidity ^0.8.0;

import "../src/LittleMartians.sol";
import "forge-std/Test.sol";


contract LittleMartiansTest is Test {
    LittleMartians internal _littleMartians;
    uint256 internal testNumber;
    address initialOwner;

    event LogRecoveredAddress(address recoveredAddress);

    function setUp() public {
        testNumber = 42;
        initialOwner = vm.addr(1);
        _littleMartians = new LittleMartians("LittleMartians", "LITTLEMARTIANS", initialOwner);
    }

    function testMint() public {
        address to = address(this);
        uint256 tokenId = 1;
        
        // Perform the mint
        _littleMartians.mint(to, tokenId);
        
        // Check that the token was minted
        assert(_littleMartians.ownerOf(tokenId) == to);
    }

    function testRecoverSigner() public {
        // Values from the provided JSON
        
        // bytes32 messageHash = 0xbcf83051a4d206c6e43d7eaa4c75429737ac0d5ee08ee68430443bd815e6ac05;
        // uint8 v = 27;
        // bytes32 r = 0x2ff1b8611a448e23a034b50d3d7a83d82e85571a4b9341008894a6f1774eefc9;
        // bytes32 s = 0x5fa57e5a941623160e63524153c45801d87d7a87430057bbfadc1a5ae68cdc4a;

        
        bytes32 messageHash = 0xbcf83051a4d206c6e43d7eaa4c75429737ac0d5ee08ee68430443bd815e6ac05;
        uint8 v = 27;
        bytes32 r = 0x35a6ae789aa7848737fd0bc8595c44204bfd4c3f952787515bbc7fd85d18215f;
        bytes32 s = 0x31f0257e7aa594b9316d6b8bb1abd97f8e130877ee7cd7463506089b86bbff9b;


        address recovered = _littleMartians.recoverSigner(messageHash, v, r, s);
        
        // Convert the provided publicKey to an Ethereum address
        // Here, we assume the public key is an uncompressed Ethereum public key.
        // This will give the last 20 bytes after Keccak256 hashing, which is the Ethereum address.
        // address expectedAddress = address(uint160(uint256(keccak256(abi.encodePacked(hex"04f711b5cb431bfe68d084eb3fdb4c2e24339b5d8fe634ceb741a53a7767aa346449c36b0559aba42426dc7374404f200fcdeb569ba90fd5909d99e959be975181")))));
        address expectedAddress = 0x8597aC31F04Ee5BB40D497F15d1225533B8414f0;

        // Assert the recovered address is the same as the expected address
        assert(recovered == expectedAddress);
    }


}
