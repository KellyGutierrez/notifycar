"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Car,
    Bell,
    Settings,
    LogOut,
    ShieldAlert,
    BarChart3,
    MessageSquare,
    Building2,
    Phone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const adminNavigation = [
    { name: "Resumen", href: "/admin", icon: LayoutDashboard },
    { name: "Usuarios", href: "/admin/users", icon: Users },
    { name: "Corporativos", href: "/admin/corporates", icon: Building2 },
    { name: "Institucionales", href: "/admin/institutionals", icon: ShieldAlert },
    { name: "Vehículos", href: "/admin/vehicles", icon: Car },
    { name: "Mensajes WhatsApp", href: "/admin/whatsapp-layout", icon: MessageSquare },
    { name: "Notificaciones", href: "/admin/notifications", icon: Bell },
    { name: "Mensajes", href: "/admin/templates", icon: MessageSquare },
    { name: "Números Emergencia", href: "/admin/emergency", icon: Phone },
    { name: "Reportes", href: "/admin/reports", icon: BarChart3 },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-[#050505] backdrop-blur-xl border-r border-cyan-500/10 w-64 text-white hidden md:flex">
            {/* Logo Area */}
            <div className="p-6 flex flex-col items-center gap-2 border-b border-white/5">
                <Link href="/" className="flex items-center justify-center mb-1">
                    <img
                        src="/logo.png"
                        alt="NotifyCar Admin"
                        className="h-20 w-auto object-contain"
                    />
                </Link>
                <span className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">
                    Admin Panel
                </span>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1">
                {adminNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white shadow-lg shadow-cyan-900/20 border border-cyan-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-full" />
                            )}
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-cyan-400" : "group-hover:text-white")} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
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
