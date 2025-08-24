import { ethers } from "ethers"
import { getEVMProvider } from './evmWalletUtils'

// WalletX Escrow Contract ABI - Latest version with escrow functionality
export const WALLETX_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "at",
				"type": "uint256"
			}
		],
		"name": "Claimed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "createEscrow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EscrowCreated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "escrowCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum WalletX.EscrowStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refundedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "getEscrowDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum WalletX.EscrowStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refundedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getPendingActions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "claimable",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "refundable",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserReceivedEscrows",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserSentEscrows",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "at",
				"type": "uint256"
			}
		],
		"name": "Refunded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "receivedEscrows",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sentEscrows",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Contract address configuration with environment variable support
export const getWalletXContractAddress = () => {
	// Try to get from environment variable first
	const envAddress = import.meta.env.VITE_WALLETX_CONTRACT_ADDRESS
	if (envAddress && ethers.isAddress(envAddress)) {
		return envAddress
	}
	
	// Fallback to hardcoded address
	const fallbackAddress = "0x60Dfc970af7409EEEB7520C5DF2dfD7E89734790"
	
	if (!ethers.isAddress(fallbackAddress)) {
		throw new Error("Invalid WalletX contract address configuration")
	}
	
	console.log("Using WalletX contract address:", fallbackAddress)
	return fallbackAddress
}

// Legacy export for backward compatibility
export const WALLETX_CONTRACT_ADDRESS = getWalletXContractAddress()

// Escrow status enum
export const EscrowStatus = {
    PENDING: 0,
    CLAIMED: 1,
    REFUNDED: 2
}

/**
 * Get WalletX contract instance with proper validation
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - Optional private key for write operations
 * @returns {ethers.Contract} Contract instance
 */
export const getWalletXContract = (blockchain, network, privateKey = null) => {
    try {
        const contractAddress = getWalletXContractAddress()
        
        const provider = getEVMProvider(blockchain, network)
        if (!provider) {
            throw new Error("Failed to create provider")
        }

        let contractInstance
        if (privateKey) {
            const wallet = new ethers.Wallet(privateKey, provider)
            contractInstance = new ethers.Contract(contractAddress, WALLETX_ABI, wallet)
        } else {
            contractInstance = new ethers.Contract(contractAddress, WALLETX_ABI, provider)
        }

        // Validate contract is properly initialized
        if (!contractInstance) {
            throw new Error("Failed to create contract instance")
        }

        return contractInstance
    } catch (error) {
        console.error("Error creating WalletX contract instance:", error)
        throw error
    }
}

/**
 * Validate contract connectivity
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @returns {Promise<boolean>} True if contract is accessible
 */
export const validateContractConnectivity = async (blockchain, network) => {
    try {
        const contract = getWalletXContract(blockchain, network)
        
        // Try to call a simple read-only function to verify connectivity
        await contract.escrowCount()
        return true
    } catch (error) {
        console.error("Contract validation failed:", error)
        return false
    }
}