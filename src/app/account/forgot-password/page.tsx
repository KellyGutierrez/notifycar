"use client"

import { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setMessage("")

        try {
            const res = await axios.post("/api/auth/forgot-password", { email })
            setMessage(res.data.message)
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al enviar el correo")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6">
                        <img src="/brand/horizontal-color.png" alt="NotifyCar" className="h-11 w-auto object-contain" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
                    </p>
                </div>

                {message ? (
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                        </div>
                        <p className="text-gray-700 font-medium">{message}</p>
                        <p className="text-gray-400 text-sm">Revisa tu bandeja de entrada y la carpeta de spam.</p>
                        <Link
                            href="/account/signin"
                            className="inline-flex items-center gap-2 text-brand font-semibold hover:underline text-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                                    placeholder="nombre@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-brand hover:bg-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Enviar enlace de recuperación"}
                        </button>

                        <div className="text-center">
                            <Link
                                href="/account/signin"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
