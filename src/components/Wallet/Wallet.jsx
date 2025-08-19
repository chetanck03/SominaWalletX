import React, { useState, useEffect } from 'react'
import EVMWallet from './EVMWallet'
import { isEVMCompatible } from '../../lib/networks'

function Wallet({ blockchain }) {
    const [selectedBlockchain, setSelectedBlockchain] = useState(blockchain || 'base')

    // Update selected blockchain when prop changes or default to base
    useEffect(() => {
        const targetBlockchain = blockchain || 'base'
        setSelectedBlockchain(targetBlockchain)
        localStorage.setItem('selected_blockchain', targetBlockchain)
    }, [blockchain])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Render Base Blockchain Component */}
            {selectedBlockchain && isEVMCompatible(selectedBlockchain) && (
                <EVMWallet blockchain={selectedBlockchain} />
            )}
        </div>
    )
}

export default Wallet