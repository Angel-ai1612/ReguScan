"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { MotionWordmark } from "@/components/landing/CinematicPrimitives";

const links = [
  ["How it scans", "#scan-story"],
  ["Evidence", "#evidence"],
  ["Command center", "#command-center"],
  ["Pricing", "/pricing"],
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav aria-label="Primary navigation" className="relative z-40 mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" aria-label="ReguScan home">
        <MotionWordmark compact />
      </Link>

      <div className="hidden items-center gap-7 lg:flex">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="text-xs font-medium text-white/[0.54] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            {label}
          </Link>
        ))}
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <SignInButton mode="modal">
          <button className="min-h-11 rounded-full px-4 text-xs font-medium text-white/[0.62] transition hover:bg-white/[0.045] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="min-h-11 rounded-full bg-cyan-200 px-5 text-xs font-semibold text-[#061019] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200">
            Scan Your Website
          </button>
        </SignUpButton>
      </div>

      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-white sm:hidden"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="absolute inset-x-5 top-[76px] rounded-2xl border border-white/10 bg-[#07101b] p-3 shadow-2xl sm:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
          >
            {links.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="block min-h-11 rounded-xl px-3 py-3 text-sm text-white/[0.72] hover:bg-white/[0.045] hover:text-white">
                {label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
              <SignInButton mode="modal">
                <button className="min-h-11 rounded-xl border border-white/10 text-xs font-medium text-white/[0.72]">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="min-h-11 rounded-xl bg-cyan-200 text-xs font-semibold text-[#061019]">Start scan</button>
              </SignUpButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
