"use client"

import { useState, useEffect } from "react"
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    MessageSquare, Car, Bike, Send, Calendar, AlertTriangle,
    Loader2, Zap, X, Save
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function InstitutionalTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        vehicleType: "ALL",
        category: "COMMON",
        isActive: true
    })
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/institutional/templates")
            const data = await res.json()
            setTemplates(data)
        } catch (error) {
            console.error("Error fetching templates:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (template: any = null) => {
        if (template) {
            setEditingTemplate(template)
            setFormData({
                name: template.name,
                content: template.content,
                vehicleType: template.vehicleType,
                category: template.category,
                isActive: template.isActive
            })
        } else {
            setEditingTemplate(null)
            setFormData({
                name: "",
                content: "",
                vehicleType: "ALL",
                category: "COMMON",
                isActive: true
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingTemplate
                ? `/api/institutional/templates/${editingTemplate.id}`
                : "/api/institutional/templates"

            const method = editingTemplate ? "PUT" : "POST"

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                fetchTemplates()
                setIsModalOpen(false)
            }
        } catch (error) {
            console.error("Error saving template:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta plantilla oficial?")) return

        try {
            const res = await fetch(`/api/institutional/templates/${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setTemplates(prev => prev.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error("Error deleting template:", error)
        }
    }

    const toggleStatus = async (template: any) => {
        try {
            console.log("Toggling template:", template.id, "to", !template.isActive)
            const res = await fetch(`/api/institutional/templates/${template.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isActive: !template.isActive
                })
            })

            if (res.ok) {
                console.log("Toggle success")
                fetchTemplates()
            } else {
                const errorText = await res.text()
                console.error("Toggle failed:", res.status, errorText)
                alert(`Error ${res.status}: ${errorText || 'No se pudo actualizar el estado'}`)
            }
        } catch (error) {
            console.error("Error toggling template status:", error)
            alert("Error de conexión al intentar activar/desactivar.")
        }
    }

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase italic bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Mensajes Predeterminados</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Gestiona los mensajes (botones) que tus operarios pueden enviar desde el link de bypass.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 uppercase tracking-wider"
                >
                    <Plus className="h-5 w-5" />
                    Nueva Plantilla
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar plantillas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                />
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className={cn(
                                "group p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all hover:border-emerald-500/30 flex flex-col justify-between h-full relative overflow-hidden",
                                !template.isActive && "opacity-60 grayscale shadow-none"
                            )}
                        >
                            {!template.isActive && (
                                <button
                                    onClick={() => toggleStatus(template)}
                                    className="absolute top-3 right-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-[8px] font-black px-2 py-1 rounded-full uppercase transition-all"
                                >
                                    Inactivo (Clic para activar)
                                </button>
                            )}
                            {template.isActive && (
                                <button
                                    onClick={() => toggleStatus(template)}
                                    className="absolute top-3 right-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-2 py-1 rounded-full uppercase transition-all opacity-0 group-hover:opacity-100"
                                >
                                    Activo (Clic para desactivar)
                                </button>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2.5 rounded-xl border",
                                            template.category === "URGENT" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                                template.category === "ADVICE" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                                    "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        )}>
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white uppercase tracking-tight leading-tight">{template.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                    {template.category}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-gray-700" />
                                                <div className="flex items-center gap-1">
                                                    {template.vehicleType === "ALL" && <span className="text-[9px] text-gray-500 font-bold uppercase">Todos</span>}
                                                    {template.vehicleType === "CAR" && <Car className="h-3 w-3 text-gray-500" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <p className="text-gray-400 text-xs italic leading-relaxed text-center">
                                        "{template.content}"
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => toggleStatus(template)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        template.isActive ? "text-emerald-500 hover:bg-emerald-500/10" : "text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10"
                                    )}
                                    title={template.isActive ? "Desactivar" : "Activar"}
                                >
                                    {template.isActive ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={() => handleOpenModal(template)}
                                    className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                    title="Editar"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Eliminar"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTemplates.length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                                <MessageSquare className="h-8 w-8 text-gray-600" />
                            </div>
                            <p className="text-gray-500 font-bold">No se encontraron plantillas.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Edición/Creación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

                    <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                    {editingTemplate ? <Edit2 className="h-6 w-6 text-emerald-500" /> : <Plus className="h-6 w-6 text-emerald-500" />}
                                    {editingTemplate ? "Editar Plantilla" : "Nueva Plantilla"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Título del Mensaje</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: TICKET VENCIDO"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-black uppercase"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Contenido de la Notificación</label>
                                    <textarea
                                        required
                                        placeholder="Escribe el mensaje..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-medium min-h-[120px] resize-none"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Tipo Vehículo</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all font-bold appearance-none cursor-pointer"
                                            value={formData.vehicleType}
                                            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        >
                                            <option value="ALL">TODOS</option>
                                            <option value="CAR" className="bg-gray-900">AUTO</option>
                                            <option value="MOTORCYCLE" className="bg-gray-900">MOTO</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Categoría</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-all font-bold appearance-none cursor-pointer"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="COMMON" className="bg-gray-900">COMÚN</option>
                                            <option value="URGENT" className="bg-gray-900">URGENTE</option>
                                            <option value="ADVICE" className="bg-gray-900">AVISO</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        className="h-5 w-5 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 accent-emerald-500"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="isActive" className="text-xs font-black uppercase text-gray-400 cursor-pointer">Activar mensaje en el link público</label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3"
                                    >
                                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                        {editingTemplate ? "Actualizar Plantilla" : "Crear Plantilla"}
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
