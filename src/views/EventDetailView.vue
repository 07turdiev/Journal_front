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
          <button @click="loadEventData(route.params.slug)" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Event content -->
        <div v-else-if="event">
          <img :src="event.image" :alt="event.title" class="event-image" @error="handleImageError">
          
          <div class="event-meta">
            <h2 class="event-title">{{ event.title }}</h2>
            <p class="event-date">{{ event.date }}</p>
          </div>

          <div class="event-content" v-html="event.htmlContent || event.content"></div>
        </div>
        
        <!-- Not found -->
        <div v-else class="not-found">
          <p>Tadbir topilmadi...</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta'
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

useMeta({
  title: 'Ziyoli Avlod - Tadbir',
  meta: [
    { name: 'description', content: 'Ziyoli Avlod jurnalining tadbirlari haqida batafsil ma\'lumotlar.' },
    { name: 'keywords', content: 'ziyoli avlod, tadbir, konferensiya' },
    { property: 'og:title', content: 'Ziyoli Avlod - Tadbir' },
    { property: 'og:description', content: 'Ziyoli Avlod jurnalining tadbirlari haqida batafsil ma\'lumotlar.' },
    { property: 'og:type', content: 'event' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const route = useRoute();
const { t } = useI18n();

// API integration
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();

const event = ref(null);

// API dan ma'lumotlarni olish
const loadEventData = async (slug) => {
  try {
    console.log(`Loading event with slug: ${slug} in locale: ${currentLocale.value}`);
    
    // Avval o'zbek tilida slug orqali documentId'ni topish
    const searchResponse = await fetchData('/tadbirlars', { 
      'filters[slug][$eq]': slug,
      'filters[locale][$eq]': 'uz', // Faqat o'zbek tilida qidirish
      'fields[0]': 'documentId'
    });
    
    if (searchResponse.data && searchResponse.data.length > 0) {
      const uzEventData = searchResponse.data[0];
      console.log(`Found Uzbek event with documentId: ${uzEventData.documentId}`);
      
      // DocumentId orqali joriy tildagi ma'lumotni olish
      const fullResponse = await fetchData(`/tadbirlars/${uzEventData.documentId}`, { 
        populate: 'Rasmi'
      });
      
      if (fullResponse.data) {
        const fullEventData = fullResponse.data;
        console.log(`Full event loaded: ${fullEventData.Nomi} in ${fullEventData.locale}`);
        
        // O'zbek tilidagi slug'ni ishlatish
        const uzSlug = slug; // O'zbek tilidagi slug
        
        event.value = {
          id: fullEventData.id,
          title: fullEventData.Nomi,
          content: getPlainText(fullEventData.Text),
          htmlContent: parseRichText(fullEventData.Text),
          date: fullEventData.Sana,
          slug: uzSlug, // O'zbek tilidagi slug'ni ishlatish
          image: getImageUrl(fullEventData.Rasmi?.[0]) // Rasmi array bo'lsa, birinchi elementini olish
        };
      } else {
        console.log(`Failed to load full event data`);
        event.value = null;
      }
    } else {
      console.log(`No event found with slug: ${slug} in Uzbek locale`);
      event.value = null;
    }
  } catch (err) {
    console.error('Event data yuklanmadi:', err);
    event.value = null;
  }
};

// Rasm yuklanmagan taqdirda placeholder ko'rsatish
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400?text=Rasm';
};

// Locale o'zgarishini kuzatish
watch(currentLocale, (newLocale, oldLocale) => {
  // Faqat locale haqiqatan o'zgargan bo'lsa qayta yuklash
  if (newLocale !== oldLocale && route.params.slug) {
    console.log(`Locale changed from ${oldLocale} to ${newLocale}, reloading event...`);
    loadEventData(route.params.slug);
  }
});

// Slug o'zgarishini kuzatish
watch(() => route.params.slug, (newSlug, oldSlug) => {
  // Faqat slug haqiqatan o'zgargan bo'lsa qayta yuklash
  if (newSlug && newSlug !== oldSlug) {
    console.log(`Slug changed from ${oldSlug} to ${newSlug}, loading new event...`);
    loadEventData(newSlug);
  }
}, { immediate: false });

onMounted(() => {
  if (route.params.slug) {
    loadEventData(route.params.slug);
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
.event-image {
  width: 100%;
  height: auto;
  max-height: 432px;
  object-fit: cover;
  border-radius: 30px;
  display: block;
  margin-bottom: 30px;
}

/* Sarlavha bloki stillari */
.event-meta {
  background: #F2F3F4;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 50px;
}

.event-title {
  font-size: 24px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 16px 0;
}
.event-date {
  font-size: 16px;
  color: rgba(7, 25, 70, 0.7);
  margin: 0;
}

/* Asosiy matn stillari */
.event-content {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.event-content :deep(p) {
  margin-bottom: 1.5em;
}

/* HTML content styling */
.event-content :deep(h1),
.event-content :deep(h2),
.event-content :deep(h3),
.event-content :deep(h4),
.event-content :deep(h5),
.event-content :deep(h6) {
  margin: 0 0 20px 0;
  font-weight: 600;
  color: #081330;
}

.event-content :deep(h1) { font-size: 28px; }
.event-content :deep(h2) { font-size: 26px; }
.event-content :deep(h3) { font-size: 24px; }
.event-content :deep(h4) { font-size: 22px; }
.event-content :deep(h5) { font-size: 20px; }
.event-content :deep(h6) { font-size: 18px; }

.event-content :deep(ul),
.event-content :deep(ol) {
  margin: 0 0 20px 0;
  padding-left: 30px;
}

.event-content :deep(li) {
  margin-bottom: 8px;
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.event-content :deep(blockquote) {
  margin: 0 0 20px 0;
  padding: 20px 25px;
  border-left: 5px solid #081330;
  background-color: #f8f9fa;
  font-style: italic;
  color: #555;
  border-radius: 0 8px 8px 0;
}

.event-content :deep(pre) {
  margin: 0 0 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e9ecef;
}

.event-content :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #e74c3c;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.event-content :deep(a) {
  color: #081330;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.event-content :deep(a:hover) {
  color: #0a1a3a;
}

.event-content :deep(strong) {
  font-weight: 600;
  color: #081330;
}

.event-content :deep(em) {
  font-style: italic;
}

.event-content :deep(u) {
  text-decoration: underline;
}

.event-content :deep(s) {
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
