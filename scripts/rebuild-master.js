const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando Reconstrucción Maestra de Base de Datos...');

    try {
        const hashedPassword = await bcrypt.hash('Admin123*', 10);
        const corporatePassword = await bcrypt.hash('corporate123', 10);

        // 0. Configuración del Sistema
        await prisma.systemSetting.upsert({
            where: { id: 'default' },
            update: { allowRegistration: true },
            create: { id: 'default', allowRegistration: true, systemName: 'NotifyCar' }
        });
        console.log('✅ Configuración del sistema inicializada.');

        // 1. Crear Organización Maestra
        const org = await prisma.organization.upsert({
            where: { id: 'clorg0001' },
            update: {
                name: 'Zona Azul Medellín',
                type: 'FLEET',
                messageWrapper: `🚗 *Hola {{role}}, NotifyCar te avisa:*
Alguien cerca de tu vehículo quiso avisarte lo siguiente:
“{{plate}} - {{mensaje}}”

ℹ️ Este aviso fue enviado a través de NotifyCar usando únicamente la placa de tu vehículo. No se compartió tu número ni ningún dato personal.

—
NotifyCar · Comunicación inteligente en la vía
www.notifycar.com`
            },
            create: {
                id: 'clorg0001',
                name: 'Zona Azul Medellín',
                type: 'FLEET',
                messageWrapper: `🚗 *Hola {{role}}, NotifyCar te avisa:*
Alguien cerca de tu vehículo quiso avisarte lo siguiente:
“{{plate}} - {{mensaje}}”

ℹ️ Este aviso fue enviado a través de NotifyCar usando únicamente la placa de tu vehículo. No se compartió tu número ni ningún dato personal.

—
NotifyCar · Comunicación inteligente en la vía
www.notifycar.com`
            }
        });
        console.log('✅ Organización "Zona Azul Medellín" lista.');

        // 2. Crear Usuarios (Kelly Admin y Usuario Corporativo)
        const kelly = await prisma.user.upsert({
            where: { email: 'kellyg@rowell.co' },
            update: { role: 'ADMIN', phoneVerified: new Date() },
            create: {
                name: 'Kelly',
                email: 'kellyg@rowell.co',
                password: hashedPassword,
                role: 'ADMIN',
                phonePrefix: '57',
                phoneNumber: '3004019274',
                phoneVerified: new Date(),
                termsAccepted: true
            }
        });
        console.log('✅ Usuario Admin "Kelly" listo.');

        const corpUser = await prisma.user.upsert({
            where: { email: 'corporate@notifycar.com' },
            update: { organizationId: org.id, role: 'CORPORATE' },
            create: {
                name: 'Gestor de Flota',
                email: 'corporate@notifycar.com',
                password: corporatePassword,
                role: 'CORPORATE',
                organizationId: org.id,
                phoneVerified: new Date(),
                termsAccepted: true
            }
        });
        console.log('✅ Usuario Corporativo listo.');

        // 3. Crear Vehículos de Prueba (Taxis)
        const testVehicles = [
            { plate: 'KEV777', brand: 'Hyundai', model: 'Grand i10', color: 'Amarillo', type: 'CAR', category: 'SERVICE', ownerName: 'Kelly G.', ownerPhone: '3004019274', driverName: 'Juan Conductor', driverPhone: '3001234567' },
            { plate: 'TAX123', brand: 'Kia', model: 'Picanto', color: 'Amarillo', type: 'CAR', category: 'SERVICE', ownerName: 'Admin Empresa', ownerPhone: '3000000000', driverName: 'Pedro Chofer', driverPhone: '3019876543' }
        ];

        for (const v of testVehicles) {
            await prisma.vehicle.upsert({
                where: { plate: v.plate },
                update: { organizationId: org.id },
                create: {
                    ...v,
                    organizationId: org.id,
                    userId: kelly.id
                }
            });
        }
        console.log(`✅ ${testVehicles.length} vehículos de prueba creados.`);

        // 4. Asegurar Plantillas de Servicio
        const templates = [
            {
                name: "🚖 No aceptó destino",
                content: "Estimado {{role}}, un pasajero reporta que el vehículo {{plate}} no quiso prestar el servicio al destino indicado. Por favor verificar esta situación.",
                category: "SERVICIO",
                organizationId: org.id
            },
            {
                name: "🗣️ Reporte de trato al usuario",
                content: "Estimado {{role}}, se informa que un pasajero reportó un trato inadecuado en el vehículo {{plate}}. Por favor mantener los estándares de cordialidad de la flota.",
                category: "SERVICIO",
                organizationId: org.id
            }
        ];

        for (const t of templates) {
            const existing = await prisma.notificationTemplate.findFirst({
                where: { name: t.name, organizationId: t.organizationId }
            });

            if (existing) {
                await prisma.notificationTemplate.update({
                    where: { id: existing.id },
                    data: t
                });
            } else {
                await prisma.notificationTemplate.create({
                    data: t
                });
            }
        }
        console.log('✅ Plantillas de servicio restauradas.');

        console.log('\n✨ RECONSTRUCCIÓN COMPLETADA CON ÉXITO');
        console.log('--------------------------------------');
        console.log('Ya puedes entrar con:');
        console.log('Admin: kellyg@rowell.co / Admin123*');
        console.log('Corp: corporate@notifycar.com / corporate123');
        console.log('Busca la placa: KEV777');

    } catch (e) {
        console.error('❌ Error en el proceso:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
