const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokenCount = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Token", function () {
  let token;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Cap Token", "CAP", 1000000);
  })

  describe("Deployment", () => {
     
    const _name="Cap Token";
    const _symbol="CAP";
    const _totalsupply = tokenCount(1000000)

    it("has a correct name", async () => {
      const name = await token.name();
      expect(name).to.equal(_name);
    })

    it("has a correct symbol", async () => {
      const symbol = await token.symbol();
      expect(symbol).to.equal(_symbol);
    })

    it("has a correct Decimal", async () => {
      const decimal = await token.decimal();
      expect(decimal).to.equal(18);
    })

    it("has a correct totalSupply", async () => {
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.equal(_totalsupply);

    })
  })


})