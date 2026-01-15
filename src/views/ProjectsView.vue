<template>
  <main>
    <PageBanner :title="$t('projects.title')" />
    <div class="page-content">
      <div class="container">
        <div class="filters-panel">
          <div class="filters">
            <button class="filter-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1H1L5.8 7.30667V11.6667L8.2 13V7.30667L13 1Z" stroke="#072AC8"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>{{ $t('projects.filter') }}</span>
            </button>
            <select v-model="selectedCategory">
              <option value="">{{ $t('projects.all_categories') }}</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <input type="text" v-model.trim="searchQuery" :placeholder="$t('projects.search_placeholder')">
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadProjectsData" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <div v-else>
          <div class="projects-grid">
            <div v-if="filteredProjects.length === 0" class="no-results">
              {{ $t('projects.no_results') }}
            </div>
            <div v-for="project in paginatedProjects" :key="project.id" class="project-card">
              <div class="project-image">
                <img :src="project.image" :alt="project.title" @error="handleImageError">
              </div>
              <div class="project-content">
                <h3 class="project-title" v-html="getHighlightedHtml(project.title, searchQuery)"></h3>
                <p class="project-description" v-html="getHighlightedHtml(project.description, searchQuery)"></p>
                <div class="project-meta">
                  <span class="project-date">{{ project.date }}</span>
                  <span class="project-category">{{ project.category }}</span>
                </div>
                <RouterLink :to="getLocalizedPath(`/projects/${project.slug}`)" class="project-link">
                  {{ $t('projects.view_project') }}
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33333 1L13 6M13 6L8.33333 11M13 6H1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div class="table-footer" v-if="totalItems > pageSize">
          <div class="pagination">
            <button 
              class="page-arrow" 
              @click="goToPrevPage" 
              :disabled="currentPage === 1"
              :aria-disabled="currentPage === 1"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
                <path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              v-for="(page, index) in pages"
              :key="`page-${index}-${page}`"
              class="page-number"
              :class="{ 
                active: page === currentPage,
                ellipsis: page === '...'
              }"
              :disabled="page === '...'"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button 
              class="page-arrow" 
              @click="goToNextPage" 
              :disabled="currentPage === totalPages"
              :aria-disabled="currentPage === totalPages"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const route = useRoute();
const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();

const projects = ref([]);

onMounted(() => {
  setPageMeta({
    title: t('projects.title') || 'Loyihalar',
    description: t('projects.description') || 'Ziyoli Avlod jurnali tomonidan amalga oshiriladigan ilmiy loyihalar va dasturlar.',
    keywords: t('projects.keywords') || 'loyihalar, tadqiqotlar, ilmiy loyihalar'
  });
  setCanonical(`https://ziyoliavlod.uz${route.fullPath}`);
  loadProjectsData();
});

// Helper: choose best image from Strapi response
const pickImage = (rasmi) => {
  if (!rasmi) return null
  // formats.medium preferred, then small, then root url
  const formats = rasmi.formats || {}
  if (formats.medium && formats.medium.url) return { url: formats.medium.url }
  if (formats.small && formats.small.url) return { url: formats.small.url }
  if (rasmi.url) return { url: rasmi.url }
  return null
}

const selectedCategory = ref('');
const searchQuery = ref('');

const categories = computed(() => {
  const set = new Set(projects.value.map(p => p.category).filter(Boolean));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const filteredProjects = computed(() => {
  const q = (searchQuery.value || '').toLowerCase();
  return projects.value.filter(p => {
    const matchesCategory = selectedCategory.value ? p.category === selectedCategory.value : true;
    const matchesQuery = q
      ? (p.title?.toLowerCase().includes(q)
        || p.description?.toLowerCase().includes(q))
      : true;
    return matchesCategory && matchesQuery;
  });
});

const pageSize = 6;
const currentPage = ref(1);
const totalItems = computed(() => filteredProjects.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)));

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProjects.value.slice(start, start + pageSize);
});

const pages = computed(() => {
  const total = totalPages.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  const current = currentPage.value;
  const result = [];
  
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) result.push(i);
    result.push('...');
    result.push(total);
  } else if (current >= total - 3) {
    result.push(1);
    result.push('...');
    for (let i = total - 4; i <= total; i++) result.push(i);
  } else {
    result.push(1);
    result.push('...');
    for (let i = current - 1; i <= current + 1; i++) result.push(i);
    result.push('...');
    result.push(total);
  }
  
  return result;
});

const goToPage = (page) => {
  if (typeof page === 'string' || page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Reset to first page when filters change
// (handled above)

watch(filteredProjects, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value || 1;
  }
});

const escapeHtml = (str) => {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const getHighlightedHtml = (text, queryText) => {
  const raw = String(text || '');
  const q = String(queryText || '').trim();
  if (!q) return escapeHtml(raw);
  try {
    const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return escapeHtml(raw).replace(pattern, (m) => `<mark class="hl">${escapeHtml(m)}</mark>`);
  } catch (e) {
    return escapeHtml(raw);
  }
};

const loadProjectsData = async () => {
  try {
    console.log('Loading projects data...')
    const res = await fetchData('/loyihalars', { populate: 'rasmi' })
    const items = res && res.data ? res.data : []

    projects.value = items.map((item) => {
      // Support both Strapi shapes: item.attributes or direct fields
      const data = item.attributes ? item.attributes : item

      const img = pickImage(data.rasmi)

      return {
        id: item.id || data.id,
        slug: data.slug || '',
        title: data.nomi || data.title || '',
        description: data.tavsif || data.description || '',
        date: data.sana ? new Date(data.sana).toLocaleDateString() : (data.sana || ''),
        category: data.yanalish || data.category || '',
        image: getImageUrl(img),
        link: data.link || '#'
      }
    })
  } catch (err) {
    console.error('Projects data yuklanmadi:', err)
  }
}

watch([selectedCategory, searchQuery], () => {
  currentPage.value = 1;
});

watch(currentLocale, () => {
  loadProjectsData();
});

onMounted(() => {
  loadProjectsData();
});

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ERasm%3C/text%3E%3C/svg%3E';
};
</script>

<style scoped>
.page-content {
  padding: 8px 0;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 20px;
  width: 100%;
}

.filters-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filters select,
.filters input {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #EEEEEE;
  background: #FFFFFF;
  font-size: 14px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.loading-state,
.error-state {
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

.loading-state p,
.error-state p {
  font-size: 18px;
  color: #666;
  margin: 0 0 20px 0;
}

.error-state p {
  color: #e74c3c;
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

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.project-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.project-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f7fafc;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.project-description {
  font-size: 14px;
  color: #718096;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex-grow: 1;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.project-date {
  font-size: 12px;
  color: #a0aec0;
  font-weight: 500;
}

.project-category {
  font-size: 12px;
  color: #2c5282;
  background: #ebf8ff;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2c5282;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.project-link:hover {
  color: #2a4a7a;
  gap: 12px;
}

.project-link svg {
  transition: transform 0.2s ease;
}

.project-link:hover svg {
  transform: translateX(4px);
}

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .projects-grid {
    gap: 24px;
  }

  .project-image {
    height: 200px;
  }
}

@media (max-width: 992px) {
  .projects-grid {
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

  .projects-grid {
    gap: 20px;
  }

  .project-image {
    height: 180px;
  }

  .project-content {
    padding: 20px;
  }

  .project-title {
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

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .project-image {
    height: 200px;
  }

  .project-content {
    padding: 16px;
  }

  .project-title {
    font-size: 16px;
  }

  .project-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .project-image {
    height: 180px;
  }
}

.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  padding-top: 30px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.page-number,
.page-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0 12px;
}

.page-number:not(.ellipsis):hover:not(:disabled) {
  background: #2c5282;
  color: #ffffff;
  border-color: #2c5282;
  transform: translateY(-1px);
}

.page-number.active {
  background: #2c5282;
  color: #ffffff;
  border-color: #2c5282;
}

.page-number.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
  color: #718096;
  min-width: auto;
  padding: 0 4px;
}

.page-number.ellipsis:hover {
  background: transparent;
  transform: none;
}

.page-arrow {
  padding: 0;
}

.page-arrow:hover:not(:disabled) {
  background: #2c5282;
  color: #ffffff;
  border-color: #2c5282;
  transform: translateY(-1px);
}

.page-arrow:disabled,
.page-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.page-arrow svg {
  width: 8px;
  height: 14px;
}

.hl {
  background-color: #fef08a;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>

