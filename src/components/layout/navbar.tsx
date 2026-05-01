"use client";

import { SignOutButton } from "@/components/forms/auth/signout";
import { cn } from "@/lib/utils";
import { useVaultStore } from "@/store/useVaultStore";
import { LayoutDashboard, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";

export function Navbar({ userName }: { userName?: string | null }) {
  const { isUnlocked, lockVault } = useVaultStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group transition-all"
          >
            <div className="bg-primary p-1.5 rounded-md text-primary-foreground group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text">
              SecureVault
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="text-sm font-medium px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Right: Tools & Actions */}
        <div className="flex items-center gap-3">
          {/* Vault Status Indicator */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border shadow-sm",
              isUnlocked
                ? "bg-green-500/5 text-green-600 border-green-500/20 shadow-green-500/5"
                : "bg-amber-500/5 text-amber-600 border-amber-500/20 shadow-amber-500/5",
            )}
          >
            {isUnlocked ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Unlocked</span>
                <button
                  onClick={lockVault}
                  className="ml-1 p-0.5 hover:bg-green-500/20 rounded transition-colors text-green-700"
                  title="Lock Vault"
                >
                  <Lock className="h-3 w-3" />
                </button>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Locked</span>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {/* User Profile Section */}
            <div className="flex items-center gap-3 pl-2 border-l border-border/50">
              <div className="hidden lg:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold truncate max-w-30">
                  {userName || "User"}
                </span>
                <span className="text-[9px] text-primary font-bold uppercase tracking-tighter italic">
                  Pro
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
