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
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadAnnouncementsData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Content -->
        <div v-else class="news-grid">
          <div v-if="filteredAnnouncements.length === 0" class="no-results">{{ $t('announcements.no_results') }}</div>
          <div v-for="(announcement, index) in paginatedAnnouncements" :key="announcement.slug || index" class="news-card">
            <RouterLink :to="getLocalizedPath(`/announcements/${announcement.slug}`)" class="card-link">
              <img :src="announcement.image" :alt="announcement.title" class="card-image" @error="handleImageError">
              <div class="card-content">
                <h3 class="card-title" v-html="getHighlightedHtml(announcement.title, search)"></h3>
                <p class="card-date">{{ announcement.date }}</p>
                <p class="card-excerpt" v-if="search && getPlainText(announcement.content)" v-html="getHighlightedExcerpt(announcement.content, search)"></p>
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
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const route = useRoute();
const router = useRouter();

// API integration
const { t } = useI18n();
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const announcements = ref([]);

const search = ref((route.query.q || '').toString());
const sort = ref((route.query.sort || 'newest').toString());

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

// Rasm yuklanmagan taqdirda placeholder ko'rsatish
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400?text=Rasm';
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
.page-content { padding: 80px 0; background-color: #FFFFFF; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 15px; }
.news-controls { margin-bottom: 24px; }
.controls-form { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
.controls-form input, .controls-form select { padding: 10px 12px; border: 1px solid rgba(7, 25, 70, 0.2); border-radius: 4px; background: #FFFFFF; font-size: 14px; }
.btn-apply { padding: 10px 16px; border-radius: 4px; background: #072AC8; color: #fff; font-weight: 700; border: none; }
.btn-clear { padding: 10px 16px; border-radius: 4px; background: transparent; color: #072AC8; font-weight: 700; border: 1px solid #072AC8; }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 60px; }
.no-results { grid-column: 1 / -1; padding: 20px; text-align: center; color: rgba(7, 25, 70, 0.7); background: #F2F3F4; border-radius: 4px; }
.news-card { background: #F2F3F4; border-radius: 4px; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.news-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); }
.card-link { text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%; }
.card-image { width: 100%; height: 220px; object-fit: cover; display: block; background-color: #BDBDBD; }
.card-content { padding: 32px; flex-grow: 1; }
.card-title { font-weight: 700; font-size: 20px; line-height: 1.5; color: #081330; margin: 0 0 16px 0; }
.card-date { font-weight: 400; font-size: 16px; color: rgba(7, 25, 70, 0.7); margin: 0; }
.card-excerpt { margin-top: 12px; font-size: 14px; color: rgba(7, 25, 70, 0.8); }
.hl { background-color: #FFF700; padding: 0 2px; }

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

.pagination { display: flex; justify-content: center; align-items: center; gap: 10px; }
.page-number, .page-arrow { display: flex; justify-content: center; align-items: center; width: 38px; height: 38px; border-radius: 4px; text-decoration: none; font-weight: 700; color: #081330; background-color: #F2F3F4; transition: all 0.3s ease; }
.page-number.active, .page-number:hover { background-color: #072AC8; color: #FFFFFF; }
.page-arrow:hover { background-color: #072AC8; color: #FFFFFF; }
@media (max-width: 992px) { .news-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .news-grid { grid-template-columns: 1fr; } }
</style>