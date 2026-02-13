import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
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

            if (!vehicleData.plate || !vehicleData.useremail) {
                results.errors.push(`Fila ${i + 1}: Placa o Email de usuario faltante`)
                continue
            }

            try {
                // Find user by email
                const user = await db.user.findUnique({
                    where: { email: vehicleData.useremail }
                })

                if (!user) {
                    results.errors.push(`Fila ${i + 1}: El usuario ${vehicleData.useremail} no existe`)
                    continue
                }

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
                        userId: user.id,
                        organizationId: user.organizationId // Inherit from user
                    }
                })
                results.success++
            } catch (err: any) {
                results.errors.push(`Fila ${i + 1}: Error (${err.message})`)
            }
        }

        return NextResponse.json(results)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
