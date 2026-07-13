"use client";
import { useAuth } from "@clerk/nextjs";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { clearAuthTokenProvider, setAuthTokenProvider } from "@/lib/api";

/**
 * Registers Clerk's token provider so the axios interceptor can attach auth
 * without importing hooks inside lib/api.ts.
 */
export default function TokenInjector({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [ready, setReady] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const inject = async () => {
      if (!isLoaded || !isSignedIn) {
        clearAuthTokenProvider();
        setReady(false);
        setTokenError(false);
        return;
      }

      try {
        setAuthTokenProvider(() => getToken());
        const token = await getToken();
        if (cancelled) return;

        setTokenError(false);
        setReady(Boolean(token));
        if (!token) {
          retryTimer = setTimeout(() => void inject(), 500);
        }
      } catch {
        if (cancelled) return;
        clearAuthTokenProvider();
        setReady(false);
        setTokenError(true);
      }
    };

    void inject();
    const interval = setInterval(() => void inject(), 50_000); // refresh before 60s expiry
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (retryTimer) clearTimeout(retryTimer);
      clearAuthTokenProvider();
    };
  }, [getToken, isLoaded, isSignedIn, retryKey]);

  // Warm up Render free-tier API (wakes from sleep before user triggers scan)
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    fetch(`${apiUrl}/health`, { method: "GET" }).catch(() => {
      // Silently ignore — just a warm-up ping
    });
  }, []);

  if (!ready) {
    if (tokenError) {
      return (
        <div className="flex min-h-[320px] flex-1 items-center justify-center p-8" role="alert">
          <div className="max-w-md rounded-lg border border-amber-200/[0.18] bg-amber-200/[0.06] p-6 text-center">
            <AlertTriangle className="mx-auto h-5 w-5 text-amber-200" aria-hidden="true" />
            <p className="mt-3 font-semibold text-white">Authentication could not be initialized</p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              ReguScan could not obtain a secure session token. Authenticated dashboard requests are paused until the session recovers.
            </p>
            <button
              type="button"
              onClick={() => {
                setTokenError(false);
                setRetryKey((current) => current + 1);
              }}
              className="mt-5 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Try authentication again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center p-8" role="status" aria-live="polite">
        <Loader className="h-5 w-5 animate-spin text-white/40" aria-hidden="true" />
        <span className="sr-only">Initializing secure dashboard session</span>
      </div>
    );
  }

  return <>{children}</>;
}
