"use client"

import { useState, useEffect } from "react"
import { X, Loader2, User, Mail, Lock, Building2, Shield } from "lucide-react"

interface UserCreateModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: () => void
}

export default function UserCreateModal({ isOpen, onClose, onCreate }: UserCreateModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        organizationId: ""
    })
    const [organizations, setOrganizations] = useState<any[]>([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen) {
            fetchOrganizations()
            resetForm()
        }
    }, [isOpen])

    const fetchOrganizations = async () => {
        try {
            const res = await fetch("/api/admin/organizations")
            if (res.ok) {
                const data = await res.json()
                setOrganizations(data)
            }
        } catch (error) {
            console.error("Error fetching organizations:", error)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "USER",
            organizationId: ""
        })
        setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSaving(true)

        try {
            const payload = {
                ...formData,
                organizationId: formData.organizationId || null
            }

            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                onCreate()
                onClose()
                resetForm()
            } else {
                const data = await res.json()
                setError(data.error || "Error al crear usuario")
            }
        } catch (error) {
            console.error("Error creating user:", error)
            setError("Error de conexión")
        } finally {
            setSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Crear Nuevo Usuario</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Nombre Completo
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium text-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium text-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Contraseña
                            </label>
                            <input
                                required
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium text-white"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Rol
                            </label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium appearance-none cursor-pointer text-white"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="USER" className="bg-gray-900">Usuario Regular</option>
                                <option value="CORPORATE" className="bg-gray-900">Corporativo (Flota de Taxis)</option>
                                <option value="INSTITUTIONAL" className="bg-gray-900">Institucional (Zona Azul)</option>
                                <option value="ADMIN" className="bg-gray-900">Administrador</option>
                            </select>
                        </div>

                        {/* Organization (only for CORPORATE and INSTITUTIONAL) */}
                        {(formData.role === "CORPORATE" || formData.role === "INSTITUTIONAL") && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Organización
                                </label>
                                <select
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 transition-all font-medium appearance-none cursor-pointer text-white"
                                    value={formData.organizationId}
                                    onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                                >
                                    <option value="" className="bg-gray-900">Seleccionar organización...</option>
                                    {organizations
                                        .filter(org =>
                                            formData.role === "CORPORATE" ? org.type === "FLEET" : org.type === "INSTITUTIONAL"
                                        )
                                        .map(org => (
                                            <option key={org.id} value={org.id} className="bg-gray-900">
                                                {org.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-gray-500">
                                    {formData.role === "CORPORATE"
                                        ? "Selecciona la flota de taxis a la que pertenece"
                                        : "Selecciona la zona azul a la que pertenece"
                                    }
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    "Crear Usuario"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
