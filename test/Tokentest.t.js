const { expect } = require("chai");
const { ethers } = require("hardhat");



const tokenCount = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Token", function () {
  let token, deployer, receiver, exchange;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Cap Token", "CAP", 1000000);
    signer = await ethers.getSigners();
    deployer = signer[0];
    receiver = signer[1];
    exchange = signer[2];
  })

  describe("Deployment", () => {

    const _name = "Cap Token";
    const _symbol = "CAP";
    const _totalsupply = tokenCount(1000000)

    it("has a correct name", async () => {
      const name = await token.name();
      expect(name).to.be.equal(_name);
    })

    it("has a correct symbol", async () => {
      const symbol = await token.symbol();
      expect(symbol).to.be.equal(_symbol);
    })

    it("has a correct Decimal", async () => {
      const decimal = await token.decimal();
      expect(decimal).to.be.equal(18);
    })

    it("has a correct totalSupply", async () => {
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.be.equal(_totalsupply);

    })

    it("At the Start assign all tokens to deployer", async () => {
      const tokens = await token.balanceOf(deployer.address);
      expect(tokens).to.be.equal(_totalsupply);

    })
  })

  describe('sending Tokens', () => {
    let amount, transaction, result;


    describe("Success", () => {

      // send tokens
      // if you write ------>token.connect(receiver).transfer(receiver.address, amount) , then  ----->     [msg.sender==receiver]

      // if you write ------>token.transfer(receiver.address, amount), then ----->                         [msd.sender==deployer]  
      // [contranct deployer==deployer]

      // if you write ------>token.connect(deployer).transfer(receiver.address, amount) ,then ---->        [msg.sender==deployer]
      // [contranct deployer==deployer]

      // for constructor --->always --->    [msg.sender==contract deployer==deployer]

      beforeEach(async () => {
        amount = tokenCount(100);
        transaction = await token.connect(deployer).transfer(receiver.address, amount);

        result = await transaction.wait();
      })

      //send token
      it("transfer Token Balances", async () => {

        expect(await token.balanceOf(deployer.address)).to.be.equal(tokenCount(999900));
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
      })

      it("emit event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.be.equal("Transfer");


        const args = event.args;
        expect(args.from).to.be.equal(deployer.address);
        expect(args.to).to.be.equal(receiver.address);
        expect(args.value).to.be.equal(amount);

      })

    })

    describe("Faliure", async () => {


      it("reject insufficient balance", async () => {
        amount = tokenCount(10000000);
        await expect(token.connect(deployer).transfer(receiver.address, amount)).to.be.reverted;
      })

      it("reject insufficient address", async () => {
        amount = tokenCount(1000);
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
      })

    })

  })

  describe("Approve Tokens", () => {
    let amount, transaction, result;



    describe("success", () => {

      beforeEach(async () => {
        amount = tokenCount(100);
        transaction = await token.connect(deployer).approve(exchange.address, amount);
        result = await transaction.wait();
      })

      it("allownace for transfer tokens", async () => {
        const allowToken = await token.allowance(deployer.address, exchange.address);
        expect(allowToken).to.be.equal(amount);
      })
    })


    describe("failure", () => {
      it("reject insufficient balance for apporove", async () => {
        amount = tokenCount(10000000);
        await expect(token.connect(deployer).approve(exchange.address, amount)).to.be.reverted;
      })

      it("reject insufficient address for apporove", async () => {
        amount = tokenCount(1000);
        await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
      })
    })
  })

  describe("Token Transfer with Spender", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = await tokenCount(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      result = await transaction.wait();
    })


    describe("success", () => {
      beforeEach(async () => {
        transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();

      })


      it("transfer token balance", async () => {
        expect(await token.balanceOf(deployer.address)).to.be.equal(tokenCount(999900));
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
      })

      it("reset Allowance",async ()=>{
        expect(await token.allowance(deployer.address,exchange.address)).to.be.equal(0);
      })

       it("emit event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.be.equal("Transfer");


        const args = event.args;
        expect(args.from).to.be.equal(deployer.address);
        expect(args.to).to.be.equal(receiver.address);
        expect(args.value).to.be.equal(amount);

      })

    })

    describe("faliure", () => {

      it("not enough tokens", async () => {
       const  invalidamount = tokenCount(200)
        await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidamount)).to.be.reverted;
      })

      it("reject insufficient address", async () => {

        await expect(token.connect(exchange).transferFrom(deployer.address, '0x0000000000000000000000000000000000000000', amount)).to.be.reverted;
      })

    })
  })

})