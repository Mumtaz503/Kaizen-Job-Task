const { expect, assert } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

    describe("Task ERC721 Token unit tests", function () {
        let taskToken, nftToken, erc1155Task, deployer, deployerSigner;

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            deployerSigner = ethers.provider.getSigner(deployer);
            await deployments.fixture(["all"]);
            taskToken = await ethers.getContract("TaskToken", deployer);
            nftToken = await ethers.getContract("TaskNFT", deployer);
            erc1155Task = await ethers.getContract("ERC1155Task", deployer);

            const amountToBuy = BigInt(500);
            const valueToSend = ethers.parseUnits("2450000000000000000", "wei");

            await taskToken.buyTaskToken(amountToBuy, {value: valueToSend});
        });

        describe("mint function", () => {
            it("Should mint the NFT to the user", async function () {
                const nftsToBuy = BigInt(1);
                await taskToken.approve(nftToken.target, 100);
                await nftToken.mint(nftsToBuy);
                // const buyersBalance = await nftToken.balanceOf(deployer.getAddress());

                // assert.equal(buyersBalance.toString(), nftsToBuy.toString());
            });
        });
    });