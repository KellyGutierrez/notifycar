const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const templates = await prisma.notificationTemplate.findMany()
    console.log('Total templates:', templates.length)
    console.log(JSON.stringify(templates, null, 2))
}

main().finally(() => prisma.$disconnect())
