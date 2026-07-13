"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Braces, FileSearch, ShieldCheck, X } from "lucide-react";
import { MotionWordmark, RiskPulse, ScanLine } from "@/components/landing/CinematicPrimitives";

const INTRO_KEY = "reguscan:intro:v3";

export default function IntroSequence() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef("");

  const restoreFocus = useCallback(() => {
    const previousFocus = previousFocusRef.current;
    previousFocusRef.current = null;
    if (previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }, []);

  const finish = useCallback(() => {
    try {
      window.localStorage.setItem(INTRO_KEY, "seen");
    } catch {
      // Storage can be unavailable in privacy-restricted browsing; the intro still exits safely.
    }
    document.body.style.overflow = previousOverflowRef.current;
    setVisible(false);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(INTRO_KEY) === "seen";
    } catch {
      seen = false;
    }

    if (reducedMotion || seen) {
      setVisible(false);
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => skipButtonRef.current?.focus());
    const timer = window.setTimeout(finish, 2550);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflowRef.current;
      restoreFocus();
    };
  }, [finish, reducedMotion, restoreFocus]);

  return (
    <AnimatePresence onExitComplete={restoreFocus}>
      {visible && (
        <motion.div
          className="reguscan-intro fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#03060c] px-5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="ReguScan website analysis introduction"
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.preventDefault();
              skipButtonRef.current?.focus();
            } else if (event.key === "Escape") {
              event.preventDefault();
              finish();
            }
          }}
        >
          <button
            ref={skipButtonRef}
            type="button"
            onClick={finish}
            className="absolute right-5 top-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 text-xs font-medium text-white/[0.64] transition hover:border-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
          >
            Skip intro <X className="h-3.5 w-3.5" />
          </button>

          <div className="relative w-full max-w-3xl">
            <ScanLine />
            <motion.div
              className="mx-auto grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.07] sm:grid-cols-3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 1.02] }}
              transition={{ duration: 1.85, times: [0, 0.2, 0.78, 1] }}
            >
              {[
                [Braces, "DOM signal", "intercomSettings"],
                [FileSearch, "Regulation", "EU AI Act · 50"],
                [AlertTriangle, "Risk marker", "Disclosure gap"],
              ].map(([Icon, label, value], index) => {
                const IntroIcon = Icon as typeof Braces;
                return (
                  <motion.div
                    key={String(label)}
                    className="bg-[#060b14] px-5 py-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.18 }}
                  >
                    <IntroIcon className="h-4 w-4 text-cyan-200/[0.72]" />
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/[0.34]">{String(label)}</p>
                    <p className="mt-1 text-sm text-white/[0.76]">{String(value)}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.55 }}
            >
              <MotionWordmark />
              <div className="mt-4 flex items-center justify-center gap-6">
                <RiskPulse tone="cyan" label="signal found" />
                <RiskPulse tone="amber" label="review mapped" />
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/[0.64]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" /> evidence linked
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
