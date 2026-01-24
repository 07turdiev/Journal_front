# SEO Konfiguratsiyasi va Google Qidiruvi Qo'shish Qo'llanmasi

## 1. Tayyorlangan SEO Elementlari

### 1.1 Meta Taglar (`index.html`)
- **Description**: Sayt haqida tavsif (uz, en, ru)
- **Keywords**: Qidiruv kalit so'zlari
- **Robots**: Indexlash va follow qoidalari
- **Theme Color**: Brend rangi

### 1.2 Open Graph Tags
- og:title, og:description, og:image
- og:locale (uz_UZ, en_US, ru_RU)
- Facebook, Twitter va boshqa ijtimoiy tarmoqlar uchun

### 1.3 Hreflang Tags
- Turli tillar orasida munosabat o'rnatish
- Canonical URL'lar
- x-default variant

### 1.4 JSON-LD Structured Data
- Organization schema
- Contact point schema
- Multilingual support

---

## 2. Sitemap va Robots Files

### 2.1 sitemap.xml
- Barcha 3 tilning barcha sahifalarini o'z ichiga oladi
- Hreflang tags bilan language alternates
- Har bir sahifa uchun:
  - URL
  - Last modified date
  - Change frequency
  - Priority (0.6-1.0 o'rtasida)

**Fayllar:**
- `public/sitemap.xml` - To'liq sitemap

### 2.2 robots.txt
- Sitemap referensi
- Crawl delay qoidalari
- Zaif botlarni blok qilish (AhrefsBot, MJ12bot, SemrushBot)
- Fayllar va resource'larni indexlash

**Fayllar:**
- `public/robots.txt`

---

## 3. .htaccess Konfiguratsiyasi

Quyidagi optimizatsiyalar:

### 3.1 Rewrite Rules
```
✓ URL'larning clean bo'lishi (biz Vue spa'miz shuning uchun index.html fallback)
✓ www -> non-www redirect
✓ HTTP -> HTTPS redirect
```

### 3.2 Compression va Performance
```
✓ Gzip compression for HTML, CSS, JS
✓ Static assets uchun cache headers
✓ Image va font files uchun 1 yillik cache
```

### 3.3 Security Headers
```
✓ X-Frame-Options (clickjacking himoyasi)
✓ X-Content-Type-Options (MIME sniffing himoyasi)
✓ X-XSS-Protection
✓ Referrer-Policy
```

---

## 4. Google Search Console'ga Qo'shish

### 4.1 Domain Tekshiruvi

1. **Google Search Console'ga kirish:**
   - `https://search.google.com/search-console/about` ga o'ting
   - Google akkauntiga kirish

2. **Domain qo'shish (2 usuli):**

   **Usul 1: Domain Property (Tavsiya etiladi)**
   - `https://ziyoliavlod.com` kiriting
   - DNS TXT record orqali tekshiruv
   - Hosting provayderiga kirish
   - DNS sozlamalari qo'shing

   **Usul 2: URL Prefix Property**
   - `https://ziyoliavlod.com/` kiriting
   - HTML file, meta tag yoki Google Analytics orqali tekshiruv

### 4.2 Sitemap'ni Qo'shish

1. Search Console'da `Sitemaps` bo'limiga o'ting
2. `https://ziyoliavlod.com/sitemap.xml` qo'shish
3. Google avtomatik ravishda indexlashni boshlaydi

### 4.3 Robots.txt Kiritish
- `https://ziyoliavlod.com/robots.txt` mavjud
- Google avtomatik ravishda topadi

---

## 5. Bing Webmaster Tools'ga Qo'shish

### 5.1 Bing'da Ro'yxatga Olish

1. `https://www.bing.com/webmasters/` ga o'ting
2. Saitingizni qo'shish
3. Tekshiruv usulini tanlash:
   - XML sitemap yuklash
   - Meta tag qo'shish
   - CNAME record

### 5.2 Sitemap'ni Qo'shish

1. Webmaster Tools'da Sitemap bo'limiga o'ting
2. `https://ziyoliavlod.com/sitemap.xml` qo'shish

---

## 6. Yandex Webmaster'ga Qo'shish

### 6.1 Ro'yxatga Olish

1. `https://webmaster.yandex.com/` ga o'ting
2. Saytni qo'shish
3. Tekshiruv:
   - Meta tag (tavsiya etiladi)
   - HTML file
   - CNAME record

### 6.2 Sitemap Qo'shish

1. Turli til versiyalari uchun:
   - `https://ziyoliavlod.com/sitemap.xml`
   - Meta tag'da `alternate` linklarini ko'rsating

---

## 7. Til Sozlamalari (Hreflang)

### Tushuntirish

Saytimiz 3 tilda:
- **Uzbek**: `/uz/`
- **English**: `/en/`
- **Russian**: `/ru/`

Har bir sahifa uchun hreflang tags o'rnatilgan:

```html
<link rel="alternate" hreflang="uz" href="https://ziyoliavlod.com/uz/" />
<link rel="alternate" hreflang="en" href="https://ziyoliavlod.com/en/" />
<link rel="alternate" hreflang="ru" href="https://ziyoliavlod.com/ru/" />
<link rel="alternate" hreflang="x-default" href="https://ziyoliavlod.com/" />
```

Google va Yandex bu taglarni ishlatib:
- To'g'ri tilning foydalanuvchiga ko'rsatilishini ta'minlaydi
- Duplicate content muammolarini oldini oladi

---

## 8. Performance va Technical SEO

### 8.1 Tekshiriladigan Narsalar

- **Page Speed**: Lighthouse uchun barqaror optimizatsiya
- **Mobile Responsive**: Barcha qurilmalarda to'g'ri ko'rinishi
- **Core Web Vitals**: LCP, FID, CLS metrikalarini yaxshilash
- **SSL Certificate**: HTTPS ishlatish (zarhur)

### 8.2 Recommended Tools

1. **Google PageSpeed Insights**
   - `https://pagespeed.web.dev/`
   - Performance, Accessibility, Best Practices, SEO

2. **Google Lighthouse**
   - Chrome DevTools ichida
   - Asosiy Web Vital'larni o'lchash

3. **GTmetrix**
   - `https://gtmetrix.com/`
   - Tafsiliy Performance analitikasi

4. **Mobile Friendly Test**
   - `https://search.google.com/test/mobile-friendly`
   - Mobile responsive tekshiruvi

---

## 9. Content Optimization

### 9.1 Title va Description'lar

Har bir sahifa uchun:
- **Title (50-60 belgi)**: Kalit so'zlar bilan
- **Description (150-160 belgi)**: Jozibador va vosita

### 9.2 Heading Structure

```
H1 - Sahifa asosiy sarlavhasi (faqat 1 ta)
H2 - Asosiy bo'limlar
H3 - Pastki bo'limlar
```

### 9.3 Structured Data

Qo'shimcha schema's qo'shish:
- Article schema (maqolalar uchun)
- NewsArticle schema (yangiliklar uchun)
- Event schema (tadbirlar uchun)
- LocalBusiness schema (kontakt ma'lumotlari)

---

## 10. Link Qo'shish Strategy

### 10.1 Internal Links (Ichki Links)

Sayt ichida:
- Navigation links (header/footer)
- Breadcrumb navigation
- Related articles/content links
- Call-to-action links

### 10.2 External Links (Tashqi Links)

Preferensiya:
- High authority saytlardan backlinks
- Relevant content linklar
- Editorial backlinks

**Backlink Tracking Tools:**
- Ahrefs, SEMrush, Moz (premium)
- Google Search Console (Free)

---

## 11. Monitoring va Reporting

### 11.1 Google Search Console

- **Impressions**: Qancha marta sayt qidiruv natijasida ko'ringan
- **Clicks**: Qancha marta kliklangan
- **CTR**: Click-through rate
- **Average Position**: O'rtacha pozitsiya

### 11.2 Analytics (Google Analytics 4 tavsiya etiladi)

- Page views
- User engagement
- Bounce rate
- Conversion tracking

### 11.3 O'lchanadigan KPI'lar

- Qidiruv trafikining ko'payishi
- Indexed pages soni
- Ranking keywords soni
- Conversion rate

---

## 12. Kengaytirilgan SEO Tips

### 12.1 Kontakt va Location

`public/robots.txt` dan Contact va Address info:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ziyoli Avlod",
  "url": "https://ziyoliavlod.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "UZ",
    "addressLocality": "Tashkent"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Editorial",
    "email": "editor@ziyoliavlod.com"
  }
}
```

### 12.2 Social Media Integration

Meta tags social media uchun qo'shilgan:
- Facebook Open Graph
- Twitter Card
- Instagram compatibility

### 12.3 Mobile Optimization

- Responsive design (Tayyorlangan)
- Touch-friendly buttons
- Fast loading (Vite optimized)
- Mobile-first indexing

---

## 13. Taraqqiyot Qadamlari

### Phase 1: Tekshiruv (1-2 hafta)
- [ ] Google Search Console'da domenini ro'yxatga olish
- [ ] Bing Webmaster Tools'da ro'yxatga olish
- [ ] Yandex Webmaster'da ro'yxatga olish
- [ ] Sitemap'ni qo'shish (barchada)
- [ ] robots.txt ni tekshirish

### Phase 2: Monitoring (Davom etadigan)
- [ ] Daily: Search Console'da impressions/clicks
- [ ] Weekly: Page performance audit
- [ ] Monthly: SEO report
- [ ] Content updates prioritization

### Phase 3: Optimization (Davom etadigan)
- [ ] High-value keywords uchun content optimization
- [ ] Internal link structure yaxshilash
- [ ] Page speed optimization
- [ ] User experience improvements

---

## 14. Foydalanuvchi Tayyorasi

Agar shuni biladigim bo'lsa - DNS'lar orasida o'tish davomida:
1. TTL qiymatni past qo'ying (3600 o'rniga 300)
2. 24 soat kutib turish
3. Yangi DNS ga o'tish
4. Eski DNS ni qayta solishtirish

---

## 15. FAQ

**Q: Google sitemap'ni qancha vaqtda topib indexlaydi?**
A: Odatda 24-48 soat ichida, lekin 1-2 haftaga kadar bo'lishi mumkin.

**Q: Hreflang tags nima uchun kerak?**
A: Google'ga turli tillar orasida munasabat o'rnatish uchun. Bu duplicate content muammalarini oldini oladi.

**Q: robots.txt ni o'zgartirishni qayta ta'minlash kerakmi?**
A: Ha, Robots.txt boshida o'zgargan o'n daqiqada Google avtomatik skanerlaydi.

**Q: Sitemap XML yoki HTML bo'lishi kerakmi?**
A: XML tavsiya etiladi (barcha qidiruv mexanizmalariga mos) lekin ikkisi ham ishlatilishi mumkin.

---

**Oxirgi yangilash**: 15-January 2024
**Status**: Barcha sozlamalar tayyorlangan va deploy uchun tayyor
