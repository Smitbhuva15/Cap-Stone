const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Token", function () {
  let token;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token=await Token.deploy();

    await token.deployed();
  })

  it("has a correct name", async () => {
    const name = await token.name();
    expect(name).to.equal("Cap Token");
  })

  it("has a correct symbol", async () => {
    const symbol = await token.symbol();
    expect(symbol).to.equal("CAP");
  })
})