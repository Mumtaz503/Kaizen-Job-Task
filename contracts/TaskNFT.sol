//SPDX-License-Identifier: MIT

import "erc721a/contracts/ERC721A.sol";
import "./TaskToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.18;

error TaskNFT__SendSomeTokens();
error TaskNFT__NotEnoughBalance();
error TaskNFT__AllowanceExceeded();

contract TaskNFT is ERC721A, Ownable {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    string private s_imageURI;

    TaskToken private s_taskToken;

    uint256 private immutable i_pricePerNft;

    event NftsMintedAmount(uint256 indexed amountMinted, address mintedTo);

    constructor(uint256 _pricePerNft) ERC721A("Task NFT Token", "TSKN") {
        i_pricePerNft = _pricePerNft;
    }

    function mint(uint256 _amountToMint) external {
        if (_amountToMint == 0) {
            revert TaskNFT__SendSomeTokens();
        }

        uint256 paymentInERC20 = _amountToMint * i_pricePerNft;

        if (
            s_taskToken.allowance(msg.sender, address(this)) >= paymentInERC20
        ) {
            revert TaskNFT__AllowanceExceeded();
        }

        if (s_taskToken.balanceOf(msg.sender) < paymentInERC20) {
            revert TaskNFT__NotEnoughBalance();
        } else {
            s_taskToken.transferFrom(msg.sender, address(this), paymentInERC20);
            _safeMint(msg.sender, _amountToMint);
            emit NftsMintedAmount(_amountToMint, msg.sender);
        }
    }

    function withdrawTokens() public onlyOwner {
        require(
            s_taskToken.balanceOf(address(this)) > 0,
            "No tokens in contract"
        );

        s_taskToken.approve(address(this), balanceOf(address(this)));
        s_taskToken.transferFrom(
            address(this),
            msg.sender,
            balanceOf(address(this))
        );
    }

    /* Helper functions */
    function _baseURI() internal pure override returns (string memory) {
        return TOKEN_URI;
    }

    function getPricePerNft() public view returns (uint256) {
        return i_pricePerNft;
    }

    function getTokenURI() public pure returns (string memory) {
        return TOKEN_URI;
    }
}
