<template>
  <main>
    <PageBanner :title="route.meta.title" />
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
          <button @click="loadAnnouncementData(route.params.slug)" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Announcement content -->
        <div v-else-if="announcement">
          <img :src="announcement.image" :alt="announcement.title" class="announcement-image" @error="handleImageError">
          
          <div class="announcement-meta">
            <h2 class="announcement-title">{{ announcement.title }}</h2>
            <p class="announcement-date">{{ announcement.date }}</p>
          </div>

          <div class="announcement-content" v-html="announcement.htmlContent || announcement.content"></div>
        </div>
        
        <!-- Not found -->
        <div v-else class="not-found">
          <p>E'lon topilmadi...</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useDynamicSeoMeta } from '@/composables/useDynamicSeoMeta';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const route = useRoute();
const { t } = useI18n();

// API integration
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();

const announcement = ref(null);

useDynamicSeoMeta(announcement, 'announcements');

// API dan ma'lumotlarni olish
const loadAnnouncementData = async (slug) => {
  try {
    console.log(`Loading announcement with slug: ${slug} in locale: ${currentLocale.value}`);
    
    // Avval o'zbek tilida slug orqali documentId'ni topish
    const searchResponse = await fetchData('/elonlars', { 
      'filters[slug][$eq]': slug,
      'filters[locale][$eq]': 'uz', // Faqat o'zbek tilida qidirish
      'fields[0]': 'documentId'
    });
    
    if (searchResponse.data && searchResponse.data.length > 0) {
      const uzAnnouncementData = searchResponse.data[0];
      console.log(`Found Uzbek announcement with documentId: ${uzAnnouncementData.documentId}`);
      
      // DocumentId orqali joriy tildagi ma'lumotni olish
      const fullResponse = await fetchData(`/elonlars/${uzAnnouncementData.documentId}`, { 
        populate: 'Rasmi'
      });
      
      if (fullResponse.data) {
        const fullAnnouncementData = fullResponse.data;
        console.log(`Full announcement loaded: ${fullAnnouncementData.Nomi} in ${fullAnnouncementData.locale}`);
        
        // O'zbek tilidagi slug'ni ishlatish
        const uzSlug = slug; // O'zbek tilidagi slug
        
        announcement.value = {
          id: fullAnnouncementData.id,
          title: fullAnnouncementData.Nomi,
          content: getPlainText(fullAnnouncementData.Text),
          htmlContent: parseRichText(fullAnnouncementData.Text),
          date: fullAnnouncementData.Sana,
          slug: uzSlug, // O'zbek tilidagi slug'ni ishlatish
          image: getImageUrl(fullAnnouncementData.Rasmi)
        };
      } else {
        console.log(`Failed to load full announcement data`);
        announcement.value = null;
      }
    } else {
      console.log(`No announcement found with slug: ${slug} in Uzbek locale`);
      announcement.value = null;
    }
  } catch (err) {
    console.error('Announcement data yuklanmadi:', err);
    announcement.value = null;
  }
};

// Rasm yuklanmagan taqdirda placeholder ko'rsatish
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400?text=Rasmi';
};

// Locale o'zgarishini kuzatish
watch(currentLocale, (newLocale, oldLocale) => {
  // Faqat locale haqiqatan o'zgargan bo'lsa qayta yuklash
  if (newLocale !== oldLocale && route.params.slug) {
    console.log(`Locale changed from ${oldLocale} to ${newLocale}, reloading announcement...`);
    loadAnnouncementData(route.params.slug);
  }
});

// Slug o'zgarishini kuzatish
watch(() => route.params.slug, (newSlug, oldSlug) => {
  // Faqat slug haqiqatan o'zgargan bo'lsa qayta yuklash
  if (newSlug && newSlug !== oldSlug) {
    console.log(`Slug changed from ${oldSlug} to ${newSlug}, loading new announcement...`);
    loadAnnouncementData(newSlug);
  }
}, { immediate: false });

onMounted(() => {
  if (route.params.slug) {
    loadAnnouncementData(route.params.slug);
  }
});
</script>

<style scoped>
.page-content {
  padding: 80px 0;
}
.container {
  max-width: 1148px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Rasm stillari */
.announcement-image {
  width: 100%;
  height: auto;
  max-height: 432px;
  object-fit: cover;
  border-radius: 30px;
  display: block;
  margin-bottom: 30px;
}

/* Sarlavha bloki stillari */
.announcement-meta {
  background: #F2F3F4;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 50px;
}

.announcement-title {
  font-size: 24px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 16px 0;
}
.announcement-date {
  font-size: 16px;
  color: rgba(7, 25, 70, 0.7);
  margin: 0;
}

/* Asosiy matn stillari */
.announcement-content {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.announcement-content :deep(p) {
  margin-bottom: 1.5em;
}

/* HTML content styling */
.announcement-content :deep(h1),
.announcement-content :deep(h2),
.announcement-content :deep(h3),
.announcement-content :deep(h4),
.announcement-content :deep(h5),
.announcement-content :deep(h6) {
  margin: 0 0 20px 0;
  font-weight: 600;
  color: #081330;
}

.announcement-content :deep(h1) { font-size: 28px; }
.announcement-content :deep(h2) { font-size: 26px; }
.announcement-content :deep(h3) { font-size: 24px; }
.announcement-content :deep(h4) { font-size: 22px; }
.announcement-content :deep(h5) { font-size: 20px; }
.announcement-content :deep(h6) { font-size: 18px; }

.announcement-content :deep(ul),
.announcement-content :deep(ol) {
  margin: 0 0 20px 0;
  padding-left: 30px;
}

.announcement-content :deep(li) {
  margin-bottom: 8px;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.announcement-content :deep(blockquote) {
  margin: 0 0 20px 0;
  padding: 20px 25px;
  border-left: 5px solid #081330;
  background-color: #f8f9fa;
  font-style: italic;
  color: #555;
  border-radius: 0 8px 8px 0;
}

.announcement-content :deep(pre) {
  margin: 0 0 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e9ecef;
}

.announcement-content :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #e74c3c;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.announcement-content :deep(a) {
  color: #081330;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.announcement-content :deep(a:hover) {
  color: #0a1a3a;
}

.announcement-content :deep(strong) {
  font-weight: 600;
  color: #081330;
}

.announcement-content :deep(em) {
  font-style: italic;
}

.announcement-content :deep(u) {
  text-decoration: underline;
}

.announcement-content :deep(s) {
  text-decoration: line-through;
  opacity: 0.7;
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

/* Not found styles */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.not-found p {
  font-size: 18px;
  color: #666;
  margin: 0;
}
</style>
