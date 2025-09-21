// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HabitReward is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable habitToken;
    uint256 public rewardAmount;
    mapping(address => bool) public hasClaimed;

    event RewardClaimed(address indexed claimer, uint256 amount);
    event TokensDeposited(uint256 amount);
    event RewardAmountUpdated(uint256 newAmount);
    event TokensRecovered(address indexed token, uint256 amount);

    constructor(address _habitToken) Ownable(msg.sender) ReentrancyGuard() {
        require(_habitToken != address(0), "Invalid token address");
        habitToken = IERC20(_habitToken);
    }

    function setRewardAmount(uint256 _rewardAmount) external onlyOwner {
        rewardAmount = _rewardAmount;
        emit RewardAmountUpdated(_rewardAmount);
    }

    function claimReward() external nonReentrant {
        require(!hasClaimed[msg.sender], "Already claimed");
        uint256 currentReward = rewardAmount;
        require(
            habitToken.balanceOf(address(this)) >= currentReward,
            "Insufficient tokens"
        );

        hasClaimed[msg.sender] = true;
        habitToken.safeTransfer(msg.sender, currentReward);

        emit RewardClaimed(msg.sender, currentReward);
    }

    function depositTokens(uint256 amount) external onlyOwner {
        habitToken.safeTransferFrom(msg.sender, address(this), amount);
        emit TokensDeposited(amount);
    }

    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(habitToken), "Cannot recover habit token");
        IERC20(tokenAddress).safeTransfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }

    receive() external payable {
        revert("Contract does not accept ETH");
    }
}