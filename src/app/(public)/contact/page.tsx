"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Send, ArrowLeft, MessageSquare, Shield, CheckCircle2, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setStatus("success")
            } else {
                setStatus("error")
            }
        } catch (error) {
            console.error("Error sending contact form:", error)
            setStatus("error")
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-brand/30">
            {/* Header / Nav */}
            <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group transition-all">
                        <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-brand transition-colors" />
                        <span className="font-bold text-gray-400 group-hover:text-white transition-colors">Volver al Inicio</span>
                    </Link>
                    <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
                        <img src="/logo_white.png" alt="NotifyCar" className="h-10 w-auto" />
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Contact Info */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                                Ponte en <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">Contacto</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                                Estamos aquí para escucharte. Si tienes dudas, sugerencias o necesitas soporte comercial, no dudes en escribirnos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Address */}
                            <div className="group flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand/30 transition-all hover:translate-x-2">
                                <div className="p-4 bg-brand/10 rounded-2xl">
                                    <MapPin className="h-6 w-6 text-brand" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Dirección</p>
                                    <p className="font-bold text-gray-200">Cra 27 # 67 – 11 Manizales / Caldas / Colombia</p>
                                </div>
                            </div>

                            {/* Email */}
                            <a href="mailto:hola@notifycar.com" className="group flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all hover:translate-x-2">
                                <div className="p-4 bg-cyan-400/10 rounded-2xl">
                                    <Mail className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</p>
                                    <p className="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">hola@notifycar.com</p>
                                </div>
                            </a>

                            {/* Phone */}
                            <a href="tel:+573008188626" className="group flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-400/30 transition-all hover:translate-x-2">
                                <div className="p-4 bg-emerald-400/10 rounded-2xl">
                                    <Phone className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Teléfono</p>
                                    <p className="font-bold text-gray-200 group-hover:text-emerald-400 transition-colors">+57 3008188626</p>
                                </div>
                            </a>
                        </div>

                        <div className="pt-8 border-t border-white/10 flex items-center gap-2">
                            <img src="/rowell_logo.jpg" alt="Rowell" className="h-4 w-4 rounded-sm grayscale opacity-50" />
                            <p className="text-gray-500 italic font-bold">Una plataforma Rowell</p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-brand/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative bg-gray-900/50 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                            {status === "success" ? (
                                <div className="py-20 text-center space-y-6 animate-in zoom-in duration-500">
                                    <div className="h-24 w-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black uppercase tracking-tight">¡Mensaje Enviado!</h3>
                                        <p className="text-gray-400">Te responderemos lo más pronto posible.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setStatus("idle")
                                            setFormData({ name: "", email: "", subject: "", message: "" })
                                        }}
                                        className="text-cyan-400 font-bold hover:underline"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold mb-6 italic uppercase tracking-tight flex items-center gap-3">
                                            <MessageSquare className="h-6 w-6 text-brand" />
                                            Escríbenos
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Nombre</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Tu nombre completo"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-brand/50 transition-all font-medium text-sm"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Correo Electrónico</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="ejemplo@correo.com"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-brand/50 transition-all font-medium text-sm"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Asunto</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="¿En qué podemos ayudarte?"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-brand/50 transition-all font-medium text-sm"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Mensaje</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="Escribe aquí tu mensaje detallado..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-brand/50 transition-all font-medium text-sm resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    {status === "error" && (
                                        <p className="text-red-500 text-xs font-bold text-center italic">⚠️ Error al enviar el mensaje. Inténtalo de nuevo.</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full bg-brand hover:bg-brand-dark text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-brand/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
                                    >
                                        {status === "submitting" ? (
                                            <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Enviar Mensaje
                                                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-3 justify-center pt-4">
                                        <Shield className="h-4 w-4 text-gray-600" />
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Cumplimos con la Ley de Protección de Datos</p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Minimalista */}
            <footer className="py-10 border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} NotifyCar &bull; Todos los derechos reservados
                    </p>
                </div>
            </footer>
        </div>
    )
}
