const {network, ethers} = require("hardhat");
const {developmentChains, pricePerNFT, tokenURI} = require("../helper-hardhat-config");
const {verify} = require("../utils/verification");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    log("--------------------------------------------------------------");
    log("Deploying Task NFT please wait...")

    const tokenAddress = await ethers.getContract("TaskToken");
    const erc1155Task = await ethers.getContract("ERC1155Task");

    const arguments = [pricePerNFT, tokenURI, tokenAddress.target, erc1155Task.target];

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