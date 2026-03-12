import { db } from "@/lib/db"
import { Car, User, Hash, Upload, Zap, List, LayoutGrid, Square, Mail, Eye } from "lucide-react"
import { VehicleFilters } from "./VehicleFilters"
import ExportVehiclesButton from "./ExportVehiclesButton"
import Link from "next/link"
import { Prisma } from "@/generated/client"
import { ViewSwitcher, ViewMode } from "@/components/ViewSwitcher"
import { cn } from "@/lib/utils"
import VehicleActions from "./VehicleActions"

interface PageProps {
    searchParams: Promise<{
        search?: string
        startDate?: string
        endDate?: string
        view?: ViewMode
    }>
}

async function getVehicles(search?: string, startDate?: string, endDate?: string) {
    const where: Prisma.VehicleWhereInput = {}

    if (search) {
        where.OR = [
            { plate: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
            { model: { contains: search, mode: 'insensitive' } }
        ]
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

    return await db.vehicle.findMany({
        where,
        include: {
            user: {
                select: { name: true, email: true, phonePrefix: true, phoneNumber: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })
}

export default async function AdminVehiclesPage({ searchParams }: PageProps) {
    const { search, startDate, endDate, view = "grid" } = await searchParams
    const vehicles = await getVehicles(search, startDate, endDate)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Inventario de Vehículos</h1>
                    <p className="text-gray-400">Gestiona y filtra todos los vehículos registrados.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportVehiclesButton data={vehicles} />
                    <Link
                        href="/admin/vehicles/import"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
                    >
                        <Upload className="h-5 w-5 text-cyan-400" />
                        Importar CSV
                    </Link>
                </div>
            </div>

            {/* Filtros y Selector de Vista */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full flex-1">
                    <VehicleFilters />
                </div>
                <ViewSwitcher currentView={view} />
            </div>

            {/* Content Area */}
            {vehicles.length === 0 ? (
                <div className="py-24 bg-white/[0.02] border-2 border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                        <Car className="h-10 w-10 text-gray-700 animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-xl font-bold text-gray-400">No se encontraron vehículos</p>
                        <p className="text-sm text-gray-600">Intenta ajustar los filtros de búsqueda.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* VISTA CUADRÍCULA (GRID) */}
                    {view === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.map((vehicle: any) => (
                                <div
                                    key={vehicle.id}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Car className="h-20 w-20 text-cyan-400 -rotate-12 translate-x-4 -translate-y-4" />
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="px-4 py-1.5 bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-black text-xl rounded-xl shadow-2xl shadow-cyan-900/40 tracking-widest border border-white/10 uppercase">
                                                {vehicle.plate}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Registrado el</p>
                                                    <p className="text-xs text-cyan-400 font-mono">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <VehicleActions vehicle={vehicle} view="grid" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight uppercase">
                                                {vehicle.brand} <span className="font-light text-cyan-500/80">{vehicle.model}</span>
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                                                    <Hash className="h-3 w-3 text-cyan-500" />
                                                    Color: {vehicle.color || "N/A"}
                                                </span>
                                                <span className={cn(
                                                    "flex items-center gap-1.5 px-2 py-1 rounded-full border",
                                                    vehicle.type === "TAXI" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                                                    vehicle.type === "MOTORCYCLE" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                                                    "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                )}>
                                                    {vehicle.type === "TAXI" ? "TAXI" : vehicle.type === "MOTORCYCLE" ? "MOTOCICLETA" : "PARTICULAR"}
                                                </span>
                                                {vehicle.isElectric && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <Zap className="h-3 w-3 fill-emerald-500" />
                                                        Eléctrico
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                                    <User className="h-5 w-5 text-cyan-400" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-100 truncate">{vehicle.user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate font-mono">{vehicle.user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* VISTA LISTA (TABLE) */}
                    {view === "list" && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-500">Placa</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-500">Vehículo</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-500">Propietario</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-500">Registro</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-500">Estado</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-cyan-500 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {vehicles.map((vehicle: any) => (
                                        <tr key={vehicle.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="inline-block px-3 py-1 bg-cyan-600/20 text-cyan-400 font-black rounded-lg border border-cyan-500/20 uppercase tracking-wider">
                                                    {vehicle.plate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-cyan-500/30 transition-all">
                                                        <Car className="h-4 w-4 text-cyan-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white uppercase">{vehicle.brand}</p>
                                                        <p className="text-xs text-gray-500 uppercase">{vehicle.model}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-200">{vehicle.user.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{vehicle.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-gray-400 font-mono">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={cn(
                                                        "text-[10px] font-black px-2 py-0.5 rounded-full border uppercase",
                                                        vehicle.type === "TAXI" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                                                        vehicle.type === "MOTORCYCLE" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                                                        "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                    )}>
                                                        {vehicle.type === "TAXI" ? "TAXI" : vehicle.type === "MOTORCYCLE" ? "MOTO" : "PARTICULAR"}
                                                    </span>
                                                    {vehicle.isElectric && (
                                                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                                                            <Zap className="h-2 w-2" />
                                                            Eléctrico
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <VehicleActions vehicle={vehicle} view="list" /> {/* Added VehicleActions */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* VISTA COMPACTA (ICONS) */}
                    {view === "compact" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {vehicles.map((vehicle: any) => (
                                <div
                                    key={vehicle.id}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all text-center group relative overflow-hidden flex flex-col items-center justify-center space-y-3"
                                >
                                    <div className="p-3 bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/5 group-hover:scale-110 transition-transform">
                                        <Car className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <VehicleActions vehicle={vehicle} view="compact" /> {/* Added VehicleActions */}
                                    <div>
                                        <p className="text-lg font-black text-white uppercase tracking-tighter leading-none">{vehicle.plate}</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase mt-1 truncate max-w-full italic">{vehicle.brand} {vehicle.model}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-cyan-500/0 hover:bg-cyan-500/5 transition-colors cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
