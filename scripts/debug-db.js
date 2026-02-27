const { PrismaClient } = require("@prisma/client")
async function main() {
    const prisma = new PrismaClient()
    try {
        const count = await prisma.user.count()
        console.log("Users count:", count)
    } catch (e) {
        console.error("DEBUG ERROR:", e)
    } finally {
        await prisma.$disconnect()
    }
}
main()
