# NameSky SDK
Interact with NameSky contracts

## Init
```ts
// Your mainly used account
const account = MultiSendAccount.new(near.connection, 'alice.near');
const namesky = await initNameSky({
  network: 'mainnet',
  signer: NameSkySigner.fromAccount(account),
});
```

## Mint
```ts
// Account that you want to mint as NameSky NFT
const registrantId = 'apple.near';
const registrantPrivateKey = 'ed25519:<private key>';

await namesky.setRegistrantKey(registrantId, KeyPair.fromString(registrantPrivateKey));
await namesky.mint({ registrantId, minterId: 'alice.near' });
```

## Mange Listing
* Create listing
    ```ts
    await namesky.marketplaceContract.createListing({
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'apple.near',
        price: Amount.parse(100, 'NEAR'),
      }
    });
    ```

* Update listing
    ```ts
    await namesky.marketplaceContract.updateListing({
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'apple.near',
      new_price: Amount.parse(200, 'NEAR'),
    });
    ```

* Remove listing
    ```ts
    await namesky.marketplaceContract.removeListing({
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'apple.near',
    });
    ```

* Buy listing
    ```ts
    await namesky.marketplaceContract.buyListing({
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'banana.near',
    });
    ```

## Mange Offering
* Create Offering
    ```ts
    await namesky.marketplaceContract.createOffering({
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'banana.near',
      price: Amount.parse(100, 'NEAR'),
    });
    ```

* Update Offering
    ```ts
    await namesky.marketplaceContract.updateOffering({
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'banana.near',
      new_price: Amount.parse(200, 'NEAR'),
    });
    ```

* Remove Offering
    ```ts
    await namesky.marketplaceContract.removeOffering({
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'banana.near',
    });
    ```

* Accept Offering
    ```ts
    await namesky.marketplaceContract.acceptOffering({
      buyer_id: 'bob.near',
      nft_contract_id: namesky.coreContractId,
      nft_token_id: 'apple.near',
    });
    ```
