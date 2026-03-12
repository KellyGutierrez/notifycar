"use client"

import Link from "next/link"
import { ArrowLeft, Gavel, CheckCircle2, AlertTriangle } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-brand/30">
            {/* Header / Nav */}
            <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group transition-all">
                        <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-brand transition-colors" />
                        <span className="font-bold text-gray-400 group-hover:text-white transition-colors">Volver</span>
                    </Link>
                    <img src="/logo_white.png" alt="NotifyCar" className="h-10 w-auto" />
                </div>
            </header>

            <main className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex p-3 bg-brand/10 border border-brand/20 rounded-2xl mb-4">
                            <Gavel className="h-8 w-8 text-brand" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                            Términos y <span className="text-brand">Condiciones</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Última actualización: 27 de febrero de 2026 | Colombia</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-brand max-w-none bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-10">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                1. Identidad de las Partes
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Los presentes Términos y Condiciones regulan el uso de la plataforma <strong>NotifyCar</strong>, propiedad conjunta de <strong>NotifyCar</strong> y <strong>Rowell SAS</strong> (en adelante, "Los Propietarios"). <strong>Rowell SAS</strong> es la entidad encargada del desarrollo, mantenimiento y soporte tecnológico de la infraestructura de NotifyCar.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                2. Aceptación de Términos
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Al registrarse o utilizar NotifyCar, el usuario acepta de manera expresa e incondicional estos Términos y Condiciones, así como nuestra Política de Privacidad. Si no está de acuerdo con alguna de las disposiciones, deberá abstenerse de utilizar el servicio.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                3. Descripción del Servicio
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                NotifyCar es una plataforma colaborativa que permite a los ciudadanos enviar notificaciones anónimas a los propietarios de vehículos mediante la búsqueda de su placa. La plataforma actúa como intermediario tecnológico para facilitar la comunicación a través de servicios de mensajería como WhatsApp, SMS o Email.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                4. Responsabilidades del Usuario
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Proporcionar datos veraces al registrarse.",
                                    "Hacer buen uso del sistema de notificaciones.",
                                    "No utilizar la plataforma para acoso o spam.",
                                    "Respetar la privacidad de los demás usuarios."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                                        <span className="text-sm text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                5. Uso de Datos y Marketing
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                El usuario autoriza a <strong>NotifyCar</strong> y a <strong>Rowell SAS</strong> para que los datos proporcionados durante el registro sean utilizados para la correcta prestación del servicio. Así mismo, el usuario acepta de manera flexible que sus datos de contacto puedan ser empleados para el envío de comunicaciones de marketing, publicidad y promociones tanto de la plataforma NotifyCar como de otros productos, servicios y proyectos desarrollados por <strong>Rowell SAS</strong>.
                            </p>
                            <div className="p-4 bg-brand/5 border border-brand/20 rounded-2xl">
                                <p className="text-xs text-brand font-bold uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" /> Importante
                                </p>
                                <p className="text-sm text-gray-400 mt-1">Esta autorización se entiende otorgada para comunicaciones vía WhatsApp, correo electrónico y cualquier otro medio registrado.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                6. Limitación de Responsabilidad
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Ni NotifyCar ni Rowell SAS se hacen responsables por el contenido de los mensajes enviados por los usuarios. La plataforma es una herramienta de comunicación y no garantiza la veracidad de los reportes enviados por terceros. El uso de la plataforma es bajo riesgo exclusivo del usuario.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-brand rounded-full" />
                                7. Ley Aplicable
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia será resuelta ante las autoridades competentes y tribunales de la ciudad de Manizales, Caldas.
                            </p>
                        </section>

                        <a href="https://rowell.co/" target="_blank" rel="noopener noreferrer" className="pt-10 border-t border-white/5 text-center flex flex-col items-center gap-3 group cursor-pointer">
                            <img src="/rowell_logo.jpg" alt="Rowell" className="h-6 w-6 rounded-md grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                            <p className="text-gray-600 text-sm italic group-hover:text-gray-400 transition-colors">"Rowell SAS: Innovación para un mundo más conectado."</p>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
