const Sprout = artifacts.require("Sprout");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
    const [feeAccount] = await web3.eth.getAccounts();
    const feePercent = 10;
    await deployer.deploy(Sprout);
    await deployer.deploy(Exchange, feeAccount, feePercent);
};