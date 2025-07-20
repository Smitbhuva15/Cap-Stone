// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Token {
    //name
    string public name;
    //symbol
    string public symbol;
    // Decimal
    uint256 public decimal = 18;
    //Total supply
    uint256 public totalSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimal);
    }
}
