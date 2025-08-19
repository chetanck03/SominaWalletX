import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, RefreshCw, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import EVMTransaction from './EVMTransaction'
import { isEVMCompatible } from '../../lib/networks'

function TransactionPage() {
    const { blockchain, address } = useParams()
    const navigate = useNavigate()
    const [walletData, setWalletData] = useState(null)

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Address copied to clipboard!')
    }

    useEffect(() => {
        // Get wallet data from localStorage based on blockchain and address
        const storageKey = `${blockchain}_wallets`
        const savedWallets = localStorage.getItem(storageKey)

        if (savedWallets) {
            try {
                const wallets = JSON.parse(savedWallets)
                const wallet = wallets.find(w => w.publicKey === address)
                if (wallet) {
                    setWalletData(wallet)
                } else {
                    toast.error('Wallet not found')
                    navigate('/')
                }
            } catch (error) {
                console.error('Error parsing wallet data:', error)
                toast.error('Error loading wallet data')
                navigate('/')
            }
        } else {
            toast.error('No wallets found')
            navigate('/')
        }
    }, [blockchain, address, navigate])

    if (!walletData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center relative">
                <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                <div className="relative z-10 text-center">
                    <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9945ff_0%,#14f195_50%,#9945ff_100%)]" />
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-950 backdrop-blur-3xl">
                            <RefreshCw className="animate-spin text-purple-400" size={32} />
                        </div>
                    </div>
                    <p className="text-lg text-gray-300 font-geist">Loading wallet...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black pt-16 relative">
            {/* Background Effects */}
            <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-6 sm:mb-8">
                    <button
                        onClick={() => {
                            // Set the blockchain in localStorage so Dashboard shows the correct wallet page
                            localStorage.setItem('selected_blockchain', blockchain)
                            navigate('/dashboard')
                        }}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 font-medium bg-neutral-900/70 backdrop-blur-sm border border-neutral-600 hover:border-neutral-400 rounded-lg px-4 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Wallet Info */}
                <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
                        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative inline-block overflow-hidden rounded-full p-[2px]">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full  bg-neutral-950 backdrop-blur-3xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 flex items-center justify-center">
                                            <Send size={20} className="text-purple-400" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-lg sm:text-xl font-semibold capitalize text-white font-geist">
                                    {blockchain}{' '}
                                    Wallet #{walletData.index !== undefined ? walletData.index + 1 : ''}
                                </h1>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                                    Wallet Address
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <div className="flex-1 px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-lg">
                                        <p className="font-mono text-sm break-all text-gray-200 leading-relaxed">{address}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(address)}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Copy size={14} />
                                        <span>Copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Component */}
                {blockchain && isEVMCompatible(blockchain) && (
                    <EVMTransaction walletData={walletData} blockchain={blockchain} />
                )}
            </div>
        </div>
    )
}

export default TransactionPage