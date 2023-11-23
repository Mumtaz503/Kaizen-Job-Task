
const networkConfig = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
    },
}


const pricePerETH = "4900000000000000";  //Price of 1 token in wei
const developmentChains = ["hardhat", "localhost"];
const pricePerNFT = "100";

module.exports = {
    networkConfig,
    pricePerETH,
    developmentChains,
    pricePerNFT
}