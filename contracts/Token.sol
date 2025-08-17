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

    mapping(address => mapping(address => uint256)) public allowance;

    // events

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Apporove(address indexed from, address indexed to, uint256 value);

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
    ) public returns (bool success) {
        //sender enough balance
        require(balanceOf[msg.sender] >= _value, "insufficient balance");
        success = _transfer(msg.sender, _to, _value);
        return success;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal returns (bool success) {
        require(_to != address(0));

        // deduct token from sender;
        balanceOf[_from] = balanceOf[_from] - _value;

        // credit token to reciever
        balanceOf[_to] = balanceOf[_to] + _value;

        //emit events
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= value);
        require(_spender != address(0));
        allowance[msg.sender][_spender] = value;

        emit Apporove(msg.sender, _spender, value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value,"insufficient balance");

        //check approve
        require(allowance[_from][msg.sender] >= _value,"insufficient allowance");
        require(_to != address(0));

        // reset Allowance,
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        // transfer token
        _transfer(_from, _to, _value);

        return true;
    }
}
