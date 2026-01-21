# 🚀 Inicio Rápido - NotifyCar con Git

## ✅ Pre-requisitos Completados
- ✅ Git instalado
- ✅ Docker Desktop instalado
- ✅ Proyecto en repositorio Git

---

## 📝 Pasos a Seguir en el Nuevo PC

### **1️⃣ Verificar que Docker está corriendo**

1. Abre **Docker Desktop** desde el menú de inicio
2. Espera a que el ícono en la bandeja del sistema deje de parpadear
3. Verifica que está funcionando:

```powershell
docker --version
docker-compose --version
```

Deberías ver las versiones instaladas.

---

### **2️⃣ Clonar el Repositorio**

Abre **PowerShell** o **Terminal de Windows** y ejecuta:

```powershell
# Navega a donde quieres el proyecto (ejemplo: Documentos)
cd C:\Users\TuUsuario\Documents

# Clona el repositorio
git clone https://github.com/tu-usuario/notifycar.git

# Entra a la carpeta del proyecto
cd notifycar
```

**Nota:** Reemplaza `https://github.com/tu-usuario/notifycar.git` con la URL real de tu repositorio.

---

### **3️⃣ Crear el archivo .env**

El archivo `.env` **NO** se sube a Git por seguridad, así que debes crearlo manualmente:

```powershell
# Crear el archivo .env
New-Item -Path .env -ItemType File

# Abrirlo con el bloc de notas
notepad .env
```

Copia y pega este contenido en el archivo `.env`:

```env
DATABASE_URL="postgresql://notifycaruser:notifycarpass@db:5432/notifycar"

NEXTAUTH_SECRET="supersecretkey123"
NEXTAUTH_URL="http://localhost:3000"
```

**Guarda y cierra** el bloc de notas.

---

### **4️⃣ Levantar el Proyecto con Docker**

```powershell
# Asegúrate de estar en la carpeta del proyecto
cd C:\Users\TuUsuario\Documents\notifycar

# Levantar el proyecto (primera vez)
docker-compose up --build
```

**Esto hará:**
- 🗄️ Descargar la imagen de PostgreSQL
- 🏗️ Construir la aplicación Next.js
- 📦 Instalar todas las dependencias
- 🚀 Crear la base de datos
- ✅ Ejecutar migraciones de Prisma
- 🌐 Iniciar la aplicación

**⏱️ Tiempo estimado:** 5-10 minutos la primera vez

---

### **5️⃣ Verificar que Funciona**

Cuando veas este mensaje en la terminal:

```
notifycar-app | ▲ Next.js 16.0.10
notifycar-app | - Local:        http://localhost:3000
notifycar-app | ✓ Ready in XXXms
```

**Abre tu navegador en:** http://localhost:3000

¡Deberías ver la aplicación NotifyCar funcionando! 🎉

---

## 🎯 Comandos Útiles

### **Detener el proyecto:**
```powershell
# Presiona Ctrl + C en la terminal, luego:
docker-compose down
```

### **Iniciar de nuevo (después de la primera vez):**
```powershell
docker-compose up
```
(Sin `--build` porque ya está construido)

### **Ver logs:**
```powershell
docker-compose logs -f
```

### **Reconstruir después de cambios en el código:**
```powershell
git pull  # Obtener últimos cambios
docker-compose up --build
```

---

## 🔄 Flujo de Trabajo Diario

```powershell
# 1. Abrir Docker Desktop (si no está abierto)

# 2. Navegar al proyecto
cd C:\Users\TuUsuario\Documents\notifycar

# 3. Obtener últimos cambios (opcional)
git pull

# 4. Levantar el proyecto
docker-compose up

# 5. Trabajar en http://localhost:3000

# 6. Cuando termines, detener:
# Ctrl + C, luego:
docker-compose down
```

---

## 🛠️ Solución de Problemas

### **❌ "Cannot connect to the Docker daemon"**
**Solución:**
- Abre Docker Desktop
- Espera a que inicie completamente
- Vuelve a intentar

### **❌ "Port 3000 is already allocated"**
**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso
taskkill /PID <número> /F
```

### **❌ "Error: .env file not found"**
**Solución:**
- Verifica que creaste el archivo `.env` en la raíz del proyecto
- Asegúrate de que tiene el contenido correcto (ver paso 3)

### **❌ Cambios en el código no se reflejan**
**Solución:**
```powershell
# Reconstruir la imagen
docker-compose up --build
```

---

## 📊 Estructura del Proyecto

Después de clonar, deberías tener:

```
notifycar/
├── .env                    ← Crear manualmente (paso 3)
├── docker-compose.yml      ← Configuración de Docker
├── Dockerfile              ← Imagen de la aplicación
├── package.json            ← Dependencias
├── prisma/                 ← Esquema de base de datos
├── src/                    ← Código fuente
├── public/                 ← Archivos públicos
├── QUICK-START.md          ← Esta guía
├── DEPLOYMENT.md           ← Guía detallada
└── SETUP-WINDOWS.md        ← Guía de instalación
```

---

## ✅ Checklist de Inicio

- [ ] Docker Desktop instalado y ejecutándose
- [ ] Git instalado
- [ ] Repositorio clonado
- [ ] Archivo `.env` creado con las variables correctas
- [ ] `docker-compose up --build` ejecutado
- [ ] Aplicación accesible en http://localhost:3000
- [ ] ¡Listo para trabajar! 🎉

---

## 🔐 Crear Usuario Administrador

Una vez que la aplicación esté funcionando:

```powershell
# Acceder al contenedor
docker exec -it notifycar-app sh

# Crear admin (reemplaza con tu email)
node set-admin.js tu-email@ejemplo.com

# Salir
exit
```

---

## 📚 Más Información

- **Guía completa de despliegue:** `DEPLOYMENT.md`
- **Configuración de Windows:** `SETUP-WINDOWS.md`
- **Enlaces de descarga:** `DOWNLOADS.md`

---

## 🎯 Resumen Ultra-Rápido

```powershell
# 1. Clonar
git clone https://github.com/tu-usuario/notifycar.git
cd notifycar

# 2. Crear .env
notepad .env
# (Copiar contenido del paso 3)

# 3. Levantar
docker-compose up --build

# 4. Abrir navegador
# http://localhost:3000
```

---

**¡Eso es todo!** En menos de 15 minutos deberías tener NotifyCar funcionando. 🚀
