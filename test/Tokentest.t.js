const { expect } = require("chai");
const { ethers } = require("hardhat");



const tokenCount = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Token", function () {
  let token, deployer, receiver;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Cap Token", "CAP", 1000000);
    signer = await ethers.getSigners();
    deployer = signer[0];
    receiver = signer[1];
  })

  describe("Deployment", () => {

    const _name = "Cap Token";
    const _symbol = "CAP";
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

    it("At the Start assign all tokens to deployer", async () => {
      const tokens = await token.balanceOf(deployer.address);
      expect(tokens).to.equal(_totalsupply);

    })
  })

  describe('sending Tokens', () => {
    let amount, transaction,result;
    
    
      // send tokens
      // if you write ------>token.connect(receiver).transfer(receiver.address, amount) , then  ----->     [msg.sender==receiver]

      // if you write ------>token.transfer(receiver.address, amount), then ----->                         [msd.sender==deployer]  
      // [contranct deployer==deployer]

      // if you write ------>token.connect(deployer).transfer(receiver.address, amount) ,then ---->        [msg.sender==deployer]
      // [contranct deployer==deployer]

      // for constructor --->always --->    [msg.sender==contract deployer==deployer]

     
    beforeEach(async()=>{
      amount = tokenCount(100);
      transaction = await token.connect(deployer).transfer(receiver.address, amount);

      result =await transaction.wait();
    })

    //send token
    it("Transfer Token Balances", async () => {
   
      expect(await token.balanceOf(deployer.address)).to.equal(tokenCount(999900));
      expect(await token.balanceOf(receiver.address)).to.equal(amount);
    })

    it("emit event",async()=>{
    const event=result.events[0];
    // console.log(event);
    expect(event.event).to.equal("Transfer");
    const args=event.args;
    expect(args.from).to.equal(deployer.address);
    expect(args.to).to.equal(receiver.address);
    expect(args.value).to.equal(amount);

    })


  })

})