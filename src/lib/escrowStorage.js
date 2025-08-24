/**
 * Escrow Storage Module
 * Handles local storage of escrow transaction data
 */

import { EscrowStatus } from './contractConfig'

/**
 * Store escrow transaction details in localStorage
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {Object} escrowDetails - The escrow transaction details
 */
export const storeEscrowTransaction = (blockchain, network, address, escrowDetails) => {
    try {
        const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
        const existingTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')
        
        // Avoid duplicates by checking if transaction already exists
        const isDuplicate = existingTxs.some(tx => 
            tx.hash === escrowDetails.hash || 
            (tx.escrowId === escrowDetails.escrowId && tx.type === escrowDetails.type)
        )
        
        if (!isDuplicate) {
            existingTxs.push(escrowDetails)
            localStorage.setItem(storageKey, JSON.stringify(existingTxs))
            console.log(`Stored escrow transaction for ${address}:`, escrowDetails)
        } else {
            console.log(`Duplicate escrow transaction not stored for ${address}:`, escrowDetails)
        }
    } catch (error) {
        console.error('Error storing escrow transaction:', error)
    }
}

/**
 * Update escrow status in stored transactions
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @param {string} escrowId - The escrow ID
 * @param {number} newStatus - The new status
 * @param {string} transactionHash - The transaction hash
 */
export const updateEscrowStatus = (blockchain, network, address, escrowId, newStatus, transactionHash) => {
    try {
        const storageKey = `escrow_tx_history_${blockchain}_${network}_${address}`
        const existingTxs = JSON.parse(localStorage.getItem(storageKey) || '[]')
        
        const updatedTxs = existingTxs.map(tx => {
            if (tx.escrowId === escrowId) {
                return {
                    ...tx,
                    status: newStatus,
                    lastUpdated: Math.floor(Date.now() / 1000),
                    statusUpdateHash: transactionHash
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
 * @returns {Array} Array of escrow transactions
 */
export const getEscrowTransactionHistory = (blockchain, network, address, limit = 50) => {
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
 * Debug function to check what escrow transactions are stored for an address
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} address - The wallet address
 * @returns {Array} Array of stored transactions
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