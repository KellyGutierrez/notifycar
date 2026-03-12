import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

// Map of country names to their ISO codes
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    "ARGENTINA": "AR",
    "BOLIVIA": "BO",
    "BRASIL": "BR",
    "BRAZIL": "BR",
    "CHILE": "CL",
    "COLOMBIA": "CO",
    "COSTA RICA": "CR",
    "CUBA": "CU",
    "ECUADOR": "EC",
    "EL SALVADOR": "SV",
    "ESPAÑA": "ES",
    "SPAIN": "ES",
    "ESTADOS UNIDOS": "US",
    "UNITED STATES": "US",
    "USA": "US",
    "GUATEMALA": "GT",
    "HONDURAS": "HN",
    "MEXICO": "MX",
    "MÉXICO": "MX",
    "NICARAGUA": "NI",
    "PANAMA": "PA",
    "PANAMÁ": "PA",
    "PARAGUAY": "PY",
    "PERU": "PE",
    "PERÚ": "PE",
    "PUERTO RICO": "PR",
    "REPUBLICA DOMINICANA": "DO",
    "REPÚBLICA DOMINICANA": "DO",
    "URUGUAY": "UY",
    "VENEZUELA": "VE",
}

function normalizeCountry(input: string): string {
    const upper = input.trim().toUpperCase()
    // If it's already a 2-letter code, return as is
    if (upper.length <= 3 && /^[A-Z]+$/.test(upper)) return upper
    // Try to map full name to code
    return COUNTRY_NAME_TO_CODE[upper] || upper
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const configs = await db.emergencyConfig.findMany({
        orderBy: { country: 'asc' }
    })
    return NextResponse.json(configs)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { country, police, transit, emergency } = body

        if (!country) return new NextResponse("Country required", { status: 400 })

        // Normalize the country to its ISO code to avoid duplicates
        const normalizedCountry = normalizeCountry(country)

        const config = await db.emergencyConfig.upsert({
            where: { country: normalizedCountry },
            update: { police, transit, emergency },
            create: { country: normalizedCountry, police, transit, emergency }
        })

        return NextResponse.json(config)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return new NextResponse("Id required", { status: 400 })

    await db.emergencyConfig.delete({ where: { id } })
    return new NextResponse("OK")
}
