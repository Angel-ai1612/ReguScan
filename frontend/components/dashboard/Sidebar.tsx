"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Shield, Globe, BarChart2, FileText, Settings, Zap, Bell, Database, Users } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", icon: BarChart2, label: "Dashboard" },
  { href: "/dashboard/websites", icon: Globe, label: "Websites" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const FUTURE_NAV = [
  { icon: Bell, label: "Monitoring" },
  { icon: Database, label: "Regulation index" },
  { icon: Users, label: "Team" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-60 flex-col border-r border-white/[0.08] bg-[#050812]/86 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
          <Shield className="h-4 w-4 text-cyan-200" />
        </div>
        <div>
          <span className="font-bold text-white">ReguScan</span>
          <p className="text-[11px] text-white/35">AI governance console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-cyan-300/12 text-cyan-100 ring-1 ring-cyan-300/18"
                  : "text-white/50 hover:bg-white/[0.045] hover:text-white/80"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
        <div className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">
          Future slots
        </div>
        {FUTURE_NAV.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/28"
            title="Coming soon"
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <span className="rounded-full bg-white/[0.045] px-1.5 py-0.5 text-[10px]">Soon</span>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3">
        <div className="glass-card p-3">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-300" />
            <p className="text-xs font-medium text-white/72">Operational status</p>
          </div>
          <p className="mb-3 text-xs leading-5 text-white/42">Billing is optional for local MVP. Core scan workflow remains available.</p>
          <Link
            href="/dashboard/settings"
            className="block w-full rounded-lg bg-cyan-300/12 py-1.5 text-center text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/18"
          >
            View settings
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/[0.08] px-5 py-4">
        <UserButton />
        <span className="text-white/50 text-sm truncate">Account</span>
      </div>
    </aside>
  );
}
