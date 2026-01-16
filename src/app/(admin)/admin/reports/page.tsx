import { db } from "@/lib/db"
import { BarChart3, TrendingUp, Users, Car, Bell, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReportFilters } from "./ReportFilters"
import { Prisma } from "@prisma/client"

interface PageProps {
    searchParams: Promise<{
        startDate?: string
        endDate?: string
    }>
}

async function getReportData(startDate?: string, endDate?: string) {
    const where: any = {}

    if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate)
        if (endDate) {
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            where.createdAt.lte = end
        }
    }

    const [userCount, vehicleCount, notificationCount] = await Promise.all([
        db.user.count({ where }),
        db.vehicle.count({ where }),
        db.notification.count({ where }),
    ])

    // Generate dynamic trend based on notifications
    const notifications = await db.notification.findMany({
        where,
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
    })

    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const trendsMap = new Map()

    // Initialize last 7 days or range
    notifications.forEach(n => {
        const day = days[new Date(n.createdAt).getDay()]
        trendsMap.set(day, (trendsMap.get(day) || 0) + 1)
    })

    const trends = Array.from(trendsMap.entries()).map(([label, count]) => ({ label, count }))
    if (trends.length === 0) {
        trends.push({ label: "Sin Datos", count: 0 })
    }

    const maxTrend = Math.max(...trends.map(t => t.count)) || 1

    return {
        userCount,
        vehicleCount,
        notificationCount,
        trends,
        maxTrend
    }
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
    const { startDate, endDate } = await searchParams
    const data = await getReportData(startDate, endDate)

    const stats = [
        { name: "Total Usuarios", value: data.userCount.toString(), icon: Users, trend: 'up' },
        { name: "Total Alertas", value: data.notificationCount.toString(), icon: Bell, trend: 'up' },
        { name: "Total Vehículos", value: data.vehicleCount.toString(), icon: Car, trend: 'up' },
        { name: "SLA del Sistema", value: "99.9%", icon: Activity, trend: 'up' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Reportes y Analíticas</h1>
                <p className="text-gray-400 mt-1">Monitorea el crecimiento y uso de la plataforma en tiempo real.</p>
            </div>

            {/* Filtros */}
            <ReportFilters />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full border",
                                stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                CRECIMIENTO
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.name}</h3>
                        <p className="text-3xl font-black text-white mt-1 group-hover:text-cyan-400 transition-colors tracking-tighter">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph Placeholder */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-transparent" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                <BarChart3 className="h-7 w-7 text-cyan-400" />
                                Volumen de Alertas
                            </h2>
                            <p className="text-sm text-gray-500">Distribución de actividad por día.</p>
                        </div>
                    </div>

                    <div className="h-72 flex items-end justify-between gap-6 px-4">
                        {data.trends.map((item) => (
                            <div key={item.label} className="flex-1 flex flex-col items-center gap-6 group">
                                <div className="relative w-full flex items-end justify-center">
                                    <div
                                        className="w-full max-w-[50px] bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-xl transition-all duration-700 group-hover:brightness-125 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                                        style={{ height: `${(item.count / data.maxTrend) * 100}%`, minHeight: '4px' }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cyan-500 text-black font-black text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                                            {item.count}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Distribution */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-10">
                            <TrendingUp className="h-7 w-7 text-emerald-400" />
                            Composición
                        </h2>
                        <div className="space-y-8">
                            {[
                                { name: "Alertas Totales", value: data.notificationCount, color: "from-cyan-500 to-blue-600" },
                                { name: "Vehículos", value: data.vehicleCount, color: "from-purple-500 to-indigo-600" },
                                { name: "Usuarios", value: data.userCount, color: "from-emerald-500 to-teal-600" },
                            ].map((item) => (
                                <div key={item.name} className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <span>{item.name}</span>
                                        <span className="text-white">{item.value}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={cn("h-full transition-all duration-1000 bg-gradient-to-r", item.color)}
                                            style={{ width: `${(item.value / (data.userCount + data.vehicleCount + data.notificationCount || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                            <p className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest mb-1 text-center">Estado del Ecosistema</p>
                            <p className="text-xs text-gray-500 text-center leading-relaxed">
                                Estas estadísticas reflejan el uso total dentro del rango seleccionado.
                            </p>
                        </div>
                        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-950/40 transition-all transform hover:-translate-y-1 active:scale-95">
                            Generar PDF Completo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
