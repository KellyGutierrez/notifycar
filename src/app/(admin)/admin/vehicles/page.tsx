import { db } from "@/lib/db"
import { Car, User, Search, Filter, Hash } from "lucide-react"

async function getVehicles() {
    return await db.vehicle.findMany({
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })
}

export default async function AdminVehiclesPage() {
    const vehicles = await getVehicles()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Inventario de Vehículos</h1>
                    <p className="text-gray-400">Todos los vehículos registrados en la plataforma.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por placa..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all w-64 uppercase"
                        />
                    </div>
                </div>
            </div>

            {/* Grid de Vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Car className="h-16 w-16 text-cyan-400" />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="px-3 py-1 bg-cyan-600 text-white font-bold text-lg rounded-md shadow-lg shadow-cyan-900/20 tracking-wider">
                                    {vehicle.plate}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Registrado el</p>
                                    <p className="text-xs text-cyan-400">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Hash className="h-3 w-3" />
                                        Color: {vehicle.color || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 mt-4">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Propietario</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <User className="h-4 w-4 text-cyan-400" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-200 truncate">{vehicle.user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{vehicle.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {vehicles.length === 0 && (
                    <div className="col-span-full py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed flex flex-col items-center justify-center space-y-4">
                        <Car className="h-16 w-16 text-gray-600 animate-pulse" />
                        <p className="text-gray-400">No hay vehículos registrados en el sistema todavía.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
