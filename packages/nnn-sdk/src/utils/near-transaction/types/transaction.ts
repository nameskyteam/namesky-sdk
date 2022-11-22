import {ActionLike} from "./action";

export interface TransactionLike {
  signerId?: string
  receiverId: string,
  actions: ActionLike[]
}
