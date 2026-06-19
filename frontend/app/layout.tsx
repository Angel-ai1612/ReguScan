import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Providers from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ReguScan — EU AI Act Compliance Scanner",
  description:
    "Scan your website for EU AI Act compliance gaps. Identify AI systems, classify risk, and get actionable remediation steps in minutes.",
  openGraph: {
    title: "ReguScan",
    description: "EU AI Act Compliance Scanner",
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
