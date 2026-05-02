import { FolderList } from "@/components/folder/folder-list";
import { SetupVaultModal } from "@/components/vault/forms/setup-vault-modal";
import { UnlockVaultDialog } from "@/components/vault/forms/unlock-vault-dialog";
import { getCurrentUser } from "@/server/auth/auth-action";
import { keysExistAction } from "@/server/vault/vault-action";
import { ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
  const { currentUser } = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  const vaultStatus = await keysExistAction();

  // On définit hasVault par rapport au retour de l'action
  const hasVault = vaultStatus.success && vaultStatus.hasKeys;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <SetupVaultModal
        user={{ name: currentUser.name, email: currentUser.email }}
        isOpen={!hasVault}
      />

      {hasVault ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Espace Sécurisé
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                Mon <span className="text-primary">Coffre</span>
              </h1>
              <p className="text-muted-foreground font-medium italic">
                Ravi de vous revoir,{" "}
                <span className="text-foreground">{currentUser.name}</span>.
              </p>
            </div>

            <div className="shrink-0">
              <div className="p-1 rounded-2xl bg-muted/30 border border-border/50">
                <UnlockVaultDialog
                  encryptedKey={vaultStatus.encryptedPrivateKey as string}
                />
              </div>
            </div>
          </div>
          {/* btn to trash */}
          <Link
            href="/dashboard/trash"
            className="inline-flex items-center gap-2 text-destructive text-sm font-bold uppercase tracking-wide transition-colors hover:text-destructive/80"
          >
            <Trash2 className="h-4 w-4" />
            Corbeille
          </Link>

          <div className="mt-12">
            <FolderList />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[65vh] border-2 border-dashed rounded-[3rem] bg-muted/5 border-muted-foreground/20 animate-pulse">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <ShieldCheck className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <p className="text-xl font-black uppercase italic tracking-widest text-muted-foreground/40">
            Initialisation du protocole...
          </p>
          <p className="text-xs text-muted-foreground/30 mt-2 uppercase tracking-tighter">
            Veuillez configurer votre clé de chiffrement
          </p>
        </div>
      )}
    </div>
  );
}
