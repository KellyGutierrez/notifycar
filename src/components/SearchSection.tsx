"use client"

import { useState, useEffect } from "react"
import { Search, Car, Zap, Info, Loader2, AlertCircle, MessageSquare, Send, CheckCircle2, Bike } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SearchSection() {
    const [plate, setPlate] = useState("")
    const [loading, setLoading] = useState(false)
    const [notifying, setNotifying] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const [templates, setTemplates] = useState<any[]>([])
    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])

    useEffect(() => {
        fetch("/api/templates")
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(err => console.error("Error fetching templates:", err))
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!plate) return

        // MODO MOCK PARA PRUEBAS (PC ANTIGUO SIN DB)
        if (plate.toUpperCase() === "TEST") {
            setError(null)
            setSuccessMsg(null)
            setResult({
                id: "test-id",
                plate: "TEST-123",
                type: "CAR",
                brand: "Vehículo",
                model: "De Prueba",
                color: "Azul",
                isElectric: false
            });
            setTemplates([
                { id: "1", name: "Luces encendidas", content: "Su carro se quedó con las luces encendidas", vehicleType: "ALL" },
                { id: "2", name: "Mal estacionado", content: "Su vehículo se encuentra mal estacionado y obstruye el paso", vehicleType: "ALL" }
            ]);
            setSelectedTemplates([]);
            return;
        }

        setLoading(true)
        setError(null)
        setResult(null)
        setSuccessMsg(null)
        setSelectedTemplates([]);

        try {
            const res = await fetch(`/api/search?plate=${plate}`)
            if (res.ok) {
                const data = await res.json()
                if (data.found) {
                    setResult(data.vehicle)
                    // Cargar plantillas basadas en el tipo de vehículo y si es eléctrico
                    const tRes = await fetch(`/api/templates?type=${data.vehicle.type}&isElectric=${data.vehicle.isElectric}`)
                    if (tRes.ok) {
                        const tData = await tRes.json()
                        setTemplates(tData)
                    }
                } else {
                    setError("No se encontró ningún vehículo con esa placa.")
                }
            } else {
                setError("Ocurrió un error al buscar el vehículo.")
            }
        } catch (error) {
            setError("Error de conexión.")
        } finally {
            setLoading(false)
        }
    }

    const toggleTemplate = (id: string) => {
        if (result?.isElectric) {
            setSelectedTemplates(prev =>
                prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
            );
        } else {
            setSelectedTemplates([id]);
        }
    }

    const handleNotify = async () => {
        if (!result || selectedTemplates.length === 0) return

        const selected = templates.filter(t => selectedTemplates.includes(t.id))
        if (selected.length === 0) return

        const combinedContent = selected.map(t => t.content).join('\n')

        setNotifying(true)
        setError(null)

        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleId: result.id,
                    content: combinedContent,
                    type: "APP"
                })
            })

            if (res.ok) {
                setSuccessMsg("¡Notificación enviada correctamente!")
                setSelectedTemplates([])
            } else {
                const errorText = await res.text()
                setError(errorText || "Error al enviar la notificación.")
            }
        } catch (error) {
            setError("Error de conexión.")
        } finally {
            setNotifying(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-10 space-y-6">
            <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-brand/20 transition-all"
            >
                <div className="pl-4 text-gray-400">
                    <Search className="h-5 w-5 group-focus-within:text-brand transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Ingrese la placa (Ej: ABC-123)"
                    className="flex-1 py-3 text-lg outline-none text-gray-700 placeholder:text-gray-400 font-medium uppercase"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                />
                <button
                    disabled={loading}
                    className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buscar"}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            {successMsg && (
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="font-medium text-sm">{successMsg}</p>
                </div>
            )}

            {result && !successMsg && (
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg shadow-gray-200/40 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                                {result.type === "MOTORCYCLE" ? (
                                    <Bike className="h-8 w-8 text-gray-400" />
                                ) : (
                                    <Car className="h-8 w-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{result.plate}</h4>
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {result.type === "MOTORCYCLE" ? "Moto" : "Auto"}
                                    </span>
                                    {result.isElectric && (
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                            <Zap className="h-2.5 w-2.5 fill-current" />
                                            Eléctrico
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 font-medium">{result.brand} {result.model}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Color</div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="font-bold text-gray-900">{result.color || 'No especificado'}</span>
                                <div
                                    className="h-3 w-3 rounded-full border border-gray-200"
                                    style={{ backgroundColor: result.color?.toLowerCase() === 'blanco' ? 'white' : result.color?.toLowerCase() }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4 pt-6 border-t border-gray-50">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-brand" />
                                Selecciona los mensajes
                            </label>
                            <div className="space-y-6">
                                {result.isElectric && templates.some(t => t.vehicleType === "ELECTRIC") && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Mensajes Eléctricos</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {templates.filter(t => t.vehicleType === "ELECTRIC").map(t => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => toggleTemplate(t.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border text-left h-full",
                                                        selectedTemplates.includes(t.id)
                                                            ? "bg-green-50 border-green-200 text-green-900 shadow-sm"
                                                            : "bg-white border-gray-100 text-gray-600 hover:border-green-200 hover:bg-green-50/30"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                                            selectedTemplates.includes(t.id)
                                                                ? "border-green-500 bg-green-500"
                                                                : "border-gray-300 bg-white"
                                                        )}>
                                                        {selectedTemplates.includes(t.id) && (
                                                            <div className="h-2 w-2 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    <span className="leading-tight">{t.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {result.isElectric ? "Mensajes Generales" : "Mensajes Sugeridos"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {templates.filter(t => t.vehicleType !== "ELECTRIC").map(t => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => toggleTemplate(t.id)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border text-left h-full",
                                                    selectedTemplates.includes(t.id)
                                                        ? "bg-brand/5 border-brand text-gray-900 shadow-sm"
                                                        : "bg-white border-gray-100 text-gray-600 hover:border-brand/40 hover:bg-gray-50/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                                    selectedTemplates.includes(t.id)
                                                        ? "border-brand bg-brand"
                                                        : "border-gray-300 bg-white"
                                                )}>
                                                    {selectedTemplates.includes(t.id) && (
                                                        <div className="h-2 w-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span className="leading-tight">{t.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vista Previa del Mensaje */}
                        {selectedTemplates.length > 0 && (
                            <div className="my-6 p-4 rounded-xl border-2 border-dashed border-brand/30 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-[10px] font-black text-brand uppercase tracking-tighter mb-2 flex items-center gap-2">
                                    <Info className="h-3 w-3" />
                                    Vista previa del mensaje:
                                </p>
                                <div className="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                                    <span className="font-bold text-brand">*Vehículo [{result.plate.toUpperCase()}]*</span>
                                    {"\n\n"}
                                    {templates
                                        .filter(t => selectedTemplates.includes(t.id))
                                        .map(t => t.content)
                                        .join('\n')}
                                </div>
                            </div>
                        )}

                        <button
                            disabled={selectedTemplates.length === 0 || notifying}
                            onClick={handleNotify}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale group"
                        >
                            {notifying ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Enviar Notificación
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
            <p className="text-[9px] text-gray-300 text-center uppercase tracking-[0.2em] font-bold">NotifyCar v2.2 - Preview Loaded</p>
        </div>
    )
}
