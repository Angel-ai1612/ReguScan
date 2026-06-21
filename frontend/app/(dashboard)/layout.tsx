import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TokenInjector from "@/components/dashboard/TokenInjector";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#0a0818]">
      <Sidebar />
      <TokenInjector>
        <main className="flex-1 ml-60 p-8 overflow-y-auto">{children}</main>
      </TokenInjector>
    </div>
  );
}
