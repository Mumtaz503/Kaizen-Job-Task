//SPDX-License-Identifier: MIT

import "erc721a/contracts/ERC721A.sol";
import "./TaskToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC1155Task.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.18;

error TaskNFT__SendSomeTokens();
error TaskNFT__NotEnoughBalance();
error TaskNFT__AllowanceExceeded();
error TaskNFT__NotOwner();

contract TaskNFT is ERC721A, Ownable {
    string private s_tokenUri;
    string private s_imageURI;
    uint256 private constant MAX_MINTS = 5;
    uint256 private constant TOTAL_SUPPLY = 100;

    TaskToken private s_taskToken;
    ERC1155Task private s_erc1155Task;

    uint256 private immutable i_pricePerNft;

    event NftsMintedAmount(uint256 indexed amountMinted, address mintedTo);
    event NftsBurned(
        uint256 indexed tokenId,
        uint256 amountMinted,
        address burnedBy
    );

    constructor(
        uint256 _pricePerNft,
        string memory _uri
    ) ERC721A("Task NFT Token", "TSKN") {
        i_pricePerNft = _pricePerNft;
        s_tokenUri = _uri;
    }

    function mint(uint256 _amountToMint) external {
        //console log statement
        console.log("working");

        if (_amountToMint == 0) {
            revert TaskNFT__SendSomeTokens();
        }

        uint256 paymentInERC20 = _amountToMint * i_pricePerNft;

        if (s_taskToken.allowance(msg.sender, address(this)) < paymentInERC20) {
            revert TaskNFT__AllowanceExceeded();
        }

        if (s_taskToken.balanceOf(msg.sender) < paymentInERC20) {
            revert TaskNFT__NotEnoughBalance();
        } else {
            require(
                _amountToMint + _numberMinted(msg.sender) <= MAX_MINTS,
                "You cannot mint more"
            );
            require(
                totalSupply() + _amountToMint <= TOTAL_SUPPLY,
                "Limit Reached"
            );
            s_taskToken.transferFrom(msg.sender, address(this), paymentInERC20);
            _mint(msg.sender, _amountToMint);
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

    /* Burns one token of tokenId: _tokenId */
    function burnNft(uint256 _tokenId) external {
        require(_exists(_tokenId), "Token Doesn't exist");

        if (ownerOf(_tokenId) != msg.sender) {
            revert TaskNFT__NotOwner();
        }

        _burn(_tokenId);
        s_erc1155Task.mint(msg.sender, 0, 100);

        emit NftsBurned(_tokenId, 100, msg.sender);
    }

    /* Helper functions */
    function _baseURI() internal view override returns (string memory) {
        return s_tokenUri;
    }

    function getPricePerNft() public view returns (uint256) {
        return i_pricePerNft;
    }

    function getTokenURI() public view returns (string memory) {
        return s_tokenUri;
    }
}
