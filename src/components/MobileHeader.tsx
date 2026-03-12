"use client"

import { useState, useCallback } from "react"
import { Menu, X, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MobileHeaderProps {
    children: React.ReactNode
    logo?: string
    title?: string
    themeColor?: "green" | "cyan" | "emerald" | "indigo"
    notificationsLink?: string
    /** Optional: expose control to open/close from outside (e.g. bottom nav "Más" button) */
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const borderMap = {
    green: "border-green-500/10",
    cyan: "border-cyan-500/10",
    emerald: "border-emerald-500/10",
    indigo: "border-indigo-500/10",
}

const textMap = {
    green: "text-green-500",
    cyan: "text-cyan-500",
    emerald: "text-emerald-500",
    indigo: "text-indigo-500",
}

export function MobileHeader({
    children,
    logo = "/brand/horizontal-white.png",
    title = "NotifyCar",
    themeColor = "green",
    notificationsLink = "/notifications",
    isOpen: externalIsOpen,
    onOpenChange,
}: MobileHeaderProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false)

    // Support both controlled and uncontrolled usage
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

    const setOpen = useCallback(
        (next: boolean) => {
            setInternalIsOpen(next)
            onOpenChange?.(next)
        },
        [onOpenChange]
    )

    const borderClass = borderMap[themeColor]
    const textClass = textMap[themeColor]

    return (
        <div className="md:hidden">
            {/* ── Top Bar ─────────────────────────────────────────── */}
            <div
                className={cn(
                    "fixed left-0 right-0 top-0 z-[50]",
                    "h-16 flex items-center justify-between px-4",
                    "bg-black/70 backdrop-blur-2xl border-b",
                    borderClass
                )}
                /* Push content below status bar on notch devices */
                style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
            >
                {/* Hamburger */}
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Abrir menú"
                    className="p-2 -ml-2 text-gray-400 hover:text-white active:scale-90 transition-all rounded-xl hover:bg-white/5"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 select-none">
                    <img src={logo} alt={title} className="h-7 w-auto object-contain" />
                </Link>

                {/* Bell */}
                <Link
                    href={notificationsLink}
                    aria-label="Notificaciones"
                    className="p-2 -mr-2 text-gray-400 hover:text-white active:scale-90 transition-all rounded-xl hover:bg-white/5"
                >
                    <Bell className="h-5 w-5" />
                </Link>
            </div>

            {/* ── Overlay ─────────────────────────────────────────── */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm",
                    "transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />

            {/* ── Drawer ──────────────────────────────────────────── */}
            <div
                className={cn(
                    "fixed left-0 top-0 bottom-0 z-[101]",
                    "w-[min(280px,85vw)] bg-[#050505] border-r",
                    "transition-transform duration-300 ease-in-out will-change-transform",
                    borderClass,
                    isOpen ? "translate-x-0 shadow-2xl shadow-black/60" : "-translate-x-full"
                )}
                /* Respect the left safe area (some Android cutout designs) */
                style={{ paddingLeft: "env(safe-area-inset-left, 0px)" }}
            >
                <div className="flex h-full flex-col">
                    {/* Drawer header */}
                    <div
                        className="shrink-0 px-4 flex items-center justify-between border-b border-white/5"
                        style={{
                            paddingTop: "max(1rem, env(safe-area-inset-top, 1rem))",
                            paddingBottom: "1rem",
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <img src={logo} alt={title} className="h-8 w-auto" />
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", textClass)}>
                                {title}
                            </span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Cerrar menú"
                            className="p-2 text-gray-400 hover:text-white active:scale-90 transition-all rounded-xl hover:bg-white/5"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Scrollable nav — close drawer on any nav tap */}
                    <div
                        className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain"
                        onClick={() => setOpen(false)}
                    >
                        {children}
                    </div>

                    {/* Bottom safe area spacer */}
                    <div style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} />
                </div>
            </div>
        </div>
    )
}
