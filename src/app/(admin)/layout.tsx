import { AdminSidebar } from "@/components/AdminSidebar"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import "@/app/globals.css"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    // Redirect if not authenticated or not an admin
    if (!session || session.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="flex h-screen w-full bg-[#050505] overflow-hidden selection:bg-cyan-500/30 text-white">
            {/* Background Ambience - Cyan themed */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <AdminSidebar />

            <main className="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="h-full w-full p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
