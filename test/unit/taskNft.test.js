const { expect, assert } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

    describe("Task ERC721 Token unit tests", function () {
        let taskToken, nftToken, erc1155Task, deployer, deployerSigner, user, userSigner;

        beforeEach(async () => {
            user = (await getNamedAccounts()).user;
            userSigner = ethers.provider.getSigner(user);
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

                const buyerBalance = await nftToken.balanceOf(deployer);
                assert.equal(buyerBalance.toString(), nftsToBuy.toString());
            });

            it("Should transfer ERC20 tokens to the contract", async function () {
                const nftsToBuy = BigInt(2);
                const tokensToTransfer = BigInt(100);
                await taskToken.approve(nftToken.target, tokensToTransfer);
                await nftToken.mint(nftsToBuy); 

                const contractBalance = await taskToken.balanceOf(nftToken.target);
                assert.equal(contractBalance.toString(), tokensToTransfer.toString());
            });
        });

        describe("withdrawToken function and burnNft function", () => {
            beforeEach(async function () {
                const nftsToBuy = BigInt(2);
                const tokensToTransfer = BigInt(100);
                await taskToken.approve(nftToken.target, tokensToTransfer);
                await nftToken.mint(nftsToBuy);
            });

            it("Should transfer the contract balance to the owner", async () => {
                const deployerBalanceBefore = await taskToken.balanceOf(deployer);
                const contractBalanceBefore = await taskToken.balanceOf(nftToken.target);
            
                await nftToken.withdrawTokens();
            
                const deployerBalanceAfter = await taskToken.balanceOf(deployer);
                const contractBalanceAfter = await taskToken.balanceOf(nftToken.target);
            
                expect(deployerBalanceAfter).to.be.gt(deployerBalanceBefore);
                expect(contractBalanceAfter).to.equal(0);
            });

            it("Should revert if token Id doesn't exist", async () => {
                const tx = await nftToken.burnNft(1);
                await tx.wait(1);

                console.log(tx.toString());
            });
        });
    });