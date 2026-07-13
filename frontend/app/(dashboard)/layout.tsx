import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TokenInjector from "@/components/dashboard/TokenInjector";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="relative min-h-screen bg-reguscan-deep">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(103,232,249,0.07),transparent_28rem),radial-gradient(circle_at_88%_12%,rgba(129,140,248,0.06),transparent_26rem)]"
      />
      <a
        href="#dashboard-main"
        className="sr-only z-50 rounded-lg bg-cyan-200 px-4 py-2 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to dashboard content
      </a>
      <Sidebar />
      <TokenInjector>
        <main id="dashboard-main" className="relative z-10 px-4 pb-8 pt-24 sm:px-6 lg:ml-60 lg:p-8">
          {children}
        </main>
      </TokenInjector>
    </div>
  );
}
