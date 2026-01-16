import { db } from "@/lib/db"
import { Users, Car, Bell, TrendingUp, ShieldAlert, Activity } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

async function getStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [userCount, vehicleCount, notificationCount, dailyNotifications, recentUsers] = await Promise.all([
        db.user.count(),
        db.vehicle.count(),
        db.notification.count(),
        db.notification.count({
            where: {
                createdAt: {
                    gte: today
                }
            }
        }),
        db.user.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                role: true
            }
        })
    ])

    return {
        userCount,
        vehicleCount,
        notificationCount,
        dailyNotifications,
        recentUsers
    }
}

export default async function AdminDashboardPage() {
    const stats = await getStats()

    const metrics = [
        {
            name: "Total Usuarios",
            value: stats.userCount.toString(),
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            name: "Vehículos Registrados",
            value: stats.vehicleCount.toString(),
            icon: Car,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
        },
        {
            name: "Alertas Enviadas",
            value: stats.notificationCount.toString(),
            icon: Bell,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            name: "Actividad Hoy",
            value: stats.dailyNotifications.toString(),
            icon: Activity,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                <p className="text-gray-400">Resumen general del estado del sistema NotifyCar.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <div
                        key={metric.name}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${metric.bg}`}>
                                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-400">{metric.name}</h3>
                            <p className="text-3xl font-bold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                                {metric.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Sections Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Recent Users List */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-cyan-400" />
                            Nuevos Usuarios
                        </h2>
                        <Link href="/admin/users" className="text-sm text-cyan-400 hover:underline">Ver todos</Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentUsers.length > 0 ? (
                            stats.recentUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{user.name || 'Sin nombre'}</p>
                                        <p className="text-xs text-gray-400 tracking-tight">
                                            {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 border rounded-full text-[10px] font-bold uppercase",
                                        user.role === 'ADMIN' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                    )}>
                                        {user.role}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4 text-sm font-medium italic">No hay registros recientes.</p>
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 flex flex-col justify-between overflow-hidden group">
                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-emerald-400">
                            <ShieldAlert className="h-5 w-5" />
                            Estado del Sistema
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Servidor API</span>
                                    <span className="text-emerald-400 font-bold">En línea</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[100%] bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Base de Datos (MySQL)</span>
                                    <span className="text-emerald-400 font-bold">Conectado</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[100%] bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
