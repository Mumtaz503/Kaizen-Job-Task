
const networkConfig = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
    },
}


const pricePerETH = "300000";
const developmentChains = ["hardhat", "localhost"];
const pricePerNFT = "100";

module.exports = {
    networkConfig,
    pricePerETH,
    developmentChains,
    pricePerNFT
}