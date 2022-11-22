import {BaseContract} from "../../utils/BaseContract";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args/NftContract";
import {NearTransaction} from "../../utils/wallet-selector-plus/core/NearTransaction";
import {Amount} from "../../utils/wallet-selector-plus/utils/Amount";
import {ContractCallOptions, ContractViewOptions} from "../types/common";

export class NftContract extends BaseContract {
  async nft_is_registered(args: NftIsRegisteredArgs, options?: ContractViewOptions): Promise<string | null> {
    return this.selector.view({
      ...options,
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // signed by registrant
  async nft_register(signerId: string, args: NftRegisterArgs, options?: ContractCallOptions) {
    const transaction = new NearTransaction(this.contractId)
      .functionCall({
        ...options,
        methodName: 'nft_register',
        args
      })
    await this.selector.sendWithLocalKey(signerId, transaction)
  }

  async nft_redeem(args: NftRedeemArgs, options?: ContractCallOptions): Promise<boolean> {
    const transaction = new NearTransaction(this.contractId)
      .functionCall({
        ...options,
        methodName: 'nft_redeem',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
      })
    return this.selector.send(transaction, options?.callbackUrl)
  }
}
