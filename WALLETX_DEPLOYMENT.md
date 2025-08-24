# WalletX Escrow Contract Deployment Guide

## Overview
This guide will help you deploy the WalletX escrow smart contract and integrate it with your wallet application.

## Prerequisites
- Node.js and npm installed
- Hardhat or Remix IDE
- Somnia testnet ETH for deployment
- MetaMask or similar wallet

## Contract Deployment

### Option 1: Using Remix IDE (Recommended for beginners)

1. **Open Remix IDE**
   - Go to https://remix.ethereum.org/

2. **Create the Contract File**
   - Create a new file: `contracts/WalletX.sol`
   - Copy the contract code from `contracts/WalletX.sol`

3. **Compile the Contract**
   - Go to the "Solidity Compiler" tab
   - Select compiler version `0.8.20` or higher
   - Click "Compile WalletX.sol"

4. **Deploy to Somnia Testnet**
   - Go to the "Deploy & Run Transactions" tab
   - Set Environment to "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to Somnia Testnet
   - Select "WalletX" contract
   - Click "Deploy"
   - Confirm the transaction in MetaMask

5. **Copy Contract Address**
   - After deployment, copy the contract address from the deployed contracts section

### Option 2: Using Hardhat

1. **Initialize Hardhat Project**
   ```bash
   npm install --save-dev hardhat
   npx hardhat init
   ```

2. **Install Dependencies**
   ```bash
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   ```

3. **Configure Hardhat**
   Create `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   module.exports = {
     solidity: "0.8.20",
     networks: {
       somnia_testnet: {
         url: "https://rpc.ankr.com/somnia_testnet/927d128d8548157e8c3734680403cabda3b4312dda11df480c63c2e0c2dbb8d4",
         accounts: ["YOUR_PRIVATE_KEY_HERE"]
       }
     }
   };
   ```

4. **Create Deployment Script**
   Create `scripts/deploy.js`:
   ```javascript
   async function main() {
     const WalletX = await ethers.getContractFactory("WalletX");
     const walletX = await WalletX.deploy();
     await walletX.deployed();
     console.log("WalletX deployed to:", walletX.address);
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

5. **Deploy Contract**
   ```bash
   npx hardhat run scripts/deploy.js --network somnia_testnet
   ```

## Frontend Integration

### 1. Update Environment Variables

Update your `.env` file:
```env
# WalletX Escrow Smart Contract Address (Somnia Testnet)
VITE_WALLETX_CONTRACT_ADDRESS=0xYourDeployedContractAddress

# Somnia Network Configuration
VITE_SOMNIA_TESTNET_RPC_URL=https://rpc.ankr.com/somnia_testnet/927d128d8548157e8c3734680403cabda3b4312dda11df480c63c2e0c2dbb8d4
```

### 2. Verify Integration

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Test Escrow Functionality**
   - Navigate to a wallet's transaction page
   - You should see the new tabbed interface with:
     - Send Escrow tab
     - Pending Actions tab
     - Transaction History tab

3. **Create Test Escrow**
   - Use the "Send Escrow" tab to create a test escrow
   - Check that the transaction appears in history
   - Verify pending actions show up correctly

## Contract Features

### Core Functions
- `createEscrow(address receiver)` - Create new escrow (payable)
- `claim(uint256 escrowId)` - Claim escrow funds
- `refund(uint256 escrowId)` - Refund escrow funds

### View Functions
- `getEscrowDetails(uint256 escrowId)` - Get escrow information
- `getUserSentEscrows(address user)` - Get user's sent escrows
- `getUserReceivedEscrows(address user)` - Get user's received escrows
- `getPendingActions(address user)` - Get claimable/refundable escrows

### Events
- `EscrowCreated` - Emitted when escrow is created
- `Claimed` - Emitted when escrow is claimed
- `Refunded` - Emitted when escrow is refunded

## Security Considerations

1. **Test Thoroughly**
   - Test all functions on testnet before mainnet deployment
   - Verify claim and refund mechanisms work correctly

2. **Gas Limits**
   - Default gas limit for escrow creation: 300,000
   - Default gas limit for claim/refund: 200,000

3. **Access Control**
   - Only sender can refund pending escrows
   - Only receiver can claim pending escrows
   - No admin functions - fully decentralized

## Troubleshooting

### Common Issues

1. **Contract Address Not Set**
   - Make sure `VITE_WALLETX_CONTRACT_ADDRESS` is set in `.env`
   - Restart the development server after updating `.env`

2. **Transaction Failures**
   - Check gas limits are sufficient
   - Verify wallet has enough ETH for gas fees
   - Ensure correct network (Somnia Testnet)

3. **UI Not Showing Escrow Features**
   - Verify contract address is properly configured
   - Check browser console for errors
   - Ensure you're on a supported network

### Getting Help

1. **Check Contract on Explorer**
   - Visit Somnia Explorer: https://explorer.somnia.network/
   - Search for your contract address
   - Verify deployment and transactions

2. **Debug Transactions**
   - Use browser developer tools
   - Check network requests and console logs
   - Verify contract ABI matches deployed contract

## Next Steps

1. **Deploy to Mainnet** (when ready)
   - Update network configuration
   - Use mainnet RPC URL
   - Deploy with production private key

2. **Add More Features**
   - Time-locked escrows
   - Multi-signature escrows
   - Escrow with dispute resolution

3. **Optimize Gas Usage**
   - Batch operations
   - Optimize contract code
   - Use CREATE2 for deterministic addresses

## Contract Verification

After deployment, verify your contract on the Somnia Explorer:

1. Go to https://explorer.somnia.network/
2. Search for your contract address
3. Click "Verify & Publish" if available
4. Upload the contract source code
5. Set compiler version to match deployment

This helps users verify the contract functionality and builds trust.