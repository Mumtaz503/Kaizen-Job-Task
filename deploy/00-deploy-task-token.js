const { network } = require("hardhat");
const { developmentChains, pricePerETH } = require("../helper-hardhat-config");
const { verify } = require("../utils/verification");


module.exports = async function({getNamedAccounts, deployments}) {
    const {deployer} = await getNamedAccounts();
    const {deploy, log} = deployments;

    const constructorArgument = [pricePerETH];

    log("--------------------------------------------------------------");
    log("Deploying Task Token...");

    const taskToken = await deploy("TaskToken", {
        contract: "TaskToken",
        from: deployer,
        args: constructorArgument,
        log: true,
        waitConfirmations: 1,
    });

    log(`Task Token successfully deployed at ${taskToken.address}`);

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying contract on the network please wait...");
        await verify(taskToken.address, constructorArgument);
        log("Contract successfully verified");
    }

    log("--------------------------------------------------------------");
}

module.exports.tags = ["all", "ERC20"];