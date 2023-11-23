const {network} = require("hardhat");
const {developmentChains, tokenURI} = require("../helper-hardhat-config");
const {verify} = require("../utils/verification");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    log("--------------------------------------------------------------");
    log("Deploying ERC1155Task please wait...");

    const arguments = [tokenURI];

    const erc1155Task = await deploy("ERC1155Task", {
        contract: "ERC1155Task",
        from: deployer,
        log: true,
        args: arguments,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying contract please wait");
        await verify(erc1155Task.address, arguments);
        log("Contract successfully verified");
    }

    log("--------------------------------------------------------------");

}

module.exports.tags = ["all", "ERC1155"];