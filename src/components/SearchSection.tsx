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
            .then(res => res.ok ? res.json() : [])
            .then(data => setTemplates(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Error fetching templates:", err)
                setTemplates([])
            })
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!plate) return

        setLoading(true)
        setError(null)
        setResult(null)
        setSuccessMsg(null)
        setSelectedTemplates([]);

        // MODO MOCK PARA PRUEBAS (PC ANTIGUO SIN DB)
        if (plate.toUpperCase() === "TEST") {
            setTimeout(() => { // Simulamos un pequeño delay para que se sienta natural
                setResult({
                    id: "test-id",
                    plate: "TEST-123",
                    type: "CAR",
                    brand: "Vehículo",
                    model: "De Prueba",
                    color: "Azul",
                    isElectric: true
                });
                setTemplates([
                    { id: "1", name: "Luces encendidas", content: "Hola, te informo que dejaste las luces de tu vehículo encendidas.", vehicleType: "CAR", category: "COMMON" },
                    { id: "2", name: "Mal estacionado", content: "Hola, tu vehículo está obstruyendo el paso o mal estacionado.", vehicleType: "ALL", category: "COMMON" },
                    { id: "6", name: "Estacionarias encendidas", content: "Dejaste las luces estacionarias de tu vehículo encendidas.", vehicleType: "ALL", category: "COMMON" },
                    { id: "3", name: "Obstrucción garaje", content: "Hola, su vehículo está obstruyendo la salida de un garaje.", vehicleType: "ALL", category: "URGENT" },
                    { id: "4", name: "Carga terminada", content: "Hola, tu vehículo ha completado su carga. Por favor, considera moverlo para liberar el espacio.", vehicleType: "ELECTRIC", category: "COMMON" },
                    { id: "5", name: "Cargador desconectado", content: "Hola, te informo que el cargador de tu vehículo ha sido desconectado.", vehicleType: "ELECTRIC", category: "URGENT" },
                    { id: "7", name: "Espacio de carga solicitado", content: "Tu vehículo está ocupando un cargador y hay otros conductores esperando para cargar. ¿Podrías moverlo si ya terminó, por favor?", vehicleType: "ELECTRIC", category: "COMMON" }
                ]);
                setLoading(false);
            }, 500);
            return;
        }

        try {
            const res = await fetch(`/api/search?plate=${plate}`)
            if (res.ok) {
                const data = await res.json()
                if (data.found) {
                    setResult(data.vehicle)
                    const tRes = await fetch(`/api/templates?type=${data.vehicle.type}&isElectric=${data.vehicle.isElectric}`)
                    if (tRes.ok) {
                        const tData = await tRes.json()
                        setTemplates(Array.isArray(tData) ? tData : [])
                    } else {
                        setTemplates([])
                    }
                } else {
                    setError("No se encontró ningún vehículo con esa placa.")
                }
            } else {
                const text = await res.text();
                if (text.includes("Internal Error")) {
                    setError("Error de conexión con la base de datos. ¿Deseas usar el modo de prueba? Escribe 'TEST' en la placa.");
                } else {
                    setError("Ocurrió un error al buscar el vehículo.");
                }
            }
        } catch (error) {
            setError("Error de conexión. Verifica que el PC principal esté encendido y en la misma red.");
        } finally {
            setLoading(false)
        }
    }

    const toggleTemplate = (id: string) => {
        // Ahora, independientemente de si es eléctrico o no, solo permitimos seleccionar una opción
        const isSelected = selectedTemplates.includes(id);
        if (isSelected) {
            setSelectedTemplates([]);
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
                    templateId: selected[0]?.id,
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
        <div className="w-full max-w-2xl mx-auto mt-4 space-y-6">
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
                                {Array.isArray(templates) && templates.some(t => t.vehicleType === "ELECTRIC") && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Mensajes Eléctricos</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                                            {templates.filter(t => t.vehicleType === "ELECTRIC").map(t => (
                                                <div key={t.id} className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleTemplate(t.id)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border text-left w-full h-full",
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
                                                        <div className="flex flex-col flex-1">
                                                            <span className="leading-tight">{t.name}</span>
                                                            {t.organizationId && (
                                                                <span className="text-[9px] text-green-700/60 font-black uppercase tracking-tighter mt-1">
                                                                    Personalizado
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                    {selectedTemplates.includes(t.id) && (
                                                        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-900 animate-in slide-in-from-top-2 duration-300 shadow-inner">
                                                            <div className="flex items-center gap-2 font-bold mb-1.5">
                                                                <Info className="h-4 w-4" />
                                                                Mensaje completo a enviar:
                                                            </div>
                                                            <p className="italic leading-relaxed font-medium bg-white/50 p-2 rounded-lg">"{t.content}"</p>
                                                        </div>
                                                    )}
                                                </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                                        {Array.isArray(templates) && templates.filter(t => t.vehicleType !== "ELECTRIC").map(t => (
                                            <div key={t.id} className="flex flex-col gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTemplate(t.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border text-left w-full h-full",
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
                                                    <div className="flex flex-col flex-1">
                                                        <span className="leading-tight">{t.name}</span>
                                                        {t.organizationId && (
                                                            <span className="text-[9px] text-brand/60 font-black uppercase tracking-tighter mt-1">
                                                                Personalizado
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                                {selectedTemplates.includes(t.id) && (
                                                    <div className="px-4 py-3 bg-brand/5 border border-brand/20 rounded-xl text-sm text-gray-800 animate-in slide-in-from-top-2 duration-300 shadow-inner">
                                                        <div className="flex items-center gap-2 font-bold mb-1.5 text-brand">
                                                            <Info className="h-4 w-4" />
                                                            Mensaje completo a enviar:
                                                        </div>
                                                        <p className="italic leading-relaxed font-medium bg-white/50 p-2 rounded-lg">"{t.content}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>


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
