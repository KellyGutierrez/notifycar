import { Sidebar } from "@/components/Sidebar"
import { DashboardMobileNav } from "@/components/DashboardMobileNav"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import "@/app/globals.css"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/account/signin")
    }

    return (
        <div className="flex h-dvh w-full bg-[#09090b] overflow-hidden selection:bg-green-500/30 text-white">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-900/20 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[100px] opacity-40" />
            </div>

            {/* Mobile: Top bar + Drawer + Bottom Tabs (client component) */}
            <DashboardMobileNav />

            {/* Desktop: Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {/* pt-16 → clears mobile top bar; pb-28 → clears mobile bottom nav + extra space */}
                <div className="min-h-full w-full p-4 pt-20 pb-28 md:p-8 md:pt-8 md:pb-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
