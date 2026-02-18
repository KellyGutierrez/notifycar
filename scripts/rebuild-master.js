const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 INICIANDO REPARACIÓN Y CARGA DE DATOS REALES INTERNACIONALES...');

    try {
        // 1. Limpieza total
        // Intentamos limpiar NotificationTemplate si existe
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE public."NotificationTemplate" CASCADE;`);
        } catch (e) { }

        await prisma.$executeRawUnsafe(`TRUNCATE TABLE public."Notification", public."Vehicle", public."User", public."Organization", public."EmergencyConfig" CASCADE;`);

        // 2. Usuarios Reales
        const usersData = [
            { id: 'usr-kelly', name: 'Kelly', email: 'kellyg@rowell.co', role: 'ADMIN' },
            { id: 'usr-nathaly', name: 'Nathaly Gil', email: 'nathaly@rowell.co', role: 'USER' },
            { id: 'usr-lucas', name: 'Lucas Restrepo', email: 'lucas@rowell.co', role: 'ADMIN' }
        ];

        for (const u of usersData) {
            await prisma.user.create({
                data: {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    password: '$2b$10$tDFHwLFCLkE6gKGt8koawOOdS6a6DVWqQfXBUYYDMJ6qLmbkNnYoC', // Admin123*
                    phonePrefix: '57',
                    phoneVerified: new Date(),
                    termsAccepted: true
                }
            });
        }
        console.log('✅ Usuarios restaurados.');

        // 3. Vehículos Reales
        const vehiclesData = [
            { id: 'v-epm319', plate: 'EPM319', brand: 'Chevrolet', model: 'Spark GT', color: 'Gris', type: 'CAR', userId: 'usr-kelly' },
            { id: 'v-hhw968', plate: 'HHW968', brand: 'Honda', model: 'Fit', color: 'Gris plata', type: 'CAR', userId: 'usr-nathaly' },
            { id: 'v-lpw187', plate: 'LPW187', brand: 'Volkswagen', model: 'Taos', color: 'Gris Oscuro', type: 'CAR', userId: 'usr-lucas' },
            { id: 'v-nwz170', plate: 'NWZ170', brand: 'BYD', model: 'Seagull', color: 'Blanco', type: 'CAR', userId: 'usr-lucas' },
            { id: 'v-zag82', plate: 'ZAG82', brand: 'Yamaha', model: 'Chappy', color: 'Roja', type: 'MOTORCYCLE', userId: 'usr-lucas' }
        ];

        for (const v of vehiclesData) {
            await prisma.vehicle.create({ data: v });
        }
        console.log('✅ Vehículos cargados.');

        // 4. Plantillas de Notificación
        await prisma.notificationTemplate.createMany({
            data: [
                { name: 'Vehículo mal parqueado', content: 'Tu vehículo está mal parqueado, por favor moverlo.', vehicleType: 'ALL', category: 'URGENT' },
                { name: 'Luces encendidas', content: 'Dejaste las luces encendidas de tu vehículo.', vehicleType: 'ALL', category: 'COMMON' },
                { name: 'Bloqueo de salida', content: 'Tu vehículo está bloqueando una salida.', vehicleType: 'ALL', category: 'URGENT' }
            ]
        });
        console.log('✅ Plantillas de notificación creadas.');

        // 5. Configuración de Sistema
        await prisma.systemSetting.upsert({
            where: { id: 'default' },
            update: { allowRegistration: true, systemName: 'NotifyCar' },
            create: { id: 'default', allowRegistration: true, systemName: 'NotifyCar' }
        });

        console.log('\n✨ ÉXITO TOTAL: Sistema sincronizado.');

    } catch (e) {
        console.error('❌ ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
