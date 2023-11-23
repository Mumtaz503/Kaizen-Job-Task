const {network} = require("hardhat");
const {developmentChains, pricePerNFT} = require("../helper-hardhat-config");
const {verify} = require("../utils/verification");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    log("--------------------------------------------------------------");
    log("Deploying Task NFT please wait...")

    const arguments = [pricePerNFT];

    const taskNft = await deploy("TaskNFT", {
        contract: "TaskNFT",
        from: deployer,
        log: true,
        args: arguments,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying contract please wait...")
        await verify(taskNft.address, arguments);
    }

    log("--------------------------------------------------------------");

}

module.exports.tags = ["all", "ERC721A"];