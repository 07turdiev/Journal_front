<template>
  <div class="not-found-container">
    <div class="not-found-box">
      <h1 class="error-code">404</h1>
      <h2>{{ $t('notFound') || 'Page Not Found' }}</h2>
      <p>
        The page you are looking for does not exist or has been moved.
      </p>
      <RouterLink to="/" class="home-link">
        {{ $t('backHome') || 'Back to Home' }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useSeoMeta } from '../composables/useSeoMeta'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentLanguage = computed(() => route.params.language || 'uz')

useSeoMeta({
  title: computed(() => {
    const titles = {
      uz: 'Саҳифа топилмади',
      en: 'Page Not Found',
      ru: 'Страница не найдена'
    }
    return titles[currentLanguage.value] || 'Not Found'
  }),
  description: 'The page you are looking for does not exist.',
  currentLanguage: currentLanguage
})
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.not-found-box {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: #667eea;
  margin: 0;
  line-height: 1;
}

.not-found-box h2 {
  font-size: 2rem;
  color: #222;
  margin: 0.5rem 0 1rem;
}

.not-found-box p {
  color: #666;
  margin: 1rem 0 2rem;
  font-size: 1.1rem;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.home-link:hover {
  background: #764ba2;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 4rem;
  }

  .not-found-box h2 {
    font-size: 1.5rem;
  }
}
</style>
