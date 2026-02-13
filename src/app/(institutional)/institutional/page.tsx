import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
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
    Settings,
    Plus,
    ShieldAlert
} from "lucide-react"
import CorporateStatsChart from "@/components/CorporateStatsChart"
import InstitutionalPublicLink from "@/components/InstitutionalPublicLink"
import { headers } from "next/headers"

async function getStats(orgId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
        templateCount,
        todayNotifications,
        organization,
        notificationsByDay
    ] = await Promise.all([
        db.notificationTemplate.count({ where: { organizationId: orgId, isActive: true } }),
        db.notification.count({ where: { organizationId: orgId, createdAt: { gte: today } } }),
        db.organization.findUnique({ where: { id: orgId }, select: { publicToken: true } }),
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

    return {
        templateCount,
        todayNotifications,
        publicToken: organization?.publicToken || null,
        chartData
    }
}

export default async function InstitutionalDashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-white">
                <ShieldAlert className="h-16 w-16 text-yellow-500 opacity-50" />
                <h1 className="text-2xl font-bold">Sin Organización Asignada</h1>
                <p className="text-gray-400">Panel reservado para entidades institucionales.</p>
            </div>
        )
    }

    const stats = await getStats(session.user.organizationId)
    const headerList = await headers()
    const host = headerList.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    const origin = `${protocol}://${host}`

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
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Plantillas Oficiales</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">{stats.templateCount}</span>
                            <span className="text-emerald-400 text-xs font-bold mb-1">ACTIVAS</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Bell className="h-12 w-12 text-teal-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Alertas Hoy</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">{stats.todayNotifications}</span>
                            <span className="text-emerald-400 text-xs font-bold mb-1 flex items-center gap-0.5">
                                <TrendingUp className="h-3 w-3" /> Tiempo real
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-12 w-12 text-yellow-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Estado</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-white">ACTIVO</span>
                            <span className="text-emerald-400 text-xs font-bold mb-1">OK</span>
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
                            <h2 className="text-xl font-bold text-white">Histórico de Alertas</h2>
                            <p className="text-sm text-gray-500">Volumen de actividad institucional (últimos 7 días).</p>
                        </div>
                    </div>
                    <CorporateStatsChart data={stats.chartData} />
                </div>

                {/* Public Access Link Section */}
                <div className="lg:col-span-1">
                    <InstitutionalPublicLink
                        publicToken={stats.publicToken}
                        origin={origin}
                    />
                </div>
            </div>
        </div>
    )
}
