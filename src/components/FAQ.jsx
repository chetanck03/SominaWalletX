import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What makes WalletX's EVM Shared Seed technology revolutionary?",
      answer: "WalletX introduces industry-first EVM Shared Seed technology designed so one seed phrase will generate identical wallet addresses across all EVM-compatible chains (Ethereum, Base, Polygon, Avalanche, BNB Smart Chain). Currently supporting Base, with additional EVM chains coming soon. This will mean your wallet address is exactly the same on all EVM chains, simplifying multi-chain management while maintaining full BIP-44 compliance."
    },
    {
      question: "Which blockchain networks does WalletX support?",
      answer: "WalletX currently supports Base (Mainnet & Sepolia testnet) with 5 additional major blockchain networks planned for future releases: Ethereum, Polygon, Avalanche, BNB Smart Chain, and Solana. All EVM chains will share the same seed phrase technology, while Solana will use dedicated Ed25519 cryptography when implemented."
    },
    {
      question: "How secure is WalletX and where are my private keys stored?",
      answer: "WalletX employs enterprise-grade security with complete client-side cryptographic operations. Your private keys never leave your browser and are stored locally with encryption. We use industry-standard BIP-39/BIP-44 compliance, Web Crypto API for secure random generation, and zero data collection policy. All cryptographic operations happen locally using ethers.js and @solana/web3.js."
    },
    {
      question: "What are temporary wallets and how do they work?",
      answer: "Temporary wallets are like disposable phone numbers or burner emails, but for cryptocurrency. They're perfect for testing, development, privacy-focused transactions, airdrops, or when you need instant blockchain access without compromising your main wallets. You can generate unlimited HD wallets from a single seed phrase or create fresh ones as needed."
    },
    {
      question: "Can I import existing wallets from MetaMask, Phantom, or other wallets?",
      answer: "Yes! WalletX supports importing existing wallets using 12 or 24-word mnemonic phrases with full BIP-39 validation. Since we use standard derivation paths, wallets imported from MetaMask, Phantom, Trust Wallet, and other standard wallets work seamlessly. Your existing wallet addresses will be identical due to our BIP-44 compliance."
    },
    {
      question: "How does the transaction system work?",
      answer: "WalletX provides comprehensive transaction management for Base blockchain, with multi-chain support planned for future releases. You can send native ETH tokens with custom gas settings, switch seamlessly between mainnet and testnet, access integrated testnet faucets for free development tokens, and view complete transaction history with blockchain explorer integration. Additional networks (Ethereum, Polygon, Avalanche, BNB Smart Chain, Solana) coming soon."
    },
    {
      question: "Is WalletX completely free to use?",
      answer: "Yes, WalletX is completely free and open source under MIT license. There are no subscription fees, hidden costs, or premium features. You only pay standard blockchain network fees (gas fees) when making transactions. The platform generates revenue through optional donations and potential future premium enterprise features."
    },
    {
      question: "What's the difference between mainnet and testnet, and why should I use testnets?",
      answer: "Mainnets are live blockchain networks where transactions use real cryptocurrency with real value. Testnets are sandbox environments with free test tokens for development and experimentation. WalletX includes integrated testnet faucets for Base (with more networks coming soon), making it perfect for developers testing dApps, learning blockchain development, or trying new features risk-free."
    },
    {
      question: "How does WalletX ensure compatibility with existing wallet infrastructure?",
      answer: "WalletX uses industry-standard cryptographic methods: BIP-39 for mnemonic generation, BIP-44 for hierarchical derivation, EIP-155 for chain IDs, EIP-1559 for gas fees, and Ed25519 for Solana. This ensures full compatibility with MetaMask, Phantom, Trust Wallet, Coinbase Wallet, and all major wallet providers. Your WalletX-generated wallets work everywhere."
    },
    {
      question: "Can I use WalletX for DeFi, NFTs, and other Web3 applications?",
      answer: "Absolutely! WalletX-generated wallets are fully compatible with all Web3 applications, DeFi protocols, NFT marketplaces, and dApps on Base blockchain, with additional network support coming soon. Since we use standard wallet formats and derivation paths, you can connect to Base-compatible applications and thousands of other Web3 applications seamlessly once multi-chain support is implemented."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative py-20 bg-neutral-950">
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-5xl tracking-tighter text-transparent leading-tight mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get quick answers to common questions about WalletX
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl overflow-hidden hover:border-neutral-600 transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-800/30 transition-colors duration-200"
              >
                <h3 className="text-base font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ