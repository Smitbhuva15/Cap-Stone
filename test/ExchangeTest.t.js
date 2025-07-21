const { expect } = require("chai");
const { ethers } = require("hardhat");


const tokenCount = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Exchange", () => {
    let exchange, account, feeAccount, deployer, token1;
    const feePercent = 10;

    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");

        const Token = await ethers.getContractFactory("Token");
        token1 = await Token.deploy("Cap Token", "CAP", 1000000);

        account = await ethers.getSigners();
        deployer = account[0];
        feeAccount = account[1];
        user1 = account[2];

        let transaction = await token1.connect(deployer).transfer(user1.address, tokenCount(100));
        await transaction.wait();


        exchange = await Exchange.deploy(feeAccount.address, feePercent);



    })

    describe('deployment', () => {
        it("has the fee account", async () => {
            expect(await exchange.feeAccount()).to.be.equal(feeAccount.address);
        })

        it("has the feePercent", async () => {
            expect(await exchange.feePercent()).to.be.equal(feePercent);
        })
    })

    describe("Deposite Token", () => {
        let transaction, result;
        let amount = tokenCount(10);
        beforeEach(async () => {

            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait()

            transaction = await exchange.connect(user1).depositeToken(token1.address, amount)
            result = await transaction.wait();
        })
        describe("success", () => {
            it("tracks the token deposite",async ()=>{
                expect(await token1.balanceOf(exchange.address)).to.be.equal(amount);

                expect(await exchange.tokens(token1.address,user1.address)).to.be.equal(amount);

            })

        })

        describe("failure", () => {

        })
    })

})