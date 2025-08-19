// Shared storage manager for all EVM-compatible chains
// This allows Ethereum, Base, Polygon, Avalanche, and BNB Smart Chain to share the same seed phrase

import { getEVMCompatibleBlockchains } from './networks'

// Shared storage keys for EVM chains
export const SHARED_EVM_STORAGE_KEYS = {
    SEED_PHRASE: 'evm_shared_seed_phrase',
    WALLETS: 'evm_shared_wallets'
}

// Save shared seed phrase for all EVM chains
export const saveSharedEVMSeedPhrase = (seedPhrase) => {
    try {
        localStorage.setItem(SHARED_EVM_STORAGE_KEYS.SEED_PHRASE, seedPhrase)
    } catch (error) {
        console.error('Error saving shared EVM seed phrase:', error)
    }
}

// Load shared seed phrase for all EVM chains
export const loadSharedEVMSeedPhrase = () => {
    try {
        return localStorage.getItem(SHARED_EVM_STORAGE_KEYS.SEED_PHRASE)
    } catch (error) {
        console.error('Error loading shared EVM seed phrase:', error)
        return null
    }
}

// Remove shared seed phrase
export const removeSharedEVMSeedPhrase = () => {
    try {
        localStorage.removeItem(SHARED_EVM_STORAGE_KEYS.SEED_PHRASE)
    } catch (error) {
        console.error('Error removing shared EVM seed phrase:', error)
    }
}

// Save wallets for a specific blockchain
export const saveEVMWallets = (blockchain, wallets) => {
    try {
        const key = `${blockchain}_wallets`
        localStorage.setItem(key, JSON.stringify(wallets))
    } catch (error) {
        console.error(`Error saving ${blockchain} wallets:`, error)
    }
}

// Load wallets for a specific blockchain
export const loadEVMWallets = (blockchain) => {
    try {
        const key = `${blockchain}_wallets`
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error(`Error loading ${blockchain} wallets:`, error)
        return []
    }
}

// Remove wallets for a specific blockchain
export const removeEVMWallets = (blockchain) => {
    try {
        const key = `${blockchain}_wallets`
        localStorage.removeItem(key)
    } catch (error) {
        console.error(`Error removing ${blockchain} wallets:`, error)
    }
}

// Clear all EVM data (seed phrase and all wallets)
export const clearAllEVMData = () => {
    try {
        // Remove shared seed phrase
        removeSharedEVMSeedPhrase()
        
        // Remove wallets for all EVM chains
        const evmChains = getEVMCompatibleBlockchains()
        evmChains.forEach(blockchain => {
            removeEVMWallets(blockchain)
        })
    } catch (error) {
        console.error('Error clearing all EVM data:', error)
    }
}

// Check if any EVM chain has wallets
export const hasAnyEVMWallets = () => {
    try {
        const evmChains = getEVMCompatibleBlockchains()
        return evmChains.some(blockchain => {
            const wallets = loadEVMWallets(blockchain)
            return wallets && wallets.length > 0
        })
    } catch (error) {
        console.error('Error checking EVM wallets:', error)
        return false
    }
}

// Get wallet count across all EVM chains
export const getTotalEVMWalletCount = () => {
    try {
        const evmChains = getEVMCompatibleBlockchains()
        return evmChains.reduce((total, blockchain) => {
            const wallets = loadEVMWallets(blockchain)
            return total + (wallets ? wallets.length : 0)
        }, 0)
    } catch (error) {
        console.error('Error getting total EVM wallet count:', error)
        return 0
    }
}