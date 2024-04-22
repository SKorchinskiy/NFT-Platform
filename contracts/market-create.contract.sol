// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketCreateContract {
    address payable holder;
    
    uint256 minting_fee = 0.075 ether;
    uint256 listing_fee = 0.025 ether;

    uint256 token_seq_id;
    uint256 sold_seq_id;

    struct NFT {
        uint256 seq_id;
        uint256 token_id;
        address payable token_seller;
        address payable token_holder;
        uint256 token_price;
        address nft_contract;
    }

    mapping(uint256 => NFT) nft_assets;

    function create_nft_asset(address _nft_contract, uint256 _token_id, uint256 _price) external payable {
        require(
            msg.value == listing_fee,
            "Listing fee must be paid to list a token! The fee is 0.025 ether!"
        );
        
        token_seq_id++;

        address payable seller = payable(msg.sender);

        NFT memory nft_asset = NFT({
            seq_id: token_seq_id,
            token_id: _token_id,
            token_seller: seller,
            token_holder: holder,
            token_price: _price,
            nft_contract: _nft_contract
        });

        nft_assets[token_seq_id] = nft_asset;
        IERC721(_nft_contract).transferFrom(seller, address(this), _token_id);
    }

    function purchase_nft(address _nft_contract, uint256 seq_id) external payable {
        NFT storage token = nft_assets[seq_id];
        require(
            msg.value == token.token_price,
            "Token price doesn't equal to received amount of ether!"
        );

        token.token_holder = payable(msg.sender);
        token.token_seller.transfer(token.token_price);
        IERC721(_nft_contract).transferFrom(address(this), msg.sender, token.token_id);
        sold_seq_id++;
    }

    function cancel_nft_listing(address _nft_contract, uint256 _token_id) external {
        NFT storage token = nft_assets[_token_id];
        require(
            msg.sender == token.token_seller,
            "Listing can only be canceled by token seller!"
        );

        IERC721(_nft_contract).transferFrom(address(this), msg.sender, _token_id);
        token.token_holder = payable(msg.sender);
    }

    function get_all_available_nfts() external view returns(NFT[] memory) {
        uint256 item_id = 0;
        uint256 available_supply = token_seq_id - sold_seq_id;
        NFT[] memory available_tokens = new NFT[](available_supply);

        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (nft_assets[iter].token_holder == address(this)) {
                available_tokens[item_id++] = nft_assets[iter];
            }
        }

        return available_tokens;
    }

    function get_user_owned_nfts() external view returns(NFT[] memory) {
        uint256 user_token_count = 0;
        uint256 user_token_seq_id = 0;

        for (uint256 iter = 0; iter < token_seq_id; iter++) {
            if (nft_assets[iter].token_holder == msg.sender) {
                user_token_count++;
            }
        }

        NFT[] memory user_tokens = new NFT[](user_token_count);
        for (uint256 iter = 0; iter < token_seq_id; iter++) {
            if (nft_assets[iter].token_holder == msg.sender) {
                user_tokens[user_token_seq_id++] = nft_assets[iter];
            }
        }

        return user_tokens;
    }

    function get_user_listed_nfts() external view returns(NFT[] memory) {
        uint256 listed_user_token_count = 0;
        uint256 listed_user_token_seq_id = 0;

        for (uint256 iter = 0; iter < token_seq_id; iter++) {
            if (nft_assets[iter].token_holder == address(this)) {
                listed_user_token_count++;
            }
        }

        NFT[] memory listed_user_tokens = new NFT[](listed_user_token_count);
        for (uint256 iter = 0; iter < token_seq_id; iter++) {
            if (nft_assets[iter].token_holder == address(this)) {
                listed_user_tokens[listed_user_token_seq_id++] = nft_assets[iter];
            }
        }

        return listed_user_tokens;
    }

    function withdraw_profit() external {
        require(
            msg.sender == holder,
            "Only the owner of the contract can withdraw profit!"
        );

        holder.transfer(address(this).balance);
    }
}