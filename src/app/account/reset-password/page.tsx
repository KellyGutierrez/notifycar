"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!token) {
            setError("Enlace inválido. Solicita uno nuevo.")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirm) {
            setError("Las contraseñas no coinciden")
            return
        }
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            return
        }

        setIsLoading(true)
        try {
            await axios.post("/api/auth/reset-password", { token, password })
            setSuccess(true)
            setTimeout(() => router.push("/account/signin"), 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al restablecer la contraseña")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6">
                        <img src="/brand/horizontal-color.png" alt="NotifyCar" className="h-20 w-auto object-contain" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
                    <p className="text-gray-500 text-sm mt-2">Elige una contraseña segura para tu cuenta</p>
                </div>

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                        </div>
                        <p className="text-gray-700 font-medium">¡Contraseña actualizada con éxito!</p>
                        <p className="text-gray-400 text-sm">Redirigiendo al inicio de sesión...</p>
                        <Loader2 className="animate-spin h-5 w-5 text-brand mx-auto" />
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2 border border-red-100">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                                    placeholder="Repite la contraseña"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full py-3.5 px-4 bg-brand hover:bg-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Guardar nueva contraseña"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
