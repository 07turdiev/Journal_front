<template>
  <main>
    <PageBanner :title="route.meta.title || $t('announcements.title')" />
    <div class="page-content">
      <div class="container">
        <div class="news-controls">
          <form class="controls-form" @submit.prevent="applyFilters">
            <input type="text" v-model="search" :placeholder="$t('announcements.search_placeholder')">
            <select v-model="sort">
              <option value="newest">{{ $t('announcements.sort_newest') }}</option>
              <option value="oldest">{{ $t('announcements.sort_oldest') }}</option>
            </select>
            <button type="submit" class="btn-apply">{{ $t('announcements.search') }}</button>
            <button type="button" class="btn-clear" @click="clearFilters">{{ $t('announcements.clear') }}</button>
          </form>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadAnnouncementsData" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <!-- Content -->
        <div v-else class="news-grid">
          <div v-if="filteredAnnouncements.length === 0" class="no-results">{{ $t('announcements.no_results') }}</div>
          <div v-for="(announcement, index) in paginatedAnnouncements" :key="announcement.slug || index" class="news-card">
            <RouterLink :to="getLocalizedPath(`/announcements/${announcement.slug}`)" class="card-link">
              <div class="card-image-wrapper">
                <img :src="announcement.image" :alt="announcement.title" class="card-image" @error="handleImageError">
              </div>
              <div class="card-content">
                <h3 class="card-title" v-html="getHighlightedHtml(announcement.title, search)"></h3>
                <p class="card-description" v-if="getPlainText(announcement.content)">
                  {{ getPlainText(announcement.content).substring(0, 120) }}{{ getPlainText(announcement.content).length > 120 ? '...' : '' }}
                </p>
                <div class="card-meta">
                  <span class="card-date">{{ announcement.date }}</span>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <a v-if="currentPage > 1" href="#" class="page-arrow" @click.prevent="prevPage"><</a>
          <a v-for="n in pages" :key="n" href="#" class="page-number" :class="{ active: n === currentPage }" @click.prevent="goToPage(n)">{{ n }}</a>
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
import { usePageMeta } from '@/composables/usePageMeta';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const route = useRoute();
const router = useRouter();

// API integration
const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const announcements = ref([]);

const search = ref((route.query.q || '').toString());
const sort = ref((route.query.sort || 'newest').toString());

onMounted(() => {
  setPageMeta({
    title: t('announcements.title') || 'E\'lonlar',
    description: t('announcements.description') || 'Ziyoli Avlod jurnalining rasmiy e\'lonlari va muhim xabarlar.',
    keywords: t('announcements.keywords') || 'e\'lonlar, xabarlar, bildirish'
  });
  setCanonical(`https://ziyoliavlod.uz${route.fullPath}`);
  loadAnnouncementsData();
});

// API dan ma'lumotlarni olish
const loadAnnouncementsData = async () => {
  try {
    const response = await fetchData('/elonlars', { populate: 'Rasmi' });
    
    if (response.data) {
      announcements.value = response.data.map(announcement => ({
        id: announcement.id,
        title: announcement.Nomi,
        content: getPlainText(announcement.Text),
        htmlContent: parseRichText(announcement.Text),
        date: announcement.Sana,
        slug: announcement.slug,
        image: getImageUrl(announcement.Rasmi)
      }));
    }
  } catch (err) {
    console.error('Announcements data yuklanmadi:', err);
  }
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ERasm%3C/text%3E%3C/svg%3E';
};

// Locale o'zgarishini kuzatish
watch(currentLocale, () => {
  loadAnnouncementsData();
});

onMounted(() => {
  loadAnnouncementsData();
});

const filteredAnnouncements = computed(() => {
  const listWithIndex = (announcements.value || []).map((item, idx) => ({ item, idx }));
  const q = (search.value || '').trim().toLowerCase();
  let out = listWithIndex.filter(({ item }) => {
    const haystack = `${item.title || ''} ${item.content || ''}`.toLowerCase();
    return q ? haystack.includes(q) : true;
  });
  if (sort.value === 'oldest') {
    out.sort((a, b) => a.idx - b.idx);
  } else {
    out.sort((a, b) => b.idx - a.idx);
  }
  return out.map(x => x.item);
});

watch(() => route.query, (q) => {
  search.value = (q.q || '').toString();
  sort.value = (q.sort || 'newest').toString();
});

const applyFilters = () => {
  const q = (search.value || '').trim();
  const s = (sort.value || 'newest').trim();
  const nextQuery = {};
  if (q) nextQuery.q = q;
  if (s && s !== 'newest') nextQuery.sort = s;
  router.push({ path: getLocalizedPath('/announcements'), query: nextQuery });
};

const clearFilters = () => {
  search.value = '';
  sort.value = 'newest';
  router.push({ path: getLocalizedPath('/announcements') });
};

const PER_PAGE = 9;
const currentPage = ref(Number(route.query.page || 1) || 1);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredAnnouncements.value.length / PER_PAGE)));
const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE;
  return filteredAnnouncements.value.slice(start, start + PER_PAGE);
});
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
watch([filteredAnnouncements, () => route.query.page], () => {
  const pageFromRoute = Number(route.query.page || 1) || 1;
  const bounded = Math.min(Math.max(1, pageFromRoute), totalPages.value);
  currentPage.value = bounded;
});
const goToPage = (n) => {
  const bounded = Math.min(Math.max(1, n), totalPages.value);
  const q = (search.value || '').trim();
  const s = (sort.value || 'newest').trim();
  const nextQuery = { page: String(bounded) };
  if (q) nextQuery.q = q;
  if (s && s !== 'newest') nextQuery.sort = s;
  router.push({ path: getLocalizedPath('/announcements'), query: nextQuery });
};
const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

const escapeHtml = (str) => {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
};
const getHighlightedHtml = (text, queryText) => {
  const raw = String(text || '');
  const q = String(queryText || '').trim();
  if (!q) return escapeHtml(raw);
  try {
    const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return escapeHtml(raw).replace(pattern, (m) => `<mark class=\"hl\">${escapeHtml(m)}</mark>`);
  } catch (e) {
    return escapeHtml(raw);
  }
};
// getPlainText funksiyasi richTextParser'dan import qilingan
const getHighlightedExcerpt = (html, queryText) => {
  const plain = getPlainText(html);
  const q = String(queryText || '').trim();
  if (!q) return '';
  const idx = plain.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return '';
  const start = Math.max(0, idx - 60);
  const end = Math.min(plain.length, idx + q.length + 60);
  const snippet = (start > 0 ? '…' : '') + plain.slice(start, end) + (end < plain.length ? '…' : '');
  return getHighlightedHtml(snippet, q);
};
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

.news-controls {
  margin-bottom: 40px;
}

.controls-form {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.controls-form input,
.controls-form select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: #2d3748;
  transition: all 0.2s ease;
}

.controls-form input:focus,
.controls-form select:focus {
  outline: none;
  border-color: #2c5282;
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
}

.controls-form input::placeholder {
  color: #a0aec0;
}

.btn-apply {
  padding: 12px 24px;
  border-radius: 8px;
  background: #2c5282;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
}

.btn-apply:hover {
  background: #2a4a7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 82, 130, 0.3);
}

.btn-clear {
  padding: 12px 24px;
  border-radius: 8px;
  background: transparent;
  color: #2c5282;
  font-weight: 600;
  border: 1px solid #2c5282;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #ebf8ff;
  border-color: #2a4a7a;
  color: #2a4a7a;
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

.hl {
  background-color: #fef08a;
  padding: 2px 4px;
  border-radius: 3px;
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

  .controls-form {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-form input,
  .controls-form select,
  .btn-apply,
  .btn-clear {
    width: 100%;
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