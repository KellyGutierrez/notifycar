"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { User, Mail, Phone, Globe, Shield, Bell, Save, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const { data: session, update } = useSession()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState<"perfil" | "seguridad" | "notificaciones">("perfil")

    const user = session?.user as any

    // Form state for profile
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phonePrefix: user?.phonePrefix || "",
        phoneNumber: user?.phoneNumber || "",
        country: user?.country || "",
    })

    // Form state for security
    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Preferences state
    const [preferences, setPreferences] = useState({
        emailAlerts: true,
        whatsappAlerts: false,
        pushNotifications: true,
        marketing: false,
    })

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                await update()
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            } else {
                alert("Error al actualizar el perfil")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }
        setLoading(true)
        setSuccess(false)

        try {
            const res = await fetch("/api/profile/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: securityData.currentPassword,
                    newPassword: securityData.newPassword
                })
            })

            if (res.ok) {
                setSuccess(true)
                setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                setTimeout(() => setSuccess(false), 3000)
            } else {
                const errorText = await res.text()
                alert(errorText || "Error al actualizar la contraseña")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        } finally {
            setLoading(false)
        }
    }

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Configuración</h1>
                <p className="text-gray-400 mt-1">Gestiona tu perfil y preferencias de cuenta.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                            {formData.name.charAt(0) || "U"}
                        </div>
                        <h2 className="text-xl font-bold text-white">{formData.name || "Usuario"}</h2>
                        <p className="text-sm text-gray-500">{formData.email}</p>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { id: "perfil", name: "Perfil", icon: User },
                            { id: "seguridad", name: "Seguridad", icon: Shield },
                            { id: "notificaciones", name: "Notificaciones", icon: Bell },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id as any)
                                    setSuccess(false)
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                    activeTab === item.id
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    {activeTab === "perfil" && (
                        <form onSubmit={handleProfileSubmit} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-lg font-semibold text-white">Información Personal</h3>
                                <p className="text-sm text-gray-400 mt-1">Actualiza tus datos de contacto básicos.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-500 cursor-not-allowed opacity-60 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Prefijo</label>
                                        <input
                                            type="text"
                                            value={formData.phonePrefix}
                                            onChange={(e) => setFormData({ ...formData, phonePrefix: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Teléfono</label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">País</label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                                <p className={cn("text-xs font-bold transition-all", success ? "text-green-400 opacity-100" : "opacity-0")}>¡Guardado!</p>
                                <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Guardar Perfil
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "seguridad" && (
                        <form onSubmit={handlePasswordSubmit} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-lg font-semibold text-white">Seguridad de la Cuenta</h3>
                                <p className="text-sm text-gray-400 mt-1">Cambia tu contraseña para mantener tu cuenta segura.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            required
                                            value={securityData.currentPassword}
                                            onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400 ml-1">Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                value={securityData.newPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400 ml-1">Confirmar Nueva Contraseña</label>
                                            <input
                                                type="password"
                                                required
                                                value={securityData.confirmPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                                <p className={cn("text-xs font-bold transition-all", success ? "text-green-400 opacity-100" : "opacity-0")}>¡Contraseña actualizada!</p>
                                <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Cambiar Contraseña
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === "notificaciones" && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-lg font-semibold text-white">Preferencias de Notificación</h3>
                                <p className="text-sm text-gray-400 mt-1">Elige cómo quieres recibir las alertas de tus vehículos.</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { id: "emailAlerts" as const, name: "Alertas por Email", desc: "Recibir un correo cuando alguien notifique sobre tu vehículo.", icon: Mail },
                                    { id: "whatsappAlerts" as const, name: "Alertas por WhatsApp", desc: "Notificaciones directas a tu móvil (Próximamente).", icon: Phone, disabled: true },
                                    { id: "pushNotifications" as const, name: "Notificaciones Push", desc: "Avisos en tiempo real en tu navegador.", icon: Bell },
                                ].map((item) => (
                                    <div key={item.id} className={cn("flex items-center justify-between p-4 rounded-xl transition-all", item.disabled ? "opacity-50 grayscale" : "hover:bg-white/5")}>
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-white">{item.name}</h5>
                                                <p className="text-xs text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            disabled={item.disabled}
                                            onClick={() => togglePreference(item.id)}
                                            className={cn(
                                                "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                                                preferences[item.id] ? "bg-green-500" : "bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
                                                preferences[item.id] ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-white/[0.02] border-t border-white/10">
                                <button
                                    onClick={() => {
                                        setSuccess(true)
                                        setTimeout(() => setSuccess(false), 3000)
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold transition-all border border-green-500/20"
                                >
                                    Guardar Preferencias
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
