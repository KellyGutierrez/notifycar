import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.organizationId) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 })
        }

        const text = await file.text()
        const lines = text.split(/\r?\n/)
        const headers = lines[0].toLowerCase().split(',')

        const results = {
            success: 0,
            errors: [] as string[]
        }

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue

            const values = line.split(',')
            const vehicleData: any = {}

            headers.forEach((header, index) => {
                let value: any = values[index]?.trim()
                if (header === 'iselectric') value = value === 'true'
                vehicleData[header] = value
            })

            if (!vehicleData.plate) {
                results.errors.push(`Fila ${i + 1}: Placa faltante`)
                continue
            }

            try {
                // Check if already ours or someone else's
                const existing = await db.vehicle.findUnique({
                    where: { plate: vehicleData.plate }
                })

                if (existing) {
                    results.errors.push(`Fila ${i + 1}: La placa ${vehicleData.plate} ya está registrada`)
                    continue
                }

                await db.vehicle.create({
                    data: {
                        plate: vehicleData.plate,
                        brand: vehicleData.brand || "Desconocida",
                        model: vehicleData.model || "Desconocido",
                        color: vehicleData.color,
                        type: (vehicleData.type === 'MOTORCYCLE') ? 'MOTORCYCLE' : 'CAR',
                        isElectric: !!vehicleData.iselectric,
                        ownerName: vehicleData.ownername,
                        ownerPhone: vehicleData.ownerphone,
                        driverName: vehicleData.drivername,
                        driverPhone: vehicleData.driverphone,
                        organizationId: session.user.organizationId,
                        userId: session.user.id // Assign to the corporative user for now
                    }
                })
                results.success++
            } catch (err: any) {
                results.errors.push(`Fila ${i + 1}: Error al crear (${err.message})`)
            }
        }

        return NextResponse.json(results)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
