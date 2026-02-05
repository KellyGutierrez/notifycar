"use client"

import { useState, useEffect } from "react"
import { Search, Car, Zap, Info, Loader2, AlertCircle, MessageSquare, Send, CheckCircle2, Bike, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"

export default function PublicZonePage() {
    const params = useParams()
    const token = params.token as string

    const [org, setOrg] = useState<any>(null)
    const [plate, setPlate] = useState("")
    const [loading, setLoading] = useState(false)
    const [notifying, setNotifying] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [templates, setTemplates] = useState<any[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [verifying, setVerifying] = useState(true)

    // Verify token and load Org info
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`/api/public/zone?token=${token}`)
                if (res.ok) {
                    const data = await res.json()
                    setOrg(data.organization)
                    setTemplates(data.templates)
                } else {
                    setError("Acceso no válido o expirado.")
                }
            } catch (err) {
                setError("Error de conexión.")
            } finally {
                setVerifying(false)
            }
        }
        verify()
    }, [token])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!plate) return

        setLoading(true)
        setError(null)
        setResult(null)
        setSuccessMsg(null)
        setSelectedTemplate(null)

        try {
            const res = await fetch(`/api/search?plate=${plate}`)
            if (res.ok) {
                const data = await res.json()
                if (data.found) {
                    setResult(data.vehicle)
                } else {
                    setError("Vehículo no registrado en NotifyCar.")
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

    const handleNotify = async () => {
        if (!result || !selectedTemplate) return
        const template = templates.find(t => t.id === selectedTemplate)
        if (!template) return

        setNotifying(true)
        setError(null)

        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleId: result.id,
                    content: template.content,
                    templateId: template.id,
                    type: "APP"
                })
            })

            if (res.ok) {
                setSuccessMsg("¡Aviso enviado con éxito!")
                setResult(null)
                setPlate("")
            } else {
                const errorText = await res.text()
                setError(errorText || "Error al enviar.")
            }
        } catch (error) {
            setError("Error de conexión.")
        } finally {
            setNotifying(false)
        }
    }

    if (verifying) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 text-white">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                <p className="font-bold text-gray-500 uppercase tracking-widest text-xs animate-pulse">Verificando acceso oficial...</p>
            </div>
        )
    }

    if (!org && !verifying) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-black text-white mb-2 uppercase italic">Acceso Denegado</h1>
                <p className="text-gray-400 max-w-sm">Este link de acceso no es válido o ha sido revocado por la administración.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] opacity-20" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-900/5 rounded-full blur-[100px] opacity-10" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 space-y-8">
                {/* Header Branded */}
                <div className="flex flex-col items-center text-center space-y-4">
                    {org.logo ? (
                        <img src={org.logo} alt={org.name} className="h-24 w-auto object-contain mb-2" />
                    ) : (
                        <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-2">
                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase italic drop-shadow-2xl">
                            {org.name}
                        </h1>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Punto de Control Autorizado</span>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                {!successMsg && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <form onSubmit={handleSearch} className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="PLACA A VERIFICAR..."
                                className="w-full bg-white/[0.03] border-2 border-white/10 rounded-3xl py-6 pl-16 pr-6 text-2xl font-black text-white placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-widest"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/20">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar"}
                            </button>
                        </form>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-in shake duration-300">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] space-y-8 animate-in zoom-in duration-300">
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                            {result.type === "MOTORCYCLE" ? <Bike className="h-6 w-6 text-emerald-500" /> : <Car className="h-6 w-6 text-emerald-500" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vehículo Detectado</p>
                                            <h3 className="text-xl font-black text-white">{result.brand} {result.model}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-500 text-black font-black px-4 py-2 rounded-xl text-lg tracking-widest uppercase">
                                        {result.plate}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Selecciona la acción para zonas azules</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {templates.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTemplate(t.id)}
                                                className={cn(
                                                    "w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group",
                                                    selectedTemplate === t.id
                                                        ? "bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-900/40"
                                                        : "bg-white/5 border-white/5 text-gray-400 hover:border-emerald-500/30 hover:bg-white/[0.07]"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <MessageSquare className={cn("h-5 w-5", selectedTemplate === t.id ? "text-black" : "text-emerald-500")} />
                                                    <span className="font-bold uppercase text-sm tracking-tight">{t.name}</span>
                                                </div>
                                                <div className={cn("h-2 w-2 rounded-full", selectedTemplate === t.id ? "bg-black" : "bg-emerald-500/30 group-hover:bg-emerald-500")} />
                                            </button>
                                        ))}
                                    </div>

                                    {selectedTemplate && (
                                        <button
                                            disabled={notifying}
                                            onClick={handleNotify}
                                            className="w-full mt-4 bg-white text-black py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-white/10"
                                        >
                                            {notifying ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                            Enviar Notificación Oficial
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {successMsg && (
                    <div className="py-20 flex flex-col items-center text-center animate-in zoom-in duration-500">
                        <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                            <CheckCircle2 className="h-12 w-12 text-black" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">¡Operación Exitosa!</h2>
                        <p className="text-emerald-500/60 font-medium mb-12">{successMsg}</p>
                        <button
                            onClick={() => { setSuccessMsg(null); setPlate(""); setResult(null); }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all focus:outline-none"
                        >
                            Realizar nueva verificación
                        </button>
                    </div>
                )}

                {/* Footer simple */}
                <div className="pt-20 text-center">
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em]">NotifyCar Institutional Security Protocol v2.5</p>
                </div>
            </div>
        </div>
    )
}
