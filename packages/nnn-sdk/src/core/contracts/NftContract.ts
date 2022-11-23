import {Contract} from "../../utils/Contract";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args/NftContract";
import {ContractCallOptions, ContractViewOptions} from "../types/common";
import {MultiTransaction} from "../../utils/multi-transaction/core/MultiTransaction";
import {Amount} from "../../utils/multi-transaction/utils/Amount";

export class NftContract extends Contract {
  async nft_is_registered(args: NftIsRegisteredArgs, options?: ContractViewOptions): Promise<string | null> {
    return this.selector.view({
      ...options,
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // signed by registrant
  async nft_register(registrantId: string, args: NftRegisterArgs, options?: ContractCallOptions) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        ...options,
        methodName: 'nft_register',
        args
      })
    await this.selector.multiSendWithLocalKey(registrantId, transaction)
  }

  async nft_redeem(args: NftRedeemArgs, options?: ContractCallOptions): Promise<boolean> {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        ...options,
        methodName: 'nft_redeem',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
      })
    return this.selector.multiSend({...options, transaction})
  }
}
