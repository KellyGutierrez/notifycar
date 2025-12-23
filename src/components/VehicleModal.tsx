"use client"

import { useState, useEffect } from "react"
import { X, Car, Hash, Palette, Info, Zap, Bike } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface VehicleModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any // Data for editing
}

export default function VehicleModal({ isOpen, onClose, initialData }: VehicleModalProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        plate: "",
        color: "",
        type: "CAR",
        isElectric: false
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                brand: initialData.brand || "",
                model: initialData.model || "",
                plate: initialData.plate || "",
                color: initialData.color || "",
                type: initialData.type || "CAR",
                isElectric: initialData.isElectric || false
            })
        } else if (isOpen) {
            setFormData({
                brand: "",
                model: "",
                plate: "",
                color: "",
                type: "CAR",
                isElectric: false
            })
        }
    }, [initialData, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const method = initialData ? "PUT" : "POST"
            const body = initialData ? { ...formData, id: initialData.id } : formData

            const response = await fetch("/api/vehicles", {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            if (response.ok) {
                onClose()
                router.refresh()
            } else {
                const error = await response.text()
                alert(`Error al ${initialData ? 'actualizar' : 'registrar'} el vehículo: ` + error)
            }
        } catch (error) {
            console.error(error)
            alert(`Error de conexión al ${initialData ? 'actualizar' : 'registrar'} el vehículo`)
        } finally {
            setLoading(false)
        }
    }

    const title = initialData ? "Editar Vehículo" : "Registrar Vehículo"
    const description = initialData ? "Actualiza los datos de tu auto" : "Completa los datos de tu auto"
    const buttonText = initialData ? "Actualizar" : "Guardar"

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-white">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Car className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{title}</h2>
                            <p className="text-xs text-gray-400">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Vehicle Type Selection */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "CAR" })}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                formData.type === "CAR"
                                    ? "bg-green-500/10 border-green-500 text-green-400"
                                    : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-400"
                            )}
                        >
                            <Car className="h-8 w-8" />
                            <span className="text-xs font-bold uppercase tracking-widest">Auto</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "MOTORCYCLE" })}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                formData.type === "MOTORCYCLE"
                                    ? "bg-green-500/10 border-green-500 text-green-400"
                                    : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-400"
                            )}
                        >
                            <Bike className="h-8 w-8" />
                            <span className="text-xs font-bold uppercase tracking-widest">Moto</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                Placa (Patente)
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    required
                                    type="text"
                                    placeholder="ABC-123"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-green-500/50 outline-none transition uppercase"
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                    Marca
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder={formData.type === "MOTORCYCLE" ? "Ej: Honda, Yamaha..." : "Ej: Toyota, BMW..."}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-green-500/50 outline-none transition"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                    Modelo
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder={formData.type === "MOTORCYCLE" ? "Ej: CB500X, MT-07..." : "Ej: Corolla, Civic..."}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-green-500/50 outline-none transition"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                                Color
                            </label>
                            <div className="relative">
                                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Ej: Rojo, Blanco, Negro..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-green-500/50 outline-none transition"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isElectric}
                                        onChange={(e) => setFormData({ ...formData, isElectric: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className={`h-4 w-4 transition ${formData.isElectric ? 'text-yellow-400' : 'text-gray-500'}`} />
                                    <span className="text-sm font-medium text-gray-300">¿Es un vehículo eléctrico?</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                buttonText
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
