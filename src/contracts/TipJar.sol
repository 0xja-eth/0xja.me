// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TipJar
 * @dev A contract that accepts tips in ETH and various ERC20 tokens
 */
contract TipJar is Ownable, ReentrancyGuard {
    // Events
    event TipReceived(address indexed sender, address indexed token, uint256 amount);
    event TokensWithdrawn(address indexed token, uint256 amount);
    event ETHWithdrawn(uint256 amount);

    // Mapping to track supported tokens
    mapping(address => bool) public supportedTokens;

    constructor() Ownable(msg.sender) {
        // Add supported tokens
        supportedTokens[address(0)] = true; // ETH
        supportedTokens[0xdAC17F958D2ee523a2206206994597C13D831ec7] = true; // USDT
        supportedTokens[0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48] = true; // USDC
        supportedTokens[0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599] = true; // WBTC
    }

    /**
     * @dev Send ETH tip
     */
    function tip() external payable {
        emit TipReceived(msg.sender, address(0), msg.value);
    }

    /**
     * @dev Send tip in ERC20 tokens
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to tip
     */
    function tipToken(address token, uint256 amount) external nonReentrant {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit TipReceived(msg.sender, token, amount);
    }

    /**
     * @dev Add a supported token
     * @param token The address of the token to add
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    /**
     * @dev Remove a supported token
     * @param token The address of the token to remove
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }

    /**
     * @dev Withdraw ERC20 tokens
     * @param token The address of the token to withdraw
     */
    function withdrawTokens(address token) external onlyOwner nonReentrant {
        require(token != address(0), "Use withdrawETH for ETH");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");

        IERC20(token).transfer(owner(), balance);
        emit TokensWithdrawn(token, balance);
    }

    /**
     * @dev Withdraw ETH
     */
    function withdrawETH() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "ETH transfer failed");
        emit ETHWithdrawn(balance);
    }

    /**
     * @dev Check if a token is supported
     * @param token The address of the token to check
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }
}
