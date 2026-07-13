import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReguScan | AI Compliance Scanner for EU AI Act Readiness",
  description:
    "ReguScan detects AI features on websites, classifies EU AI Act risk, and generates evidence-based compliance guidance for SaaS teams and businesses.",
  openGraph: {
    title: "ReguScan",
    description: "AI compliance scanner and EU AI Act risk assessment tool",
    url: "https://app.reguscan.com",
    siteName: "ReguScan",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#05080f] text-white antialiased">
          <Providers>
            {children}
            <Toaster theme="dark" position="top-right" richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
