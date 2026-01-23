const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno prioritariamente desde .env.local, luego .env
const envPaths = [path.join(__dirname, '../.env.local'), path.join(__dirname, '../.env')]
envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8')
        envFile.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
                const cleanedKey = key.trim()
                if (!process.env[cleanedKey]) {
                    process.env[cleanedKey] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
                }
            }
        })
    }
})

const prisma = new PrismaClient()

async function main() {
    const configs = [
        { country: "CO", police: "123", transit: "127", emergency: "123" }, // Colombia
        { country: "MX", police: "911", transit: "911", emergency: "911" }, // México
        { country: "ES", police: "091", transit: "092", emergency: "112" }, // España
        { country: "AR", police: "911", transit: "911", emergency: "911" }, // Argentina
        { country: "CL", police: "133", transit: "133", emergency: "133" }, // Chile
        { country: "PE", police: "105", transit: "105", emergency: "911" }, // Perú
        { country: "PA", police: "104", transit: "104", emergency: "911" }, // Panamá
        { country: "US", police: "911", transit: "911", emergency: "911" }, // Estados Unidos
        { country: "EC", police: "911", transit: "911", emergency: "911" }, // Ecuador
    ]

    console.log('Sembrando números de emergencia...')

    for (const c of configs) {
        await prisma.emergencyConfig.upsert({
            where: { country: c.country },
            update: c,
            create: c
        })
    }

    console.log('¡Números de emergencia sembrados con éxito!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
