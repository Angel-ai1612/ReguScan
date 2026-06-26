import Link from "next/link";
import { ArrowLeft, BookOpen, Play, Settings, Terminal } from "lucide-react";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";

const docs = [
  {
    icon: Play,
    title: "Run a scan",
    text: "Sign in, add a public website, then trigger a scan from the website list or website detail page.",
  },
  {
    icon: BookOpen,
    title: "Read evidence",
    text: "Open the scan result to review page URL, signal, source, risk tier, confidence, article mapping, and gaps.",
  },
  {
    icon: Settings,
    title: "Configure services",
    text: "Clerk and the API URL are required for a deployed app. Pinecone, R2, Stripe, Sentry, and scheduled monitoring are optional.",
  },
  {
    icon: Terminal,
    title: "Local MVP",
    text: "Use the frontend, backend, worker, and Flower services together for the full demo workflow.",
  },
];

export default function DocsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-reguscan-deep px-5 py-8 text-white sm:px-8">
      <AnimatedComplianceBackground className="opacity-30" />
      <div className="relative mx-auto max-w-5xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/52 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>
        <header className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/62">Docs</p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Product workflow guide</h1>
          <p className="mt-4 leading-7 text-white/58">
            The app is organized around one loop: add website, run scan, inspect evidence, review gaps, export report.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {docs.map(({ icon: Icon, title, text }) => (
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
