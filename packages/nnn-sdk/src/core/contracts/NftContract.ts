import {Contract} from "../../utils/Contract";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args";
import {ContractCallOptions, ContractViewOptions} from "../types/common";
import {MultiTransaction} from "../../utils";
import {Amount} from "../../utils";

export class NftContract extends Contract {
  async nft_is_registered(options: ContractViewOptions<NftIsRegisteredArgs>): Promise<string | null> {
    return this.selector.view({
      ...options,
      contractId: this.contractId,
      methodName: 'nft_is_registered'
    })
  }

  // signed by registrant
  async nft_register(registrantId: string, options: ContractCallOptions<NftRegisterArgs>) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        ...options,
        methodName: 'nft_register'
      })
    await this.selector.multiSendWithLocalKey(registrantId, transaction)
  }

  async nft_redeem(options: ContractCallOptions<NftRedeemArgs>): Promise<boolean> {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        ...options,
        methodName: 'nft_redeem',
        attachedDeposit: Amount.ONE_YOCTO,
      })
    return this.selector.multiSend(transaction, options?.callbackUrl)
  }
}
