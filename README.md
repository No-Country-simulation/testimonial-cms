# Testimonial CMS

English version: `README.en.md`

Aplicacion web para gestionar y publicar testimonios con:
- Roles `ADMIN` y `EDITOR` para panel de administracion
- Registro/login de usuarios `USER` para publicar resenas
- Moderacion de testimonios
- Prisma + PostgreSQL (Neon) para base unificada entre equipos

## Quick Start (60 segundos)

1. Clona e instala:

```bash
git clone https://github.com/No-Country-simulation/testimonial-cms.git
cd testimonial-cms/testimonial-cms
npm install
```

2. Crea `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require&channel_binding=require"

ADMIN_PASSWORD="tu_password_admin_segura"
EDITOR_PASSWORD="tu_password_editor_segura"
AUTH_SECRET="un_secret_largo_aleatorio"

YOUTUBE_API_KEY=""
CLOUDINARY_CLOUD_NAME=""
```

3. Aplica migraciones y levanta:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

4. Abre `http://localhost:3000`.

## Requisitos

- Node.js 20+
- npm 10+
- Cuenta gratuita en Neon (PostgreSQL)
- Git

## Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Flujo de autenticacion

- Navbar sin sesion: boton `Iniciar sesion` -> `/login?mode=login`
- En `/login`: primero eliges `Iniciar sesión` o `Registrarme`, luego se despliega el formulario
- En `/testimonials/new`:
  - Sin sesion: aviso + botones para iniciar sesion o crear cuenta
  - Con sesion: formulario directo

## Roles y comportamiento

- `ADMIN`: panel, moderacion completa y eliminacion
- `EDITOR`: panel con permisos limitados
- `USER`: crea resenas autenticadas

Notas:
- El usuario `USER` publica con nombre bloqueado (tomado del username de sesion).
- El boton `+ Nuevo Testimonio` redirige a login si no hay sesion.

## Endpoints principales

Autenticacion:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Testimonios:
- `GET /api/testimonials`
- `POST /api/testimonials`
- `GET /api/testimonials/:id`
- `PUT /api/testimonials/:id`
- `DELETE /api/testimonials/:id`

Publico:
- `GET /api/public/testimonials`

## Trabajo en dos computadores

Usa la misma base Neon (`DATABASE_URL` y `DIRECT_URL` iguales en ambos equipos).

Flujo recomendado:

```bash
git pull
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

## Capturas

![Home](docs/screenshots/home.png)
![Login y registro](docs/screenshots/login-register.png)
![Panel admin](docs/screenshots/admin.png)
![Nuevo testimonio](docs/screenshots/new-testimonial.png)

Checklist: `docs/screenshots/CAPTURE_CHECKLIST.md`

## Solucion de problemas

### Error Prisma en Windows (`EPERM ... query_engine-windows.dll.node`)

```bash
# PowerShell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npx prisma generate
```

### Falta `DIRECT_URL`

Verifica que exista en `.env` y que sea una URL valida de Neon.

## Deploy

Recomendado: Vercel + Neon.

Variables requeridas en el proveedor:
- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_PASSWORD`
- `EDITOR_PASSWORD`
- `AUTH_SECRET`
- `YOUTUBE_API_KEY` (opcional)
- `CLOUDINARY_CLOUD_NAME` (opcional)
