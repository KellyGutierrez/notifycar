import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, Search, History, Filter } from "lucide-react"

async function getNotifications(orgId: string) {
    return await db.notification.findMany({
        where: { organizationId: orgId },
        include: {
            vehicle: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

export default async function CorporateNotificationsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        redirect("/account/signin")
    }

    const notifications = await getNotifications(session.user.organizationId)

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">Historial de Avisos</h1>
                <p className="text-gray-400">Consulta la bitácora completa de notificaciones enviadas a tu flota.</p>
            </div>

            {/* List */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-indigo-400" />
                        <h2 className="text-xl font-bold">Actividad Reciente</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Fecha y Hora</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Vehículo / Placa</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Contenido del Aviso</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {notifications.length > 0 ? (
                                notifications.map((n: any) => (
                                    <tr key={n.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white capitalize">
                                                {format(n.createdAt, "eeee, dd MMMM", { locale: es })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {format(n.createdAt, "HH:mm a")}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                                                    <span className="text-sm font-black text-indigo-400 tracking-wider">
                                                        {n.vehicle?.plate.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="hidden md:block">
                                                    <p className="text-xs font-bold text-gray-400">{n.vehicle?.brand} {n.vehicle?.model}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-400 line-clamp-2 max-w-md italic group-hover:text-gray-300 transition-colors">
                                                "{n.content.length > 100 ? n.content.substring(0, 100) + '...' : n.content}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Enviado</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4 opacity-20" />
                                        <p className="text-gray-500 font-bold">No se han registrado notificaciones todavía.</p>
                                        <p className="text-xs text-gray-600 mt-1">Los avisos enviados aparecerán listados aquí.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
