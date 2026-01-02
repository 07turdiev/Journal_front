<template>
  <section class="news-section">
    <div class="container">
      <div class="news-grid">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadLatestAnnouncements" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <!-- No announcements -->
        <div v-else-if="articles.length === 0" class="no-announcements">
          <p>{{ $t('announcements.no_results') }}</p>
        </div>
        
        <!-- Announcements -->
        <div v-else v-for="article in articles" :key="article.id" class="news-card">
          <RouterLink :to="getLocalizedPath(`/announcements/${article.slug}`)" class="card-link">
            <div class="card-image-wrapper">
              <img :src="article.image" :alt="article.title" class="card-image" @error="handleImageError">
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ article.title }}</h3>
              <p class="card-description" v-if="article.content">
                {{ article.content.substring(0, 120) }}{{ article.content.length > 120 ? '...' : '' }}
              </p>
              <div class="card-meta">
                <span class="card-date">{{ article.date }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="section-actions">
        <RouterLink :to="getLocalizedPath('/announcements')" class="btn-view-all">{{ $t('services.view_all') }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText } from '@/utils/richTextParser';
import { RouterLink } from 'vue-router';

const { t } = useI18n();

// API integration
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const articles = ref([]);

// API dan oxirgi 3 ta e'lonni olish
const loadLatestAnnouncements = async () => {
  try {
    const response = await fetchData('/elonlars', { 
      populate: 'Rasmi',
      'pagination[pageSize]': 3,
      'sort[0]': 'publishedAt:desc'
    });
    
    console.log('Announcements API Response:', response);
    
    if (response.data) {
      articles.value = response.data.map(announcement => ({
        id: announcement.id,
        title: announcement.Nomi,
        content: getPlainText(announcement.Text),
        date: announcement.Sana,
        slug: announcement.slug,
        image: getImageUrl(announcement.Rasmi)
      }));
    }
  } catch (err) {
    console.error('Latest announcements yuklanmadi:', err);
  }
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ERasm%3C/text%3E%3C/svg%3E';
};

watch(currentLocale, () => {
  loadLatestAnnouncements();
});

onMounted(() => {
  loadLatestAnnouncements();
});
</script>

<style scoped>
.news-section {
  background: transparent;
  padding: 140px 0 100px 0;
  font-family: 'Poppins', sans-serif;
  position: relative;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
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

.section-actions {
  text-align: left;
}

.btn-view-all {
  display: inline-block;
  padding: 16px 36px;
  background: rgb(43, 74, 106);
  border: 2px solid rgb(43, 74, 106);
  border-radius: 50px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.btn-view-all::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.btn-view-all:hover {
  background: rgb(44, 62, 80);
  border-color: rgb(44, 62, 80);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-view-all:hover::before {
  width: 300px;
  height: 300px;
}

.loading-state {
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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

.no-announcements {
  grid-column: 1 / -1;
  padding: 60px 20px;
  text-align: center;
  color: #718096;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 16px;
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
  .news-section {
    padding: 100px 0 80px 0;
  }

  .container {
    padding: 0 20px;
  }

  .news-grid {
    grid-template-columns: 1fr;
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

  .section-actions {
    text-align: center;
  }
}

@media (max-width: 576px) {
  .news-section {
    padding: 80px 0 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  .news-grid {
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