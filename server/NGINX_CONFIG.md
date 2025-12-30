# Nginx Configuration for Certificate Server

## Vue App Nginx Configuration

`/etc/nginx/sites-available/vueapp` faylida quyidagicha sozlash kerak:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ziyoliavlod.com www.ziyoliavlod.com;

    # SSL redirect (Let's Encrypt)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ziyoliavlod.com www.ziyoliavlod.com;

    # SSL sertifikatlar
    ssl_certificate /etc/letsencrypt/live/ziyoliavlod.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ziyoliavlod.com/privkey.pem;

    # Frontend static files
    root /var/www/ziyoliavlod-front/dist;
    index index.html;

    # Certificate server proxy
    location /sertificate {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout sozlamalari (PDF generatsiya uchun)
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # CORS headers (agar kerak bo'lsa)
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    }

    # Frontend routing (Vue Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Certificate Server .env Configuration

`/var/www/certificate-server/.env` faylida:

```env
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://ziyoliavlod.com,https://www.ziyoliavlod.com
CERTIFICATE_TEMPLATE_PATH=/var/www/certificate-server/templates/template.ejs
CERTIFICATE_ASSETS_PATH=/var/www/certificate-server/assets
```

## Tekshirish

### 1. Nginx konfiguratsiyasini tekshirish:
```bash
sudo nginx -t
```

### 2. Nginx'ni qayta yuklash:
```bash
sudo systemctl reload nginx
```

### 3. Certificate server health check:
```bash
curl http://localhost:3001/health
```

### 4. Nginx orqali test:
```bash
curl https://ziyoliavlod.com/sertificate/health
```

### 5. Certificate generatsiya test:
```bash
curl -X POST https://ziyoliavlod.com/sertificate/generate-certificate \
  -H "Content-Type: application/json" \
  -H "Origin: https://ziyoliavlod.com" \
  -d '{"fullName":"Test User", "articleTitle":"Test Article", "certificateId":"123"}' \
  --output test.pdf
```

## Frontend Build

Frontend'ni build qilishdan oldin `.env.production` fayl yaratish (ixtiyoriy):

```bash
cd /var/www/ziyoliavlod-front
nano .env.production
```

```env
VITE_API_BASE_URL=https://api.ziyoliavlod.com
VITE_CERTIFICATE_SERVER_URL=https://ziyoliavlod.com/sertificate
```

Keyin build:
```bash
npm run build
```

## PM2 Startup

PM2 ni system boot'da ishga tushirish:

```bash
cd /var/www/certificate-server
pm2 startup
# Chiqgan buyruqni bajarish (masalan: sudo env PATH=...)
pm2 save
```

