// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";



contract Exchange{
  address public feeAccount;
  uint256 public feePercent;

  constructor(address _feeAccount,uint256 _feePercent){
    // fee Acoount is account,that get the all Transaction fees
    feeAccount=_feeAccount;
    // every Transaction fee in Percent
    feePercent=_feePercent;
  }
}