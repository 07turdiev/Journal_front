<template>
  <section class="news-section">
    <div class="container">
      <div class="news-grid">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>E'lonlar yuklanmoqda...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadLatestAnnouncements" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- No announcements -->
        <div v-else-if="articles.length === 0" class="no-announcements">
          <p>E'lonlar topilmadi</p>
        </div>
        
        <!-- Announcements -->
        <div v-else v-for="article in articles" :key="article.id" class="news-card">
          <RouterLink :to="getLocalizedPath(`/announcements/${article.slug}`)" class="card-link">
            <img :src="article.image" :alt="article.title" class="card-image" @error="handleImageError">
            <div class="card-content">
              <h3 class="card-title">{{ article.title }}</h3>
              <p class="card-date">{{ article.date }}</p>
              <!-- Debug info -->
              <small style="color: #999; font-size: 10px;">Image URL: {{ article.image }}</small>
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
      articles.value = response.data.map(announcement => {
        console.log('Announcement data:', announcement);
        console.log('Rasmi data:', announcement.Rasmi);
        
        const imageUrl = getImageUrl(announcement.Rasmi);
        console.log('Generated image URL:', imageUrl);
        
        return {
          id: announcement.id,
          title: announcement.Nomi,
          content: getPlainText(announcement.Text),
          date: announcement.Sana,
          slug: announcement.slug,
          image: imageUrl
        };
      });
      
      console.log('Final articles:', articles.value);
    }
  } catch (err) {
    console.error('Latest announcements yuklanmadi:', err);
  }
};

// Locale o'zgarishini kuzatish
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
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgb(43, 74, 106);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.news-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-color: rgb(43, 74, 106);
}

.news-card:hover::before {
  transform: scaleX(1);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.news-card:hover .card-image {
  transform: scale(1.05);
}

.card-content {
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 1.5;
  color: rgb(43, 74, 106);
  margin: 0 0 16px 0;
  flex-grow: 1;
  transition: all 0.3s ease;
}

.news-card:hover .card-title {
  color: rgb(44, 62, 80);
}

.card-date {
  font-weight: 400;
  font-size: 14px;
  color: #718096;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-date::before {
  content: '';
  width: 4px;
  height: 4px;
  background: rgb(43, 74, 106);
  border-radius: 50%;
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

/* Loading state styles */
.loading-state {
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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

/* No announcements styles */
.no-announcements {
  grid-column: 1 / -1;
  padding: 20px;
  text-align: center;
  color: rgba(7, 25, 70, 0.7);
  background: #FFFFFF;
  border-radius: 4px;
  font-size: 18px;
}

/* RESPONSIVE STILLAR */
@media (max-width: 992px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .section-actions {
    text-align: center;
  }
}
</style>