"use client"

import { LayoutGrid, List, Square, AlignJustify } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list" | "compact"

interface ViewSwitcherProps {
    currentView: ViewMode
}

export function ViewSwitcher({ currentView }: ViewSwitcherProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const setView = (view: ViewMode) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("view", view)
        router.push(`?${params.toString()}`)
    }

    const views = [
        { id: "grid" as const, icon: LayoutGrid, label: "Cuadrícula" },
        { id: "list" as const, icon: List, label: "Lista" },
        { id: "compact" as const, icon: Square, label: "Compacto" },
    ]

    return (
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
            {views.map((view) => (
                <button
                    key={view.id}
                    onClick={() => setView(view.id)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
                        currentView === view.id
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    title={view.label}
                >
                    <view.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{view.label}</span>
                </button>
            ))}
        </div>
    )
}
