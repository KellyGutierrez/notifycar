"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import axios from "axios"
import { Loader2, Phone, Check, Shield, CheckCircle2, ChevronRight, LogOut } from "lucide-react"
import { countries } from "@/lib/countries"
import { CountrySelect } from "@/components/CountrySelect"
import { signOut } from "next-auth/react"

export default function CompletePhonePage() {
    const router = useRouter()
    const { data: session, update } = useSession()

    const defaultCountry = countries.find(c => c.code === "CO") || countries[0]

    const [data, setData] = useState({
        country: defaultCountry.code,
        phonePrefix: defaultCountry.dial_code,
        phoneNumber: "",
    })

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [showCodeInput, setShowCodeInput] = useState(false)
    const [verifyingCode, setVerifyingCode] = useState(false)

    // Si ya está verificado según la sesión, redirigir
    useEffect(() => {
        if (session?.user?.phoneVerified) {
            router.push("/dashboard")
        }
    }, [session, router])

    const handleSendCode = async () => {
        if (!data.phoneNumber || data.phoneNumber.length < 7) {
            setError("Ingresa un número de celular válido.")
            return
        }
        setIsVerifying(true)
        setError("")
        try {
            await axios.post("/api/auth/verify-phone/send", {
                phonePrefix: data.phonePrefix,
                phoneNumber: data.phoneNumber,
                email: session?.user?.email
            })
            setShowCodeInput(true)
        } catch (err: any) {
            setError(err.response?.data || "No pudimos enviar el código. Revisa el número.")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleConfirmCode = async () => {
        if (!verificationCode) return
        setVerifyingCode(true)
        setError("")
        try {
            await axios.post("/api/auth/verify-phone/confirm", {
                phonePrefix: data.phonePrefix,
                phoneNumber: data.phoneNumber,
                code: verificationCode
            })
            setIsVerified(true)
            setShowCodeInput(false)
        } catch (err: any) {
            setError("Código incorrecto o expirado.")
        } finally {
            setVerifyingCode(false)
        }
    }

    const handleFinalize = async () => {
        setIsLoading(true)
        try {
            await axios.post("/api/auth/complete-phone", data)
            // Forzar actualización de la sesión
            await update()
            router.push("/dashboard")
        } catch (err: any) {
            setError("Error al guardar los datos. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 py-12 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 p-10 relative z-10 transition-all duration-500">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="NotifyCar" className="h-20 w-auto mx-auto mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Paso Final
                    </h1>
                    <p className="text-gray-400 text-sm mt-3 font-medium">
                        Hola <span className="text-brand font-bold">{session?.user?.name?.split(' ')[0]}</span>, necesitamos tu WhatsApp para notificarte emergencias sobre tu vehículo.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Phone Input Section */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            WhatsApp de Notificaciones
                        </label>
                        <div className="group flex gap-3">
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
                                <div className="absolute left-4 top-0 bottom-0 flex items-center">
                                    <span className="text-gray-500 text-sm border-r border-white/10 pr-3 mr-3 font-bold">{data.phonePrefix}</span>
                                </div>
                                <input
                                    type="tel"
                                    className={`w-full pl-20 pr-10 py-4 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-mono text-lg disabled:opacity-50 ${error ? "border-red-500/50" : "border-white/10"}`}
                                    placeholder="300 123 4567"
                                    value={data.phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setData({ ...data, phoneNumber: val });
                                        if (error) setError("");
                                    }}
                                    disabled={isVerified}
                                />
                                {isVerified && (
                                    <Check className="absolute right-4 top-4.5 h-6 w-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                )}
                            </div>
                        </div>

                        {!isVerified && !showCodeInput && (
                            <button
                                onClick={handleSendCode}
                                disabled={isVerifying || !data.phoneNumber}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 transition-all flex justify-center items-center gap-2 group disabled:opacity-30 active:scale-95"
                            >
                                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin text-brand" /> : (
                                    <>
                                        Enviar Código Seguridad <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Code Verification Section */}
                    {showCodeInput && !isVerified && (
                        <div className="space-y-6 p-6 rounded-[2rem] bg-brand/5 border border-brand/20 animate-in zoom-in-95 duration-500">
                            <div className="text-center">
                                <p className="text-xs text-brand/80 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                                    <Shield className="h-4 w-4" /> Ingresa el código enviado
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full py-4 bg-white/10 border border-white/10 rounded-2xl text-white text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand transition-all font-mono shadow-inner"
                                    placeholder="------"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button
                                    onClick={handleConfirmCode}
                                    disabled={verifyingCode || verificationCode.length < 6}
                                    className="px-8 bg-brand text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 shadow-xl shadow-brand/20"
                                >
                                    {verifyingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validar"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Verified Status */}
                    {isVerified && (
                        <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
                                ¡Teléfono Verificado!
                            </p>
                            <button
                                onClick={handleFinalize}
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Empezar Ahora"}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl text-center animate-shake uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    {/* Secondary Actions */}
                    <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                        <button
                            onClick={() => signOut()}
                            className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.25em] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <LogOut className="h-3 w-3" /> Usar otra cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
