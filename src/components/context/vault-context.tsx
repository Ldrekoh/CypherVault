"use client";

import * as openpgp from "openpgp";
import React, { createContext, useContext, useEffect, useState } from "react";

interface VaultContextType {
  decryptedKey: openpgp.PrivateKey | null;
  setDecryptedKey: (key: openpgp.PrivateKey | null) => void;
  lockVault: () => void;
  isLocked: boolean;
  isHydrated: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [decryptedKey, setKey] = useState<openpgp.PrivateKey | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const restoreKey = async () => {
      try {
        const armored = sessionStorage.getItem("cyphervault_session_key");

        if (armored) {
          const key = await openpgp.readKey({ armoredKey: armored });

          if (key.isPrivate()) {
            setKey(key as openpgp.PrivateKey);
          } else {
            sessionStorage.removeItem("cyphervault_session_key");
          }
        }
      } catch (error) {
        console.error("Échec de la restauration de la session PGP:", error);
        sessionStorage.removeItem("cyphervault_session_key");
      } finally {
        setIsHydrated(true);
      }
    };

    restoreKey();
  }, []);

  const setDecryptedKey = (key: openpgp.PrivateKey | null) => {
    setKey(key);
    if (key) {
      sessionStorage.setItem("cyphervault_session_key", key.armor());
    } else {
      sessionStorage.removeItem("cyphervault_session_key");
    }
  };

  const lockVault = () => {
    setKey(null);
    sessionStorage.removeItem("cyphervault_session_key");
  };

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

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error(
      "useVault doit être utilisé à l'intérieur de VaultProvider",
    );
  }
  return context;
};
