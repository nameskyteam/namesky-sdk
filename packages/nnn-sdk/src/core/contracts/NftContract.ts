import {Contract} from "../../utils/Contract";
import {
  DEFAULT_MINT_FEE,
  MultiTransaction,
  FunctionCallOptions,
  FunctionViewOptions
} from "../../utils";
import {Amount} from "../../utils";
import {NftIsRegisteredArgs, NftRedeemArgs} from "../types/args";
import {NftRegisterOptions} from "../types/options";

export class NftContract extends Contract {
  async nftIsRegistered({args}: FunctionViewOptions<NftIsRegisteredArgs>): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // signed by registrant
  async nftRegister({registrantId, args, gas}: NftRegisterOptions) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        methodName: 'nft_register',
        args,
        attachedDeposit: DEFAULT_MINT_FEE,
        gas
      })
    await this.selector.multiSendWithLocalKey(registrantId, transaction)
  }

  async nftRedeem({args, gas}: FunctionCallOptions<NftRedeemArgs>): Promise<boolean> {
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
