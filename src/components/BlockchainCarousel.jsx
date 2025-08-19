import React from 'react';
import { CheckCircle, Network } from 'lucide-react';

// Import Base logo
import baseLogo from '../assests/base-logo.svg';

const BlockchainCarousel = () => {
    const baseNetworks = [
        {
            name: "Base Mainnet",
            description: "Production network for real transactions",
            chainId: "8453",
            rpc: "https://mainnet.base.org",
            explorer: "https://basescan.org",
            features: ["Live Network", "Real ETH", "Production Ready"]
        },
        {
            name: "Base Sepolia",
            description: "Test network for development and testing",
            chainId: "84532", 
            rpc: "https://sepolia.base.org",
            explorer: "https://sepolia.basescan.org",
            features: ["Test Network", "Free ETH", "Development"]
        }
    ];

    return (
        <section className="relative py-16 bg-neutral-950 border-t border-neutral-800">
            <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-2xl md:text-3xl lg:text-4xl tracking-tighter text-transparent leading-tight mb-4">
                        Powered by{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Base Blockchain
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Built on Coinbase's Layer 2 solution - supporting both mainnet and testnet environments
                    </p>
                </div>

                {/* Base Networks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {baseNetworks.map((network, index) => (
                        <div
                            key={network.name}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all duration-200 h-full">
                                
                                {/* Header with Logo */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="relative inline-block overflow-hidden rounded-full p-[2px]">
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-950 backdrop-blur-3xl">
                                            <div className="w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center backdrop-blur-sm">
                                                <img src={baseLogo} alt="Base" className="w-6 h-6 object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{network.name}</h3>
                                        <p className="text-gray-400 text-sm">{network.description}</p>
                                    </div>
                                </div>

                                {/* Network Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                                        <Network className="h-4 w-4 text-blue-400" />
                                        <span>Chain ID: {network.chainId}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-2">
                                    {network.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

               
            </div>
        </section>
    );
};

export default BlockchainCarousel;