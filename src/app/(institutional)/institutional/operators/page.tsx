"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Loader2, X, Shield, Mail, Lock, User, Trash2, Upload, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function InstitutionalOperatorsPage() {
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
            const res = await fetch("/api/corporate/operators") // Reusing same API since it's org-based
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
        if (!confirm("¿Estás seguro de eliminar este operario de la institución?")) return
        try {
            const res = await fetch(`/api/corporate/operators?id=${id}`, {
                method: "DELETE"
            })
            if (res.ok) fetchOperators()
        } catch (error) {
            console.error(error)
        }
    }

    const exportToCSV = () => {
        const headers = ["Nombre", "Email", "Fecha Registro"]
        const rows = operators.map(op => [
            op.name,
            op.email,
            new Date(op.createdAt).toLocaleDateString()
        ])

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `operarios_inst_${new Date().toISOString().split('T')[0]}.csv`)
        link.click()
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic text-emerald-400">Equipo Institucional</h1>
                    <p className="text-gray-400 font-medium">Gestiona el personal oficial encargado de las alertas ciudadanas.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
                    >
                        <Download className="h-5 w-5 text-gray-500" /> Exportar
                    </button>
                    <Link
                        href="/institutional/operators/import"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
                    >
                        <Upload className="h-5 w-5 text-emerald-400" /> Importar CSV
                    </Link>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
                    >
                        <Plus className="h-5 w-5" /> Nuevo Operario
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {operators.map((op) => (
                        <div key={op.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.05] transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Shield className="h-4 w-4 text-emerald-500 opacity-20" />
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xl">
                                    {op.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{op.name}</h3>
                                    <p className="text-[10px] text-emerald-500/60 font-black tracking-widest">PERSONAL OFICIAL</p>
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
                            <p className="text-gray-500 font-medium">No hay personal institucional registrado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Creación */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0c0c0c] border border-emerald-500/20 p-8 rounded-[2.5rem] w-full max-w-md relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-2xl font-black text-white italic">Nuevo Operario Oficial</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
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
                                        placeholder="Ej: Agente Garcia"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Correo Institucional</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="agente@gob.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={saving}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : "Registrar Personal"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
