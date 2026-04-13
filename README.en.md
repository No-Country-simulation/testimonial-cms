# Testimonial CMS

Web app to manage and publish testimonials, with:
- `ADMIN` and `EDITOR` roles for administration
- `USER` registration/login to submit reviews
- Testimonial moderation flow
- Prisma + PostgreSQL (Neon) for a shared database across devices

## Quick Start (60 seconds)

1. Clone and install:

```bash
git clone https://github.com/No-Country-simulation/testimonial-cms.git
cd testimonial-cms/testimonial-cms
npm install
```

2. Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.neon.tech/DB?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require&channel_binding=require"

ADMIN_PASSWORD="your_secure_admin_password"
EDITOR_PASSWORD="your_secure_editor_password"
AUTH_SECRET="a_long_random_secret"

YOUTUBE_API_KEY=""
CLOUDINARY_CLOUD_NAME=""
```

3. Run migrations and start dev server:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

4. Open `http://localhost:3000`.

## Requirements

- Node.js 20+
- npm 10+
- Free Neon account (PostgreSQL)
- Git

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Authentication Flow

- Navbar without session: `Login` button -> `/login?mode=login`
- In `/login`: user first chooses `Login` or `Register`, then form is shown
- In `/testimonials/new`:
  - No session: message + actions to login or create account
  - Active session: form is shown directly

## Roles and Behavior

- `ADMIN`: admin panel, full moderation, delete permission
- `EDITOR`: admin panel with limited permissions
- `USER`: can submit authenticated reviews

Notes:
- `USER` testimonial name is locked to the session username.
- `+ New Testimonial` redirects to login when no session exists.

## Main API Endpoints

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Testimonials:
- `GET /api/testimonials`
- `POST /api/testimonials`
- `GET /api/testimonials/:id`
- `PUT /api/testimonials/:id`
- `DELETE /api/testimonials/:id`

Public:
- `GET /api/public/testimonials`

## Working from Two Computers

Use the same Neon DB (`DATABASE_URL` and `DIRECT_URL`) on both machines.

Recommended flow:

```bash
git pull
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

## Screenshots

![Home](docs/screenshots/home.png)
![Login and register](docs/screenshots/login-register.png)
![Admin panel](docs/screenshots/admin.png)
![New testimonial](docs/screenshots/new-testimonial.png)

Checklist: `docs/screenshots/CAPTURE_CHECKLIST.md`

## Troubleshooting

### Prisma error on Windows (`EPERM ... query_engine-windows.dll.node`)

```bash
# PowerShell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npx prisma generate
```

### Missing `DIRECT_URL`

Ensure `DIRECT_URL` exists in `.env` and points to a valid Neon direct connection string.

## Deployment

Recommended stack: Vercel + Neon.

Required environment variables:
- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_PASSWORD`
- `EDITOR_PASSWORD`
- `AUTH_SECRET`
- `YOUTUBE_API_KEY` (optional)
- `CLOUDINARY_CLOUD_NAME` (optional)
