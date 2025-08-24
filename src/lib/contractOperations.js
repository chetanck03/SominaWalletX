/**
 * Contract Operations Module
 * Main contract interaction functions for escrow operations
 */

import { ethers } from "ethers"
import { getEVMProvider } from './evmWalletUtils'
import { getWalletXContract, EscrowStatus, validateContractConnectivity } from './contractConfig'
import { storeEscrowTransaction, updateEscrowStatus } from './escrowStorage'
import { 
    validateEscrowParams, 
    validateSufficientBalance, 
    estimateGasWithFallback,
    handleContractError,
    waitForTransactionWithRetry
} from './escrowUtils'

/**
 * Create a new escrow transaction with enhanced validation and error handling
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
        console.log("Creating escrow with validation:", {
            amount,
            gasLimit,
            receiver,
            blockchain,
            network
        })

        // Validate contract connectivity first
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            throw new Error("Cannot connect to WalletX contract. Please check your network connection.")
        }

        // Get sender address
        const wallet = new ethers.Wallet(privateKey)
        const sender = wallet.address

        // Validate escrow parameters
        const paramValidation = await validateEscrowParams(receiver, amount, sender)
        if (!paramValidation.isValid) {
            throw new Error(paramValidation.error)
        }

        // Get current balance for later validation
        const { getEVMBalance } = await import('./evmWalletUtils')
        const balance = await getEVMBalance(blockchain, network, sender)

        // Get contract instance
        const contract = getWalletXContract(blockchain, network, privateKey)
        const amountWei = ethers.parseEther(amount)
        
        // Get current gas price for better validation
        const provider = getEVMProvider(blockchain, network)
        let currentGasPrice
        try {
            const feeData = await provider.getFeeData()
            currentGasPrice = feeData.gasPrice?.toString() || '6000000000' // 6 gwei fallback
        } catch (error) {
            console.warn('Could not get current gas price, using fallback:', error)
            currentGasPrice = '6000000000' // 6 gwei fallback
        }
        
        // Estimate gas with intelligent handling
        const estimatedGas = await estimateGasWithFallback(
            contract, 
            'createEscrow', 
            [receiver], 
            { value: amountWei },
            parseInt(gasLimit)
        )

        // Validate balance with actual gas estimation
        const balanceValidation = validateSufficientBalance(balance, amount, estimatedGas, currentGasPrice)
        if (!balanceValidation.isValid) {
            throw new Error(balanceValidation.error)
        }

        console.log("Creating escrow transaction with gas limit:", estimatedGas)

        // Prepare transaction options
        const txOptions = { 
            value: amountWei,
            gasLimit: estimatedGas
        }
        
        // Add gas price if we have it and it's reasonable
        if (currentGasPrice) {
            const gasPriceNum = parseInt(currentGasPrice)
            // Only set gas price if it's not too high (less than 50 gwei)
            if (gasPriceNum < 50000000000) {
                txOptions.gasPrice = currentGasPrice
                console.log(`Using gas price: ${gasPriceNum / 1e9} gwei`)
            } else {
                console.log(`Gas price too high (${gasPriceNum / 1e9} gwei), letting network decide`)
            }
        }

        // Create escrow transaction
        const tx = await contract.createEscrow(receiver, txOptions)

        console.log("Escrow transaction created:", tx.hash)

        // Wait for transaction receipt with enhanced error handling
        const receipt = await waitForTransactionWithRetry(tx, 1, 'escrow creation')
        
        // Find the EscrowCreated event to get the escrow ID
        let escrowId = null
        for (const log of receipt.logs) {
            try {
                const parsed = contract.interface.parseLog(log)
                if (parsed && parsed.name === 'EscrowCreated') {
                    escrowId = parsed.args.escrowId.toString()
                    console.log("Escrow created with ID:", escrowId)
                    break
                }
            } catch (parseError) {
                // Continue to next log if parsing fails
                continue
            }
        }

        if (!escrowId) {
            console.warn("Could not extract escrow ID from transaction receipt")
            // Try to get the latest escrow count as fallback
            try {
                const escrowCount = await contract.escrowCount()
                escrowId = escrowCount.toString()
                console.log("Using escrow count as fallback ID:", escrowId)
            } catch (countError) {
                console.error("Could not get escrow count:", countError)
            }
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
            isIncoming: false,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
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

        console.log("Escrow creation completed successfully")

        return {
            ...tx,
            escrowId,
            receipt,
            wait: async (confirmations = 1) => {
                return receipt // Already waited for confirmation
            }
        }
    } catch (error) {
        const errorMessage = handleContractError(error, 'create escrow')
        console.error("Error creating escrow:", error)
        throw new Error(errorMessage)
    }
}

/**
 * Claim an escrow with enhanced validation
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The receiver's private key
 * @param {string} escrowId - The escrow ID to claim
 * @param {string} gasLimit - Optional gas limit (defaults to 200000)
 * @returns {Promise<Object>} Transaction response
 */
export const claimEscrow = async (blockchain, network, privateKey, escrowId, gasLimit = '200000') => {
    try {
        console.log("Claiming escrow:", { escrowId, gasLimit, blockchain, network })

        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            throw new Error("Cannot connect to WalletX contract. Please check your network connection.")
        }

        const contract = getWalletXContract(blockchain, network, privateKey)
        
        // Validate escrow exists and is claimable
        try {
            const escrowDetails = await contract.getEscrowDetails(escrowId)
            const wallet = new ethers.Wallet(privateKey)
            const claimer = wallet.address
            
            if (escrowDetails.receiver.toLowerCase() !== claimer.toLowerCase()) {
                throw new Error("Only the escrow receiver can claim this escrow")
            }
            
            if (escrowDetails.status !== EscrowStatus.PENDING) {
                throw new Error("This escrow is not available for claiming")
            }
        } catch (detailError) {
            throw new Error(`Cannot validate escrow: ${detailError.message}`)
        }

        // Estimate gas with fallback
        const estimatedGas = await estimateGasWithFallback(
            contract, 
            'claim', 
            [escrowId], 
            {},
            parseInt(gasLimit)
        )

        const tx = await contract.claim(escrowId, {
            gasLimit: estimatedGas
        })

        console.log("Claim transaction created:", tx.hash)

        // Wait for confirmation
        const receipt = await waitForTransactionWithRetry(tx, 1, 'escrow claim')

        // Update stored transaction status
        const wallet = new ethers.Wallet(privateKey)
        const receiver = wallet.address
        
        updateEscrowStatus(blockchain, network, receiver, escrowId, EscrowStatus.CLAIMED, tx.hash)

        console.log("Escrow claim completed successfully")

        return {
            ...tx,
            receipt,
            wait: async (confirmations = 1) => {
                return receipt
            }
        }
    } catch (error) {
        const errorMessage = handleContractError(error, 'claim escrow')
        console.error("Error claiming escrow:", error)
        throw new Error(errorMessage)
    }
}

/**
 * Refund an escrow with enhanced validation
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} privateKey - The sender's private key
 * @param {string} escrowId - The escrow ID to refund
 * @param {string} gasLimit - Optional gas limit (defaults to 200000)
 * @returns {Promise<Object>} Transaction response
 */
export const refundEscrow = async (blockchain, network, privateKey, escrowId, gasLimit = '200000') => {
    try {
        console.log("Refunding escrow:", { escrowId, gasLimit, blockchain, network })

        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            throw new Error("Cannot connect to WalletX contract. Please check your network connection.")
        }

        const contract = getWalletXContract(blockchain, network, privateKey)
        
        // Validate escrow exists and is refundable
        try {
            const escrowDetails = await contract.getEscrowDetails(escrowId)
            const wallet = new ethers.Wallet(privateKey)
            const refunder = wallet.address
            
            if (escrowDetails.sender.toLowerCase() !== refunder.toLowerCase()) {
                throw new Error("Only the escrow sender can refund this escrow")
            }
            
            if (escrowDetails.status !== EscrowStatus.PENDING) {
                throw new Error("This escrow is not available for refunding")
            }
        } catch (detailError) {
            throw new Error(`Cannot validate escrow: ${detailError.message}`)
        }

        // Estimate gas with fallback
        const estimatedGas = await estimateGasWithFallback(
            contract, 
            'refund', 
            [escrowId], 
            {},
            parseInt(gasLimit)
        )

        const tx = await contract.refund(escrowId, {
            gasLimit: estimatedGas
        })

        console.log("Refund transaction created:", tx.hash)

        // Wait for confirmation
        const receipt = await waitForTransactionWithRetry(tx, 1, 'escrow refund')

        // Update stored transaction status
        const wallet = new ethers.Wallet(privateKey)
        const sender = wallet.address
        
        updateEscrowStatus(blockchain, network, sender, escrowId, EscrowStatus.REFUNDED, tx.hash)

        console.log("Escrow refund completed successfully")

        return {
            ...tx,
            receipt,
            wait: async (confirmations = 1) => {
                return receipt
            }
        }
    } catch (error) {
        const errorMessage = handleContractError(error, 'refund escrow')
        console.error("Error refunding escrow:", error)
        throw new Error(errorMessage)
    }
}