# Vue 3 Multilingual SEO - Advanced Guide & Troubleshooting

## Advanced Features & Patterns

### 1. Dynamic SEO for Complex Data Structures

#### Pattern: API with Nested Translations

```javascript
// API Response Structure
{
  id: 1,
  metadata: {
    title: { uz: '...', en: '...', ru: '...' },
    description: { uz: '...', en: '...', ru: '...' },
    keywords: { uz: '...', en: '...', ru: '...' }
  },
  content: {
    blocks: [
      { type: 'text', content: { uz: '...', en: '...', ru: '...' } }
    ]
  }
}

// Component Usage
const currentLanguage = computed(() => route.params.language)
const title = computed(() => post.value?.metadata?.title[currentLanguage.value])
const description = computed(() => post.value?.metadata?.description[currentLanguage.value])

useSeoMeta({
  title,
  description,
  currentLanguage
})
```

---

### 2. Category-Based SEO Tags

```javascript
// Route with dynamic categories
{
  path: 'category/:category/:id',
  name: 'CategoryPost',
  component: () => import('../pages/CategoryPost.vue')
}

// Component
const route = useRoute()
const category = computed(() => route.params.category)
const title = computed(() => 
  `${category.value} - ${post.value?.title[currentLanguage.value]}`
)

useSeoMeta({ title, description, currentLanguage })
```

---

### 3. Canonical URLs for Duplicate Content

```javascript
// Ensure canonical URL when multiple paths point to same content
const canonicalUrl = computed(() => {
  // Use primary language version as canonical
  const url = window.location.href
  const primaryUrl = url.replace(
    /\/(uz|en|ru)\//, 
    '/en/'  // Set English as primary
  )
  return primaryUrl
})

useSeoMeta({
  title, description,
  url: canonicalUrl,
  currentLanguage
})
```

---

### 4. Structured Data (JSON-LD)

Add structured data for better search engine understanding:

```vue
<script setup>
import { computed } from 'vue'
import { useHead } from '@vueuse/head'

const post = ref({})
const currentLanguage = computed(() => route.params.language)

// Generate JSON-LD structured data
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: post.value?.title[currentLanguage.value],
  description: post.value?.description[currentLanguage.value],
  image: post.value?.image,
  datePublished: post.value?.publishedAt,
  author: {
    '@type': 'Person',
    name: post.value?.author
  },
  inLanguage: currentLanguage.value.toUpperCase()
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
})
</script>
```

---

### 5. SEO for Paginated Content

```javascript
// Route for paginated lists
{
  path: 'posts',
  name: 'PostsList',
  component: () => import('../pages/PostsList.vue')
}

// Component with pagination
const route = useRoute()
const page = computed(() => route.query.page || 1)
const currentLanguage = computed(() => route.params.language)

const title = computed(() => 
  page.value === 1 
    ? t('allPosts')
    : `Posts - Page ${page.value}`
)

// Dynamic description including pagination info
const description = computed(() => 
  `Page ${page.value} of our blog posts in ${getLanguageName(currentLanguage.value)}`
)

useSeoMeta({
  title,
  description,
  currentLanguage,
  url: window.location.href
})
```

---

### 6. Author Page SEO

```javascript
// Route for author profiles
{
  path: 'author/:authorId',
  name: 'Author',
  component: () => import('../pages/AuthorDetail.vue')
}

// Component
const author = ref({})
const currentLanguage = computed(() => route.params.language)

const title = computed(() => 
  `${author.value?.name} - Author`
)

const description = computed(() =>
  author.value?.bio?.[currentLanguage.value]
)

useSeoMeta({
  title,
  description,
  image: author.value?.profileImage,
  currentLanguage,
  author: author.value?.name,
  type: 'profile'
})
```

---

## Troubleshooting Guide

### Issue 1: Meta tags not rendering in HTML source

**Symptoms:**
- `<meta>` tags missing when viewing page source
- View Source (Ctrl+U) shows placeholder tags

**Causes:**
- @vueuse/head requires proper initialization
- Client-side rendering means meta tags appear after JS loads

**Solutions:**

```javascript
// ✓ Correct - In main.js
import { createHead } from '@vueuse/head'
const head = createHead()
app.use(head)

// Check if head is properly installed
console.log(app._context.plugins)
```

For Server-Side Rendering (SSR), use @unhead with SSR support:

```javascript
// Advanced: Use Unhead for SSR
import { useHead } from '@unhead/vue'
// Works with both client and server
```

---

### Issue 2: Language parameter ignored in nested routes

**Symptoms:**
- Navigating to `/en/post/1` still shows Uzbek content
- Language switcher doesn't work on certain pages

**Causes:**
- Language not properly extracted from route params
- Computed property not reactive to route changes

**Solutions:**

```javascript
// ✓ Correct way
const currentLanguage = computed(() => {
  return route.params.language || 'uz'
})

// ✓ Watch for changes
watch(
  () => route.params.language,
  (newLang) => {
    if (newLang) currentLanguage.value = newLang
  }
)

// ✗ Wrong - static variable
const currentLanguage = route.params.language
```

---

### Issue 3: Slow performance with large number of routes

**Symptoms:**
- App slow to load
- Router takes time to compile

**Solutions:**

```javascript
// ✓ Use lazy loading for all pages
{
  path: 'page/:id',
  component: () => import('../pages/Page.vue')
}

// ✓ Use code splitting for components
const HeavyComponent = defineAsyncComponent(() =>
  import('../components/Heavy.vue')
)

// ✓ Implement route-based code splitting
{
  path: 'search',
  component: () => import(/* webpackChunkName: "search" */ '../pages/Search.vue')
}
```

---

### Issue 4: SEO tags update too slowly

**Symptoms:**
- Social media shows old title/description
- Meta tags cache prevents updates

**Solutions:**

```javascript
// ✓ Use revalidation headers
fetch(url, {
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }
})

// ✓ Set proper cache headers on server
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300') // 5 minutes
  next()
})
```

---

### Issue 5: Mobile SEO not working

**Symptoms:**
- Mobile search results show wrong content
- Mobile OpenGraph tags missing

**Solutions:**

```javascript
// ✓ Ensure viewport meta tag
<meta name="viewport" content="width=device-width, initial-scale=1.0">

// ✓ Check mobile-specific og tags
<meta property="og:title" content="...">
<meta property="og:image:width" content="600">
<meta property="og:image:height" content="600">

// ✓ Test with Google Mobile-Friendly Test
// https://search.google.com/test/mobile-friendly
```

---

## Performance Optimization Techniques

### 1. Image Optimization for SEO

```javascript
// ✓ Optimize OpenGraph images
const imageUrl = computed(() => {
  // Use appropriately sized image
  return post.value?.image?.replace('original', 'og') || ''
})

useSeoMeta({
  image: imageUrl, // Should be 1200x630px for og:image
})
```

### 2. Lazy Load Heavy Components

```vue
<template>
  <Suspense>
    <template #default>
      <HeavyComponent :data="post" />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup>
const HeavyComponent = defineAsyncComponent(
  () => import('../components/Heavy.vue')
)
</script>
```

### 3. Debounce SEO Updates

```javascript
import { useDebounceFn } from '@vueuse/core'

const updateSeoTags = useDebounceFn(() => {
  useSeoMeta({
    title,
    description,
    currentLanguage
  })
}, 300)

watch([title, description, currentLanguage], updateSeoTags)
```

---

## API Best Practices

### 1. Handle API Errors Gracefully

```javascript
// In component
const loadPost = async () => {
  try {
    post.value = await apiService.getPost(id)
  } catch (error) {
    // Fallback to mock data
    post.value = await apiService.getMockPost(id)
    console.warn('Using mock data:', error)
  }
}
```

### 2. Implement Request Caching

```javascript
// In api.js
class CachedApiService extends ApiService {
  constructor() {
    super()
    this.cache = new Map()
  }

  async getPost(id) {
    const cacheKey = `post_${id}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    const data = await super.getPost(id)
    this.cache.set(cacheKey, data)
    
    // Clear cache after 5 minutes
    setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000)
    
    return data
  }
}
```

### 3. Request Deduplication

```javascript
// Prevent duplicate API calls
class DedupedApiService extends ApiService {
  constructor() {
    super()
    this.pendingRequests = new Map()
  }

  async getPost(id) {
    const key = `post_${id}`
    
    // Return existing promise if request in progress
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }
    
    // Create new request
    const promise = super.getPost(id)
    this.pendingRequests.set(key, promise)
    
    // Remove from pending when done
    promise.finally(() => this.pendingRequests.delete(key))
    
    return promise
  }
}
```

---

## Testing SEO Implementation

### Unit Tests

```javascript
// tests/composables/useSeoMeta.spec.js
import { describe, it, expect } from 'vitest'
import { useSeoMeta } from '@/composables/useSeoMeta'

describe('useSeoMeta', () => {
  it('should set title tag correctly', () => {
    useSeoMeta({
      title: 'Test Title',
      description: 'Test Description',
      currentLanguage: 'en'
    })
    
    expect(document.title).toBe('Test Title')
  })

  it('should generate correct og:locale', () => {
    useSeoMeta({
      title: 'Title',
      description: 'Desc',
      currentLanguage: 'uz'
    })
    
    const ogLocale = document.querySelector('[property="og:locale"]')
    expect(ogLocale?.content).toBe('uz_UZ')
  })
})
```

### E2E Tests

```javascript
// tests/e2e/seo.spec.js
describe('SEO Meta Tags', () => {
  it('should update meta tags when language changes', async () => {
    await page.goto('http://localhost:5173/uz/post/1')
    
    // Check Uzbek meta tags
    let title = await page.title()
    expect(title).toContain('Ўзбек')
    
    // Switch to English
    await page.click('[data-lang="en"]')
    await page.waitForURL('**/en/**')
    
    // Check English meta tags
    title = await page.title()
    expect(title).not.toContain('Ўзбек')
  })
})
```

---

## SEO Debugging Tools

### 1. Browser Console Checks

```javascript
// In browser console - verify meta tags
console.log('Title:', document.title)
console.log('OG Title:', document.querySelector('[property="og:title"]')?.content)
console.log('Description:', document.querySelector('[name="description"]')?.content)
console.log('HTML Lang:', document.documentElement.lang)
```

### 2. External Tools

- **Google Search Console**: Monitor indexing status
- **Lighthouse**: Audit SEO performance (DevTools)
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Screaming Frog**: Crawl site and analyze SEO issues

### 3. Schema Testing

```javascript
// Validate JSON-LD structured data
// https://schema.org/validator/

{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article Title",
  "image": "https://example.com/image.jpg",
  "datePublished": "2024-01-17T10:00:00Z"
}
```

---

## Migration from Other Frameworks

### From Nuxt

```javascript
// Nuxt's useHead() → @vueuse/head
import { useHead } from '@vueuse/head'

// No changes needed - same API!
useHead({
  title: 'Page Title',
  meta: [...]
})
```

### From Next.js

```javascript
// Next's next/head → @vueuse/head
import { useHead } from '@vueuse/head'

// Similar but Vue syntax
useHead({
  title: 'Page Title',
  meta: [...]
})
```

---

## Monitoring & Analytics

### Track Meta Tag Changes

```javascript
// Monitor which meta tags are being set
if (import.meta.env.DEV) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'META') {
            console.log('Meta tag added:', node.getAttribute('name') || node.getAttribute('property'), node.getAttribute('content'))
          }
        })
      }
    })
  })
  
  observer.observe(document.head, { childList: true })
}
```

### Track SEO Performance

```javascript
// Google Analytics 4 - Track page views with language
import { gtag } from 'ga-scripts'

watch(() => route.params.language, (lang) => {
  gtag.pageview({
    page_location: window.location.href,
    page_language: lang,
    page_title: document.title
  })
})
```

---

## Common Mistakes to Avoid

❌ **Don't:**
```javascript
// Static string - won't update
useSeoMeta({ title: post.value.title[lang.value] })

// Non-reactive language
const lang = 'uz'
useSeoMeta({ currentLanguage: lang })

// Forgetting language parameter in routes
router.push('/post/1')  // Should be /uz/post/1

// Duplicate meta tags
useSeoMeta() called multiple times without cleanup
```

✅ **Do:**
```javascript
// Computed - updates reactively
useSeoMeta({ title: computed(() => post.value.title[lang.value]) })

// Reactive language
const lang = computed(() => route.params.language)
useSeoMeta({ currentLanguage: lang })

// Always include language
router.push(`/${lang.value}/post/1`)

// Call useSeoMeta once per component
// It automatically updates when dependencies change
```

---

## Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | ✓ |
| Largest Contentful Paint | < 2.5s | ✓ |
| Cumulative Layout Shift | < 0.1 | ✓ |
| Time to Interactive | < 3.5s | ✓ |

Monitor with:
```javascript
// Use Web Vitals library
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

---

## Resources & References

- [@vueuse/head Documentation](https://github.com/unjs/unhead)
- [Google SEO Starter Guide](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me)
- [Schema.org Structured Data](https://schema.org)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq)

---

**Last Updated:** January 17, 2026
**Version:** 1.0.0 Advanced Edition
