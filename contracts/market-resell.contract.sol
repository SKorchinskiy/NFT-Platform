// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketResellContract {
    uint256 counter;
    address payable market_adr;
    uint256 listing_fee = 0.0025 ether;

    ERC721Enumerable nft_service;

    enum Status { NONE, CANCELED, ACTIVE, SOLD }

    struct NFT {
        uint256 token_id;
        uint256 token_price;
        address payable token_seller;
        address payable token_holder;
        Status status;
    }

    event TokenListed(
        uint256 token_id,
        address token_seller,
        address token_holder,
        uint256 token_price,
        Status token_status
    );

    event TokenListingCanceled(
        uint256 token_id,
        address token_owner,
        Status token_status
    );

    event TokenPurchased(
        uint256 token_id,
        address token_buyer,
        uint256 token_price,
        Status token_status
    );

    mapping(uint256 => NFT) nft_assets;

    constructor() {
        market_adr = payable(msg.sender);
    }

    function list_token(uint256 _token_id, uint256 _token_price) external payable {
        require(
            nft_service.ownerOf(_token_id) == msg.sender,
            "Permission denied! You must own nft with provided id!"
        );
        require(
            nft_assets[_token_id].token_id == 0,
            "Received nft-token has been already listed!"
        );
        require(
            msg.value == listing_fee,
            "Listing fee must be equal to 0.0025 ether"
        );

        address payable nft_owner = payable(msg.sender);
        NFT memory nft_repr = NFT({
            token_id: _token_id,
            token_price: _token_price,
            token_seller: nft_owner,
            token_holder: market_adr,
            status: Status.ACTIVE
        });

        nft_assets[_token_id] = nft_repr;
        nft_service.transferFrom(
            nft_owner, 
            market_adr, 
            _token_id
        );
    }

    function cancel_token_listing(uint256 _token_id) external {
        address payable request_adr = payable(msg.sender);
        NFT storage target_nft = nft_assets[_token_id];
        
        require(
            request_adr == target_nft.token_seller,
            "This action can be performed only by nft owner!"
        );
        require(
            target_nft.status == Status.ACTIVE,
            "Requested nft is not active!"
        );

        target_nft.status = Status.CANCELED;
        nft_service.transferFrom(
            target_nft.token_holder, 
            target_nft.token_seller, 
            target_nft.token_id
        );
    }

    function purchase_listed_nft(uint256 _token_id) external payable {
        address payable buyer = payable(msg.sender);
        NFT storage target_nft = nft_assets[_token_id];
        uint256 proposed_price = msg.value;

        require(
            target_nft.status == Status.ACTIVE,
            "Requested nft is not active!"
        );
        require(
            target_nft.token_price == proposed_price,
            "Proposed price is not equal to nft price!"
        );

        target_nft.status = Status.SOLD;

        nft_service.transferFrom(
            target_nft.token_holder, 
            buyer, 
            _token_id
        );
        target_nft.token_seller.transfer(proposed_price);
    }

    function get_listing_fee() external view returns(uint256) {
        return listing_fee;
    }

    function get_nft_price(uint256 _token_id) external view returns(uint256) {
        NFT memory target_token = nft_assets[_token_id];
        return target_token.token_price;
    }

    function get_listed_nft() external view returns(NFT[] memory) {
        uint256 supply = nft_service.totalSupply();
        NFT[] memory tokens = new NFT[](supply);
        
        for (uint256 index = 0; index < supply; index++) {
            uint256 token_id = nft_service.tokenByIndex(supply);
            NFT storage token = nft_assets[token_id];
            tokens[index] = token;
        }

        return tokens;
    }
}