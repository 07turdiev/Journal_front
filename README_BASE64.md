# Base64 Rasmlarni Template'ga Qo'shish

## 1. Rasmlarni Base64 ga Aylantirish

Terminalda quyidagi buyruqlarni bajaring:

```bash
# bg.png ni base64 ga aylantirish
base64 -i public/sertificate/assets/bg.png > /tmp/bg_base64.txt

# logo.svg ni base64 ga aylantirish
base64 -i public/sertificate/assets/logo.svg > /tmp/logo_base64.txt
```

Yoki skriptni ishga tushiring:
```bash
./convert-to-base64.sh
```

## 2. Base64 Stringlarni Olish

Base64 stringlarni olish uchun:
```bash
cat /tmp/bg_base64.txt
cat /tmp/logo_base64.txt
```

**MUHIM:** Base64 stringlar juda uzun bo'ladi. Ularni to'liq nusxalang.

## 3. Template'ga Qo'shish

Template fayl (`sertificate/template.ejs`) allaqachon tayyor:
- Line 53: `background-image: url(data:image/png;base64,<%= bgBase64 %>);`
- Line 452: `src="data:image/svg+xml;base64,<%= logoBase64 %>"`

## 4. Certificate.js'ga Base64 Stringlarni Qo'shish

`src/utils/certificate.js` faylida `generateCertificatePdf` funksiyasida base64 stringlarni qo'shing:

```javascript
// Base64 stringlarni bu yerga qo'shing
const BG_BASE64 = 'YOUR_BG_BASE64_STRING_HERE';
const LOGO_BASE64 = 'YOUR_LOGO_BASE64_STRING_HERE';

// Template'ga uzatish
const html = ejs.render(template, {
  fullName: fullName || '',
  articleTitle: articleTitle || '',
  date: formattedDate,
  certificateId: cleanCertificateId,
  qr_code: qr_code,
  baseUrl: '/',
  bgBase64: BG_BASE64,  // Qo'shing
  logoBase64: LOGO_BASE64  // Qo'shing
});
```

## 5. Asset Yuklash Kodini Olib Tashlash

`loadCertificateTemplateHtml` funksiyasidagi asset yuklash kodini olib tashlang - endi kerak emas!


