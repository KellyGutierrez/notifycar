"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, MessageSquare, Zap } from "lucide-react"

export default function PrivacyPage() {
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
                        <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl mb-4">
                            <Shield className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                            Política de <span className="text-cyan-400">Privacidad</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Habeas Data | De conformidad con la Ley 1581 de 2012</p>
                    </div>

                    {/* Content Area */}
                    <div className="prose prose-invert prose-cyan max-w-none bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-10">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-cyan-400 rounded-full" />
                                1. Responsable del Tratamiento
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                El Responsable del tratamiento de sus datos personales es <strong>Rowell SAS</strong>, con domicilio en Manizales, Colombia, propietaria y desarrolladora de la plataforma <strong>NotifyCar</strong>. Para efectos de esta política, ambos entes actúan de forma coordinada en el tratamiento de la información bajo los más altos estándares de seguridad.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-cyan-400 rounded-full" />
                                2. Datos Recolectados
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Al registrarse en NotifyCar, recolectamos información que puede incluir: nombre completo, número de teléfono (WhatsApp), placa del vehículo, correo electrónico y datos técnicos de navegación. Estos datos son fundamentales para vincularlo a nuestro sistema de alertas.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-cyan-400 rounded-full" />
                                3. Finalidades y Flexibilidad de Uso
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Sus datos serán utilizados para las siguientes finalidades primordiales y secundarias:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-start gap-2 italic">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                    Prestación del servicio de alertas y notificaciones vehiculares.
                                </li>
                                <li className="flex items-start gap-2 italic">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                    Validación de identidad y seguridad de la cuenta.
                                </li>
                                <li className="flex items-start gap-2 font-bold text-gray-200">
                                    <div className="h-2 w-2 rounded-full bg-brand mt-2 shrink-0" />
                                    Envío de mensajes de carácter comercial, marketing, publicidad y promociones tanto de NotifyCar como de cualquier proyecto, software o servicio desarrollado por Rowell SAS.
                                </li>
                                <li className="flex items-start gap-2 italic">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                    Estadísticas de uso y mejora de la experiencia de usuario.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-cyan-400 rounded-full" />
                                4. Seguridad de la Información
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
                                    <Lock className="h-6 w-6 text-brand mx-auto shadow-brand" />
                                    <p className="text-xs font-bold uppercase">Cifrado SSL</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
                                    <Zap className="h-6 w-6 text-yellow-400 mx-auto" />
                                    <p className="text-xs font-bold uppercase">Acceso Restringido</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
                                    <Shield className="h-6 w-6 text-cyan-400 mx-auto" />
                                    <p className="text-xs font-bold uppercase">Monitoreo 24/7</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-cyan-400 rounded-full" />
                                5. Derechos de los Titulares (Habeas Data)
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Según la Ley 1581 de 2012, usted tiene derecho a: conocer, actualizar, rectificar y suprimir sus datos personales de nuestras bases de datos en cualquier momento. Para ejercer estos derechos, puede escribirnos a:
                            </p>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                                <p className="font-bold flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                                    Email: hola@notifycar.com
                                </p>
                                <p className="text-sm text-gray-500">Asunto: Ejercicio de Derechos Habeas Data</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <div className="h-8 w-1 bg-cyan-400 rounded-full" />
                                6. Envío de Publicidad
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Al registrarse, el usuario autoriza expresamente el envío de información publicitaria. Reconoce que <strong>Rowell SAS</strong> podrá enviarle información sobre nuevos lanzamientos, actualizaciones tecnológicas o servicios aliados, buscando siempre aportar valor a la experiencia del usuario de NotifyCar.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-white/5 text-center space-y-4 flex flex-col items-center">
                            <img src="/rowell_logo.jpg" alt="Rowell" className="h-6 w-6 rounded-md grayscale opacity-20" />
                            <p className="text-gray-600 text-xs font-black uppercase tracking-widest">Protegido por la Legislación Colombiana</p>
                            <p className="text-gray-400 italic font-medium">NotifyCar &bull; Rowell SAS</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
