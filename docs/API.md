# API Documentation

Base URL: `/api`

Folder API route berada di `frontend/src/app/api`, sedangkan business logic, auth, repository, service, validator, dan Prisma client berada di `backend/src`.

All protected endpoints use an HTTP-only `sd_angkasa_3_token` cookie issued by `POST /api/auth/login`.

## Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Login JWT, create session history, activity log |
| `POST` | `/auth/register` | Register user with role |
| `GET` | `/auth/me` | Current user, sessions, device history |
| `POST` | `/auth/logout` | Clear session cookie |
| `POST` | `/auth/forgot-password` | Forgot password SMTP placeholder |
| `POST` | `/auth/reset-password` | Reset password placeholder |

## CRUD Modules

Every CRUD endpoint supports:

- `GET ?page=1&limit=10&search=&sortBy=createdAt&sortDir=desc`
- `POST` JSON body validated by Zod
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`

| Module | Endpoint | RBAC Permission |
| --- | --- | --- |
| Students | `/students` | Admin, Kepala Sekolah, Guru, Wali Kelas, Staff |
| Teachers | `/teachers` | Admin, Kepala Sekolah, Staff |
| Classes | `/classes` | Admin, Kepala Sekolah, Wali Kelas, Staff |
| Attendance | `/attendance` | Admin, Kepala Sekolah, Guru, Wali Kelas, Staff |
| Grades | `/grades` | Admin, Kepala Sekolah, Guru, Wali Kelas |
| Payments | `/payments` | Admin, Kepala Sekolah, Staff |
| Announcements | `/announcements` | Admin, Kepala Sekolah, Staff |
| Documents | `/documents` | Admin, Kepala Sekolah, Guru, Wali Kelas, Staff |

## Files and Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/upload` | Multipart upload for image, PDF, and Excel files |
| `GET` | `/students/export?format=excel` | Export students to Excel |
| `GET` | `/students/export?format=pdf` | Export students to PDF |
| `POST` | `/students/import` | Import students from Excel |
| `GET` | `/reports/invoice/:id` | Generate invoice PDF |
| `GET` | `/reports/raport/:id` | Generate student raport PDF |
| `GET` | `/notifications/stream` | Server-sent realtime notification stream |

## Response Format

```json
{
  "success": true,
  "data": {}
}
```

Validation errors return `422` with Zod issue details. Authentication errors return `401`, permission errors return `403`.
