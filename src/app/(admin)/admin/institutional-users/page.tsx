"use client"

import { useState, useEffect } from "react"
import { Search, Edit2, Trash2, ShieldAlert, Loader2, Building2, Mail, User, CheckCircle2, XCircle, Link as LinkIcon, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminInstitutionalUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users")
            const data = await res.json()
            // Filter only INSTITUTIONAL and CORPORATE users
            const institutionalUsers = data.filter((u: any) =>
                u.role === "INSTITUTIONAL" || u.role === "CORPORATE"
            )
            setUsers(institutionalUsers)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este usuario institucional?")) return

        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== id))
            }
        } catch (error) {
            console.error("Error deleting user:", error)
        }
    }

    const copyPublicLink = (token: string | null, userId: string) => {
        if (!token) {
            alert("Esta organización no tiene un token público configurado.")
            return
        }
        const link = `${window.location.origin}/zone/${token}`
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopiedId(userId)
                setTimeout(() => setCopiedId(null), 2000)
            })
            .catch(() => alert("Error al copiar el enlace"))
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.organization?.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Usuarios Institucionales y Corporativos</h1>
                    <p className="text-gray-400">Gestiona usuarios de Zonas Azules, Parkings y Flotas.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, email u organización..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                <ShieldAlert className="h-8 w-8 text-gray-600" />
                            </div>
                            <p className="text-gray-500 font-bold">No se encontraron usuarios institucionales.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "p-2.5 rounded-lg",
                                                user.role === "INSTITUTIONAL"
                                                    ? "bg-emerald-500/10"
                                                    : "bg-blue-500/10"
                                            )}>
                                                <ShieldAlert className={cn(
                                                    "h-5 w-5",
                                                    user.role === "INSTITUTIONAL"
                                                        ? "text-emerald-400"
                                                        : "text-blue-400"
                                                )} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight text-white">{user.name}</h3>
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    user.role === "INSTITUTIONAL"
                                                        ? "text-emerald-500"
                                                        : "text-blue-500"
                                                )}>
                                                    {user.role === "INSTITUTIONAL" ? "Institucional" : "Corporativo"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-400 font-mono text-xs">{user.email}</span>
                                        </div>

                                        {user.organization && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-400 font-medium">{user.organization.name}</span>
                                                <span className="text-[9px] text-gray-600 uppercase tracking-wider">
                                                    ({user.organization.type})
                                                </span>
                                            </div>
                                        )}

                                        {user.organization?.publicToken && (
                                            <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <LinkIcon className="h-3 w-3 text-emerald-500 shrink-0" />
                                                        <code className="text-[10px] text-emerald-400/80 truncate font-mono">
                                                            /zone/{user.organization.publicToken.substring(0, 20)}...
                                                        </code>
                                                    </div>
                                                    <button
                                                        onClick={() => copyPublicLink(user.organization.publicToken, user.id)}
                                                        className="shrink-0 p-1.5 rounded-md hover:bg-emerald-500/10 transition-all"
                                                        title="Copiar link público"
                                                    >
                                                        {copiedId === user.id ? (
                                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="h-4 w-4 text-gray-500" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => window.location.href = `/admin/users?edit=${user.id}`}
                                            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
