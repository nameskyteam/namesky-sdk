import React, {useEffect, useState} from "react"
import {useNearService} from "./store";
import {config} from "./config";
import {setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import {initNiceNearName} from "../../nnn-sdk/src/core/NiceNearName";
import {Amount} from "../../nnn-sdk/src/utils/wallet-selector-plus/utils/Amount";
import {Gas} from "../../nnn-sdk/src/utils/wallet-selector-plus/utils/Gas";

export const App = () => {
  const {nearService, setNearService} = useNearService()
  const [modal, setModal] = useState<WalletSelectorModal | null>(null)
  const [accountId, setAccountId] = useState<string | undefined>()
  useEffect(() => {
    if (nearService) {
      return
    }
    initNiceNearName(config.nnn)
      .then(nnn => {
        setNearService({
          nnn,
          selector: nnn.selector
        })
        const accountId = nnn.selector.store.getState().accounts.find(accountState => accountState.active)?.accountId
        setAccountId(accountId)
        const modal = setupModal(nnn.selector, {contractId: 'nft.nicenearname.testnet'})
        setModal(modal)
      })
  }, [nearService])

  const signIn = () => {
    modal!.show()
  }

  const signOut = async () => {
    const wallet = await nearService?.selector.wallet()
    await wallet?.signOut()
    setAccountId(undefined)
  }

  const request = () => {
    return nearService!.nnn.requestFullAccess(
      'https://wallet.testnet.near.org',
    )
  }

  const register = async () => {
    await nearService!.nnn.nftContract.nft_register(
      'rrerer.testnet',
      {
        minter_id: 'cornflower.testnet'
      },
      {
        attachedDeposit: Amount.parseYoctoNear('1')
      }
    )
  }

  const setupController = async () => {
    const data = await fetch('http://localhost:3000/nnn_controller.wasm')
    const code = new Uint8Array(await data.arrayBuffer())
    await nearService!.nnn.setupController(
      'rrerer.testnet',
      code,
      {
        gasForCleanState: Gas.tera(50),
        gasForInit: Gas.tera(10)
      }
    )
  }

  console.log(nearService)

  return (
    <div>
      <label>sign in: {
        accountId
      }</label>
      <button onClick={signIn}>
        sign in
      </button>
      <button onClick={signOut}>
        sign out
      </button>
      <button onClick={register}>
        test
      </button>
    </div>
  )
}
