"use client"

import { useState, useEffect } from "react"
import { Search, Car, Zap, Info, Loader2, AlertCircle, MessageSquare, Send, CheckCircle2, Bike, Users } from "lucide-react"
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
    if (c.includes('taxi')) return '#CA8A04'; // Taxi Yellow

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
    const [userProfile, setUserProfile] = useState<"GENERAL" | "PASSENGER" | null>(null)

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
        setUserProfile(null);

        try {
            const res = await fetch(`/api/search?plate=${plate}`)
            if (res.ok) {
                const data = await res.json()
                if (data.found) {
                    setResult(data.vehicle)
                    const isElectricParam = data.vehicle.isElectric ? "true" : "false";
                    const tRes = await fetch(`/api/templates?type=${data.vehicle.type}&isElectric=${isElectricParam}&orgId=${data.vehicle.organizationId || ''}`)
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
                setError("Ocurrió un error al buscar el vehículo.")
            }
        } catch (error) {
            setError("Error de conexión.")
        } finally {
            setLoading(false)
        }
    }

    const toggleTemplate = (id: string) => {
        const isSelected = selectedTemplates.includes(id);
        if (isSelected) {
            setSelectedTemplates([]);
        } else {
            setSelectedTemplates([id]);
        }
    }

    const handleNotify = async () => {
        if (!result || selectedTemplates.length === 0) return

        // Scroll al inicio para ver feedback
        // window.scrollTo({ top: 0, behavior: "smooth" });

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
                // Si hay error, también aseguramos scroll arriba (aunque ya se hizo al inicio)
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (error) {
            setError("Error de conexión.")
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setNotifying(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-2 space-y-6">
            <form
                onSubmit={handleSearch}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm group focus-within:ring-2 focus-within:ring-brand/20 transition-all overflow-hidden"
            >
                {/* Single-row layout: icon + input + button */}
                <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2">
                    <div className="pl-2 sm:pl-3 text-gray-400 shrink-0">
                        <Search className="h-4 w-4 sm:h-5 sm:w-5 group-focus-within:text-brand transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Placa (Ej: ABC-123)"
                        className="flex-1 w-0 min-w-0 py-3 text-base sm:text-lg outline-none text-gray-700 placeholder:text-gray-400 font-medium uppercase bg-transparent"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        autoCapitalize="characters"
                        autoCorrect="off"
                        autoComplete="off"
                        spellCheck={false}
                        inputMode="text"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="shrink-0 bg-brand hover:bg-brand-dark active:scale-95 text-white px-4 sm:px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center min-w-[48px] sm:min-w-[120px]"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Search className="h-5 w-5 sm:hidden" />
                                <span className="hidden sm:inline">Buscar</span>
                            </>
                        )}
                    </button>
                </div>
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
                    <div className="p-10 text-center space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Vehículo Encontrado
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tight">
                                {result.brand} <span className="text-brand">{result.model}</span>
                            </h2>
                        </div>

                        <div className="pt-4 flex justify-center px-4">
                            <div className="bg-white border-[3px] sm:border-4 border-gray-900 rounded-xl sm:rounded-2xl px-6 py-3 sm:px-12 sm:py-6 shadow-xl relative overflow-hidden flex items-center justify-center group hover:scale-105 transition-transform duration-500 min-w-[200px]">
                                <p className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none text-center">
                                    {result.plate.replace(/-/g, '')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-4">
                            {result.isElectric && (
                                <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 animate-pulse">
                                    <Zap className="h-3 w-3 fill-green-600" />
                                    V. ELÉCTRICO
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                {result.organizationId ? (
                                    <span className="flex items-center gap-2">
                                        <div className="p-1 px-2 bg-yellow-400 text-black text-[10px] font-black rounded flex items-center gap-1 shadow-sm">
                                            🚕 TAXI
                                        </div>
                                        <span>Servicio Público</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Car className="h-4 w-4 text-brand" />
                                        <span>{result.type === "MOTORCYCLE" ? "Motocicleta" : "Automóvil"}</span>
                                    </span>
                                )}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                                <div
                                    className="h-4 w-4 rounded-full border-2 border-gray-100"
                                    style={{ backgroundColor: result.organizationId ? '#CA8A04' : getColorHex(result.color) }}
                                />
                                <span>{result.organizationId ? 'Color Amarillo' : `Color ${result.color || 'Gris'}`}</span>
                            </div>
                        </div>
                    </div>

                    {result.organizationId && !userProfile && (
                        <div className="p-10 text-center border-t border-gray-100 bg-gray-50/30">
                            <h3 className="text-2xl font-black text-gray-900 mb-6">¿Quién envía la notificación?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                                <button
                                    onClick={() => setUserProfile("GENERAL")}
                                    className="p-8 rounded-3xl border-2 border-gray-100 hover:border-brand hover:bg-brand/5 transition-all text-center group bg-white shadow-sm"
                                >
                                    <Car className="h-8 w-8 mx-auto mb-3 text-gray-400 group-hover:text-brand" />
                                    <p className="font-black text-gray-900">Peatón / Conductor</p>
                                    <p className="text-xs text-gray-500 mt-1">Reportar novedad externa</p>
                                </button>
                                <button
                                    onClick={() => setUserProfile("PASSENGER")}
                                    className="p-8 rounded-3xl border-2 border-gray-100 hover:border-brand hover:bg-brand/5 transition-all text-center group bg-white shadow-sm"
                                >
                                    <Users className="h-8 w-8 mx-auto mb-3 text-gray-400 group-hover:text-brand" />
                                    <p className="font-black text-gray-900">Soy el Pasajero</p>
                                    <p className="text-xs text-gray-500 mt-1">Reportar objeto o servicio</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {(!result.organizationId || userProfile) && (
                        <div className="p-10 pt-6 border-t border-gray-100 bg-white">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-900">
                                    {userProfile === "PASSENGER" ? "Opciones de Pasajero" : "¿Qué quieres notificar?"}
                                </h3>
                                {userProfile && (
                                    <button
                                        onClick={() => { setUserProfile(null); setSelectedTemplates([]); }}
                                        className="text-xs font-bold text-gray-400 hover:text-brand uppercase"
                                    >
                                        Atrás
                                    </button>
                                )}
                            </div>

                            <div className={cn(
                                "grid grid-cols-1 gap-4 mb-10",
                                selectedTemplates.length === 0 ? "md:grid-cols-2" : "md:grid-cols-1"
                            )}>
                                {templates
                                    .filter(t => {
                                        if (!result.organizationId) return true;
                                        const cat = t.category?.toUpperCase();
                                        if (userProfile === "PASSENGER") return cat === "SERVICIO";
                                        return cat === "COMÚN" || cat === "URGENTE" || cat === "COMMON" || cat === "URGENT";
                                    }).length > 0 ? (
                                    templates
                                        .filter(t => {
                                            if (!result.organizationId) return true;
                                            const cat = t.category?.toUpperCase();
                                            if (userProfile === "PASSENGER") return cat === "SERVICIO";
                                            return cat === "COMÚN" || cat === "URGENTE" || cat === "COMMON" || cat === "URGENT";
                                        })
                                        .map(t => (
                                            <div key={t.id} className="space-y-4">
                                                <button
                                                    onClick={() => toggleTemplate(t.id)}
                                                    className={cn(
                                                        "w-full p-5 rounded-2xl text-left border-2 transition-all relative group flex flex-col",
                                                        selectedTemplates.includes(t.id)
                                                            ? "bg-brand/5 border-brand shadow-md"
                                                            : selectedTemplates.length > 0
                                                                ? "bg-white border-gray-100 opacity-40 scale-95 grayscale"
                                                                : "bg-white border-gray-100 hover:border-brand/30 hover:scale-[1.02]"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className={cn("text-base font-black uppercase tracking-tight flex items-center gap-2", selectedTemplates.includes(t.id) ? "text-brand" : "text-gray-700 font-bold")}>
                                                            {t.vehicleType === "ELECTRIC" && <Zap className="h-4 w-4 text-green-500 fill-green-500 shadow-sm" />}
                                                            {t.name}
                                                        </span>
                                                        <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all", selectedTemplates.includes(t.id) ? "border-brand bg-brand" : "border-gray-200")}>
                                                            {selectedTemplates.includes(t.id) && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                                        </div>
                                                    </div>

                                                    {/* Mostrar contenido solo si está seleccionado */}
                                                    {selectedTemplates.includes(t.id) && (
                                                        <div className="mt-4 pt-3 border-t border-brand/10 animate-in fade-in slide-in-from-top-1 duration-300">
                                                            <p className="text-sm italic font-medium text-gray-900 leading-relaxed">
                                                                "{t.content}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-span-2 py-8 px-4 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-gray-500">No hay mensajes en esta categoría.</p>
                                        <p className="text-[10px] text-gray-400 uppercase mt-1">Configúralos en el panel corporativo.</p>
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={selectedTemplates.length === 0 || notifying}
                                onClick={handleNotify}
                                className={cn(
                                    "w-full bg-gray-900 hover:bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95",
                                    selectedTemplates.length === 0 ? "opacity-20 cursor-not-allowed" : "animate-in slide-in-from-bottom-4 duration-500 shadow-brand/20"
                                )}
                            >
                                {notifying ? <Loader2 className="h-7 w-7 animate-spin text-brand" /> : <><Send className="h-6 w-6 text-brand" /> Enviar Notificación</>}
                            </button>
                        </div>
                    )}
                </div>
            )}
            <p className="text-[9px] text-gray-300 text-center uppercase tracking-[0.2em] font-bold">NotifyCar v19.02.26 - Corporate Shield Active</p>
        </div>
    )
}
