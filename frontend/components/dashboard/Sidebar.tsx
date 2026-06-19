"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Shield, Globe, BarChart2, FileText, Settings, Zap } from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/dashboard", icon: BarChart2, label: "Dashboard" },
  { href: "/dashboard/websites", icon: Globe, label: "Websites" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white/[0.02] border-r border-white/[0.06] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">ReguScan</span>
      </div>

      {/* Nav */}
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
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade hint */}
      <div className="px-3 py-3">
        <div className="glass-card p-3 text-center">
          <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-xs text-white/50 mb-2">Aug 2 deadline approaching</p>
          <Link
            href="/dashboard/settings/billing"
            className="block w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium transition-colors"
          >
            Upgrade plan
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-t border-white/[0.06] flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <span className="text-white/50 text-sm truncate">Account</span>
      </div>
    </aside>
  );
}
