# Certificate Server 500 Error Debug

## 1. PM2 Loglarni ko'rish

```bash
cd /var/www/certificate-server
pm2 logs certificate-server --lines 50
```

Yoki real-time:
```bash
pm2 logs certificate-server
```

## 2. Server'ni qayta ishga tushirish

```bash
pm2 restart certificate-server
pm2 logs certificate-server --lines 20
```

## 3. To'g'ridan-to'g'ri test qilish

```bash
cd /var/www/certificate-server
node index.js
```

Keyin boshqa terminal'da:
```bash
curl -X POST http://localhost:3001/generate-certificate \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User", "articleTitle":"Test Article", "certificateId":"123"}' \
  --output test.pdf
```

## 4. Kerakli fayllarni tekshirish

```bash
cd /var/www/certificate-server

# Template fayl
ls -la templates/template.ejs

# Asset fayllar
ls -la assets/bg.png
ls -la assets/logo.svg
```

## 5. Puppeteer/Chromium muammosi

Agar Puppeteer xatosi bo'lsa:

```bash
# Chromium dependencies
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Yoki Chromium o'rnatish
sudo apt-get install -y chromium-browser
```

## 6. Environment Variables tekshirish

```bash
cd /var/www/certificate-server
cat .env
```

`.env` fayl ichida quyidagilar bo'lishi kerak:
```env
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://ziyoliavlod.com,https://www.ziyoliavlod.com
CERTIFICATE_TEMPLATE_PATH=/var/www/certificate-server/templates/template.ejs
CERTIFICATE_ASSETS_PATH=/var/www/certificate-server/assets
```

## 7. Memory muammosi

Agar memory yetmasa:

```bash
# PM2 memory limit oshirish
pm2 delete certificate-server
pm2 start index.js --name certificate-server --max-memory-restart 2G
pm2 save
```

## 8. Permission muammosi

```bash
# Fayllar uchun permission tekshirish
ls -la /var/www/certificate-server/
ls -la /var/www/certificate-server/templates/
ls -la /var/www/certificate-server/assets/

# Agar kerak bo'lsa, permission o'zgartirish
chmod -R 755 /var/www/certificate-server
```

## 9. Nginx loglarni tekshirish

```bash
sudo tail -f /var/log/nginx/error.log
```

## 10. Common Issues

### Issue 1: Puppeteer Chromium topilmaydi
**Solution**: Chromium dependencies o'rnatish yoki Puppeteer'ning o'z Chromium'ini ishlatish

### Issue 2: Template/Asset fayllar topilmaydi
**Solution**: Fayl path'larini tekshirish va to'g'ri sozlash

### Issue 3: CORS xatosi
**Solution**: `.env` faylda `ALLOWED_ORIGINS` to'g'ri sozlanganligini tekshirish

### Issue 4: Memory limit
**Solution**: PM2 memory limit oshirish yoki server memory oshirish

### Issue 5: Timeout
**Solution**: Nginx timeout sozlamalarini oshirish


