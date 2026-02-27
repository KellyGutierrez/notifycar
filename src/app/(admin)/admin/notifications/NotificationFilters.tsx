"use client"

import { Search, RotateCcw, Filter, Calendar, ChevronDown } from "lucide-react"
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl">
            {/* Search Input */}
            <div className="md:col-span-4 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <Search className="h-3 w-3 text-cyan-500" />
                    Filtrar por Placa
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="ZAG82..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-5 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all uppercase font-medium placeholder:text-gray-600 shadow-inner"
                    />
                </div>
            </div>

            {/* Status Select */}
            <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                    <Filter className="h-3 w-3 text-cyan-500" />
                    Estado
                </label>
                <div className="relative group">
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                            handleFilterChange("status", e.target.value)
                        }}
                        className="w-full appearance-none bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all font-medium shadow-inner cursor-pointer"
                    >
                        <option value="ALL">TODOS</option>
                        <option value="SENT">ENVIADOS</option>
                        <option value="PENDING">PENDIENTES</option>
                        <option value="FAILED">FALLIDOS</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-hover:text-cyan-400 transition-colors" />
                </div>
            </div>

            {/* Dates Inputs */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-cyan-500" />
                        Desde
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        onBlur={() => handleFilterChange("startDate", startDate)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-[14px] text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all [color-scheme:dark] shadow-inner font-medium"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-cyan-500" />
                        Hasta
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        onBlur={() => handleFilterChange("endDate", endDate)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-[14px] text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all [color-scheme:dark] shadow-inner font-medium"
                    />
                </div>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1">
                <button
                    onClick={reset}
                    className="h-[52px] w-full flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-red-500/30 transition-all group shadow-lg active:scale-95"
                    title="Limpiar filtros"
                >
                    <RotateCcw className="h-5 w-5 group-hover:rotate-[-180deg] transition-transform duration-500" />
                </button>
            </div>
        </div>
    )
}

