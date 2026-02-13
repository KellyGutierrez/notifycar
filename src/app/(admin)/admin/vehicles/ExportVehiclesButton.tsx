"use client"

import { Download } from "lucide-react"

interface ExportVehiclesButtonProps {
    data: any[]
}

export default function ExportVehiclesButton({ data }: ExportVehiclesButtonProps) {
    const exportToCSV = () => {
        const headers = ["Placa", "Marca", "Modelo", "Color", "Electrico", "Usuario", "Email Usuario", "Fecha Registro"]
        const rows = data.map(v => [
            v.plate,
            v.brand,
            v.model,
            v.color || "N/A",
            v.isElectric ? "Si" : "No",
            v.user.name,
            v.user.email,
            new Date(v.createdAt).toLocaleDateString()
        ])

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `vehiculos_global_${new Date().toISOString().split('T')[0]}.csv`)
        link.click()
    }

    return (
        <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10"
        >
            <Download className="h-5 w-5 text-gray-500" /> Exportar
        </button>
    )
}
