// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ChessFlip} from "../src/ChessFlip.sol";

/**
 * @title DeployChessFlip
 * @notice Deployment script for ChessFlip contract on Celo networks
 * 
 * Usage:
 * 
 * Deploy to Celo Sepolia Testnet:
 * forge script script/DeployChessFlip.s.sol:DeployChessFlip --rpc-url celo_sepolia --broadcast --verify -vvvv
 * 
 * Deploy to Celo Mainnet:
 * forge script script/DeployChessFlip.s.sol:DeployChessFlip --rpc-url celo_mainnet --broadcast --verify -vvvv
 * 
 * Dry run (no broadcast):
 * forge script script/DeployChessFlip.s.sol:DeployChessFlip --rpc-url celo_sepolia
 */
contract DeployChessFlip is Script {
    // cUSD Token Addresses
    address constant CUSD_SEPOLIA = 0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b;
    address constant CUSD_MAINNET = 0x765DE816845861e75A25fCA122bb6898B8B1282a;

    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get chain ID to determine which cUSD address to use
        uint256 chainId = block.chainid;
        address cUSDAddress;
        string memory networkName;

        if (chainId == 11142220) {
            // Celo Sepolia Testnet
            cUSDAddress = CUSD_SEPOLIA;
            networkName = "Celo Sepolia Testnet";
        } else if (chainId == 42220) {
            // Celo Mainnet
            cUSDAddress = CUSD_MAINNET;
            networkName = "Celo Mainnet";
        } else {
            revert("Unsupported network. Use Celo Sepolia (11142220) or Celo Mainnet (42220)");
        }

        address deployer = vm.addr(deployerPrivateKey);

        console.log("========================================");
        console.log("Deploying ChessFlip Contract");
        console.log("========================================");
        console.log("Network:", networkName);
        console.log("Chain ID:", chainId);
        console.log("cUSD Token Address:", cUSDAddress);
        console.log("Deployer:", deployer);
        console.log("Owner (Deployer):", deployer);
        console.log("========================================");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ChessFlip contract with cUSD address and deployer as initial owner
        ChessFlip chessFlip = new ChessFlip(cUSDAddress, deployer);

        vm.stopBroadcast();

        console.log("========================================");
        console.log("Deployment Successful!");
        console.log("========================================");
        console.log("ChessFlip Contract:", address(chessFlip));
        console.log("========================================");
        console.log("");
        console.log("Next Steps:");
        console.log("1. Save the contract address to frontend/.env.local:");
        console.log("   VITE_CHESSFLIP_CONTRACT_ADDRESS=%s", address(chessFlip));
        console.log("");
        console.log("2. Verify contract on block explorer:");
        console.log("   Visit: https://%s.blockscout.com/address/%s", 
            chainId == 11142220 ? "celo-sepolia" : "celo",
            address(chessFlip)
        );
        console.log("");
        console.log("3. Test the contract:");
        console.log("   - Register a player");
        console.log("   - Start a game (requires cUSD approval)");
        console.log("   - Submit game result");
        console.log("   - Claim points");
        console.log("========================================");
    }
}
