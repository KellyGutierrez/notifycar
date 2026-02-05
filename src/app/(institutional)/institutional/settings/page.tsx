"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Save, Loader2, Info, AlertCircle, Copy, Check, Settings as SettingsIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function InstitutionalSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)
    const [copied, setCopied] = useState(false)

    const [messageWrapper, setMessageWrapper] = useState("")
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        fetch("/api/institutional/settings")
            .then(res => res.json())
            .then(data => {
                setMessageWrapper(data.messageWrapper || "")
                setOrgName(data.name || "")
            })
            .catch(err => console.error("Error fetching settings:", err))
            .finally(() => setFetching(false))
    }, [])

    const handleSave = async () => {
        setLoading(true)
        setSuccess(false)

        try {
            const res = await fetch("/api/institutional/settings", {
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
        const tags = "{{name}}, {{plate}}, {{raw_message}}, {{NUM_POLICIA}}, {{NUM_TRANSITO}}, {{NUM_EMERGENCIAS}}";
        navigator.clipboard.writeText(tags);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Cargando configuración institucional...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-white">
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase italic bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8 text-emerald-500" />
                        Plantilla de WhatsApp
                    </h1>
                    <p className="text-gray-400 font-medium">Personaliza el diseño oficial (encabezado y pie de página) para {orgName}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
                        <div className="p-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20" />
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span>Marco de Mensaje (Aviso Oficial)</span>
                                <span className="text-emerald-400/60 font-mono">Formato Personalizado</span>
                            </div>

                            <div className="relative group">
                                <textarea
                                    rows={12}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-6 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none shadow-inner"
                                    placeholder="Escribe el formato del mensaje aquí..."
                                    value={messageWrapper}
                                    onChange={(e) => setMessageWrapper(e.target.value)}
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_emerald]" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className={cn(
                                    "text-sm font-bold transition-all duration-300",
                                    success ? "text-emerald-400 opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                                )}>
                                    ✓ Cambios guardados para tu organización
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-emerald-900/30 flex items-center gap-2 active:scale-95 uppercase tracking-wider"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Guardar Diseño
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                        <AlertCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-emerald-500/80 uppercase">Personalización por Institución</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Este diseño **solo** será visible en los mensajes enviados por tu organización ({orgName}). Los operarios usarán el link de bypass y los mensajes tendrán este encabezado y pie de página.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Info className="h-4 w-4 text-emerald-400" />
                            Tags Inteligentes
                        </h4>

                        <div className="space-y-4">
                            {[
                                { tag: "{{name}}", desc: "Nombre del propietario del vehículo." },
                                { tag: "{{plate}}", desc: "Número de placa/matrícula." },
                                { tag: "{{raw_message}}", desc: "Contenido del aviso específico." },
                                { tag: "{{NUM_POLICIA}}", desc: "Número de policía configurado." },
                                { tag: "{{NUM_TRANSITO}}", desc: "Número de tránsito local." },
                            ].map(item => (
                                <div key={item.tag} className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:bg-white/5 transition-all">
                                    <code className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{item.tag}</code>
                                    <p className="text-[10px] text-gray-500 font-medium leading-tight">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={copyTags}
                            className="w-full py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            {copied ? "¡Copiado!" : "Copiar Tags"}
                        </button>
                    </div>

                    <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 space-y-4">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest italic">Ejemplo de éxito</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                            "Aviso oficial de {orgName}: Su vehículo con placa {'{{plate}}'} ha sido reportado por: {'{{raw_message}}'}."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
