const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log('--- DIAGNÓSTICO DE BASE DE DATOS ---');
    try {
        // Intentar conectar
        await prisma.$connect();
        console.log('✅ Conexión a base de datos: OK');

        // Mostrar URL (sin password)
        const dbUrl = process.env.DATABASE_URL || 'No definida';
        const maskedUrl = dbUrl.replace(/:(\w+)@/, ':****@');
        console.log('📍 URL de conexión:', maskedUrl);

        // Contar vehículos
        const vehicleCount = await prisma.vehicle.count();
        console.log('🚗 Total de vehículos registrados:', vehicleCount);

        if (vehicleCount > 0) {
            const vehicles = await prisma.vehicle.findMany({
                take: 5,
                select: { plate: true, brand: true, model: true }
            });
            console.log('📋 Primeras placas encontradas:');
            vehicles.forEach(v => console.log(`   - ${v.plate} (${v.brand} ${v.model})`));
        } else {
            console.warn('⚠️ LA TABLA DE VEHÍCULOS ESTÁ VACÍA');
        }

    } catch (e) {
        console.error('❌ ERROR DE CONEXIÓN:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
