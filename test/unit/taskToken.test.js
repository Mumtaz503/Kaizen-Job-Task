const { expect, assert } = require("chai");
const { getNamedAccounts, ethers, deployments } = require("hardhat");

    describe("Task ERC20 Token unit tests", function () {
        let taskToken, deployer, deployerSigner;

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            deployerSigner = ethers.provider.getSigner(deployer);
            await deployments.fixture(["ERC20"]);
            taskToken = await ethers.getContract("TaskToken", deployer);
        });

        describe("buyTaskToken function", () => {
            it("Should revert if called with no value", async function () {
                const amountToBuy = 0;
                await expect(taskToken.buyTaskToken(amountToBuy, {value: 0})).to.be.revertedWith("Please Enter a valid amount");
            });

            it("Should revert if not enough ETH is sent", async function () {
                const amountToBuy = 100;
                const valueToSend = ethers.parseEther("0.45");
                await expect(taskToken.buyTaskToken(amountToBuy, {value: valueToSend})).to.be.reverted;
            });

            it("Should mint the tokens to the buyer's address", async function () {
                const amountToBuy = 100;
                const valueToSend = ethers.parseEther("0.49");
                const buyerBalanceBefore = await taskToken.balanceOf(deployer);

                await taskToken.buyTaskToken(amountToBuy, {value: valueToSend});

                const buyerBalanceAfter = await taskToken.balanceOf(deployer);

                assert(buyerBalanceAfter.toString() > buyerBalanceBefore.toString());
            });

            it("Should emit the event after the mint", async function () {
                const amountToBuy = 100;
                const valueToSend = ethers.parseEther("0.49");

                await expect(taskToken.buyTaskToken(amountToBuy, {value: valueToSend})).to.emit(taskToken, "TokensBought");
            });
        });

        describe("withdrawETH function", () => {
            it("Should revert if the contract has no balance", async function () {
                await expect(taskToken.withdrawETH()).to.be.reverted;
            });

            it("Should withdraw funds to a single account", async function () {
                const startingDeployerBalance = await ethers.provider.getBalance(deployer);
                
                const amountToBuy = 100;
                const valueToSend = ethers.parseEther("0.49");
                await taskToken.buyTaskToken(amountToBuy, {value: valueToSend});
                const startingContractBalance = await ethers.provider.getBalance(taskToken.getAddress());

                const transactionResponse = await taskToken.withdrawETH();
                const transactionReceipt = await transactionResponse.wait(1);
                const {gasUsed, effectiveGasPrice} = transactionReceipt;
                const gasUsedBigInt = BigInt(gasUsed);
                const effectiveGasPriceBigInt = BigInt(effectiveGasPrice);
                const gasCost = gasUsedBigInt * effectiveGasPriceBigInt;

                const finalBuyerBalance = await ethers.provider.getBalance(deployer);
                const finalContractBalance = await ethers.provider.getBalance(taskToken.getAddress());

                assert.equal(finalContractBalance.toString(), 0);
            });
        });
    });