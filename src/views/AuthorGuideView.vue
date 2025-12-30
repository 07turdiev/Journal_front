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
          <button @click="loadGuideData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Content -->
        <div v-else class="accordion">
          <div v-if="guideItems.length === 0" class="no-results">
            Qo'llanma topilmadi
          </div>
          <div v-for="(item, index) in guideItems" :key="item.id || index" class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion(index)">
              <h3>{{ item.title }}</h3>
              <svg class="accordion-arrow" :class="{ 'is-open': openIndex === index }" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 7L13 1" stroke="#081330" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div v-if="openIndex === index" class="accordion-body">
              <div v-html="item.htmlContent || item.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const route = useRoute();
const openIndex = ref(0); // Birinchi element ochiq tursin

const toggleAccordion = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const { t } = useI18n();

// API integration
const { loading, error, fetchData, currentLocale } = useApi();
const guideItems = ref([]);

// API dan ma'lumotlarni olish
const loadGuideData = async () => {
  try {
    const response = await fetchData('/qollanmas');
    
    if (response.data) {
      guideItems.value = response.data.map(item => ({
        id: item.id,
        title: item.Nomi,
        content: getPlainText(item.Text),
        htmlContent: parseRichText(item.Text)
      }));
    }
  } catch (err) {
    console.error('Guide data yuklanmadi:', err);
  }
};

// Locale o'zgarishini kuzatish
watch(currentLocale, () => {
  loadGuideData();
});

onMounted(() => {
  loadGuideData();
});
</script>

<style scoped>
/* Stillar AboutView.vue bilan bir xil */
.page-content { padding: 80px 0; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 15px; }
.accordion-item { border-bottom: 1px solid rgba(7, 25, 70, 0.2); }
.accordion-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 25px 0; cursor: pointer;
}
.accordion-header h3 {
  margin: 0; font-size: 24px; font-weight: 700; color: #081330;
}
.accordion-arrow { transition: transform 0.3s ease; }
.accordion-arrow.is-open { transform: rotate(180deg); }
.accordion-body { padding-bottom: 25px; }
.accordion-body p {
  margin: 0; font-size: 22px; line-height: 1.5;
  text-align: justify; color: #000000; font-weight: 300;
}

/* Rich text styling */
.accordion-body :deep(h1),
.accordion-body :deep(h2),
.accordion-body :deep(h3),
.accordion-body :deep(h4),
.accordion-body :deep(h5),
.accordion-body :deep(h6) {
  margin: 0 0 20px 0;
  font-weight: 600;
  color: #081330;
}

.accordion-body :deep(h1) { font-size: 28px; }
.accordion-body :deep(h2) { font-size: 26px; }
.accordion-body :deep(h3) { font-size: 24px; }
.accordion-body :deep(h4) { font-size: 22px; }
.accordion-body :deep(h5) { font-size: 20px; }
.accordion-body :deep(h6) { font-size: 18px; }

.accordion-body :deep(ul),
.accordion-body :deep(ol) {
  margin: 0 0 20px 0;
  padding-left: 30px;
}

.accordion-body :deep(li) {
  margin-bottom: 8px;
  font-size: 22px;
  line-height: 1.5;
  color: #000000;
  font-weight: 300;
}

.accordion-body :deep(blockquote) {
  margin: 0 0 20px 0;
  padding: 20px 25px;
  border-left: 5px solid #081330;
  background-color: #f8f9fa;
  font-style: italic;
  color: #555;
  border-radius: 0 8px 8px 0;
}

.accordion-body :deep(pre) {
  margin: 0 0 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e9ecef;
}

.accordion-body :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #e74c3c;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.accordion-body :deep(a) {
  color: #081330;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.accordion-body :deep(a:hover) {
  color: #0a1a3a;
}

.accordion-body :deep(strong) {
  font-weight: 600;
  color: #081330;
}

.accordion-body :deep(em) {
  font-style: italic;
}

.accordion-body :deep(u) {
  text-decoration: underline;
}

.accordion-body :deep(s) {
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
.no-results {
  padding: 20px;
  text-align: center;
  color: rgba(7, 25, 70, 0.7);
  background: #F2F3F4;
  border-radius: 4px;
  font-size: 18px;
}

@media (max-width: 768px) {
    .accordion-header h3 { font-size: 20px; }
    .accordion-body p { font-size: 18px; }
    .accordion-body :deep(li) { font-size: 18px; }
}
</style>