//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.18;

/* Custom Error Codes */
error TaskToken__NotEnoughEthSent();
error TaskToken__NotEnoughBalance();
error TaskToken__IssueWithTransfer();

contract TaskToken is ERC20, Ownable {
    uint256 private immutable i_pricePerETH;

    event TokensBought(uint256 indexed amountBought);
    event FundsWithdrawn(uint256 indexed ethWithdrawn);

    constructor(uint256 _pricePerETH) ERC20("Task Token", "TSK") {
        i_pricePerETH = _pricePerETH;
    }

    function buyTaskToken(uint256 _amountToBuy) public payable {
        require(_amountToBuy > 0, "Please Enter a valid amount");

        uint256 payment = _amountToBuy * i_pricePerETH;

        if (msg.value < payment) {
            revert TaskToken__NotEnoughEthSent();
        }

        _mint(msg.sender, _amountToBuy);
        emit TokensBought(_amountToBuy);
    }

    function withdrawETH() public onlyOwner {
        if (address(this).balance == 0) {
            revert TaskToken__NotEnoughBalance();
        }

        (bool success, ) = owner().call{value: address(this).balance}("");

        if (!success) {
            revert TaskToken__IssueWithTransfer();
        }

        emit FundsWithdrawn(address(this).balance);
    }

    /* Helper functions */

    function getPricePerETH() public view returns (uint256) {
        return i_pricePerETH;
    }
}
