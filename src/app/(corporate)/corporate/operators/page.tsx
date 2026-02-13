"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Loader2, X, Shield, Mail, Lock, User, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CorporateOperatorsPage() {
    const [operators, setOperators] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const fetchOperators = async () => {
        try {
            const res = await fetch("/api/corporate/operators")
            if (res.ok) {
                const data = await res.json()
                setOperators(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOperators()
    }, [])

    const handleAddOperator = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch("/api/corporate/operators", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                fetchOperators()
                setIsAddModalOpen(false)
                setFormData({ name: "", email: "", password: "" })
            } else {
                alert("Error al crear operario. Verifica que el correo no esté en uso.")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const deleteOperator = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este operario?")) return
        try {
            const res = await fetch(`/api/corporate/operators?id=${id}`, {
                method: "DELETE"
            })
            if (res.ok) fetchOperators()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">Gestión de Operarios</h1>
                    <p className="text-gray-400">Administra el personal que puede enviar alertas en nombre de tu organización.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
                >
                    <Plus className="h-5 w-5" /> Nuevo Operario
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {operators.map((op) => (
                        <div key={op.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Shield className="h-4 w-4 text-indigo-500 opacity-20" />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xl">
                                    {op.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{op.name}</h3>
                                    <p className="text-xs text-gray-500 tracking-wider">OPERARIO</p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6 font-medium">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Mail className="h-4 w-4" /> {op.email}
                                </div>
                                <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest">
                                    Registrado: {new Date(op.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <button
                                onClick={() => deleteOperator(op.id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold active:scale-95"
                            >
                                <Trash2 className="h-4 w-4" /> Eliminar Acceso
                            </button>
                        </div>
                    ))}
                    {operators.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <Users className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No hay operarios registrados aún.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Creación */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0c0c0c] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-2xl font-black">Nuevo Operario</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddOperator} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="juan@empresa.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Contraseña de Acceso</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={saving}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : "Registrar Operario"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
