import React, {useEffect, useState} from "react"
import {useNearService} from "./store";
import {config} from "./config";
import {setupModal, WalletSelectorModal} from "@near-wallet-selector/modal-ui";
import {initNameSky} from "../../namesky-sdk/src";

export const App = () => {
  const {nearService, setNearService} = useNearService()
  const [modal, setModal] = useState<WalletSelectorModal | null>(null)
  const [accountId, setAccountId] = useState<string | undefined>()
  useEffect(() => {
    if (nearService) {
      return
    }
    initNameSky(config.namesky)
      .then(namesky => {
        setNearService({
          namesky,
          selector: namesky.selector
        })
        const accountId = namesky.selector.store.getState().accounts.find(accountState => accountState.active)?.accountId
        setAccountId(accountId)
        const modal = setupModal(namesky.selector, {contractId: ''})
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
    return nearService!.namesky.requestFullAccess(
      'https://wallet.testnet.near.org',
    )
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
