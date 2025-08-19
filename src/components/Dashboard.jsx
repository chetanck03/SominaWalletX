import React, { useState, useEffect } from 'react'
import {
  ArrowRight,
  CheckCircle,
  Link
} from 'lucide-react'

import WalletComponent from './Wallet/Wallet'
import { loadSharedEVMSeedPhrase } from '../lib/sharedEVMStorage'
import { isEVMCompatible } from '../lib/networks'

import baseLogo from '../assests/base-logo.svg'

function Dashboard() {
  const [selectedBlockchain, setSelectedBlockchain] = useState(null)
  const [hasSharedEVMSeed, setHasSharedEVMSeed] = useState(false)

  useEffect(() => {
    const savedBlockchain = localStorage.getItem('selected_blockchain')
    if (savedBlockchain) {
      setSelectedBlockchain(savedBlockchain)
    }

    // Check if there's a shared EVM seed phrase
    const sharedSeed = loadSharedEVMSeedPhrase()
    setHasSharedEVMSeed(!!sharedSeed)

    const handleBlockchainChange = (event) => {
      setSelectedBlockchain(event.detail)
    }

    window.addEventListener('blockchainChanged', handleBlockchainChange)

    return () => {
      window.removeEventListener('blockchainChanged', handleBlockchainChange)
    }
  }, [])

  const blockchains = [
    {
      id: 'base',
      name: 'Base',
      symbol: 'ETH',
      logo: baseLogo,
      description: 'Coinbase\'s L2 blockchain built on Ethereum - Fast, secure, and developer-friendly',
      color: 'from-blue-500 to-blue-700',
      features: ['Ultra Low Fees', 'Lightning Fast', 'EVM Compatible', 'Coinbase Ecosystem']
    }
  ]

  if (selectedBlockchain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black relative">
        {/* Background Effects */}
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />



        <div className="relative z-10">
          <WalletComponent blockchain={selectedBlockchain} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      <div className="relative w-full bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-30 sm:opacity-50 [perspective:200px]">
          <div className="absolute inset-0 [transform:rotateX(35deg)]">
            <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)] sm:[background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:80px_80px] sm:[background-size:120px_120px] [background-repeat:repeat]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent to-90%" />
        </div>


      </div>

      {/* Blockchain Selection Section */}
      <section className="relative py-20 bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-geist text-3xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
              Currently Supporting{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Base
              </span>
            </h2>
            <p className="text-sm md:text-lg text-gray-400 mb-4">
              Currently supporting Base blockchain with more blockchains coming soon. Experience the power of Base - Coinbase's Layer 2 solution built for speed, security, and seamless user experience.
            </p>

            {/* Base Blockchain Info */}
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600/10 to-neutral-800/20 border border-blue-500/20 rounded-xl p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <div className="flex items-center gap-2 text-purple-400 mt-1 flex-shrink-0">
                  <Link className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-semibold text-sm sm:text-base">Base Blockchain</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Base is Coinbase's Layer 2 blockchain built on Ethereum, offering <strong className="text-white">ultra-low fees and lightning-fast transactions</strong>.
                    As an EVM-compatible chain, Base provides seamless integration with existing Ethereum tools and dApps while delivering superior performance.
                    Perfect for DeFi, NFTs, and Web3 applications with enterprise-grade security backed by Coinbase. <strong className="text-purple-400">More blockchains will be supported in future updates.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {blockchains.map((blockchain) => {
              const isEVM = isEVMCompatible(blockchain.id)

              return (
                <div
                  key={blockchain.id}
                  onClick={() => {
                    setSelectedBlockchain(blockchain.id)
                    localStorage.setItem('selected_blockchain', blockchain.id)
                  }}
                  className="group cursor-pointer relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 sm:p-8 hover:border-neutral-600 transition-all duration-200 group-hover:scale-105 h-full flex flex-col min-h-[400px]">
                    <div className="text-center flex-1 flex flex-col">
                      {/* EVM Compatibility Badge */}
                      {isEVM && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 border border-purple-500/30 rounded-full px-2 py-1">
                          <Link className="h-3 w-3 text-purple-400" />
                          <span className="text-xs text-purple-400 font-medium">EVM</span>
                        </div>
                      )}



                      <div className="mb-6 flex justify-center">
                        <div className="relative inline-block overflow-hidden rounded-full p-[2px]">
                          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-950 backdrop-blur-3xl">
                            <div className="w-14 h-14 rounded-full  border border-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                              <img src={blockchain.logo} alt={blockchain.name} className="w-8 h-8 object-contain" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{blockchain.name}</h3>
                      <p className="text-gray-400 mb-6 flex-grow">{blockchain.description}</p>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {blockchain.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className='text-base'>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full cursor-pointer">
                          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                          <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                            <div className="w-full inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-6 py-3 text-white font-medium transition-colors hover:bg-transparent/90">
                              <span>Select {blockchain.name}</span>
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>


    </div>
  )
}

export default Dashboard
