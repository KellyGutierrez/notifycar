"use client"

import { useState, useEffect } from "react"
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    MessageSquare, Car, Bike, Send, Calendar, AlertTriangle,
    Loader2, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        vehicleType: "ALL",
        category: "COMMON",
        type: "APP",
        isActive: true
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchTemplates()
    }, [])

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/admin/templates")
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
                type: template.type,
                isActive: template.isActive
            })
        } else {
            setEditingTemplate(null)
            setFormData({
                name: "",
                content: "",
                vehicleType: "ALL",
                category: "COMMON",
                type: "APP",
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
                ? `/api/admin/templates/${editingTemplate.id}`
                : "/api/admin/templates"

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
        if (!confirm("¿Estás seguro de eliminar esta plantilla?")) return

        try {
            const res = await fetch(`/api/admin/templates/${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setTemplates(prev => prev.filter(t => t.id !== id))
            }
        } catch (error) {
            console.error("Error deleting template:", error)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Mensajes</h1>
                    <p className="text-gray-400">Personaliza los mensajes predefinidos y crea plantillas de temporada.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Mensaje
                </button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={cn(
                                "group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all hover:border-cyan-500/30 flex flex-col justify-between h-full",
                                !template.isActive && "opacity-60 grayscale"
                            )}
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            template.category === "SEASONAL" ? "bg-purple-500/10" :
                                                template.category === "URGENT" ? "bg-red-500/10" : "bg-cyan-500/10"
                                        )}>
                                            <MessageSquare className={cn(
                                                "h-5 w-5",
                                                template.category === "SEASONAL" ? "text-purple-400" :
                                                    template.category === "URGENT" ? "text-red-400" : "text-cyan-400"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{template.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    {template.category}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-gray-700" />
                                                <div className="flex items-center gap-1">
                                                    {template.vehicleType === "ALL" && <span className="text-[10px] text-gray-400">Todos</span>}
                                                    {template.vehicleType === "CAR" && <Car className="h-3 w-3 text-gray-400" />}
                                                    {template.vehicleType === "MOTORCYCLE" && <Bike className="h-3 w-3 text-gray-400" />}
                                                    {template.vehicleType === "ELECTRIC" && <Zap className="h-3 w-3 text-green-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!template.isActive && (
                                        <span className="bg-white/10 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Inactivo</span>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm italic leading-relaxed">
                                    "{template.content}"
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleOpenModal(template)}
                                    className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                    title="Editar"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Eliminar"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Edición/Creación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

                    <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                {editingTemplate ? <Edit2 className="h-6 w-6 text-cyan-400" /> : <Plus className="h-6 w-6 text-cyan-400" />}
                                {editingTemplate ? "Editar Mensaje" : "Nuevo Mensaje"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Nombre Identificador</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: Luces encendidas"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Contenido de la Notificación</label>
                                    <textarea
                                        required
                                        placeholder="Escribe el mensaje que recibirá el usuario..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium min-h-[100px]"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Vehículo</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium appearance-none cursor-pointer"
                                            value={formData.vehicleType}
                                            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        >
                                            <option value="ALL">Para Todos</option>
                                            <option value="CAR" className="bg-gray-900">Solo Autos</option>
                                            <option value="MOTORCYCLE" className="bg-gray-900">Solo Motos</option>
                                            <option value="ELECTRIC" className="bg-gray-900">Solo Eléctricos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">Categoría</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium appearance-none cursor-pointer"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="COMMON" className="bg-gray-900">Común</option>
                                            <option value="URGENT" className="bg-gray-900">Urgente</option>
                                            <option value="SEASONAL" className="bg-gray-900">Temporada</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        className="h-5 w-5 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="isActive" className="text-sm font-bold cursor-pointer">Mensaje activo en el sistema</label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar Cambios"}
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
