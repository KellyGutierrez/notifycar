"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Loader2, Mail, Lock, User, Shield, Globe, Phone, Check, Eye, EyeOff } from "lucide-react"

import { countries } from "@/lib/countries"
import { CountrySelect } from "@/components/CountrySelect"

export default function SignUpPage() {
    const router = useRouter()
    const defaultCountry = countries.find(c => c.code === "CO") || countries[0]

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        country: defaultCountry.code,
        phonePrefix: defaultCountry.dial_code,
        phoneNumber: "",
        termsAccepted: false
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)



    // ... inside render ... 

    // Select options need to use the new fields


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!data.termsAccepted) {
            setError("Debes aceptar el tratamiento de datos para continuar.")
            return
        }

        setIsLoading(true)

        try {
            await axios.post("/api/register", data)
            // Redirigir al login
            router.push("/account/signin")
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al registrarse. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6 group">
                        <img
                            src="/logo.png"
                            alt="NotifyCar"
                            className="h-24 w-auto object-contain"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
                    <p className="text-gray-500 text-sm mt-2">Únete a la red de conductores conectados</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                                    placeholder="Juan Pérez"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Correo y Contraseña Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                                        placeholder="user@example.com"
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* País y Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
                            <div className="flex gap-2">
                                <CountrySelect
                                    value={data.country}
                                    onChange={(code) => {
                                        const country = countries.find(c => c.code === code)
                                        setData({
                                            ...data,
                                            country: code,
                                            phonePrefix: country ? country.dial_code : ""
                                        })
                                    }}
                                />
                                <div className="relative flex-1 group">
                                    <div className="absolute left-3 top-0 bottom-0 flex items-center">
                                        <span className="text-gray-500 text-sm border-r border-gray-200 pr-2 mr-2 font-medium">{data.phonePrefix}</span>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-mono"
                                        placeholder="300 123 4567"
                                        value={data.phoneNumber}
                                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                                    />
                                    <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Términos */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white transition-all checked:border-brand checked:bg-brand"
                                    checked={data.termsAccepted}
                                    onChange={(e) => setData({ ...data, termsAccepted: e.target.checked })}
                                />
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none leading-tight">
                                Autorizo el tratamiento de mis datos personales de acuerdo con la <Link href="#" className="text-brand hover:underline font-medium">Política de Privacidad</Link> de NotifyCar para recibir notificaciones vehiculares.
                            </span>
                        </label>
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
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Crear mi cuenta"}
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta? <Link href="/account/signin" className="text-brand font-bold hover:underline transition-colors">Iniciar sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    )

}
