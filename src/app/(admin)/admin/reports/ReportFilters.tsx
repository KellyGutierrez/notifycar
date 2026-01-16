"use client"

import { RotateCcw, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ReportFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)

        router.push(`?${params.toString()}`)
    }

    const reset = () => {
        setStartDate("")
        setEndDate("")
        router.push("/admin/reports")
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex-1 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Filter className="h-4 w-4 text-cyan-400" />
                    Filtrar por Rango de Fechas
                </h3>
                <p className="text-xs text-gray-400">Selecciona el periodo para ver las estadísticas.</p>
            </div>

            <div className="space-y-2 w-full md:w-auto">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Desde</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={() => handleFilterChange("startDate", startDate)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all [color-scheme:dark]"
                />
            </div>

            <div className="space-y-2 w-full md:w-auto">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Hasta</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={() => handleFilterChange("endDate", endDate)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all [color-scheme:dark]"
                />
            </div>

            <button
                onClick={reset}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title="Limpiar filtros"
            >
                <RotateCcw className="h-4 w-4" />
            </button>
        </div>
    )
}
