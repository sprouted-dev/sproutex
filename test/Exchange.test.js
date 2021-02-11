import { ether, tokens, EVM_REVERT, ETHER_ADDRESS } from './helpers';
const Exchange = artifacts.require('./Exchange.sol');
const Sprout = artifacts.require('./Sprout.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
    let exchange, sprout;
    const feePercent = '10';

    beforeEach(async () => {
        sprout = await Sprout.new()
        exchange = await Exchange.new(feeAccount, feePercent)
        await sprout.transfer(user1, tokens(100), { from: deployer})
    })

    describe('Deployment', () => {
        it('deploys successfully', async () => {
            const address = await exchange.address;
            address.should.exist;
            address.should.not.equal(0x0);
            address.should.not.equal('');
        })

        it('should set the fee account', async () => {
            const result = await exchange.feeAccount();
            result.should.equal(feeAccount);
        })

        it('should set the fee percentage', async () => {
            const result = await exchange.feePercent();
            result.toString().should.equal(feePercent);
        })
    })

    describe('fallback', () => {
        it('reverts when Ether is sent', async () => {
            await exchange.sendTransaction({value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT);
        })
    })

    describe('Deposit Ether', () => {
        let result, amount;

        beforeEach(async () => {
            amount = ether(1);
            result = await exchange.depositEther({from: user1, value: amount})
        })

        it('should deposit Ether', async () => {
            const bal = await exchange.tokens(ETHER_ADDRESS, user1);
            bal.toString().should.equal(amount.toString());
        })

        it('should emit a Deposit event', async () => {
            const {event, args}= result.logs[0];
            event.should.eq('Deposit');
            args.token.toString().should.equal(ETHER_ADDRESS);
            args.user.toString().should.equal(user1);
            args.amount.toString().should.equal(amount.toString());
            args.balance.toString().should.equal(amount.toString());
        })
    })

    describe('Withdraw Ether', () => {
        let result, value;
        beforeEach(async () => {
            value = ether(1);
            await exchange.depositEther({from: user1, value})
        })

        describe('success', () => {
            beforeEach(async () => {
                result = await exchange.withdrawEther(value, {from: user1});
            })

            it('should withdraw Ether funds', async () => {
                const balance = await exchange.tokens(ETHER_ADDRESS, user1);
                balance.toString().should.equal('0');
            })

            it('should emit a Withdraw event', async () => {
                const {event, args}= result.logs[0];
                event.should.eq('Withdraw');
                args.token.toString().should.equal(ETHER_ADDRESS);
                args.user.toString().should.equal(user1);
                args.amount.toString().should.equal(value.toString());
                args.balance.toString().should.equal('0');
            })
        })

        describe('failure', () => {
            it('should reject withdrawals with insufficient balances', async () => {
                await exchange.withdrawEther(ether(1000), {from: user1}).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })

    describe('Deposit Sprouts', () => {
        let result;
        const amount = tokens(10).toString();

        describe('success', () => {

            beforeEach(async () => {
                await sprout.approve(exchange.address, amount, {from: user1});
                result = await exchange.depositSprouts(sprout.address, amount, {from: user1})
            })

            it('should deposit sprouts', async () => {
                const bal = await sprout.balanceOf(exchange.address);
                bal.toString().should.equal(amount)
                const userBalance = await exchange.tokens(sprout.address, user1);
                userBalance.toString().should.equal(amount);
            })

            it('should emit a Deposit event', async () => {
                const {event, args}= result.logs[0];
                event.should.eq('Deposit');
                args.token.toString().should.equal(sprout.address);
                args.user.toString().should.equal(user1);
                args.amount.toString().should.equal(amount);
                args.balance.toString().should.equal(amount);
            })
        })

        describe('failure', () => {
            it('should be rejected when no tokens are approved', async () => {
                await exchange.depositSprouts(
                    sprout.address,
                    tokens(10),
                    {from: user1}
                    ).should.be.rejectedWith(EVM_REVERT);
            })

            it('rejects Ether deposits', async () => {
                await exchange.depositSprouts(
                    ETHER_ADDRESS,
                    tokens(10),
                    {from: user1}).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })

    describe('Withdraw Sprouts', () => {
        let result
        let amount

        describe('success', () => {
            beforeEach(async () => {
                // Deposit tokens first
                amount = tokens(10)
                await sprout.approve(exchange.address, amount, { from: user1 })
                await exchange.depositSprouts(sprout.address, amount, { from: user1 })

                // Withdraw tokens
                result = await exchange.withdrawSprouts(sprout.address, amount, { from: user1 })
            })

            it('withdraws token funds', async () => {
                const balance = await exchange.tokens(sprout.address, user1)
                balance.toString().should.equal('0')
            })

            it('emits a "Withdraw" event', async () => {
                const {event, args}= result.logs[0];
                event.should.eq('Withdraw')
                args.token.should.equal(sprout.address)
                args.user.should.equal(user1)
                args.amount.toString().should.equal(amount.toString())
                args.balance.toString().should.equal('0')
            })
        })

        describe('failure', () => {
            it('rejects Ether withdraws', async () => {
                await exchange.withdrawSprouts(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('fails for insufficient balances', async () => {
                // Attempt to withdraw tokens without depositing any first
                await exchange.withdrawSprouts(sprout.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('balanceOf', () => {
        beforeEach(async () => {
            exchange.depositEther({ from: user1, value: ether(1) })
        })

        it('returns user balance', async () => {
            const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
            result.toString().should.equal(ether(1).toString())
        })
    })

    describe('Make Order', () => {
        let result;

        beforeEach(async () => {
            result = await exchange.makeOrder(sprout.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1});
        })

        it('should create an order', async () => {
            const orderCount = await exchange.orderCount();
            orderCount.toString().should.equal('1');
            const order = await exchange.orders(orderCount);
            order.id.toString().should.equal('1');
            order.tokenGet.toString().should.equal(sprout.address);
            order.tokenGive.toString().should.equal(ETHER_ADDRESS);
        })

        it('should emit an "Order" event', async () => {
            const {event, args}= result.logs[0];
            event.should.eq('Order')
            args.id.toString().should.equal('1')
            args.tokenGet.should.equal(sprout.address)
            args.tokenGive.should.equal(ETHER_ADDRESS)
            args.amountGet.toString().should.equal(tokens(1).toString())
            args.amountGive.toString().should.equal(tokens(1).toString());
        })
    })

    describe('Order actions', () => {
        beforeEach(async () => {
            await exchange.depositEther({from: user1, value: ether(1)});
            await sprout.transfer(user2, tokens(100), {from: deployer});
            await sprout.approve(exchange.address, tokens(2), {from: user2});
            await exchange.depositSprouts(sprout.address, tokens(2), {from: user2});
            await exchange.makeOrder(sprout.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1});
        })

        describe('filling orders', () => {
            let result;
            describe('success', () => {
                beforeEach(async () => {
                    result = await exchange.fillOrder(1, {from: user2});
                })

                it('should execute the trade', async () => {
                    const user1SproutBal = await exchange.balanceOf(sprout.address, user1);
                    const user2SproutBal = await exchange.balanceOf(sprout.address, user2);
                    const user1EtherBal = await exchange.balanceOf(ETHER_ADDRESS, user1);
                    const user2EtherBal = await exchange.balanceOf(ETHER_ADDRESS, user2);

                    const feeAccount = await exchange.feeAccount();
                    const feeAccountBal = await exchange.balanceOf(sprout.address, feeAccount);

                    user1SproutBal.toString().should.equal(tokens(1).toString(), 'user1 received sprouts');
                    user1EtherBal.toString().should.equal(tokens(0).toString(), 'user1 traded ether');
                    user2SproutBal.toString().should.equal(tokens(0.9).toString(), 'user2 deducted sprouts and a fee');
                    user2EtherBal.toString().should.equal(tokens(1).toString(), 'user2 received ether');
                    feeAccountBal.toString().should.equal(tokens(0.1).toString(), 'fee account received a fee');

                })

                it('should update the filled orders', async () => {
                    const order = await exchange.orderFilled(1);
                    order.should.be.true;
                })

                it('should emit a "Trade" event', async () => {
                    const {event, args}= result.logs[0];
                    event.should.eq('Trade')
                    args.id.toString().should.equal('1')
                    args.tokenGet.should.equal(sprout.address)
                    args.tokenGive.should.equal(ETHER_ADDRESS)
                    args.amountGet.toString().should.equal(tokens(1).toString())
                    args.amountGive.toString().should.equal(tokens(1).toString());
                    args.user.should.equal(user1);
                    args.userFill.should.equal(user2);
                })
            })

            describe('failure', () => {
                it('should fail for an invalid order id', async () => {
                    await exchange.fillOrder(42, { from: user2 }).should.be.rejectedWith(EVM_REVERT);
                })

                it('should reject already filled orders', async () => {
                    await exchange.fillOrder(1, {from: user2}).should.be.fulfilled;
                    await exchange.fillOrder(1, { from: user2 }).should.be.rejectedWith(EVM_REVERT);
                })

                it('should reject cancelled orders', async () => {
                    await exchange.cancelOrder(1, {from: user1}).should.be.fulfilled;
                    await exchange.fillOrder(1, { from: user2 }).should.be.rejectedWith(EVM_REVERT);
                })
            })
        })

        describe('Cancel order', () => {
            let result;

            describe('success', () => {

                beforeEach(async () => {
                    result = await exchange.cancelOrder(1, { from: user1 });
                })

                it('should update cancelled orders', async () => {
                    const orderCancelled = await exchange.orderCancelled(1);
                    orderCancelled.should.be.true;
                })

                it('should emit a "CancelOrder" event', async () => {
                    const {event, args}= result.logs[0];
                    event.should.eq('CancelOrder')
                    args.id.toString().should.equal('1')
                    args.user.should.equal(user1, 'User is correct');
                    args.tokenGet.should.equal(sprout.address)
                    args.tokenGive.should.equal(ETHER_ADDRESS)
                    args.amountGet.toString().should.equal(tokens(1).toString())
                    args.amountGive.toString().should.equal(tokens(1).toString());
                })
            })

            describe('failed', () => {
                it('should fail for an invalid order id', async () => {
                    await exchange.cancelOrder(42, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
                })

                it('should fail if a user tries to cancel an order they did not place', async () => {
                    await exchange.cancelOrder(1, { from: user2 }).should.be.rejectedWith(EVM_REVERT);
                })
            })
        })
    })

})