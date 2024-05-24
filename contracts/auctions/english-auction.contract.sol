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

    struct Bid {
        uint256 deposit;
        address bidder;
    }

    mapping(uint256 => Auction) public auctions_list;
    mapping(uint256 => Bid[]) public auctions_bids;
    mapping(address => uint256) pending_returns;

    constructor() {
        contract_deployer = payable(msg.sender);
    }

    function create_auction (uint256 bidding_time, address _nft_contract, uint256 _token_id, uint256 initial_price) external returns(Auction memory) {
        require(msg.sender == IERC721(_nft_contract).ownerOf(_token_id), "You are not an owner!");
        
        auctions_counter++;
        Auction memory auction = Auction({
            auction_id: auctions_counter,
            beneficiary: msg.sender,
            nft_contract: _nft_contract,
            token_id: _token_id,
            auction_end_time: block.timestamp + bidding_time,
            highest_bidder: address(0),
            highest_bid: initial_price
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
        require(amount <= auction.highest_bid, "Proposed price is lower than the highest bid!");

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

        auctions_bids[auction_id].push(Bid({
            deposit: msg.value,
            bidder: msg.sender
        }));

        return true;
    }

    function get_all_auction_bids(uint256 auction_id) external view returns(Bid[] memory) {
        uint256 bid_count = auctions_bids[auction_id].length;
        Bid[] memory bids = new Bid[](bid_count);

        for (uint256 bid_id = 0; bid_id < bid_count; bid_id++) {
            Bid memory current_bid = auctions_bids[auction_id][bid_id];
            bids[bid_id] = current_bid;
        }

        return bids;
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
        
        if (auction.highest_bid > 0 && auction.highest_bidder != address(0)) {
            uint256 pure_profit = auction.highest_bid - (auction.highest_bid / 100);
            IERC721(auction.nft_contract).transferFrom(address(this), auction.highest_bidder, auction.token_id);
            payable(auction.beneficiary).transfer(pure_profit);
        } else {
            IERC721(auction.nft_contract).transferFrom(address(this), auction.beneficiary, auction.token_id);
        }
    }
}