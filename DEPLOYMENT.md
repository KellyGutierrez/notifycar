# 🚀 Guía de Despliegue Local con Docker - NotifyCar

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Docker Desktop para Windows**
   - Descarga desde: https://www.docker.com/products/docker-desktop
   - Versión mínima: 20.10+
   - Asegúrate de que Docker Desktop esté ejecutándose

2. **Git** (si aún no lo tienes)
   - Descarga desde: https://git-scm.com/download/win

## 🔧 Pasos de Despliegue

### **Paso 1: Verificar que Docker está funcionando**

Abre PowerShell o CMD y ejecuta:

```powershell
docker --version
docker-compose --version
```

Deberías ver las versiones instaladas. Si no, reinicia Docker Desktop.

---

### **Paso 2: Actualizar el archivo .env**

Actualiza tu archivo `.env` con la configuración de PostgreSQL:

```env
DATABASE_URL="postgresql://notifycaruser:notifycarpass@db:5432/notifycar"
NEXTAUTH_SECRET="supersecretkey123"
NEXTAUTH_URL="http://localhost:3000"
```

**Nota:** Cuando uses Docker Compose, el host de la base de datos es `db` (nombre del servicio), no `localhost`.

---

### **Paso 3: Construir y levantar los contenedores**

Desde la raíz del proyecto, ejecuta:

```powershell
# Construir las imágenes y levantar los contenedores
docker-compose up --build
```

Este comando:
- ✅ Descargará la imagen de PostgreSQL
- ✅ Construirá la imagen de tu aplicación Next.js
- ✅ Creará la base de datos
- ✅ Ejecutará las migraciones de Prisma
- ✅ Iniciará la aplicación en http://localhost:3000

**Primera vez:** Este proceso puede tardar 5-10 minutos dependiendo de tu conexión a internet.

---

### **Paso 4: Verificar que todo funciona**

Una vez que veas el mensaje:
```
notifycar-app | ▲ Next.js 16.0.10
notifycar-app | - Local:        http://localhost:3000
notifycar-app | ✓ Ready in XXXms
```

Abre tu navegador en: **http://localhost:3000**

---

### **Paso 5: Crear un usuario administrador (Opcional)**

Si necesitas crear un usuario admin, abre otra terminal y ejecuta:

```powershell
# Acceder al contenedor de la aplicación
docker exec -it notifycar-app sh

# Dentro del contenedor, ejecutar el script de admin
node set-admin.js tu-email@ejemplo.com

# Salir del contenedor
exit
```

---

## 🛠️ Comandos Útiles

### **Detener los contenedores**
```powershell
# Detener sin eliminar los datos
docker-compose stop

# Detener y eliminar contenedores (los datos persisten en volúmenes)
docker-compose down
```

### **Reiniciar los contenedores**
```powershell
# Iniciar contenedores existentes
docker-compose start

# O reiniciar todo
docker-compose restart
```

### **Ver logs en tiempo real**
```powershell
# Logs de todos los servicios
docker-compose logs -f

# Logs solo de la aplicación
docker-compose logs -f app

# Logs solo de la base de datos
docker-compose logs -f db
```

### **Acceder a la base de datos**
```powershell
# Conectarse a PostgreSQL
docker exec -it notifycar-db psql -U notifycaruser -d notifycar

# Dentro de PostgreSQL, puedes ejecutar:
# \dt          - Ver todas las tablas
# \d User      - Ver estructura de la tabla User
# SELECT * FROM "User";  - Ver todos los usuarios
# \q           - Salir
```

### **Reconstruir la aplicación después de cambios**
```powershell
# Si modificaste código, reconstruye la imagen
docker-compose up --build app
```

### **Limpiar todo y empezar de cero**
```powershell
# ⚠️ CUIDADO: Esto eliminará TODOS los datos
docker-compose down -v
docker-compose up --build
```

---

## 🔍 Solución de Problemas

### **Error: "port is already allocated"**
Otro servicio está usando el puerto 3000 o 5432.

**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID <PID> /F
```

O cambia los puertos en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

### **Error: "Cannot connect to database"**
La base de datos no está lista.

**Solución:**
```powershell
# Espera 30 segundos y vuelve a intentar
# O verifica los logs de la base de datos
docker-compose logs db
```

### **Error al construir la imagen**
Problemas con dependencias o caché.

**Solución:**
```powershell
# Limpiar caché de Docker y reconstruir
docker-compose build --no-cache
docker-compose up
```

### **La aplicación no refleja cambios en el código**
Docker está usando una versión anterior.

**Solución:**
```powershell
# Reconstruir la imagen
docker-compose up --build app
```

---

## 📊 Monitoreo

### **Ver estado de los contenedores**
```powershell
docker-compose ps
```

### **Ver uso de recursos**
```powershell
docker stats
```

### **Inspeccionar la red**
```powershell
docker network ls
docker network inspect proyecto_notifycar_default
```

---

## 🌐 Modo Desarrollo vs Producción

### **Desarrollo (con hot-reload)**
Si quieres desarrollo con recarga automática, modifica `docker-compose.yml`:

```yaml
app:
  # ... otras configuraciones
  command: sh -c "pnpm exec prisma db push && pnpm run dev"
  volumes:
    - ./src:/app/src
    - ./public:/app/public
  environment:
    - NODE_ENV=development
```

### **Producción (actual)**
La configuración actual está optimizada para producción.

---

## 📝 Notas Importantes

1. **Datos persistentes:** Los datos de la base de datos se guardan en un volumen de Docker (`postgres_data`), por lo que persisten incluso si detienes los contenedores.

2. **Variables de entorno:** Las variables en `docker-compose.yml` sobrescriben las del archivo `.env`.

3. **Primera ejecución:** La primera vez que ejecutes `docker-compose up`, se crearán las tablas automáticamente gracias a `prisma db push`.

4. **Backups:** Para hacer backup de la base de datos:
   ```powershell
   docker exec notifycar-db pg_dump -U notifycaruser notifycar > backup.sql
   ```

5. **Restaurar backup:**
   ```powershell
   docker exec -i notifycar-db psql -U notifycaruser notifycar < backup.sql
   ```

---

## 🎯 Próximos Pasos

Una vez que tengas todo funcionando:

1. ✅ Accede a http://localhost:3000
2. ✅ Regístrate como usuario
3. ✅ Crea un usuario admin con el script `set-admin.js`
4. ✅ Configura las plantillas de notificaciones
5. ✅ Prueba el sistema de notificaciones

---

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica que Docker Desktop esté ejecutándose
3. Asegúrate de que los puertos 3000 y 5432 estén libres
4. Intenta reconstruir: `docker-compose up --build`

---

**¡Listo! Tu aplicación NotifyCar debería estar corriendo en Docker.** 🎉
