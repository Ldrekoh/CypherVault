import * as openpgp from "openpgp";
import { create } from "zustand";

interface VaultState {
  unlockedKey: openpgp.PrivateKey | null;
  isUnlocked: boolean;
  setUnlockedKey: (key: openpgp.PrivateKey) => void;
  lockVault: () => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  unlockedKey: null,
  isUnlocked: false,
  setUnlockedKey: (key) => set({ unlockedKey: key, isUnlocked: true }),
  lockVault: () => set({ unlockedKey: null, isUnlocked: false }),
}));
