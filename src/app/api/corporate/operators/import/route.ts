import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

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

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue

            const values = line.split(',')
            const userData: any = {}

            headers.forEach((header, index) => {
                userData[header] = values[index]?.trim()
            })

            if (!userData.email || !userData.name) {
                results.errors.push(`Fila ${i + 1}: Nombre o Email faltante`)
                continue
            }

            try {
                const existing = await db.user.findUnique({
                    where: { email: userData.email }
                })

                if (existing) {
                    results.errors.push(`Fila ${i + 1}: El correo ${userData.email} ya está en uso`)
                    continue
                }

                const password = userData.password || "Operario123!"
                const hashedPassword = await bcrypt.hash(password, 10)

                await db.user.create({
                    data: {
                        name: userData.name,
                        email: userData.email,
                        password: hashedPassword,
                        role: "OPERATOR",
                        organizationId: session.user.organizationId
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
