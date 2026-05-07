import { Navbar } from "@/components/layout/navbar";
import { VaultProvider } from "@/context/vault-context";
import { getCurrentUser } from "@/server/auth-action";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Récupération des données utilisateur côté serveur
  const { currentUser } = await getCurrentUser();

  // Sécurité : redirection si non connecté
  if (!currentUser) {
    redirect("/login");
  }

  return (
    <VaultProvider>
      {/*
          On utilise min-h-screen pour que le background couvre toute la page.
          Le bg-slate-50/30 ou une légère teinte permet de détacher les cartes blanches.
      */}
      <div className="relative min-h-screen bg-background">
        {/* NAVBAR : sticky géré à l'intérieur du composant */}
        <Navbar userName={currentUser.name} />

        {/*
            MAIN : On ajoute un conteneur pour centrer le contenu
            et un padding responsif pour ne pas coller aux bords.
        */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="animate-in fade-in duration-500">{children}</div>
        </main>

        {/*
            Optionnel : Un subtil gradient en background pour le côté "Vault"
            qui rappelle la sécurité sans être intrusif.
        */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.2]" />
      </div>
    </VaultProvider>
  );
}
