#!/usr/bin/env node

// Simple verification script to check if WalletX setup is correct
console.log('🔍 Verifying WalletX Setup...\n')

// Check if .env file exists and has required variables
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!')
  console.log('📋 Please copy .env.example to .env and configure it')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))

console.log('📋 Environment Variables:')
envLines.forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    console.log(`   ${key}: ${value.length > 50 ? value.substring(0, 47) + '...' : value}`)
  }
})

// Check required variables
const requiredVars = [
  'VITE_SOMNIA_TESTNET_RPC_URL',
  'VITE_WALLETX_CONTRACT_ADDRESS'
]

let missingVars = []
requiredVars.forEach(varName => {
  const found = envLines.some(line => line.startsWith(varName + '='))
  if (!found) {
    missingVars.push(varName)
  }
})

if (missingVars.length > 0) {
  console.log('\n⚠️  Missing required environment variables:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
} else {
  console.log('\n✅ All required environment variables are set!')
}

// Check if contract files exist
const contractFiles = [
  'contracts/WalletX.sol',
  'contracts/WalletX.json'
]

console.log('\n📜 Contract Files:')
contractFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${filePath}`)
  } else {
    console.log(`   ❌ ${filePath} (missing)`)
  }
})

// Check if key source files exist
const sourceFiles = [
  'src/lib/contractUtils.js',
  'src/components/Transactions/EscrowTransaction.jsx',
  'src/components/Transactions/TransactionPage.jsx'
]

console.log('\n📁 Source Files:')
sourceFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${filePath}`)
  } else {
    console.log(`   ❌ ${filePath} (missing)`)
  }
})

// Check package.json dependencies
const packagePath = path.join(__dirname, 'package.json')
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const requiredDeps = ['ethers', 'react', 'vite']
  
  console.log('\n📦 Dependencies:')
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`)
    } else if (packageJson.devDependencies 