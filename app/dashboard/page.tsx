import { SetupVaultModal } from "@/components/vault/forms/setup-vault-modal";
import { UnlockVaultModal } from "@/components/vault/forms/unlock-vault-modal"; // Note le changement de nom pour cohérence
import { getCurrentUser } from "@/server/auth-action";
import { keysExistAction } from "@/server/vault/vault-action";
import {
  Activity,
  Fingerprint,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { currentUser } = await getCurrentUser();
  if (!currentUser) redirect("/sign-in");

  const vaultStatus = await keysExistAction();

  // Gestion de l'erreur serveur
  if (!vaultStatus.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-4 rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            Erreur de liaison
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Impossible de vérifier l&apos;état du protocole Zero-Knowledge.
            Vérifiez votre connexion au réseau sécurisé.
          </p>
        </div>
      </div>
    );
  }

  const hasVault = vaultStatus.hasKeys;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      {/* 1. Modal d'initialisation (si pas de vault) */}
      <SetupVaultModal
        user={{ name: currentUser.name, email: currentUser.email }}
        isOpen={!hasVault}
      />

      {hasVault ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
          {/* HEADER SECTION */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5 relative">
            <div className="space-y-4">
              {/* Badge Statut */}
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  Système de Chiffrement Actif
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                  Mon <span className="text-primary">Vault</span>
                </h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2 italic">
                  <Fingerprint className="h-4 w-4 opacity-40" />
                  ID:{" "}
                  <span className="text-foreground/80 font-bold">
                    {currentUser.name}
                  </span>
                </p>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Corbeille avec style "minimal-danger" */}
              <Link
                href="/dashboard/trash"
                className="group flex items-center gap-3 px-5 py-2.5 rounded-xl border border-white/5 bg-secondary/20 hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-destructive transition-colors">
                  Corbeille
                </span>
              </Link>

              {/* Le bouton de déverrouillage maître */}

              <UnlockVaultModal
                encryptedKey={vaultStatus.encryptedPrivateKey as string}
              />
            </div>
          </header>

          {/* DASHBOARD GRID / CONTENT */}
          <main className="mt-12 grid grid-cols-1 gap-12">
            {/* Folder List Component */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 opacity-50">
                <Layers className="h-4 w-4" />
                <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  Arborescence des secrets
                </span>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* SKELETON / SETUP STATE */
        <div className="relative flex flex-col items-center justify-center h-[70vh] border-2 border-dashed rounded-[4rem] bg-secondary/5 border-white/5 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative bg-background p-6 rounded-[2rem] border border-white/10 shadow-2xl">
                <ShieldCheck className="h-12 w-12 text-primary/40" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-widest text-foreground/40">
                Protocole <span className="text-primary/50">Initial</span>
              </h3>
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-black">
                Génération des paires de clés en cours...
              </p>
            </div>

            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 w-8 rounded-full bg-primary/10 overflow-hidden"
                >
                  <div
                    className="h-full bg-primary animate-[shimmer_2s_infinite_linear]"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER DASHBOARD */}
      <footer className="pt-20 pb-6 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 group">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-primary group-hover:animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
            Flux de données chiffré
          </span>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.2em]">
          CypherVault v.2.4.0 • Zero-Knowledge Architecture
        </div>
      </footer>
    </div>
  );
}
