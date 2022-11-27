import {Contract} from "../../utils/Contract";
import {
  DEFAULT_MINT_FEE,
  MultiTransaction,
  FunctionCallOptions,
  FunctionViewOptions
} from "../../utils";
import {Amount} from "../../utils";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args";
import {NftRegisterOptions} from "../types/options";

export class NftContract extends Contract {
  // --------------------------------------------------view-------------------------------------------------------

  async nftIsRegistered({args}: FunctionViewOptions<NftIsRegisteredArgs>): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // --------------------------------------------------call-------------------------------------------------------

  // signed by registrant
  async nftRegister({registrantId, args, gas, attachedDeposit}: NftRegisterOptions) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall<NftRegisterArgs>({
        methodName: 'nft_register',
        args: { minter_id: args.minter_id ?? this.selector.getActiveAccountId()! },
        attachedDeposit: attachedDeposit ?? DEFAULT_MINT_FEE,
        gas
      })
    await this.selector.sendWithLocalKey(registrantId, transaction)
  }

  async nftRedeem({args, gas}: FunctionCallOptions<NftRedeemArgs>): Promise<boolean> {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        methodName: 'nft_redeem',
        args,
        attachedDeposit: Amount.ONE_YOCTO,
        gas
      })
    return this.selector.send(transaction)
  }
}
