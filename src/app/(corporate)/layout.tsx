import { CorporateSidebar } from "@/components/CorporateSidebar"
import { CorporateMobileNav } from "@/components/CorporateMobileNav"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import "@/app/globals.css"

export default async function CorporateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "CORPORATE" && session.user.role !== "ADMIN")) {
        redirect("/dashboard")
    }

    return (
        <div className="flex h-dvh w-full bg-[#050505] overflow-hidden selection:bg-indigo-500/30 text-white">
            {/* Background Ambience - Indigo themed */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] opacity-30" />
            </div>

            {/* Mobile: Top bar + Drawer + Bottom Tabs */}
            <CorporateMobileNav />

            {/* Desktop: Sidebar */}
            <CorporateSidebar />

            <main className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="min-h-full w-full p-4 pt-20 md:p-8 md:pt-8 pb-28 md:pb-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
