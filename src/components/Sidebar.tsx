"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, Bell, Settings, LogOut, ShieldCheck, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "next-auth/react"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Vehículos", href: "/vehicles", icon: Car },
    { name: "Notificaciones", href: "/notifications", icon: Bell },
    { name: "Configuración", href: "/settings", icon: Settings },
]

interface SidebarProps {
    isMobile?: boolean
}

export function Sidebar({ isMobile }: SidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN"

    return (
        <div className={cn(
            "flex flex-col h-full bg-black/40 backdrop-blur-xl text-white",
            !isMobile ? "border-r border-white/10 w-64 hidden md:flex" : "w-full"
        )}>
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-center border-b border-white/5">
                <Link href="/" className="flex items-center justify-center">
                    <img
                        src="/brand/vertical-color.png"
                        alt="NotifyCar"
                        className="h-16 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-white shadow-lg shadow-green-900/20 border border-green-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-full" />
                            )}
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-green-400" : "group-hover:text-white")} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}

                {/* Admin Link - Conditional */}
                {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20",
                                pathname.startsWith("/admin") && "bg-cyan-500/10 border-cyan-500/20"
                            )}
                        >
                            <ShieldAlert className="h-5 w-5" />
                            <span className="font-bold uppercase text-[11px] tracking-wider text-cyan-500">Panel de Control</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* User Section / Logout */}
            <div className="p-4 border-t border-white/5 space-y-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/account/signin" })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
                <a href="https://rowell.co/" target="_blank" rel="noopener noreferrer" className="text-center flex items-center justify-center gap-2 group cursor-pointer">
                    <img src="/rowell_logo.jpg" alt="Rowell" className="h-3 w-3 rounded-sm grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Una plataforma Rowell</p>
                </a>
            </div>
        </div>
    )
}
