"use client"

import { useState, useEffect } from "react"
import { Car, User, Hash, Plus, Loader2, X, Search, Zap, Bike, Save } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CorporateVehiclesPage() {
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState("")

    // Form state
    const [formData, setFormData] = useState({
        plate: "",
        brand: "",
        model: "",
        color: "",
        type: "CAR",
        isElectric: false
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

    useEffect(() => {
        fetchVehicles()
    }, [])

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch("/api/corporate/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                await fetchVehicles()
                setIsAddModalOpen(false)
                setFormData({ plate: "", brand: "", model: "", color: "", type: "CAR", isElectric: false })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const filteredVehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                <p className="text-gray-400 font-medium">Cargando flota...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase italic bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Gestión de Flota</h1>
                    <p className="text-gray-400 font-medium">Administra los vehículos asignados a tu empresa.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Registrar Vehículo
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar por placa, marca o modelo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                />
            </div>

            {/* Grid de Vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle: any) => (
                    <div
                        key={vehicle.id}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Car className="h-20 w-20 text-indigo-400 -rotate-12 translate-x-4 -translate-y-4" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="px-4 py-1.5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-black text-xl rounded-xl shadow-2xl shadow-indigo-900/40 tracking-widest border border-white/10 uppercase">
                                    {vehicle.plate}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Estado</p>
                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Activo</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">
                                        {vehicle.brand} <span className="font-light text-indigo-500/80">{vehicle.model}</span>
                                    </h3>
                                    {vehicle.isElectric && <Zap className="h-4 w-4 text-yellow-400 fill-current" />}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                                        <Hash className="h-3 w-3 text-indigo-500" />
                                        Color: {vehicle.color || "N/A"}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                                        {vehicle.type === "MOTORCYCLE" ? <Bike className="h-3 w-3 text-indigo-500" /> : <Car className="h-3 w-3 text-indigo-500" />}
                                        {vehicle.type === "MOTORCYCLE" ? "Moto" : "Auto"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredVehicles.length === 0 && (
                    <div className="col-span-full py-24 bg-white/[0.02] border-2 border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                            <Car className="h-10 w-10 text-gray-700 animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold text-gray-400">Sin vehículos en tu flota</p>
                            <p className="text-sm text-gray-600">Comienza agregando el primer vehículo de tu organización.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Registro */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x" />
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Registrar Vehículo</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddVehicle} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Placa / Matrícula</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="ABC-123"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-black uppercase placeholder:text-gray-700"
                                        value={formData.plate}
                                        onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Marca</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Mazda"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Modelo</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="CX-30"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                            value={formData.model}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Tipo de Vehículo</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: "CAR" })}
                                            className={cn(
                                                "py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-2",
                                                formData.type === "CAR" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                                            )}
                                        >
                                            <Car className="h-4 w-4" /> Automóvil
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: "MOTORCYCLE" })}
                                            className={cn(
                                                "py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-2",
                                                formData.type === "MOTORCYCLE" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                                            )}
                                        >
                                            <Bike className="h-4 w-4" /> Motocicleta
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <Zap className={cn("h-5 w-5 transition-colors", formData.isElectric ? "text-yellow-400 fill-current" : "text-gray-600")} />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-white uppercase tracking-tight">Vehículo Eléctrico</p>
                                        <p className="text-[9px] text-gray-500">Habilita opciones de carga en el envío.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded-lg accent-indigo-500"
                                        checked={formData.isElectric}
                                        onChange={(e) => setFormData({ ...formData, isElectric: e.target.checked })}
                                    />
                                </div>

                                <button
                                    disabled={saving}
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Guardar Vehículo
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
