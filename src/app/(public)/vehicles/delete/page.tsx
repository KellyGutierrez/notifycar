"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, AlertCircle, Loader2, Trash2, Car } from "lucide-react"

function DeleteVehicleContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const token = searchParams.get("token")
    const plate = searchParams.get("plate")

    const handleDelete = async () => {
        if (!token || !plate) return

        setStatus("loading")
        try {
            const res = await fetch("/api/public/vehicles/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, plate })
            })

            if (res.ok) {
                setStatus("success")
                setMessage(`El vehículo con placa ${plate} ha sido eliminado correctamente de tu cuenta.`)
            } else {
                const text = await res.text()
                setStatus("error")
                setMessage(text || "Error al eliminar el vehículo o el link ha expirado.")
            }
        } catch (error) {
            setStatus("error")
            setMessage("Error de conexión al intentar eliminar el vehículo.")
        }
    }

    if (!token || !plate) {
        return (
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h1 className="text-2xl font-black text-gray-900">Link Inválido</h1>
                <p className="text-gray-600">Este link de eliminación no es válido o está incompleto.</p>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto">
            {status === "idle" && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                        <Trash2 className="h-10 w-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">¿Eliminar Vehículo?</h1>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Se ha solicitado liberar la placa <span className="text-gray-900 font-bold px-2 py-1 bg-gray-100 rounded-lg">{plate}</span> para que un nuevo propietario pueda registrarla.
                        </p>
                    </div>

                    <button
                        onClick={handleDelete}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-500/20 active:scale-95"
                    >
                        Confirmar y Eliminar
                    </button>

                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Esta acción no se puede deshacer
                    </p>
                </div>
            )}

            {status === "loading" && (
                <div className="bg-white p-16 rounded-[2.5rem] shadow-2xl text-center space-y-6">
                    <Loader2 className="h-12 w-12 text-brand animate-spin mx-auto" />
                    <p className="text-xl font-bold text-gray-900">Procesando solicitud...</p>
                </div>
            )}

            {status === "success" && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-green-100 border border-green-50 text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">¡Liberado!</h1>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl"
                    >
                        Ir al Inicio
                    </button>
                </div>
            )}

            {status === "error" && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-red-100 border border-red-50 text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Error</h1>
                        <p className="text-red-500 font-bold leading-relaxed">
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-gray-100 text-gray-900 py-5 rounded-2xl font-bold"
                    >
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    )
}

export default function DeleteVehiclePage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Suspense fallback={<div>Cargando...</div>}>
                <DeleteVehicleContent />
            </Suspense>
        </div>
    )
}
