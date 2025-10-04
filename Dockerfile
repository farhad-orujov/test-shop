# 1. Билд-образ
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Собираем приложение
RUN npm run build

# 2. Прод-образ
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Создаем непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем package.json и package-lock.json
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем собранное приложение, node_modules и статические файлы
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json


# Устанавливаем права доступа
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]