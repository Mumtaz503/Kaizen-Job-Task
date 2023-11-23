//SPDX-License-Identifier: MIT

import "erc721a/contracts/ERC721A.sol";
import "./TaskToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC1155Task.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.18;

error TaskNFT__SendSomeTokens();
error TaskNFT__NotEnoughBalance();
error TaskNFT__AllowanceExceeded();
error TaskNFT__NotOwner();

contract TaskNFT is ERC721A, Ownable {
    IERC20 private s_taskToken;

    string private s_tokenUri;
    string private s_imageURI;

    ERC1155Task private s_erc1155Task;

    uint256 private immutable i_pricePerNft;

    event NftsMintedAmount(uint256 indexed amountMinted, address mintedTo);
    event NftsBurned(
        uint256 indexed tokenId,
        uint256 amountMinted,
        address burnedBy
    );

    mapping(address => uint256) private s_addressToBurnedNfts;

    constructor(
        uint256 _pricePerNft,
        string memory _uri,
        address _taskTokenAddress,
        address _erc1155Task
    ) ERC721A("Task NFT Token", "TSKN") {
        i_pricePerNft = _pricePerNft;
        s_tokenUri = _uri;
        s_taskToken = IERC20(_taskTokenAddress);
        s_erc1155Task = ERC1155Task(_erc1155Task);
    }

    function mint(uint256 _amountToMint) external {
        require(_amountToMint > 0, "Enter valid amount");

        // console.log("Working");

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
            s_taskToken.transferFrom(msg.sender, address(this), paymentInERC20);
            _safeMint(msg.sender, _amountToMint, "");
            emit NftsMintedAmount(_amountToMint, msg.sender);
        }
    }

    function withdrawTokens() public onlyOwner {
        uint256 contractBalance = s_taskToken.balanceOf(address(this));
        require(contractBalance > 0, "No tokens in contract");

        require(s_taskToken.transfer(owner(), contractBalance));
    }

    /* Burns one token of tokenId: _tokenId */
    function burnNft(uint256 _tokenId) external {
        require(_exists(_tokenId), "Token Doesn't exist");

        if (ownerOf(_tokenId) != msg.sender) {
            revert TaskNFT__NotOwner();
        }

        uint256 erc1155TokenId = s_erc1155Task.getTokens();

        _burn(_tokenId);
        s_erc1155Task.mint(msg.sender, erc1155TokenId, 100);
        s_addressToBurnedNfts[msg.sender] += _tokenId;

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
