//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

pragma solidity ^0.8.18;

contract ERC1155Task is ERC1155 {
    uint256 public constant TOKENS = 0;

    constructor(string memory _url)
        ERC1155(
            _url
        )
    {}

    function mint(address _account, uint256 _id, uint256 _amount) external {
        _mint(_account, _id, _amount, "");
    }
}
