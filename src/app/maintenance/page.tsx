import Image from "next/image"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/logo.png"
                        alt="NotifyCar"
                        width={200}
                        height={80}
                        className="h-20 w-auto"
                    />
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand/20 rounded-full mb-4">
                        <svg
                            className="w-10 h-10 text-brand"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white">
                        Estamos en Mantenimiento
                    </h1>

                    <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                        Estamos realizando mejoras en el sistema para brindarte un mejor servicio.
                        Volveremos pronto.
                    </p>

                    <div className="pt-6">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
                            <span>Sistema en actualización</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    NotifyCar · Comunicación inteligente en la vía
                </p>
            </div>
        </div>
    )
}
