"use client"

import { useState, useEffect } from "react"
import { Users, Car, Mail, Calendar, MoreVertical, Search, Filter, Edit2, Trash2, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import UserEditModal from "@/components/UserEditModal"
import UserCreateModal from "@/components/UserCreateModal"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.")) {
            return
        }

        try {
            const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchUsers()
            } else {
                alert("Error al eliminar usuario")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        } finally {
            setActiveMenu(null)
        }
    }

    const handleEdit = (user: any) => {
        setSelectedUser(user)
        setIsEditModalOpen(true)
        setActiveMenu(null)
    }

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Close menu when clicking outside
    useEffect(() => {
        const handleClick = () => setActiveMenu(null)
        if (activeMenu) {
            window.addEventListener("click", handleClick)
        }
        return () => window.removeEventListener("click", handleClick)
    }, [activeMenu])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-white">
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-gray-400">Lista completa de usuarios registrados y sus vehículos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
                            <p className="text-gray-400 animate-pulse font-medium">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 font-sans">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Rol</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Vehículos</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">País</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Registro</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 shadow-inner">
                                                    {user.name?.charAt(0) || "U"}
                                                </div>
                                                <span className="font-semibold text-gray-200">{user.name || "Sin nombre"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                user.role === "ADMIN"
                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                                    <Car className="h-3 w-3" />
                                                    {user._count.vehicles}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-400">
                                                {user.country ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="uppercase">{user.country}</span>
                                                        <span className="text-gray-600">{user.phonePrefix}</span>
                                                    </span>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="relative inline-block text-left">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenu(activeMenu === user.id ? null : user.id);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                >
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>

                                                {activeMenu === user.id && (
                                                    <div className="absolute right-0 mt-1 w-44 bg-gray-800 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition border-b border-white/5"
                                                        >
                                                            <Edit2 className="h-4 w-4 text-cyan-400" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && filteredUsers.length === 0 && (
                        <div className="p-20 text-center space-y-3">
                            <Users className="h-12 w-12 text-gray-600 mx-auto" />
                            <p className="text-gray-400 font-medium">No se encontraron usuarios registrados.</p>
                        </div>
                    )}
                </div>
            </div>

            <UserEditModal
                isOpen={isEditModalOpen}
                user={selectedUser}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedUser(null)
                }}
                onUpdate={fetchUsers}
            />

            <UserCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={fetchUsers}
            />
        </div>
    )
}
