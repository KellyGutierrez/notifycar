"use client"

import { useState } from "react"
import { Settings, Shield, Bell, Globe, Database, Save, Loader2, Power, Lock, Mail, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [settings, setSettings] = useState({
        systemName: "NotifyCar",
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        pushNotifications: false,
        requireEmailVerification: true,
        maxVehiclesPerUser: "5",
    })

    const handleToggle = (key: keyof typeof settings) => {
        if (typeof settings[key] === 'boolean') {
            setSettings({ ...settings, [key]: !settings[key] })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Configuración del Sistema</h1>
                <p className="text-gray-400 mt-1">Control global de las funcionalidades de NotifyCar.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation / Categories */}
                <div className="lg:col-span-1 space-y-4">
                    <nav className="space-y-1">
                        {[
                            { name: "General", icon: Settings, active: true },
                            { name: "Seguridad", icon: Lock, active: false },
                            { name: "Notificaciones", icon: Bell, active: false },
                            { name: "Base de Datos", icon: Database, active: false },
                        ].map((item) => (
                            <button
                                key={item.name}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                    item.active
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-950/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-red-400">
                            <Shield className="h-5 w-5" />
                            <h4 className="font-bold text-sm uppercase tracking-wider">Zona de Peligro</h4>
                        </div>
                        <p className="text-xs text-gray-500">Acciones que afectan a todo el sistema.</p>
                        <button className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold transition-all">
                            Reiniciar Caché de Servidor
                        </button>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/10 bg-white/[0.02]">
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Ajustes Generales</h3>
                            <p className="text-sm text-gray-400 mt-1">Configuración básica de la instancia.</p>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Nombre del Sistema</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={settings.systemName}
                                            onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Funcionalidades</h4>

                                <div className="space-y-4">
                                    {[
                                        { id: 'maintenanceMode' as const, name: "Modo Mantenimiento", desc: "Desactiva el acceso a todos los usuarios excepto admins.", icon: Power },
                                        { id: 'allowRegistration' as const, name: "Permitir Registros", desc: "Habilita la creación de nuevas cuentas.", icon: Users },
                                        { id: 'emailNotifications' as const, name: "Notificaciones por Email", desc: "Envía alertas automáticas a los correos registrados.", icon: Mail },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between group p-4 rounded-2xl hover:bg-white/5 transition-all">
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                                    settings[item.id] ? "bg-cyan-500/10 text-cyan-400" : "bg-white/5 text-gray-500"
                                                )}>
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{item.name}</h5>
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(item.id)}
                                                className={cn(
                                                    "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                                                    settings[item.id] ? "bg-cyan-500" : "bg-white/10"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-300",
                                                    settings[item.id] ? "translate-x-6" : "translate-x-0"
                                                )} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
                            <p className={cn(
                                "text-sm font-bold transition-all duration-300",
                                success ? "text-cyan-500 opacity-100" : "opacity-0"
                            )}>
                                Configuración actualizada
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-cyan-900/20 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                Aplicar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
