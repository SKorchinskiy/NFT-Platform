# NFT-Platform

## Project Description

🪙 NFT-Platform - A fully-fledged Multichain NFT-platform with ability to buy/sell/mint/trade ERC721 tokens. The application is written using:
- **React** *for components*
- **Next.js** *as a react framework*
- **HTML, CSS** *for markdown and styling*
- **Solidity** *for smart-contracts to serve EVM-compatible networks*
- **Web3.js** *to bind client-side with smart-contracts' functionality*
- **Pinata + IPFS** *to store media and meta data about tokens*
- **Docker** *to build project based on it*
- **Google Cloud Platform: Cloud Run** *as the service provider for 2nd generation of cloud functions*
- **Google Cloud Platform: Cloud Build** *for CI/CD bind to this Github repo*
- **Google Cloud Platform: Secret Manager** *to store API and private keys to interact with 3rd party services*

## Project Structure 

```
📦 
├─ .gitignore
├─ .nvmrc
├─ .vscode
│  └─ settings.json
├─ README.md
├─ client
│  ├─ .eslintrc.json
│  ├─ .gitignore
│  ├─ Dockerfile
│  ├─ README.md
│  ├─ next.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ address-switch.png
│  │  ├─ arrow-left.png
│  │  ├─ arrow-right.png
│  │  ├─ binance-sign.png
│  │  ├─ close-sign.png
│  │  ├─ ethereum-sign.png
│  │  ├─ github-sign.png
│  │  ├─ gmail-sign.png
│  │  ├─ hardhat-sign.png
│  │  ├─ metamask-icon.png
│  │  ├─ polygon-sign.png
│  │  ├─ telegram-sign.webp
│  │  ├─ user-disconnect.png
│  │  └─ user-icon.png
│  ├─ src
│  │  ├─ app
│  │  │  ├─ _components
│  │  │  │  ├─ account-profile
│  │  │  │  │  ├─ account-profile.component.tsx
│  │  │  │  │  └─ account-profile.module.css
│  │  │  │  ├─ action-popup
│  │  │  │  │  ├─ action-popup.component.tsx
│  │  │  │  │  └─ action-popup.module.css
│  │  │  │  ├─ connect-wallet
│  │  │  │  │  ├─ connect-wallet.component.tsx
│  │  │  │  │  └─ connect-wallet.module.css
│  │  │  │  ├─ footer
│  │  │  │  │  ├─ footer.component.tsx
│  │  │  │  │  └─ footer.module.css
│  │  │  │  ├─ navbar
│  │  │  │  │  ├─ navbar.component.tsx
│  │  │  │  │  └─ navbar.module.css
│  │  │  │  ├─ profile-details
│  │  │  │  │  ├─ profile-details.component.tsx
│  │  │  │  │  └─ profile-details.module.css
│  │  │  │  └─ provider-installation
│  │  │  │     ├─ provider-installation.component.tsx
│  │  │  │     └─ provider-installation.module.css
│  │  │  ├─ api
│  │  │  │  ├─ files
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ images
│  │  │  │     └─ route.ts
│  │  │  ├─ global.styles.css
│  │  │  ├─ hooks
│  │  │  │  ├─ useBlindAuctionContract.hook.tsx
│  │  │  │  ├─ useEnglishAuctionContract.hook.tsx
│  │  │  │  ├─ useNftCollectionContract.hook.tsx
│  │  │  │  ├─ useNftCreateContract.hook.tsx
│  │  │  │  ├─ useNftMarketContract.hook.tsx
│  │  │  │  └─ useResellContract.hook.tsx
│  │  │  ├─ icon.ico
│  │  │  ├─ layout.tsx
│  │  │  ├─ marketplace
│  │  │  │  ├─ _components
│  │  │  │  │  ├─ carousel
│  │  │  │  │  │  ├─ carousel.component.tsx
│  │  │  │  │  │  └─ carousel.module.css
│  │  │  │  │  └─ nft-section
│  │  │  │  │     ├─ nft-section.component.tsx
│  │  │  │  │     └─ nft-section.module.css
│  │  │  │  ├─ page.module.css
│  │  │  │  └─ page.tsx
│  │  │  ├─ mint
│  │  │  │  ├─ _components
│  │  │  │  │  ├─ minting-constructor
│  │  │  │  │  │  ├─ minting-constructor.component.tsx
│  │  │  │  │  │  └─ minting-constructor.module.css
│  │  │  │  │  └─ minting-form
│  │  │  │  │     ├─ minting-form.component.tsx
│  │  │  │  │     └─ minting-form.module.css
│  │  │  │  ├─ page.module.css
│  │  │  │  └─ page.tsx
│  │  │  ├─ portal
│  │  │  │  ├─ _components
│  │  │  │  │  ├─ nft-buying-details
│  │  │  │  │  │  ├─ nft-buying-details.component.tsx
│  │  │  │  │  │  └─ nft-buying-details.module.css
│  │  │  │  │  ├─ nft-cancelation-details
│  │  │  │  │  │  ├─ nft-cancelation-details.component.tsx
│  │  │  │  │  │  └─ nft-cancelation-details.module.css
│  │  │  │  │  ├─ nft-card-list
│  │  │  │  │  │  ├─ nft-card-list.component.tsx
│  │  │  │  │  │  └─ nft-card-list.module.css
│  │  │  │  │  ├─ nft-card-modal
│  │  │  │  │  │  ├─ nft-card-modal.component.tsx
│  │  │  │  │  │  └─ nft-card-modal.module.css
│  │  │  │  │  ├─ nft-card
│  │  │  │  │  │  ├─ nft-card.component.tsx
│  │  │  │  │  │  └─ nft-card.module.css
│  │  │  │  │  ├─ nft-listing-details
│  │  │  │  │  │  ├─ nft-listing-details.component.tsx
│  │  │  │  │  │  └─ nft-listing-details.module.css
│  │  │  │  │  ├─ nft-purchase-details
│  │  │  │  │  │  ├─ nft-purchase-details.component.tsx
│  │  │  │  │  │  └─ nft-purchase-details.module.css
│  │  │  │  │  └─ status-plate
│  │  │  │  │     ├─ status-plate.component.tsx
│  │  │  │  │     └─ status-plate.module.css
│  │  │  │  ├─ page.module.css
│  │  │  │  └─ page.tsx
│  │  │  ├─ providers
│  │  │  │  ├─ address.provider.tsx
│  │  │  │  ├─ auctions.provider.tsx
│  │  │  │  ├─ bids.provider.tsx
│  │  │  │  ├─ custom-tokens.provider.tsx
│  │  │  │  ├─ metamask.provider.tsx
│  │  │  │  ├─ network.provider.tsx
│  │  │  │  ├─ nft-tokens.provider.tsx
│  │  │  │  ├─ popup.provider.tsx
│  │  │  │  └─ trade-tokens.provider.tsx
│  │  │  ├─ trade
│  │  │  │  ├─ [auction_id]
│  │  │  │  │  ├─ _components
│  │  │  │  │  │  ├─ bid
│  │  │  │  │  │  │  ├─ bid.component.tsx
│  │  │  │  │  │  │  └─ bid.module.css
│  │  │  │  │  │  ├─ bids-list
│  │  │  │  │  │  │  ├─ bids-list.component.tsx
│  │  │  │  │  │  │  └─ bids-list.module.css
│  │  │  │  │  │  └─ time-out
│  │  │  │  │  │     ├─ time-out.component.tsx
│  │  │  │  │  │     └─ time-out.module.css
│  │  │  │  │  ├─ page.module.css
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ _components
│  │  │  │  │  ├─ compact-trade-card
│  │  │  │  │  │  ├─ compact-trade-card.component.tsx
│  │  │  │  │  │  └─ compact-trade-card.module.css
│  │  │  │  │  ├─ nft-trade-card
│  │  │  │  │  │  ├─ nft-trade-card.component.tsx
│  │  │  │  │  │  └─ nft-trade-card.module.css
│  │  │  │  │  ├─ tokens-window
│  │  │  │  │  │  ├─ tokens-window.component.tsx
│  │  │  │  │  │  └─ tokens-window.module.css
│  │  │  │  │  ├─ trade-card
│  │  │  │  │  │  ├─ trade-card.component.tsx
│  │  │  │  │  │  └─ trade-card.module.css
│  │  │  │  │  ├─ trade-list
│  │  │  │  │  │  ├─ trade-list.component.tsx
│  │  │  │  │  │  └─ trade-list.module.css
│  │  │  │  │  └─ trade-settings
│  │  │  │  │     ├─ trade-settings.component.tsx
│  │  │  │  │     └─ trade-settings.module.css
│  │  │  │  ├─ page.module.css
│  │  │  │  └─ page.tsx
│  │  │  └─ types
│  │  │     ├─ bid.type.ts
│  │  │     ├─ nft.type.ts
│  │  │     └─ trade-tokens.type.ts
│  │  └─ configs
│  │     ├─ blind-auction.abi.json
│  │     ├─ constants.ts
│  │     ├─ english-auction.abi.json
│  │     ├─ market-create.abi.json
│  │     ├─ market-nft-create.abi.json
│  │     ├─ market-resell.abi.json
│  │     ├─ networks.ts
│  │     └─ nft-collection.abi.json
│  └─ tsconfig.json
├─ contracts
│  ├─ Lock.sol
│  ├─ auctions
│  │  ├─ blind-auction.contract.sol
│  │  └─ english-auction.contract.sol
│  ├─ market-create.contract.sol
│  ├─ market-nft-create.contract.sol
│  └─ market-resell.contract.sol
├─ docker-compose.yaml
├─ hardhat.config.ts
├─ ignition
│  └─ modules
│     └─ Lock.ts
├─ package-lock.json
├─ package.json
├─ test
│  └─ Lock.ts
└─ tsconfig.json
```
©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)

## Project Workflow

The project is deployed using Google Cloud Platform. You can check it [here](https://nft-platform-s27gxnquya-uc.a.run.app/marketplace)

## Higher level overview

![Application Workflow](https://drive.google.com/uc?id=1PzMJPDo7woQIpnYwebordinzSYPc7XBM)
