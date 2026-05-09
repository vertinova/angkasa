# SD Angkasa 3 Management

Aplikasi management sekolah digital untuk **SD Angkasa 3** berbasis TypeScript fullstack dengan folder terpisah `frontend/` dan `backend/`. Stack utama: Next.js App Router, PostgreSQL, Prisma, JWT RBAC, Tailwind CSS, Shadcn-style components, Zustand, Zod, React Hook Form, Recharts, Excel/PDF export, upload file, realtime notification stream, Docker, dan struktur modular.

## Fitur Utama

- Multi-role authentication: Super Admin, Admin Sekolah, Kepala Sekolah, Guru, Wali Kelas, Siswa, Orang Tua, Staff
- Dashboard interaktif: statistik siswa/guru/kelas/keuangan, grafik kehadiran, pengumuman, jadwal, aktivitas
- CRUD modular: siswa, guru, kelas, absensi, nilai, pembayaran, pengumuman, dokumen
- Import/export siswa: Excel dan PDF
- Upload gambar/dokumen dengan validasi tipe dan ukuran
- Audit log, activity log, device login history, RBAC middleware, rate limiter, secure headers
- UI responsive, dark mode, sidebar SaaS, card/table/modal/loading/empty states
- Prisma schema relasional untuk users, students, teachers, parents, classes, subjects, schedules, attendances, grades, payments, announcements, assignments, exams, books, borrowings, notifications, chats, documents, settings, audit logs

## Quick Start

```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run db:seed
npm run dev
```

App lokal berjalan di `http://localhost:3000`, dan domain production menggunakan `https://angkasa.vertinova.id`.

Demo login:

- Username: `admin`
- Password: `password`

## Struktur Folder

```text
frontend/
  src/
    app/                Next.js App Router pages and API route adapters
    components/         UI, layout, dashboard, data management components
    config/             Navigation and module configuration
    hooks/              Zustand stores and React hooks
    lib/                Frontend utilities and API client
  public/               Static assets and uploaded public files
  next.config.ts        Next.js config
  tailwind.config.ts    Tailwind design system
backend/
  src/
    auth/               JWT, session, RBAC permission helpers
    db/                 Prisma client singleton
    repositories/       Repository pattern
    services/           Audit, upload, export services
    validators/         Zod validation schemas
    crud.ts             Reusable CRUD API factory
  prisma/
    schema.prisma       Relational PostgreSQL schema
    seed.ts             Demo data and demo users
docs/
  API.md                Endpoint documentation
  DEPLOYMENT.md         Production deployment guide
```

## Environment

Copy `.env.example` to `.env`, then update:

```env
DATABASE_URL="postgresql://school:school@localhost:5432/schoolos?schema=public"
JWT_SECRET="replace-with-64-character-random-secret"
NEXT_PUBLIC_APP_URL="https://angkasa.vertinova.id"
UPLOAD_DIR="./frontend/public/uploads"
```

`frontend/.env.local` disediakan untuk development lokal Next.js. Untuk migrasi Prisma, gunakan `.env` di root.

## Docker

```bash
docker compose up -d --build
docker compose exec app npx prisma migrate deploy --schema backend/prisma/schema.prisma
docker compose exec app npm run db:seed
```

## API

See [docs/API.md](docs/API.md).

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## GitHub Webhook Deploy

Webhook receiver tersedia di `scripts/github-webhook.cjs` dan deploy script di `scripts/deploy.sh`.

Default production runtime:

- App PM2 name: `angkasa`
- App port: `3010`
- Webhook port: `9010`
- Webhook path: `/__github-webhook`

## Catatan Production

Forgot/reset password sudah disediakan sebagai endpoint placeholder aman. Untuk production, tambahkan tabel reset token dan integrasi SMTP final. Untuk deployment multi-instance, ganti local upload ke object storage seperti S3/MinIO.
