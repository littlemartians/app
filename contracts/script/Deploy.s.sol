// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import { Script } from "forge-std/Script.sol";
import { EdenLivemint } from "../src/EdenLivemint.sol";

contract Deploy is Script {
    address internal initialOwner = vm.envAddress("INITIAL_OWNER");
    EdenLivemint internal _edenLivemint;

    function run() public {
        vm.startBroadcast();
        _edenLivemint = new EdenLivemint("EdenLivemint", "EDEN", initialOwner);
        vm.stopBroadcast();
    }
}
