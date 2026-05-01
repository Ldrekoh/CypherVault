import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Fingerprint,
  KeyRound,
  Lock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 lg:px-10 h-20 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter italic">
          <div className="bg-primary p-1 rounded-md">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <span>CYPHER VAULT</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#security"
            className="hover:text-primary transition-colors"
          >
            Security
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="font-bold">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="py-24 px-6 text-center space-y-8 max-w-5xl mx-auto">
          <Badge
            variant="outline"
            className="py-1 px-4 rounded-full border-primary/20 text-primary bg-primary/5 animate-pulse"
          >
            Version 0.1.0 · Zero-Knowledge by Design
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
            Your secrets belong to{" "}
            <span className="text-primary italic">you</span>. Not us.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A privacy-first password manager built with{" "}
            <strong>Next.js 16</strong> and + <strong>OpenPGP</strong>.
            Client-side encryption ensures your plaintext never touches our
            servers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2">
                Create Secure Vault <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Fausse fenêtre de code / UI pour le look */}
          <div className="mt-16 relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-muted h-10 border-b border-border flex items-center px-4 gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                <div className="flex-1 text-[10px] text-muted-foreground font-mono text-center">
                  cypher-vault-v0.1.0 — client-side-encryption.ts
                </div>
              </div>
              <div className="p-6 text-left font-mono text-sm text-primary/80 overflow-hidden whitespace-nowrap">
                <p>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-blue-400">encryptPayload</span> ={" "}
                  <span className="text-purple-400">async</span> (data) =&gt;
                  &#123;
                </p>
                <p className="pl-4 italic text-muted-foreground">
                  Server never sees this
                </p>
                <p className="pl-4">
                  <span className="text-purple-400">return await</span> openpgp.
                  <span className="text-yellow-400">encrypt</span>(&#123;
                </p>
                <p className="pl-8 text-green-400">
                  message: <span className="text-blue-400">await</span>{" "}
                  openpgp.createMessage(&#123; text: JSON.
                  <span className="text-yellow-400">stringify</span>(data)
                  &#125;),
                </p>
                <p className="pl-8 text-green-400">
                  encryptionKeys: userPublicKey
                </p>
                <p className="pl-4">&#125;);</p>
                <p>&#125;;</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section
          id="features"
          className="py-24 bg-muted/30 border-y border-border/50"
        >
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <FeatureCard
                icon={<Lock className="h-10 w-10 text-primary" />}
                title="Client-Side PGP"
                description="Encryption and decryption happen exclusively in your browser. Even if our database leaks, your secrets are safe."
              />
              <FeatureCard
                icon={<KeyRound className="h-10 w-10 text-primary" />}
                title="Dual-Key System"
                description="Primary and recovery key pairs with rotation support. Regain access even if you forget your master password."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Built for Speed"
                description="Optimized with Neon Postgres and Next.js 16 Server Components for instant search and favorite management."
              />
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-24 text-center px-6">
          <div className="max-w-3xl mx-auto space-y-8 bg-primary/5 border border-primary/10 rounded-3xl p-12">
            <Fingerprint className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to take back control?
            </h2>
            <p className="text-muted-foreground">
              Join the early access of Cypher Vault today. Open source and
              private by design.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="font-bold px-10">
                Start Encrypting Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 px-6 bg-background">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold italic tracking-tighter opacity-50">
            <ShieldCheck className="h-5 w-5" />
            <span>CYPHER VAULT</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Cypher Vault. Built with Next.js 16 & Shadcn.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Security
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 p-6 rounded-2xl hover:bg-card hover:shadow-lg transition-all border border-transparent hover:border-border group">
      <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
