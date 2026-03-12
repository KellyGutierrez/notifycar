"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import axios from "axios"
import { Loader2, Mail, Lock, User, Shield, Globe, Phone, Check, Eye, EyeOff, CheckCircle2 } from "lucide-react"

import { countries } from "@/lib/countries"
import { CountrySelect } from "@/components/CountrySelect"
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

function SignUpForm() {
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

    // Si cambia el teléfono, resetear verificación
    useEffect(() => {
        setIsVerified(false)
        setShowCodeInput(false)
        setVerificationCode("")
    }, [data.phoneNumber, data.phonePrefix])

    const [error, setError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [checkLoading, setCheckLoading] = useState(false)
    const [phoneCheckLoading, setPhoneCheckLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

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

    const checkEmail = async (email: string) => {
        if (!email || !email.includes("@")) return
        setCheckLoading(true)
        setEmailError("")
        try {
            const { data } = await axios.get(`/api/auth/check-email?email=${email}`)
            if (data.exists) {
                setEmailError("Este correo ya está registrado")
            }
        } catch (err) {
            console.error("Error al validar email")
        } finally {
            setCheckLoading(false)
        }
    }

    const checkPhone = async (prefix: string, phone: string) => {
        if (!phone || phone.length < 7) return
        setPhoneCheckLoading(true)
        setPhoneError("")
        try {
            const { data } = await axios.get(`/api/auth/check-phone?phonePrefix=${encodeURIComponent(prefix)}&phoneNumber=${phone}`)
            if (data.exists) {
                setPhoneError("Este número ya está en uso")
            }
        } catch (err) {
            console.error("Error al validar teléfono")
        } finally {
            setPhoneCheckLoading(false)
        }
    }

    // Estados de verificación
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [showCodeInput, setShowCodeInput] = useState(false)
    const [verifyingCode, setVerifyingCode] = useState(false)

    const handleSendCode = async () => {
        if (!data.phoneNumber) {
            setError("Ingresa tu número de celular primero.")
            return
        }
        setIsVerifying(true)
        setError("")
        try {
            await axios.post("/api/auth/verify-phone/send", {
                phonePrefix: data.phonePrefix,
                phoneNumber: data.phoneNumber,
                email: data.email
            })
            setShowCodeInput(true)
        } catch (err: any) {
            const msg = err.response?.data || "No pudimos enviar el código. Revisa el número e intenta de nuevo."
            setError(msg)
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

    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!data.termsAccepted) {
            setError("Debes aceptar el tratamiento de datos para continuar.")
            return
        }

        if (!isVerified) {
            setError("Debes verificar tu número de celular para continuar.")
            return
        }

        setIsLoading(true)

        try {
            if (!executeRecaptcha) {
                setError("ReCAPTCHA no está listo. Intenta de nuevo en un momento.")
                setIsLoading(false)
                return
            }

            const captchaToken = await executeRecaptcha("signup")

            await axios.post("/api/register", {
                ...data,
                captchaToken
            })
            // Redirigir al login
            router.push("/account/signin")
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al registrarse. Intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-start sm:items-center justify-center bg-gray-50 px-4 py-8 sm:py-12 relative overflow-hidden pt-safe pb-24 sm:pb-12">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100 relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center mb-6 group">
                        <img
                            src="/brand/horizontal-color.png"
                            alt="NotifyCar"
                            className="h-11 w-auto object-contain"
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
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all ${emailError ? "border-red-500 ring-red-200" : "border-gray-200"}`}
                                        placeholder="user@example.com"
                                        value={data.email}
                                        onChange={(e) => {
                                            const email = e.target.value;
                                            setData({ ...data, email });
                                            if (emailError) setEmailError("");
                                        }}
                                        onBlur={(e) => checkEmail(e.target.value)}
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-[10px] text-red-500 font-medium mt-1 ml-1">{emailError}</p>
                                )}
                                {checkLoading && (
                                    <p className="text-[10px] text-gray-400 mt-1 ml-1 flex items-center gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Verificando correo...
                                    </p>
                                )}
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
                            <div className="flex items-start gap-2 mb-3">
                                <CountrySelect
                                    variant="light"
                                    className="w-[88px]"
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
                                        <span className="text-gray-500 text-xs sm:text-sm border-r border-gray-200 pr-2 mr-2 font-medium">{data.phonePrefix}</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className={`w-full pl-14 sm:pl-16 pr-8 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all font-mono text-sm sm:text-base disabled:opacity-50 ${phoneError ? "border-red-500 ring-red-200" : "border-gray-200"}`}
                                        placeholder="300 123 4567"
                                        value={data.phoneNumber}
                                        onChange={(e) => {
                                            const phoneNumber = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setData({ ...data, phoneNumber });
                                            if (phoneError) setPhoneError("");
                                        }}
                                        onBlur={() => checkPhone(data.phonePrefix, data.phoneNumber)}
                                        disabled={isVerified}
                                    />
                                    {phoneError && (
                                        <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium ml-1 whitespace-nowrap">{phoneError}</p>
                                    )}
                                    {phoneCheckLoading && (
                                        <p className="absolute -bottom-5 left-0 text-[10px] text-gray-400 ml-1 flex items-center gap-1 whitespace-nowrap">
                                            <Loader2 className="h-3 w-3 animate-spin" /> Validando...
                                        </p>
                                    )}
                                    <div className="absolute right-2 top-3">
                                        {isVerified ? (
                                            <Check className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                {!isVerified && !showCodeInput && (
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={isVerifying || !data.phoneNumber}
                                        className="shrink-0 px-3 sm:px-4 py-3 bg-brand/10 text-brand border border-brand/20 rounded-xl font-bold text-xs sm:text-sm hover:bg-brand/20 transition-all disabled:opacity-50 min-w-[80px] flex items-center justify-center"
                                    >
                                        {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar"}
                                    </button>
                                )}
                            </div>

                            {/* Campo para el código */}
                            {showCodeInput && !isVerified && (
                                <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                                    <div className="relative flex-1 group">
                                        <Shield className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            maxLength={6}
                                            className="w-full pl-10 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono tracking-[0.3em] sm:tracking-[0.5em] text-center text-base sm:text-lg"
                                            placeholder="------"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleConfirmCode}
                                        disabled={verifyingCode || verificationCode.length < 6}
                                        className="shrink-0 px-4 sm:px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                                    >
                                        {verifyingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validar"}
                                    </button>
                                </div>
                            )}

                            {isVerified && (
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1 ml-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Número verificado correctamente
                                </p>
                            )}
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

                    {/* Badge visual de protección */}
                    <div className="flex justify-center mt-4">
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                            <Shield className="h-3 w-3" /> Protegido por Google reCAPTCHA
                        </span>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta? <Link href="/account/signin" className="text-brand font-bold hover:underline transition-colors">Iniciar sesión</Link>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default function SignUpPage() {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        >
            <SignUpForm />
        </GoogleReCaptchaProvider>
    )
}
