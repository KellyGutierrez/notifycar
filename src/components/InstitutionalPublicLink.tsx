"use client"

import { useState } from "react"
import { Copy, Check, Globe, Link as LinkIcon } from "lucide-react"

interface PublicLinkProps {
    publicToken: string | null
    origin: string
}

export default function InstitutionalPublicLink({ publicToken, origin }: PublicLinkProps) {
    const [copied, setCopied] = useState(false)
    const publicLink = publicToken ? `${origin}/zone/${publicToken}` : ""

    const copyLink = () => {
        if (!publicToken || !publicLink) {
            alert("El enlace aún no está disponible.")
            return
        }

        navigator.clipboard.writeText(publicLink)
            .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
            .catch(err => {
                console.error("Error al copiar:", err)
                alert("No se pudo copiar el enlace.")
            })
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px]" />

            <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Acceso Público (Bypass)</h2>
            </div>

            <p className="text-emerald-100/70 mb-6 text-sm leading-relaxed">
                Comparte este link con tus operarios en campo para que puedan notificar sin necesidad de una cuenta personal.
            </p>

            <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 rounded-2xl group">
                    <LinkIcon className="h-4 w-4 text-gray-500 shrink-0" />
                    <code className="text-[10px] text-emerald-400/80 truncate font-mono flex-1">
                        {publicToken ? publicLink : "Generando link..."}
                    </code>
                </div>

                <button
                    onClick={copyLink}
                    disabled={!publicToken}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 active:scale-95"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "¡Link Copiado!" : "Copiar Link de Acceso"}
                </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] text-emerald-500/70 leading-relaxed italic">
                    Cualquier persona con este link podrá enviar mensajes de aviso usando el nombre de tu organización.
                </p>
            </div>
        </div>
    )
}
