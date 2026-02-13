import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import {
    LayoutDashboard,
    MessageSquare,
    Bell,
    ArrowUpRight,
    TrendingUp,
    Zap,
    Plus,
    ShieldAlert
} from "lucide-react"
import Link from "next/link"
import CorporateStatsChart from "@/components/CorporateStatsChart"

async function getStats(orgId: string) {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const startOfLastMonth = new Date(startOfMonth)
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)

    const [
        templateCount,
        thisMonthNotifications,
        lastMonthNotifications,
        recentTemplates,
        notificationsByDay
    ] = await Promise.all([
        db.notificationTemplate.count({ where: { organizationId: orgId, isActive: true } }),
        db.notification.count({ where: { organizationId: orgId, createdAt: { gte: startOfMonth } } }),
        db.notification.count({ where: { organizationId: orgId, createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
        db.notificationTemplate.findMany({
            where: { organizationId: orgId },
            take: 3,
            orderBy: { createdAt: 'desc' }
        }),
        db.notification.findMany({
            where: {
                organizationId: orgId,
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            },
            select: { createdAt: true }
        })
    ])

    // Process notification chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
    }).reverse()

    const chartData = last7Days.map(day => ({
        day: day.split('-').slice(1).join('/'),
        count: notificationsByDay.filter(n => n.createdAt.toISOString().split('T')[0] === day).length
    }))

    const growth = lastMonthNotifications === 0
        ? 100
        : Math.round(((thisMonthNotifications - lastMonthNotifications) / lastMonthNotifications) * 100)

    return {
        templateCount,
        thisMonthNotifications,
        growth,
        recentTemplates,
        chartData
    }
}

export default async function CorporateDashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <ShieldAlert className="h-16 w-16 text-yellow-500 opacity-50" />
                <h1 className="text-2xl font-bold">Sin Organización Asignada</h1>
                <p className="text-gray-400">Contacta al administrador para vincular tu cuenta.</p>
            </div>
        )
    }

    const stats = await getStats(session.user.organizationId)

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
                    <span className="text-sm font-bold text-indigo-400">
                        {stats.thisMonthNotifications > 0 ? "Actividad Detectada" : "En Espera"}
                    </span>
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
                            <span className="text-4xl font-black text-white">{stats.templateCount}</span>
                            <span className="text-indigo-400 text-xs font-bold mb-1">PROPIAS</span>
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
                            <span className="text-4xl font-black text-white">{stats.thisMonthNotifications}</span>
                            <span className={stats.growth >= 0 ? "text-green-400 text-xs font-bold mb-1 flex items-center gap-0.5" : "text-red-400 text-xs font-bold mb-1 flex items-center gap-0.5"}>
                                <TrendingUp className={stats.growth >= 0 ? "h-3 w-3" : "h-3 w-3 rotate-180"} /> {Math.abs(stats.growth)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-12 w-12 text-yellow-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Última Alerta</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">Hoy</span>
                            <span className="text-gray-500 text-xs font-bold mb-1 uppercase">ESTADO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Chart */}
                <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white">Actividad de Alertas</h2>
                            <p className="text-sm text-gray-500">Volumen de notificaciones de los últimos 7 días.</p>
                        </div>
                    </div>
                    <CorporateStatsChart data={stats.chartData} />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Recent Templates */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-400" />
                                Mis Plantillas
                            </h2>
                            <Link href="/corporate/templates" className="text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1">
                                Ver todas <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {stats.recentTemplates.length > 0 ? (
                                stats.recentTemplates.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                        <div>
                                            <p className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{t.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-indigo-400 transition-all" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 py-8 italic">No hay plantillas creadas.</p>
                            )}
                        </div>
                    </div>

                    {/* Integration Help */}
                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px]" />
                        <h2 className="text-xl font-black text-white mb-4 leading-tight">Potencia tu Organización</h2>
                        <p className="text-indigo-100/70 mb-8 text-sm leading-relaxed">
                            Crea mensajes personalizados para que tus operarios puedan notificar de forma rápida y profesional.
                        </p>
                        <Link href="/corporate/templates" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2">
                            <Plus className="h-5 w-5" /> Nueva Plantilla
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
