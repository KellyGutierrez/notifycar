import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    ArrowUpRight,
    TrendingUp,
    Zap
} from "lucide-react"

export default function CorporateDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Panel de Control
                    </h1>
                    <p className="text-gray-400">
                        Gestiona las notificaciones y plantillas de tu organización.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-bold text-indigo-400">Actividad Alta</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="h-12 w-12 text-indigo-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Plantillas Activas</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">12</span>
                            <span className="text-indigo-400 text-xs font-bold mb-1">+2 este mes</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Bell className="h-12 w-12 text-purple-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Enviados (Mes)</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">842</span>
                            <span className="text-green-400 text-xs font-bold mb-1 flex items-center gap-0.5">
                                <TrendingUp className="h-3 w-3" /> 14%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-12 w-12 text-yellow-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Tiempo de Respuesta</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">1.2m</span>
                            <span className="text-gray-500 text-xs font-bold mb-1">PROMEDIO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Templates */}
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-indigo-400" />
                            Plantillas Recientes
                        </h2>
                        <button className="text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1">
                            Ver todas <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Pagar Parqueadero", type: "Zona Azul", usage: 145 },
                            { name: "Vehículo Mal Estacionado", type: "Seguridad", usage: 89 },
                            { name: "Tiempo Expirado", type: "Zona Azul", usage: 230 }
                        ].map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                <div>
                                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{t.name}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-white">{t.usage}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Usos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integration Help */}
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px]" />
                    <h2 className="text-2xl font-black text-white mb-4">Potencia tu Organización</h2>
                    <p className="text-indigo-100/70 mb-8 leading-relaxed">
                        Crea mensajes personalizados para que tus operarios puedan notificar a los conductores de forma rápida y profesional.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20">
                            Crear Plantilla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
