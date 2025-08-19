// Network configuration for Somnia blockchain
export const NETWORK_CONFIGS = {
  somnia: {
    id: 'somnia',
    name: 'Somnia',
    symbol: 'STT',
    coinType: 60, // Somnia uses Ethereum's coin type (EVM compatible)
    networks: {
      testnet: {
        name: 'Somnia Shannon Testnet',
        chainId: 50312, // Somnia Shannon testnet chain ID
        rpcUrl: import.meta.env.VITE_SOMNIA_TESTNET_RPC_URL,
        explorerUrl: 'https://shannon-explorer.somnia.network',
        faucetUrl: 'https://faucet.trade/somnia-shannon-stt-faucet'
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