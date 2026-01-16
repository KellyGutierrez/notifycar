import { db } from "@/lib/db"
import { Bell, Clock, CheckCircle2, XCircle, Send, Car, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationFilters } from "./NotificationFilters"
import { Prisma } from "@prisma/client"

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Historial de Alertas</h1>
                <p className="text-gray-400">Auditoría completa de las comunicaciones del sistema.</p>
            </div>

            {/* Filtros */}
            <NotificationFilters />

            {/* Timeline/Feed */}
            <div className="space-y-4">
                {notifications.map((notif: any) => (
                    <div
                        key={notif.id}
                        className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all backdrop-blur-md relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Status Icon */}
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-2xl transition-transform group-hover:scale-110 duration-500",
                                notif.status === "SENT"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10"
                                    : notif.status === "FAILED"
                                        ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10"
                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10"
                            )}>
                                {notif.status === "SENT" ? <CheckCircle2 className="h-7 w-7" /> :
                                    notif.status === "FAILED" ? <XCircle className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded border",
                                        notif.status === "SENT" ? "text-emerald-400 border-emerald-500/20" :
                                            notif.status === "FAILED" ? "text-red-400 border-red-500/20" : "text-amber-400 border-amber-500/20"
                                    )}>
                                        {notif.status}
                                    </span>
                                    <span className="text-white/10">•</span>
                                    <span className="text-gray-500 flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full">
                                        <Clock className="h-3 w-3" />
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                <p className="text-gray-100 font-medium text-lg tracking-tight leading-snug">
                                    {notif.content}
                                </p>

                                <div className="flex items-center gap-3 pt-2">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-black border border-cyan-500/20 uppercase tracking-widest shadow-lg shadow-cyan-900/20">
                                        <Car className="h-3.5 w-3.5" />
                                        {notif.vehicle.plate}
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-widest border border-white/5">
                                        <Send className="h-3.5 w-3.5" />
                                        {notif.type}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="py-24 text-center space-y-6 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2rem]">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 rotate-12">
                            <AlertCircle className="h-10 w-10 text-gray-600 -rotate-12" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-gray-400">Sin actividad registrada</p>
                            <p className="text-sm text-gray-600">No hay alertas que coincidan con los filtros actuales.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
