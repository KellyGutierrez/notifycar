"use client"

import { useState, useEffect } from "react"
import { Search, Car, Zap, Info, Loader2, AlertCircle, MessageSquare, Send, CheckCircle2, Bike } from "lucide-react"
import { cn } from "@/lib/utils"


const getColorHex = (colorName: string | undefined | null) => {
    if (!colorName) return '#9CA3AF'; // Default gray
    const c = colorName.toLowerCase();

    if (c.includes('rojo')) return '#DC2626'; // Red
    if (c.includes('azul')) return '#2563EB'; // Blue
    if (c.includes('blanco')) return '#FFFFFF'; // White
    if (c.includes('negro')) return '#000000'; // Black
    if (c.includes('gris') || c.includes('plata')) return '#9CA3AF'; // Gray
    if (c.includes('verde')) return '#16A34A'; // Green
    if (c.includes('amarillo')) return '#CA8A04'; // Yellow
    if (c.includes('naranja')) return '#EA580C'; // Orange
    if (c.includes('café') || c.includes('cafe') || c.includes('marrón')) return '#5D4037';
    if (c.includes('beige')) return '#F5F5DC';

    return '#9CA3AF'; // Fallback
}

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
                    id: "real-example-id",
                    plate: "MZD-582",
                    type: "CAR",
                    brand: "Mazda",
                    model: "CX-30 Grand Touring",
                    color: "Rojo Diamante",
                    isElectric: false // Probamos uno normal (no eléctrico)
                });
                setTemplates([
                    { id: "1", name: "Luces Encendidas", content: "Hola, te informo que dejaste las luces de tu Mazda encendidas.", vehicleType: "CAR", category: "COMMON" },
                    { id: "2", name: "Mal Estacionado", content: "Hola, tu vehículo está obstruyendo el paso. Agradecemos si puedes moverlo.", vehicleType: "ALL", category: "COMMON" },
                    { id: "3", name: "Bloqueando Garaje", content: "Hola, tu vehículo está bloqueando la salida de mi garaje. Por favor, ¿podrías moverlo?", vehicleType: "ALL", category: "URGENT" },
                    { id: "4", name: "Ventana Abierta", content: "Dejaste una ventana de tu vehículo abierta. Te aviso por seguridad.", vehicleType: "ALL", category: "URGENT" }
                ]);
                setLoading(false);
            }, 800);
            return;
        }

        try {
            const res = await fetch(`/api/search?plate=${plate}`)
            if (res.ok) {
                const data = await res.json()
                if (data.found) {
                    setResult(data.vehicle)
                    const tRes = await fetch(`/api/templates?type=${data.vehicle.type}&isElectric=${data.vehicle.isElectric}&orgId=${data.vehicle.organizationId || ''}`)
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
        <div className="w-full max-w-2xl mx-auto mt-2 space-y-6">
            <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-brand/20 transition-all"
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
                <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/60 overflow-hidden animate-in fade-in zoom-in duration-500 max-w-3xl mx-auto">
                    {/* Cabecera de Identificación */}
                    <div className="p-10 text-center space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Vehículo Encontrado
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Marca y Modelo</p>
                            <h2 className="text-5xl font-black text-gray-900 tracking-tight">
                                {result.brand} <span className="text-brand">{result.model}</span>
                            </h2>
                        </div>

                        {/* Visual de la Placa Estilo Real */}
                        <div className="pt-4 flex justify-center">
                            <div className="bg-white border-4 border-gray-900 rounded-2xl px-12 py-6 shadow-xl relative overflow-hidden group hover:scale-105 transition-transform duration-500">
                                {/* Reflejo estético de placa */}
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-100/20 to-transparent" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-1">Colombia</p>
                                <span className="text-6xl font-black text-gray-900 tracking-tighter block leading-none">
                                    {result.plate.replace(/-/g, '')}
                                </span>
                                <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-gray-100" />
                                <div className="absolute bottom-1 left-2 w-4 h-4 rounded-full bg-gray-100" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                <Car className="h-4 w-4 text-brand" />
                                <span>{result.type === "MOTORCYCLE" ? "Motocicleta" : "Automóvil"}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                <div className="h-4 w-4 rounded-full border-2 border-gray-100 shadow-sm" style={{ backgroundColor: getColorHex(result.color) }} />
                                <span>Color {result.color || 'Gris'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Selección de Mensajes - Muy Intuitiva */}
                    <div className="p-10 pt-6 border-t border-gray-100 bg-white">
                        <div className="text-center mb-10 space-y-4">
                            <h3 className="text-2xl font-black text-gray-900">¿Qué quieres notificarle?</h3>
                            <p className="text-gray-500 font-medium">Selecciona el mensaje que quieres enviar por WhatsApp</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {Array.isArray(templates) && templates.length > 0 ? (
                                templates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => toggleTemplate(t.id)}
                                        className={cn(
                                            "p-5 rounded-2xl text-left border-2 transition-all relative group flex flex-col",
                                            selectedTemplates.includes(t.id)
                                                ? "bg-brand/5 border-brand shadow-md"
                                                : "bg-white border-gray-100 hover:border-brand/30 hover:bg-gray-50/30"
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={cn(
                                                "text-sm font-bold uppercase tracking-tight",
                                                selectedTemplates.includes(t.id) ? "text-brand" : "text-gray-700"
                                            )}>
                                                {t.name}
                                            </span>
                                            <div className={cn(
                                                "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                                selectedTemplates.includes(t.id) ? "border-brand bg-brand" : "border-gray-200 bg-white"
                                            )}>
                                                {selectedTemplates.includes(t.id) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                            </div>
                                        </div>

                                        {selectedTemplates.includes(t.id) && (
                                            <div className="mt-4 pt-3 border-t border-brand/10 animate-in slide-in-from-top-1 fade-in duration-200">
                                                <p className="text-xs text-gray-600 italic leading-relaxed flex items-start gap-2">
                                                    <Info className="h-3 w-3 mt-0.5 text-brand shrink-0" />
                                                    "{t.content}"
                                                </p>
                                            </div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-medium">Cargando opciones de notificación...</p>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={selectedTemplates.length === 0 || notifying}
                            onClick={handleNotify}
                            className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-gray-900/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-20 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-4 group"
                        >
                            {notifying ? (
                                <Loader2 className="h-7 w-7 animate-spin text-brand" />
                            ) : (
                                <>
                                    <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-brand" />
                                    Enviar Notificación Ahora
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                            Notificación 100% Anónima y Segura
                        </p>
                    </div>
                </div>
            )}


            <p className="text-[9px] text-gray-300 text-center uppercase tracking-[0.2em] font-bold">NotifyCar v2.2 - Preview Loaded</p>
        </div >
    )
}
