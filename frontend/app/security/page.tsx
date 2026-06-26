import Link from "next/link";
import { ArrowLeft, KeyRound, Lock, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";

const items: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: "Authentication",
    text: "Clerk protects sign-up, sign-in, and authenticated dashboard routes.",
    icon: KeyRound,
  },
  {
    title: "API access",
    text: "Frontend requests use Clerk token injection before calling the FastAPI backend.",
    icon: Lock,
  },
  {
    title: "Scan scope",
    text: "ReguScan reviews public website pages and public technical signals.",
    icon: Server,
  },
  {
    title: "Compliance posture",
    text: "Findings are technical guidance for review, not legal advice or certification.",
    icon: ShieldCheck,
  },
];

export default function SecurityPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-reguscan-deep px-5 py-8 text-white sm:px-8">
      <AnimatedComplianceBackground className="opacity-30" />
      <div className="relative mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/52 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">Security</p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Clear data handling for a public-website scanner.</h1>
          <p className="mt-4 leading-7 text-white/58">
            ReguScan is built around authenticated workspaces, public website evidence collection, and transparent scan results.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(({ title, text, icon: Icon }) => (
            <div key={title} className="command-card p-6">
              <Icon className="h-5 w-5 text-cyan-200" />
              <h2 className="mt-4 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
