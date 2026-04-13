# Testimonial CMS

Aplicacion web para gestionar y publicar testimonios.
Incluye:
- Login por roles (`ADMIN`, `EDITOR`) por variables de entorno
- Registro y login de usuarios para dejar resenas (`USER`)
- Moderacion de testimonios
- Base de datos unificada con Prisma + PostgreSQL (Neon)

## Quick Start (60 segundos)

1. Clona e instala:

```bash
git clone https://github.com/No-Country-simulation/testimonial-cms.git
cd testimonial-cms/testimonial-cms
npm install
```

2. Crea `.env` con tus datos de Neon:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require&channel_binding=require"
ADMIN_PASSWORD="tu_password_admin_segura"
EDITOR_PASSWORD="tu_password_editor_segura"
AUTH_SECRET="un_secret_largo_aleatorio"
```

3. Aplica migraciones y levanta:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

4. Abre la app en `http://localhost:3000`.

## Capturas

Si quieres mostrar el proyecto en GitHub con preview visual, agrega capturas en `docs/screenshots/` y enlazalas aqui:

```md
![Home](docs/screenshots/home.png)
![Login y registro](docs/screenshots/login-register.png)
![Panel admin](docs/screenshots/admin.png)
![Nuevo testimonio](docs/screenshots/new-testimonial.png)
```

Tip: usa imagenes de 1280x720 o 1440x900 para que se vean bien en el README.

Checklist de captura: `docs/screenshots/CAPTURE_CHECKLIST.md`

## 1. Requisitos

- Node.js 20+
- npm 10+
- Cuenta gratuita en Neon (PostgreSQL)
- Git

## 2. Clonar el proyecto

```bash
git clone https://github.com/No-Country-simulation/testimonial-cms.git
cd testimonial-cms/testimonial-cms
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar base de datos Neon

1. Crea un proyecto en Neon.
2. Copia dos connection strings:
   - URL pooled (para `DATABASE_URL`)
   - URL direct (para `DIRECT_URL`)

## 5. Crear archivo `.env`

Crea un archivo `.env` en la raiz de `testimonial-cms/testimonial-cms` con este formato:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require&channel_binding=require"

ADMIN_PASSWORD="tu_password_admin_segura"
EDITOR_PASSWORD="tu_password_editor_segura"
AUTH_SECRET="un_secret_largo_aleatorio"

YOUTUBE_API_KEY=""
CLOUDINARY_CLOUD_NAME=""
```

Recomendaciones:
- `AUTH_SECRET`: minimo 32 caracteres aleatorios.
- Nunca subas `.env` a GitHub.

## 6. Aplicar migraciones y generar cliente Prisma

```bash
npx prisma migrate deploy
npx prisma generate
```

Opcional para revisar datos:

```bash
npx prisma studio
```

## 7. Levantar el proyecto en desarrollo

```bash
npm run dev
```

Abre:
- http://localhost:3000

## 8. Compilar para produccion

```bash
npm run build
npm run start
```

## 9. Flujo para trabajar desde dos computadores

En ambos equipos usa la misma base Neon (mismas variables `DATABASE_URL` y `DIRECT_URL`).

Flujo recomendado:

```bash
git pull
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Con esto ambos equipos comparten los mismos usuarios y testimonios.

## 10. Roles y acceso

- `ADMIN`: acceso al panel y moderacion completa
- `EDITOR`: acceso al panel con permisos limitados
- `USER`: registro/login para publicar resenas

Comportamiento clave:
- El usuario `USER` puede crear testimonio
- El nombre del testimonio se toma del username logeado y no es editable

## 11. Endpoints principales

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

## 12. Solucion de problemas

### Error de Prisma por archivo bloqueado en Windows (`EPERM ... query_engine-windows.dll.node`)

Cierra procesos Node activos y vuelve a generar:

```bash
# PowerShell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npx prisma generate
```

### Error de migracion por variable faltante `DIRECT_URL`

Verifica que exista en `.env` y que tenga una URL valida de Neon.

## 13. Deploy sugerido

Puedes desplegar en Vercel y mantener Neon como base de datos.

Variables requeridas en el proveedor de deploy:
- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_PASSWORD`
- `EDITOR_PASSWORD`
- `AUTH_SECRET`
- `YOUTUBE_API_KEY` (opcional)
- `CLOUDINARY_CLOUD_NAME` (opcional)
