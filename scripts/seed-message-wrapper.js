const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const defaultWrapper = `🔔 *N O T I F Y C A R*
______________________________

📢 *AVISO PARA TU {{tipo}}*
{{electrico}}
{{icono}} *PLACA:* *{{placa}}*

______________________________

💬 *MENSAJE:*
*“{{mensaje}}”*

______________________________

ℹ️ _Este aviso fue enviado a través de NotifyCar de forma 100% anónima. Tus datos personales NO han sido compartidos._

🔐 *Seguridad:* _Mantén la calma y verifica el entorno antes de acercarte al vehículo._

📞 *Números de Emergencia:*
• Policía: *{{policia}}*
• Tránsito: *{{transito}}*
• Emergencias: *{{emergencia}}*

—
*NotifyCar* · _Comunicación inteligente en la vía_
www.notifycar.com`;

    console.log('Actualizando formato de mensaje global...');

    await prisma.systemSetting.upsert({
        where: { id: "default" },
        update: { messageWrapper: defaultWrapper },
        create: {
            id: "default",
            messageWrapper: defaultWrapper
        }
    });

    console.log('¡Formato de mensaje global actualizado con éxito!');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
