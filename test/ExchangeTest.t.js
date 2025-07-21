const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokenCount = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Exchange", () => {
    let exchange, account, feeAccount, deployer;
    const feePercent=10;

    beforeEach(async () => {
        account = await ethers.getSigners();
        deployer = account[0];
        feeAccount = account[1];
        const Exchange = await ethers.getContractFactory("Exchange");
        exchange = await Exchange.deploy(feeAccount.address,feePercent);

    })

    describe('deployment',()=>{
        it("has the fee account",async()=>{
            expect(await exchange.feeAccount()).to.be.equal(feeAccount.address);
        })

         it("has the feePercent",async()=>{
            expect(await exchange.feePercent()).to.be.equal(feePercent);
        })
    })

})