import {tokens, EVM_REVERT} from './helpers';
const Sprout = artifacts.require('./Sprout.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Sprout', ([deployer, receiver, exchange]) => {

    const tokenName = 'Sprout';
    const symbol = 'SPROUT';
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();
    let sprout;

    beforeEach(async () => {
        sprout = await Sprout.new()
    })

    describe('deployment', () => {
        it('deploys successfully', async () => {
            const address = await sprout.address;
            address.should.exist;
            address.should.not.equal(0x0);
            address.should.not.equal('');
        })

        it('should assign the totalSupply to the owner', async () => {
            const balance = await sprout.balanceOf(deployer)
            balance.toString().should.equal(totalSupply)
        })
    });

    describe('name', () => {
        it('should have one',async () => {
            const name = await sprout.name();
            name.should.equal(tokenName);
        })
    })

    describe('symbol', () => {
        it('should have one',async () => {
            const s = await sprout.symbol();
            s.should.equal(symbol);
        })
    })

    describe('decimals', () => {
        it('should have one',async () => {
            const s = await sprout.decimals();
            s.toString().should.equal(decimals);
        })
    })

    describe('totalSupply', () => {
        it('should have one',async () => {
            const s = await sprout.totalSupply();
            s.toString().should.equal(totalSupply);
        })
    })

    describe('transfer', () => {
        let transferAmt, result;

        describe('success', () => {
            beforeEach(async () => {
                transferAmt = tokens(100).toString();
                result = await sprout.transfer(receiver, transferAmt, {from: deployer});
            })

            it('should transfer tokens',async () => {
                const newDeployerBalance = await sprout.balanceOf(deployer);
                const newReceiverBalance = await sprout.balanceOf(receiver);

                const expectedDeployerBalance = tokens(999900).toString();
                const expectedReceiverBalance = transferAmt;
                newDeployerBalance.toString().should.equal(expectedDeployerBalance);
                newReceiverBalance.toString().should.equal(expectedReceiverBalance);
            })

            it('should emit a Transfer event', async () => {
                const {event, args}= result.logs[0];
                event.should.eq('Transfer');
                args.from.toString().should.equal(deployer);
                args.to.toString().should.equal(receiver);
                args.value.toString().should.equal(transferAmt);
            })
        })

        describe('failure', () => {
            it('should throw if the sender does not have enough tokens', async () => {
                transferAmt = tokens(1000001).toString();
                await sprout.transfer(receiver, transferAmt, {from: deployer})
                    .should.be.rejectedWith(EVM_REVERT);
            })

            it('should reject invalid recipients', async () => {
                transferAmt = tokens(100).toString();
                await sprout.transfer(0x0, transferAmt, {from: deployer}).should.be.rejected;
            })
        })
    })

    describe('transferFrom', () => {
        let approvalAmt, result, transferAmt;

        beforeEach(async () => {
            approvalAmt = tokens(1000).toString();
            await sprout.approve(exchange, approvalAmt, { from: deployer });
        })

        describe('success', () => {
            beforeEach(async () => {
                transferAmt = tokens(100).toString();
                result = await sprout.transferFrom(deployer, receiver, transferAmt, { from: exchange });
            })

            it('should transfer tokens',async () => {
                const newDeployerBalance = await sprout.balanceOf(deployer);
                const newReceiverBalance = await sprout.balanceOf(receiver);

                const expectedDeployerBalance = tokens(999900).toString();
                const expectedReceiverBalance = transferAmt;
                newDeployerBalance.toString().should.equal(expectedDeployerBalance);
                newReceiverBalance.toString().should.equal(expectedReceiverBalance);
            })

            it('should emit a Transfer event', async () => {
                const {event, args}= result.logs[0];
                event.should.eq('Transfer');
                args.from.toString().should.equal(deployer);
                args.to.toString().should.equal(receiver);
                args.value.toString().should.equal(transferAmt);
            })
        })

        describe('failure', () => {

            it('should throw if the sender does not have enough tokens', async () => {
                transferAmt = tokens(1000001).toString();
                await sprout.transferFrom(deployer, receiver, transferAmt, { from: exchange })
                    .should.be.rejectedWith(EVM_REVERT);
            })

            it('should throw if the spender tries to spend more than approved', async () => {
                transferAmt = tokens(1001).toString();
                await sprout.transferFrom(deployer, receiver, transferAmt, { from: exchange })
                    .should.be.rejectedWith(EVM_REVERT);
            })

            it('should reject invalid recipients', async () => {
                transferAmt = tokens(100).toString();
                await sprout.transferFrom(0x0, 0x0, transferAmt, {from: exchange}).should.be.rejected;
            })
        })
    })

    describe('approve', () => {
        let result, amount;

        beforeEach(async () => {
            amount = tokens(100).toString();
            result = await sprout.approve(exchange, amount, {from: deployer})
        })

        describe('success', () => {
            it('should allocate and allowance for delegated token spending', async () => {
                const allowance = await sprout.allowance(deployer, exchange);
                allowance.toString().should.equal(amount);
            })

            it('should emit an Approval event', async () => {
                const {event, args}= result.logs[0];
                event.should.eq('Approval');
                args.owner.toString().should.equal(deployer);
                args.spender.toString().should.equal(exchange);
                args.value.toString().should.equal(amount);
            })
        })

        describe('failure', () => {

        })
    })

});