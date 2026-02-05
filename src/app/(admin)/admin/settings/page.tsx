"use client"

import { useState, useEffect } from "react"
import { Settings, Shield, Bell, Globe, Database, Save, Loader2, Power, Lock, Mail, Users, BarChart, Server, Key, Terminal, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

type SettingTab = "General" | "Seguridad" | "Correo" | "Notificaciones" | "Base de Datos"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [success, setSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState<SettingTab>("General")

    const [settings, setSettings] = useState({
        systemName: "NotifyCar",
        maintenanceMode: false,
        allowRegistration: true,
        gtmId: "",
        webhookUrl: "",
        // SMTP
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
        smtpFrom: "noreply@notifycar.com",
        // Toggles
        emailRegistration: true,
        emailRecovery: true,
        emailVehicles: true,
        messageWrapper: "",
    })

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                setSettings({
                    systemName: data.systemName || "NotifyCar",
                    maintenanceMode: data.maintenanceMode || false,
                    allowRegistration: data.allowRegistration || true,
                    gtmId: data.gtmId || "",
                    webhookUrl: data.webhookUrl || "",
                    smtpHost: data.smtpHost || "",
                    smtpPort: data.smtpPort || 587,
                    smtpUser: data.smtpUser || "",
                    smtpPass: data.smtpPass || "",
                    smtpFrom: data.smtpFrom || "noreply@notifycar.com",
                    emailRegistration: data.emailRegistration ?? true,
                    emailRecovery: data.emailRecovery ?? true,
                    emailVehicles: data.emailVehicles ?? true,
                    messageWrapper: data.messageWrapper || "",
                })
            })
            .catch(err => console.error("Error fetching settings:", err))
            .finally(() => setFetching(false))
    }, [])

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
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            })
            if (res.ok) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const [testingSmtp, setTestingSmtp] = useState(false)

    const handleTestSmtp = async () => {
        setTestingSmtp(true)
        try {
            const res = await fetch("/api/admin/settings/test-smtp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    smtpHost: settings.smtpHost,
                    smtpPort: settings.smtpPort,
                    smtpUser: settings.smtpUser,
                    smtpPass: settings.smtpPass,
                    smtpFrom: settings.smtpFrom
                })
            })
            if (res.ok) {
                alert("¡Conexión exitosa! Revisa tu bandeja de entrada.")
            } else {
                const err = await res.text()
                alert(`Error: ${err}`)
            }
        } catch (error) {
            alert("Error al intentar conectar con el servidor.")
        } finally {
            setTestingSmtp(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
            </div>
        )
    }

    const navigation = [
        { name: "General" as const, icon: Settings },
        { name: "Seguridad" as const, icon: Lock },
        { name: "Correo" as const, icon: Mail },
        { name: "Notificaciones" as const, icon: Bell },
        { name: "Base de Datos" as const, icon: Database },
    ]

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
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                    activeTab === item.name
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-950/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
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
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">{activeTab}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                {activeTab === "General" && "Configuración básica de la instancia."}
                                {activeTab === "Seguridad" && "Políticas de acceso y protección."}
                                {activeTab === "Correo" && "Servidor SMTP y plantillas de comunicación."}
                                {activeTab === "Notificaciones" && "Conectividad con proveedores externos (WhatsApp/Webhooks)."}
                                {activeTab === "Base de Datos" && "Gestión del almacenamiento de datos."}
                            </p>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* General Tab */}
                            {activeTab === "General" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Google Tag Manager (ID)</label>
                                            <div className="relative">
                                                <BarChart className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    placeholder="GTM-XXXXXXX"
                                                    value={settings.gtmId}
                                                    onChange={(e) => setSettings({ ...settings, gtmId: e.target.value })}
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
                                </>
                            )}

                            {/* Correo Tab */}
                            {activeTab === "Correo" && (
                                <div className="space-y-10">
                                    {/* SMTP Configuration */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Servidor SMTP</h4>
                                            <button
                                                type="button"
                                                onClick={handleTestSmtp}
                                                disabled={testingSmtp}
                                                className="text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 transition-all flex items-center gap-2"
                                            >
                                                {testingSmtp && <Loader2 className="h-3 w-3 animate-spin" />}
                                                Test de Conexión
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase">Host</label>
                                                <input
                                                    type="text"
                                                    value={settings.smtpHost}
                                                    onChange={e => setSettings({ ...settings, smtpHost: e.target.value })}
                                                    placeholder="smtp.mailtrap.io"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase">Puerto</label>
                                                <input
                                                    type="number"
                                                    value={settings.smtpPort}
                                                    onChange={e => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase">Usuario</label>
                                                <input
                                                    type="text"
                                                    value={settings.smtpUser}
                                                    onChange={e => setSettings({ ...settings, smtpUser: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase">Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={settings.smtpPass}
                                                    onChange={e => setSettings({ ...settings, smtpPass: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase">Email del Remitente (From)</label>
                                                <input
                                                    type="text"
                                                    value={settings.smtpFrom}
                                                    onChange={e => setSettings({ ...settings, smtpFrom: e.target.value })}
                                                    placeholder="NotifyCar <noreply@notifycar.com>"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Functional Toggles */}
                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Correos del Sistema</h4>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: 'emailRegistration' as const, name: "Emails de Registro", desc: "Envía la bienvenida y verificación a nuevos usuarios." },
                                                { id: 'emailRecovery' as const, name: "Recuperación de Contraseña", desc: "Permite a los usuarios resetear su acceso por mail." },
                                                { id: 'emailVehicles' as const, name: "Notificaciones de Vehículos", desc: "Copia por email de las alertas recibidas en el coche." },
                                            ].map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                                                    <div className="space-y-0.5">
                                                        <h5 className="text-sm font-bold text-gray-200">{item.name}</h5>
                                                        <p className="text-[10px] text-gray-500 italic">{item.desc}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(item.id)}
                                                        className={cn(
                                                            "w-10 h-5 rounded-full p-1 transition-all duration-300 relative",
                                                            settings[item.id] ? "bg-emerald-500" : "bg-white/10"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-3 w-3 rounded-full bg-white shadow-lg transition-transform duration-300",
                                                            settings[item.id] ? "translate-x-5" : "translate-x-0"
                                                        )} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Template Management (Placeholder for now) */}
                                    <div className="pt-8 border-t border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Plantillas (HTML)</h4>
                                            <button type="button" className="text-[10px] font-black text-white px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                                                <Terminal className="h-3 w-3" />
                                                Editor Avanzado
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {["Registro Bienvenida", "Recuperación Password", "Alerta Vehículo Recepción"].map(t => (
                                                <button key={t} type="button" className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 transition-all text-left group">
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{t}</span>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-black text-cyan-400 uppercase">Editar</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Seguridad Tab */}
                            {activeTab === "Seguridad" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Longitud Mínima Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                <input
                                                    type="number"
                                                    defaultValue="8"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Intentos Máximos de Login</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                <input
                                                    type="number"
                                                    defaultValue="5"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                                        <Shield className="h-6 w-6 text-amber-500 shrink-0" />
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            La configuración de seguridad avanzada está vinculada a las políticas globales del servidor. Cualquier cambio en la longitud del password afectará solo a los nuevos registros.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Notificaciones Tab */}
                            {activeTab === "Notificaciones" && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Terminal className="h-4 w-4 text-cyan-400" />
                                            Webhook URL (n8n / Automaciones)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="https://su-instancia-n8n.com/webhook/..."
                                                value={settings.webhookUrl}
                                                onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic">Esta URL recibirá un POST cada vez que se cree una notificación en el sistema.</p>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-cyan-400" />
                                                Formato Global de WhatsApp
                                            </label>
                                            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full uppercase">Editable</span>
                                        </div>
                                        <div className="relative group">
                                            <textarea
                                                rows={12}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-xs leading-relaxed"
                                                placeholder="Diseña tu mensaje aquí..."
                                                value={settings.messageWrapper}
                                                onChange={(e) => setSettings({ ...settings, messageWrapper: e.target.value })}
                                            />
                                            <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1 pointer-events-none group-focus-within:opacity-100 opacity-30 transition-opacity">
                                                {["{{plate}}", "{{raw_message}}", "{{NUM_POLICIA}}", "{{NUM_TRANSITO}}", "{{NUM_EMERGENCIAS}}"].map(tag => (
                                                    <span key={tag} className="text-[9px] bg-black/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-relaxed italic border-l-2 border-cyan-500/20 pl-3">
                                            Usa las etiquetas como <strong>{"{{mensaje}}"}</strong> para insertar el contenido dinámico. Este formato se usará para todos los avisos, a menos que la organización tenga uno propio.
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Proveedores Activos</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { name: "Resend (Email)", status: "Conectado", icon: Mail },
                                                { name: "Evolution API (WA)", status: "Desconectado", icon: Terminal },
                                            ].map((prov) => (
                                                <div key={prov.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <prov.icon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-bold text-gray-200">{prov.name}</span>
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                                                        prov.status === "Conectado" ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 bg-white/5"
                                                    )}>{prov.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Base de Datos Tab */}
                            {activeTab === "Base de Datos" && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/10">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-white uppercase tracking-tight">Estado de la Conexión</h4>
                                            <p className="text-xs text-cyan-400/60 font-mono tracking-tighter">postgresnoti@srv-captain--notify-bd:5432</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Activo</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 space-y-6">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mantenimiento de Datos</h4>
                                        <div className="space-y-3">
                                            <button type="button" className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group">
                                                <div className="flex items-center gap-3">
                                                    <Server className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-bold text-gray-200">Generar Respaldo Local (.sql)</span>
                                                </div>
                                                <span className="text-xs text-gray-500 group-hover:text-cyan-400">Ejecutar</span>
                                            </button>
                                            <button type="button" className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group">
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-bold text-gray-200">Limpiar Logs Antiguos ({">"}30 días)</span>
                                                </div>
                                                <span className="text-xs text-gray-500 group-hover:text-amber-400">Analizar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
