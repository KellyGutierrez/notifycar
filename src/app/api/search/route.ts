import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const plate = searchParams.get("plate")

        if (!plate) {
            return new NextResponse("Plate is required", { status: 400 })
        }

        const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "")
        console.log(`🔍 BUSCANDO PLACA: "${plate}" -> Normalizada: "${normalizedPlate}"`);

        // 0. BYPASS VIRTUAL para TEST-999 / TEST999
        if (normalizedPlate === "TEST999") {
            return NextResponse.json({
                found: true,
                vehicle: {
                    id: "virtual-test-id",
                    plate: "TEST-999",
                    brand: "MASTER TEST",
                    model: "BYPASS",
                    color: "ESPECIAL",
                    type: "CAR",
                    isElectric: true
                }
            })
        }

        // Buscamos coincidencia exacta o normalizada
        const vehicle = await db.vehicle.findFirst({
            where: {
                OR: [
                    { plate: normalizedPlate },
                    { plate: plate.toUpperCase() }
                ]
            }
        })

        if (!vehicle) {
            console.warn(`❌ NO SE ENCONTRÓ NADA EN LA DB PARA: ${normalizedPlate}`);
            return NextResponse.json({ found: false })
        }

        console.log(`✅ ¡ENCONTRADO!: ${vehicle.plate} - ${vehicle.brand}`);

        return NextResponse.json({
            found: true,
            vehicle: {
                id: vehicle.id,
                plate: vehicle.plate,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color,
                type: vehicle.type,
                isElectric: vehicle.isElectric,
                organizationId: vehicle.organizationId
            }
        })
    } catch (error) {
        console.error("[SEARCH_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
