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

    mapping(uint256 => NFT) public nft_assets;
    mapping(uint256 => NFT) public purchase_history;

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

    error OwnershipRejection(
        string message
    );
    error nonActiveToken(
        uint256 token_id,
        Status token_status
    );
    error InappropriateTokenCost(
        uint256 expected_amount, 
        uint256 received_amount
    );
    error DuplicateTokenListing(
        uint256 token_id
    );
    error InappropriateListingFee(
        uint256 expected_fee, 
        uint256 received_fee
    );

    modifier validateListingFee() {
        if (msg.value != listing_fee)
            revert InappropriateListingFee({
                expected_fee: listing_fee,
                received_fee: msg.value
            });
        _;
    }

    constructor(ERC721Enumerable _nft) {
        nft_service = _nft;
        market_adr = payable(msg.sender);
    }

    function list_token(uint256 _token_id, uint256 _token_price) external payable validateListingFee {
        if (nft_service.ownerOf(_token_id) != msg.sender) {
            revert OwnershipRejection({
                message: "Permission denied! You must own nft with provided id!"
            });
        } else if (nft_assets[_token_id].token_id != 0) {
            revert DuplicateTokenListing({
                token_id: _token_id
            });
        }

        address payable nft_owner = payable(msg.sender);
        NFT memory nft_repr = NFT({
            token_id: _token_id,
            token_price: _token_price,
            token_seller: nft_owner,
            token_holder: payable(address(this)),
            status: Status.ACTIVE
        });

        nft_assets[_token_id] = nft_repr;
        nft_service.transferFrom(
            nft_owner, 
            address(this), 
            _token_id
        );

        emit TokenListed({
            token_id: _token_id,
            token_seller: nft_owner,
            token_holder: address(this),
            token_price: _token_price,
            token_status: Status.ACTIVE
        });
    }

    function cancel_token_listing(uint256 _token_id) external {
        address payable request_adr = payable(msg.sender);
        NFT storage target_nft = nft_assets[_token_id];
        
        if (request_adr != target_nft.token_seller){
            revert OwnershipRejection({
                message: "This action can be performed only by nft owner!"
            });
        } else if (target_nft.status != Status.ACTIVE){
            revert nonActiveToken({
                token_id: target_nft.token_id,
                token_status: target_nft.status
            });
        }

        target_nft.status = Status.CANCELED;
        nft_service.transferFrom(
            target_nft.token_holder, 
            target_nft.token_seller, 
            target_nft.token_id
        );

        emit TokenListingCanceled({
            token_id: _token_id,
            token_owner: target_nft.token_seller,
            token_status: target_nft.status
        });
        delete nft_assets[_token_id];
    }

    function purchase_listed_nft(uint256 _token_id) external payable {
        address payable buyer = payable(msg.sender);
        NFT storage target_nft = nft_assets[_token_id];
        uint256 proposed_price = msg.value;

        if (target_nft.status != Status.ACTIVE){
            revert nonActiveToken({
                token_id: target_nft.token_id,
                token_status: target_nft.status
            });
        } else if (target_nft.token_price != proposed_price){
            revert InappropriateTokenCost({
                expected_amount: target_nft.token_price,
                received_amount: proposed_price
            });
        }


        nft_service.transferFrom(
            target_nft.token_holder, 
            buyer, 
            _token_id
        );
        
        target_nft.status = Status.SOLD;
        target_nft.token_seller.transfer(proposed_price);
        target_nft.token_holder = payable(msg.sender);

        emit TokenPurchased({
            token_id: _token_id,
            token_buyer: msg.sender,
            token_price: msg.value,
            token_status: target_nft.status
        });

        NFT memory nft_repr = NFT({
            token_id: target_nft.token_id,
            token_price: target_nft.token_price,
            token_seller: target_nft.token_seller,
            token_holder: target_nft.token_holder,
            status: target_nft.status
        });
        
        purchase_history[counter] = nft_repr;
        counter++;

        delete nft_assets[_token_id];
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
        uint256 current_id = 0;
        NFT[] memory tokens = new NFT[](supply);
        
        for (uint256 index = 0; index < supply; index++) {
            uint256 token_id = nft_service.tokenByIndex(index);
            if (nft_assets[token_id].token_holder == address(this)) {
                NFT storage token = nft_assets[token_id];
                tokens[current_id++] = token;
            }
        }

        return tokens;
    }

    function get_purchased_tokens() external view returns(NFT[] memory) {
        NFT[] memory tokens = new NFT[](counter);

        for (uint256 index = 0; index < counter; index++) {
            NFT storage token = purchase_history[index];
            tokens[index] = token;
        }

        return tokens;
    }
}