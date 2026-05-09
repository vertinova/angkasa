# Deployment Guide

## Production Checklist

1. Set strong environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - SMTP provider settings
   - Object storage settings if replacing local upload storage
2. Run database migration:
   ```bash
npx prisma migrate deploy
```
Untuk struktur folder terpisah:
```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```
3. Generate Prisma client:
   ```bash
   npx prisma generate --schema backend/prisma/schema.prisma
   ```
4. Build app:
   ```bash
   npm run build
   ```
5. Start app:
   ```bash
   npm run start
   ```

## Docker

```bash
docker compose up -d --build
docker compose exec app npx prisma migrate deploy --schema backend/prisma/schema.prisma
docker compose exec app npm run db:seed
```

## Security Notes

- Keep JWT in HTTP-only cookies.
- Store uploaded files in S3-compatible storage for multi-instance deployments.
- Configure WAF/reverse proxy rate limit in addition to application rate limit.
- Enable database backups and point-in-time recovery.
- Replace forgot/reset password placeholder with token table plus SMTP provider before go-live.
