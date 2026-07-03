# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# --- deps ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# --- build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vars públicas (NEXT_PUBLIC_*) precisam existir em build-time: o Next.js
# grava esses valores no bundle do cliente durante `next build`. Passe-as
# como build args no EasyPanel (Settings > Build > Build Args).
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_INSTAGRAM_USER_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_INSTAGRAM_USER_ID=$NEXT_PUBLIC_INSTAGRAM_USER_ID

# DATABASE_URL só precisa ser um valor válido durante o build (o Prisma
# Client é gerado a partir do schema, não faz conexão real neste passo).
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
ENV DIRECT_URL="postgresql://user:password@localhost:5432/db"

RUN npx prisma generate
RUN npm run build

# --- runtime ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma CLI + schema/migrations embarcados para rodar `migrate deploy`
# automaticamente a cada start do container (ver docker-entrypoint.sh).
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh && \
    mkdir -p ./public/uploads/products && \
    chown -R nextjs:nodejs ./public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
