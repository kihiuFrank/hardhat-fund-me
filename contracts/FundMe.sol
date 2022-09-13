// IF YOU GOING THROUGH THIS CODE, SORRY FOR THE MANY COMMENTS.
// THEY ARE THERE FOR LEARNING/REFERENCE PURPOSES.
// READABILITY WAS NOT A PRIORITY IN THIS CASE.

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Get Funds From Users
//Withdraw Funds
//Set a minimum funding value in USD

// SPDX-License-Identifier: GPL-3.0
// 1. Pragma
pragma solidity ^0.8.7;
// 2. Imports
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// 3. Interfaces, Libraries, Contracts
error FundMe__NotOwner();

/** @title A contract for crowd funding
 * @author Kihiu Frank
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;

    // Events (we have none!)

    // Modifiers
    modifier onlyOwner() {
        //require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //What happens if someone sends this contract ETH without calling fund()?
    //receive()
    //fallback()

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     * @dev This implements price feeds as our library
     */
    function fund() public payable {
        //Want to be able to set minimum fund amount in USD
        // 1. How do we send ETH to this contract

        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Didn't send enough!" //error message if require fails
        ); // 1e18 = 1*10 ** 18 == 1000000000000000000
        // this has 18 decimals

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        /* starting Index, ending index, step amount */
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        //reset the array
        funders = new address[](0);

        /*        // withdrawing the funds (#WAYS)
        // 1. Transfer (capped at 2300 gas, throws error)
        //msg.sender = address     // payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);
        // 2. Send (capped at 2300 gas, returns bool)
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send Failed!");
*/

        // 3. Call (forward all gas or set gas, returns bool)
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed!");
    }
}
