import React from 'react'
import { ArrowLeft } from 'lucide-react'
import ethereumLogo from '../../../assests/ethereum-eth-logo.svg'
import baseLogo from '../../../assests/base-logo.svg'
import polygonLogo from '../../../assests/polygon-matic-logo.svg'
import avalancheLogo from '../../../assests/avalanche-avax-logo.svg'
import bnbLogo from '../../../assests/binance-coin-bnb-logo.svg'

const logoMap = {
    ethereum: ethereumLogo,
    base: baseLogo,
    polygon: polygonLogo,
    avalanche: avalancheLogo,
    bnb: bnbLogo
}

const EthereumHeader = ({ onBackToSelection, blockchainName = 'Ethereum', blockchainId }) => {
    // Use blockchainId for logo mapping if provided, otherwise try to extract from name
    const logoKey = blockchainId || blockchainName.toLowerCase().split(' ')[0]
    const logo = logoMap[logoKey] || ethereumLogo
    return (
        <>
            {/* Back to Selection Button */}
            <div className="mb-8">
                <button
                    onClick={onBackToSelection}
                    className="text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2 cursor-pointer bg-neutral-900/70 backdrop-blur-sm border border-neutral-600 hover:border-neutral-400 rounded-lg px-4 py-2.5 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                    <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                </button>
            </div>

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-950 backdrop-blur-3xl">
                        <div className="w-14 h-14 rounded-full  border border-purple-500/30 flex items-center justify-center">
                        <img src={logo} alt={blockchainName} className="w-8 h-8 object-contain" />
                    </div>
                </div>
                </div>
                <h1 className="font-geist text-3xl md:text-4xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] mb-4">
                    {blockchainName}{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        HD Wallet
                    </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Create and manage hierarchical deterministic wallets with secure seed phrase generation
                </p>
            </div>
        </>
    )
}

export default EthereumHeader