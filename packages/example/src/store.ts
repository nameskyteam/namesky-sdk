import create, { SetState } from 'zustand';
import { WalletSelectorPlus } from '../../namesky-sdk/src';
import { NameSky } from '../../namesky-sdk/src';

export interface NearService {
  selector: WalletSelectorPlus;
  namesky: NameSky;
}

interface NearServiceStore {
  nearService: NearService | null;
  setNearService(nearService: NearService): void;
}

export const useNearService = create((set: SetState<NearServiceStore>): NearServiceStore => {
  return {
    nearService: null,
    setNearService(nearService: NearService) {
      set({ nearService });
    },
  };
});
