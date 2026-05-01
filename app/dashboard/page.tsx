import { CreateFolderForm } from "@/components/folder/create-folder-form";
import { FolderList } from "@/components/folder/folder-list";
import { DebugVault } from "@/components/vault/forms/debug-vault";
import { SetupVaultModal } from "@/components/vault/forms/setup-vault-modal";
import { db } from "@/db/drizzle";
import { userKeys } from "@/db/schema";
import { getCurrentUser } from "@/server/auth/auth-action";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  const existingKeys = await db.query.userKeys.findFirst({
    where: eq(userKeys.userId, currentUser.id),
  });

  const hasVault = !!existingKeys;

  return (
    <div className="space-y-6">
      {/* Si pas de coffre, on affiche la modale par-dessus le layout vide */}
      <SetupVaultModal
        user={{ name: currentUser.name, email: currentUser.email }}
        isOpen={!hasVault}
      />

      {/* Contenu normal du Dashboard qui ne s'affiche/déverrouille que si hasVault est true */}
      {hasVault ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <h1 className="text-2xl font-bold italic uppercase tracking-tighter">
            Bienvenue dans votre coffre, {currentUser.name}
          </h1>
          <DebugVault />
        </div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center italic text-muted-foreground">
          En attente de la configuration du coffre-fort...
        </div>
      )}

      <CreateFolderForm />
      <FolderList />
    </div>
  );
}
