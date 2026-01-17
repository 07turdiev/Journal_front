<template>
  <main>
    <PageBanner :title="pageTitle" :breadcrumbs="breadcrumbs" />
    <div class="page-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Muallif ma'lumotlari yuklanmoqda...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadAuthorData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Author not found -->
        <div v-else-if="!author" class="not-found">
          <h2>Muallif topilmadi</h2>
          <p>Kechirasiz, so'ralgan muallif topilmadi.</p>
          <RouterLink :to="getLocalizedPath('/')" class="btn-home">Bosh sahifaga qaytish</RouterLink>
        </div>
        
        <!-- Author content -->
        <div v-else class="author-detail">
          <div class="author-header">
            <h1 class="author-name">{{ author.name }}</h1>
          </div>
          
          <div class="author-content">
            <div v-if="author.publications && author.publications.length > 0" class="publications-section">
              <h2>Nashrlar</h2>
              <div class="publications-list">
                <div v-for="publication in author.publications" :key="publication.id" class="publication-item">
                  <RouterLink
                    class="publication-link"
                    :to="getLocalizedPath(`/issues/${publication.documentId || publication.id}`)"
                  >
                    <h3>{{ publication.Mavzu || publication.title }}</h3>
                  </RouterLink>
                  <p v-if="publication.Yonalishi || publication.journal" class="publication-journal">{{ publication.Yonalishi || publication.journal }}</p>
                  <p v-if="publication.Maqola_ID || publication.year" class="publication-year">Maqola ID: {{ publication.Maqola_ID || publication.year }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { useDynamicSeoMeta } from '@/composables/useDynamicSeoMeta';

const route = useRoute();
const { t } = useI18n();

const { loading, error, fetchData, currentLocale } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const author = ref(null);

useDynamicSeoMeta(author, 'authors');

// Page title and breadcrumbs
const pageTitle = computed(() => 'Muallif');

const breadcrumbs = computed(() => [
  { text: 'Bosh sahifa', to: '/' },
  { text: 'Mualliflar' },
  { text: 'Muallif' }
]);

// Load author data
const loadAuthorData = async (slug) => {
  try {
    console.log(`Loading author with slug: ${slug} in locale: ${currentLocale.value}`);

    const searchResponse = await fetchData('/mualliflars', {
      'filters[slug][$eq]': slug
    });

    if (searchResponse.data && searchResponse.data.length > 0) {
      const authorData = searchResponse.data[0];
      const documentId = authorData.documentId || authorData.id;

      const fullResponse = await fetchData(`/mualliflars/${documentId}`, {
        populate: '*',
        skipLocale: true
      });

      if (fullResponse.data) {
        const fullAuthorData = fullResponse.data;

        author.value = {
          id: fullAuthorData.id,
          name: fullAuthorData.Ismi || fullAuthorData.Ism_familiyasi,
          publications: fullAuthorData.Publications || fullAuthorData.jurnal_sonlarises || []
        };
      } else {
        author.value = null;
      }
    } else {
      author.value = null;
    }
  } catch (err) {
    console.error('Author data yuklanmadi:', err);
    author.value = null;
  }
};

// Watch for locale changes
watch(currentLocale, (newLocale, oldLocale) => {
  if (newLocale !== oldLocale && route.params.slug) {
    console.log(`Locale changed from ${oldLocale} to ${newLocale}, reloading author...`);
    loadAuthorData(route.params.slug);
  }
});

// Watch for slug changes
watch(() => route.params.slug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    console.log(`Slug changed from ${oldSlug} to ${newSlug}, loading new author...`);
    loadAuthorData(newSlug);
  }
}, { immediate: false });

onMounted(() => {
  if (route.params.slug) {
    loadAuthorData(route.params.slug);
  }
});
</script>

<style scoped>
.page-content {
  padding: 80px 0;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Loading and error states */
.loading-state,
.error-state,
.not-found {
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
.error-state p,
.not-found p {
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

.btn-home {
  background-color: #081330;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn-home:hover {
  background-color: #0a1a3a;
}

/* Author detail styles */
.author-detail {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.author-header {
  padding: 40px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  text-align: center;
}

.author-name {
  font-size: 36px;
  font-weight: 700;
  color: #081330;
  margin: 0;
  line-height: 1.2;
}

/* Content sections */
.author-content {
  padding: 40px;
}

.publications-section {
  margin-bottom: 40px;
}

.publications-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #072AC8;
}

/* Publications */
.publications-list {
  display: grid;
  gap: 20px;
}

.publication-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #072AC8;
}

.publication-item h3 {
  font-size: 18px;
  font-weight: 600;
  color: #081330;
  margin: 0 0 10px 0;
}

.publication-journal {
  font-size: 16px;
  color: #072AC8;
  font-weight: 500;
  margin: 0 0 5px 0;
}

.publication-year {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
}


/* Responsive design */
@media (max-width: 768px) {
  .author-name {
    font-size: 28px;
  }
  
  .author-content {
    padding: 20px;
  }
  
  .publications-section {
    margin-bottom: 30px;
  }
}
</style>
