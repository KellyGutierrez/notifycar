import { db } from "@/lib/db"
import { Bell, Clock, CheckCircle2, XCircle, Send, Car, AlertCircle, Calendar, Hash, User, Smartphone, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationFilters } from "./NotificationFilters"
import { Prisma } from "@/generated/client"
import { format, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"

interface PageProps {
    searchParams: Promise<{
        search?: string
        status?: string
        startDate?: string
        endDate?: string
    }>
}

async function getNotifications(search?: string, status?: string, startDate?: string, endDate?: string) {
    const where: Prisma.NotificationWhereInput = {}

    if (search) {
        where.vehicle = {
            plate: { contains: search, mode: 'insensitive' }
        }
    }

    if (status && status !== "ALL") {
        where.status = status
    }

    if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate)
        if (endDate) {
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            where.createdAt.lte = end
        }
    }

    return await db.notification.findMany({
        where,
        include: {
            vehicle: {
                select: { plate: true, brand: true, model: true }
            }
        },
        orderBy: { createdAt: "desc" },
        take: 100
    })
}

export default async function AdminNotificationsPage({ searchParams }: PageProps) {
    const { search, status, startDate, endDate } = await searchParams
    const notifications = await getNotifications(search, status, startDate, endDate)

    // Agrupar por fechas
    const groupedNotifications: { [key: string]: any[] } = {}
    notifications.forEach(notif => {
        const date = format(notif.createdAt, "yyyy-MM-dd")
        if (!groupedNotifications[date]) {
            groupedNotifications[date] = []
        }
        groupedNotifications[date].push(notif)
    })

    const groupKeys = Object.keys(groupedNotifications).sort((a, b) => b.localeCompare(a))

    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr + "T12:00:00")
        if (isToday(date)) return "Hoy"
        if (isYesterday(date)) return "Ayer"
        return format(date, "EEEE, d 'de' MMMM", { locale: es })
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/5">
                        <Activity className="h-3.5 w-3.5" />
                        Centro de Comunicaciones
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Historial de <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Alertas</span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-xl text-sm md:text-base">
                        Registro detallado de todas las notificaciones procesadas por el sistema.
                    </p>
                </div>

                <div className="flex items-center gap-5 bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-4 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-right relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Filtrado</p>
                        <p className="text-3xl font-black text-white tabular-nums">{notifications.length}</p>
                    </div>
                    <div className="h-12 w-[1px] bg-white/10 relative z-10" />
                    <div className="p-3 bg-cyan-500/10 rounded-2xl relative z-10">
                        <Bell className="h-6 w-6 text-cyan-500 animate-bounce group-hover:animate-none" />
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <NotificationFilters />

            {/* Timeline/Feed */}
            <div className="space-y-12 pb-24">
                {groupKeys.length > 0 ? groupKeys.map((dateKey) => (
                    <div key={dateKey} className="space-y-8 relative">
                        {/* Date Divider */}
                        <div className="sticky top-0 z-20 flex items-center gap-6 py-4 pointer-events-none">
                            <div className="bg-[#050505] pr-6 flex items-center gap-3 pointer-events-auto">
                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em] drop-shadow-sm">
                                    {getDateLabel(dateKey)}
                                </h2>
                            </div>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                        </div>

                        {/* Notifications in this day */}
                        <div className="grid grid-cols-1 gap-6 px-2">
                            {groupedNotifications[dateKey].map((notif: any) => (
                                <NotificationCard key={notif.id} notif={notif} />
                            ))}
                        </div>
                    </div>
                )) : (
                    <EmptyState />
                )}
            </div>
        </div>
    )
}

function NotificationCard({ notif }: { notif: any }) {
    const recipientMatch = notif.content.match(/Hola\s+([^,!\s]+)/i)
    const recipient = recipientMatch ? recipientMatch[1] : "Usuario"

    return (
        <div className="group relative p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-cyan-500/20 active:scale-[0.99] transition-all duration-500 shadow-2xl">
            <div className="relative p-6 md:p-8 rounded-[1.4rem] bg-[#0a0a0a]/90 backdrop-blur-3xl overflow-hidden">
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                    <Bell className="h-32 w-32 text-white -rotate-12" />
                </div>

                <div className="relative flex flex-col lg:flex-row gap-8">
                    {/* Status Column */}
                    <div className="shrink-0 flex items-start lg:flex-col justify-between lg:justify-start gap-5">
                        <div className={cn(
                            "h-20 w-20 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700 shadow-2xl group-hover:rotate-6 group-hover:scale-110",
                            notif.status === "SENT"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/20"
                                : notif.status === "FAILED"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/20"
                        )}>
                            {notif.status === "SENT" ? <CheckCircle2 className="h-10 w-10 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]" /> :
                                notif.status === "FAILED" ? <XCircle className="h-10 w-10" /> : <Clock className="h-10 w-10" />}
                        </div>

                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border text-center min-w-[100px]",
                            notif.status === "SENT" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                notif.status === "FAILED" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}>
                            {notif.status}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        {/* Meta Header */}
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/10 text-gray-400">
                                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                                {format(notif.createdAt, "hh:mm:ss a")}
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/10 text-gray-400">
                                <Hash className="h-3.5 w-3.5 text-cyan-400" />
                                REF: {notif.id.slice(-10).toUpperCase()}
                            </div>
                        </div>

                        {/* Content Box */}
                        <div className="relative group/content">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Receptor</p>
                                        <p className="text-white font-black text-lg tracking-tight uppercase italic">{recipient}</p>
                                    </div>
                                </div>

                                <blockquote className="text-gray-300 font-medium text-lg md:text-xl leading-relaxed tracking-tight group-hover:text-white transition-colors">
                                    <span className="text-cyan-500 font-black mr-2 opacity-50">"</span>
                                    {notif.content}
                                    <span className="text-cyan-500 font-black ml-2 opacity-50">"</span>
                                </blockquote>
                            </div>
                        </div>

                        {/* Badges Footer */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl bg-cyan-500/10 text-cyan-400 text-xs font-black border border-cyan-500/20 uppercase tracking-[0.1em] shadow-xl hover:bg-cyan-500/20 transition-all cursor-default">
                                <div className="p-1.5 bg-cyan-500 rounded-lg text-black shadow-lg shadow-cyan-500/40">
                                    <Car className="h-4 w-4" />
                                </div>
                                <span>{notif.vehicle.brand} {notif.vehicle.model}</span>
                                <span className="h-4 w-[1px] bg-cyan-500/30" />
                                <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">{notif.vehicle.plate}</span>
                            </div>

                            {notif.type !== "APP" && (
                                <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all cursor-default group-hover:text-gray-300">
                                    {notif.type === "WHATSAPP" ? <Smartphone className="h-4 w-4 text-emerald-400" /> : <Send className="h-4 w-4 text-blue-400" />}
                                    {notif.type === "WHATSAPP" ? "WhatsApp" : notif.type === "EMAIL" ? "Email" : notif.type}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="py-40 text-center space-y-10 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] animate-in zoom-in-95 duration-1000">
            <div className="relative inline-flex h-32 w-32">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-[2.5rem] blur-3xl animate-pulse" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 rotate-12 transition-all hover:rotate-0 duration-700 shadow-2xl">
                    <AlertCircle className="h-16 w-16 text-gray-700" />
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Sin actividad relevante</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                    No hemos detectado alertas que coincidan con los parámetros de búsqueda actuales. Intenta ajustar los filtros.
                </p>
            </div>
        </div>
    )
}
