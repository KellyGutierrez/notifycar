import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET all users
export async function GET() {
    try {
        const users = await db.user.findMany({
            include: {
                organization: true,
                _count: {
                    select: { vehicles: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
    }
}

// POST create new user
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, password, role, organizationId } = body

        // Validate required fields
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Ya existe un usuario con este email" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                organizationId: organizationId || null
            },
            include: {
                organization: true
            }
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
    }
}

// PUT update user
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, name, email, role, organizationId } = body

        if (!id) {
            return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
        }

        const user = await db.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                organizationId: organizationId || null
            },
            include: {
                organization: true
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
    }
}

// DELETE user
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
        }

        await db.user.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
    }
}
