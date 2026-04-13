# Configurar Neon para base unificada

## 1) Crear proyecto en Neon
- Crea una base PostgreSQL en Neon.
- Copia estas dos conexiones:
  - `DATABASE_URL` (pooled)
  - `DIRECT_URL` (direct, sin pooler)

## 2) Variables de entorno en cada computador
En tu `.env` del proyecto, agrega:

```env
DATABASE_URL="postgresql://USER:PASSWORD@...neon.tech/DB?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@...neon.tech/DB?sslmode=require"
```

Nota: usa la URL direct para `DIRECT_URL`.

## 3) Aplicar esquema en Neon (una sola vez)
Desde el repo:

```bash
npx prisma migrate deploy
npx prisma generate
```

## 4) Sincronizar en el segundo computador
- `git pull`
- Configurar el mismo `.env` con las mismas URLs de Neon
- Ejecutar:

```bash
npx prisma migrate deploy
npx prisma generate
```

## 5) Flujo diario recomendado
- Antes de trabajar: `git pull`
- Al terminar cambios: commit + push
- Si llegan nuevas migraciones: `npx prisma migrate deploy`

## 6) Datos existentes en SQLite
Si quieres copiar testimonios/usuarios de tu SQLite actual a Neon, hay que hacer una migración de datos aparte (script ETL). El esquema ya queda preparado para Neon con PostgreSQL.
