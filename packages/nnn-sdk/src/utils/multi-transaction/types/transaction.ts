import {Action} from "./action";

export interface Transaction {
  signerId?: string
  receiverId: string,
  actions: Action[]
}
