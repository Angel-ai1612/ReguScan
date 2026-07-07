import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TokenInjector from "@/components/dashboard/TokenInjector";
import AnimatedComplianceBackground from "@/components/AnimatedComplianceBackground";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="relative min-h-screen bg-reguscan-deep">
      <AnimatedComplianceBackground className="opacity-30" />
      <Sidebar />
      <TokenInjector>
        <main className="relative z-10 px-4 pb-8 pt-24 sm:px-6 lg:ml-60 lg:p-8">{children}</main>
      </TokenInjector>
    </div>
  );
}
