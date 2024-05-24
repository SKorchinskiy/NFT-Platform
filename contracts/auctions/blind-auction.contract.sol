// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketBlindAuctionContract {
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
        bool is_blind;
    }

    struct Bid {
        bytes32 blindedBid;
        uint256 deposit;
        address bidder;
    }

    mapping(uint256 => Auction) public auctions_list;
    mapping(uint256 => Bid[]) public auctions_bids;
    mapping(address => uint256) pending_returns;

    bytes32 internal encoding_secret;

    bool is_revealed;

    constructor(bytes32 _secret) {
        contract_deployer = payable(msg.sender);
        encoding_secret = _secret;
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
            highest_bid: initial_price,
            is_blind: true
        });

        IERC721(auction.nft_contract).transferFrom(auction.beneficiary, address(this), auction.token_id);

        auctions_list[auction.auction_id] = auction;

        return auction;
    }

    function bid(uint256 auction_id, bool is_fake) external payable returns(Bid memory) {
        Auction memory auction = auctions_list[auction_id];

        require(msg.value > 0, "Sent value should be greater than 0!");
        require(block.timestamp <= auction.auction_end_time, "Auction has already ended!");

        Bid memory current_bid = Bid({
            blindedBid: keccak256(abi.encodePacked(msg.value, is_fake, encoding_secret)),
            deposit: msg.value,
            bidder: msg.sender
        });

        auctions_bids[auction.auction_id].push(current_bid);

        return current_bid;
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

    modifier onlyAfter(uint256 time) {
        if (block.timestamp < time) {
            revert("You can reveal only after the bidding phase is over!");
        }
        _;
    }

    function reveal(uint256 auction_id) external payable onlyAfter(auctions_list[auction_id].auction_end_time) {
        for (uint256 bid_id = 0; bid_id < auctions_bids[auction_id].length; bid_id++) {
            Bid memory current_bid = auctions_bids[auction_id][bid_id];
            bool is_fake = true;
            if (current_bid.blindedBid == keccak256(abi.encodePacked(current_bid.deposit, is_fake, encoding_secret))) {
                payable(current_bid.bidder).transfer(current_bid.deposit);
            } else if (!place_bid(auction_id, bid_id)) {
                pending_returns[current_bid.bidder] += current_bid.deposit;
            }
        }

        is_revealed = true;
    }

    function place_bid(uint256 auction_id, uint256 bid_id) internal returns(bool success) {
        Bid memory current_bid = auctions_bids[auction_id][bid_id];
        Auction memory current_auction = auctions_list[auction_id];

        if (current_bid.deposit <= current_auction.highest_bid) {
            return false;
        }

        pending_returns[current_auction.highest_bidder] += current_auction.highest_bid;

        current_auction.highest_bidder = current_bid.bidder;
        current_auction.highest_bid = current_bid.deposit;

        auctions_list[auction_id] = current_auction;

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

    function auctionEnd(uint256 auction_id) external payable {
        Auction memory auction = auctions_list[auction_id];
        
        require(block.timestamp > auction.auction_end_time, "Auctions has not ended yet!");
        require(is_revealed, "You can end auction only after the revealing has been performed!");
        
        if (auction.highest_bid > 0 && auction.highest_bidder != address(0)) {
            uint256 pure_profit = auction.highest_bid - (auction.highest_bid / 100);
            IERC721(auction.nft_contract).transferFrom(address(this), auction.highest_bidder, auction.token_id);
            payable(auction.beneficiary).transfer(pure_profit);
        } else {
            IERC721(auction.nft_contract).transferFrom(address(this), auction.beneficiary, auction.token_id);
        }
    }
}