#!/bin/bash

# ChessFlip Deployment Script for Celo
# This script helps you deploy the ChessFlip contract to Celo Sepolia testnet

set -e  # Exit on error

echo "========================================="
echo "ChessFlip Celo Deployment Helper"
echo "========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file and add your PRIVATE_KEY"
    echo "   nano .env"
    echo ""
    exit 1
fi

# Source the .env file
source .env

# Check if PRIVATE_KEY is set
if [ "$PRIVATE_KEY" = "your_private_key_here" ] || [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not configured!"
    echo ""
    echo "Please edit .env file and add your private key:"
    echo "   nano .env"
    echo ""
    echo "⚠️  WARNING: Never commit your private key to git!"
    exit 1
fi

echo "Configuration loaded ✅"
echo ""

# Ask which network to deploy to
echo "Select network:"
echo "1) Celo Sepolia Testnet (recommended for testing)"
echo "2) Celo Mainnet (production)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        NETWORK="celo_sepolia"
        NETWORK_NAME="Celo Sepolia Testnet"
        CHAIN_ID="11142220"
        EXPLORER="celo-sepolia.blockscout.com"
        ;;
    2)
        NETWORK="celo_mainnet"
        NETWORK_NAME="Celo Mainnet"
        CHAIN_ID="42220"
        EXPLORER="celo.blockscout.com"
        read -p "⚠️  Are you sure you want to deploy to MAINNET? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Deployment cancelled."
            exit 0
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo "Deployment Configuration"
echo "========================================="
echo "Network: $NETWORK_NAME"
echo "Chain ID: $CHAIN_ID"
echo "Explorer: https://$EXPLORER"
echo "========================================="
echo ""

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not installed!"
    echo ""
    echo "Install Foundry:"
    echo "   curl -L https://foundry.paradigm.xyz | bash"
    echo "   foundryup"
    exit 1
fi

echo "Running pre-deployment checks..."
echo ""

# Build the contract
echo "📦 Building contract..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Dry run first
echo "🔍 Running deployment simulation (dry run)..."
forge script script/DeployChessFlip.s.sol:DeployChessFlip --rpc-url $NETWORK

if [ $? -ne 0 ]; then
    echo "❌ Simulation failed!"
    exit 1
fi

echo ""
echo "✅ Simulation successful"
echo ""

# Ask for confirmation
read -p "Deploy to $NETWORK_NAME? (yes/no): " deploy_confirm

if [ "$deploy_confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🚀 Deploying to $NETWORK_NAME..."
echo ""

# Deploy with broadcast
forge script script/DeployChessFlip.s.sol:DeployChessFlip \
    --rpc-url $NETWORK \
    --broadcast \
    --verify \
    -vvvv

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "🎉 Deployment Successful!"
    echo "========================================="
    echo ""
    echo "Check the output above for your contract address."
    echo ""
    echo "Next steps:"
    echo "1. Copy the contract address"
    echo "2. Add to frontend/.env.local:"
    echo "   cd ../frontend"
    echo "   echo 'VITE_CHESSFLIP_CONTRACT_ADDRESS=0xYourAddress' >> .env.local"
    echo ""
    echo "3. Test on block explorer:"
    echo "   https://$EXPLORER"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "- Insufficient CELO for gas fees"
    echo "- Wrong network selected"
    echo "- RPC endpoint issues"
    echo ""
    echo "Get testnet CELO: https://faucet.celo.org/"
    echo ""
    exit 1
fi
