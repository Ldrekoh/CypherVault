import { Navbar } from "@/components/layout/navbar";
import { db } from "@/db/drizzle";
import { userKeys } from "@/db/schema";
import { getCurrentUser } from "@/server/auth/auth-action";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = await getCurrentUser();
  const keys = await db.query.userKeys.findFirst({
    where: eq(userKeys.userId, currentUser.id),
  });

  return (
    <>
      <Navbar
        userName={currentUser.name}
        encryptedKey={keys?.encryptedPrivateKey || ""}
      />
      <main>{children}</main>
    </>
  );
}
