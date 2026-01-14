<template>
  <main>
    <PageBanner :title="route.meta.title || 'Tadbirlar'" />
    <div class="page-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadEventsData" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <!-- Content -->
        <div v-else class="news-grid">
          <div v-if="paginatedEvents.length === 0" class="no-results">{{ $t('events.no_results') || 'Tadbir topilmadi' }}</div>
          <div v-for="(event, index) in paginatedEvents" :key="event.slug || index" class="news-card">
            <RouterLink :to="getLocalizedPath(`/events/${event.slug}`)" class="card-link">
              <div class="card-image-wrapper">
                <img :src="event.image" :alt="event.title" class="card-image" @error="handleImageError">
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ event.title }}</h3>
                <p class="card-description" v-if="getPlainText(event.content)">
                  {{ getPlainText(event.content).substring(0, 120) }}{{ getPlainText(event.content).length > 120 ? '...' : '' }}
                </p>
                <div class="card-meta">
                  <span class="card-date">{{ event.date }}</span>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
        <div class="pagination" v-if="totalPages > 1">
          <a v-if="currentPage > 1" href="#" class="page-arrow" @click.prevent="prevPage"><</a>
          <a
            v-for="n in pages"
            :key="n"
            href="#"
            class="page-number"
            :class="{ active: n === currentPage }"
            @click.prevent="goToPage(n)"
          >{{ n }}</a>
          <a v-if="currentPage < totalPages" href="#" class="page-arrow" @click.prevent="nextPage">></a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta'
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

useMeta({
  title: 'Ziyoli Avlod - Tadbirlar',
  meta: [
    { name: 'description', content: 'Ziyoli Avlod jurnalining barcha tadbirlarini ko\'ring.' },
    { name: 'keywords', content: 'ziyoli avlod, tadbirlar, konferensiyalar' },
    { property: 'og:title', content: 'Ziyoli Avlod - Tadbirlar' },
    { property: 'og:description', content: 'Ziyoli Avlod jurnalining barcha tadbirlarini ko\'ring.' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// API integration
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const events = ref([]);

// API dan ma'lumotlarni olish
const loadEventsData = async () => {
  try {
    const response = await fetchData('/tadbirlars', { populate: 'Rasmi' });
    
    if (response.data) {
      events.value = response.data.map(event => ({
        id: event.id,
        title: event.Nomi,
        content: getPlainText(event.Text),
        htmlContent: parseRichText(event.Text),
        date: event.Sana,
        slug: event.slug,
        image: getImageUrl(event.Rasmi?.[0])
      }));
      currentPage.value = 1;
    }
  } catch (err) {
    console.error('Events data yuklanmadi:', err);
  }
};

// Pagination: 10 items per page
const PER_PAGE = 10;
const currentPage = ref(1);

const totalPages = computed(() => {
  const total = events.value.length;
  return Math.max(1, Math.ceil(total / PER_PAGE));
});

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return events.value.slice(start, start + PER_PAGE);
});

const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));

const goToPage = (n) => {
  const bounded = Math.min(Math.max(1, n), totalPages.value);
  currentPage.value = bounded;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ERasm%3C/text%3E%3C/svg%3E';
};

// Locale o'zgarishini kuzatish
watch(currentLocale, () => {
  loadEventsData();
});

onMounted(() => {
  loadEventsData();
});
</script>

<style scoped>
.page-content {
  padding: 80px 0;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.no-results {
  grid-column: 1 / -1;
  padding: 60px 20px;
  text-align: center;
  color: #718096;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 16px;
}

.news-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image-wrapper {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f7fafc;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.news-card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.card-description {
  font-size: 14px;
  color: #718096;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.card-date {
  font-size: 12px;
  color: #a0aec0;
  font-weight: 500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2c5282;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  color: #718096;
  margin: 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.error-state p {
  font-size: 15px;
  color: #e53e3e;
  margin: 0 0 16px 0;
}

.retry-btn {
  background: #2c5282;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #2a4a7a;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}

.page-number,
.page-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  color: #2d3748;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}

.page-number.active,
.page-number:hover {
  background: #2c5282;
  color: #ffffff;
  border-color: #2c5282;
}

.page-arrow:hover {
  background: #2c5282;
  color: #ffffff;
  border-color: #2c5282;
}

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .news-grid {
    gap: 24px;
  }

  .card-image-wrapper {
    height: 200px;
  }
}

@media (max-width: 992px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .news-grid {
    gap: 20px;
  }

  .card-image-wrapper {
    height: 180px;
  }

  .card-content {
    padding: 20px;
  }

  .card-title {
    font-size: 18px;
  }
}

@media (max-width: 576px) {
  .page-content {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-image-wrapper {
    height: 200px;
  }

  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .card-image-wrapper {
    height: 180px;
  }
}
</style>