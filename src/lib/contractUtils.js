import { ethers } from "ethers"
import { getEVMProvider } from './evmWalletUtils'
import { getNetworkConfig, getBlockchainConfig } from './networks'

// Contract ABI - No registration required, anyone can use all functions
export const WALLET_MANAGER_ABI = [
    // Events
    "event TransferExecuted(address indexed from, address indexed to, uint256 amount, uint256 timestamp, bytes32 indexed transactionId)",

    // Main Functions
    "function sendETH(address payable to) external payable",
    "function getWalletBalance(address wallet) external view returns (uint256)",
    "function getTransactionHistory(address wallet, uint256 limit) external view returns (tuple(address from, address to, uint256 amount, uint256 timestamp, bytes32 transactionId, bool isIncoming)[])",
    "function getTransactionCount(address wallet) external view returns (uint256)",
    "function getContractInfo() external view returns (address, uint256)",
    "function updateWalletBalance(address wallet) external",

    // Additional utility functions
    "function getMultipleBalances(address[] calldata wallets) external view returns (uint256[])",
    "function getTransactionByIndex(address wallet, uint256 index) external view returns (tuple(address from, address to, uint256 amount, uint256 timestamp, bytes32 transactionId, bool isIncoming))",
    "function hasContractBalance() external view returns (bool)",
    "function getContractStats() external view returns (uint256, uint256, uint256)",

    // View functions
    "function walletBalances(address) external view returns (uint256)",
    "function owner() external view returns (address)"
]

// Contract address from environment variable
export const WALLET_MANAGER_ADDRESS = import.meta.env.VITE_WALLET_MANAGER_CONTRACT_ADDRESS || "0xd1d8344642d3dEFa36167f48f90E0D5a557A80b3"

/**
 * Get contract instance
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - Optional private key for write operations
 * @returns {ethers.Contract} Contract instance
 */
export const getWalletManagerContract = (blockchain, network, privateKey = null) => {
    try {
        if (!WALLET_MANAGER_ADDRESS) {
            throw new Error("Contract address not configured. Please set VITE_WALLET_MANAGER_CONTRACT_ADDRESS in your .env file")
        }

        const provider = getEVMProvider(blockchain, network)
        if (!provider) {
            throw new Error("Failed to create provider")
        }

        if (privateKey) {
            const wallet = new ethers.Wallet(privateKey, provider)
            return new ethers.Contract(WALLET_MANAGER_ADDRESS, WALLET_MANAGER_ABI, wallet)
        } else {
            return new ethers.Contract(WALLET_MANAGER_ADDRESS, WALLET_MANAGER_ABI, provider)
        }
    } catch (error) {
        console.error("Error creating contract instance:", error)
        throw error
    }
}



/**
 * Get wallet balance through contract
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<string>} Balance in ETH
 */
export const getContractWalletBalance = async (blockchain, network, address) => {
    try {
        const contract = getWalletManagerContract(blockchain, network)
        const balanceWei = await contract.getWalletBalance(address)
        return ethers.formatEther(balanceWei)
    } catch (error) {
        console.error("Error fetching contract balance:", error)
        throw error
    }
}

/**
 * Send ETH through the contract (no registration required)
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The sender's private key
 * @param {string} to - The recipient address
 * @param {string} amount - The amount in ETH
 * @returns {Promise<Object>} Transaction response
 */
export const sendETHThroughContract = async (blockchain, network, privateKey, to, amount) => {
    try {
        const contract = getWalletManagerContract(blockchain, network, privateKey)
        const amountWei = ethers.parseEther(amount)

        // Get the sender address
        const wallet = new ethers.Wallet(privateKey)
        const from = wallet.address

        // Send the transaction
        const tx = await contract.sendETH(to, { value: amountWei })

        // Store transaction details with real hash for immediate display
        const txDetails = {
            from: from,
            to: to,
            amount: amount,
            timestamp: Math.floor(Date.now() / 1000),
            hash: tx.hash, // This is the real blockchain transaction hash
            isIncoming: false
        }

        // Store for sender
        storeContractTransaction(blockchain, network, from, txDetails)

        // Store for recipient (as incoming)
        const recipientTxDetails = {
            ...txDetails,
            isIncoming: true
        }
        storeContractTransaction(blockchain, network, to, recipientTxDetails)

        return tx
    } catch (error) {
        console.error("Error sending ETH through contract:", error)
        throw error
    }
}

/**
 * Store contract transaction details in localStorage
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {Object} txDetails - Transaction details
 */
const storeContractTransaction = (blockchain, network, address, txDetails) => {
    try {
        const storageKey = `contract_tx_history_${blockchain}_${network}_${address}`
        const existingTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')

        // Check if transaction already exists (avoid duplicates)
        const exists = existingTxs.some(tx =>
            tx.hash === txDetails.hash ||
            (Math.abs(tx.timestamp - txDetails.timestamp) < 5 && // Within 5 seconds
                tx.from.toLowerCase() === txDetails.from.toLowerCase() &&
                tx.to.toLowerCase() === txDetails.to.toLowerCase() &&
                Math.abs(parseFloat(tx.amount) - parseFloat(txDetails.amount)) < 0.000001)
        )

        if (!exists) {
            // Add new transaction at the beginning
            existingTxs.unshift(txDetails)

            // Keep only the last 50 transactions
            if (existingTxs.length > 50) {
                existingTxs.splice(50)
            }

            localStorage.setItem(storageKey, JSON.stringify(existingTxs))
            console.log(`Stored transaction for ${address}:`, txDetails)
        } else {
            console.log(`Transaction already exists for ${address}, skipping duplicate`)
        }
    } catch (error) {
        console.error('Error storing contract transaction:', error)
    }
}

/**
 * Debug function to check what transactions are stored for an address
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 */
export const debugContractTransactions = (blockchain, network, address) => {
    const storageKey = `contract_tx_history_${blockchain}_${network}_${address}`
    const cachedTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')
    console.log(`Debug: ${cachedTxs.length} transactions stored for ${address}:`, cachedTxs)
    return cachedTxs
}

/**
 * Get transaction history using Alchemy API (for contract mode)
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {number} limit - Maximum number of transactions (0 for all)
 * @returns {Promise<Array>} Array of transactions with real blockchain hashes
 */
export const getContractTransactionHistory = async (blockchain, network, address, limit = 50) => {
    try {
        // PRIORITY 1: Get cached contract transactions (these have real hashes and are immediate)
        const storageKey = `contract_tx_history_${blockchain}_${network}_${address}`
        const cachedTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')

        console.log(`Found ${cachedTxs.length} cached transactions for ${address}`)

        // PRIORITY 2: Try to get additional transactions from Alchemy (for external transactions)
        let alchemyTxs = []
        try {
            const networkConfig = getNetworkConfig(blockchain, network)
            if (networkConfig?.rpcUrl && networkConfig.rpcUrl.includes('alchemy.com')) {
                const rpcUrl = networkConfig.rpcUrl

                const [sentResponse, receivedResponse] = await Promise.all([
                    // Sent transactions
                    fetch(rpcUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: 1,
                            jsonrpc: '2.0',
                            method: 'alchemy_getAssetTransfers',
                            params: [{
                                fromBlock: '0x0',
                                toBlock: 'latest',
                                fromAddress: address,
                                category: ['external'],
                                withMetadata: true,
                                excludeZeroValue: false,
                                maxCount: '0x32' // 50 transactions
                            }]
                        })
                    }),
                    // Received transactions
                    fetch(rpcUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: 2,
                            jsonrpc: '2.0',
                            method: 'alchemy_getAssetTransfers',
                            params: [{
                                fromBlock: '0x0',
                                toBlock: 'latest',
                                toAddress: address,
                                category: ['external'],
                                withMetadata: true,
                                excludeZeroValue: false,
                                maxCount: '0x32' // 50 transactions
                            }]
                        })
                    })
                ])

                const [sentData, receivedData] = await Promise.all([
                    sentResponse.json(),
                    receivedResponse.json()
                ])

                // Process Alchemy transactions if successful
                if (!sentData.error && !receivedData.error) {
                    // Process sent transactions
                    if (sentData.result?.transfers) {
                        sentData.result.transfers.forEach(tx => {
                            alchemyTxs.push({
                                from: tx.from,
                                to: tx.to,
                                amount: tx.value || '0',
                                timestamp: new Date(tx.metadata.blockTimestamp).getTime() / 1000,
                                hash: tx.hash,
                                isIncoming: false
                            })
                        })
                    }

                    // Process received transactions
                    if (receivedData.result?.transfers) {
                        receivedData.result.transfers.forEach(tx => {
                            alchemyTxs.push({
                                from: tx.from,
                                to: tx.to,
                                amount: tx.value || '0',
                                timestamp: new Date(tx.metadata.blockTimestamp).getTime() / 1000,
                                hash: tx.hash,
                                isIncoming: true
                            })
                        })
                    }
                }
            }
        } catch (alchemyError) {
            console.log("Alchemy fetch failed, using cache only:", alchemyError.message)
        }

        // Combine cached and Alchemy transactions, prioritizing cached ones
        const allTxs = [...cachedTxs]

        // Add Alchemy transactions that aren't already in cache
        alchemyTxs.forEach(alchemyTx => {
            const existsInCache = cachedTxs.some(cached =>
                cached.hash === alchemyTx.hash ||
                (Math.abs(cached.timestamp - alchemyTx.timestamp) < 10 && // Within 10 seconds
                    cached.from.toLowerCase() === alchemyTx.from.toLowerCase() &&
                    cached.to.toLowerCase() === alchemyTx.to.toLowerCase())
            )

            if (!existsInCache) {
                allTxs.push(alchemyTx)
            }
        })

        console.log(`Total transactions found: ${allTxs.length} (${cachedTxs.length} cached + ${alchemyTxs.length} from Alchemy)`)

        // Sort by timestamp (most recent first) and limit
        return allTxs
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)

    } catch (error) {
        console.error("Error fetching contract transaction history:", error)

        // Final fallback to cached transactions only
        const storageKey = `contract_tx_history_${blockchain}_${network}_${address}`
        const cachedTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')
        return cachedTxs.slice(0, limit)
    }
}

/**
 * Get transaction count for a wallet
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Promise<number>} Transaction count
 */
export const getContractTransactionCount = async (blockchain, network, address) => {
    try {
        const contract = getWalletManagerContract(blockchain, network)
        const count = await contract.getTransactionCount(address)
        return Number(count)
    } catch (error) {
        console.error("Error fetching transaction count:", error)
        throw error
    }
}

/**
 * Update wallet balance cache in contract
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {string} privateKey - Optional private key for gas payment
 * @returns {Promise<Object>} Transaction response
 */
export const updateContractWalletBalance = async (blockchain, network, address, privateKey = null) => {
    try {
        const contract = getWalletManagerContract(blockchain, network, privateKey)
        const tx = await contract.updateWalletBalance(address)
        return tx
    } catch (error) {
        console.error("Error updating wallet balance:", error)
        throw error
    }
}

/**
 * Get contract information
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @returns {Promise<Object>} Contract info
 */
export const getContractInfo = async (blockchain, network) => {
    try {
        const contract = getWalletManagerContract(blockchain, network)
        const [owner, balance] = await contract.getContractInfo()
        return {
            owner,
            balance: ethers.formatEther(balance),
            address: WALLET_MANAGER_ADDRESS
        }
    } catch (error) {
        console.error("Error fetching contract info:", error)
        throw error
    }
}

/**
 * Register wallet for another address (useful for testing)
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The private key of the registering wallet
 * @param {string} walletAddress - The address to register
 * @returns {Promise<Object>} Transaction response
 */
export const registerWalletFor = async (blockchain, network, privateKey, walletAddress) => {
    try {
        const contract = getWalletManagerContract(blockchain, network, privateKey)
        const tx = await contract.registerWalletFor(walletAddress)
        return tx
    } catch (error) {
        console.error("Error registering wallet for address:", error)
        throw error
    }
}

/**
 * Get multiple wallet balances at once
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string[]} addresses - Array of wallet addresses
 * @returns {Promise<string[]>} Array of balances in ETH
 */
export const getMultipleWalletBalances = async (blockchain, network, addresses) => {
    try {
        const contract = getWalletManagerContract(blockchain, network)
        const balancesWei = await contract.getMultipleBalances(addresses)
        return balancesWei.map(balance => ethers.formatEther(balance))
    } catch (error) {
        console.error("Error fetching multiple balances:", error)
        throw error
    }
}

/**
 * Get a specific transaction by index
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {number} index - Transaction index (0 = most recent)
 * @returns {Promise<Object>} Transaction details
 */
export const getContractTransactionByIndex = async (blockchain, network, address, index) => {
    try {
        const contract = getWalletManagerContract(blockchain, network)
        const tx = await contract.getTransactionByIndex(address, index)

        return {
            from: tx.from,
            to: tx.to,
            amount: ethers.formatEther(tx.amount),
            timestamp: Number(tx.timestamp),
            transactionId: tx.transactionId,
            isIncoming: tx.isIncoming,
            hash: tx.transactionId
        }
    } catch (error) {
        console.error("Error fetching transaction by index:", error)
        throw error
    }
}