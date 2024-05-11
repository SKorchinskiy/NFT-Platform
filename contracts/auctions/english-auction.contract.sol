// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketEnglishAuctionContract {

    uint256 public auctions_counter;
    address payable contract_deployer;

    struct Auction {
        uint256 auction_id;
        address beneficiary;
        address nft_contract;
        uint256 token_id;
        uint256 auction_end_time;
        address highest_bidder;
        uint256 highest_bid;
    }

    mapping(uint256 => Auction) public auctions_list;
    mapping(address => uint256) pending_returns;

    constructor() {
        contract_deployer = payable(msg.sender);
    }

    function create_auction (uint256 bidding_time, address _nft_contract, uint256 _token_id) external returns(Auction memory) {
        require(msg.sender == IERC721(_nft_contract).ownerOf(_token_id), "You are not an owner!");
        
        auctions_counter++;
        Auction memory auction = Auction({
            auction_id: auctions_counter,
            beneficiary: msg.sender,
            nft_contract: _nft_contract,
            token_id: _token_id,
            auction_end_time: block.timestamp + bidding_time,
            highest_bidder: address(0),
            highest_bid: 0
        });

        IERC721(auction.nft_contract).transferFrom(auction.beneficiary, address(this), auction.token_id);

        auctions_list[auction.auction_id] = auction;

        return auction;
    }

    function bid(uint256 auction_id) external payable returns(bool success) {
        address bidder = msg.sender;
        uint256 amount = msg.value;

        Auction memory auction = auctions_list[auction_id];

        require(block.timestamp <= auction.auction_end_time, "Auction has already ended!");

        if (amount <= auction.highest_bid) {
            return false;
        }

        pending_returns[auction.highest_bidder] += auction.highest_bid;

        auction.highest_bidder = bidder;
        auction.highest_bid = amount;

        auctions_list[auction.auction_id] = Auction({
            auction_id: auction.auction_id,
            beneficiary: auction.beneficiary,
            nft_contract: auction.nft_contract,
            token_id: auction.token_id,
            auction_end_time: auction.auction_end_time,
            highest_bidder: auction.highest_bidder,
            highest_bid: auction.highest_bid
        });

        return true;
    }

    function get_all_auctions() external view returns(Auction[] memory) {
        Auction[] memory auctions = new Auction[](auctions_counter);
        
        for (uint256 auction_id = 1; auction_id <= auctions_counter; auction_id++) {
            Auction memory auction = auctions_list[auction_id];
            auctions[auction_id - 1] = auction;
        }

        return auctions;
    }


    function withdraw() external payable {
        uint256 amount = pending_returns[msg.sender];

        require(amount > 0, "You do not have any pending returns!");

        pending_returns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function auctionEnd(uint256 auction_id) external payable {
        Auction memory auction = auctions_list[auction_id];

        require(block.timestamp > auction.auction_end_time, "Auctions has not ended yet!");
        
        if (auction.highest_bid > 0) {
            uint256 pure_profit = auction.highest_bid - (auction.highest_bid / 100);
            IERC721(auction.nft_contract).transferFrom(address(this), auction.highest_bidder, auction.token_id);
            payable(auction.beneficiary).transfer(pure_profit);
        } else {
            IERC721(auction.nft_contract).transferFrom(address(this), auction.beneficiary, auction.token_id);
        }
    }
}