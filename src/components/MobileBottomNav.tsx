"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface BottomNavItem {
    name: string
    href: string
    icon: LucideIcon
    exact?: boolean
}

interface MobileBottomNavProps {
    items: BottomNavItem[]
    themeColor?: "green" | "cyan" | "emerald" | "indigo"
    onMoreClick?: () => void
    moreIcon?: LucideIcon
}

const colorMap = {
    green: {
        active: "text-green-400",
        activeBg: "bg-green-500/15",
        activeDot: "bg-green-400",
        indicator: "bg-green-400",
        border: "border-green-500/10",
    },
    cyan: {
        active: "text-cyan-400",
        activeBg: "bg-cyan-500/15",
        activeDot: "bg-cyan-400",
        indicator: "bg-cyan-400",
        border: "border-cyan-500/10",
    },
    emerald: {
        active: "text-emerald-400",
        activeBg: "bg-emerald-500/15",
        activeDot: "bg-emerald-400",
        indicator: "bg-emerald-400",
        border: "border-emerald-500/10",
    },
    indigo: {
        active: "text-indigo-400",
        activeBg: "bg-indigo-500/15",
        activeDot: "bg-indigo-400",
        indicator: "bg-indigo-400",
        border: "border-indigo-500/10",
    },
}

export function MobileBottomNav({
    items,
    themeColor = "green",
    onMoreClick,
    moreIcon: MoreIcon,
}: MobileBottomNavProps) {
    const pathname = usePathname()
    const colors = colorMap[themeColor]

    const isActive = (item: BottomNavItem) => {
        if (item.exact) return pathname === item.href
        return pathname === item.href || pathname.startsWith(item.href + "/")
    }

    return (
        /* Bottom nav bar — only on mobile, above safe area */
        <nav
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 z-[50]",
                "bg-black/80 backdrop-blur-2xl border-t",
                colors.border
            )}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
            <div className="flex items-stretch justify-around h-16">
                {items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 flex-1 px-1",
                                "transition-all duration-200 active:scale-90",
                                active ? colors.active : "text-gray-500"
                            )}
                        >
                            {/* Active indicator line at top */}
                            <span
                                className={cn(
                                    "absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300",
                                    active ? `w-8 ${colors.indicator}` : "w-0 bg-transparent"
                                )}
                            />

                            {/* Icon wrapper */}
                            <span
                                className={cn(
                                    "flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200",
                                    active ? colors.activeBg : "bg-transparent"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "transition-all duration-200",
                                        active ? "h-5 w-5" : "h-5 w-5 opacity-60"
                                    )}
                                />
                            </span>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-[9px] font-semibold tracking-wide uppercase truncate max-w-full px-1",
                                    "transition-all duration-200",
                                    active ? "opacity-100" : "opacity-50"
                                )}
                            >
                                {item.name}
                            </span>
                        </Link>
                    )
                })}

                {/* "More" button — opens the full sidebar drawer */}
                {MoreIcon && onMoreClick && (
                    <button
                        onClick={onMoreClick}
                        className={cn(
                            "relative flex flex-col items-center justify-center gap-1 flex-1 px-1",
                            "transition-all duration-200 active:scale-90 text-gray-500"
                        )}
                    >
                        <span className="flex items-center justify-center w-10 h-7 rounded-xl bg-transparent">
                            <MoreIcon className="h-5 w-5 opacity-60" />
                        </span>
                        <span className="text-[9px] font-semibold tracking-wide uppercase opacity-50">
                            Más
                        </span>
                    </button>
                )}
            </div>
        </nav>
    )
}
