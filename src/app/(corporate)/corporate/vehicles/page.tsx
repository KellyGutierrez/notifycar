"use client"

import { useState, useEffect } from "react"
import { Car, User, Hash, Plus, Loader2, X, Search, Zap, Bike, Save, Edit2, Bell, MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CorporateVehiclesPage() {
    const [vehicles, setVehicles] = useState<any[]>([])
    const [templates, setTemplates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<any>(null)
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const [sending, setSending] = useState(false)
    const [notifSuccess, setNotifSuccess] = useState(false)
    const [search, setSearch] = useState("")

    // Notification form state
    const [notifData, setNotifData] = useState({
        templateId: "",
        content: "",
        recipientRole: "DRIVER" // Default to driver
    })

    // Form state
    const [formData, setFormData] = useState({
        plate: "",
        brand: "",
        model: "",
        color: "",
        type: "CAR",
        isElectric: false,
        ownerName: "",
        ownerPhone: "",
        driverName: "",
        driverPhone: ""
    })

    const fetchVehicles = async () => {
        try {
            const res = await fetch("/api/corporate/vehicles")
            if (res.ok) {
                const data = await res.json()
                setVehicles(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTemplates = async () => {
        try {
            const res = await fetch("/api/corporate/templates")
            if (res.ok) {
                const data = await res.json()
                setTemplates(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchVehicles()
        fetchTemplates()
    }, [])

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedVehicle) return

        setSending(true)
        setNotifSuccess(false)

        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleId: selectedVehicle.id,
                    templateId: notifData.templateId,
                    content: notifData.content,
                    recipientRole: notifData.recipientRole,
                    type: "WHATSAPP"
                })
            })

            if (res.ok) {
                setNotifSuccess(true)
                setTimeout(() => {
                    setIsNotificationModalOpen(false)
                    setNotifSuccess(false)
                    setNotifData({ templateId: "", content: "", recipientRole: "DRIVER" })
                }, 2000)
            } else {
                const errorText = await res.text()
                alert(errorText || "Error al enviar notificación")
            }
        } catch (error) {
            console.error(error)
            alert("Error de conexión")
        } finally {
            setSending(false)
        }
    }

    const handleOpenAddModal = (vehicle: any = null) => {
        if (vehicle) {
            setEditingVehicle(vehicle)
            setFormData({
                plate: vehicle.plate,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color || "",
                type: vehicle.type,
                isElectric: vehicle.isElectric,
                ownerName: vehicle.ownerName || "",
                ownerPhone: vehicle.ownerPhone || "",
                driverName: vehicle.driverName || "",
                driverPhone: vehicle.driverPhone || ""
            })
        } else {
            setEditingVehicle(null)
            setFormData({
                plate: "",
                brand: "",
                model: "",
                color: "",
                type: "CAR",
                isElectric: false,
                ownerName: "",
                ownerPhone: "",
                driverName: "",
                driverPhone: ""
            })
        }
        setIsAddModalOpen(true)
    }

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const method = editingVehicle ? "PUT" : "POST"
            const body = editingVehicle ? { ...formData, id: editingVehicle.id } : formData

            const res = await fetch("/api/corporate/vehicles", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            if (res.ok) {
                await fetchVehicles()
                setIsAddModalOpen(false)
                handleOpenAddModal(null)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    const filteredVehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                <p className="text-gray-400 font-medium">Cargando flota...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase italic bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Gestión de Flota</h1>
                    <p className="text-gray-400 font-medium">Administra los vehículos asignados a tu empresa.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/corporate/vehicles/import"
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
                    >
                        <Hash className="h-5 w-5 text-indigo-400" /> Importar CSV
                    </Link>
                    <button
                        onClick={() => {
                            setEditingVehicle(null)
                            setFormData({
                                plate: "", brand: "", model: "", color: "", type: "CAR",
                                isElectric: false, ownerName: "", ownerPhone: "", driverName: "", driverPhone: ""
                            })
                            setIsAddModalOpen(true)
                        }}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
                    >
                        <Plus className="h-5 w-5" /> Nuevo Vehículo
                    </button>
                </div>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar por placa, marca o modelo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                />
            </div>

            {/* Grid de Vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle: any) => (
                    <div
                        key={vehicle.id}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Car className="h-20 w-20 text-indigo-400 -rotate-12 translate-x-4 -translate-y-4" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="px-4 py-1.5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-black text-xl rounded-xl shadow-2xl shadow-indigo-900/40 tracking-widest border border-white/10 uppercase">
                                    {vehicle.plate}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedVehicle(vehicle)
                                            setIsNotificationModalOpen(true)
                                        }}
                                        className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-all group/btn"
                                        title="Enviar Notificación"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenAddModal(vehicle)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-all"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">
                                        {vehicle.brand} <span className="font-light text-indigo-500/80">{vehicle.model}</span>
                                    </h3>
                                    {vehicle.isElectric && <Zap className="h-4 w-4 text-yellow-400 fill-current" />}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                                        <Hash className="h-3 w-3 text-indigo-500" />
                                        Color: {vehicle.color || "N/A"}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                                        {vehicle.type === "MOTORCYCLE" ? <Bike className="h-3 w-3 text-indigo-500" /> : <Car className="h-3 w-3 text-indigo-500" />}
                                        {vehicle.type === "MOTORCYCLE" ? "Moto" : "Auto"}
                                    </span>
                                </div>

                                {/* Contact Info */}
                                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                    {vehicle.ownerName && (
                                        <div className="flex flex-col px-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-500">Propietario:</span>
                                                <span className="text-[10px] font-bold text-white">{vehicle.ownerName}</span>
                                            </div>
                                            {vehicle.ownerPhone && (
                                                <span className="text-[9px] text-indigo-400 font-mono text-right">{vehicle.ownerPhone}</span>
                                            )}
                                        </div>
                                    )}
                                    {vehicle.driverName && (
                                        <div className="flex flex-col px-2 mt-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-500">Conductor:</span>
                                                <span className="text-[10px] font-bold text-white">{vehicle.driverName}</span>
                                            </div>
                                            {vehicle.driverPhone && (
                                                <span className="text-[9px] text-indigo-400 font-mono text-right">{vehicle.driverPhone}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredVehicles.length === 0 && (
                    <div className="col-span-full py-24 bg-white/[0.02] border-2 border-white/5 rounded-3xl border-dashed flex flex-col items-center justify-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                            <Car className="h-10 w-10 text-gray-700 animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold text-gray-400">Sin vehículos en tu flota</p>
                            <p className="text-sm text-gray-600">Comienza agregando el primer vehículo de tu organización.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Registro / Edición */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x" />
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                                    {editingVehicle ? "Editar Vehículo" : "Registrar Vehículo"}
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddVehicle} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Info Básica */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Placa / Matrícula</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="ABC-123"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-black uppercase placeholder:text-gray-700"
                                                value={formData.plate}
                                                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Marca</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Mazda"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                                    value={formData.brand}
                                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Modelo</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="CX-30"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-gray-700"
                                                    value={formData.model}
                                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Tipo de Vehículo</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: "CAR" })}
                                                    className={cn(
                                                        "py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-2",
                                                        formData.type === "CAR" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                                                    )}
                                                >
                                                    <Car className="h-4 w-4" /> Auto / Taxi
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: "MOTORCYCLE" })}
                                                    className={cn(
                                                        "py-3 rounded-xl border font-bold text-xs uppercase transition-all flex items-center justify-center gap-2",
                                                        formData.type === "MOTORCYCLE" ? "bg-indigo-600 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                                                    )}
                                                >
                                                    <Bike className="h-4 w-4" /> Motocicleta
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info de Contacto */}
                                    <div className="space-y-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Información de Contacto</p>

                                        {/* Propietario */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Nombre Propietario</label>
                                                <input
                                                    type="text"
                                                    placeholder="Juan Propietario"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                                    value={formData.ownerName}
                                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Teléfono Propietario (WhatsApp)</label>
                                                <input
                                                    type="text"
                                                    placeholder="+573001234567"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                                    value={formData.ownerPhone}
                                                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        {/* Conductor */}
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Nombre Conductor</label>
                                                <input
                                                    type="text"
                                                    placeholder="Pedro Conductor"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                                    value={formData.driverName}
                                                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Teléfono Conductor (WhatsApp)</label>
                                                <input
                                                    type="text"
                                                    placeholder="+573007654321"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                                    value={formData.driverPhone}
                                                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={saving}
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    {editingVehicle ? "Actualizar Vehículo" : "Guardar Vehículo"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Notificación */}
            {isNotificationModalOpen && selectedVehicle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsNotificationModalOpen(false)} />
                    <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 animate-gradient-x" />
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                                        <Bell className="h-6 w-6 text-indigo-400" />
                                        Enviar Aviso
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Vehículo: <span className="text-white">{selectedVehicle.plate}</span>
                                    </p>
                                </div>
                                <button onClick={() => setIsNotificationModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSendNotification} className="space-y-6">
                                {/* Selección de Destinatario */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 italic">¿A quién enviar el mensaje?</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setNotifData({ ...notifData, recipientRole: "DRIVER" })}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all text-left group",
                                                notifData.recipientRole === "DRIVER" ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-900/40" : "bg-white/5 border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            <p className={cn("text-[10px] font-black uppercase mb-1", notifData.recipientRole === "DRIVER" ? "text-indigo-200" : "text-gray-500")}>Conductor</p>
                                            <p className={cn("text-xs font-bold truncate", notifData.recipientRole === "DRIVER" ? "text-white" : "text-gray-400")}>{selectedVehicle.driverName || "Configurar..."}</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNotifData({ ...notifData, recipientRole: "OWNER" })}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all text-left group",
                                                notifData.recipientRole === "OWNER" ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-900/40" : "bg-white/5 border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            <p className={cn("text-[10px] font-black uppercase mb-1", notifData.recipientRole === "OWNER" ? "text-indigo-200" : "text-gray-500")}>Propietario</p>
                                            <p className={cn("text-xs font-bold truncate", notifData.recipientRole === "OWNER" ? "text-white" : "text-gray-400")}>{selectedVehicle.ownerName || "Configurar..."}</p>
                                        </button>
                                    </div>
                                    {(!selectedVehicle.driverPhone && notifData.recipientRole === "DRIVER") || (!selectedVehicle.ownerPhone && notifData.recipientRole === "OWNER") ? (
                                        <p className="text-[10px] text-red-400 font-bold italic animate-pulse px-2">⚠️ El destinatario seleccionado no tiene número de WhatsApp configurado.</p>
                                    ) : null}
                                </div>

                                {/* Plantillas */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 italic">Seleccionar Plantilla</label>
                                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                        {templates.map((t: any) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setNotifData({ ...notifData, templateId: t.id, content: t.content })}
                                                className={cn(
                                                    "text-left p-3 rounded-xl border text-xs font-medium transition-all",
                                                    notifData.templateId === t.id ? "bg-white/10 border-indigo-500/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                )}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1 italic">Mensaje Personalizado</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-gray-700 resize-none font-medium"
                                        placeholder="Escribe el contenido del aviso..."
                                        value={notifData.content}
                                        onChange={(e) => setNotifData({ ...notifData, content: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    disabled={sending || notifSuccess || (!selectedVehicle.driverPhone && notifData.recipientRole === "DRIVER") || (!selectedVehicle.ownerPhone && notifData.recipientRole === "OWNER")}
                                    type="submit"
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                                        notifSuccess ? "bg-emerald-500 text-white shadow-emerald-900/40" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40 disabled:opacity-30"
                                    )}
                                >
                                    {sending ? <Loader2 className="h-6 w-6 animate-spin" /> : notifSuccess ? <CheckCircle2 className="h-6 w-6" /> : <Send className="h-6 w-6" />}
                                    {notifSuccess ? "¡ENVIADO!" : sending ? "ENVIANDO..." : "ENVIAR WHATSAPP"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
