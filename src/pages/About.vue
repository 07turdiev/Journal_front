<template>
  <div class="about-container">
    <header class="about-header">
      <h1>{{ pageTitle }}</h1>
      <p class="lead">{{ pageDescription }}</p>
    </header>

    <section class="about-content">
      <div class="content-section">
        <h2>{{ $t('about') }}</h2>
        <p>
          Welcome to our multilingual journal. This is a modern Vue 3 application
          demonstrating best practices for SEO and internationalization (i18n).
        </p>
        <p>
          Every page automatically updates its meta tags based on the current language
          and content, ensuring optimal SEO performance across all language versions.
        </p>
      </div>

      <div class="features">
        <h2>Features</h2>
        <ul>
          <li>✓ Multi-language support (Uzbek, English, Russian)</li>
          <li>✓ Dynamic SEO meta tags</li>
          <li>✓ Language-based routing</li>
          <li>✓ Responsive design</li>
          <li>✓ Production-ready code</li>
          <li>✓ Open Graph and Twitter Card support</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSeoMeta } from '../composables/useSeoMeta'

const route = useRoute()
const currentLanguage = computed(() => route.params.language || 'uz')

const pageTitle = computed(() => {
  const titles = {
    uz: 'Ҳақимизда',
    en: 'About Us',
    ru: 'О нас'
  }
  return titles[currentLanguage.value] || 'About'
})

const pageDescription = computed(() => {
  const descriptions = {
    uz: 'Ўз ҳақимиза батафсил маълумот',
    en: 'Learn more about our journal and mission',
    ru: 'Узнайте больше о нашем журнале и миссии'
  }
  return descriptions[currentLanguage.value] || ''
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  image: 'https://via.placeholder.com/1200x630?text=About',
  currentLanguage: currentLanguage,
  url: computed(() => window.location.href),
  type: 'website'
})
</script>

<style scoped>
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #667eea;
}

.about-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #222;
}

.lead {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.about-content {
  display: grid;
  gap: 2rem;
}

.content-section,
.features {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section h2,
.features h2 {
  color: #667eea;
  margin-bottom: 1rem;
}

.content-section p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 1rem;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.75rem 0;
  color: #555;
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 1.8rem;
  }

  .about-container {
    padding: 1rem;
  }
}
</style>
