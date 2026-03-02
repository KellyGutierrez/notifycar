import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { token, plate } = body

        if (!token || !plate) {
            return new NextResponse("Token y placa son requeridos", { status: 400 })
        }

        const normalizedPlate = plate.toUpperCase().trim()

        // 1. Verificar el token y que no haya expirado
        const verificationToken = await db.verificationToken.findUnique({
            where: {
                identifier_token: {
                    identifier: normalizedPlate,
                    token: token
                }
            }
        })

        if (!verificationToken) {
            return new NextResponse("Token inválido o placa incorrecta", { status: 404 })
        }

        if (new Date() > verificationToken.expires) {
            // El token ya expiró, lo borramos y negamos acceso
            await db.verificationToken.delete({
                where: { id: verificationToken.id }
            });
            return new NextResponse("El link ha expirado (24h límite). Vuelve a intentar registrar el vehículo para solicitar uno nuevo.", { status: 410 })
        }

        // 2. Buscar el vehículo
        const vehicle = await db.vehicle.findUnique({
            where: { plate: normalizedPlate }
        })

        if (!vehicle) {
            // Si el vehículo ya no existe, el trabajo ya está hecho
            await db.verificationToken.delete({ where: { id: verificationToken.id } });
            return new NextResponse("El vehículo ya no se encuentra registrado.", { status: 200 })
        }

        // 3. Proceder con el borrado del vehículo
        // Prisma maneja el borrado en cascada para notificaciones por el esquema
        await db.vehicle.delete({
            where: { id: vehicle.id }
        })

        // 4. Borrar el token para invalidarlo
        await db.verificationToken.delete({
            where: { id: verificationToken.id }
        })

        return new NextResponse("Vehículo eliminado correctamente", { status: 200 })

    } catch (error) {
        console.error("[PUBLIC_VEHICLE_DELETE]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
