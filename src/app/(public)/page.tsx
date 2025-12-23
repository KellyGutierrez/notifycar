import Link from "next/link"
import { Search, Bell, MessageSquare, Shield, ArrowRight } from "lucide-react"
import SearchSection from "@/components/SearchSection"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="NotifyCar"
              className="h-20 w-auto object-contain"
            />
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/account/signin"
              className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/account/signup"
              className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Notifica a otros <br />
                <span className="text-brand">conductores</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Busca un vehículo por su placa para enviarle una notificación a su propietario de forma anónima y segura.
              </p>

              <SearchSection />

              <p className="text-sm text-gray-400 mt-4">
                ¿Quieres recibir alertas? <Link href="/account/signup" className="text-brand font-medium hover:underline">Registra tu vehículo</Link>
              </p>
            </div>
          </div>

          {/* Abstract Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl -z-10" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Registra tu vehículo</h3>
                <p className="text-gray-500 leading-relaxed">
                  Crea una cuenta y asocia la placa de tu coche para empezar a recibir alertas importantes de la comunidad.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <Bell className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Recibe notificaciones</h3>
                <p className="text-gray-500 leading-relaxed">
                  Entérate al instante si dejaste las luces encendidas, si estás mal estacionado o si tu coche corre peligro.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Notifica a otros</h3>
                <p className="text-gray-500 leading-relaxed">
                  Ayuda a otros conductores enviándoles alertas predefinidas escaneando su placa. 100% anónimo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 container mx-auto px-4">
          <div className="bg-gray-900 rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl font-bold">Únete a la comunidad más grande de conductores</h2>
              <p className="text-gray-300 text-lg">
                Empieza a proteger tu vehículo hoy mismo. Es completamente gratis.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/account/signup" className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-transform hover:scale-105">
                  Crear cuenta gratis <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          </div>
        </section>
      </main>

      <footer className="bg-[#0a3622] text-white py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo_white.png"
                alt="NotifyCar"
                className="h-16 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-8">
                <Link href="/account/signin" className="text-gray-300 hover:text-white font-medium transition-colors text-sm">
                  Iniciar Sesión
                </Link>
                <Link href="/account/signup" className="text-gray-300 hover:text-white font-medium transition-colors text-sm">
                  Registrarse
                </Link>
              </div>
              <div className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} NotifyCar. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
