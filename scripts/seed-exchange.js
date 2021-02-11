const Sprout = artifacts.require('Sprout');
const Exchange = artifacts.require('Exchange');
//const web3 = require('web3');
const { ether, tokens, ETHER_ADDRESS } = require('../test/helpers');

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async (cb) => {
    try {
        console.log('seeding the exchange...');
        const { getAccounts } = web3.eth;
        const { toWei } = web3.utils;
        const [user1, user2] = await getAccounts();
        let amount;

        const sprout = await Sprout.deployed();
        console.log(`Sprout fetched: ${sprout.address}`);
        const exchange = await Exchange.deployed();
        console.log(`Exchange fetched: ${exchange.address}`);

        const initialAmount = toWei('10000', 'ether');
        await sprout.transfer(user2, initialAmount, {from: user1});
        console.log(`Transferred ${initialAmount} sprouts from ${user1} to ${user2}`)

        // User 1 Deposits Ether
        amount = 1
        await exchange.depositEther({ from: user1, value: ether(amount) })
        console.log(`Deposited ${amount} Ether from ${user1}`)

        // User 2 Approves Tokens
        amount = 10000
        await sprout.approve(exchange.address, tokens(amount), { from: user2 })
        console.log(`Approved ${amount} tokens from ${user2}`)

        // User 2 Deposits Tokens
        await exchange.depositSprouts(sprout.address, tokens(amount), { from: user2 })
        console.log(`Deposited ${amount} tokens from ${user2}`)

        /////////////////////////////////////////////////////////////
        // Seed a Cancelled Order
        //

        // User 1 makes order to get tokens
        let result
        let orderId
        result = await exchange.makeOrder(sprout.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
        console.log(`Made order from ${user1}`)

        // User 1 cancels order
        orderId = result.logs[0].args.id
        await exchange.cancelOrder(orderId, { from: user1 })
        console.log(`Cancelled order from ${user1}`)

        /////////////////////////////////////////////////////////////
        // Seed Filled Orders
        //

        // User 1 makes order
        result = await exchange.makeOrder(sprout.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
        console.log(`Made order from ${user1}`)

        // User 2 fills order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 })
        console.log(`Filled order from ${user1}`)

        // Wait 1 second
        await wait(1)

        // User 1 makes another order
        result = await exchange.makeOrder(sprout.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 })
        console.log(`Made order from ${user1}`)

        // User 2 fills another order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 })
        console.log(`Filled order from ${user1}`)

        // Wait 1 second
        await wait(1)

        // User 1 makes final order
        result = await exchange.makeOrder(sprout.address, tokens(200), ETHER_ADDRESS, ether(0.15), { from: user1 })
        console.log(`Made order from ${user1}`)

        // User 2 fills final order
        orderId = result.logs[0].args.id
        await exchange.fillOrder(orderId, { from: user2 })
        console.log(`Filled order from ${user1}`)

        // Wait 1 second
        await wait(1)

        /////////////////////////////////////////////////////////////
        // Seed Open Orders
        //

        // User 1 makes 10 orders
        for (let i = 1; i <= 10; i++) {
            result = await exchange.makeOrder(sprout.address, tokens(10 * i), ETHER_ADDRESS, ether(0.01), { from: user1 })
            console.log(`Made order from ${user1}`)
            // Wait 1 second
            await wait(1)
        }

        // User 2 makes 10 orders
        for (let i = 1; i <= 10; i++) {
            result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), sprout.address, tokens(10 * i), { from: user2 })
            console.log(`Made order from ${user2}`)
            // Wait 1 second
            await wait(1)
        }
    } catch (error) {
        console.error(error);
    }
    cb();
}