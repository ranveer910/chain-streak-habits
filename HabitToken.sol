// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract HabitToken is ERC20, ERC20Permit {
    constructor(uint256 initialSupply)
        ERC20("Habit Token", "HABIT")
        ERC20Permit("Habit Token")
    {
        // Mint the initial supply to the deployer's address
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}