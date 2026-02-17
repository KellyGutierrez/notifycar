const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando seeding corporativo...');

    // 1. Crear Organización de prueba
    const organization = await prisma.organization.upsert({
        where: { id: 'test-org-id' },
        update: {},
        create: {
            id: 'test-org-id',
            name: 'Zona Azul Medellín',
            type: 'BLUE_ZONE',
            isActive: true,
        },
    });
    console.log('✅ Organización creada:', organization.name);

    // 2. Crear Usuario Corporativo
    const hashedPassword = await bcrypt.hash('corporate123', 10);
    const corporateUser = await prisma.user.upsert({
        where: { email: 'corporate@notifycar.com' },
        update: {
            role: 'CORPORATE',
            organizationId: organization.id,
        },
        create: {
            email: 'corporate@notifycar.com',
            name: 'Operador Zona Azul',
            password: hashedPassword,
            role: 'CORPORATE',
            organizationId: organization.id,
            termsAccepted: true,
        },
    });
    console.log('✅ Usuario corporativo creado:', corporateUser.email);
    console.log('🔑 Credenciales: corporate@notifycar.com / corporate123');

    // 3. Crear Plantillas Corporativas
    const templates = [
        {
            name: 'Pago pendiente - Zona Azul',
            content: 'Hola, notamos que te retiraste sin cancelar el parqueo de la Zona Azul. Por favor acércate al operador o realiza el pago por la app.',
            vehicleType: 'ALL',
            category: 'URGENT',
        },
        {
            name: 'Tiempo expirado - Zona Azul',
            content: 'Hola, tu tiempo de parqueo en la Zona Azul ha expirado. Evita sanciones renovando tu tiquete con el operador.',
            vehicleType: 'ALL',
            category: 'COMMON',
        },
        {
            name: 'Vehículo mal posicionado',
            content: 'Hola, tu vehículo está ocupando más de un espacio en la Zona Azul. Por favor corrígelo para evitar ser reportado a tránsito.',
            vehicleType: 'CAR',
            category: 'COMMON',
        }
    ];

    for (const t of templates) {
        const existingTemplate = await prisma.notificationTemplate.findFirst({
            where: {
                name: t.name,
                organizationId: organization.id
            }
        });

        if (!existingTemplate) {
            await prisma.notificationTemplate.create({
                data: {
                    ...t,
                    organizationId: organization.id,
                    isActive: true,
                    type: 'APP'
                }
            });
        }
    }
    console.log('✅ Plantillas corporativas creadas.');

    console.log('✨ Seeding corporativo completado con éxito!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
