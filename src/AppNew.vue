<template>
  <div id="app" class="app-container">
    <!-- Navigation with Language Switcher -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <h1>{{ $t('appTitle') }}</h1>
        </div>
        
        <!-- Language Switcher -->
        <div class="language-switcher">
          <button
            v-for="lang in languages"
            :key="lang"
            :class="['lang-btn', { active: currentLanguage === lang }]"
            @click="switchLanguage(lang)"
          >
            {{ getLangLabel(lang) }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Area with Router -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 Multilingual SEO App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()

// Available languages
const languages = ['uz', 'en', 'ru']

// Current language state
const currentLanguage = ref(locale.value)

// Watch for route changes to update current language
watch(
  () => router.currentRoute.value.params.language,
  (newLang) => {
    if (newLang && languages.includes(newLang)) {
      currentLanguage.value = newLang
      locale.value = newLang
    }
  }
)

/**
 * Switch to a different language and update the route
 * @param {string} lang - Language code (uz, en, or ru)
 */
const switchLanguage = (lang) => {
  currentLanguage.value = lang
  locale.value = lang
  
  // Get the current route path without language prefix
  const currentPath = router.currentRoute.value.path
  const pathParts = currentPath.split('/')
  
  // Remove empty string and language prefix from path
  const cleanPath = '/' + pathParts.slice(2).join('/')
  
  // Navigate to the same route with new language prefix
  router.push({ 
    path: `/${lang}${cleanPath === '/' ? '' : cleanPath}`
  })
}

/**
 * Get human-readable language label
 * @param {string} lang - Language code
 * @returns {string} Human-readable language name
 */
const getLangLabel = (lang) => {
  const labels = {
    uz: 'Ўзбек',
    en: 'English',
    ru: 'Русский'
  }
  return labels[lang] || lang
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
}

/* Navbar Styles */
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Language Switcher */
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.lang-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

/* Footer */
.footer {
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  padding: 2rem;
  text-align: center;
  color: #666;
  margin-top: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>
