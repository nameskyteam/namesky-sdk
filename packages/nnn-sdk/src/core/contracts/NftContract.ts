import {Contract} from "../../utils/Contract";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args";
import {CallOptions, ViewOptions} from "../types/common";
import {DEFAULT_MINT_FEE, MultiTransaction} from "../../utils";
import {Amount} from "../../utils";

export class NftContract extends Contract {
  async nft_is_registered({args}: ViewOptions<NftIsRegisteredArgs>): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // signed by registrant
  async nft_register(registrantId: string, {args, gas}: CallOptions<NftRegisterArgs>) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        methodName: 'nft_register',
        args,
        attachedDeposit: DEFAULT_MINT_FEE,
        gas
      })
    await this.selector.multiSendAccount(registrantId).multiSend(transaction)
  }

  async nft_redeem({args, gas}: CallOptions<NftRedeemArgs>): Promise<boolean> {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        methodName: 'nft_redeem',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas
      })
    return this.selector.multiSend(transaction)
  }
}
