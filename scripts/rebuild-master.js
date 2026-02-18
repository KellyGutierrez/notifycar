const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsers() {
    console.log('⏳ Recuperando usuarios principales (Kelly, Lucas, Nathaly)...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = [
        { id: 'usr-kelly', name: 'Kelly', email: 'kellyg@rowell.co', role: 'ADMIN', termsAccepted: true },
        { id: 'usr-lucas', name: 'Lucas Restrepo', email: 'lucas@rowell.co', role: 'ADMIN', termsAccepted: true },
        { id: 'usr-nath', name: 'Nathaly Gil', email: 'nathaly@rowell.co', role: 'USER', termsAccepted: true }
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: { ...u },
            create: { ...u, password: hashedPassword }
        });
    }
}

async function seedEmergencies() {
    console.log('⏳ Sembrando números de emergencia...');
    const configs = [
        { country: "CO", police: "123", transit: "127", emergency: "123" },
        { country: "COLOMBIA", police: "123", transit: "127", emergency: "123" },
        { country: "MX", police: "911", transit: "911", emergency: "911" },
        { country: "MEXICO", police: "911", transit: "911", emergency: "911" },
        { country: "MÉXICO", police: "911", transit: "911", emergency: "911" },
        { country: "ES", police: "091", transit: "092", emergency: "112" },
        { country: "ESPAÑA", police: "091", transit: "092", emergency: "112" },
        { country: "AR", police: "911", transit: "911", emergency: "911" },
        { country: "ARGENTINA", police: "911", transit: "911", emergency: "911" },
        { country: "CL", police: "133", transit: "133", emergency: "133" },
        { country: "CHILE", police: "133", transit: "133", emergency: "133" },
        { country: "US", police: "911", transit: "911", emergency: "911" },
        { country: "UNITED STATES", police: "911", transit: "911", emergency: "911" },
        { country: "ESTADOS UNIDOS", police: "911", transit: "911", emergency: "911" },
    ];

    for (const c of configs) {
        await prisma.emergencyConfig.upsert({
            where: { country: c.country },
            update: c,
            create: c
        });
    }
}

async function seedCorporate() {
    console.log('⏳ Configurando datos corporativos y Zona Azul...');

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

    const hashedPassword = await bcrypt.hash('corporate123', 10);
    await prisma.user.upsert({
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

    const corpTemplates = [
        { name: 'Pago pendiente - Zona Azul', content: 'Hola, notamos que te retiraste sin cancelar el parqueo de la Zona Azul. Por favor acércate al operador o realiza el pago por la app.', vehicleType: 'ALL', category: 'URGENT' },
        { name: 'Tiempo expirado - Zona Azul', content: 'Hola, tu tiempo de parqueo en la Zona Azul ha expirado. Evita sanciones renovando tu tiquete con el operador.', vehicleType: 'ALL', category: 'COMMON' },
        { name: 'Vehículo mal posicionado', content: 'Hola, tu vehículo está ocupando más de un espacio en la Zona Azul. Por favor corrígelo para evitar ser reportado a tránsito.', vehicleType: 'CAR', category: 'COMMON' }
    ];

    for (const t of corpTemplates) {
        const existing = await prisma.notificationTemplate.findFirst({
            where: { name: t.name, organizationId: organization.id }
        });
        if (!existing) {
            await prisma.notificationTemplate.create({
                data: { ...t, organizationId: organization.id, isActive: true, type: 'APP' }
            });
        }
    }
}

async function seedTemplates() {
    console.log('⏳ Migrando plantillas de mensajes generales...');
    const templates = [
        { name: "Bloqueo de vía", content: "Tu vehículo está bloqueando una salida. ¿Podrías revisarlo, por favor?", vehicleType: "ALL", category: "COMMON" },
        { name: "Mal parqueado", content: "Tu vehículo está mal parqueado y podría ser remolcado.", vehicleType: "ALL", category: "COMMON" },
        { name: "Frente a salida", content: "Parece que tu vehículo está mal parqueado en una salida de parqueadero", vehicleType: "ALL", category: "COMMON" },
        { name: "Obstrucción paso", content: "Tu vehículo está obstruyendo el paso y está afectando la circulación.", vehicleType: "ALL", category: "COMMON" },
        { name: "Alarma sonando", content: "La alarma de tu vehículo lleva un tiempo sonando.", vehicleType: "ALL", category: "COMMON" },
        { name: "Llanta baja", content: "Una de las llantas de tu vehículo parece estar baja.", vehicleType: "ALL", category: "COMMON" },
        { name: "Vandalismo", content: "Tu vehículo presenta señales de vandalismo.", vehicleType: "ALL", category: "URGENT" },
        { name: "Estacionarias prendidas", content: "Dejaste las luces estacionarias prendidas. Por favor revísalas para no agotar la batería.", vehicleType: "ALL", category: "COMMON" },
        { name: "Puerta abierta", content: "Una de las puertas de tu vehículo está abierta.", vehicleType: "CAR", category: "COMMON" },
        { name: "Vidrio roto", content: "Uno de los vidrios de tu vehículo parece estar roto.", vehicleType: "CAR", category: "URGENT" },
        { name: "Fin de carga", content: "Tu vehículo ya terminó de cargar y hay otros esperando el punto.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Ocupando cargador", content: "Tu vehículo está ocupando un cargador y no está cargando.", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Mal parqueo cargador", content: "Tu vehículo está mal parqueado y no permite usar uno de los cargadores", vehicleType: "ELECTRIC", category: "COMMON" },
        { name: "Riesgo de caída", content: "Tu moto podría caerse o moverse.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Casco olvidado", content: "Dejaste un casco sobre la moto o colgado, podrías perderlo.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Llaves pegadas", content: "Olvidaste las llaves puestas en el encendido o en el seguro del asiento.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Pata mal puesta", content: "La pata de apoyo se está hundiendo o está mal puesta, hay riesgo de caída.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Fuga de líquidos", content: "Parece que tu moto está goteando gasolina o aceite.", vehicleType: "MOTORCYCLE", category: "URGENT" },
        { name: "Luces encendidas", content: "Dejaste las luces de tu moto encendidas, podrías quedarte sin batería.", vehicleType: "MOTORCYCLE", category: "COMMON" },
        { name: "Interés en compra", content: "Estoy interesado en comprar tu vehículo.", vehicleType: "ALL", category: "COMMERCIAL" },
    ];

    for (const t of templates) {
        const existing = await prisma.notificationTemplate.findFirst({
            where: { name: t.name, organizationId: null }
        });
        if (existing) {
            await prisma.notificationTemplate.update({
                where: { id: existing.id },
                data: { ...t, isActive: true }
            });
        } else {
            await prisma.notificationTemplate.create({
                data: t
            });
        }
    }
}

async function main() {
    console.log('🚀 Iniciando RECONSTRUCCIÓN MAESTRA...');
    try {
        await seedUsers();
        await seedEmergencies();
        await seedCorporate();
        await seedTemplates();
        console.log('✨ ¡Base de datos reconstruida con éxito!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
