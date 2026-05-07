"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileKey,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RecoveryModalProps {
  isOpen: boolean;
  recoveryCode: string | null;
  onConfirm: () => void;
}

export function RecoveryModal({
  isOpen,
  recoveryCode,
  onConfirm,
}: RecoveryModalProps) {
  const [copied, setCopied] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleCopy = async () => {
    if (!recoveryCode) return;
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
      toast.success("Code copié — Gardez-le en lieu sûr");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Échec de la copie");
    }
  };

  const handleDownload = () => {
    if (!recoveryCode) return;

    const content =
      `--- CYPHERVAULT RECOVERY KEY ---\n\n` +
      `KEY: ${recoveryCode}\n\n` +
      `WARNING: This is your ONLY access key. If lost, your data\n` +
      `cannot be recovered. Store this file offline (USB or Paper).`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cyphervault-recovery-${new Date().getFullYear()}.txt`;
    link.click();

    URL.revokeObjectURL(url);
    setHasDownloaded(true);
    toast.success("Certificat de récupération généré");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[480px] border-white/5 bg-background/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(239,68,68,0.15)] overflow-hidden">
        {/* Barre de danger supérieure */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive/20">
          <div
            className="h-full bg-destructive w-1/3 animate-[shimmer_2s_infinite_linear]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #ef4444, transparent)",
            }}
          />
        </div>

        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20 rotate-3">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border border-destructive/20 flex items-center justify-center animate-bounce">
              <AlertTriangle className="h-3 w-3 text-destructive" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
              Clé de <span className="text-destructive">Secours</span>
            </DialogTitle>
            <DialogDescription className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Protocole de récupération d&apos;urgence
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <p className="text-sm text-center leading-relaxed text-muted-foreground px-4">
            Ceci est votre unique **Pass-Phrase**. Sans elle, l&apos;accès à
            votre coffre sera **définitivement perdu** en cas d&apos;oubli.
          </p>

          <div className="relative group">
            <div
              className={cn(
                "flex items-center justify-center p-8 bg-secondary/30 rounded-[1.5rem] border-2 border-dashed transition-colors duration-500",
                copied
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/5 group-hover:border-primary/20",
              )}
            >
              <span className="font-mono text-xl md:text-2xl font-black tracking-[0.25em] text-primary select-all">
                {recoveryCode}
              </span>
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="absolute -top-3 right-4 rounded-full border border-white/5 shadow-xl font-bold text-[10px] uppercase gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  {" "}
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                  Copié{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Copy className="h-3 w-3" /> Copier{" "}
                </>
              )}
            </Button>
          </div>

          <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-4 flex gap-4 items-start">
            <FileKey className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-destructive">
                Avertissement de non-rétention
              </p>
              <p className="text-[11px] text-destructive/80 leading-tight font-medium italic">
                Nous ne stockons aucune copie. Ce code n&apos;existe que sur cet
                écran et dans votre futur stockage personnel.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary/50 rounded-xl py-6"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            {hasDownloaded ? "Régénérer .txt" : "Exporter le kit"}
          </Button>

          <Button
            type="button"
            className={cn(
              "flex-1 py-6 rounded-xl font-black uppercase italic tracking-tight transition-all duration-500",
              hasDownloaded
                ? "bg-primary shadow-[0_10px_20px_-5px_rgba(var(--primary),0.4)]"
                : "bg-muted text-muted-foreground",
            )}
            onClick={onConfirm}
            disabled={!recoveryCode}
          >
            Protocole Validé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
