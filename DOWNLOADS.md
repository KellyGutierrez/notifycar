# 📥 Enlaces de Descarga Rápida - NotifyCar Setup

## ✅ Software Requerido (en orden de instalación)

### 1. **Docker Desktop** (OBLIGATORIO)
- **Descarga:** https://www.docker.com/products/docker-desktop
- **Tamaño:** ~500 MB
- **Versión:** Última versión estable
- **Nota:** Requiere reinicio del PC después de instalar

---

### 2. **Git para Windows** (OBLIGATORIO)
- **Descarga:** https://git-scm.com/download/win
- **Tamaño:** ~50 MB
- **Versión:** Última versión de 64-bit
- **Nota:** Usa opciones predeterminadas durante la instalación

---

### 3. **Visual Studio Code** (OPCIONAL - Recomendado)
- **Descarga:** https://code.visualstudio.com/
- **Tamaño:** ~90 MB
- **Versión:** Última versión estable
- **Nota:** Útil para editar código y ver archivos

---

## 🔄 Orden de Instalación Recomendado

1. ✅ Instalar **Docker Desktop** → Reiniciar PC
2. ✅ Instalar **Git**
3. ✅ Instalar **VS Code** (opcional)
4. ✅ Abrir Docker Desktop y esperar a que inicie
5. ✅ Verificar instalaciones con PowerShell

---

## 🧪 Verificar Instalaciones

Abre PowerShell y ejecuta:

```powershell
# Verificar Docker
docker --version
docker-compose --version

# Verificar Git
git --version

# Verificar VS Code (si lo instalaste)
code --version
```

**Resultado esperado:**
```
Docker version 24.x.x
Docker Compose version v2.x.x
git version 2.x.x
```

---

## 📋 Checklist de Instalación

- [ ] Docker Desktop descargado
- [ ] Docker Desktop instalado
- [ ] PC reiniciado después de instalar Docker
- [ ] Docker Desktop abierto y funcionando (ícono en bandeja)
- [ ] Git descargado e instalado
- [ ] VS Code descargado e instalado (opcional)
- [ ] Todos los comandos de verificación funcionan
- [ ] Proyecto NotifyCar copiado/clonado al PC
- [ ] Archivo `.env` configurado
- [ ] Listo para ejecutar `docker-compose up --build`

---

## 🚀 Siguiente Paso

Una vez que hayas instalado todo:

1. Lee **`SETUP-WINDOWS.md`** para instrucciones detalladas
2. Lee **`DEPLOYMENT.md`** para desplegar el proyecto
3. Ejecuta `docker-compose up --build` en la carpeta del proyecto

---

## ⏱️ Tiempo Estimado

- **Descargas:** 15-30 minutos (dependiendo de internet)
- **Instalaciones:** 10-15 minutos
- **Primera ejecución de Docker:** 5-10 minutos
- **Total:** ~30-60 minutos

---

## 💡 Consejos

- ✅ Descarga todo antes de empezar a instalar
- ✅ Asegúrate de tener permisos de administrador
- ✅ Cierra otros programas antes de instalar Docker
- ✅ Ten paciencia en la primera ejecución de Docker
- ✅ Mantén Docker Desktop ejecutándose mientras trabajas

---

**¿Todo listo?** → Ve a `SETUP-WINDOWS.md` para continuar.
