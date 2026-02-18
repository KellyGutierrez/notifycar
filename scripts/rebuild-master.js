const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 INICIANDO RESTAURACIÓN DE DATOS REALES (EPM319, NWZ170)...');

    try {
        // 1. Limpieza de tablas conflictivas para asegurar una carga limpia
        // Usamos executeRaw para limpiar de forma rápida y total como pidió el usuario
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE public."Notification", public."Vehicle", public."User", public."Organization", public."EmergencyConfig" CASCADE;`);
        console.log('✅ Tablas limpias.');

        // 2. Crear Organización Real
        const org = await prisma.organization.create({
            data: {
                id: 'test-org-id',
                name: 'Zona Azul Medellín',
                type: 'BLUE_ZONE',
                isActive: true
            }
        });
        console.log('✅ Organización creada.');

        // 3. Crear Usuarios Reales (Kelly y Lucas)
        const kelly = await prisma.user.create({
            data: {
                id: 'cmkh0877n0000ll6lc7klym0k',
                name: 'Kelly',
                email: 'kellyg@rowell.co',
                password: '$2b$10$tDFHwLFCLkE6gKGt8koawOOdS6a6DVWqQfXBUYYDMJ6qLmbkNnYoC', // Password: Admin123*
                role: 'ADMIN',
                phoneVerified: new Date(),
                termsAccepted: true
            }
        });

        const lucas = await prisma.user.create({
            data: {
                id: 'cmkhf3gex00005l25ulx303uh',
                name: 'Lucas Restrepo',
                email: 'lucas@rowell.co',
                password: '$2b$10$bKbKMGt6Jb6zD5leLhFyuutLNRMzNJFWnfOjLLXVKX92r24J2nKsy',
                role: 'ADMIN',
                phoneVerified: new Date(),
                termsAccepted: true
            }
        });
        console.log('✅ Usuarios Kelly y Lucas restaurados.');

        // 4. Crear Vehículos Reales (Como Particulares, sin organización)
        await prisma.vehicle.createMany({
            data: [
                {
                    id: 'cmkh1qvcj0001laghoxu4kube',
                    plate: 'EPM319',
                    brand: 'Chevrolet',
                    model: 'Spark GT',
                    color: 'Gris',
                    userId: kelly.id
                },
                {
                    id: 'cmkhf424q00025l25brz9l66f',
                    plate: 'NWZ170',
                    brand: 'BYD',
                    model: 'Seagull',
                    color: 'Blanco',
                    userId: lucas.id
                }
            ]
        });
        console.log('✅ Vehículos EPM319 y NWZ170 listos.');

        // 5. Configuración de Emergencia Real
        await prisma.emergencyConfig.create({
            data: {
                id: 'cmkrdv1rb0001eguxvbidcrsz',
                country: 'COLOMBIA',
                police: '123',
                transit: '127',
                emergency: '123'
            }
        });
        console.log('✅ Configuración de emergencia restaurada.');

        // 6. Configuración de Sistema (Habilitar Registro)
        await prisma.systemSetting.upsert({
            where: { id: 'default' },
            update: { allowRegistration: true, systemName: 'NotifyCar' },
            create: { id: 'default', allowRegistration: true, systemName: 'NotifyCar' }
        });

        console.log('\n✨ RESTAURACIÓN COMPLETADA CON ÉXITO');
        console.log('Busca la placa EPM319 para probar.');

    } catch (e) {
        console.error('❌ Error en el proceso:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
