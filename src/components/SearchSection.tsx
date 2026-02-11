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
                    { id: "4", name: "Puesto de cargador ocupado", content: "Tu vehículo está ocupando un cargador y hay otros conductores esperando para cargar. ¿Podrías moverlo si ya terminó, por favor?", vehicleType: "ELECTRIC", category: "COMMON" },
                    { id: "5", name: "Cargador desconectado", content: "Hola, te informo que el cargador de tu vehículo ha sido desconectado.", vehicleType: "ELECTRIC", category: "URGENT" }
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
                <div className="bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden animate-in fade-in zoom-in duration-500 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Galería Lateral (Solo visible en Desktop) */}
                        <div className="hidden lg:flex lg:col-span-1 flex-col gap-3 p-4 border-r border-gray-50 bg-gray-50/30">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={cn(
                                    "aspect-square rounded-lg border-2 cursor-pointer transition-all overflow-hidden",
                                    i === 1 ? "border-brand shadow-sm" : "border-gray-200 hover:border-brand/50"
                                )}>
                                    <img
                                        src={result.type === "MOTORCYCLE"
                                            ? `https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=200&auto=format&fit=crop`
                                            : `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=200&auto=format&fit=crop`
                                        }
                                        className="w-full h-full object-cover"
                                        alt="Vista previa"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Imagen Principal */}
                        <div className="lg:col-span-7 p-4 bg-white flex flex-col justify-center relative group">
                            <div className="absolute top-8 left-8 z-10 flex gap-2">
                                <span className="bg-brand text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                    Verificado
                                </span>
                                {result.isElectric && (
                                    <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                                        <Zap className="h-3 w-3 fill-current" />
                                        E-Power
                                    </span>
                                )}
                            </div>

                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 relative border border-gray-100 shadow-inner">
                                <img
                                    src={result.type === "MOTORCYCLE"
                                        ? `https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=1200&auto=format&fit=crop`
                                        : `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop`
                                    }
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={result.brand}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>

                            <div className="mt-4 flex items-center justify-between px-2">
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Tipo</p>
                                        <p className="text-sm font-bold text-gray-700">{result.type === "MOTORCYCLE" ? "Moto" : "Automóvil"}</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Color</p>
                                        <p className="text-sm font-bold text-gray-700 capitalize">{result.color || 'Gris'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Placa</p>
                                    <p className="text-2xl font-black text-gray-900 tracking-tighter">{result.plate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Columna de Acción (Sidebar) */}
                        <div className="lg:col-span-4 bg-gray-50/50 p-8 flex flex-col justify-between border-l border-gray-100">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">Empresa / Propietario</p>
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                        {result.brand} {result.model}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2 text-brand font-bold text-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Propietario Registrado
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-200/50">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Seleccione una Alerta</p>

                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {Array.isArray(templates) && templates.length > 0 ? (
                                            templates.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => toggleTemplate(t.id)}
                                                    className={cn(
                                                        "w-full p-4 rounded-xl text-left border transition-all relative group",
                                                        selectedTemplates.includes(t.id)
                                                            ? "bg-white border-brand ring-1 ring-brand shadow-md"
                                                            : "bg-white border-gray-200 hover:border-brand/50 hover:shadow-sm"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                                                            selectedTemplates.includes(t.id) ? "border-brand bg-brand" : "border-gray-300"
                                                        )}>
                                                            {selectedTemplates.includes(t.id) && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={cn(
                                                            "text-sm font-bold transition-colors",
                                                            selectedTemplates.includes(t.id) ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                                                        )}>
                                                            {t.name}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No hay plantillas disponibles.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 space-y-4">
                                <button
                                    disabled={selectedTemplates.length === 0 || notifying}
                                    onClick={handleNotify}
                                    className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-brand/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
                                >
                                    {notifying ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Enviar Alerta
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-medium">
                                    Al enviar, el propietario recibirá un mensaje de WhatsApp instantáneo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-[9px] text-gray-300 text-center uppercase tracking-[0.2em] font-bold">NotifyCar v2.2 - Preview Loaded</p>
        </div>
    )
}
