import Link from "next/link"
import { Search, Bell, MessageSquare, Shield, ArrowRight, User as UserIcon, Zap, AlertCircle, Eye, Send, Star, CheckCircle2 } from "lucide-react"
import SearchSection from "@/components/SearchSection"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserMenu } from "@/components/UserMenu"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  // Determine dashboard link based on role
  const dashboardLink = user?.role === "ADMIN"
    ? "/admin"
    : user?.role === "CORPORATE"
      ? "/corporate"
      : "/dashboard"

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand/20">
      {/* Header Transparente */}
      <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all">
              <img
                src="/logo_white.png"
                alt="NotifyCar"
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <UserMenu user={user} dashboardLink={dashboardLink} />
            ) : (
              <>
                <Link
                  href="/account/signin"
                  className="text-white/80 hover:text-white font-medium px-4 py-2 transition-colors text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/account/signup"
                  className="bg-brand hover:bg-brand-light text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand/20 transition-all hover:scale-105 hover:shadow-brand/40 text-sm"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* 1. Hero Section Inmersivo */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/back-red-lights-red-sport-car.jpg"
              alt="Red Sports Car Tail Lights"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 via-gray-900/85 to-gray-900" />
          </div>

          <div className="container mx-auto px-4 relative z-10 w-full pt-10 pb-8">
            <div className="max-w-4xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="space-y-4">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-brand text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
                  Comunidad #1 de Conductores
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.9] drop-shadow-2xl">
                  Notifica a otros <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">conductores.</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  La plataforma de seguridad vehicular colaborativa. Notifica incidentes de forma anónima o recibe alertas sobre tu vehículo al instante.
                </p>
              </div>

              {/* Buscador Potenciado */}
              <div className="transform scale-100 hover:scale-[1.01] transition-transform duration-500">
                <SearchSection />
              </div>

              <p className="text-sm text-gray-400 opacity-80">
                🔒 Tus datos están protegidos y tu identidad es 100% anónima.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Value Proposition - Bento Grid Style */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Más que una alerta, tranquilidad.</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Diseñado para proteger tu privacidad mientras mantienes tu vehículo seguro en todo momento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Feature 1: Privacy */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500 flex flex-col group overflow-hidden relative hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-brand/10 transition-colors duration-500" />
                <div className="relative z-10 flex-1">
                  <div className="w-14 h-14 bg-brand shadow-sm border border-brand rounded-2xl flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Privacidad Absoluta</h3>
                  <p className="text-gray-500 text-base leading-relaxed">
                    Nunca compartimos tu número de teléfono. La comunicación se realiza a través de nuestra plataforma segura, manteniendo tu identidad protegida en todo momento.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 relative z-10">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-green-700 font-bold text-xs uppercase tracking-wider shadow-sm">
                    <CheckCircle2 className="h-4 w-4" /> Sin datos expuestos
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-blue-700 font-bold text-xs uppercase tracking-wider shadow-sm">
                    <CheckCircle2 className="h-4 w-4" /> 100% Anónimo
                  </span>
                </div>
              </div>

              {/* Feature 2: Speed */}
              <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-xl shadow-gray-900/20 text-white flex flex-col group relative overflow-hidden hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand rounded-full translate-y-1/2 translate-x-1/3 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                <div className="relative z-10 flex-1">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-colors">
                    <Zap className="h-7 w-7 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Velocidad de la Luz</h3>
                  <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                    Las notificaciones llegan instantáneamente al WhatsApp del propietario. Sin descargar apps adicionales.
                  </p>
                </div>
              </div>

              {/* Feature 3: Simplicity */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 group relative overflow-hidden hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-dark transition-colors">
                  <UserIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Registro Fácil</h3>
                <p className="text-gray-500 text-base leading-relaxed">
                  Solo necesitas tu placa y tu número de WhatsApp. En menos de 30 segundos tu vehículo estará conectado.
                </p>
                {/* Hover decorative element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-all duration-500" />
              </div>

              {/* Feature 4: Community */}
              <div className="bg-gradient-to-br from-brand to-brand-dark rounded-[2.5rem] p-8 shadow-xl shadow-brand/20 hover:shadow-brand/40 transition-all duration-500 flex flex-col group overflow-hidden relative hover:-translate-y-1">
                <div className="relative z-10 flex-1">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Comunidad Colaborativa</h3>
                  <p className="text-white/90 text-base leading-relaxed font-medium">
                    Únete a una red de conductores que se cuidan mutuamente. Evita multas, robos y malos ratos ayudando a otros.
                  </p>
                </div>

                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] group-hover:opacity-20 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Cómo Funciona (Visual) */}
        <section className="py-4 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-4xl font-black text-gray-900">¿Cómo funciona?</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Hemos simplificado la comunicación vehicular en tres pasos sencillos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative max-w-6xl mx-auto">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:-translate-y-4 transition-transform duration-300 relative z-10">
                  <div className="bg-blue-100 p-4 rounded-2xl">
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Identifica</h3>
                <p className="text-gray-500 px-4">Ves un vehículo con las luces encendidas o mal parqueado.</p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:-translate-y-4 transition-transform duration-300 relative z-10 delay-100">
                  <div className="bg-brand/10 p-4 rounded-2xl">
                    <Search className="h-8 w-8 text-brand" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Busca</h3>
                <p className="text-gray-500 px-4">Ingresa la placa en nuestro buscador seguro.</p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:-translate-y-4 transition-transform duration-300 relative z-10 delay-200">
                  <div className="bg-green-100 p-4 rounded-2xl">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. Notifica</h3>
                <p className="text-gray-500 px-4">Envía una alerta predefinida. ¡Llega al WhatsApp del dueño!</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Call to Action Premium */}
        <section className="py-10 container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden group shadow-2xl shadow-gray-900/40">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none group-hover:bg-brand/30 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-black group-hover:scale-105 transition-transform duration-700 tracking-tight">
                ¿Tu vehículo está protegido?
              </h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                Únete a miles de conductores que ya reciben alertas en tiempo real. <br className="hidden md:block" />
                Registrar tu placa toma menos de 1 minuto y es gratis.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Link href="/account/signup" className="bg-brand hover:bg-brand-dark text-white px-10 py-5 rounded-2xl font-black text-lg inline-flex items-center gap-3 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-brand/40 group/btn">
                  Registrar mi Vehículo
                  <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link href="/account/signin" className="px-10 py-5 rounded-2xl font-bold text-lg inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 border border-transparent hover:border-white/10">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link href="/" className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100">
              <img
                src="/logo_white.png"
                alt="NotifyCar"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-8">
                <Link href="/terms" className="text-gray-500 hover:text-white font-medium transition-colors text-sm hover:underline">
                  Términos
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-white font-medium transition-colors text-sm hover:underline">
                  Privacidad
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-white font-medium transition-colors text-sm hover:underline">
                  Contacto
                </Link>
              </div>
              <div className="text-gray-600 text-xs font-medium">
                &copy; {new Date().getFullYear()} NotifyCar
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
