import {Contract} from "../../utils/Contract";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args";
import {ContractCallOptions, ContractViewOptions} from "../types/common";
import {MultiTransaction} from "../../utils";
import {Amount} from "../../utils";

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
    await this.selector.multiSendWithLocalKey({localSignerId: registrantId, transaction})
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
