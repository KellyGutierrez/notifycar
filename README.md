# 🚗 NotifyCar - Sistema de Notificaciones Backend

NotifyCar es un sistema backend que permite enviar notificaciones automáticas vía WhatsApp cuando se detecta un evento relacionado con un vehículo.

---

## 🔧 Tecnologías utilizadas

- n8n (automatización de flujos)
- API HTTP (Webhooks)
- Evolution API (WhatsApp)
- Next.js (frontend opcional)
- JSON

---

## ⚙️ Funcionamiento del Backend

1. El sistema recibe un request HTTP (POST) con información como:
   - Placa del vehículo
   - Número de teléfono
   - Mensaje personalizado

2. Se valida y procesa la información mediante un flujo automatizado en n8n

3. Se construye dinámicamente el mensaje

4. Se envía una notificación en tiempo real vía WhatsApp

5. Se retorna una respuesta con el estado del envío

---

## 📡 Ejemplo de Request

```json
{
  "plate": "NWZ170",
  "phoneNumber": "573104670304",
  "message": "Alerta automática de vehículo"
}
