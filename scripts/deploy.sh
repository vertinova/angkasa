#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/root/angkasa}"
BRANCH="${DEPLOY_BRANCH:-main}"
APP_NAME="${APP_NAME:-angkasa}"
PORT="${PORT:-3010}"
HOSTNAME="${HOSTNAME:-127.0.0.1}"

cd "$APP_DIR"

echo "[$(date -Is)] Fetching ${BRANCH}"
git fetch origin "$BRANCH"
git reset --hard "origin/${BRANCH}"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

export DATABASE_URL JWT_SECRET JWT_EXPIRES_IN NEXT_PUBLIC_APP_URL UPLOAD_DIR RATE_LIMIT_WINDOW_MS RATE_LIMIT_MAX

mkdir -p "${UPLOAD_DIR:-./frontend/public/uploads}"

echo "[$(date -Is)] Installing dependencies"
npm ci --ignore-scripts

echo "[$(date -Is)] Generating Prisma client"
npm run prisma:generate

echo "[$(date -Is)] Applying database migrations"
npx prisma migrate deploy --schema backend/prisma/schema.prisma

echo "[$(date -Is)] Building application"
npm run build

echo "[$(date -Is)] Starting ${APP_NAME} on ${HOSTNAME}:${PORT}"
export PORT HOSTNAME

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- run start
fi

pm2 save
echo "[$(date -Is)] Deployment complete"
