"use client"

import { useState, useEffect } from "react"
import { Car, User, Hash, Plus, Loader2, X, Search, Zap, Bike, Save, Edit2, Bell, MessageSquare, Send, CheckCircle2, Upload, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function InstitutionalVehiclesPage() {
    const [vehicles, setVehicles] = useState<any[]>([])
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<any>(null)
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const [sending, setSending] = useState(false)
    const [notifSuccess, setNotifSuccess] = useState(false)
    const [search, setSearch] = useState("")

    const [notifData, setNotifData] = useState({
        templateId: "",
        content: "",
        recipientRole: "DRIVER"
    })

    const [formData, setFormData] = useState({
        plate: "", brand: "", model: "", color: "", type: "CAR",
        isElectric: false, ownerName: "", ownerPhone: "", driverName: "", driverPhone: ""
    })

    const fetchVehicles = async () => {
        try {
            const res = await fetch("/api/corporate/vehicles")
            if (res.ok) {
                const data = await res.json()
                setVehicles(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/corporate/templates")
            if (res.ok) setTemplates(await res.json())
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchVehicles()
        fetchTemplates()
    }, [])

    const exportToCSV = () => {
        const headers = ["Placa", "Marca", "Modelo", "Color", "Tipo", "Electrico", "Propietario", "Tel Propietario", "Conductor", "Tel Conductor"]
        const rows = vehicles.map(v => [
            v.plate, v.brand, v.model, v.color || "N/A", v.type, v.isElectric ? "Si" : "No",
            v.ownerName || "N/A", v.ownerPhone || "N/A", v.driverName || "N/A", v.driverPhone || "N/A"
        ])
        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `vehiculos_inst_${new Date().toISOString().split('T')[0]}.csv`)
        link.click()
    }

    const filteredVehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
            <p className="text-gray-400 font-medium">Cargando flota institucional...</p>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase italic bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Vehículos Institucionales</h1>
                    <p className="text-gray-400 font-medium">Control vehicular de la entidad / instituciones.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
                    >
                        <Download className="h-5 w-5 text-gray-500" /> Exportar
                    </button>
                    {/* Placeholder for Import/New if needed, currently reusing corporate API */}
                </div>
            </div>

            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar vehículos..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            {vehicle.type === "MOTORCYCLE" ? <Bike className="h-20 w-20 text-emerald-400" /> : <Car className="h-20 w-20 text-emerald-400" />}
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="px-4 py-1.5 bg-emerald-500 text-black font-black text-lg rounded-xl shadow-xl">{vehicle.plate}</span>
                                {vehicle.isElectric && <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500 animate-pulse" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{vehicle.brand} <span className="font-light text-gray-500">{vehicle.model}</span></h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{vehicle.color || "Sin color"}</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <User className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{vehicle.driverName || "Sin Conductor"}</p>
                                        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">Oficial responsable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
