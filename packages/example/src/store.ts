import create, {SetState} from "zustand";
import {WalletSelectorPlus} from "../../nnn-sdk/src";
import {NiceNearName} from "../../nnn-sdk/src";

export interface NearService {
  selector: WalletSelectorPlus,
  nnn: NiceNearName,
}

interface NearServiceStore {
  nearService: NearService | null,
  setNearService(nearService: NearService): void
}

export const useNearService = create((set: SetState<NearServiceStore>): NearServiceStore => {
  return {
    nearService: null,
    setNearService(nearService: NearService) {
      set({nearService})
    }
  }
})
