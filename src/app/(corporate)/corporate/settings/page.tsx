"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Layout, Save, Loader2, CheckCircle2, Info, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CorporateSettingsPage() {
    const [org, setOrg] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        messageWrapper: ""
    })

    useEffect(() => {
        fetchOrg()
    }, [])

    const fetchOrg = async () => {
        try {
            const res = await fetch("/api/corporate/organization")
            if (res.ok) {
                const data = await res.json()
                setOrg(data)
                setFormData({
                    name: data.name || "",
                    messageWrapper: data.messageWrapper || ""
                })
            }
        } catch (error) {
            console.error("Error fetching org:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setSuccess(false)

        try {
            const res = await fetch("/api/corporate/organization", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch (error) {
            console.error("Error saving settings:", error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
                <p className="text-gray-500 font-bold">Cargando configuración...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Configuración de Flota
                </h1>
                <p className="text-gray-400 font-medium">
                    Gestiona la identidad y el diseño de tus mensajes de WhatsApp.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Basic Info */}
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="h-6 w-6 text-indigo-400" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Identidad</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Nombre de la Empresa / Gremio</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {/* WhatsApp Wrapper Design */}
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-6 w-6 text-emerald-400" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tighter text-emerald-400">Diseño WhatsApp (Plantilla)</h2>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-500/20">
                            Personalizado
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center justify-between">
                                    Editor de Estilo
                                    <span className="text-[9px] text-gray-600">Formato WhatsApp habilitado</span>
                                </label>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all font-mono text-xs leading-relaxed text-white min-h-[400px]"
                                    value={formData.messageWrapper}
                                    onChange={(e) => setFormData({ ...formData, messageWrapper: e.target.value })}
                                    placeholder="Construye tu mensaje aquí..."
                                />
                            </div>

                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3">
                                <Info className="h-5 w-5 text-blue-400 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Etiquetas Disponibles</p>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {["{{name}}", "{{plate}}", "{{raw_message}}", "{{NUM_COORDINACION}}"].map(tag => (
                                            <code key={tag} className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-blue-300 font-mono border border-white/5">{tag}</code>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-tight pt-1 italic">
                                        Usa estas etiquetas para que el sistema reemplace automáticamente los datos reales del conductor y el taxi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Vista Previa Móvil</label>
                            <div className="bg-[#121b22] rounded-[2.5rem] p-6 border-8 border-[#202c33] shadow-2xl min-h-[450px] relative overflow-hidden flex flex-col">
                                <div className="bg-[#202c33] -mx-6 -mt-6 p-4 flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shrink-0">
                                        {org?.name?.charAt(0) || "C"}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm leading-none">{org?.name || "Cootransrio"}</p>
                                        <p className="text-emerald-400 text-[10px] uppercase font-black tracking-widest">En línea</p>
                                    </div>
                                </div>

                                <div className="bg-[#dcf8c6] text-[#111b21] p-5 rounded-2xl rounded-tl-none shadow-sm relative text-xs whitespace-pre-wrap font-sans max-w-[90%]">
                                    <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-[#dcf8c6] border-b-[10px] border-b-transparent" />
                                    {formData.messageWrapper
                                        ? formData.messageWrapper
                                            .replace("{{name}}", "Juan Pérez")
                                            .replace("{{plate}}", "ABC-123")
                                            .replace("{{raw_message}}", "Se solicita su presencia en la central para revisión de documentos.")
                                        : "Tu mensaje aparecerá aquí..."
                                    }
                                    <p className="text-right text-[9px] text-gray-500 mt-2">11:32 AM ✓✓</p>
                                </div>

                                <div className="mt-auto -mx-6 -mb-6 bg-[#202c33] p-4 flex gap-2">
                                    <div className="flex-1 bg-[#2a3942] rounded-full h-8" />
                                    <div className="w-8 h-8 rounded-full bg-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4 p-2">
                    {success && (
                        <div className="flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-right-4">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Cambios Guardados</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span>GUARDANDO...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-6 w-6" />
                                <span>GUARDAR TODO</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
