
export async function sendWhatsAppMessage(phone: string, message: string) {
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const evolutionKey = process.env.EVOLUTION_API_KEY;
    const evolutionInstance = process.env.EVOLUTION_INSTANCE || "Notifycar";

    if (!evolutionUrl || !evolutionKey || evolutionKey === "TU_API_KEY_AQUÍ") {
        console.warn("⚠️ Evolution API not configured. Skipping message.");
        return false;
    }

    try {
        // Limpiar: dejar solo dígitos
        let fullPhone = phone.replace(/\D/g, '');

        // Si tiene 10 dígitos (Colombia) y no empieza por 57, se lo ponemos
        if (fullPhone.length === 10 && !fullPhone.startsWith('57')) {
            fullPhone = `57${fullPhone}`;
        }

        console.log(`🚀 Sending WhatsApp to ${fullPhone}...`);

        const response = await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': evolutionKey
            },
            body: JSON.stringify({
                number: fullPhone,
                options: {
                    delay: 1200,
                    presence: "composing",
                    linkPreview: true
                },
                textMessage: {
                    text: message
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`❌ Evolution API Error (${response.status}):`, error);
            return false;
        }

        console.log("📱 Evolution API Message Sent Successfully");
        return true;
    } catch (err) {
        console.error("❌ Error sending WhatsApp message:", err);
        return false;
    }
}
