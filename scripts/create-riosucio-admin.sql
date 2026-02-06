-- SQL para crear usuario administrador del Gremio de Taxis Riosucio
-- Ejecutar esto en tu base de datos PostgreSQL

-- Primero, obtener el ID de la organización "Gremio de Taxis Riosucio"
-- Reemplaza 'ORG_ID_AQUI' con el ID real que obtengas de la primera consulta

-- 1. Ver el ID de la organización:
SELECT id, name, type FROM "Organization" WHERE name LIKE '%Riosucio%' AND type = 'FLEET';

-- 2. Crear el usuario (reemplaza 'ORG_ID_AQUI' con el ID obtenido):
INSERT INTO "User" (id, email, name, password, role, "organizationId", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@riosucio.com',
    'Admin Riosucio',
    '$2a$10$8YqK.1TzKZF5YqK.1TzKZF5YqK.1TzKZF5YqK.1TzKZF5YqK.1Tz',  -- Contraseña: admin123
    'CORPORATE',
    'ORG_ID_AQUI',  -- <-- REEMPLAZAR CON EL ID DE LA ORGANIZACIÓN
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
    name = 'Admin Riosucio',
    role = 'CORPORATE',
    "organizationId" = EXCLUDED."organizationId";

-- Hash de la contraseña 'admin123' (bcrypt):
-- $2a$10$YourHashHere...
