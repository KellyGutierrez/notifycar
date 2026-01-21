# 🖥️ Configuración Inicial - Windows

## 📥 Software Necesario para Desplegar NotifyCar

Esta guía te ayudará a preparar un PC con Windows desde cero para ejecutar el proyecto NotifyCar con Docker.

---

## 1️⃣ **Docker Desktop para Windows**

### **¿Qué es?**
Docker permite ejecutar aplicaciones en contenedores aislados. Es la herramienta principal que necesitas.

### **Requisitos del Sistema:**
- ✅ Windows 10 64-bit: Pro, Enterprise, o Education (Build 19041 o superior)
- ✅ Windows 11 64-bit
- ✅ Mínimo 4GB de RAM (recomendado 8GB+)
- ✅ Virtualización habilitada en BIOS

### **Descargar e Instalar:**

1. **Descarga Docker Desktop:**
   - 🔗 https://www.docker.com/products/docker-desktop
   - Haz clic en "Download for Windows"
   - Archivo: `Docker Desktop Installer.exe` (~500MB)

2. **Instalar:**
   - Ejecuta el instalador
   - ✅ Marca la opción: **"Use WSL 2 instead of Hyper-V"** (recomendado)
   - Sigue el asistente de instalación
   - **Reinicia el PC** cuando se te solicite

3. **Verificar instalación:**
   - Abre PowerShell o CMD
   - Ejecuta:
     ```powershell
     docker --version
     docker-compose --version
     ```
   - Deberías ver algo como:
     ```
     Docker version 24.0.x
     Docker Compose version v2.x.x
     ```

### **Configuración Inicial de Docker:**

1. Abre Docker Desktop
2. Ve a **Settings** (⚙️)
3. **Resources → Advanced:**
   - CPUs: 2-4 (según tu PC)
   - Memory: 4-8 GB
4. Haz clic en **Apply & Restart**

---

## 2️⃣ **Git para Windows**

### **¿Qué es?**
Git te permite clonar el repositorio del proyecto y gestionar versiones del código.

### **Descargar e Instalar:**

1. **Descarga Git:**
   - 🔗 https://git-scm.com/download/win
   - Descarga la versión de 64-bit
   - Archivo: `Git-x.xx.x-64-bit.exe` (~50MB)

2. **Instalar:**
   - Ejecuta el instalador
   - Usa las opciones predeterminadas (solo haz clic en "Next")
   - **Importante:** En "Adjusting your PATH environment", selecciona:
     ✅ **"Git from the command line and also from 3rd-party software"**

3. **Verificar instalación:**
   ```powershell
   git --version
   ```
   - Deberías ver: `git version 2.x.x`

---

## 3️⃣ **Editor de Código (Opcional pero Recomendado)**

### **Visual Studio Code**

1. **Descarga VS Code:**
   - 🔗 https://code.visualstudio.com/
   - Haz clic en "Download for Windows"
   - Archivo: `VSCodeUserSetup-x64-x.xx.x.exe` (~90MB)

2. **Instalar:**
   - Ejecuta el instalador
   - ✅ Marca todas las opciones de "Agregar al PATH"
   - ✅ Marca "Crear un icono en el escritorio"

3. **Extensiones Recomendadas:**
   Abre VS Code y ve a Extensions (Ctrl+Shift+X), instala:
   - **Docker** (Microsoft)
   - **Prisma** (Prisma)
   - **ESLint** (Microsoft)
   - **Tailwind CSS IntelliSense** (Tailwind Labs)

---

## 4️⃣ **Node.js (Opcional - Solo para desarrollo sin Docker)**

**⚠️ NOTA:** Si vas a usar Docker, **NO necesitas instalar Node.js** porque ya viene incluido en los contenedores.

### **Solo si quieres desarrollar sin Docker:**

1. **Descarga Node.js:**
   - 🔗 https://nodejs.org/
   - Descarga la versión **LTS** (Long Term Support)
   - Archivo: `node-v20.x.x-x64.msi` (~30MB)

2. **Instalar:**
   - Ejecuta el instalador
   - Usa las opciones predeterminadas

3. **Verificar:**
   ```powershell
   node --version
   npm --version
   ```

---

## 📋 **Checklist de Instalación**

Marca cada item cuando lo completes:

- [ ] Docker Desktop instalado y funcionando
- [ ] Git instalado
- [ ] Visual Studio Code instalado (opcional)
- [ ] Docker Desktop está ejecutándose (ícono en la bandeja)
- [ ] Puedes ejecutar `docker --version` sin errores
- [ ] Puedes ejecutar `git --version` sin errores

---

## 🚀 **Después de Instalar Todo**

### **Paso 1: Obtener el Proyecto**

Tienes dos opciones:

#### **Opción A: Clonar desde Git (si tienes repositorio)**
```powershell
# Navega a donde quieres el proyecto
cd C:\Users\TuUsuario\Documents

# Clona el repositorio
git clone https://github.com/tu-usuario/notifycar.git

# Entra a la carpeta
cd notifycar
```

#### **Opción B: Copiar archivos manualmente**
1. Copia toda la carpeta del proyecto desde el otro PC
2. Puedes usar:
   - USB
   - Carpeta compartida en red
   - OneDrive/Google Drive
   - Comprimir en ZIP y transferir

**Asegúrate de copiar TODA la carpeta**, incluyendo:
- ✅ Todos los archivos de código
- ✅ Carpeta `node_modules` (opcional, Docker la creará)
- ✅ Archivos `.env`, `docker-compose.yml`, `Dockerfile`
- ✅ Carpeta `prisma/`
- ✅ Carpeta `src/`
- ✅ `package.json`

---

### **Paso 2: Configurar Variables de Entorno**

1. Abre la carpeta del proyecto
2. Verifica que existe el archivo `.env`
3. Debería contener:
   ```env
   DATABASE_URL="postgresql://notifycaruser:notifycarpass@db:5432/notifycar"
   NEXTAUTH_SECRET="supersecretkey123"
   NEXTAUTH_URL="http://localhost:3000"
   ```

---

### **Paso 3: Levantar el Proyecto**

1. **Abre PowerShell o Terminal de Windows**
2. **Navega a la carpeta del proyecto:**
   ```powershell
   cd C:\ruta\a\tu\proyecto\notifycar
   ```

3. **Ejecuta Docker Compose:**
   ```powershell
   docker-compose up --build
   ```

4. **Espera a que termine** (5-10 minutos la primera vez)

5. **Abre tu navegador en:**
   - 🌐 http://localhost:3000

---

## 🔧 **Solución de Problemas Comunes**

### **❌ "Docker daemon is not running"**
**Solución:**
- Abre Docker Desktop desde el menú de inicio
- Espera a que el ícono en la bandeja deje de parpadear
- Vuelve a intentar

### **❌ "Virtualization is not enabled"**
**Solución:**
1. Reinicia el PC
2. Entra a la BIOS/UEFI (generalmente presionando F2, F10, o DEL al iniciar)
3. Busca "Virtualization Technology" o "VT-x" o "AMD-V"
4. Habilítalo
5. Guarda y reinicia

### **❌ "WSL 2 installation is incomplete"**
**Solución:**
```powershell
# Ejecuta como Administrador
wsl --install
wsl --update
```
Luego reinicia el PC.

### **❌ "Port 3000 is already in use"**
**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID)
taskkill /PID <número> /F
```

---

## 📊 **Verificar que Todo Funciona**

### **1. Docker Desktop está corriendo:**
- ✅ Ícono de Docker en la bandeja del sistema
- ✅ No muestra errores

### **2. Contenedores están activos:**
```powershell
docker ps
```
Deberías ver 2 contenedores:
- `notifycar-app`
- `notifycar-db`

### **3. La aplicación responde:**
- Abre http://localhost:3000
- Deberías ver la página principal de NotifyCar

---

## 🎯 **Resumen de Comandos Útiles**

```powershell
# Iniciar el proyecto
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener el proyecto
docker-compose down

# Reconstruir después de cambios
docker-compose up --build

# Ver estado de contenedores
docker ps

# Limpiar todo y empezar de cero
docker-compose down -v
docker-compose up --build
```

---

## 📞 **Próximos Pasos**

Una vez que tengas todo instalado y funcionando:

1. ✅ Lee el archivo `DEPLOYMENT.md` para instrucciones detalladas
2. ✅ Crea tu primer usuario en http://localhost:3000
3. ✅ Configura un usuario administrador
4. ✅ Explora el panel de administración

---

## 💾 **Requisitos Mínimos del PC**

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **Sistema Operativo** | Windows 10 Pro 64-bit | Windows 11 Pro |
| **RAM** | 4 GB | 8 GB+ |
| **Disco Duro** | 10 GB libres | 20 GB+ SSD |
| **Procesador** | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| **Internet** | Requerido para descarga inicial | - |

---

## ✅ **¡Listo para Empezar!**

Con esta guía deberías poder configurar cualquier PC con Windows para ejecutar NotifyCar.

**Tiempo estimado de configuración:** 30-60 minutos (dependiendo de la velocidad de internet)

---

**¿Necesitas ayuda?** Revisa la sección de "Solución de Problemas" o consulta `DEPLOYMENT.md` para más detalles.
