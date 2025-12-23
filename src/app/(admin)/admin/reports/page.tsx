import { db } from "@/lib/db"
import { BarChart3, TrendingUp, Users, Car, Bell, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

async function getReportData() {
    const [userCount, vehicleCount, notificationCount] = await Promise.all([
        db.user.count(),
        db.vehicle.count(),
        db.notification.count(),
    ])

    // Mock trend data for visualization
    const trends = [
        { label: "Lunes", count: 12 },
        { label: "Martes", count: 18 },
        { label: "Miércoles", count: 15 },
        { label: "Jueves", count: 25 },
        { label: "Viernes", count: 32 },
        { label: "Sábado", count: 28 },
        { label: "Domingo", count: 20 },
    ]

    const maxTrend = Math.max(...trends.map(t => t.count))

    return {
        userCount,
        vehicleCount,
        notificationCount,
        trends,
        maxTrend
    }
}

export default async function AdminReportsPage() {
    const data = await getReportData()

    const stats = [
        { name: "Crecimiento Usuarios", value: "+12%", icon: Users, trend: 'up' },
        { name: "Tasa de Notificaciones", value: "85%", icon: Bell, trend: 'up' },
        { name: "Vehículos Eléctricos", value: "15%", icon: Car, trend: 'down' },
        { name: "SLA del Sistema", value: "99.9%", icon: Activity, trend: 'up' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Reportes y Analíticas</h1>
                <p className="text-gray-400 mt-1">Visión detallada del rendimiento y uso de NotifyCar.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border",
                                stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.value}
                            </div>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                        <p className="text-2xl font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph Placeholder */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-cyan-400" />
                            Actividad de Notificaciones
                        </h2>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 focus:outline-none">
                            <option>Últimos 7 días</option>
                            <option>Últimos 30 días</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {data.trends.map((item) => (
                            <div key={item.label} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="relative w-full flex items-end justify-center">
                                    <div
                                        className="w-full max-w-[40px] bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-lg transition-all duration-1000 group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                                        style={{ height: `${(item.count / data.maxTrend) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.count}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-8">
                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                            Distribución
                        </h2>
                        <div className="space-y-6">
                            {[
                                { name: "Usuarios Normales", value: data.userCount - 2, color: "bg-blue-500" },
                                { name: "Administradores", value: 2, color: "bg-purple-500" },
                                { name: "Vehículos Eléctricos", value: Math.floor(data.vehicleCount * 0.15), color: "bg-emerald-500" },
                            ].map((item) => (
                                <div key={item.name} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                        <span className="text-gray-400">{item.name}</span>
                                        <span className="text-white">{item.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-1000 bg-opacity-80", item.color)}
                                            style={{ width: `${(item.value / (data.userCount + data.vehicleCount)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all">
                        Descargar Reporte PDF
                    </button>
                </div>
            </div>
        </div>
    )
}
