// Network configuration for Base blockchain
export const NETWORK_CONFIGS = {
  base: {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    coinType: 60, // Base uses Ethereum's coin type
    networks: {
      mainnet: {
        name: 'Base Mainnet',
        chainId: 8453,
        rpcUrl: import.meta.env.VITE_BASE_MAINNET_RPC_URL,
        explorerUrl: 'https://basescan.org',
        faucetUrl: null
      },
      sepolia: {
        name: 'Base Sepolia',
        chainId: 84532,
        rpcUrl: import.meta.env.VITE_BASE_SEPOLIA_RPC_URL,
        explorerUrl: 'https://sepolia.basescan.org',
        faucetUrl: 'https://portal.cdp.coinbase.com/products/faucet'
      }
    }
  }
}

// Helper functions
export const getNetworkConfig = (blockchain, network = 'mainnet') => {
  return NETWORK_CONFIGS[blockchain]?.networks[network]
}

export const getBlockchainConfig = (blockchain) => {
  return NETWORK_CONFIGS[blockchain]
}

export const getAllSupportedBlockchains = () => {
  return Object.keys(NETWORK_CONFIGS)
}

export const getEVMCompatibleBlockchains = () => {
  return Object.keys(NETWORK_CONFIGS).filter(blockchain => 
    NETWORK_CONFIGS[blockchain].coinType === 60
  )
}

export const isEVMCompatible = (blockchain) => {
  return NETWORK_CONFIGS[blockchain]?.coinType === 60
}