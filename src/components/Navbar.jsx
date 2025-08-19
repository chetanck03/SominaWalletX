import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, Github, ChevronDown } from 'lucide-react'
import baseLogo from '../assests/base-logo.svg'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBlockchainDropdownOpen, setIsBlockchainDropdownOpen] = useState(false)

  // Add custom scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .mobile-menu-scroll {
        scrollbar-width: thin;
        scrollbar-color: #525252 #262626;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar {
        width: 6px;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar-track {
        background: #262626;
        border-radius: 3px;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar-thumb {
        background: #525252;
        border-radius: 3px;
      }
      
      .mobile-menu-scroll::-webkit-scrollbar-thumb:hover {
        background: #737373;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
  // Initialize with saved blockchain to prevent flicker
  const [selectedBlockchain, setSelectedBlockchain] = useState(() => {
    const saved = localStorage.getItem('selected_blockchain')
    return saved || ''
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Handle route changes and ensure blockchain state is always in sync
  useEffect(() => {
    const savedBlockchain = localStorage.getItem('selected_blockchain')

    // If we're on dashboard page, always show the saved blockchain
    if (location.pathname === '/dashboard') {
      if (savedBlockchain && savedBlockchain !== selectedBlockchain) {
        setSelectedBlockchain(savedBlockchain)
      }
    }
    // If we're not on dashboard, only clear if we actually have a selection
    else if (location.pathname !== '/dashboard' && selectedBlockchain) {
      setSelectedBlockchain('')
    }
  }, [location.pathname, selectedBlockchain])

  // Periodic check to ensure state stays in sync (handles edge cases)
  useEffect(() => {
    const checkBlockchainState = () => {
      const savedBlockchain = localStorage.getItem('selected_blockchain')

      if (location.pathname === '/dashboard') {
        // If we're on dashboard and localStorage has a blockchain but state doesn't match
        if (savedBlockchain && savedBlockchain !== selectedBlockchain) {
          setSelectedBlockchain(savedBlockchain)
        }
        // If we're on dashboard and no blockchain in localStorage but state has one
        else if (!savedBlockchain && selectedBlockchain) {
          setSelectedBlockchain('')
        }
      }
    }

    // Check immediately
    checkBlockchainState()

    // Set up interval to check periodically (every 500ms)
    const interval = setInterval(checkBlockchainState, 500)

    return () => clearInterval(interval)
  }, [location.pathname, selectedBlockchain])

  // Listen for blockchain changes from other components
  useEffect(() => {
    const handleBlockchainChange = (event) => {
      setSelectedBlockchain(event.detail)
    }

    const handleStorageChange = (event) => {
      if (event.key === 'selected_blockchain') {
        // Always update the state with the new value from localStorage
        setSelectedBlockchain(event.newValue || '')
      }
    }

    const handleWindowFocus = () => {
      // When window regains focus (like after refresh), check localStorage
      const savedBlockchain = localStorage.getItem('selected_blockchain')
      if (location.pathname === '/dashboard' && savedBlockchain && savedBlockchain !== selectedBlockchain) {
        setSelectedBlockchain(savedBlockchain)
      }
    }

    const handleVisibilityChange = () => {
      // When page becomes visible, sync state
      if (!document.hidden) {
        const savedBlockchain = localStorage.getItem('selected_blockchain')
        if (location.pathname === '/dashboard' && savedBlockchain && savedBlockchain !== selectedBlockchain) {
          setSelectedBlockchain(savedBlockchain)
        }
      }
    }

    window.addEventListener('blockchainChanged', handleBlockchainChange)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('blockchainChanged', handleBlockchainChange)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [location.pathname, selectedBlockchain])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Disable body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      // Re-enable body scroll when mobile menu is closed
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    // Cleanup function to ensure scroll is re-enabled
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isMenuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isBlockchainDropdownOpen && !event.target.closest('.blockchain-dropdown')) {
        setIsBlockchainDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isBlockchainDropdownOpen])

  const handleGithubClick = () => {
    window.open('https://github.com/chetanck03', '_blank')
    setIsMenuOpen(false)
  }



  const handleHomeClick = () => {
    setIsMenuOpen(false)

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete, then scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } else {
      // If we're already on home page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFAQClick = () => {
    setIsMenuOpen(false)

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const faqSection = document.getElementById('faq')
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      // If we're already on home page, just scroll
      const faqSection = document.getElementById('faq')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleBlockchainSelect = (blockchain) => {
    // Check if blockchain is available
    const blockchainData = blockchains.find(b => b.id === blockchain)
    if (!blockchainData?.available) {
      // For unavailable networks, just close dropdown and show coming soon message
      setIsBlockchainDropdownOpen(false)
      setIsMenuOpen(false)
      return
    }

    // Set the blockchain selection and save to localStorage
    setSelectedBlockchain(blockchain)
    localStorage.setItem('selected_blockchain', blockchain)
    setIsBlockchainDropdownOpen(false)
    setIsMenuOpen(false)

    // Navigate to dashboard to open the wallet directly
    navigate('/dashboard')

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('blockchainChanged', { detail: blockchain }))
  }

  const blockchains = [
    // Base Network - Primary Focus
    {
      id: 'base',
      name: 'Base',
      symbol: 'ETH',
      color: 'from-blue-400 to-blue-500',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-400/10',
      logo: baseLogo,
      available: true
    },


  ]

  const getCurrentBlockchain = () => {
    return blockchains.find(b => b.id === selectedBlockchain) || null
  }

  const renderBlockchainLogo = (blockchain) => {
    if (!blockchain) return null
    return (
      <img
        src={blockchain.logo}
        alt={`${blockchain.name} logo`}
        className="w-5 h-5"
      />
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.25,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: 'easeInOut',
        staggerChildren: 0.05,
      },
    },
  }

  const mobileItemVariants = {
    closed: {
      opacity: 0,
      x: 15,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${isScrolled
          ? 'border-neutral-700/30 bg-neutral-950/80 border-b shadow-lg backdrop-blur-xl'
          : 'bg-neutral-950/20 backdrop-blur-sm'
          }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <button onClick={handleHomeClick} className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                {/* <img
                  src={Logo}
                  alt="Blockchain Logo"
                  className="h-8 w-8"
                /> */}
                <Wallet className="h-8 w-8 text-purple-500 " />

                <span className="text-xl font-geist bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  WalletX
                </span>
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('home')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={handleHomeClick}
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {hoveredItem === 'home' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">Home</span>
                </button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('about')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {hoveredItem === 'about' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">About</span>
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredItem('faq')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={handleFAQClick}
                  className="text-gray-300 hover:text-white relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {hoveredItem === 'faq' && (
                    <motion.div
                      className="bg-neutral-800/50 absolute inset-0 rounded-lg"
                      layoutId="navbar-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">FAQ</span>
                </button>
              </motion.div>

              {/* Blockchain Selector Dropdown */}
              <motion.div
                variants={itemVariants}
                className="relative blockchain-dropdown"
              >
                <motion.button
                  onClick={() => {
                    // If no blockchain is selected and we're not on dashboard, go to dashboard first
                    if (!selectedBlockchain && location.pathname !== '/dashboard') {
                      navigate('/dashboard')
                      // Small delay to allow dashboard to load before showing dropdown
                      setTimeout(() => {
                        setIsBlockchainDropdownOpen(true)
                      }, 100)
                      return
                    }
                    setIsBlockchainDropdownOpen(!isBlockchainDropdownOpen)
                  }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {getCurrentBlockchain() ? (
                    <>
                      <div className="w-6 h-6 flex items-center justify-center">
                        {renderBlockchainLogo(getCurrentBlockchain())}
                      </div>
                      <span>{getCurrentBlockchain().name}</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      <span>Select Blockchain</span>
                    </>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isBlockchainDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isBlockchainDropdownOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Available Networks Section */}
                      <div className="px-3 py-2 border-b border-neutral-700">
                        <span className="text-xs text-gray-400 font-medium">Available Networks</span>
                      </div>
                      {blockchains.filter(b => b.available).map((blockchain, index) => (
                        <motion.button
                          key={blockchain.id}
                          onClick={() => handleBlockchainSelect(blockchain.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-neutral-700 transition-colors ${selectedBlockchain === blockchain.id ? 'bg-neutral-700' : ''
                            }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {renderBlockchainLogo(blockchain)}
                          </div>
                          <div className="flex-1">
                            <span className="text-white text-sm">{blockchain.name}</span>
                            <div className="text-xs text-gray-400">{blockchain.symbol}</div>
                          </div>
                          {selectedBlockchain === blockchain.id && (
                            <motion.div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      ))}

                      {/* Coming Soon Section */}
                      <div className="px-3 py-2 border-t border-neutral-700">
                        <span className="text-xs text-gray-400 font-medium">Coming Soon</span>
                      </div>
                      {blockchains.filter(b => !b.available).map((blockchain, index) => (
                        <motion.div
                          key={blockchain.id}
                          className="w-full flex items-center space-x-3 px-4 py-3 opacity-50 cursor-not-allowed"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 0.5, x: 0 }}
                          transition={{ delay: (blockchains.filter(b => b.available).length + index) * 0.05 }}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {renderBlockchainLogo(blockchain)}
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-400 text-sm">{blockchain.name}</span>
                            <div className="text-xs text-gray-500">{blockchain.symbol}</div>
                          </div>
                          <span className="text-xs text-gray-500">Soon</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>



              <motion.button
                onClick={handleGithubClick}
                className="p-2 border border-gray-600 rounded-full text-gray-300 hover:text-white hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-200"
                title="View on GitHub"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5" />
              </motion.button>
            </nav>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="border-neutral-700/50 bg-neutral-950/95 backdrop-blur-md fixed top-16 right-4 bottom-4 z-50 w-80 overflow-y-auto overflow-x-hidden rounded-2xl border shadow-xl md:hidden mobile-menu-scroll"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="space-y-6 p-6 pb-8">
                <div className="space-y-1">
                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={handleHomeClick}
                      className="text-gray-300 hover:text-white hover:bg-neutral-800/50 block w-full text-left rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    >
                      Home
                    </button>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-white hover:bg-neutral-800/50 block rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={handleFAQClick}
                      className="text-gray-300 hover:text-white hover:bg-neutral-800/50 block w-full text-left rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    >
                      FAQ
                    </button>
                  </motion.div>
                </div>

                {/* Mobile Blockchain Selector */}
                <motion.div
                  className="border-neutral-700 space-y-3 border-t pt-6"
                  variants={mobileItemVariants}
                >
                  <div className="text-gray-400 text-sm mb-2 px-4">Select Blockchain:</div>

                  {/* Available Networks */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 px-4 mb-2">Available Networks</div>
                    {blockchains.filter(b => b.available).map((blockchain, index) => (
                      <motion.button
                        key={blockchain.id}
                        onClick={() => handleBlockchainSelect(blockchain.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${selectedBlockchain === blockchain.id
                          ? 'bg-neutral-700 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-neutral-800/50'
                          }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {renderBlockchainLogo(blockchain)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm">{blockchain.name}</div>
                          <div className="text-xs text-gray-400">{blockchain.symbol}</div>
                        </div>
                        {selectedBlockchain === blockchain.id && (
                          <motion.div
                            className="w-2 h-2 bg-green-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Coming Soon Networks */}
                  <div className="space-y-2 pt-4 border-t border-neutral-700">
                    <div className="text-xs text-gray-500 px-4 mb-2">Coming Soon</div>
                    {blockchains.filter(b => !b.available).map((blockchain, index) => (
                      <motion.div
                        key={blockchain.id}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg opacity-50 cursor-not-allowed"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 0.5, x: 0 }}
                        transition={{ delay: 0.1 + (blockchains.filter(b => b.available).length + index) * 0.05 }}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {renderBlockchainLogo(blockchain)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm text-gray-400">{blockchain.name}</div>
                          <div className="text-xs text-gray-500">{blockchain.symbol}</div>
                        </div>
                        <span className="text-xs text-gray-500">Soon</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="border-neutral-700 border-t pt-6 space-y-2"
                  variants={mobileItemVariants}
                >

                  <button
                    onClick={handleGithubClick}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-neutral-800/50 w-full rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                    title="View on GitHub"
                  >
                    <div className="p-1 border border-gray-600 rounded-full">
                      <Github className="h-4 w-4" />
                    </div>
                    <span>GitHub</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar