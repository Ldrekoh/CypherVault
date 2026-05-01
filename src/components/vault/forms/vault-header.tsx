// components/vault/VaultHeader.tsx
"use client";
import { useVaultStore } from "@/store/useVaultStore";

import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";
import { UnlockVaultDialog } from "./unlock-vault-dialog";

export function VaultHeader({ encryptedKey }: { encryptedKey: string }) {
  const isUnlocked = useVaultStore((state) => state.isUnlocked);

  return (
    <div className="flex items-center justify-between p-4 bg-card border rounded-xl">
      <div className="flex items-center gap-3">
        {isUnlocked ? (
          <Badge
            variant="outline"
            className="text-green-500 border-green-500/20 bg-green-500/5 gap-1 font-bold"
          >
            <Unlock className="h-3 w-3" /> VAULT DÉVERROUILLÉ
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-500/20 bg-amber-500/5 gap-1 font-bold"
          >
            <Lock className="h-3 w-3" /> VAULT VERROUILLÉ
          </Badge>
        )}
      </div>

      {/* Le bouton n'apparaît QUE si le store est vide (après un reload par exemple) */}
      {!isUnlocked && <UnlockVaultDialog encryptedKey={encryptedKey} />}
    </div>
  );
}
