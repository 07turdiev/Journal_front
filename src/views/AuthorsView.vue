<template>
  <main>
    <PageBanner :title="t('authors.title')" :breadcrumbs="breadcrumbs" />
    <div class="page-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Mualliflar yuklanmoqda...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadAuthorsData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Authors list -->
        <div v-else-if="authors.length > 0" class="authors-grid">
          <div 
            v-for="author in filteredAuthors" 
            :key="author.id" 
            class="author-card"
            @click="goToAuthor(author.slug)"
          >
            <div class="author-photo">
              <img 
                :src="author.image" 
                :alt="author.name"
                @error="handleImageError"
              />
            </div>
            <div class="author-info">
              <h3 class="author-name">{{ author.name }}</h3>
              <p v-if="author.position" class="author-position">{{ author.position }}</p>
              <p v-if="author.affiliation" class="author-affiliation">{{ author.affiliation }}</p>
              <div v-if="author.biography" class="author-bio">
                <p>{{ author.biography }}</p>
              </div>
            </div>
            <div class="author-actions">
              <button class="view-profile-btn">
                Profilni ko'rish
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- No authors found -->
        <div v-else class="no-authors">
          <h2>Mualliflar topilmadi</h2>
          <p>Hozircha hech qanday muallif ro'yxatga kiritilmagan.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePageMeta } from '@/composables/usePageMeta';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText } from '@/utils/richTextParser';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();

const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const authors = ref([]);

onMounted(() => {
  setPageMeta({
    title: t('authors.title') || 'Mualliflar',
    description: t('authors.description') || 'Ziyoli Avlod jurnalida nashr ettirilgan mualliflar ro\'yxati. Mualliflar haqida ma\'lumot va ularning nashriyotlarini ko\'ring.',
    keywords: t('authors.keywords') || 'mualliflar, ma\'qolalar mualliflari, yozuvchilar'
  });
  setCanonical(`https://ziyoliavlod.com${route.fullPath}`);
  loadAuthorsData();
});

// Breadcrumbs
const breadcrumbs = computed(() => [
  { text: 'Bosh sahifa', to: '/' },
  { text: 'Mualliflar' }
]);

// Filtered authors (for future search functionality)
const filteredAuthors = computed(() => {
  return authors.value;
});

// Load authors data
const loadAuthorsData = async () => {
  try {
    const response = await fetchData('/mualliflars', { 
      populate: 'Rasmi',
      'sort[0]': 'Ismi:asc'
    });
    
    if (response.data) {
      authors.value = response.data.map(author => ({
        id: author.id,
        name: author.Ismi,
        position: author.Lavozimi,
        affiliation: author.Muassasa,
        email: author.email,
        biography: getPlainText(author.Biografiya).substring(0, 150) + '...',
        image: getImageUrl(author.Rasmi),
        slug: author.slug
      }));
    }
  } catch (err) {
    console.error('Authors data yuklanmadi:', err);
  }
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/300x400?text=Rasm';
};

const { getLocalizedPath } = useLocalizedRoute();

// Go to author detail page
const goToAuthor = (slug) => {
  router.push(getLocalizedPath(`/author/${slug}`));
};

// Watch for locale changes
watch(currentLocale, () => {
  loadAuthorsData();
});

onMounted(() => {
  loadAuthorsData();
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
.no-authors {
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
.no-authors p {
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

.no-authors h2 {
  font-size: 24px;
  color: #081330;
  margin: 0 0 15px 0;
}

/* Authors grid */
.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.author-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.author-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.author-photo {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.author-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.author-card:hover .author-photo img {
  transform: scale(1.05);
}

.author-info {
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 22px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.author-position {
  font-size: 16px;
  color: #072AC8;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.author-affiliation {
  font-size: 14px;
  color: #666;
  margin: 0 0 15px 0;
}

.author-bio {
  flex: 1;
}

.author-bio p {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author-actions {
  padding: 0 25px 25px 25px;
}

.view-profile-btn {
  width: 100%;
  background-color: #081330;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.view-profile-btn:hover {
  background-color: #072AC8;
  transform: translateY(-1px);
}

.view-profile-btn svg {
  transition: transform 0.3s ease;
}

.author-card:hover .view-profile-btn svg {
  transform: translateX(3px);
}

/* Responsive design */
@media (max-width: 768px) {
  .authors-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .author-card {
    margin: 0 10px;
  }
  
  .author-info {
    padding: 20px;
  }
  
  .author-actions {
    padding: 0 20px 20px 20px;
  }
  
  .author-name {
    font-size: 20px;
  }
  
  .author-position {
    font-size: 15px;
  }
  
  .author-affiliation {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 40px 0;
  }
  
  .authors-grid {
    margin-top: 20px;
  }
  
  .author-card {
    margin: 0;
  }
}
</style>
