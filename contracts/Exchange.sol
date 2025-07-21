// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    /// mapping

    mapping(address =>mapping(address=>uint256)) public tokens;

    constructor(address _feeAccount, uint256 _feePercent) {
        // fee Acoount is account,that get the all Transaction fees
        feeAccount = _feeAccount;
        // every Transaction fee in Percent
        feePercent = _feePercent;
    }

    // deposite Token

    function depositeToken(address _token, uint256 _amount) public {
        // Transfer tokens to exchange(contract)

        ///////////////////////////////////////////////

        // token owner ----->msg.sender
        // token spender (for approve) --->exchange(contract) (address(this))
        // reciever token --> exchange(contract) (address(this))

        Token(_token).transferFrom(msg.sender, address(this), _amount);

        //////////////////////////////////////////////

        //update user balance

        tokens[_token][msg.sender]=tokens[_token][msg.sender]+ _amount;
        // emit event
    }
}
