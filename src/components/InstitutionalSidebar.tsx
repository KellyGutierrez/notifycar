"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Bell,
    Settings,
    LogOut,
    MessageSquare,
    Users,
    Building2,
    Car
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const institutionalNavigation = [
    { name: "Resumen", href: "/institutional", icon: LayoutDashboard },
    { name: "Mi Equipo", href: "/institutional/operators", icon: Users },
    { name: "Vehículos", href: "/institutional/vehicles", icon: Car },
    { name: "Mensajes", href: "/institutional/templates", icon: MessageSquare },
    { name: "Notificaciones", href: "/institutional/notifications", icon: Bell },
    { name: "Plantilla Wpp", href: "/institutional/settings", icon: Settings },
]

export function InstitutionalSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-[#050505] backdrop-blur-xl border-r border-emerald-500/10 w-64 text-white hidden md:flex">
            {/* Logo Area */}
            <div className="p-6 flex flex-col items-center gap-2 border-b border-white/5">
                <Link href="/" className="flex items-center justify-center mb-1">
                    <img
                        src="/logo_white.png"
                        alt="NotifyCar Institutional"
                        className="h-16 w-auto object-contain"
                    />
                </Link>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
                        Panel Institucional
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1">
                {institutionalNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                            )}
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-400" : "group-hover:text-white")} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </div>

            {/* Organization Info (Optional helper) */}
            <div className="px-6 py-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Modo</p>
                    <p className="text-xs font-bold text-emerald-400">Control Zonas Azules</p>
                </div>
            </div>

            {/* User Section / Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => signOut({ callbackUrl: "/account/signin" })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
