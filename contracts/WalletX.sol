// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WalletManager
 * @dev A smart contract that manages wallet operations for the hackathon project
 * This contract provides functionality for sending ETH, tracking balances, and maintaining transaction history
 * NO REGISTRATION REQUIRED - Anyone can use all functions
 */
contract WalletManager {
    // Events
    event TransferExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp,
        bytes32 indexed transactionId
    );
    
    // Structs
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        bytes32 transactionId;
        bool isIncoming;
    }
    
    // State variables
    mapping(address => Transaction[]) public walletTransactions;
    mapping(address => uint256) public walletBalances;
    
    // Contract owner
    address public owner;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    

    
    /**
     * @dev Send ETH to another address through the contract
     * @param to The recipient address
     */
    function sendETH(address payable to) external payable {
        require(to != address(0), "Invalid recipient address");
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Generate transaction ID
        bytes32 transactionId = keccak256(
            abi.encodePacked(msg.sender, to, msg.value, block.timestamp, block.number)
        );
        
        // Record transaction for sender (outgoing) - always record
        walletTransactions[msg.sender].push(Transaction({
            from: msg.sender,
            to: to,
            amount: msg.value,
            timestamp: block.timestamp,
            transactionId: transactionId,
            isIncoming: false
        }));
        
        // Record transaction for recipient (incoming) - always record
        walletTransactions[to].push(Transaction({
            from: msg.sender,
            to: to,
            amount: msg.value,
            timestamp: block.timestamp,
            transactionId: transactionId,
            isIncoming: true
        }));
        
        // Execute the transfer
        to.transfer(msg.value);
        
        // Update balance cache after transfer
        walletBalances[msg.sender] = msg.sender.balance;
        walletBalances[to] = to.balance;
        
        emit TransferExecuted(msg.sender, to, msg.value, block.timestamp, transactionId);
    }
    
    /**
     * @dev Get the current balance of a wallet
     * @param wallet The wallet address to check
     * @return The current balance in wei
     */
    function getWalletBalance(address wallet) external view returns (uint256) {
        return wallet.balance;
    }
    
    /**
     * @dev Get transaction history for a wallet
     * @param wallet The wallet address
     * @param limit Maximum number of transactions to return (0 for all)
     * @return Array of transactions
     */
    function getTransactionHistory(address wallet, uint256 limit) 
        external 
        view 
        returns (Transaction[] memory) 
    {
        Transaction[] storage transactions = walletTransactions[wallet];
        uint256 length = transactions.length;
        
        if (limit == 0 || limit > length) {
            limit = length;
        }
        
        Transaction[] memory result = new Transaction[](limit);
        
        // Return most recent transactions first
        for (uint256 i = 0; i < limit; i++) {
            result[i] = transactions[length - 1 - i];
        }
        
        return result;
    }
    
    /**
     * @dev Get the total number of transactions for a wallet
     * @param wallet The wallet address
     * @return The total number of transactions
     */
    function getTransactionCount(address wallet) external view returns (uint256) {
        return walletTransactions[wallet].length;
    }
    

    
    /**
     * @dev Get contract information
     * @return owner address, contract balance
     */
    function getContractInfo() external view returns (address, uint256) {
        return (owner, address(this).balance);
    }
    
    /**
     * @dev Emergency function to withdraw contract balance (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @dev Update wallet balance cache (can be called by anyone to sync)
     * @param wallet The wallet address to update
     */
    function updateWalletBalance(address wallet) external {
        walletBalances[wallet] = wallet.balance;
    }
    
    /**
     * @dev Get multiple wallet balances at once
     * @param wallets Array of wallet addresses
     * @return Array of balances in wei
     */
    function getMultipleBalances(address[] calldata wallets) external view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](wallets.length);
        for (uint256 i = 0; i < wallets.length; i++) {
            balances[i] = wallets[i].balance;
        }
        return balances;
    }
    
    /**
     * @dev Get transaction by index for a wallet
     * @param wallet The wallet address
     * @param index The transaction index (0 = most recent)
     * @return The transaction details
     */
    function getTransactionByIndex(address wallet, uint256 index) 
        external 
        view 
        returns (Transaction memory) 
    {
        require(index < walletTransactions[wallet].length, "Transaction index out of bounds");
        uint256 actualIndex = walletTransactions[wallet].length - 1 - index;
        return walletTransactions[wallet][actualIndex];
    }
    
    /**
     * @dev Check if contract has enough ETH for operations
     * @return True if contract has ETH balance
     */
    function hasContractBalance() external view returns (bool) {
        return address(this).balance > 0;
    }
    
    /**
     * @dev Get contract statistics
     * @return totalUsers, totalTransactions, contractBalance
     */
    function getContractStats() external view returns (uint256, uint256, uint256) {
        // Simple implementation for hackathon
        return (0, 0, address(this).balance);
    }
    
    // Fallback function to receive ETH
    receive() external payable {
        // Allow contract to receive ETH
    }
    
    fallback() external payable {
        // Allow contract to receive ETH with data
    }
}