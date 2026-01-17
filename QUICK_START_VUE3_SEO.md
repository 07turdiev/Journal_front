# Vue 3 Multilingual SEO App - Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install vue vue-router vue-i18n @vueuse/head
npm install -D vite @vitejs/plugin-vue
```

### Step 2: Files Created

All required files have been generated in the correct structure:

```
src/
├── main.js                          ✓ Entry point with @vueuse/head
├── App.vue                          ✓ Root component with language switcher
├── router/
│   └── index.js                     ✓ Language-based routing
├── i18n/
│   └── index.js                     ✓ Multilingual translations
├── composables/
│   └── useSeoMeta.js                ✓ Dynamic SEO meta management
├── services/
│   └── api.js                       ✓ REST API with mock fallback
└── pages/
    ├── Post.vue                     ✓ Dynamic post page
    ├── About.vue                    ✓ About page
    ├── Contact.vue                  ✓ Contact form
    └── NotFound.vue                 ✓ 404 error page
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Key Features Ready to Use

### ✅ Automatic SEO Meta Tags
- Title and description update based on language
- OpenGraph tags for social sharing
- Twitter Card support
- Language-specific hreflang tags

### ✅ Language Switching
- 3 languages: Uzbek (uz), English (en), Russian (ru)
- Buttons in navigation bar
- URL updates automatically
- Content translates instantly

### ✅ Dynamic Content
- Fetches from REST API
- Automatic fallback to mock data
- Multilingual content structure
- Responsive design

### ✅ Production-Ready
- Clean code with comments
- Error handling
- Loading states
- Lazy-loaded routes

---

## Testing the Application

### Test 1: Language Switching
1. Click language button (Ўзбек, English, Русский)
2. Check URL changes: `/uz` → `/en` → `/ru`
3. Verify page content translates
4. Check page title in browser tab changes

### Test 2: SEO Meta Tags
1. Open browser DevTools (F12)
2. Go to Elements/Inspector tab
3. Inspect `<head>` section
4. Look for:
   - `<title>` - Dynamic title
   - `<meta name="description">` - Content description
   - `<meta property="og:*">` - OpenGraph tags
   - `<meta name="twitter:*">` - Twitter tags
   - `<html lang="uz|en|ru">` - Language attribute

### Test 3: Post Page
1. Navigate to `/uz/post/1`
2. Change language to `/en/post/1`
3. Meta tags should update to English
4. Check SEO tags reflect English content

### Test 4: Social Share Preview
1. Copy post URL: `http://localhost:5173/uz/post/1`
2. Use Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
3. Paste URL and check OpenGraph preview
4. Verify title, description, image display correctly

---

## API Integration

### Development (No Backend Required)
The app uses mock data automatically:

```javascript
// src/services/api.js provides mock data
const post = await apiService.getPost(1)
```

### Production (With Backend)

Create `.env.local`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

Your API should return:
```json
{
  "id": 1,
  "title": {
    "uz": "Мақола (UZ)",
    "en": "Title (EN)",
    "ru": "Заголовок (RU)"
  },
  "description": {
    "uz": "Таврифи (UZ)",
    "en": "Description (EN)",
    "ru": "Описание (RU)"
  },
  "content": {
    "uz": "Мотн (UZ)",
    "en": "Content (EN)",
    "ru": "Содержание (RU)"
  },
  "image": "https://example.com/image.jpg",
  "author": "Author Name",
  "publishedAt": "2024-01-17T10:00:00Z",
  "tags": ["tag1", "tag2"]
}
```

---

## Customization Guide

### Change Default Language
In `src/i18n/index.js`:
```javascript
const i18n = createI18n({
  locale: 'en', // Change from 'uz' to 'en'
  ...
})
```

### Add More Languages
1. Add language code to `languages` object
2. Add translations to `messages` object
3. Update router `regex: '(uz|en|ru|new)'`
4. Add locale mapping in `useSeoMeta.js`

### Customize Colors
In `App.vue` styles:
```css
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add New Pages
1. Create `src/pages/YourPage.vue`
2. Add route in `src/router/index.js`:
```javascript
{
  path: 'yourpage',
  name: 'YourPage',
  component: () => import('../pages/YourPage.vue')
}
```
3. Import `useSeoMeta` in component:
```javascript
useSeoMeta({
  title: 'Page Title',
  description: 'Page description',
  currentLanguage: currentLanguage
})
```

---

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Ensure all imports use correct paths from `src/`
```javascript
import router from './router'              // ✓ Correct
import router from './router/index.js'     // ✓ Also works
import router from '/router'               // ✗ Wrong
```

### Issue: Language not switching
**Solution:** Check route parameter is being passed:
```javascript
// ✓ Correct - includes language
router.push({ path: `/en/post/1` })

// ✗ Wrong - missing language
router.push({ path: `/post/1` })
```

### Issue: SEO tags not updating on language change
**Solution:** Use computed properties in useSeoMeta:
```javascript
// ✓ Correct - updates reactively
useSeoMeta({
  title: computed(() => post.value.title[lang.value])
})

// ✗ Wrong - static value
useSeoMeta({
  title: post.value.title.uz
})
```

---

## Next Steps

1. **Connect Real API**
   - Update `VITE_API_URL` in `.env`
   - Implement backend endpoints

2. **Deploy to Production**
   - Run `npm run build`
   - Deploy `dist/` folder to server

3. **SEO Optimization**
   - Add sitemap.xml
   - Add robots.txt
   - Submit to Google Search Console
   - Add structured data (JSON-LD)

4. **Analytics**
   - Integrate Google Analytics 4
   - Track page views per language
   - Monitor engagement

5. **Performance**
   - Optimize images (use CDN)
   - Enable compression
   - Set cache headers
   - Use service workers for PWA

---

## File Descriptions

| File | Purpose |
|------|---------|
| `main.js` | App initialization with @vueuse/head |
| `App.vue` | Root component + language switcher |
| `router/index.js` | Vue Router with language prefixes |
| `i18n/index.js` | Translation configuration |
| `useSeoMeta.js` | SEO meta tag composable |
| `api.js` | REST API service |
| `Post.vue` | Dynamic post display |
| `About.vue` | About page |
| `Contact.vue` | Contact form |
| `NotFound.vue` | 404 error page |

---

## URLs to Test

```
http://localhost:5173/uz              # Uzbek home
http://localhost:5173/en              # English home
http://localhost:5173/ru              # Russian home
http://localhost:5173/uz/post/1       # Uzbek post
http://localhost:5173/en/post/1       # English post
http://localhost:5173/ru/post/1       # Russian post
http://localhost:5173/uz/about        # Uzbek about
http://localhost:5173/en/contact      # English contact
http://localhost:5173/invalid         # 404 error
```

---

## Browser Inspection

### View Meta Tags in DevTools

1. Press **F12** to open DevTools
2. Go to **Elements** tab
3. Expand `<head>` section
4. Look for:
   - `<title>` tag
   - `<meta name="description">`
   - `<meta property="og:title">`
   - `<meta property="og:image">`
   - `<meta name="twitter:card">`

---

## Production Checklist

- [ ] Replace mock data with real API
- [ ] Set production API URL in `.env.production`
- [ ] Test all language variants
- [ ] Verify OpenGraph tags with debuggers
- [ ] Add robots.txt and sitemap.xml
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS on backend
- [ ] Enable gzip compression
- [ ] Set cache headers
- [ ] Add analytics tracking
- [ ] Monitor error logs
- [ ] Test on mobile devices

---

**Ready to Go! 🚀**

The application is fully functional and ready for customization. All files are production-ready with comments explaining the SEO implementation.

For detailed implementation guide, see: `VUE3_SEO_IMPLEMENTATION_GUIDE.md`
