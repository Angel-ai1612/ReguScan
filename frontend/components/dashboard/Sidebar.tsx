"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Shield, Globe, BarChart2, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: BarChart2, label: "Dashboard" },
  { href: "/dashboard/websites", icon: Globe, label: "Websites" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-60 flex-col border-r border-white/[0.08] bg-[#050812]/[0.88] backdrop-blur-xl lg:flex">
        <BrandBlock />
        <DesktopNav pathname={pathname} />
        <StatusCard />
        <div className="flex items-center gap-3 border-t border-white/[0.08] px-5 py-4">
          <UserButton />
          <span className="truncate text-sm text-white/50">Account</span>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/[0.08] bg-[#050812]/[0.92] backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <LogoMark />
            <div className="min-w-0">
              <span className="block truncate font-bold text-white">ReguScan</span>
              <p className="truncate text-[11px] text-white/35">AI governance console</p>
            </div>
          </Link>
          <UserButton />
        </div>
        <nav aria-label="Primary navigation" className="flex gap-1 overflow-x-auto px-3 pb-3">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                  active
                    ? "bg-cyan-300/[0.12] text-cyan-100 ring-1 ring-cyan-300/[0.18]"
                    : "text-white/[0.48] hover:bg-white/[0.045] hover:text-white/80"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}

function BrandBlock() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 py-6">
      <LogoMark />
      <div>
        <span className="font-bold text-white">ReguScan</span>
        <p className="text-[11px] text-white/35">AI governance console</p>
      </div>
    </Link>
  );
}

function LogoMark() {
  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_30px_rgba(103,232,249,0.14)]">
      <Shield className="h-4 w-4 text-cyan-200" />
    </div>
  );
}
function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary navigation" className="flex-1 space-y-0.5 px-3 py-4">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-cyan-300/[0.12] text-cyan-100 ring-1 ring-cyan-300/[0.18]"
                : "text-white/50 hover:bg-white/[0.045] hover:text-white/80"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function StatusCard() {
  return (
    <div className="px-3 py-3">
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-200" />
          <p className="text-xs font-medium text-white/[0.72]">Evidence-first review</p>
        </div>
        <p className="mb-3 text-xs leading-5 text-white/[0.42]">
          Unknown or incomplete scan data is kept separate from confirmed low risk.
        </p>
        <Link
          href="/dashboard/settings"
          className="block w-full rounded-lg bg-white/[0.05] py-1.5 text-center text-xs font-medium text-white/[0.64] transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          Account settings
        </Link>
      </div>
    </div>
  );
}

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  if (href === "/dashboard/websites" && pathname.startsWith("/dashboard/scans/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}
