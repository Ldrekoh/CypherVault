import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/server/auth/auth-action";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar userName={currentUser.name} />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
