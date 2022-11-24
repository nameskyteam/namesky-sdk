import {Contract} from "../../utils/Contract";
import {DEFAULT_MINT_FEE, MultiTransaction} from "../../utils";
import {Amount} from "../../utils";
import {NftIsRegisteredOptions, NftRedeemOptions, NftRegisterOptions} from "../types/options";

export class NftContract extends Contract {
  async nft_is_registered({args}: NftIsRegisteredOptions): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // signed by registrant
  async nft_register({registrantId, args, gas}: NftRegisterOptions) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        methodName: 'nft_register',
        args,
        attachedDeposit: DEFAULT_MINT_FEE,
        gas
      })
    await this.selector.multiSendAccount(registrantId).multiSend(transaction)
  }

  async nft_redeem({args, gas}: NftRedeemOptions): Promise<boolean> {
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
