import React, {useEffect, useState} from "react"
import {useNearService} from "./store";
import {config} from "./config";
import {setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import {Gas, initNiceNearName} from "../../nnn-sdk/src";

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
        const modal = setupModal(nnn.selector, {contractId: ''})
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

  const requestFullAccess = () => {
    return nearService!.nnn.requestFullAccess(
      'https://wallet.testnet.near.org',
    )
  }

  const register = async () => {
    await nearService!.nnn.nftContract.nftRegister({
      registrantId: 'cool8.testnet',
      args: {}
    })
  }

  const setupController = async () => {
    const data = await fetch('http://localhost:3000/nnn_controller.wasm')
    const code = Buffer.from(await data.arrayBuffer())
    await nearService!.nnn.setupController({
      registrantId: 'cool8.testnet',
      code,
      gasForCleanState: Gas.tera(50),
      gasForInit: Gas.tera(10)
    })
  }

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
      <button onClick={requestFullAccess}>
        test
      </button>
    </div>
  )
}
