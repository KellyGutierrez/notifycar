"use client"

import { useEffect } from "react"

export default function PrivacyPage() {
    useEffect(() => {
        window.location.href = "/terminos.pdf"
    }, [])

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center space-y-4">
                <p className="text-gray-400">Redirigiendo a la Política de Privacidad...</p>
                <a href="/terminos.pdf" className="text-brand hover:underline font-bold">Haz clic aquí si no eres redirigido</a>
            </div>
        </div>
    )
}
