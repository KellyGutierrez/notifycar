const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Iniciando RECONSTRUCCIÓN TOTAL del Sistema...');

    try {
        const hashedPassword = await bcrypt.hash('Admin123*', 10);
        const corporatePassword = await bcrypt.hash('corporate123', 10);

        // 0. Configuración Global del Sistema
        await prisma.systemSetting.upsert({
            where: { id: 'default' },
            update: {
                allowRegistration: true,
                systemName: 'NotifyCar',
                maintenanceMode: false
            },
            create: {
                id: 'default',
                allowRegistration: true,
                systemName: 'NotifyCar'
            }
        });
        console.log('✅ Configuración del sistema (Registro habilitado) lista.');

        // 1. Configuración de Emergencia (Colombia)
        await prisma.emergencyConfig.upsert({
            where: { country: 'Colombia' },
            update: {
                police: '123',
                transit: '4457777',
                emergency: '123'
            },
            create: {
                country: 'Colombia',
                police: '123',
                transit: '4457777',
                emergency: '123'
            }
        });
        console.log('✅ Números de emergencia (Colombia) cargados.');

        // 2. Organizaciones Maestras
        const orgs = [
            { id: 'clorg0001', name: 'Zona Azul Medellín', type: 'BLUE_ZONE' },
            { id: 'clorg0002', name: 'Alcaldía de Riosucio', type: 'INSTITUTIONAL' }
        ];

        for (const o of orgs) {
            await prisma.organization.upsert({
                where: { id: o.id },
                update: { name: o.name, type: o.type },
                create: o
            });
        }
        console.log('✅ Organizaciones (Medellín y Riosucio) listas.');

        // 3. Usuarios de Administración y Gestión
        const kelly = await prisma.user.upsert({
            where: { email: 'kellyg@rowell.co' },
            update: { role: 'ADMIN', phoneVerified: new Date() },
            create: {
                name: 'Kelly Gutierrez',
                email: 'kellyg@rowell.co',
                password: hashedPassword,
                role: 'ADMIN',
                phonePrefix: '57',
                phoneNumber: '3004019274',
                phoneVerified: new Date(),
                termsAccepted: true
            }
        });

        await prisma.user.upsert({
            where: { email: 'corporate@notifycar.com' },
            update: { organizationId: 'clorg0001', role: 'CORPORATE' },
            create: {
                name: 'Gestor Zona Azul',
                email: 'corporate@notifycar.com',
                password: corporatePassword,
                role: 'CORPORATE',
                organizationId: 'clorg0001',
                phoneVerified: new Date(),
                termsAccepted: true
            }
        });
        console.log('✅ Usuarios maestros (Kelly Admin y Corporativo) listos.');

        // 4. Vehículos de Prueba (KEV777 y otros)
        const testVehicles = [
            { plate: 'KEV777', brand: 'Hyundai', model: 'Grand i10', color: 'Amarillo', type: 'CAR', ownerName: 'Kelly G.', ownerPhone: '3004019274' },
            { plate: 'TAX123', brand: 'Kia', model: 'Picanto', color: 'Amarillo', type: 'CAR', ownerName: 'Empresa Taxi', ownerPhone: '3000000000' }
        ];

        for (const v of testVehicles) {
            await prisma.vehicle.upsert({
                where: { plate: v.plate },
                update: { organizationId: 'clorg0001' },
                create: {
                    ...v,
                    organizationId: 'clorg0001',
                    userId: kelly.id
                }
            });
        }
        console.log('✅ Vehículos de prueba cargados.');

        // 5. Plantillas de Servicio
        const templates = [
            { name: "🚖 No aceptó destino", content: "Estimado {{role}}, un pasajero reporta que el vehículo {{plate}} no quiso prestar el servicio al destino indicado.", category: "SERVICE", organizationId: 'clorg0001' },
            { name: "🗣️ Trato al usuario", content: "Estimado {{role}}, se informa de un reporte por trato inadecuado en el vehículo {{plate}}.", category: "SERVICE", organizationId: 'clorg0001' }
        ];

        for (const t of templates) {
            const existing = await prisma.notificationTemplate.findFirst({
                where: { name: t.name, organizationId: t.organizationId }
            });
            if (existing) {
                await prisma.notificationTemplate.update({ where: { id: existing.id }, data: t });
            } else {
                await prisma.notificationTemplate.create({ data: t });
            }
        }
        console.log('✅ Plantillas de servicio restauradas.');

        console.log('\n✨ OPERACIÓN EXITOSA: PC Nuevo sincronizado al 100%.');

    } catch (e) {
        console.error('❌ Error fatal:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
