// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MarketCreateContract {
    address payable holder;
    address payable owner;
    
    uint256 minting_fee = 0.0075 ether;
    uint256 listing_fee = 0.0025 ether; 

    uint256 token_seq_id;
    uint256 public purchase_counter;

    enum Status { NONE, CANCELED, ACTIVE, SOLD }

    struct NFT {
        uint256 seq_id;
        uint256 token_id;
        address payable token_seller;
        address payable token_holder;
        uint256 token_price;
        address nft_contract;
        Status status;
    }

    mapping(uint256 => NFT) nft_assets;
    mapping(uint256 => NFT) purchase_history;

    event NFTAssetCreated(
        uint256 seq_id, 
        uint256 token_id, 
        address token_seller,
        address token_holder,
        uint256 token_price,
        address nft_contract
    );
    event NFTPurchased(
        uint256 seq_id,
        uint256 token_id,
        address token_seller,
        address token_buyer,
        uint256 token_price,
        address nft_contract
    );
    event NFTListingCanceled(
        uint256 seq_id,
        uint256 token_id,
        address token_seller,
        address token_holder,
        uint256 token_price,
        address nft_contract
    );
    event ProfitWithdraw(
        address receiver,
        uint256 amount
    );

    error InappropriateListingFee(
        uint256 expected_fee, 
        uint256 received_fee
    );
    error InappropriateTokenCost(
        uint256 expected_amount, 
        uint256 received_amount
    );
    error OwnershipRejection(
        string message
    );

    modifier validateCreationFee() {
        if (msg.value != listing_fee)
            revert InappropriateListingFee({
                expected_fee: listing_fee,
                received_fee: msg.value
            });
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner)
            revert OwnershipRejection({
                message: "Only the owner of the contract can withdraw profit!"
            });
        _;
    }

    constructor() {
        holder = payable(address(this));
        owner = payable(msg.sender);
    }

    function create_nft_asset(
        address _nft_contract, 
        uint256 _token_id,
        uint256 _price
    ) external payable validateCreationFee returns(NFT memory) {
        token_seq_id++;

        address payable seller = payable(msg.sender);

        NFT memory nft_asset = NFT({
            seq_id: token_seq_id,
            token_id: _token_id,
            token_seller: seller,
            token_holder: holder,
            token_price: _price,
            nft_contract: _nft_contract,
            status: Status.ACTIVE
        });

        nft_assets[token_seq_id] = nft_asset;
        
        IERC721(_nft_contract).transferFrom(seller, address(this), _token_id);
        
        emit NFTAssetCreated({
            seq_id: nft_asset.seq_id,
            token_id: nft_asset.token_id,
            token_seller: nft_asset.token_seller,
            token_holder: nft_asset.token_holder,
            token_price: nft_asset.token_price,
            nft_contract: nft_asset.nft_contract
        });

        return nft_assets[token_seq_id];
    }

    function purchase_nft(address _nft_contract, uint256 seq_id) external payable returns(NFT memory) {
        NFT storage token = nft_assets[seq_id];

        if (msg.value != token.token_price)
            revert InappropriateTokenCost({
                expected_amount: token.token_price,
                received_amount: msg.value
            });

        token.token_holder = payable(msg.sender);
        token.status = Status.SOLD;

        token.token_seller.transfer(token.token_price);
        IERC721(_nft_contract).transferFrom(address(this), msg.sender, token.token_id);
        
        emit NFTPurchased({
            seq_id: token.seq_id,
            token_id: token.token_id,
            token_seller: token.token_seller,
            token_buyer: msg.sender,
            token_price: token.token_price,
            nft_contract: token.nft_contract
        });

        NFT memory nft_repr = NFT({
            seq_id: token.seq_id,
            token_id: token.token_id,
            token_seller: token.token_seller,
            token_holder: token.token_holder,
            token_price: token.token_price,
            nft_contract: token.nft_contract,
            status: token.status
        });

        purchase_history[purchase_counter++] = nft_repr;
        
        return token;
    }

    function cancel_nft_listing(address _nft_contract, uint256 _token_id) external {
        NFT storage token = nft_assets[_token_id];
        if (msg.sender != token.token_seller)
            revert OwnershipRejection({
                message: "Listing can only be canceled by token owner!"
            });

        token.token_holder = payable(msg.sender);
        token.status = Status.CANCELED;
        
        IERC721(_nft_contract).transferFrom(address(this), msg.sender, token.token_id);

        emit NFTListingCanceled({
            seq_id: token.seq_id,
            token_id: token.token_id,
            token_seller: token.token_seller,
            token_holder: token.token_holder,
            token_price: token.token_price,
            nft_contract: token.nft_contract
        });
    }

    function get_all_available_nfts() external view returns(NFT[] memory) {
        uint256 item_id = 0;
        uint256 available_supply = 0;
        
        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (
                nft_assets[iter].token_holder == address(this) && 
                nft_assets[iter].status == Status.ACTIVE
            ) {
                available_supply++;
            }
        }
        
        NFT[] memory available_tokens = new NFT[](available_supply);

        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (
                nft_assets[iter].token_holder == address(this) && 
                nft_assets[iter].status == Status.ACTIVE
            ) {
                available_tokens[item_id++] = nft_assets[iter];
            }
        }

        return available_tokens;
    }

    function get_user_owned_nfts() external view returns(NFT[] memory) {
        uint256 user_token_count = 0;
        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (
                nft_assets[iter].token_holder == msg.sender && 
                nft_assets[iter].status == Status.SOLD
            ) {
                user_token_count++;
            }
        }

        NFT[] memory user_tokens = new NFT[](user_token_count);

        uint256 user_token_seq_id = 0;
        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (
                nft_assets[iter].token_holder == msg.sender && 
                nft_assets[iter].status == Status.SOLD
            ) {
                user_tokens[user_token_seq_id++] = nft_assets[iter];
            }
        }

        return user_tokens;
    }

    function get_user_listed_nfts() external view returns(NFT[] memory) {
        uint256 listed_user_token_count = 0;
        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (
                nft_assets[iter].token_seller == msg.sender && 
                nft_assets[iter].status == Status.ACTIVE
            ) {
                listed_user_token_count++;
            }
        }

        NFT[] memory listed_user_tokens = new NFT[](listed_user_token_count);

        uint256 listed_user_token_seq_id = 0;
        for (uint256 iter = 1; iter <= token_seq_id; iter++) {
            if (
                nft_assets[iter].token_seller == msg.sender && 
                nft_assets[iter].status == Status.ACTIVE
            ) {
                listed_user_tokens[listed_user_token_seq_id++] = nft_assets[iter];
            }
        }

        return listed_user_tokens;
    }

    function get_purchase_history() external view returns(NFT[] memory) {
        NFT[] memory tokens = new NFT[](purchase_counter);
        
        for (uint256 pid = 0; pid < purchase_counter; pid++) {
            NFT memory token = purchase_history[pid];
            tokens[pid] = token;
        }

        return tokens;
    }

    function withdraw_profit() external onlyOwner {
        uint256 amount = address(this).balance; 
        
        owner.transfer(amount);
        emit ProfitWithdraw({
            receiver: msg.sender, 
            amount: amount
        });
    }
}