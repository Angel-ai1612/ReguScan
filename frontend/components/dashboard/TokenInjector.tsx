"use client";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { clearAuthTokenProvider, setAuthTokenProvider } from "@/lib/api";

/**
 * Registers Clerk's token provider so the axios interceptor can attach auth
 * without importing hooks inside lib/api.ts.
 */
export default function TokenInjector({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const inject = async () => {
      if (!isLoaded || !isSignedIn) {
        clearAuthTokenProvider();
        setReady(false);
        return;
      }

      setAuthTokenProvider(() => getToken());
      const token = await getToken();
      if (cancelled) return;

      setReady(Boolean(token));
      if (!token) {
        retryTimer = setTimeout(inject, 500);
      }
    };

    inject();
    const interval = setInterval(inject, 50_000); // refresh before 60s expiry
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (retryTimer) clearTimeout(retryTimer);
      clearAuthTokenProvider();
    };
  }, [getToken, isLoaded, isSignedIn]);

  // Warm up Render free-tier API (wakes from sleep before user triggers scan)
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    fetch(`${apiUrl}/health`, { method: "GET" }).catch(() => {
      // Silently ignore — just a warm-up ping
    });
  }, []);

  if (!ready) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <Loader className="h-5 w-5 animate-spin text-white/40" />
      </main>
    );
  }

  return <>{children}</>;
}
