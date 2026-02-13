"use client"

import { useState } from "react"
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Download, Car } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function AdminVehicleImportPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<{ success: number, errors: string[] } | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return
        setImporting(true)
        setResult(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/admin/vehicles/import", {
                method: "POST",
                body: formData
            })
            const data = await res.json()
            setResult(data)
        } catch (error) {
            console.error(error)
            alert("Error al cargar el archivo.")
        } finally {
            setImporting(false)
        }
    }

    const downloadTemplate = () => {
        const headers = "plate,userEmail,brand,model,color,type,isElectric,ownerName,ownerPhone\n"
        const example = "ABC123,juan@test.com,Toyota,Corolla,Blanco,CAR,false,Juan Perez,3001234567"
        const blob = new Blob([headers + example], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'plantilla_vehiculos_admin.csv'
        a.click()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 text-white">
                <Link href="/admin/vehicles" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic uppercase bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Importación Global de Vehículos</h1>
                    <p className="text-gray-400 font-medium">Asigna vehículos masivamente a usuarios existentes en el sistema.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center gap-3 text-cyan-400 mb-2">
                        <Upload className="h-6 w-6" />
                        <h2 className="text-xl font-bold italic">Subir Dataset</h2>
                    </div>

                    <div
                        className={cn(
                            "border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all",
                            file ? "border-cyan-500/50 bg-cyan-500/5" : "border-white/10 hover:border-white/20"
                        )}
                    >
                        <FileText className={cn("h-12 w-12", file ? "text-cyan-400" : "text-gray-600")} />
                        <div className="text-center">
                            <p className="text-sm font-bold text-white mb-1">
                                {file ? file.name : "Selecciona tu archivo CSV"}
                            </p>
                            <p className="text-xs text-gray-500 font-mono tracking-widest">CSV • MÁX 5MB</p>
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors border border-white/5"
                        >
                            Explorar Archivos
                        </label>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || importing}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 italic"
                    >
                        {importing ? <Loader2 className="h-6 w-6 animate-spin" /> : "Ejecutar Importación"}
                    </button>

                    <button
                        onClick={downloadTemplate}
                        className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold group"
                    >
                        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                        Descargar Plantilla CSV
                    </button>
                </div>

                <div className="space-y-6">
                    {!result ? (
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-4 shadow-2xl">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                Guía de Carga
                            </h2>
                            <ul className="space-y-3 text-sm text-gray-400 leading-relaxed font-medium">
                                <li className="flex gap-2">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    Es vital incluir <code className="text-cyan-400">userEmail</code> para vincular el vehículo.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    El usuario ya debe estar registrado en NotifyCar.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    Type admitidos: CAR o MOTORCYCLE.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-cyan-400 font-bold">•</span>
                                    Ej: "PLATE,user@email.com,Tesla,Model 3,..."
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in-95 duration-500 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                                <h2 className="text-2xl font-black italic">Operación Exitosa</h2>
                            </div>

                            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl text-center">
                                <p className="text-green-400 font-black text-4xl">{result.success}</p>
                                <p className="text-[10px] text-green-400/70 font-black uppercase tracking-[3px]">Vehículos integrados</p>
                            </div>

                            {result.errors.length > 0 && (
                                <div className="space-y-3 text-white">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest px-1">Registros Fallidos ({result.errors.length})</p>
                                    <div className="max-h-40 overflow-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20">
                                        {result.errors.map((err, i) => (
                                            <p key={i} className="text-xs text-gray-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 font-bold italic">
                                                {err}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => router.push("/admin/vehicles")}
                                className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-colors border border-white/5"
                            >
                                Volver al Inventario
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
