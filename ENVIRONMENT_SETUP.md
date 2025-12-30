# Environment Setup Guide

## Environment Variables

Bu loyiha development va production uchun alohida base URL'larni qo'llab-quvvatlaydi.

### 1. .env.development faylini yarating

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:1337
```

### 2. .env.production faylini yarating

```bash
# .env.production
VITE_API_BASE_URL=https://your-production-domain.com
```

### 3. .env faylini yarating (optional)

```bash
# .env (default values)
VITE_API_BASE_URL=http://localhost:1337
```

## Qanday ishlaydi

- **Development**: `npm run dev` - .env.development faylidan o'qiydi
- **Production**: `npm run build` - .env.production faylidan o'qiydi
- **Fallback**: Agar environment variable yo'q bo'lsa, default qiymat ishlatiladi

## Console Logs

Browser console'da quyidagi ma'lumotlar ko'rsatiladi:
- 🌍 Environment: development/production
- 🔗 API Base URL: http://localhost:1337/api
- 🖼️ Strapi Base URL: http://localhost:1337

## Production URL'ni o'zgartirish

Production'da faqat `.env.production` faylidagi `VITE_API_BASE_URL` ni o'zgartiring:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Xavfsizlik

- `.env*` fayllar `.gitignore` da bo'lishi kerak
- Production'da haqiqiy domain'ni ishlating
- HTTPS ishlatish tavsiya etiladi
