const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin User';

    if (!email || !password) {
        console.log('Uso: node scripts/create-user.js correo@ejemplo.com contraseña "Nombre Completo"');
        process.exit(1);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'ADMIN',
                emailVerified: new Date()
            },
            create: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                phonePrefix: '57',
                phoneNumber: '3000000000',
                emailVerified: new Date()
            }
        });

        console.log(`\n✅ USUARIO CREADO/ACTUALIZADO`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.role}`);
        console.log(`\nYa puedes iniciar sesión en la plataforma.`);

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
