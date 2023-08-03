// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import { Script } from "forge-std/Script.sol";
import { LittleMartians } from "../src/LittleMartians.sol";

contract Deploy is Script {
    address internal initialOwner = vm.envAddress("INITIAL_OWNER");
    LittleMartians internal _littleMartians;

    function run() public {
        vm.startBroadcast();
        _littleMartians = new LittleMartians("LittleMartians", "LITTLEMARTIANS", initialOwner);
        vm.stopBroadcast();
    }
}