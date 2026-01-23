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
    console.log('--- EMERGENCY CONFIGS ---')
    const configs = await prisma.emergencyConfig.findMany()
    console.table(configs)

    console.log('\n--- RECENT USERS ---')
    const users = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, country: true }
    })
    console.table(users)
}

main().finally(() => prisma.$disconnect())
