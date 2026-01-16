"use client"

import { Search, RotateCcw, Filter } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

export function NotificationFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [status, setStatus] = useState(searchParams.get("status") || "ALL")
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")

    const debouncedSearch = useDebounce(search, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedSearch) params.set("search", debouncedSearch)
        else params.delete("search")

        router.push(`?${params.toString()}`)
    }, [debouncedSearch])

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "ALL") params.set(key, value)
        else params.delete(key)

        router.push(`?${params.toString()}`)
    }

    const reset = () => {
        setSearch("")
        setStatus("ALL")
        setStartDate("")
        setEndDate("")
        router.push("/admin/notifications")
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex-1 space-y-2 w-full">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Buscar Placa</label>
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filtrar por placa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all uppercase"
                    />
                </div>
            </div>

            <div className="space-y-2 w-full md:w-auto">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Estado</label>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value)
                        handleFilterChange("status", e.target.value)
                    }}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition-all"
                >
                    <option value="ALL">Todos</option>
                    <option value="SENT">Enviado</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="FAILED">Error</option>
                </select>
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
