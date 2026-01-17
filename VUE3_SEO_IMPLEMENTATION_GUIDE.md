# Vue 3 Multilingual SEO Application - Complete Implementation Guide

## Project Overview

This is a production-ready Vue 3 application with comprehensive multilingual support (Uzbek, English, Russian) and dynamic SEO meta tag management. The application demonstrates best practices for:

- **Vue 3 Composition API** - Modern reactive component logic
- **vue-router** - Language-based routing with `/uz`, `/en`, `/ru` prefixes
- **vue-i18n** - Internationalization framework for multilingual content
- **@vueuse/head** - Server-safe head management for SEO
- **REST API Integration** - Fetch multilingual content from backend
- **Dynamic SEO** - Automatic meta tag generation based on language and content

---

## Architecture Overview

### File Structure

```
src/
├── main.js                          # App entry point with @vueuse/head
├── App.vue                          # Root component with language switcher
├── router/
│   └── index.js                     # Vue Router with language-based routes
├── i18n/
│   └── index.js                     # vue-i18n configuration
├── composables/
│   └── useSeoMeta.js                # Reusable SEO composable
├── services/
│   └── api.js                       # REST API service
└── pages/
    ├── Post.vue                     # Dynamic post with SEO
    ├── About.vue                    # Static page
    ├── Contact.vue                  # Contact form page
    └── NotFound.vue                 # 404 error page
```

---

## Core Components & Features

### 1. Main Entry Point (`main.js`)

Initializes the Vue application with:
- **@vueuse/head plugin** for SEO meta management
- **vue-router** for navigation
- **vue-i18n** for multilingual support

```javascript
import { createHead } from '@vueuse/head'
const head = createHead()
app.use(head)
```

---

### 2. Root Component (`App.vue`)

Features:
- **Language Switcher**: Buttons to change language (Ўзбек, English, Русский)
- **Navigation Bar**: Sticky header with branding
- **Router View**: Dynamic page content
- **Footer**: Site-wide footer

**Key Functions:**
- `switchLanguage(lang)` - Change language and update route
- Watches route changes to sync language state
- Responsive design for mobile devices

---

### 3. Router Configuration (`router/index.js`)

**Routes Structure:**
```
/                     → Redirect to /uz
/uz                   → Home (Uzbek)
/uz/post/1            → Post #1 (Uzbek)
/uz/about             → About page (Uzbek)
/uz/contact           → Contact form (Uzbek)

/en                   → Home (English)
/en/post/1            → Post #1 (English)
...

/ru                   → Home (Russian)
/ru/post/1            → Post #1 (Russian)
...
```

**Features:**
- Language parameter validation
- Navigation guard to prevent invalid languages
- Scroll behavior management
- 404 fallback route

---

### 4. i18n Configuration (`i18n/index.js`)

**Supported Languages:**
- `uz` - Ўзбек (Uzbek)
- `en` - English
- `ru` - Русский (Russian)

**Translation Structure:**
```javascript
messages = {
  uz: { appTitle: 'Қўл Халал', ... },
  en: { appTitle: 'Journal Front', ... },
  ru: { appTitle: 'Журнал', ... }
}
```

**Configuration:**
- Legacy mode: `false` (Composition API compatible)
- Default locale: `uz`
- Fallback locale: `en`

---

### 5. SEO Composable (`composables/useSeoMeta.js`)

**Purpose:** Centralized SEO meta tag management using @vueuse/head

**Features:**
- Dynamic title and description
- OpenGraph tags (og:title, og:description, og:image, og:locale)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Language-specific `<html lang>` attribute
- Alternate language links for multilingual SEO
- Canonical URL

**Usage Example:**

```javascript
import { useSeoMeta } from '../composables/useSeoMeta'

// In your component
useSeoMeta({
  title: computed(() => post.value.title[currentLanguage.value]),
  description: computed(() => post.value.description[currentLanguage.value]),
  image: computed(() => post.value.image),
  currentLanguage: currentLanguage,
  url: 'https://example.com/uz/post/1',
  author: 'John Doe',
  type: 'article'
})
```

**Generated Meta Tags:**
```html
<title>Мақола 1 - Ўзбек Тилида</title>
<meta name="description" content="Бу ўзбек тилида мақоланинг кичик таврифи">
<meta property="og:title" content="Мақола 1 - Ўзбек Тилида">
<meta property="og:description" content="...">
<meta property="og:image" content="https://...">
<meta property="og:locale" content="uz_UZ">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<html lang="uz">
<link rel="alternate" hrefLang="uz" href="...">
<link rel="canonical" href="...">
```

---

### 6. API Service (`services/api.js`)

**Purpose:** REST API communication with multilingual content

**API Response Format:**
```json
{
  "id": 1,
  "title": {
    "uz": "Мақола 1 - Ўзбек",
    "en": "Post 1 - English",
    "ru": "Статья 1 - Русский"
  },
  "description": {
    "uz": "Таврифи...",
    "en": "Description...",
    "ru": "Описание..."
  },
  "content": {
    "uz": "Тўлиқ матн...",
    "en": "Full content...",
    "ru": "Полное содержание..."
  },
  "image": "https://example.com/image.jpg",
  "author": "John Doe",
  "publishedAt": "2024-01-17T10:00:00Z",
  "tags": ["tutorial", "vue", "seo"]
}
```

**Available Methods:**
- `getPost(id)` - Fetch single post
- `getPosts(params)` - Fetch multiple posts with pagination
- `getPage(slug)` - Fetch static pages
- `getSiteConfig()` - Fetch site configuration
- `searchPosts(params)` - Search functionality
- `getRelatedPosts(postId)` - Get related articles
- `getMockPost(id)` - Mock data for development

**Fallback Behavior:**
If API is unavailable, the service uses mock data automatically, allowing development without a backend.

---

### 7. Dynamic Post Page (`pages/Post.vue`)

**Features:**
- Fetches post data from API
- Displays multilingual content based on route language
- Automatic SEO meta tag generation
- Loading and error states
- Featured image support
- Author and publication date
- Tag display
- Related posts section
- Responsive design

**Reactive Updates:**
- Meta tags update when language changes
- Meta tags update when post ID changes
- Content automatically translates on language switch

---

### 8. Static Pages

#### About Page (`pages/About.vue`)
- Features overview
- Automatic SEO meta tags
- Language-specific content

#### Contact Page (`pages/Contact.vue`)
- Contact form with validation
- Submit message feedback
- Language-specific labels

#### 404 Page (`pages/NotFound.vue`)
- Error page for invalid routes
- Link back to home

---

## SEO Implementation Details

### Dynamic Meta Tags

Meta tags are **automatically generated and updated** based on:

1. **Current Language**: Route parameter `/uz`, `/en`, `/ru`
2. **Page Content**: API data or component data
3. **Route Changes**: Meta tags update when navigating between posts
4. **Language Switches**: Meta tags update instantly when changing language

### OpenGraph Tags

Used by social media platforms (Facebook, LinkedIn, etc.) for rich previews:

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="article">
<meta property="og:url" content="...">
<meta property="og:locale" content="uz_UZ">
```

### Twitter Cards

Used by Twitter/X for rich tweet previews:

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### Language Hreflang Tags

Tells search engines about language variants of the same page:

```html
<link rel="alternate" hrefLang="uz" href="https://example.com/uz/post/1">
<link rel="alternate" hrefLang="en" href="https://example.com/en/post/1">
<link rel="alternate" hrefLang="ru" href="https://example.com/ru/post/1">
<link rel="canonical" href="https://example.com/en/post/1">
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

Required packages:
- `vue` ^3.3.0
- `vue-router` ^4.x
- `vue-i18n` ^9.x
- `@vueuse/head` ^2.x

### 2. Environment Configuration

Create `.env.local` for API configuration:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Integration

### Mock Data (Development)

For development without a backend, the API service automatically uses mock data:

```javascript
// src/services/api.js
const post = await apiService.getPost(1)
// Falls back to getMockPost() if API fails
```

### Real API (Production)

Update the API base URL in `.env`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

API endpoints:
- `GET /api/posts/:id` - Single post
- `GET /api/posts` - List posts
- `GET /api/pages/:slug` - Static page
- `GET /api/posts/:id/related` - Related posts
- `GET /api/search?q=keyword` - Search

---

## Language-Based Routing Examples

### Navigation in Components

```javascript
// Change language and maintain current page
router.push({
  path: `/en/post/1`,
  params: { language: 'en', id: '1' }
})
```

### Direct URLs

```
/uz              → Home in Uzbek
/en              → Home in English
/ru              → Home in Russian
/uz/post/42      → Post #42 in Uzbek
/en/post/42      → Post #42 in English
/ru/post/42      → Post #42 in Russian
```

### Automatic Redirects

```
/                → Redirects to /uz (default language)
/invalid/path    → Redirects to 404 page
```

---

## Composition API Examples

### Using useSeoMeta in Components

```vue
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSeoMeta } from '@/composables/useSeoMeta'

const route = useRoute()
const currentLanguage = computed(() => route.params.language)
const post = ref(null)

// Set SEO meta tags
useSeoMeta({
  title: computed(() => post.value?.title[currentLanguage.value]),
  description: computed(() => post.value?.description[currentLanguage.value]),
  image: computed(() => post.value?.image),
  currentLanguage: currentLanguage
})
</script>
```

### Using vue-i18n

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// t('key') - Get translated string
// locale.value - Get/set current language
</script>

<template>
  <h1>{{ t('appTitle') }}</h1>
  <p>{{ $t('description') }}</p>
</template>
```

---

## Performance Optimization

### Code Splitting

Each route page is lazy-loaded:

```javascript
component: () => import('../pages/Post.vue')
```

### Image Optimization

- Use responsive image URLs
- Lazy loading with `loading="lazy"` attribute
- Serve images in modern formats (WebP)

### Caching

API responses can be cached using:

```javascript
// Add caching headers to API requests
const cacheKey = `post_${id}_${language}`
const cached = localStorage.getItem(cacheKey)
```

---

## SEO Best Practices

✅ **Implemented:**
- Dynamic meta titles and descriptions
- OpenGraph tags for social sharing
- Twitter Card tags for rich tweets
- Language-specific hreflang tags
- Canonical URLs
- Proper HTML lang attribute
- Mobile-responsive design
- Fast page load times

### Recommended Additional Steps:

1. **Sitemap.xml** - Generate sitemap for all language variants
2. **robots.txt** - Configure crawler behavior
3. **Structured Data** - Add JSON-LD for article schema
4. **Performance** - Use image CDN, compress assets
5. **Accessibility** - Add ARIA labels, semantic HTML
6. **Analytics** - Integrate Google Analytics 4

---

## Troubleshooting

### Issue: Meta tags not updating on language change
**Solution:** Ensure `useSeoMeta` receives computed properties that track language changes:

```javascript
// ✅ Correct - Uses computed
useSeoMeta({
  title: computed(() => post.value.title[currentLanguage.value])
})

// ❌ Wrong - Static value
useSeoMeta({
  title: post.value.title.uz
})
```

### Issue: API not responding
**Solution:** The service automatically falls back to mock data:

```javascript
const post = await apiService.getPost(1)
// Uses getMockPost() automatically if API fails
```

### Issue: Page not found after navigation
**Solution:** Ensure route parameters match the pattern:

```
Valid:   /uz/post/1
Invalid: /post/1 (missing language prefix)
Invalid: /en/posts/1 (wrong route name)
```

---

## Production Deployment

### Build for Production

```bash
npm run build
```

### Deployment Checklist

- [ ] Update API URLs in `.env.production`
- [ ] Enable HTTPS for all endpoints
- [ ] Configure CORS headers on backend
- [ ] Add security headers (CSP, X-Frame-Options, etc.)
- [ ] Minify and compress assets
- [ ] Set proper cache headers
- [ ] Submit sitemap to Google Search Console
- [ ] Test all language variants
- [ ] Verify OpenGraph tags with debuggers
- [ ] Set up monitoring and logging

### SEO Verification Tools

- Google Search Console
- Bing Webmaster Tools
- Facebook Sharing Debugger
- Twitter Card Validator
- Lighthouse (Chrome DevTools)

---

## Additional Resources

- [Vue 3 Documentation](https://vuejs.org)
- [Vue Router Guide](https://router.vuejs.org)
- [Vue i18n Documentation](https://vue-i18n.intlify.dev)
- [@vueuse/head](https://github.com/unjs/unhead)
- [Open Graph Protocol](https://ogp.me)
- [Twitter Card Tags](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

---

## License

MIT - Free for commercial and personal use

---

**Last Updated:** January 17, 2026
**Version:** 1.0.0
