import { db } from "@/lib/db"
import { Car, User, Hash, Upload } from "lucide-react"
import { VehicleFilters } from "./VehicleFilters"
import ExportVehiclesButton from "./ExportVehiclesButton"
import Link from "next/link"
import { Prisma } from "@prisma/client"

interface PageProps {
    searchParams: Promise<{
        search?: string
        startDate?: string
        endDate?: string
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
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })
}

export default async function AdminVehiclesPage({ searchParams }: PageProps) {
    const { search, startDate, endDate } = await searchParams
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

            {/* Filtros */}
            <VehicleFilters />

            {/* Grid de Vehículos */}
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
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Registrado el</p>
                                    <p className="text-xs text-cyan-400 font-mono">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight uppercase">
                                    {vehicle.brand} <span className="font-light text-cyan-500/80">{vehicle.model}</span>
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                                        <Hash className="h-3 w-3 text-cyan-500" />
                                        Color: {vehicle.color || "N/A"}
                                    </span>
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

                {vehicles.length === 0 && (
                    <div className="col-span-full py-24 bg-white/[0.02] border-2 border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                            <Car className="h-10 w-10 text-gray-700 animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold text-gray-400">No se encontraron vehículos</p>
                            <p className="text-sm text-gray-600">Intenta ajustar los filtros de búsqueda.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
