import { Car, Bell, ArrowRight, Plus, Activity, Loader2 } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/account/signin")
    }

    const [vehicleCount, notificationCount, totalInteractions] = await Promise.all([
        db.vehicle.count({
            where: { userId: session.user.id }
        }),
        db.notification.count({
            where: {
                vehicle: { userId: session.user.id },
                status: 'PENDING'
            }
        }),
        db.notification.count({
            where: {
                vehicle: { userId: session.user.id }
            }
        })
    ])

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-800 p-8 shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo, {session.user?.name}</h2>
                    <p className="text-green-100 max-w-lg">
                        Gestiona tus vehículos y mantente al día con las notificaciones de tu comunidad.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link
                            href="/vehicles"
                            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
                        >
                            Ver Mis Vehículos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
                {/* Decorative background pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 transform translate-x-12 -translate-y-6">
                    <Car className="h-64 w-64 text-white" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:bg-white/10 transition duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Car className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">ACTIVOS</span>
                    </div>
                    <h3 className="text-gray-400 font-medium text-sm">Vehículos Registrados</h3>
                    <p className="text-3xl font-bold text-white mt-1">{vehicleCount}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:bg-white/10 transition duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                            <Bell className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">HOY</span>
                    </div>
                    <h3 className="text-gray-400 font-medium text-sm">Notificaciones Nuevas</h3>
                    <p className="text-3xl font-bold text-white mt-1">{notificationCount}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl hover:bg-white/10 transition duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Activity className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">TOTAL</span>
                    </div>
                    <h3 className="text-gray-400 font-medium text-sm">Interacciones</h3>
                    <p className="text-3xl font-bold text-white mt-1">{totalInteractions}</p>
                </div>
            </div>

            {/* Quick Actions / Recent */}
            <h3 className="text-xl font-bold text-white mt-8 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition text-left group">
                    <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Plus className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">Registrar Nuevo Vehículo</h4>
                        <p className="text-sm text-gray-400">Agrega un auto a tu flota personal.</p>
                    </div>
                </button>
            </div>
        </div>
    )
}
