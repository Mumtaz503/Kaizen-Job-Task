
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
const tokenURI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

module.exports = {
    networkConfig,
    pricePerETH,
    developmentChains,
    pricePerNFT, 
    tokenURI
}