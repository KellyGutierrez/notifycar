# 💾 Guía de Migración de Base de Datos

Esta guía te ayudará a transferir la base de datos de tu PC anterior al nuevo PC local.

---   

## 🎯 **3 Métodos Disponibles**

### **Método 1: Usando pgAdmin (Recomendado - Interfaz Gráfica)** ⭐

#### **En el PC ANTERIOR (Exportar):**

1. **Levantar pgAdmin:**
   ```powershell
   docker-compose up -d pgadmin
   ```

2. **Abrir pgAdmin:**
   - Ve a: http://localhost:5050
   - Usuario: `admin@notifycar.com`
   - Contraseña: `admin123`

3. **Conectar al servidor:**
   - Click derecho en "Servers" → "Register" → "Server"
   - **General Tab:**
     - Name: `NotifyCar DB`
   - **Connection Tab:**
     - Host: `db` (o `notifycar-db`)
     - Port: `5432`
     - Database: `notifycar`
     - Username: `notifycaruser`
     - Password: `notifycarpass`
   - Guardar

4. **Exportar la base de datos:**
   - Click derecho en la base de datos `notifycar`
   - Selecciona: **"Backup..."**
   - **Configuración:**
     - Filename: `notifycar_backup_2026-01-22.sql` (elige una ruta accesible)
     - Format: `Plain` (SQL)
     - Encoding: `UTF8`
   - **Opciones:**
     - ✅ Data: YES
     - ✅ Blobs: YES
     - ✅ Owner: YES
   - Click "Backup"

5. **Copiar el archivo generado:**
   - El archivo `.sql` se guardará en el contenedor
   - Para copiarlo a tu PC:
   ```powershell
   docker cp notifycar-pgadmin:/var/lib/pgadmin/storage/admin_notifycar.com/notifycar_backup_2026-01-22.sql C:\Users\rowel\Desktop\
   ```
   
   O más fácil, usa la opción de descarga desde pgAdmin.

#### **En el PC NUEVO (Importar):**

1. **Copiar el archivo de backup:**
   - Transfiere el archivo `.sql` al nuevo PC (USB, red, etc.)
   - Colócalo en: `C:\Users\rowel\Desktop\notifycar_backup.sql`

2. **Levantar los servicios:**
   ```powershell
   cd C:\Users\rowel\proyecto_notifycar
   docker-compose up -d
   ```

3. **Copiar el backup al contenedor de pgAdmin:**
   ```powershell
   docker cp C:\Users\rowel\Desktop\notifycar_backup.sql notifycar-pgadmin:/tmp/backup.sql
   ```

4. **Abrir pgAdmin:**
   - Ve a: http://localhost:5050
   - Usuario: `admin@notifycar.com`
   - Contraseña: `admin123`

5. **Conectar al servidor** (igual que en el paso anterior)

6. **Restaurar la base de datos:**
   - Click derecho en la base de datos `notifycar`
   - Selecciona: **"Restore..."**
   - **Configuración:**
     - Filename: `/tmp/backup.sql`
     - Format: `Plain`
   - Click "Restore"

---

### **Método 2: Usando Adminer (Más Simple)** 🚀

Ya tienes Adminer configurado en el puerto 8080.

#### **En el PC ANTERIOR (Exportar):**

1. **Abrir Adminer:**
   - Ve a: http://localhost:8080
   - **Login:**
     - System: `PostgreSQL`
     - Server: `db`
     - Username: `notifycaruser`
     - Password: `notifycarpass`
     - Database: `notifycar`

2. **Exportar:**
   - Click en "Export" (menú superior)
   - **Configuración:**
     - Output: `save` (descargar archivo)
     - Format: `SQL`
     - Database: `notifycar`
     - ✅ Tables: (seleccionar todas)
     - ✅ Data: YES
   - Click "Export"
   - Se descargará un archivo `.sql`

#### **En el PC NUEVO (Importar):**

1. **Abrir Adminer:**
   - Ve a: http://localhost:8080
   - Login con las mismas credenciales

2. **Importar:**
   - Click en "Import" (menú superior)
   - Click "Choose File" y selecciona tu archivo `.sql`
   - Click "Execute"

---

### **Método 3: Línea de Comandos (Más Rápido)** ⚡

Este método es el más directo si te sientes cómodo con la terminal.

#### **En el PC ANTERIOR (Exportar):**

```powershell
# Exportar la base de datos completa
docker exec -t notifycar-db pg_dump -U notifycaruser -d notifycar > C:\Users\rowel\Desktop\notifycar_backup.sql
```

O si quieres un formato comprimido:

```powershell
# Exportar comprimido (más rápido de transferir)
docker exec -t notifycar-db pg_dump -U notifycaruser -d notifycar -F c -f /tmp/backup.dump

# Copiar del contenedor a tu PC
docker cp notifycar-db:/tmp/backup.dump C:\Users\rowel\Desktop\notifycar_backup.dump
```

#### **En el PC NUEVO (Importar):**

**Opción A: Desde archivo SQL:**

```powershell
# Copiar el backup al contenedor
docker cp C:\Users\rowel\Desktop\notifycar_backup.sql notifycar-db:/tmp/backup.sql

# Restaurar
docker exec -i notifycar-db psql -U notifycaruser -d notifycar < C:\Users\rowel\Desktop\notifycar_backup.sql
```

O más directo:

```powershell
# Restaurar directamente
Get-Content C:\Users\rowel\Desktop\notifycar_backup.sql | docker exec -i notifycar-db psql -U notifycaruser -d notifycar
```

**Opción B: Desde archivo comprimido (.dump):**

```powershell
# Copiar al contenedor
docker cp C:\Users\rowel\Desktop\notifycar_backup.dump notifycar-db:/tmp/backup.dump

# Restaurar
docker exec -i notifycar-db pg_restore -U notifycaruser -d notifycar -c /tmp/backup.dump
```

---

## 🔄 **Método Alternativo: Copiar el Volumen Directamente**

Si tienes acceso físico a ambos PCs o una red compartida:

### **En el PC ANTERIOR:**

```powershell
# Detener los contenedores
docker-compose down

# Exportar el volumen de datos
docker run --rm -v notifycar_postgres_data:/data -v C:\backup:/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .
```

### **En el PC NUEVO:**

```powershell
# Copiar el archivo postgres_data.tar.gz al nuevo PC

# Detener los contenedores
docker-compose down

# Importar el volumen
docker run --rm -v notifycar_postgres_data:/data -v C:\backup:/backup alpine tar xzf /backup/postgres_data.tar.gz -C /data

# Levantar los servicios
docker-compose up -d
```

---

## ✅ **Verificar que la Migración Fue Exitosa**

Después de importar, verifica:

1. **Conectar a la base de datos:**
   - Adminer: http://localhost:8080
   - pgAdmin: http://localhost:5050

2. **Verificar tablas:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **Contar registros:**
   ```sql
   SELECT COUNT(*) FROM "User";
   SELECT COUNT(*) FROM "Vehicle";
   SELECT COUNT(*) FROM "Notification";
   ```

4. **Probar la aplicación:**
   - Ve a: http://localhost:3000
   - Intenta iniciar sesión con tus credenciales anteriores
   - Verifica que tus datos estén presentes

---

## 🚨 **Solución de Problemas**

### **Error: "database is being accessed by other users"**

```powershell
# Desconectar todos los usuarios
docker exec -it notifycar-db psql -U notifycaruser -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'notifycar';"

# Intentar de nuevo la restauración
```

### **Error: "relation already exists"**

Si la base de datos ya tiene tablas, primero bórralas:

```powershell
# Opción 1: Borrar y recrear la base de datos
docker exec -it notifycar-db psql -U notifycaruser -d postgres -c "DROP DATABASE notifycar;"
docker exec -it notifycar-db psql -U notifycaruser -d postgres -c "CREATE DATABASE notifycar OWNER notifycaruser;"

# Luego importa de nuevo
```

O usa la opción `-c` (clean) en pg_restore:

```powershell
docker exec -i notifycar-db pg_restore -U notifycaruser -d notifycar -c /tmp/backup.dump
```

### **Importación muy lenta**

Para archivos grandes, usa el formato comprimido (.dump) en lugar de SQL plano.

---

## 📊 **Comparación de Métodos**

| Método | Dificultad | Velocidad | Recomendado Para |
|--------|-----------|-----------|------------------|
| **pgAdmin** | Fácil | Media | Usuarios que prefieren interfaz gráfica |
| **Adminer** | Muy Fácil | Media | Bases de datos pequeñas/medianas |
| **Línea de Comandos** | Media | Rápida | Usuarios técnicos, bases grandes |
| **Copiar Volumen** | Difícil | Muy Rápida | Migración completa del servidor |

---

## 💡 **Recomendación Final**

Para tu caso, te recomiendo:

1. **Primera vez:** Usa **Adminer** (Método 2) - Es el más simple
2. **Si tienes muchos datos:** Usa **Línea de Comandos** (Método 3) - Es más rápido
3. **Si quieres control total:** Usa **pgAdmin** (Método 1) - Más opciones

---

## 🔐 **Backup Automático (Bonus)**

Para evitar perder datos en el futuro, puedes crear backups automáticos:

```powershell
# Crear un script de backup diario
# Guardar como: backup-db.ps1

$date = Get-Date -Format "yyyy-MM-dd"
$backupFile = "C:\backups\notifycar_$date.sql"

docker exec -t notifycar-db pg_dump -U notifycaruser -d notifycar > $backupFile

Write-Host "Backup creado: $backupFile"
```

Luego programa este script en el Programador de Tareas de Windows.

---

**¿Necesitas ayuda con algún método específico?** ¡Avísame y te guío paso a paso!
