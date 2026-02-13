"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Save, Loader2, Info, AlertCircle, Copy, Check, Settings as SettingsIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CorporateSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)
    const [copied, setCopied] = useState(false)

    const [messageWrapper, setMessageWrapper] = useState("")
    const [useGlobalTemplates, setUseGlobalTemplates] = useState(true)
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        fetch("/api/corporate/organization")
            .then(res => res.json())
            .then(data => {
                setMessageWrapper(data.messageWrapper || "")
                setUseGlobalTemplates(data.useGlobalTemplates ?? true)
                setOrgName(data.name || "")
            })
            .catch(err => console.error("Error fetching settings:", err))
            .finally(() => setFetching(false))
    }, [])

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)

        try {
            const res = await fetch("/api/corporate/organization", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageWrapper,
                    useGlobalTemplates
                })
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
        const tags = "{{name}}, {{plate}}, {{raw_message}}";
        navigator.clipboard.writeText(tags);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Cargando configuración de flota...</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-white">
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase italic bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8 text-indigo-500" />
                        Plantilla de WhatsApp
                    </h1>
                    <p className="text-gray-400 font-medium font-mono text-sm tracking-tighter">Personaliza el diseño oficial (encabezado y pie de página) para {orgName}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
                        <div className="p-1 bg-gradient-to-r from-indigo-500/20 via-transparent to-indigo-500/20" />
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                                <span>Marco de Mensaje (Aviso Operativo)</span>
                                <span className="text-indigo-400/60 font-mono">Formato Personalizado</span>
                            </div>

                            <div className="relative group">
                                <textarea
                                    rows={14}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-6 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none shadow-inner"
                                    placeholder="Escribe el formato del mensaje aquí..."
                                    value={messageWrapper}
                                    onChange={(e) => setMessageWrapper(e.target.value)}
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_indigo]" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className={cn(
                                    "text-sm font-bold transition-all duration-300",
                                    success ? "text-emerald-400 opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                                )}>
                                    ✓ Cambios guardados exitosamente
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-black transition-all shadow-xl shadow-indigo-900/30 flex items-center gap-2 active:scale-95 uppercase tracking-tighter"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Guardar Diseño
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Selection */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden p-8 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-indigo-400" />
                                Mensajes del Sistema
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-black/20 border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setUseGlobalTemplates(!useGlobalTemplates)}>
                            <div className={cn(
                                "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
                                useGlobalTemplates ? "bg-indigo-500 border-indigo-500" : "border-white/10 bg-white/5"
                            )}>
                                {useGlobalTemplates && <Check className="h-4 w-4 text-white" strokeWidth={4} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">Incluir mensajes generales de NotifyCar</p>
                                <p className="text-[11px] text-gray-500 font-medium">Si se desactiva, los usuarios solo verán tus mensajes personalizados al buscar tus placas.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                        <AlertCircle className="h-6 w-6 text-indigo-500 shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-indigo-500/80 uppercase">Aviso Importante</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                Esta plantilla define el "envoltura" de todos los mensajes que envíes. Asegúrate de incluir la etiqueta <code className="text-indigo-400">{"{{raw_message}}"}</code> para que el contenido específico no se pierda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 shadow-xl">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                            <Info className="h-4 w-4 text-indigo-400" />
                            Tags Inteligentes
                        </h4>

                        <div className="space-y-4">
                            {[
                                { tag: "{{name}}", desc: "Nombre del conductor o propietario." },
                                { tag: "{{plate}}", desc: "Número de placa del vehículo." },
                                { tag: "{{raw_message}}", desc: "Contenido del aviso específico del mensaje." },
                            ].map(item => (
                                <div key={item.tag} className="space-y-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:bg-white/5 transition-all">
                                    <code className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">{item.tag}</code>
                                    <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase tracking-tight">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={copyTags}
                            className="w-full py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            {copied ? "¡COPIADO!" : "COPIAR TAGS"}
                        </button>
                    </div>

                    <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 space-y-4 shadow-xl">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic flex items-center gap-2">
                            VISTA PREVIA DINÁMICA
                        </h4>
                        <div className="bg-[#075e54]/20 p-5 rounded-2xl border border-white/5 shadow-inner">
                            <div className="bg-white text-black p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-[10px] leading-relaxed relative shadow-lg">
                                <div className="absolute -left-2 top-0 border-[8px] border-transparent border-t-white border-r-white" />
                                <div className="whitespace-pre-wrap font-sans">
                                    {(messageWrapper || "Hola {{name}}, tu vehículo {{plate}} tiene un aviso:\n\n{{raw_message}}\n\nSaludos!")
                                        .replace("{{name}}", "Juan Pérez")
                                        .replace("{{plate}}", "ABC-123")
                                        .replace("{{raw_message}}", "Por favor mover el vehículo de la rampa.")
                                    }
                                </div>
                                <div className="text-[8px] text-gray-400 text-right mt-1">12:00 PM ✓✓</div>
                            </div>
                        </div>
                        <p className="text-[9px] text-center text-gray-500 font-bold uppercase tracking-tighter">Simulación de WhatsApp</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
