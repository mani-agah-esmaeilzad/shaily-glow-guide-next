# Dockerfile

# --- Stage 1: Builder ---
# در این مرحله، پروژه بیلد می‌شود
FROM node:18-alpine AS builder

# تنظیم پوشه کاری
WORKDIR /app

# کپی کردن فایل‌های پکیج و نصب وابستگی‌ها
COPY package*.json ./
RUN npm install

# کپی کردن بقیه سورس کد
COPY . .

# اجرای دستور بیلد برای ساخت نسخه پروداکشن
RUN npm run build


# --- Stage 2: Runner ---
# در این مرحله، ایمیج نهایی و سبک برای اجرا ساخته می‌شود
FROM node:18-alpine AS runner

WORKDIR /app

# کپی کردن فایل‌های ضروری از مرحله Builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# باز کردن پورت 3000
EXPOSE 3000

# دستور نهایی برای اجرای اپلیکیشن
CMD ["npm", "start"]