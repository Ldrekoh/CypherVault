"use client";

import { loadKeyFromSession, saveKeyToSession } from "@/lib/crypto";
import * as openpgp from "openpgp";
import React, { createContext, useContext, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VaultContextType {
  decryptedKey: openpgp.PrivateKey | null;
  setDecryptedKey: (key: openpgp.PrivateKey | null) => void;
  lockVault: () => void;
  isLocked: boolean;
  isHydrated: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const VaultContext = createContext<VaultContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [decryptedKey, setKey] = useState<openpgp.PrivateKey | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restauration de la clé depuis sessionStorage au montage
  useEffect(() => {
    loadKeyFromSession()
      .then(setKey)
      .finally(() => setIsHydrated(true));
  }, []);

  const setDecryptedKey = (key: openpgp.PrivateKey | null) => {
    setKey(key);
    saveKeyToSession(key);
  };

  const lockVault = () => setDecryptedKey(null);

  return (
    <VaultContext.Provider
      value={{
        decryptedKey,
        setDecryptedKey,
        lockVault,
        isLocked: !decryptedKey,
        isHydrated,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useVault = (): VaultContextType => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error(
      "useVault doit être utilisé à l'intérieur de VaultProvider",
    );
  }
  return context;
};
