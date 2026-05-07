"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVault } from "@/context/vault-context";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  Lock,
  Settings,
  ShieldCheck,
  Unlock,
  User,
} from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";
import { SignOutButton } from "../forms/auth/signout";

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  const { isLocked } = useVault();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-md transition-colors duration-500">
      {/* Ligne lumineuse d'état sous la navbar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[1px] w-full transition-all duration-1000 opacity-50",
          isLocked
            ? "bg-destructive shadow-[0_1px_10px_rgba(239,68,68,0.5)]"
            : "bg-emerald-500 shadow-[0_1px_10px_rgba(16,185,129,0.5)]",
        )}
      />

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* SECTION GAUCHE : IDENTITY */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-500 shadow-2xl",
                  isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground rotate-[-5deg] group-hover:rotate-0",
                )}
              >
                <ShieldCheck className="h-6 w-6" />
              </div>

              {/* Badge d'état morphique */}
              <div
                className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center animate-in zoom-in duration-300",
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

            <div className="hidden sm:flex flex-col justify-center">
              <span className="font-black text-lg tracking-tight uppercase leading-none">
                CYPHER<span className="text-primary/80">VAULT</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={cn(
                    "h-1 w-1 rounded-full animate-pulse",
                    isLocked ? "bg-destructive" : "bg-emerald-500",
                  )}
                />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  {isLocked ? "System Locked" : "Secure Session"}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* SECTION DROITE : USER & SYSTEM */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <DarkModeToggle />
          </div>

          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

          {/* USER DROPDOWN - Amélioration UX majeure */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="pl-2 pr-3 py-1.5 h-10 rounded-full bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-primary/50 flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-inner">
                    {userName ? (
                      userName.substring(0, 2).toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex flex-col items-start hidden md:flex text-left">
                    <span className="text-[11px] font-black uppercase italic leading-none tracking-tighter">
                      {userName || "Invité"}
                    </span>
                    <span className="text-[9px] text-muted-foreground/80 font-medium">
                      Pro Plan
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 border-white/10 bg-background/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-widest font-bold p-3">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="gap-3 cursor-pointer py-2.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 cursor-pointer py-2.5">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Vault Configuration</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="">
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
