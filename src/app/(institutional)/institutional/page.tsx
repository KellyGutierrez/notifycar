"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Building2,
    Shield,
    Link as LinkIcon,
    Copy,
    Check,
    Globe,
    Settings
} from "lucide-react"

export default function InstitutionalDashboardPage() {
    const [publicToken, setPublicToken] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Fetch current user org token info
        fetch("/api/institutional/settings")
            .then(res => res.json())
            .then(data => setPublicToken(data.publicToken))
            .catch(err => console.error(err))
    }, [])

    const publicLink = typeof window !== 'undefined' ? `${window.location.origin}/zone/${publicToken}` : ""

    const copyLink = () => {
        navigator.clipboard.writeText(publicLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Panel Institucional
                    </h1>
                    <p className="text-gray-400 font-medium tracking-tight">
                        Control de avisos y gestión de zonas azules / entidades gubernamentales.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/institutional/settings"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-400 transition-all"
                    >
                        <Settings className="h-4 w-4" /> Configuración
                    </Link>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Modo Oficial</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Zonas Bajo Control</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">8</span>
                            <span className="text-emerald-400 text-xs font-bold mb-1">Activas</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Bell className="h-12 w-12 text-teal-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Notificaciones Hoy</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">156</span>
                            <span className="text-emerald-400 text-xs font-bold mb-1 flex items-center gap-0.5">
                                <TrendingUp className="h-3 w-3" /> Promedio estable
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-12 w-12 text-yellow-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Efectividad</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">94%</span>
                            <span className="text-gray-500 text-xs font-bold mb-1">ENTREGADOS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-emerald-400" />
                            Plantillas Activas
                        </h2>
                        <Link
                            href="/institutional/templates"
                            className="text-emerald-400 text-sm font-bold hover:underline flex items-center gap-1"
                        >
                            Ver todas <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Ticket por Vencer", type: "Aviso", usage: 312 },
                            { name: "Zona Prohibida", type: "Seguridad", usage: 45 },
                            { name: "Bloqueo de Rampa", type: "Urgente", usage: 22 }
                        ].map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                <div>
                                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{t.name}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-white">{t.usage}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Eventos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Public Access Link Section */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px]" />

                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white">Acceso Público (Bypass)</h2>
                    </div>

                    <p className="text-emerald-100/70 mb-6 text-sm leading-relaxed">
                        Comparte este link con tus operarios en campo para que puedan notificar sin necesidad de una cuenta personal.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 rounded-2xl group">
                            <LinkIcon className="h-4 w-4 text-gray-500 shrink-0" />
                            <code className="text-[10px] text-emerald-400/80 truncate font-mono flex-1">
                                {publicToken ? publicLink : "Generando link..."}
                            </code>
                        </div>

                        <button
                            onClick={copyLink}
                            disabled={!publicToken}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-95"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? "¡Link Copiado!" : "Copiar Link de Acceso"}
                        </button>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[10px] text-emerald-500/70 leading-relaxed italic">
                            Cualquier persona con este link podrá enviar mensajes de aviso usando el nombre de tu organización.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
