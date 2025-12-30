<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-inner">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('hero.title') }}</h1>
          <p class="hero-subtitle">{{ $t('hero.subtitle') }}</p>
          <div class="hero-buttons">
            <RouterLink :to="getLocalizedPath('/about')" class="btn btn-primary">
              <span>{{ $t('hero.about_journal') }}</span>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33333 1L13 6M13 6L8.33333 11M13 6H1" stroke="white" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </RouterLink>
            <RouterLink :to="getLocalizedPath('/news')" class="btn btn-secondary">{{ $t('hero.news') }}</RouterLink>
          </div>
        </div>

        <div class="hero-news-panel">
          <form class="search-form" @submit="onSearch">
            <input type="text" v-model="searchQuery" :placeholder="$t('hero.search_placeholder')">
            <button type="submit">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
                  stroke="#717579" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.75 15.75L12.4875 12.4875" stroke="#717579" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </form>

          <ul class="news-feed">
            <!-- Loading state -->
            <li v-if="loading" class="loading-item">
              <p>Yangiliklar yuklanmoqda...</p>
            </li>
            
            <!-- Error state -->
            <li v-else-if="error" class="error-item">
              <p>Xatolik yuz berdi: {{ error }}</p>
            </li>
            
            <!-- News items -->
            <li v-else-if="latestNews.length === 0" class="no-news">
              <p>Yangiliklar topilmadi</p>
            </li>
            
            <li v-else v-for="news in latestNews" :key="news.id" class="news-item">
              <RouterLink :to="getLocalizedPath(`/news/${news.slug}`)" class="news-link">
                <p><span>{{ news.date }}</span> {{ news.title }}</p>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText } from '@/utils/richTextParser';

const router = useRouter();
const { t } = useI18n();
const searchQuery = ref('');

// API integration
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const latestNews = ref([]);

// API dan oxirgi 5 ta yangilikni olish
const loadLatestNews = async () => {
  try {
    const response = await fetchData('/yangiliklars', { 
      populate: 'Rasmi',
      'pagination[pageSize]': 5,
      'sort[0]': 'publishedAt:desc'
    });
    
    if (response.data) {
      latestNews.value = response.data.map(news => ({
        id: news.id,
        title: news.Nomi,
        content: getPlainText(news.Text),
        date: news.Sana,
        slug: news.slug,
        image: getImageUrl(news.Rasmi?.[0])
      }));
    }
  } catch (err) {
    console.error('Latest news yuklanmadi:', err);
  }
};

// Locale o'zgarishini kuzatish
watch(currentLocale, () => {
  loadLatestNews();
});

const onSearch = (event) => {
  if (event) event.preventDefault();
  const q = (searchQuery.value || '').trim();
  router.push({ path: getLocalizedPath('/news'), query: q ? { q } : {} });
};

onMounted(() => {
  loadLatestNews();
});
</script>

<style scoped>
.hero-section {
  background: rgb(43, 74, 106);
  color: #FFFFFF;
  padding: 100px 0;
  padding-bottom: 250px;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 60px;
  align-items: center;
}

/* Chap kontent */
.hero-content {
  padding-right: 20px;
}

.hero-title {
  font-size: 72px;
  font-weight: 800;
  line-height: 1.1;
  text-transform: capitalize;
  margin: 0 0 30px 0;
  color: #FFFFFF;
  letter-spacing: -1px;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  font-size: 18px;
  font-weight: 300;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 0 50px 0;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.3px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px 36px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: rgb(44, 62, 80);
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: none;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  background: rgb(35, 50, 65);
}

.btn-primary:hover::before {
  width: 300px;
  height: 300px;
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: #FFFFFF;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-3px) scale(1.05);
}

/* O'ng yangiliklar paneli */
.hero-news-panel {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.search-form {
  position: relative;
  margin-bottom: 25px;
}

.search-form input {
  width: 100%;
  height: 45px;
  padding: 0 50px 0 20px;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: #333333;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.search-form input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.search-form input::placeholder {
  color: #666666;
  opacity: 0.8;
}

.search-form button {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  height: 35px;
  width: 35px;
  background: rgb(44, 62, 80);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.search-form button:hover {
  transform: translateY(-50%) scale(1.1);
  background: rgb(35, 50, 65);
}

.search-form button svg path {
  stroke: #FFFFFF;
}

.news-feed {
  list-style: none;
  padding: 0;
  margin: 0;
}

.news-feed li {
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.news-feed li:hover {
  padding-left: 10px;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.news-feed li:first-child {
  padding-top: 0;
}

.news-feed li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.news-feed p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.95);
}

.news-feed span {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  display: inline-block;
  margin-right: 10px;
  font-size: 11px;
}

/* News link styles */
.news-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: opacity 0.3s ease;
}

.news-link:hover {
  opacity: 0.8;
}

.news-link p {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  text-align: justify;
  font-weight: 400;
  color: #FFFFFF;
}

/* Loading, error, and no-news states */
.loading-item,
.error-item,
.no-news {
  padding: 15px 0;
  text-align: center;
}

.loading-item p,
.error-item p,
.no-news p {
  margin: 0;
  font-size: 11px;
  color: #FFFFFF;
  opacity: 0.7;
}

.error-item p {
  color: #ff6b6b;
}

/* RESPONSIVE STILLAR */
@media (max-width: 992px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    padding-right: 0;
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-buttons {
    flex-direction: column;
  }
}
</style>