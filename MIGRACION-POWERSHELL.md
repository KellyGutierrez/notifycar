# 🚀 Guía de Migración para el PC Nuevo (PowerShell)

Sigue estos pasos exactos en tu nuevo computador para que NotifyCar funcione perfectamente, incluyendo las notificaciones de WhatsApp.

### 1. Clonar el proyecto
Primero, abre **PowerShell** y navega a donde quieras guardar el proyecto (ejemplo: `Documents`):
```powershell
cd C:\Users\rowel\Documents
git clone https://github.com/tu-usuario/notifycar.git
cd notifycar
```

### 2. Instalar dependencias
Instala todas las librerías necesarias:
```powershell
npm install
```

### 3. Configurar la Base de Datos (Crucial)
Asegúrate de que **Docker Desktop** esté abierto y la base de datos funcionando. Luego ejecuta este comando para crear las tablas de WhatsApp:
```powershell
.\node_modules\.bin\prisma.cmd db push
```
*Si este comando falla por permisos, usa:*
`npx prisma db push`

### 4. Configurar el archivo `.env`
Crea un archivo llamado `.env` en la raíz y asegúrate de que tenga esto:
```env
DATABASE_URL="postgresql://notifycaruser:notifycarpass@localhost:5432/notifycar?schema=public"
NEXTAUTH_SECRET="supersecretkey123"
NEXTAUTH_URL="http://localhost:3000"
NOTIFICATION_WEBHOOK_URL="https://n8n.vps.rowell.digital/webhook/d5baf17a-d1cf-4f7d-880d-951087a66490"
```

### 5. Iniciar la aplicación
Ejecuta el servidor de desarrollo:
```powershell
npm run dev
```

---

### ✅ ¿Cómo verificar que el WhatsApp funciona?
1. Entra a `http://localhost:3000`.
2. Ve a **Mi Flota** (Panel Corporativo).
3. Edita un vehículo y guarda un número de WhatsApp en "Propietario".
4. Si al recargar el número sigue ahí, la base de datos está perfecta.
5. Haz clic en el icono de **Enviar Aviso** (Avión) y selecciona al Propietario.
6. ¡El mensaje debería llegar a tu WhatsApp a través de n8n!
