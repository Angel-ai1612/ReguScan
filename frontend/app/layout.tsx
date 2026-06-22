import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Providers from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <html lang="en" className={inter.variable}>
        <body className="bg-[#0a0818] text-white antialiased">
          <Providers>
            {children}
            <Toaster theme="dark" position="top-right" richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
