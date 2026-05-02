"use client";

import { useVault } from "@/components/context/vault-context"; // Import du context
import { cn } from "@/lib/utils";
import { Lock, ShieldCheck, Unlock, UserCircle } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  const { isLocked } = useVault(); // On récupère l'état pour l'UI

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          >
            <div className="relative">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:rotate-[10deg] transition-transform duration-300 shadow-lg shadow-primary/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              {/* Badge de statut du coffre flottant sur le logo */}
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center",
                  isLocked ? "bg-destructive" : "bg-emerald-500",
                )}
              >
                {isLocked ? (
                  <Lock className="h-2 w-2 text-white" />
                ) : (
                  <Unlock className="h-2 w-2 text-white" />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter italic uppercase leading-none">
                CYPHER<span className="text-primary">VAULT</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground leading-none mt-1">
                Security Suite
              </span>
            </div>
          </Link>
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-4">
          {/* User Status Badge */}
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50">
            <UserCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-black uppercase italic tracking-tight">
              {userName ? userName : "Invité"}
            </span>
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                userName ? "bg-emerald-500" : "bg-muted-foreground",
              )}
            />
          </div>

          <div className="h-6 w-px bg-border/60 mx-1" />

          <div className="flex items-center gap-1">
            <DarkModeToggle />

            {/* On pourrait ajouter un bouton de logout ici ou un menu déroulant */}
          </div>
        </div>
      </div>
    </nav>
  );
}
