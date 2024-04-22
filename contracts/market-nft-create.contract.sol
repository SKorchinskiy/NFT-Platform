// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MarketNFTCreateContract is ERC721URIStorage {
    uint256 minting_fee = 0.0075 ether;
    uint256 token_id;

    address payable owner;
    address contractAddress;

    constructor(address marketAddress) ERC721("SKorchinskiyMarket", "SKM") {
        contractAddress = marketAddress;
    }

    function create_token_wrapper(string memory tokenURI) external returns(uint256) {
        token_id++;
        
        _mint(msg.sender, token_id);
        _setTokenURI(token_id, tokenURI);
        setApprovalForAll(contractAddress, true);

        return token_id;
    }

    function mint_token(string memory tokenURI) external payable returns(uint256) {
        require(
            msg.value == minting_fee,
            "Minting fee should be equal to 0.0075 ether!"
        );

        token_id++;

        _mint(msg.sender, token_id);
        _setTokenURI(token_id, tokenURI);
        setApprovalForAll(contractAddress, true);

        return token_id;
    }

    function withdraw() external {
        require(
            msg.sender == owner,
            "Only the owner of the contract can withdraw the profit!"
        );

        owner.transfer(address(this).balance);
    }
}