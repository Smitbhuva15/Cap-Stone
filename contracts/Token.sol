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

    //mapping
    mapping(address => uint256) public balanceOf;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimal);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public {
        // deduct token from sender;
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;

        // credit token to reciever
        balanceOf[_to] =  balanceOf[_to] + _value;

    }
}
