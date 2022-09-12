// IF YOU GOING THROUGH THIS CODE, SORRY FOR THE MANY COMMENTS.
// THEY ARE THERE FOR LEARNING/REFERENCE PURPOSES.
// READABILITY WAS NOT A PRIORITY IN THIS CASE.

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//same as
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

const { verify } = require("../utils/verify")

//syntax A
/* function deployFunc (hre) {
console.log("Hi!");
}
module.exports.default = deployFunc */

// syntax B (recommended)
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X use address Y
    // if chainId is Z use address A
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    )
    log("Deploying FundMe and waiting for confirmations...")

    //if the contract doesn't exist, we deploy a minimal version of it
    //for our local testing

    // what happens when we want to change chains?
    // when going for localhost or hardhat network, we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args:
            /* address? */
            args,
        //put price feed address
        log: true,
        // on a live network, we need to wait so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args)
    }
    log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    )
}
// same as
/* module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    //same as 
    // hre.getNamedAccounts
    // hre.deployments
} */

module.exports.tags = ["all", "fundme"]
