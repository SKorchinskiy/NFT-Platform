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
> [!NOTE]
>As you can see from the workflow above, to interact with a target blockchain network, a digital wallet is used (MetaMask). Each node in the network has an EVM (Ethereum Virtual Machine), which stores developed smart contracts, which you can find in the /contracts folder. The interactions with a node in the selected network are done by using the MetaMask + Web3.js library, which enables interactions with developed smart contracts for the client side.
>
>In addition, a Pinata service is used to enable interactions with decentralized file storage (IPFS), where media and metadata about each token are stored.
>
>Finally, to enable global accessability for all users, the cloud infrastructure of the Google Cloud Platform is used. Using this GitHub repo, Cloud Build triggers a project build each time the changes to the repo are made using Dockerfile from the /client folder. After an updated project is built, Cloud Run allocates resources to make a new version of the platform available. The Secret Manager service of GCP is used to store APIs and private keys for 3rd party interactions, which are only accessible for the running Cloud Run instances, which were granted access to use data from Secret Manager.

### Detailed description

- **Authentication via MetaMask**

![](https://drive.google.com/uc?id=12-c-pHU_HXu0UmAoXG3xUzdwzhvfVcr-)

- **Personal Portal: section with personal tokens from custom collection**

![](https://drive.google.com/uc?id=1mEsI1PkcbxTfH75-7-vagHsVG_V25FUi)

- **Personal Portal: section with active personal tokens for sale**

![](https://drive.google.com/uc?id=1twZhxbuZ1sOG5qyNTyW6wPO7ouDf8UqW)

- **Personal Portal: section with sold personal tokens on the platform**

![](https://drive.google.com/uc?id=19sM-0TKv2A0eC23_SUntjYw9ncYMZas1)

- **Personal Portal: section with minted personal tokens on the platform**

![](https://drive.google.com/uc?id=1fmYXpxPDwLE-NJKtPoKwt-0eZG93Ew7u)

- **Modal for token listing**

![](https://drive.google.com/uc?id=1Hb3NVqUsqdPquA7Kh6M9e-8F6ebr6Qp1)

- **Modal for token listing cancelation**

![](https://drive.google.com/uc?id=1aHSApB-x-0oaPqW0jhkC7Tgwy-SpMCJb)

- **Modal with sold token's information**

![](https://drive.google.com/uc?id=1WWeY86-dgx7hliOTKTa29vZbFsLgiYJ4)

- **Modal to purchase a token**

![](https://drive.google.com/uc?id=1EUjRznWJPUz8FQZb7ZRnrT1ByPcfH20f)

- **Main page carousel**

![](https://drive.google.com/uc?id=1W3gYB79uzuNBxLGAbI3v_Fm_W7QBlzI5)

- **Main page tokens-for-sale section**

![](https://drive.google.com/uc?id=166lqtzCHtEVmOzGzqC6Zmwx73R1m_LaO)

- **Main page minted-tokens-for-sale section**

![](https://drive.google.com/uc?id=1SlOPayWE-9d3GmtDwQuFKV1UTdXemiOV)

- **Main page recently-purchased-tokens section**

![](https://drive.google.com/uc?id=1H7N1Wm0xcNDNpsXZpBQbqwAkKHsTsrl6)

- **Main page token-auctions section**

![](https://drive.google.com/uc?id=1Rw667W39DpN17jUOanmjVJAKyh_-AFCy)

- **Minting page**

![](https://drive.google.com/uc?id=1qp289Q6fOjbszmFXsGUsrT8IQE-oM9Gq)

- **Minted token with AI-model**

![](https://drive.google.com/uc?id=1LdNYzbWsNWTJ04FtRxvMzhOx4uakUSyF)

- **Listed AI-based token**

![](https://drive.google.com/uc?id=1dWr4wADaQ9rzwnc6kPZNhAigUFKF0Y9R)

- **Auctions page**

![](https://drive.google.com/uc?id=1fbZic8yCGwkhO2rc0g9P1F0lyE5az4xb)

- **Created auction info**

![](https://drive.google.com/uc?id=1ECQecDDG5pzM8EKzDByL2y2bKg061Qqz)

- **Created auction page**

![](https://drive.google.com/uc?id=1ObTkXo6ZKq7YldnuJXanJyl34P4yxcKh)

- **Completed auction bids**

![](https://drive.google.com/uc?id=1hLL5csGzvQF9qnJz80ky_h2YzZ_cdVO_)
