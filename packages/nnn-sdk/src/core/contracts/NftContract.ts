import {Contract} from "../../utils/Contract";
import {NftIsRegisteredArgs, NftRedeemArgs, NftRegisterArgs} from "../types/args";
import {ContractCallOptions, ContractViewOptions} from "../types/common";
import {DEFAULT_MINT_FEE, MultiTransaction} from "../../utils";
import {Amount} from "../../utils";

export class NftContract extends Contract {
  async nft_is_registered({args}: ContractViewOptions<NftIsRegisteredArgs>): Promise<string | null> {
    return this.selector.view({
      contractId: this.contractId,
      methodName: 'nft_is_registered',
      args
    })
  }

  // signed by registrant
  async nft_register(registrantId: string, {args, gas}: ContractCallOptions<NftRegisterArgs>) {
    const transaction = new MultiTransaction(this.contractId)
      .functionCall({
        methodName: 'nft_register',
        args,
        attachedDeposit: DEFAULT_MINT_FEE,
        gas
      })
    await this.selector.keyStoredAccount(registrantId).multiSend(transaction)
  }

  async nft_redeem({args, gas}: ContractCallOptions<NftRedeemArgs>): Promise<boolean> {
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
