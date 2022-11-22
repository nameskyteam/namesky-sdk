import create, {SetState} from "zustand";
import {WalletSelectorPlus} from "../../nnn-sdk/src/utils/wallet-selector-plus/types/enhancement";
import {NiceNearName} from "../../nnn-sdk/src/core/NiceNearName";

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
