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

    mapping(address =>mapping(address=>uint256)) public allowance;

    // events

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Apporove(address indexed from,address indexed to,uint256 value);

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
       require(balanceOf[msg.sender]>=_value,"insufficient balance");
       require(_to!=address(0));

        // deduct token from sender;
        balanceOf[msg.sender] = balanceOf[msg.sender] - _value;

        // credit token to reciever
        balanceOf[_to] = balanceOf[_to] + _value;

        //emit events
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender,uint256 value) public returns(bool success){
        require(balanceOf[msg.sender]>=value);
        require(_spender!=address(0));
        allowance[msg.sender][_spender]=value;

        emit Apporove(msg.sender,_spender,value);
        return true;
    }
}
