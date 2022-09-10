const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

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

    if (chainId == "31337") {
        log("Local network detected! Deploying Mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks Deployed!")
        log(
            ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
        )
    }
}
// same as
/* module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    //same as 
    // hre.getNamedAccounts
    // hre.deployments
} */

module.exports.tags = ["all", "mocks"]
