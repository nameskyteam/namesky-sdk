# NameSky SDK
Interact with NameSky contracts

## Init
For Node
```ts
const account = MultiSendAccount.new(near.connection, 'alice.near');
const namesky = await initNameSky({
  network: 'mainnet',
  signer: NameSkySigner.fromAccount(account),
});
```

For Browser
```ts
const selector = setupMultiSendWalletSelector({
  network: 'mainnet',
  modules: [
    /* wallet modules */
  ]
});

const namesky = await initNameSky({
  network: 'mainnet',
  signer: NameSkySigner.fromWalletSelector(selector),
});
```

## Mint
```ts
// registrant is the account that you want to mint as NameSky NFT
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
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'apple.near',
        new_price: Amount.parse(200, 'NEAR'),
      },
    });
    ```

* Remove listing
    ```ts
    await namesky.marketplaceContract.removeListing({
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'apple.near',
      },
    });
    ```

* Buy listing
    ```ts
    await namesky.marketplaceContract.buyListing({
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'banana.near',
      },
    });
    ```

## Mange Offering
* Create Offering
    ```ts
    await namesky.marketplaceContract.createOffering({
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'banana.near',
        price: Amount.parse(30, 'NEAR'),
      },
    });
    ```

* Update Offering
    ```ts
    await namesky.marketplaceContract.updateOffering({
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'banana.near',
        new_price: Amount.parse(40, 'NEAR'),
      },
    });
    ```

* Remove Offering
    ```ts
    await namesky.marketplaceContract.removeOffering({
      args: {
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'banana.near',
      },
    });
    ```

* Accept Offering
    ```ts
    await namesky.marketplaceContract.acceptOffering({
      args: {
        buyer_id: 'bob.near',
        nft_contract_id: namesky.coreContractId,
        nft_token_id: 'apple.near',
      },
    });
    ```
