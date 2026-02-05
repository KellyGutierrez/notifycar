"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit2, Trash2, Building2, Loader2, MessageSquare, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminOrganizationsPage() {
    const [organizations, setOrganizations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOrg, setEditingOrg] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        type: "PARKING",
        isActive: true,
        messageWrapper: ""
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchOrganizations()
    }, [])

    const fetchOrganizations = async () => {
        try {
            const res = await fetch("/api/admin/organizations")
            const data = await res.json()
            setOrganizations(data)
        } catch (error) {
            console.error("Error fetching organizations:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (org: any = null) => {
        if (org) {
            setEditingOrg(org)
            setFormData({
                name: org.name,
                type: org.type,
                isActive: org.isActive,
                messageWrapper: org.messageWrapper || ""
            })
        } else {
            setEditingOrg(null)
            setFormData({
                name: "",
                type: "PARKING",
                isActive: true,
                messageWrapper: ""
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = editingOrg
                ? `/api/admin/organizations/${editingOrg.id}`
                : "/api/admin/organizations"

            const res = await fetch(url, {
                method: editingOrg ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                fetchOrganizations()
                setIsModalOpen(false)
            }
        } catch (error) {
            console.error("Error saving organization:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta organización? Todos los usuarios y mensajes vinculados se verán afectados.")) return

        try {
            const res = await fetch(`/api/admin/organizations/${id}`, { method: "DELETE" })
            if (res.ok) {
                setOrganizations(prev => prev.filter(o => o.id !== id))
            }
        } catch (error) {
            console.error("Error deleting organization:", error)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organizaciones y Roles</h1>
                    <p className="text-gray-400">Gestiona parkings, zonas azules y flotas comerciales.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Nueva Organización
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <div key={org.id} className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-cyan-500/10">
                                            <Building2 className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{org.name}</h3>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{org.type}</span>
                                        </div>
                                    </div>
                                    {org.isActive ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                                </div>

                                <div className="flex gap-4">
                                    <div className="text-xs text-gray-400">
                                        <span className="font-bold text-white block">{org._count.users}</span> Usuarios
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        <span className="font-bold text-white block">{org._count.templates}</span> Plantillas
                                    </div>
                                </div>

                                {org.messageWrapper && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                        <MessageSquare className="h-3 w-3 text-emerald-400" />
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Wrapper Personalizado</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                                <button onClick={() => handleOpenModal(org)} className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all" title="Editar">
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(org.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Eliminar">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6">{editingOrg ? "Editar Organización" : "Nueva Organización"}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">Nombre</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium text-white"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400">Tipo</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium appearance-none cursor-pointer text-white"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="PARKING" className="bg-gray-900">Parking</option>
                                            <option value="BLUE_ZONE" className="bg-gray-900">Zonas Azules</option>
                                            <option value="FLEET" className="bg-gray-900">Flota comercial</option>
                                            <option value="OTHER" className="bg-gray-900">Otros</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 flex items-center justify-between">
                                        WhatsApp Layout Personalizado (Wrapper)
                                        <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">Opcional</span>
                                    </label>
                                    <textarea
                                        rows={8}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-mono text-xs leading-relaxed text-white"
                                        placeholder="Deja vacío para usar el global..."
                                        value={formData.messageWrapper}
                                        onChange={(e) => setFormData({ ...formData, messageWrapper: e.target.value })}
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {["{{name}}", "{{plate}}", "{{raw_message}}", "{{NUM_POLICIA}}", "{{NUM_TRANSITO}}", "{{NUM_EMERGENCIAS}}"].map(tag => (
                                            <span key={tag} className="text-[10px] bg-white/5 text-cyan-500 px-1.5 py-0.5 rounded border border-white/5 font-mono">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        className="h-5 w-5 rounded border-white/10 bg-white/5 text-cyan-500"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="isActive" className="text-sm font-bold cursor-pointer text-white">Organización Activa</label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all text-white">Cancelar</button>
                                    <button type="submit" disabled={saving} className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-white">
                                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Guardar Organización"}
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
