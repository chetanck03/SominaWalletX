import { ethers } from "ethers"
import { getEVMProvider } from './evmWalletUtils'
import { getNetworkConfig } from './networks'

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

// Contract address from environment variable
export const WALLETX_CONTRACT_ADDRESS = "0xd1d8344642d3dEFa36167f48f90E0D5a557A80b3"

// Escrow status enum
export const EscrowStatus = {
    PENDING: 0,
    CLAIMED: 1,
    REFUNDED: 2
}

/**
 * Get WalletX contract instance
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - Optional private key for write operations
 * @returns {ethers.Contract} Contract instance
 */
export const getWalletXContract = (blockchain, network, privateKey = null) => {
    try {
        if (!WALLETX_CONTRACT_ADDRESS) {
            throw new Error("WalletX contract address not configured. Please set VITE_WALLETX_CONTRACT_ADDRESS in your .env file")
        }

        const provider = getEVMProvider(blockchain, network)
        if (!provider) {
            throw new Error("Failed to create provider")
        }

        if (privateKey) {
            const wallet = new ethers.Wallet(privateKey, provider)
            return new ethers.Contract(WALLETX_CONTRACT_ADDRESS, WALLETX_ABI, wallet)
        } else {
            return new ethers.Contract(WALLETX_CONTRACT_ADDRESS, WALLETX_ABI, provider)
        }
    } catch (error) {
        console.error("Error creating WalletX contract instance:", error)
        throw error
    }
}



/**
 * Create a new escrow transaction
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The sender's private key
 * @param {string} receiver - The recipient address
 * @param {string} amount - The amount in ETH
 * @param {string} gasLimit - Optional gas limit (defaults to 300000)
 * @returns {Promise<Object>} Transaction response with escrow ID
 */
export const createEscrow = async (blockchain, network, privateKey, receiver, amount, gasLimit = '300000') => {
    try {
        const contract = getWalletXContract(blockchain, network, privateKey)
        const amountWei = ethers.parseEther(amount)
        
        console.log("Creating escrow:", {
            amountWei,
            amount,
            gasLimit,
            receiver,
            privateKey: privateKey.slice(0, 4) + '...' + privateKey.slice(-4)
        })

        // Get the sender address
        const wallet = new ethers.Wallet(privateKey)
        const sender = wallet.address

        // Create escrow transaction
        const tx = await contract.createEscrow(receiver, { 
            value: amountWei,
            gasLimit: parseInt(gasLimit)
        })

        // Wait for transaction receipt to get escrow ID
        const receipt = await tx.wait(1) // Explicitly wait for 1 confirmation
        
        // Find the EscrowCreated event to get the escrow ID
        const escrowCreatedEvent = receipt.logs.find(log => {
            try {
                const parsed = contract.interface.parseLog(log)
                return parsed.name === 'EscrowCreated'
            } catch {
                return false
            }
        })

        let escrowId = null
        if (escrowCreatedEvent) {
            const parsed = contract.interface.parseLog(escrowCreatedEvent)
            escrowId = parsed.args.escrowId.toString()
        }

        // Store escrow transaction details
        const escrowDetails = {
            escrowId,
            from: sender,
            to: receiver,
            amount: amount,
            timestamp: Math.floor(Date.now() / 1000),
            hash: tx.hash,
            status: EscrowStatus.PENDING,
            type: 'escrow_created',
            isIncoming: false
        }

        // Store for sender
        storeEscrowTransaction(blockchain, network, sender, escrowDetails)

        // Store for recipient (as incoming)
        const recipientEscrowDetails = {
            ...escrowDetails,
            isIncoming: true,
            type: 'escrow_received'
        }
        storeEscrowTransaction(blockchain, network, receiver, recipientEscrowDetails)

        // Ensure the returned object has all necessary properties
        const txResponse = {
            ...tx,
            escrowId
        };
        
        // Explicitly define the wait method as a property
        Object.defineProperty(txResponse, 'wait', {
            enumerable: true,
            configurable: true,
            value: async (confirmations = 1) => {
                try {
                    if (tx.wait && typeof tx.wait === 'function') {
                        return await tx.wait(confirmations);
                    } else {
                        // Fallback if wait is not available
                        console.log('Using fallback waitForTransaction method in contractUtils');
                        const provider = getEVMProvider(blockchain, network);
                        if (!provider) {
                            throw new Error('Failed to create provider for transaction wait');
                        }
                        return await provider.waitForTransaction(tx.hash, confirmations);
                    }
                } catch (error) {
                    console.error("Error waiting for transaction:", error);
                    throw error;
                }
            }
        });
        
        return txResponse
    } catch (error) {
        console.error("Error creating escrow:", error)
        throw error
    }
}

/**
 * Claim an escrow
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The receiver's private key
 * @param {string} escrowId - The escrow ID to claim
 * @param {string} gasLimit - Optional gas limit (defaults to 200000)
 * @returns {Promise<Object>} Transaction response
 */
export const claimEscrow = async (blockchain, network, privateKey, escrowId, gasLimit = '200000') => {
    try {
        const contract = getWalletXContract(blockchain, network, privateKey)
        
        console.log("Claiming escrow:", { escrowId, gasLimit })

        const tx = await contract.claim(escrowId, {
            gasLimit: parseInt(gasLimit)
        })

        // Update stored transaction status
        const wallet = new ethers.Wallet(privateKey)
        const receiver = wallet.address
        
        updateEscrowStatus(blockchain, network, receiver, escrowId, EscrowStatus.CLAIMED, tx.hash)

        // Ensure the returned object has all necessary properties
        const txResponse = {
            ...tx
        };
        
        // Explicitly define the wait method as a property
        Object.defineProperty(txResponse, 'wait', {
            enumerable: true,
            configurable: true,
            value: async (confirmations = 1) => {
                try {
                    if (tx.wait && typeof tx.wait === 'function') {
                        return await tx.wait(confirmations);
                    } else {
                        // Fallback if wait is not available
                        console.log('Using fallback waitForTransaction method in contractUtils');
                        const provider = getEVMProvider(blockchain, network);
                        if (!provider) {
                            throw new Error('Failed to create provider for transaction wait');
                        }
                        return await provider.waitForTransaction(tx.hash, confirmations);
                    }
                } catch (error) {
                    console.error("Error waiting for transaction:", error);
                    throw error;
                }
            }
        });
        
        return txResponse
    } catch (error) {
        console.error("Error claiming escrow:", error)
        throw error
    }
}

/**
 * Refund an escrow
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The sender's private key
 * @param {string} escrowId - The escrow ID to refund
 * @param {string} gasLimit - Optional gas limit (defaults to 200000)
 * @returns {Promise<Object>} Transaction response
 */
export const refundEscrow = async (blockchain, network, privateKey, escrowId, gasLimit = '200000') => {
    try {
        const contract = getWalletXContract(blockchain, network, privateKey)
        
        console.log("Refunding escrow:", { escrowId, gasLimit })

        const tx = await contract.refund(escrowId, {
            gasLimit: parseInt(gasLimit)
        })

        // Update stored transaction status
        const wallet = new ethers.Wallet(privateKey)
        const sender = wallet.address
        
        updateEscrowStatus(blockchain, network, sender, escrowId, EscrowStatus.REFUNDED, tx.hash)

        // Ensure the returned object has all necessary properties
        const txResponse = {
            ...tx
        };
        
        // Explicitly define the wait method as a property
        Object.defineProperty(txResponse, 'wait', {
            enumerable: true,
            configurable: true,
            value: async (confirmations = 1) => {
                try {
                    if (tx.wait && typeof tx.wait === 'function') {
                        return await tx.wait(confirmations);
                    } else {
                        // Fallback if wait is not available
                        console.log('Using fallback waitForTransaction method in contractUtils');
                        const provider = getEVMProvider(blockchain, network);
                        if (!provider) {
                            throw new Error('Failed to create provider for transaction wait');
                        }
                        return await provider.waitForTransaction(tx.hash, confirmations);
                    }
                } catch (error) {
                    console.error("Error waiting for transaction:", error);
                    throw error;
                }
            }
        });
        
        return txResponse
    } catch (error) {
        console.error("Error refunding escrow:", error)
        throw error
    }
}

/**
 * Store escrow transaction details in localStorage
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {Object} escrowDetails - Escrow transaction details
 */
const storeEscrowTransaction = (blockchain, network, address, escrowDetails) => {
    try {
        const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
        const existingTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')

        // Check if transaction already exists (avoid duplicates)
        const exists = existingTxs.some(tx =>
            tx.hash === escrowDetails.hash ||
            (tx.escrowId && tx.escrowId === escrowDetails.escrowId) ||
            (Math.abs(tx.timestamp - escrowDetails.timestamp) < 5 && // Within 5 seconds
                tx.from.toLowerCase() === escrowDetails.from.toLowerCase() &&
                tx.to.toLowerCase() === escrowDetails.to.toLowerCase() &&
                Math.abs(parseFloat(tx.amount) - parseFloat(escrowDetails.amount)) < 0.000001)
        )

        if (!exists) {
            // Add new transaction at the beginning
            existingTxs.unshift(escrowDetails)

            // Keep only the last 100 transactions
            if (existingTxs.length > 100) {
                existingTxs.splice(100)
            }

            localStorage.setItem(storageKey, JSON.stringify(existingTxs))
            console.log(`Stored escrow transaction for ${address}:`, escrowDetails)
        } else {
            console.log(`Escrow transaction already exists for ${address}, skipping duplicate`)
        }
    } catch (error) {
        console.error('Error storing escrow transaction:', error)
    }
}

/**
 * Update escrow status in localStorage
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {string} escrowId - The escrow ID
 * @param {number} newStatus - The new status
 * @param {string} actionHash - The transaction hash of the action
 */
const updateEscrowStatus = (blockchain, network, address, escrowId, newStatus, actionHash) => {
    try {
        const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
        const existingTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')

        // Find and update the escrow transaction
        const updatedTxs = existingTxs.map(tx => {
            if (tx.escrowId === escrowId) {
                return {
                    ...tx,
                    status: newStatus,
                    actionHash: actionHash,
                    actionTimestamp: Math.floor(Date.now() / 1000),
                    type: newStatus === EscrowStatus.CLAIMED ? 'escrow_claimed' : 'escrow_refunded'
                }
            }
            return tx
        })

        localStorage.setItem(storageKey, JSON.stringify(updatedTxs))
        console.log(`Updated escrow ${escrowId} status to ${newStatus} for ${address}`)
    } catch (error) {
        console.error('Error updating escrow status:', error)
    }
}

/**
 * Get escrow transaction history for a user
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {number} limit - Maximum number of transactions (0 for all)
 * @returns {Promise<Array>} Array of escrow transactions
 */
export const getEscrowTransactionHistory = async (blockchain, network, address, limit = 50) => {
    try {
        // Get cached escrow transactions
        const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
        const cachedTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')

        console.log(`Found ${cachedTxs.length} cached escrow transactions for ${address}`)

        // Sort by timestamp (most recent first) and limit
        return cachedTxs
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)

    } catch (error) {
        console.error("Error fetching escrow transaction history:", error)
        return []
    }
}

/**
 * Get user's sent escrows from contract
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<Array>} Array of sent escrow IDs
 */
export const getUserSentEscrows = async (blockchain, network, address) => {
    try {
        console.log(`Fetching sent escrows for ${address} on ${blockchain}:${network}`)
        const contract = getWalletXContract(blockchain, network)
        
        if (!contract) {
            throw new Error('Failed to create contract instance')
        }
        
        console.log('Calling contract.getUserSentEscrows with address:', address)
        const escrowIds = await contract.getUserSentEscrows(address)
        console.log('getUserSentEscrows raw result:', escrowIds)
        
        if (!Array.isArray(escrowIds)) {
            console.warn('Unexpected result structure from getUserSentEscrows:', escrowIds)
            return []
        }
        
        const result = escrowIds.map(id => id.toString())
        console.log('Processed sent escrow IDs:', result)
        return result
    } catch (error) {
        console.error("Error fetching sent escrows:", error)
        return []
    }
}

/**
 * Get user's received escrows from contract
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<Array>} Array of received escrow IDs
 */
export const getUserReceivedEscrows = async (blockchain, network, address) => {
    try {
        console.log(`Fetching received escrows for ${address} on ${blockchain}:${network}`)
        const contract = getWalletXContract(blockchain, network)
        
        if (!contract) {
            throw new Error('Failed to create contract instance')
        }
        
        console.log('Calling contract.getUserReceivedEscrows with addres:', address)
        const escrowIds = await contract.getUserReceivedEscrows(address)
        console.log('getUserReceivedEscrows raw result:', escrowIds)
        
        if (!Array.isArray(escrowIds)) {
            console.warn('Unexpected result structure from getUserReceivedEscrows:', escrowIds)
            return []
        }
        
        const result = escrowIds.map(id => id.toString())
        console.log('Processed received escrow IDs:', result)
        return result
    } catch (error) {
        console.error("Error fetching received escrows:", error)
        return []
    }
}

/**
 * Get pending actions for a user (claimable and refundable escrows)
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<Object>} Object with claimable and refundable arrays
 */
export const getPendingActions = async (blockchain, network, address) => {
    try {
        console.log(`Fetching pending actions for ${address} on ${blockchain}:${network}`)
        const contract = getWalletXContract(blockchain, network)
        
        if (!contract) {
            throw new Error('Failed to create contract instance')
        }
        
        // Try to get pending actions from contract
        try {
            console.log('Calling contract.getPendingActions with address:', address)
            const result = await contract.getPendingActions(address)
            console.log('getPendingActions raw result:', result)
            
            // Ensure we have the expected structure
            if (Array.isArray(result) && result.length === 2) {
                const [claimable, refundable] = result
                
                console.log('Pending actions fetched successfully:', {
                    claimable: claimable.map(id => id.toString()),
                    refundable: refundable.map(id => id.toString())
                })
                
                return {
                    claimable: claimable.map(id => id.toString()),
                    refundable: refundable.map(id => id.toString())
                }
            } else {
                console.warn('Unexpected result structure from getPendingActions:', result)
                throw new Error('Unexpected result structure from contract')
            }
        } catch (contractError) {
            console.warn("Contract getPendingActions failed, falling back to manual check:", contractError)
            
            // Fallback: Manually check sent and received escrows
            console.log('Using fallback method to check pending actions')
            const sentIds = await getUserSentEscrows(blockchain, network, address)
            const receivedIds = await getUserReceivedEscrows(blockchain, network, address)
            
            console.log('Received escrow IDs:', receivedIds)
            console.log('Sent escrow IDs:', sentIds)
            
            const claimable = []
            const refundable = []
            
            // Check each received escrow to see if it's claimable
            for (const id of receivedIds) {
                try {
                    const details = await getEscrowDetails(blockchain, network, id)
                    if (details && details.status === EscrowStatus.PENDING) {
                        claimable.push(id)
                    }
                } catch (e) {
                    console.error(`Error checking escrow ${id}:`, e)
                }
            }
            
            // Check each sent escrow to see if it's refundable
            for (const id of sentIds) {
                try {
                    const details = await getEscrowDetails(blockchain, network, id)
                    if (details && details.status === EscrowStatus.PENDING) {
                        refundable.push(id)
                    }
                } catch (e) {
                    console.error(`Error checking escrow ${id}:`, e)
                }
            }
            
            console.log('Fallback method results:', { claimable, refundable })
            return { claimable, refundable }
        }
    } catch (error) {
        console.error("Error fetching pending actions:", error)
        return { claimable: [], refundable: [] }
    }
}

/**
 * Get detailed escrow information
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} escrowId - The escrow ID
 * @returns {Promise<Object>} Escrow details
 */
export const getEscrowDetails = async (blockchain, network, escrowId) => {
    try {
        const contract = getWalletXContract(blockchain, network)
        const [sender, receiver, amount, status, createdAt, claimedAt, refundedAt] = await contract.getEscrowDetails(escrowId)
        
        return {
            escrowId,
            sender,
            receiver,
            amount: ethers.formatEther(amount),
            status: Number(status),
            createdAt: Number(createdAt),
            claimedAt: Number(claimedAt),
            refundedAt: Number(refundedAt)
        }
    } catch (error) {
        console.error("Error fetching escrow details:", error)
        return null
    }
}

/**
 * Get total escrow count from contract
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @returns {Promise<number>} Total escrow count
 */
export const getEscrowCount = async (blockchain, network) => {
    try {
        const contract = getWalletXContract(blockchain, network)
        const count = await contract.escrowCount()
        return Number(count)
    } catch (error) {
        console.error("Error fetching escrow count:", error)
        return 0
    }
}

/**
 * Get escrow status text
 * @param {number} status - Status number
 * @returns {string} Status text
 */
export const getEscrowStatusText = (status) => {
    switch (status) {
        case EscrowStatus.PENDING:
            return 'Pending'
        case EscrowStatus.CLAIMED:
            return 'Claimed'
        case EscrowStatus.REFUNDED:
            return 'Refunded'
        default:
            return 'Unknown'
    }
}

/**
 * Get escrow status color for UI
 * @param {number} status - Status number
 * @returns {string} CSS color class
 */
export const getEscrowStatusColor = (status) => {
    switch (status) {
        case EscrowStatus.PENDING:
            return 'text-yellow-400 bg-yellow-600/20 border-yellow-600/30'
        case EscrowStatus.CLAIMED:
            return 'text-green-400 bg-green-600/20 border-green-600/30'
        case EscrowStatus.REFUNDED:
            return 'text-red-400 bg-red-600/20 border-red-600/30'
        default:
            return 'text-gray-400 bg-gray-600/20 border-gray-600/30'
    }
}

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'N/A'
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Debug function to check what escrow transactions are stored for an address
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 */
export const debugEscrowTransactions = (blockchain, network, address) => {
    const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
    const cachedTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')
    console.log(`Debug: ${cachedTxs.length} escrow transactions stored for ${address}:`, cachedTxs)
    return cachedTxs
}

/**
 * Clear all escrow transaction history for an address
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 */
export const clearEscrowHistory = (blockchain, network, address) => {
    try {
        const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
        localStorage.removeItem(storageKey)
        console.log(`Cleared escrow history for ${address}`)
    } catch (error) {
        console.error('Error clearing escrow history:', error)
    }
}

// Legacy function for backward compatibility - now redirects to escrow history
export const getContractTransactionHistory = async (blockchain, network, address, limit = 50) => {
    console.warn('getContractTransactionHistory is deprecated, use getEscrowTransactionHistory instead')
    return getEscrowTransactionHistory(blockchain, network, address, limit)
}

// Legacy exports for backward compatibility
export const WALLET_MANAGER_ADDRESS = WALLETX_CONTRACT_ADDRESS

// Legacy functions that redirect to basic EVM operations
export const getContractWalletBalance = async (blockchain, network, address) => {
    // For backward compatibility, just get regular EVM balance
    const { getEVMBalance } = await import('./evmWalletUtils')
    return getEVMBalance(blockchain, network, address)
}

export const sendETHThroughContract = async (blockchain, network, privateKey, to, amount, gasLimit = '300000') => {
    // For backward compatibility, use regular EVM transaction
    const { sendEVMTransaction } = await import('./evmWalletUtils')
    return sendEVMTransaction(blockchain, network, privateKey, to, amount, gasLimit)
}