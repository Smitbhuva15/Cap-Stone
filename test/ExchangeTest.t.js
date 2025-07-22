const { expect } = require("chai");
const { ethers } = require("hardhat");


const tokenCount = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Exchange", () => {
    let exchange, account, feeAccount, deployer, token1, token2;
    const feePercent = 10;

    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory("Exchange");

        const Token = await ethers.getContractFactory("Token");
        token1 = await Token.deploy("Cap Token", "CAP", 1000000);
        token2 = await Token.deploy("Mock Dai", "mDAI", 1000000);

        account = await ethers.getSigners();
        deployer = account[0];
        feeAccount = account[1];
        user1 = account[2];
        user2 = account[3]

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

            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait();
        })
        describe("success", () => {

            it("tracks the token deposite", async () => {
                expect(await token1.balanceOf(exchange.address)).to.be.equal(amount);

                expect(await exchange.tokens(token1.address, user1.address)).to.be.equal(amount);

                expect(await exchange.balanceOf(token1.address, user1.address)).to.be.equal(amount);

            })


            it('emits a Deposit event', async () => {
                const event = result.events[1] // 2 events are emitted
                expect(event.event).to.equal('Deposit')

                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(amount)
            })

        })

        describe('Failure', () => {
            it('fails when no tokens are approved', async () => {
                // Don't approve any tokens before depositing
                await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted
            })
        })
    })


    describe("Withdraw Token", () => {
        let transaction, result;
        let amount = tokenCount(10);

        describe("success", () => {

            beforeEach(async () => {
                // deposit tokens for withdrawing
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()

                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait();

                //now withdraw

                transaction = await exchange.connect(user1).withdrawToken(token1.address, amount)
                result = await transaction.wait();

            })

            it("tracks the token withdraw", async () => {
                expect(await token1.balanceOf(exchange.address)).to.be.equal(0);

                expect(await exchange.tokens(token1.address, user1.address)).to.be.equal(0);

                expect(await exchange.balanceOf(token1.address, user1.address)).to.be.equal(0);

            })


            it('emits a Withdraw event', async () => {
                const event = result.events[1] // 2 events are emitted
                expect(event.event).to.equal('Withdraw')

                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(0)
            })

        })

        describe('Failure', () => {
            it('fails for insufficient balance', async () => {

                // withdraw without deposit tokens
                let invaidamount = tokenCount(1000);
                await expect(exchange.connect(user1).withdrawToken(token1.address, invaidamount)).to.be.reverted
            })
        })
    })


    describe("making Orders", () => {
        let transaction, result;
        let amount = tokenCount(1);

        describe("success", () => {

            beforeEach(async () => {
                // deposit tokens for makeoder
                transaction = await token1.connect(user1).approve(exchange.address, amount)
                result = await transaction.wait()

                transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait();

                //make order

                transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
                result = await transaction.wait();



            })

            it("tracks the token for make order", async () => {
                expect(await exchange.orderCount()).to.be.equal(1);
            })


            it('emits a make Order event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Order')

                const args = event.args
                expect(args.id).to.equal(1)
                expect(args.user).to.equal(user1.address)
                expect(args.tokenGet).to.equal(token2.address)
                expect(args.amountGet).to.equal(amount)
                expect(args.tokenGive).to.equal(token1.address)
                expect(args.amountGive).to.equal(amount)
                expect(args.timestamp).to.at.least(1)

            })


        })

        describe('Failure', () => {
            it("Rejects with no balance", async () => {
                await expect(exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)).to.be.reverted;
            })

        })

    })


    describe("Order Action", () => {
        let transaction, result;
        let amount = tokenCount(1);

        beforeEach(async () => {
            // user1 deposit tokens for make order
            transaction = await token1.connect(user1).approve(exchange.address, amount)
            result = await transaction.wait()

            transaction = await exchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait();

            // transfer token2 to user2
            transaction = await token2.connect(deployer).transfer(user2.address, tokenCount(2))
            result = await transaction.wait();

            //user2 deposit tokens for fill 
            transaction = await token2.connect(user2).approve(exchange.address, tokenCount(2));
            result = await transaction.wait();

            transaction = await exchange.connect(user2).depositToken(token2.address, tokenCount(2));
            result = await transaction.wait();

            //make order

            transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount);
            result = await transaction.wait();



        })

        describe("Cancelling order", () => {
            beforeEach(async () => {
                transaction = await exchange.connect(user1).cancelOrder(1);
                result = await transaction.wait();
            })

            describe('Success', async () => {
                it("update cancel order", async () => {
                    expect(await exchange.orderCancelled(1)).to.be.equal(true);
                })



                it('emits a make Cancel event', async () => {
                    const event = result.events[0]
                    expect(event.event).to.equal('Cancel')

                    const args = event.args
                    expect(args.id).to.equal(1)
                    expect(args.user).to.equal(user1.address)
                    expect(args.tokenGet).to.equal(token2.address)
                    expect(args.amountGet).to.equal(amount)
                    expect(args.tokenGive).to.equal(token1.address)
                    expect(args.amountGive).to.equal(amount)
                    expect(args.timestamp).to.at.least(1)

                })
            })


            describe('Failure', async () => {
                beforeEach(async () => {
                    // user1 deposits tokens
                    transaction = await token1.connect(user1).approve(exchange.address, amount)
                    result = await transaction.wait()
                    transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                    result = await transaction.wait()
                    // Make an order
                    transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
                    result = await transaction.wait()
                })

                it('rejects invalid order ids', async () => {
                    const invalidOrderId = 99
                    await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to.be.reverted
                })

                it('rejects unauthorized cancelations', async () => {
                    await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
                })

            })


        })

        describe("filling order", () => {


            describe('success', async () => {
                beforeEach(async () => {
                    transaction = await exchange.connect(user2).fillOrder(1);
                    result = await transaction.wait();
                })
                it("Execute Fill order", async () => {
                    //user 2
                    expect(await exchange.balanceOf(token2.address, user2.address)).to.be.equal(tokenCount(0.9));
                    expect(await exchange.balanceOf(token1.address, user2.address)).to.be.equal(tokenCount(1));

                    //user1
                    expect(await exchange.balanceOf(token2.address, user1.address)).to.be.equal(tokenCount(1));
                    expect(await exchange.balanceOf(token1.address, user1.address)).to.be.equal(tokenCount(0));

                    //fee account
                    expect(await exchange.balanceOf(token1.address, feeAccount.address)).to.be.equal(tokenCount(0));
                    expect(await exchange.balanceOf(token2.address, feeAccount.address)).to.be.equal(tokenCount(0.1));

                })




                it('emits Trade event', async () => {
                    const event = result.events[0]
                    expect(event.event).to.equal('Trade')

                    const args = event.args
                    expect(args.id).to.equal(1)
                    expect(args.user).to.equal(user2.address)
                    expect(args.tokenGet).to.equal(token2.address)
                    expect(args.amountGet).to.equal(amount)
                    expect(args.tokenGive).to.equal(token1.address)
                    expect(args.amountGive).to.equal(amount)
                    expect(args.creator).to.equal(user1.address)
                    expect(args.timestamp).to.at.least(1)

                })
                it("update fillorder ", async () => {
                    expect(await exchange.orderFilled(1)).to.equal(true);
                })
            })


            describe('Failure', async () => {
                // beforeEach(async () => {

                //     // user1 deposits tokens
                //     transaction = await token1.connect(user1).approve(exchange.address, amount)
                //     result = await transaction.wait()

                //     transaction = await exchange.connect(user1).depositToken(token1.address, amount)
                //     result = await transaction.wait()

                //     // Make an order
                //     transaction = await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
                //     result = await transaction.wait()
                // })

                it('rejects invalid order ids', async () => {
                    const invalidOrderId = 99
                    await expect(exchange.connect(user1).fillOrder(invalidOrderId)).to.be.reverted
                })

                it('rejects already cancel order', async () => {
                    transaction = await exchange.connect(user1).cancelOrder(1);
                    result = await transaction.wait();

                    await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted;
                })


                it('reject already filled order', async () => {
                    transaction = await exchange.connect(user2).fillOrder(1);
                    result = await transaction.wait();

                    await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted;

                })


            })


        })

    })

})