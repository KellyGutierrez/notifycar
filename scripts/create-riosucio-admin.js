const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🚕 Creando administrador para Gremio de Taxis Riosucio...')

    try {
        // 1. Buscar la organización del Gremio de Taxis Riosucio
        const organization = await prisma.organization.findFirst({
            where: {
                name: {
                    contains: 'Riosucio',
                    mode: 'insensitive'
                },
                type: 'FLEET'
            }
        })

        if (!organization) {
            console.error('❌ No se encontró la organización "Gremio de Taxis Riosucio"')
            console.log('💡 Asegúrate de haberla creado primero desde el panel de admin')
            return
        }

        console.log(`✅ Organización encontrada: ${organization.name} (ID: ${organization.id})`)

        // 2. Crear el usuario administrador
        const hashedPassword = await bcrypt.hash('admin123', 10)

        const user = await prisma.user.upsert({
            where: { email: 'admin@riosucio.com' },
            update: {
                name: 'Admin Riosucio',
                role: 'CORPORATE',
                organizationId: organization.id
            },
            create: {
                email: 'admin@riosucio.com',
                name: 'Admin Riosucio',
                password: hashedPassword,
                role: 'CORPORATE',
                organizationId: organization.id
            }
        })

        console.log(`\n✅ Usuario creado exitosamente:`)
        console.log(`📧 Email: ${user.email}`)
        console.log(`🔑 Contraseña: admin123`)
        console.log(`👤 Rol: ${user.role}`)
        console.log(`🏢 Organización: ${organization.name}`)
        console.log(`\n🚀 Ya puedes iniciar sesión con estas credenciales`)

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
