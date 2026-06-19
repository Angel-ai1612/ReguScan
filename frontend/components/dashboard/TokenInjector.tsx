"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * Injects the Clerk JWT into window.__clerk_token so the axios
 * interceptor can pick it up without importing hooks inside lib/api.ts.
 */
export default function TokenInjector() {
  const { getToken } = useAuth();

  useEffect(() => {
    const inject = async () => {
      const token = await getToken();
      (window as any).__clerk_token = token;
    };

    inject();
    const interval = setInterval(inject, 50_000); // refresh before 60s expiry
    return () => clearInterval(interval);
  }, [getToken]);

  // Warm up Render free-tier API (wakes from sleep before user triggers scan)
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    fetch(`${apiUrl}/health`, { method: "GET" }).catch(() => {
      // Silently ignore — just a warm-up ping
    });
  }, []);

  return null;
}
