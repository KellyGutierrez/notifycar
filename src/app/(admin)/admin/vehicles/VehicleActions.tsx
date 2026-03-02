"use client"

import { useState } from "react"
import { Edit2, Trash2, MoreVertical, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import VehicleModal from "@/components/VehicleModal"
import { cn } from "@/lib/utils"

interface VehicleActionsProps {
    vehicle: any
    view: "grid" | "list" | "compact"
}

export default function VehicleActions({ vehicle, view }: VehicleActionsProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`¿Estás seguro de que deseas eliminar el vehículo con placa ${vehicle.plate}?`)) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/vehicles?id=${vehicle.id}`, {
                method: "DELETE"
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert("Error al eliminar el vehículo")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        } finally {
            setIsDeleting(false)
            setIsMenuOpen(false)
        }
    }

    if (view === "compact") {
        return (
            <>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsEditModalOpen(true)
                        }}
                        className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg backdrop-blur-md border border-white/10"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDelete()
                        }}
                        disabled={isDeleting}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg backdrop-blur-md border border-white/10"
                    >
                        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                </div>

                <VehicleModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={vehicle}
                />
            </>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(!isMenuOpen)
                }}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md border border-transparent hover:border-white/10"
            >
                <MoreVertical className="h-5 w-5" />
            </button>

            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsEditModalOpen(true)
                                setIsMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all text-left"
                        >
                            <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                                <Edit2 className="h-4 w-4 text-cyan-400" />
                            </div>
                            Editar Vehículo
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete()
                            }}
                            disabled={isDeleting}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left disabled:opacity-50"
                        >
                            <div className="p-1.5 bg-red-500/10 rounded-lg">
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </div>
                            Eliminar Vehículo
                        </button>
                    </div>
                </>
            )}

            <VehicleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={vehicle}
            />
        </div>
    )
}
