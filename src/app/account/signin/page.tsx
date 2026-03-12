"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, Shield } from "lucide-react"

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        setError("")
        try {
            await signIn("google", { callbackUrl: "/dashboard" })
        } catch {
            setError("Error al iniciar sesión con Google")
            setIsGoogleLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (res?.error) {
                setError("Credenciales inválidas")
            } else {
                const session = await getSession();
                const role = session?.user?.role;

                if (role === "ADMIN") {
                    router.push("/admin");
                } else if (role === "CORPORATE") {
                    router.push("/corporate");
                } else if (role === "INSTITUTIONAL") {
                    router.push("/institutional");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch {
            setError("Ocurrió un error inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-start sm:items-center justify-center bg-gray-50 px-4 py-8 sm:py-12 relative overflow-hidden pt-safe pb-24 sm:pb-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100 relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6 group">
                        <img
                            src="/brand/horizontal-color.png"
                            alt="NotifyCar"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h1>
                    <p className="text-gray-500 text-sm mt-2">Bienvenido de nuevo a la comunidad</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-right mt-1">
                            <Link href="/account/forgot-password" className="text-xs text-brand hover:underline font-medium">
                                ¿Olvidaste tu contraseña?
                            </Link>
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
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Ingresar"}
                    </button>

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-400 font-medium">o continúa con</span>
                        </div>
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-sm"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        Continuar con Google
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        ¿No tienes una cuenta? <Link href="/account/signup" className="text-brand font-bold hover:underline">Registrarse gratis</Link>
                    </div>
                    <div className="mt-2 text-center text-xs text-gray-400">
                        <Link href="/" className="hover:text-gray-600">Volver al inicio</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
