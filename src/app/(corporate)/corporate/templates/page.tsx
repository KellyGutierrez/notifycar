"use client"

import { useState, useEffect } from "react"
import { Plus, MessageSquare, Trash2, Edit2, Zap, Loader2, Search, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CorporateTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        content: "",
        category: "COMMON",
        vehicleType: "ALL"
    })

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/corporate/templates")
            if (res.ok) {
                const data = await res.json()
                setTemplates(data)
            }
        } catch (error) {
            console.error("Error fetching templates:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingTemplate
                ? `/api/corporate/templates`
                : "/api/corporate/templates"

            const method = editingTemplate ? "PUT" : "POST"
            const body = editingTemplate
                ? { ...formData, id: editingTemplate.id }
                : formData

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                fetchTemplates()
                setIsModalOpen(false)
                setEditingTemplate(null)
                setFormData({ name: "", content: "", category: "COMMON", vehicleType: "ALL" })
            }
        } catch (error) {
            console.error("Error saving template:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este mensaje?")) return
        try {
            const res = await fetch(`/api/corporate/templates?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setTemplates(prev => prev.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error("Error deleting template:", error)
        }
    }

    const handleEdit = (t: any) => {
        setEditingTemplate(t)
        setFormData({
            name: t.name,
            content: t.content,
            category: t.category,
            vehicleType: t.vehicleType
        })
        setIsModalOpen(true)
    }

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Mis Mensajes Corporativos
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Personaliza los mensajes que tus conductores recibirán.
                        {" "}<a href="/corporate/settings" className="text-indigo-400 hover:underline text-xs ml-2 font-bold uppercase tracking-tighter">⚙️ Configurar visibilidad global</a>
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingTemplate(null)
                        setFormData({ name: "", content: "", category: "COMMON", vehicleType: "ALL" })
                        setIsModalOpen(true)
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/30 active:scale-95 group"
                >
                    <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                    <span>NUEVO MENSAJE</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative group max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar entre tus mensajes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                />
            </div>

            {/* Templates List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
                    <p className="text-gray-500 font-bold animate-pulse">Cargando tus mensajes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                            <MessageSquare className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold text-xl">No hay mensajes disponibles.</p>
                            <p className="text-gray-600">Comienza creando tu primer mensaje personalizado.</p>
                        </div>
                    ) : (
                        filteredTemplates.map((t) => (
                            <div key={t.id} className="relative overflow-hidden bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.06] transition-all group hover:border-indigo-500/30">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -z-10" />

                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors font-mono">{t.name}</h3>
                                            <span className={cn(
                                                "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                                                t.category === 'URGENT'
                                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                                            )}>
                                                {t.category === 'URGENT' ? 'URGENTE' : 'COMÚN'}
                                            </span>
                                            {t.vehicleType !== 'ALL' && (
                                                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest">
                                                    {t.vehicleType}
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-black/60 p-6 rounded-3xl border border-white/5 relative">
                                            <p className="text-gray-300 text-lg leading-relaxed italic font-medium">
                                                "{t.content}"
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                            <div className="h-1 w-1 rounded-full bg-indigo-500" />
                                            <span>Estado: {t.isActive ? 'Activo' : 'Inactivo'}</span>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-end gap-3 shrink-0">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-2xl transition-all text-gray-400 font-bold text-sm border border-white/5"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            <span>EDITAR</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="flex items-center gap-2 px-5 py-3 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl transition-all text-red-500/70 hover:text-white font-bold text-sm border border-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>ELIMINAR</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                                    {editingTemplate ? "Actualizar Mensaje" : "Nuevo Mensaje Personalizado"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                                    <X className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Título del Mensaje</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-white placeholder:text-gray-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Aviso de pago pendiente"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Contenido (WhatsApp)</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-medium text-white placeholder:text-gray-700 leading-relaxed"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Ej: Hola {name}, te recordamos que..."
                                    />
                                    <div className="flex gap-2 p-2">
                                        {["{name}", "{plate}"].map(tag => (
                                            <span key={tag} className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg border border-indigo-500/20 font-mono font-bold">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Categoría</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-white appearance-none cursor-pointer"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="COMMON" className="bg-gray-900 font-bold">Común / Informativo</option>
                                            <option value="URGENT" className="bg-gray-900 font-bold">Urgente / Alerta</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Tipo de Vehículo</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-white appearance-none cursor-pointer"
                                            value={formData.vehicleType}
                                            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        >
                                            <option value="ALL" className="bg-gray-900 font-bold">Todos</option>
                                            <option value="CAR" className="bg-gray-900 font-bold">Carros / Taxis</option>
                                            <option value="MOTORCYCLE" className="bg-gray-900 font-bold">Motos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-8 py-5 rounded-2xl font-black bg-white/5 hover:bg-white/10 transition-all text-gray-400"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-8 py-5 rounded-2xl font-black bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 text-white disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}
                                        <span>GUARDAR MENSAJE</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
