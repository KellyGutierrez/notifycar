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
    Car,
    Layout
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const corporateNavigation = [
    { name: "Resumen", href: "/corporate", icon: LayoutDashboard },
    { name: "Mi Flota", href: "/corporate/vehicles", icon: Car },
    { name: "Mis Mensajes", href: "/corporate/templates", icon: MessageSquare },
    { name: "Notificaciones", href: "/corporate/notifications", icon: Bell },
    { name: "Mi Equipo", href: "/corporate/team", icon: Users },
    { name: "Plantilla Wpp", href: "/corporate/settings", icon: Layout },
]

export function CorporateSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-[#050505] backdrop-blur-xl border-r border-indigo-500/10 w-64 text-white hidden md:flex">
            {/* Logo Area */}
            <div className="p-6 flex flex-col items-center gap-2 border-b border-white/5">
                <Link href="/" className="flex items-center justify-center mb-1">
                    <img
                        src="/logo_white.png"
                        alt="NotifyCar Corporate"
                        className="h-20 w-auto object-contain"
                    />
                </Link>
                <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
                        Panel Corporativo
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1">
                {corporateNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
                            )}
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-indigo-400" : "group-hover:text-white")} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </div>

            {/* User Section / Logout */}
            <div className="p-4 border-t border-white/5 space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hidden md:block">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">MODO</p>
                    <p className="text-sm font-bold text-indigo-400">Control Flotas</p>
                </div>

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
