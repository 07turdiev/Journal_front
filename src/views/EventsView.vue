<template>
  <main>
    <PageBanner :title="route.meta.title || 'Tadbirlar'" />
    <div class="page-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadEventsData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Content -->
        <div v-else class="news-grid">
          <div v-if="paginatedEvents.length === 0" class="no-results">Tadbir topilmadi</div>
          <div v-for="(event, index) in paginatedEvents" :key="event.slug || index" class="news-card">
            <RouterLink :to="getLocalizedPath(`/events/${event.slug}`)" class="card-link">
              <img :src="event.image" :alt="event.title" class="card-image" @error="handleImageError">
              <div class="card-content">
                <h3 class="card-title">{{ event.title }}</h3>
                <p class="card-date">{{ event.date }}</p>
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
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

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

// Rasm yuklanmagan taqdirda placeholder ko'rsatish
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400?text=Rasm';
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
/* Stillar NewsView.vue bilan bir xil */
.page-content {
  padding: 80px 0; background-color: #FFFFFF;
}
.container {
  max-width: 1140px; margin: 0 auto; padding: 0 15px;
}
.news-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 60px;
}
.news-card {
  background: #F2F3F4; border-radius: 4px; overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.news-card:hover {
  transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
.card-link {
  text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;
}
.card-image {
  width: 100%; height: 220px; object-fit: cover; display: block; background-color: #BDBDBD;
}
.card-content {
  padding: 32px; flex-grow: 1;
}
.card-title {
  font-weight: 700; font-size: 20px; line-height: 1.5; color: #081330; margin: 0 0 16px 0;
}
.card-date {
  font-weight: 400; font-size: 16px; color: rgba(7, 25, 70, 0.7); margin: 0;
}

.no-results {
  grid-column: 1 / -1;
  padding: 20px;
  text-align: center;
  color: rgba(7, 25, 70, 0.7);
  background: #F2F3F4;
  border-radius: 4px;
}

/* Loading state styles */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #081330;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* Error state styles */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.error-state p {
  font-size: 18px;
  color: #e74c3c;
  margin: 0 0 20px 0;
}

.retry-btn {
  background-color: #081330;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background-color: #0a1a3a;
}

.pagination {
  display: flex; justify-content: center; align-items: center; gap: 10px;
}
.page-number, .page-arrow {
  display: flex; justify-content: center; align-items: center; width: 38px; height: 38px;
  border-radius: 4px; text-decoration: none; font-weight: 700; color: #081330;
  background-color: #F2F3F4; transition: all 0.3s ease;
}
.page-number.active, .page-number:hover {
  background-color: #072AC8; color: #FFFFFF;
}
.page-arrow:hover {
  background-color: #072AC8; color: #FFFFFF;
}
@media (max-width: 992px) {
  .news-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .news-grid { grid-template-columns: 1fr; }
}
</style>