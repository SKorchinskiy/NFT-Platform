// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MarketNFTCreateContract is ERC721URIStorage {
    uint256 minting_fee = 0.0075 ether;
    uint256 token_id;

    address payable owner;
    address contractAddress;

    error InappropriateMintingFee(
        uint256 expected_fee, 
        uint256 received_fee
    );
    error OwnershipRejection(
        string message
    );

    event TokenWrapperCreated(
        uint256 token_id,
        address token_owner,
        string token_uri,
        address contract_address
    );
    event TokenMinted(
        uint256 token_id,
        address token_owner,
        string token_uri,
        address contract_address
    );
    event ProfitWithdraw(
        address receiver,
        uint256 amount
    );

    modifier validateMintingFee() {
        if (msg.value != minting_fee)
            revert InappropriateMintingFee({
                expected_fee: minting_fee,
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

    constructor(address marketAddress) ERC721("SKorchinskiyMarket", "SKM") {
        contractAddress = marketAddress;
    }

    function create_token_wrapper(string memory tokenURI) external returns(uint256) {
        token_id++;
        
        _mint(msg.sender, token_id);
        _setTokenURI(token_id, tokenURI);
        setApprovalForAll(contractAddress, true);

        emit TokenWrapperCreated({
            token_id: token_id,
            token_owner: msg.sender,
            token_uri: tokenURI,
            contract_address: contractAddress
        });
        return token_id;
    }

    function mint_token(string memory tokenURI) external payable validateMintingFee returns(uint256) {
        token_id++;

        _mint(msg.sender, token_id);
        _setTokenURI(token_id, tokenURI);
        setApprovalForAll(contractAddress, true);

        emit TokenMinted({
            token_id: token_id,
            token_owner: msg.sender,
            token_uri: tokenURI,
            contract_address: contractAddress
        });
        return token_id;
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance; 
        
        owner.transfer(amount);
        emit ProfitWithdraw({
            receiver: msg.sender,
            amount: amount
        });
    }
}