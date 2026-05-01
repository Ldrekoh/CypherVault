"use client";

import { useVaultStore } from "@/store/useVaultStore";

export function DebugVault() {
  const { unlockedKey, isUnlocked } = useVaultStore();

  if (!isUnlocked || !unlockedKey) {
    return (
      <div className="p-4 border border-dashed rounded-lg bg-muted/50 text-xs italic">
        Vault verrouillé en mémoire vive.
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-black text-green-400 font-mono text-xs rounded-lg overflow-hidden">
      <p className="mb-2 border-b border-green-900 pb-1 uppercase font-bold">
        🛡️ Debug: Private Key Dump (In-Memory Only)
      </p>
      <pre className="overflow-x-auto">
        {/* On exporte la clé en format texte pour le test */}
        {unlockedKey.armor()}
      </pre>
    </div>
  );
}
