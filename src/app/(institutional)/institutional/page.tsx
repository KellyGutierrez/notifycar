"use client"

import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Building2,
    Shield
} from "lucide-react"

export default function InstitutionalDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Panel Institucional
                    </h1>
                    <p className="text-gray-400">
                        Control de avisos y gestión de zonas azules / entidades gubernamentales.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">Modo Oficial</span>
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
                            Mensajes de Zonas Azules
                        </h2>
                        <button className="text-emerald-400 text-sm font-bold hover:underline flex items-center gap-1">
                            Ver reportes <ArrowUpRight className="h-4 w-4" />
                        </button>
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

                {/* Quick Info */}
                <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px]" />
                    <h2 className="text-2xl font-black text-white mb-4">Gestión Institucional</h2>
                    <p className="text-emerald-100/70 mb-8 leading-relaxed">
                        Este panel permite a los reguladores de tránsito y gestores de espacio público mejorar la comunicación con los ciudadanos sin recurrir a sanciones directas inicialmente.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20">
                            Gestionar Zonas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
