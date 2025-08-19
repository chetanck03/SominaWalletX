// Simple test script to verify contract functionality
// Run this in browser console after deploying the contract

const testContractFunctionality = async () => {
  console.log("🧪 Testing WalletManager Contract Functionality");
  
  // Test 1: Check if contract address is set
  console.log("\n1. Checking contract configuration...");
  const contractAddress = import.meta.env.VITE_WALLET_MANAGER_CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("❌ Contract address not configured!");
    return;
  }
  console.log("✅ Contract address:", contractAddress);
  
  // Test 2: Check wallet registration
  console.log("\n2. Testing wallet registration...");
  try {
    const isRegistered = await isWalletRegistered('base', 'sepolia', 'YOUR_WALLET_ADDRESS');
    console.log("✅ Wallet registration check:", isRegistered ? "Registered" : "Not registered");
  } catch (error) {
    console.error("❌ Registration check failed:", error.message);
  }
  
  // Test 3: Check balance fetching
  console.log("\n3. Testing balance fetching...");
  try {
    const balance = await getContractWalletBalance('base', 'sepolia', 'YOUR_WALLET_ADDRESS');
    console.log("✅ Balance fetch successful:", balance, "ETH");
  } catch (error) {
    console.error("❌ Balance fetch failed:", error.message);
  }
  
  // Test 4: Check transaction history
  console.log("\n4. Testing transaction history...");
  try {
    const history = await getContractTransactionHistory('base', 'sepolia', 'YOUR_WALLET_ADDRESS', 10);
    console.log("✅ Transaction history fetch successful:", history.length, "transactions");
  } catch (error) {
    console.error("❌ Transaction history failed:", error.message);
  }
  
  console.log("\n🎉 Contract functionality test completed!");
};

// Export for use
window.testContractFunctionality = testContractFunctionality;

console.log("Test function loaded. Run testContractFunctionality() to test your contract.");