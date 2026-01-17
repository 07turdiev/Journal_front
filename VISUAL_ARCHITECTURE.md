# Vue 3 Multilingual SEO - Visual Architecture & Flow

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Window                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   HTML Document                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │            <head> - @vueuse/head              │  │  │
│  │  │  (Dynamic meta tags updated by Vue)           │  │  │
│  │  │  ┌──────────────────────────────────────────┐ │  │  │
│  │  │  │ <title>Dynamic Title</title>             │ │  │  │
│  │  │  │ <meta name="description" ...>            │ │  │  │
│  │  │  │ <meta property="og:*" ...>               │ │  │  │
│  │  │  │ <meta name="twitter:*" ...>              │ │  │  │
│  │  │  │ <link rel="alternate" hrefLang="*" ...>  │ │  │  │
│  │  │  └──────────────────────────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │              <body>                            │  │  │
│  │  │  ┌──────────────────────────────────────────┐ │  │  │
│  │  │  │         #app (Vue Mount Point)           │ │  │  │
│  │  │  │  ┌────────────────────────────────────┐  │ │  │  │
│  │  │  │  │         App.vue (Root)             │  │ │  │  │
│  │  │  │  │                                    │  │ │  │  │
│  │  │  │  │  ┌──────────────────────────────┐ │  │ │  │  │
│  │  │  │  │  │  Navigation Bar              │ │  │ │  │  │
│  │  │  │  │  │  - Language Switcher         │ │  │ │  │  │
│  │  │  │  │  └──────────────────────────────┘ │  │ │  │  │
│  │  │  │  │  ┌──────────────────────────────┐ │  │ │  │  │
│  │  │  │  │  │  RouterView (Dynamic Page)   │ │  │ │  │  │
│  │  │  │  │  │  - Post.vue                  │ │  │ │  │  │
│  │  │  │  │  │  - About.vue                 │ │  │ │  │  │
│  │  │  │  │  │  - Contact.vue               │ │  │ │  │  │
│  │  │  │  │  └──────────────────────────────┘ │  │ │  │  │
│  │  │  │  │  ┌──────────────────────────────┐ │  │ │  │  │
│  │  │  │  │  │  Footer                      │ │  │ │  │  │
│  │  │  │  │  └──────────────────────────────┘ │  │ │  │  │
│  │  │  │  └────────────────────────────────────┘  │ │  │  │
│  │  │  └──────────────────────────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────┐
│   User Browser   │
│   (URL Entry)    │
└────────┬─────────┘
         │
         ▼
    /uz/post/1
         │
         ▼
┌──────────────────────────┐
│   Vue Router             │
│  - Parses language: 'uz' │
│  - Parses id: '1'        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Composition Setup        │
│  currentLanguage = 'uz'   │
│  post = null             │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  API Service             │
│  - getPost(1)            │
│  - Returns multilingual  │
│    data                  │
└────────┬─────────────────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ▼                                             ▼
    ┌──────────┐                            ┌─────────────────┐
    │ Real API │                            │   Mock Data     │
    │ (if up)  │                            │   (Fallback)    │
    └────┬─────┘                            └────────┬────────┘
         │                                          │
         └──────────────────┬─────────────────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │   API Response       │
                │  {                   │
                │    title: {...},     │
                │    description: {...}│
                │    image: "...",     │
                │    ...               │
                │  }                   │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  useSeoMeta()        │
                │  - Reads API data    │
                │  - Reads language    │
                │  - Generates tags    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  @vueuse/head        │
                │  - Updates <head>    │
                │  - Sets <title>      │
                │  - Sets <meta> tags  │
                │  - Sets html lang    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   HTML <head>        │
                │  - Updated tags      │
                │  - Ready for SEO     │
                └──────────────────────┘
```

---

## 🌐 Routing Structure

```
Root (/)
│
├─ /uz (Uzbek Root)
│  ├─ /uz/              → Home (Post List)
│  ├─ /uz/post/:id      → Post Detail (e.g., /uz/post/1)
│  ├─ /uz/about         → About Page
│  ├─ /uz/contact       → Contact Page
│  └─ /uz/search        → Search Results
│
├─ /en (English Root)
│  ├─ /en/              → Home (Post List)
│  ├─ /en/post/:id      → Post Detail (e.g., /en/post/1)
│  ├─ /en/about         → About Page
│  ├─ /en/contact       → Contact Page
│  └─ /en/search        → Search Results
│
├─ /ru (Russian Root)
│  ├─ /ru/              → Home (Post List)
│  ├─ /ru/post/:id      → Post Detail (e.g., /ru/post/1)
│  ├─ /ru/about         → About Page
│  ├─ /ru/contact       → Contact Page
│  └─ /ru/search        → Search Results
│
└─ /* (Not Found)
   └─ 404 Page
```

---

## 🔀 Language Switch Flow

```
Current State: /uz/post/1 (Uzbek)
│
│ User clicks English button
│
▼
switchLanguage('en') called
│
├─ Update currentLanguage = 'en'
├─ Update i18n locale = 'en'
├─ Extract current path: /post/1
└─ Navigate to: /en/post/1
│
▼
Route changes → /en/post/1
│
├─ Route parameter language = 'en'
├─ Post ID remains: 1
└─ Components re-render with new language
│
▼
useSeoMeta() runs again
│
├─ Reads: post.title['en'] instead of post.title['uz']
├─ Reads: post.description['en'] instead of post.description['uz']
└─ Generates new meta tags with English content
│
▼
@vueuse/head updates <head>
│
└─ All meta tags updated to English
   ✓ <title> changed
   ✓ <meta description> changed
   ✓ <meta og:*> changed
   ✓ <html lang> changed
```

---

## 📊 SEO Meta Tag Generation

```
useSeoMeta Composable
│
├─ Input Parameters:
│  ├─ title (computed)
│  ├─ description (computed)
│  ├─ image (computed)
│  ├─ currentLanguage (computed)
│  ├─ url (optional)
│  ├─ author (optional)
│  ├─ keywords (optional)
│  └─ type (default: 'website')
│
├─ Processing:
│  ├─ getStandardMetaTags()
│  │  ├─ <meta name="description">
│  │  ├─ <meta name="viewport">
│  │  ├─ <meta charset>
│  │  ├─ <meta http-equiv="content-language">
│  │  ├─ <meta name="keywords">
│  │  └─ <meta name="author">
│  │
│  ├─ getOpenGraphTags()
│  │  ├─ og:title
│  │  ├─ og:description
│  │  ├─ og:image
│  │  ├─ og:type
│  │  ├─ og:url
│  │  ├─ og:locale (uz_UZ, en_US, ru_RU)
│  │  └─ og:locale:alternate (all 3 languages)
│  │
│  ├─ getTwitterCardTags()
│  │  ├─ twitter:card (summary_large_image)
│  │  ├─ twitter:title
│  │  ├─ twitter:description
│  │  ├─ twitter:image
│  │  └─ twitter:creator
│  │
│  └─ Links:
│     ├─ <link rel="alternate" hrefLang="uz">
│     ├─ <link rel="alternate" hrefLang="en">
│     ├─ <link rel="alternate" hrefLang="ru">
│     └─ <link rel="canonical">
│
└─ Output: Applied to <head> via @vueuse/head
```

---

## 🔄 Component Lifecycle with SEO

```
Component Mount
│
├─ Setup Composition
│  ├─ const route = useRoute()
│  ├─ const currentLanguage = computed(...)
│  ├─ const post = ref(null)
│  └─ useSeoMeta() [Sets initial tags]
│
├─ onMounted Hook
│  └─ loadPost() [Fetch API data]
│
├─ Watch: route.params.id
│  └─ Re-fetch when post ID changes
│
├─ Watch: currentLanguage (implicit)
│  └─ useSeoMeta re-runs automatically
│     (Computed dependencies changed)
│
└─ User Actions
   ├─ Change Language
   │  ├─ Route changes: /uz/post/1 → /en/post/1
   │  ├─ currentLanguage updates
   │  ├─ useSeoMeta re-runs
   │  └─ Meta tags update to English
   │
   ├─ Click Related Post
   │  ├─ Route changes: /en/post/1 → /en/post/42
   │  ├─ Watch triggers loadPost()
   │  ├─ API fetches new post
   │  ├─ useSeoMeta re-runs with new content
   │  └─ Meta tags update to new post
   │
   └─ Component Unmount
      └─ Cleanup (automatic with Composition API)
```

---

## 📱 URL and Meta Tag Relationship

```
URL: /uz/post/1
│
├─ Language: uz (Uzbek)
├─ Route: post
└─ ID: 1

API Call: POST /api/posts/1
Response: {
  id: 1,
  title: {
    uz: "Мақола 1 - Ўзбек",
    en: "Post 1 - English",
    ru: "Статья 1 - Русский"
  },
  description: {
    uz: "Таврифи...",
    en: "Description...",
    ru: "Описание..."
  },
  image: "https://...",
  author: "John Doe",
  publishedAt: "2024-01-17T...",
  tags: ["tag1", "tag2"]
}

Meta Tags Generated:
├─ <title>Мақола 1 - Ўзбек</title>
├─ <meta name="description" content="Таврифи...">
├─ <meta property="og:title" content="Мақола 1 - Ўзбек">
├─ <meta property="og:description" content="Таврифи...">
├─ <meta property="og:image" content="https://...">
├─ <meta property="og:locale" content="uz_UZ">
├─ <meta name="twitter:title" content="Мақола 1 - Ўзбек">
├─ <meta name="twitter:image" content="https://...">
├─ <html lang="uz">
└─ <link rel="alternate" hrefLang="uz" href="/uz/post/1">
   <link rel="alternate" hrefLang="en" href="/en/post/1">
   <link rel="alternate" hrefLang="ru" href="/ru/post/1">

Same Content, Different Language (/en/post/1):
├─ <title>Post 1 - English</title>
├─ <meta name="description" content="Description...">
├─ <meta property="og:locale" content="en_US">
└─ <html lang="en">
```

---

## 🎯 File Dependencies

```
main.js
├─ App.vue
├─ router/index.js
│  └─ pages/Post.vue
│     ├─ composables/useSeoMeta.js
│     ├─ services/api.js
│     └─ router (for navigation)
├─ i18n/index.js
└─ @vueuse/head

App.vue
├─ router/index.js
├─ i18n/index.js
└─ pages/* (all page components)

pages/Post.vue, About.vue, Contact.vue, NotFound.vue
├─ composables/useSeoMeta.js
├─ services/api.js
├─ router (for navigation)
└─ i18n (for translations)

composables/useSeoMeta.js
└─ @vueuse/head

services/api.js
└─ (no dependencies - standalone)

router/index.js
└─ pages/* (imports all page components)

i18n/index.js
└─ (no dependencies - configuration only)
```

---

## 🌍 SEO Visibility Diagram

```
Search Engines Access
│
├─ Google Bot
│  └─ Reads:
│     ├─ <title> ✓
│     ├─ <meta name="description"> ✓
│     ├─ <meta name="keywords"> ✓
│     ├─ <html lang> ✓
│     ├─ <link rel="alternate" hrefLang> ✓
│     ├─ <link rel="canonical"> ✓
│     ├─ OpenGraph tags (for featured images) ✓
│     └─ Content structure ✓
│
├─ Social Media Crawlers
│  └─ Reads (for preview):
│     ├─ og:title ✓
│     ├─ og:description ✓
│     ├─ og:image ✓
│     ├─ og:url ✓
│     └─ og:locale ✓
│
└─ Twitter/X Crawler
   └─ Reads (for tweet preview):
      ├─ twitter:card ✓
      ├─ twitter:title ✓
      ├─ twitter:description ✓
      └─ twitter:image ✓
```

---

## 🚀 Performance Flow

```
Page Load Timeline
│
├─ 0ms - Request starts
│  └─ Browser requests /uz/post/1
│
├─ 100-300ms - HTML downloaded
│  └─ <head> with default meta tags
│     <body> with #app mount point
│
├─ 300-500ms - JS bundle loads
│  └─ main.js initializes
│
├─ 500-700ms - Vue app initializes
│  ├─ Router setup
│  ├─ i18n setup
│  └─ @vueuse/head ready
│
├─ 700-900ms - Route matched
│  └─ Post.vue component loads
│
├─ 900-1100ms - API call starts
│  └─ fetch('/api/posts/1')
│
├─ 1100-1500ms - API response received
│  └─ Data available in component
│
├─ 1500-1700ms - useSeoMeta() runs
│  └─ Computed properties evaluated
│
├─ 1700-1800ms - @vueuse/head updates <head>
│  ├─ <title> updated
│  ├─ <meta> tags injected
│  └─ <html lang> updated
│
└─ 1800ms+ - Page ready
   └─ Fully rendered with correct SEO tags
      ✓ Page title visible in tab
      ✓ Meta tags ready for social share
      ✓ Language attributes set
      ✓ All SEO signals sent
```

---

## 💾 State Management Flow

```
Vue Composition API State

App.vue
└─ currentLanguage (ref)
   ├─ Updated on language switch
   ├─ Synced with route params
   └─ Passed to child components

Post.vue
├─ post (ref)
│  ├─ Fetched from API
│  ├─ Null until loaded
│  ├─ Updated on route change
│  └─ Watched by useSeoMeta
├─ relatedPosts (ref)
├─ loading (ref)
├─ error (ref)
└─ currentLanguage (computed from route)
   └─ Watched by useSeoMeta

useSeoMeta
├─ Reads computed properties
├─ Generates meta tags reactively
└─ Updates <head> automatically

i18n.locale
├─ Set by App.vue on language change
└─ Used by {{ $t('key') }} in templates
```

---

## ✅ SEO Checklist Flow

```
When User Visits /en/post/5

┌─────────────────────────────────┐
│ Check: URL has language prefix? │ ✓ /en/
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: Router matches route?    │ ✓ post detail
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: API fetches data?        │ ✓ getPost(5)
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: Language extracted?      │ ✓ en
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: Content localized?       │ ✓ title[en]
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: useSeoMeta() called?     │ ✓ Yes
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: @vueuse/head updated?    │ ✓ <head> updated
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: <title> set?             │ ✓ English title
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: og: tags set?            │ ✓ All 4 main tags
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: twitter: tags set?       │ ✓ 5 tags
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: html lang set?           │ ✓ lang="en"
└────────────┬────────────────────┘

┌─────────────────────────────────┐
│ Check: hreflang links added?    │ ✓ uz, en, ru
└────────────┬────────────────────┘

✅ All SEO Checks Passed!
Page Ready for Search Engines
```

---

**This visual guide helps understand the complete flow of how Vue 3, routing, i18n, and SEO meta tags work together to create a multilingual SEO-optimized application.**
