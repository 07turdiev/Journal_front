<template>
  <main>
    <PageBanner :title="pageTitle" :breadcrumbs="breadcrumbs" />
    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Maqola ma'lumotlari yuklanmoqda...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadArticleData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <div v-else-if="!article" class="not-found">
          <h2>Maqola topilmadi</h2>
          <p>Kechirasiz, so'ralgan maqola topilmadi.</p>
          <RouterLink :to="getLocalizedPath('/issues')" class="btn-home">Maqolalarga qaytish</RouterLink>
        </div>
        
        <div v-else class="article-detail">
          <div class="article-header">
            <h1 class="article-title">{{ article.Mavzu }}</h1>
            <div class="article-meta">
              <div class="meta-item" v-if="article.date">
                <svg class="meta-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V14.25C2.25 15.0784 2.92157 15.75 3.75 15.75H14.25C15.0784 15.75 15.75 15.0784 15.75 14.25V4.5C15.75 3.67157 15.0784 3 14.25 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 1.5V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 1.5V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.25 7.5H15.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="meta-value">{{ article.date }}</span>
              </div>
              <div class="meta-item" v-if="article.volumeIssue">
                <svg class="meta-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2.25H9C9.41421 2.25 9.75 2.58579 9.75 3V14.25C9.75 14.6642 9.41421 15 9 15H3C2.58579 15 2.25 14.6642 2.25 14.25V3C2.25 2.58579 2.58579 2.25 3 2.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.75 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6V14.25C15.75 14.6642 15.4142 15 15 15H9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 7.5H8.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 10.5H8.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="meta-value">{{ article.volumeIssue }}</span>
              </div>
              <div class="meta-item" v-if="article.Maqola_ID">
                <svg class="meta-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3.75H15C15.4142 3.75 15.75 4.08579 15.75 4.5V13.5C15.75 13.9142 15.4142 14.25 15 14.25H3C2.58579 14.25 2.25 13.9142 2.25 13.5V4.5C2.25 4.08579 2.58579 3.75 3 3.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 7.5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 10.5H10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="meta-value">{{ article.Maqola_ID }}</span>
              </div>
              <div class="meta-item" v-if="article.author">
                <svg class="meta-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 9C11.0711 9 12.75 7.32107 12.75 5.25C12.75 3.17893 11.0711 1.5 9 1.5C6.92893 1.5 5.25 3.17893 5.25 5.25C5.25 7.32107 6.92893 9 9 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.09155 15.75C3.09155 12.7279 5.72792 10.5 9 10.5C12.2721 10.5 14.9085 12.7279 14.9085 15.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="meta-value">{{ article.author.name }}</span>
              </div>
              <div class="meta-item" v-if="article.googleScholar">
                <a :href="article.googleScholar" target="_blank" rel="noopener noreferrer" class="btn-scholar-meta" :title="`Google Scholar: ${article.Mavzu}`" aria-label="Open in Google Scholar">
                  <img src="/assets/scholar.svg" alt="Google Scholar" class="scholar-icon-meta" />
                </a>
              </div>
            </div>
          </div>

          <div v-if="article.abstract" class="abstract-section">
            <h3 class="section-title">Abstract</h3>
            <p class="abstract-text">{{ article.abstract }}</p>
          </div>

          <div v-if="article.keywords" class="keywords-section">
            <span class="section-title">Keywords:</span>
            <span class="keywords-text">{{ article.keywords }}</span>
          </div>

          <div v-if="article.pdfAbsoluteUrl || article.pdfEmbedUrl" class="pdf-viewer-container">
            <div class="pdf-viewer-header">
              <h2>Maqola PDF</h2>
              <a :href="article.pdfAbsoluteUrl" :download="article.pdfName || 'maqola.pdf'" class="btn-download-pdf" target="_blank">
                PDF ni yuklab olish
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V10M8 10L11 7M8 10L5 7M2 14H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
            
            <div v-if="pdfError" class="pdf-error">
              <p class="error-message">{{ pdfError }}</p>
              <a :href="article.pdfAbsoluteUrl" class="btn-open-pdf" target="_blank">
                PDF ni ochish
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V10M8 10L11 7M8 10L5 7M2 14H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
            
            <div v-else class="pdf-wrapper">
              <div v-if="pdfUrl && numOfPages > 0 && VuePdf" class="pdf-pages">
                <component
                  v-for="page in numOfPages"
                  :key="page"
                  :is="VuePdf"
                  :src="pdfUrl"
                  :page="page"
                  class="pdf-page"
                />
              </div>
              <div v-else-if="pdfUrl" class="pdf-loading">
                <div class="loading-spinner"></div>
                <p>PDF yuklanmoqda...</p>
              </div>
              <div v-else class="pdf-loading">
                <div class="loading-spinner"></div>
                <p>PDF yuklanmoqda...</p>
              </div>
            </div>
          </div>

          <div v-else class="no-pdf">
            <p>Bu maqola uchun PDF fayl mavjud emas.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta'
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

useMeta({
  title: 'Ziyoli Avlod - Maqola',
  meta: [
    { name: 'description', content: 'Ziyoli Avlod jurnalidagi maqola haqida batafsil ma\'lumotlar.' },
    { name: 'keywords', content: 'ziyoli avlod, maqola, ilmiy maqola' },
    { property: 'og:title', content: 'Ziyoli Avlod - Maqola' },
    { property: 'og:description', content: 'Ziyoli Avlod jurnalidagi maqola haqida batafsil ma\'lumotlar.' },
    { property: 'og:type', content: 'article' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const route = useRoute();
const { t } = useI18n();

const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const article = ref(null);
const pdfBlobUrl = ref(null);
const pdfUrl = ref(null);
const pdfError = ref(null);
const isPdfLoading = ref(false);
const numOfPages = ref(0);
const VuePdf = shallowRef(null);
const createLoadingTask = shallowRef(null);

const pageTitle = computed(() => 'Jurnal');

const breadcrumbs = computed(() => [
  { text: 'Bosh sahifa', to: '/' },
  { text: 'Maqolalar', to: '/issues' },
  { text: 'Jurnal' }
]);

const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateString;
  }
};

const loadArticleData = async () => {
  const slug = route.params.slug;
  if (!slug) {
    article.value = null;
    return;
  }

  try {
    console.log(`Loading article with slug: ${slug}`);
    
    const response = await fetchData('/jurnallars', {
      'filters[slug][$eq]': slug,
      populate: 'pdf'
    });
    
    if (response.data && response.data.length > 0) {
      const articleData = response.data[0];
      const formattedDate = articleData.sana ? formatDate(articleData.sana) : null;
      
      article.value = {
        id: articleData.id,
        documentId: articleData.documentId,
        Mavzu: articleData.mavzu || '',
        Yonalishi: null, // Yangi API'da yo'q
        Maqola_ID: articleData.maqola_id || null,
        date: formattedDate || articleData.sana || null,
        volumeIssue: articleData.son || null,
        abstract: articleData.Annotatsiya || '',
        keywords: articleData.Kalit_suzlar || null,
        pdfAbsoluteUrl: articleData.pdf ? getImageUrl(articleData.pdf) : null,
        pdfEmbedUrl: articleData.pdf ? getImageUrl(articleData.pdf) : null,
        pdfName: articleData.pdf?.name || 'maqola.pdf',
        author: articleData.Muallif ? {
          name: articleData.Muallif,
          slug: null // Yangi API'da author slug yo'q
        } : null
        ,
        googleScholar: articleData.google_scholar || null
      };
      if (pdfBlobUrl.value) {
        URL.revokeObjectURL(pdfBlobUrl.value);
        pdfBlobUrl.value = null;
      }
      pdfError.value = null;
      if (article.value.pdfAbsoluteUrl) {
        pdfUrl.value = article.value.pdfAbsoluteUrl;
        isPdfLoading.value = true;
        await loadPdfLibrary();
        loadPdfPages(article.value.pdfAbsoluteUrl);
      } else {
        pdfUrl.value = null;
        numOfPages.value = 0;
      }
    } else {
      article.value = null;
    }
  } catch (err) {
    console.error('Article data yuklanmadi:', err);
    article.value = null;
  }
};

async function loadPdfLibrary() {
  if (!VuePdf.value || !createLoadingTask.value) {
    try {
      const pdfjs = await import('vue3-pdfjs').catch(() => {
        return import('vue3-pdfjs/esm');
      });
      VuePdf.value = pdfjs.VuePdf;
      createLoadingTask.value = pdfjs.createLoadingTask;
    } catch (err) {
      console.error('PDF library yuklashda xatolik:', err);
      pdfError.value = 'PDF kutubxonasini yuklashda xatolik yuz berdi.';
      throw err;
    }
  }
}

async function loadPdfPages(url) {
  try {
    await loadPdfLibrary();
    if (!createLoadingTask.value) {
      throw new Error('PDF library yuklanmadi');
    }
    const loadingTask = createLoadingTask.value(url);
    const pdf = await loadingTask.promise;
    numOfPages.value = pdf.numPages;
    isPdfLoading.value = false;
    pdfError.value = null;
  } catch (err) {
    console.error('PDF yuklashda xatolik:', err);
    pdfError.value = 'PDF faylni yuklashda xatolik yuz berdi. Iltimos, PDF ni to\'g\'ridan-to\'g\'ri ochishga harakat qiling.';
    isPdfLoading.value = false;
    numOfPages.value = 0;
  }
}

function handlePdfError(error) {
  console.error('PDF render qilishda xatolik:', error);
  pdfError.value = 'PDF faylni ko\'rsatishda xatolik yuz berdi. Iltimos, PDF ni to\'g\'ridan-to\'g\'ri ochishga harakat qiling.';
  isPdfLoading.value = false;
}

watch(currentLocale, () => {
  if (route.params.slug) {
    loadArticleData();
  }
});

watch(() => route.params.slug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    loadArticleData();
  }
}, { immediate: false });

onMounted(() => {
  if (route.params.slug) {
    loadArticleData();
  }
});

onUnmounted(() => {
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value);
    pdfBlobUrl.value = null;
  }
  pdfUrl.value = null;
  pdfError.value = null;
  numOfPages.value = 0;
});
</script>

<style scoped>
.page-content {
  padding: 60px 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

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

.retry-btn,
.btn-home {
  background-color: #081330;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.retry-btn:hover,
.btn-home:hover {
  background-color: #0a1a3a;
}

.article-detail {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.article-header {
  padding: 40px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 30px 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-icon {
  color: #2c5282;
  flex-shrink: 0;
}

.meta-value {
  color: #081330;
  font-size: 16px;
  font-weight: 500;
}

.btn-scholar-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.scholar-icon-meta {
  width: 80px;
  height: auto;
  display: block;
}

@media (max-width: 576px) {
  .scholar-icon-meta {
    width: 22px;
  }
}

.author-link {
  color: #072AC8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.author-link:hover {
  color: #081330;
  text-decoration: underline;
}

.abstract-section {
  padding: 40px;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 16px 0;
}

.abstract-text {
  font-size: 15px;
  color: #4a5568;
  line-height: 1.7;
  margin: 0;
  text-align: justify;
}

.keywords-section {
  padding: 40px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: baseline;
}

.keywords-section .section-title {
  margin: 0;
  font-size: 16px;
}

.keywords-text {
  font-size: 15px;
  color: #4a5568;
  line-height: 1.6;
}

.pdf-viewer-container {
  padding: 40px;
}

.pdf-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.pdf-viewer-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #081330;
  margin: 0;
}

.btn-download-pdf {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #072AC8;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-download-pdf:hover {
  background: #081330;
}

.pdf-wrapper {
  width: 100%;
  min-height: 600px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  overflow: hidden;
}

.pdf-pages {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.pdf-page {
  width: 100%;
  display: block;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto;
}

.pdf-page :deep(canvas) {
  max-width: 100%;
  height: auto;
  display: block;
}

.pdf-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 600px;
}

.pdf-loading .loading-spinner {
  margin-bottom: 20px;
}

.pdf-loading p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.pdf-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 400px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
}

.error-message {
  font-size: 18px;
  color: #e74c3c;
  margin: 0 0 30px 0;
  max-width: 600px;
}

.btn-open-pdf {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #072AC8;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-open-pdf:hover {
  background: #081330;
}

.no-pdf {
  padding: 40px;
  text-align: center;
}

.no-pdf p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

@media (max-width: 1280px) {
  .container {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .article-title {
    font-size: 24px;
  }
  
  .article-header {
    padding: 20px;
  }

  .abstract-section,
  .keywords-section {
    padding: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .abstract-text,
  .keywords-text {
    font-size: 14px;
  }
  
  .pdf-viewer-container {
    padding: 20px;
  }
  
  .pdf-wrapper {
    min-height: 400px;
  }
  
  .pdf-pages {
    padding: 10px 0;
    gap: 15px;
  }
  
  .pdf-page {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .pdf-loading {
    min-height: 400px;
    padding: 40px 20px;
  }
  
  .pdf-error {
    min-height: 300px;
    padding: 40px 20px;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 15px;
  }
  
  .pdf-viewer-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

