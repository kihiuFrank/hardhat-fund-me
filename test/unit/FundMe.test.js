const { assert } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
describe("Fund Me", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async function () {
        //deploy our FundMe contract using hardhat deploy

        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})
