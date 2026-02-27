"use client"

import { useState, useEffect } from "react"
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

    // State for phone verification
    const [originalPhone, setOriginalPhone] = useState({ prefix: "", number: "" })
    const [isPhoneVerified, setIsPhoneVerified] = useState(true)
    const [isSendingCode, setIsSendingCode] = useState(false)
    const [isConfirmingCode, setIsConfirmingCode] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [otpError, setOtpError] = useState("")

    const isPhoneChanged = formData.phonePrefix !== originalPhone.prefix || formData.phoneNumber !== originalPhone.number

    // Form state for security
    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Preferences state
    const [preferences, setPreferences] = useState({
        emailAlerts: true,
        whatsappAlerts: true,
        pushNotifications: true,
    })

    // Cargar datos reales desde el servidor al montar
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/profile")
                if (res.ok) {
                    const data = await res.json()
                    const initialData = {
                        name: data.name || "",
                        email: data.email || "",
                        phonePrefix: data.phonePrefix || "",
                        phoneNumber: data.phoneNumber || "",
                        country: data.country || "",
                    }
                    setFormData(initialData)
                    setOriginalPhone({ prefix: initialData.phonePrefix, number: initialData.phoneNumber })
                    setPreferences({
                        emailAlerts: data.emailNotifications ?? true,
                        whatsappAlerts: data.whatsappNotifications ?? true,
                        pushNotifications: true
                    })
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }
        fetchProfile()
    }, [])

    const handleSendOtp = async () => {
        if (!formData.phoneNumber || formData.phoneNumber.length < 7) {
            setOtpError("Ingresa un número válido")
            return
        }
        setIsSendingCode(true)
        setOtpError("")
        try {
            const res = await fetch("/api/auth/verify-phone/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phonePrefix: formData.phonePrefix,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email
                })
            })
            if (res.ok) {
                setShowOtpInput(true)
            } else {
                const text = await res.text()
                setOtpError(text || "Error al enviar código")
            }
        } catch (error) {
            setOtpError("Error de red")
        } finally {
            setIsSendingCode(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (verificationCode.length < 6) return
        setIsConfirmingCode(true)
        setOtpError("")
        try {
            const res = await fetch("/api/auth/verify-phone/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phonePrefix: formData.phonePrefix,
                    phoneNumber: formData.phoneNumber,
                    code: verificationCode
                })
            })
            if (res.ok) {
                setIsPhoneVerified(true)
                setShowOtpInput(false)
                setSuccess(true)
                setTimeout(() => setSuccess(false), 2000)
            } else {
                setOtpError("Código incorrecto")
            }
        } catch (error) {
            setOtpError("Error de validación")
        } finally {
            setIsConfirmingCode(false)
        }
    }

    useEffect(() => {
        if (isPhoneChanged) {
            setIsPhoneVerified(false)
        } else {
            setIsPhoneVerified(true)
            setShowOtpInput(false)
        }
    }, [formData.phoneNumber, formData.phonePrefix])

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isPhoneChanged && !isPhoneVerified) {
            alert("Debes verificar tu nuevo número de teléfono")
            return
        }
        setLoading(true)
        setSuccess(false)

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    emailNotifications: preferences.emailAlerts,
                    whatsappNotifications: preferences.whatsappAlerts
                })
            })

            if (res.ok) {
                await update()
                setOriginalPhone({ prefix: formData.phonePrefix, number: formData.phoneNumber })
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            } else {
                const errText = await res.text()
                alert(errText || "Error al actualizar el perfil")
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
                <h1 className="text-3xl font-bold text-white tracking-tight italic uppercase">Configuración</h1>
                <p className="text-gray-400 mt-1 font-medium italic">Gestiona tu perfil y preferencias de cuenta.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center backdrop-blur-xl shadow-2xl">
                        <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-green-500/20 rotate-3 transition-transform hover:rotate-0">
                            {formData.name.charAt(0) || "U"}
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none">{formData.name || "Usuario"}</h2>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2 bg-white/5 py-1.5 px-3 rounded-full inline-block border border-white/5">{formData.email}</p>
                    </div>

                    <nav className="space-y-2">
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
                                    "w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300",
                                    activeTab === item.id
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-lg shadow-green-500/5 translate-x-2"
                                        : "text-gray-500 hover:text-white hover:bg-white/5 hover:translate-x-1"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-green-400" : "text-gray-500")} />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    {activeTab === "perfil" && (
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 shadow-2xl backdrop-blur-3xl">
                            <div className="p-8 border-b border-white/10 bg-white/[0.02]">
                                <h3 className="text-xl font-black text-white uppercase italic leading-none">Información Personal</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-3">Actualiza tus datos de contacto básicos.</p>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Nombre Completo</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-bold placeholder:text-gray-700"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-700" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-gray-600 cursor-not-allowed font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Prefijo</label>
                                        <input
                                            type="text"
                                            value={formData.phonePrefix}
                                            onChange={(e) => setFormData({ ...formData, phonePrefix: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Teléfono</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                className={cn(
                                                    "w-full bg-black/20 border rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-bold",
                                                    isPhoneChanged && !isPhoneVerified ? "border-amber-500/50" : "border-white/10"
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">País</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Verification Flow */}
                                {isPhoneChanged && !isPhoneVerified && (
                                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4 animate-in zoom-in-95 duration-500">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-amber-500 uppercase tracking-widest leading-none">Acción Requerida</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Verifica tu nuevo número para guardar</p>
                                            </div>
                                        </div>

                                        {!showOtpInput ? (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={isSendingCode}
                                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/10"
                                            >
                                                {isSendingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Solicitar Código SMS"}
                                            </button>
                                        ) : (
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    placeholder="000000"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-green-500/30"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={isConfirmingCode || verificationCode.length < 6}
                                                    className="px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                                >
                                                    {isConfirmingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validar"}
                                                </button>
                                            </div>
                                        )}
                                        {otpError && <p className="text-[10px] text-red-500 font-bold uppercase text-center tracking-widest italic">{otpError}</p>}
                                    </div>
                                )}
                            </div>
                            <div className="p-8 bg-black/20 border-t border-white/10 flex items-center justify-between">
                                <p className={cn("text-[10px] font-black uppercase tracking-widest transition-all", success ? "text-green-400 opacity-100" : "opacity-0")}>¡Perfil Actualizado!</p>
                                <button
                                    type="submit"
                                    disabled={loading || (isPhoneChanged && !isPhoneVerified)}
                                    className="bg-green-600 hover:bg-green-700 disabled:opacity-30 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-xl shadow-green-600/20 transform hover:-translate-y-1 active:scale-95"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
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
                                    { id: "whatsappAlerts" as const, name: "Alertas por WhatsApp", desc: "Recibir avisos instantáneos en tu celular vía WhatsApp.", icon: Phone },
                                    { id: "pushNotifications" as const, name: "Notificaciones Push", desc: "Avisos en tiempo real en tu navegador.", icon: Bell },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-white/5">
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
