# NameSky SDK
Interact with NameSky contracts

## Install
```shell
pnpm add namesky-sdk
```

## Init NameSky

### Node
```ts
import { initNameSky, NameSkySigner, Amount, MultiSendAccount } from 'namesky-sdk';
```

```ts
const account = MultiSendAccount.new(connection, 'alice.near');
const namesky = await initNameSky({ signer: NameSkySigner.fromAccount(account) });
```

### Browser
```ts
import { initNameSky, NameSkySigner, Amount, setupMultiSendWalletSelector } from 'namesky-sdk';
```

```ts
const selector = await setupMultiSendWalletSelector({
  network: 'mainnet',
  modules: [
    /* wallet modules */
  ],
});
const namesky = await initNameSky({ signer: NameSkySigner.fromWalletSelector(selector) });
```

## Mint Account as NFT
```ts
// Registrant is the account that you want to mint as NameSky NFT. (e.g. star.near)
await namesky.setRegistrantKey('star.near', KeyPair.fromString('ed25519:<private key>'));
await namesky.postMint('star.near');
await namesky.waitMintCompleted('star.near');
```

## Take Account Back
```ts
await namesky.coreContract.nftRedeem({ tokenId: 'star.near', publicKey: 'ed25519:<public key>' });
```

## Manage Listing

### Create Listing
```ts
await namesky.marketplaceContract.createListing({ tokenId: 'star.near', price: Amount.parse(100, 'NEAR') });
```

### Update Listing
```ts
await namesky.marketplaceContract.updateListing({ tokenId: 'star.near', newPrice: Amount.parse(200, 'NEAR') });
```

### Remove Listing
```ts
await namesky.marketplaceContract.removeListing({ tokenId: 'star.near' });
```

### Buy Listing
```ts
await namesky.marketplaceContract.buyListing({ tokenId: 'star.near' });
```

## Manage Offering

### Create Offering
```ts
await namesky.marketplaceContract.createOffering({ tokenId: 'moon.near', price: Amount.parse(30, 'NEAR') });
```

### Update Offering
```ts
await namesky.marketplaceContract.updateOffering({ tokenId: 'moon.near', newPrice: Amount.parse(50, 'NEAR') });
```

### Remove Offering
```ts
await namesky.marketplaceContract.removeOffering({ tokenId: 'moon.near' });
```

### Accept Offering
```ts
await namesky.marketplaceContract.acceptOffering({ tokenId: 'star.near', buyerId: 'bob.near' });
```
