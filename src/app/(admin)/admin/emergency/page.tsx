"use client"

import { useState, useEffect } from "react"
import { Phone, Plus, Loader2, X, Trash2, Globe, Shield, Truck, LifeBuoy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminEmergencyPage() {
    const [configs, setConfigs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        country: "",
        police: "123",
        transit: "123",
        emergency: "123"
    })

    const fetchConfigs = async () => {
        try {
            const res = await fetch("/api/admin/emergency")
            if (res.ok) {
                const data = await res.json()
                setConfigs(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchConfigs()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch("/api/admin/emergency", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                fetchConfigs()
                setIsModalOpen(false)
                setFormData({ country: "", police: "123", transit: "123", emergency: "123" })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const deleteConfig = async (id: string) => {
        if (!confirm("¿Eliminar configuración para este país?")) return
        try {
            const res = await fetch(`/api/admin/emergency?id=${id}`, {
                method: "DELETE"
            })
            if (res.ok) fetchConfigs()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Contactos de Emergencia</h1>
                    <p className="text-gray-400">Configura los números de ayuda locales por país.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-cyan-500/20"
                >
                    <Plus className="h-5 w-5" /> Agregar País
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {configs.map((cfg) => (
                        <div key={cfg.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{cfg.country}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">NÚMEROS DE AYUDA</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Shield className="h-4 w-4 text-red-500/50" /> Policía
                                    </div>
                                    <span className="font-black text-white">{cfg.police}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Truck className="h-4 w-4 text-yellow-500/50" /> Tránsito
                                    </div>
                                    <span className="font-black text-white">{cfg.transit}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <LifeBuoy className="h-4 w-4 text-blue-500/50" /> General
                                    </div>
                                    <span className="font-black text-white">{cfg.emergency}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteConfig(cfg.id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold active:scale-95"
                            >
                                <Trash2 className="h-4 w-4" /> Eliminar Configuración
                            </button>
                        </div>
                    ))}
                    {configs.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <Phone className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No hay países configurados aún.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-cyan-500/20 p-8 rounded-[2.5rem] w-full max-w-md relative overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-white">Configurar País</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">País</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej: Colombia"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Policía</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                                        value={formData.police}
                                        onChange={(e) => setFormData({ ...formData, police: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tránsito</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                                        value={formData.transit}
                                        onChange={(e) => setFormData({ ...formData, transit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Emergencias General</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium"
                                    value={formData.emergency}
                                    onChange={(e) => setFormData({ ...formData, emergency: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={saving}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : "Guardar Configuración"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
