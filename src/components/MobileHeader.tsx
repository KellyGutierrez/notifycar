"use client"

import { useState } from "react"
import { Menu, X, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileHeaderProps {
    children: React.ReactNode
    logo?: string
    title?: string
    themeColor?: "green" | "cyan" | "emerald" | "indigo"
    notificationsLink?: string
}

export function MobileHeader({
    children,
    logo = "/logo.png",
    title = "NotifyCar",
    themeColor = "green",
    notificationsLink = "/notifications"
}: MobileHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const themeClasses = {
        green: "text-green-500",
        cyan: "text-cyan-500",
        emerald: "text-emerald-500",
        indigo: "text-indigo-500"
    }

    const borderClasses = {
        green: "border-green-500/10",
        cyan: "border-cyan-500/10",
        emerald: "border-emerald-500/10",
        indigo: "border-indigo-500/10"
    }

    return (
        <div className="md:hidden">
            {/* Top Bar - Fixed */}
            <div className={cn(
                "fixed top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-xl border-b z-[50] flex items-center justify-between px-4 shadow-lg",
                borderClasses[themeColor]
            )}>
                {/* Hamburger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Abrir menú"
                    className="p-2 -ml-2 text-gray-400 hover:text-white active:scale-95 transition-all duration-150 rounded-lg hover:bg-white/5"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Logo / Brand */}
                <Link href="/" className="flex items-center gap-2 select-none">
                    <img src={logo} alt={title} className="h-9 w-auto object-contain" />
                    <span className={cn("text-[11px] font-black uppercase tracking-widest", themeClasses[themeColor])}>
                        {title}
                    </span>
                </Link>

                {/* Notification Bell */}
                <Link
                    href={notificationsLink}
                    aria-label="Notificaciones"
                    className="p-2 -mr-2 text-gray-400 hover:text-white active:scale-95 transition-all duration-150 rounded-lg hover:bg-white/5"
                >
                    <Bell className="h-5 w-5" />
                </Link>
            </div>

            {/* Sidebar Overlay - CSS transition based, no unmount flicker */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar Drawer */}
            <div className={cn(
                "fixed left-0 top-0 bottom-0 w-[280px] bg-[#050505] border-r z-[101] transition-transform duration-300 ease-in-out transform will-change-transform",
                borderClasses[themeColor],
                isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col">
                    {/* Drawer Header */}
                    <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt={title} className="h-8 w-auto" />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", themeClasses[themeColor])}>
                                {title}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Cerrar menú"
                            className="p-2 text-gray-400 hover:text-white active:scale-95 transition-all duration-150 rounded-lg hover:bg-white/5"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Drawer Content - sidebar nav, closes drawer on nav click */}
                    <div
                        className="flex-1 overflow-y-auto custom-scrollbar"
                        onClick={() => setIsOpen(false)}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
