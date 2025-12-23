"use client"

import { useState, useEffect } from "react"
import { Plus, Car, MoreVertical, Zap, Edit2, ShieldAlert, Trash2, Bike } from "lucide-react"
import VehicleModal from "@/components/VehicleModal"

export default function VehiclesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<any>(null)
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    const fetchVehicles = async () => {
        try {
            const res = await fetch("/api/vehicles")
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

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de que desea eliminar este vehículo? Esta acción no se puede deshacer.")) {
            return
        }

        try {
            const res = await fetch(`/api/vehicles?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchVehicles()
            } else {
                alert("Error al eliminar el vehículo")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        } finally {
            setActiveMenu(null)
        }
    }

    useEffect(() => {
        fetchVehicles()
    }, [])

    const handleEdit = (vehicle: any) => {
        setEditingVehicle(vehicle)
        setIsModalOpen(true)
        setActiveMenu(null)
    }

    const handleAdd = () => {
        setEditingVehicle(null)
        setIsModalOpen(true)
    }

    const closeMenu = () => setActiveMenu(null)

    useEffect(() => {
        const handleClickOutside = () => closeMenu()
        if (activeMenu) {
            window.addEventListener('click', handleClickOutside)
        }
        return () => window.removeEventListener('click', handleClickOutside)
    }, [activeMenu])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mis Vehículos</h1>
                    <p className="text-gray-400">Administra tu flota registrada</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium shadow-lg shadow-green-900/20"
                >
                    <Plus className="h-5 w-5" />
                    <span>Agregar Vehículo</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                </div>
            ) : vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Car className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">No tienes vehículos registrados</h3>
                    <p className="text-gray-400 mt-2 max-w-sm">
                        Agrega tu primer vehículo para comenzar a recibir notificaciones y gestionar alertas.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition duration-300">
                            <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
                                {vehicle.type === "MOTORCYCLE" ? (
                                    <Bike className="h-16 w-16 text-white/20" />
                                ) : (
                                    <Car className="h-16 w-16 text-white/20" />
                                )}
                                {vehicle.isElectric && (
                                    <div className="absolute top-2 left-2 bg-green-500/20 backdrop-blur-md border border-green-500/20 p-1.5 rounded-lg">
                                        <Zap className="h-4 w-4 text-green-400" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex items-center">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenu(activeMenu === vehicle.id ? null : vehicle.id);
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        {activeMenu === vehicle.id && (
                                            <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                                <button
                                                    onClick={() => handleEdit(vehicle)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition border-b border-white/5"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Editar vehículo
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar vehículo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-lg font-bold text-white uppercase tracking-wide">{vehicle.plate}</h3>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 uppercase tracking-tighter">
                                                {vehicle.type === "MOTORCYCLE" ? "Moto" : "Auto"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{vehicle.brand} {vehicle.model}</p>
                                    </div>
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">
                                        {vehicle.isElectric ? 'ELÉCTRICO' : 'ACTIVO'}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm text-gray-400">
                                    <span>Color: <span className="text-gray-300">{vehicle.color || 'No especificado'}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <VehicleModal
                isOpen={isModalOpen}
                initialData={editingVehicle}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingVehicle(null)
                    fetchVehicles()
                }}
            />
        </div>
    )
}
