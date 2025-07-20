const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Token",function(){

  it("has a name",async ()=>{
    const Token=await ethers.getContractFactory("Token");
    let token=await Token.deploy();

    await token.deployed();

    const name=await token.name();
    expect(name).to.equal("Cap Token");
  })
})