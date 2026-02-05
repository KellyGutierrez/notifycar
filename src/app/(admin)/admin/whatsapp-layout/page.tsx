"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Save, Loader2, Info, AlertCircle, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminWhatsappLayoutPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)
    const [copied, setCopied] = useState(false)

    const [messageWrapper, setMessageWrapper] = useState("")

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                setMessageWrapper(data.messageWrapper || "")
            })
            .catch(err => console.error("Error fetching settings:", err))
            .finally(() => setFetching(false))
    }, [])

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)

        try {
            // Reutilizamos la API de settings pero solo mandamos el wrapper
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageWrapper })
            })
            if (res.ok) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const copyTags = () => {
        const tags = "{{plate}}, {{raw_message}}, {{NUM_POLICIA}}, {{NUM_TRANSITO}}, {{NUM_EMERGENCIAS}}";
        navigator.clipboard.writeText(tags);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Cargando editor de mensajes...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-white">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-cyan-500" />
                        Formato de WhatsApp
                    </h1>
                    <p className="text-gray-400">Personaliza la estructura global de los mensajes que reciben los usuarios.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
                        <div className="p-1 bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20" />
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span>Editor de Plantilla Global</span>
                                <span className="text-cyan-400/60 font-mono">HTML / Texto Plano</span>
                            </div>

                            <div className="relative group">
                                <textarea
                                    rows={15}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-6 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none shadow-inner"
                                    placeholder="Escribe el formato del mensaje aquí..."
                                    value={messageWrapper}
                                    onChange={(e) => setMessageWrapper(e.target.value)}
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className={cn(
                                    "text-sm font-bold transition-all duration-300",
                                    success ? "text-emerald-400 opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                                )}>
                                    ✓ Cambios guardados correctamente
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-cyan-900/30 flex items-center gap-2 active:scale-95"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                        <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-amber-500/80 uppercase">Aviso de seguridad</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Los cambios realizados aquí afectan a **todas** las notificaciones enviadas por WhatsApp que no tengan una organización específica. Asegúrate de incluir los tags necesarios para que el mensaje sea funcional.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Info className="h-4 w-4 text-cyan-400" />
                            Tags Disponibles
                        </h4>

                        <div className="space-y-4">
                            {[
                                { tag: "{{plate}}", desc: "La placa del vehículo (Ej: ABC-123)" },
                                { tag: "{{raw_message}}", desc: "El texto seleccionado por el usuario." },
                                { tag: "{{NUM_POLICIA}}", desc: "Número de la policía del país." },
                                { tag: "{{NUM_TRANSITO}}", desc: "Número de tránsito local." },
                                { tag: "{{NUM_EMERGENCIAS}}", desc: "Número de emergencias general." },
                            ].map(item => (
                                <div key={item.tag} className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:bg-white/5 transition-all">
                                    <code className="text-[11px] font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">{item.tag}</code>
                                    <p className="text-[10px] text-gray-500 font-medium leading-tight">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={copyTags}
                            className="w-full py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            {copied ? "¡Copiado!" : "Copiar todos los tags"}
                        </button>
                    </div>

                    <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 space-y-4">
                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Previsualización</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed italic">
                            Los cambios se aplican en tiempo real al servidor de envío. Una vez guardado, el próximo mensaje enviado usará este nuevo diseño.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
