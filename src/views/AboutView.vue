<template>
  <main>
    <PageBanner />
    <div class="about-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Xatolik yuz berdi: {{ error }}</p>
          <button @click="loadAboutData" class="retry-btn">Qayta urinish</button>
        </div>
        
        <!-- Content -->
        <div v-else-if="aboutContent" class="content-wrapper">
          <div class="markdown-content" v-html="aboutContent.htmlContent"></div>
        </div>
        
        <div v-else class="no-content">
          <p>Ma'lumot topilmadi</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { parseMarkdown } from '@/utils/richTextParser';
import { useDynamicSeoMeta } from '@/composables/useDynamicSeoMeta';

const openIndex = ref(0);
const aboutContent = ref(null);
const route = useRoute();
const { loading, error, fetchData, currentLocale } = useApi();

useDynamicSeoMeta(null, 'about');

const toggleAccordion = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const loadAboutData = async () => {
  try {
    const response = await fetchData('/jurnal-haqida');
    
    if (response.data && response.data.text) {
      aboutContent.value = {
        id: response.data.id,
        htmlContent: parseMarkdown(response.data.text)
      };
    }
  } catch (err) {
    console.error('About data yuklanmadi:', err);
  }
};

watch(currentLocale, () => {
  loadAboutData();
});

onMounted(() => {
  loadAboutData();
});
</script>

<style scoped>
.about-content {
  padding: 80px 0;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-wrapper {
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.markdown-content {
  line-height: 1.8;
  color: #2D3748;
}

.markdown-content :deep(p) {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 300;
  text-align: justify;
  color: #4A5568;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 30px 0 20px 0;
  font-weight: 700;
  color: rgb(43, 74, 106);
}

.markdown-content :deep(h1) {
  font-size: 32px;
}

.markdown-content :deep(h2) {
  font-size: 28px;
}

.markdown-content :deep(h3) {
  font-size: 24px;
}

.markdown-content :deep(strong),
.markdown-content :deep(b) {
  font-weight: 700;
  color: rgb(43, 74, 106);
  background: rgba(43, 74, 106, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
}

.markdown-content :deep(em),
.markdown-content :deep(i) {
  font-style: italic;
  color: #4A5568;
  font-weight: 400;
}

.markdown-content :deep(u) {
  text-decoration: underline;
  text-decoration-color: rgb(43, 74, 106);
  text-decoration-thickness: 2px;
}

.markdown-content :deep(s),
.markdown-content :deep(del),
.markdown-content :deep(strike) {
  text-decoration: line-through;
  opacity: 0.7;
  color: #718096;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 20px 0;
  padding-left: 30px;
}

.markdown-content :deep(li) {
  margin: 10px 0;
  font-size: 16px;
  font-weight: 300;
  color: #4A5568;
}

.markdown-content :deep(blockquote) {
  margin: 20px 0;
  padding: 15px 20px;
  border-left: 4px solid rgb(43, 74, 106);
  background: rgba(43, 74, 106, 0.1);
  border-radius: 8px;
  font-style: italic;
  color: #4A5568;
}

.markdown-content :deep(pre) {
  margin: 20px 0;
  padding: 20px;
  background: #F7FAFC;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow-x: auto;
  position: relative;
}

.markdown-content :deep(pre::before) {
  content: 'Code';
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 11px;
  font-weight: 600;
  color: rgb(43, 74, 106);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.markdown-content :deep(code) {
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  background: rgba(43, 74, 106, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  color: rgb(43, 74, 106);
  font-weight: 500;
}

.markdown-content :deep(pre code) {
  display: block;
  background: transparent;
  padding: 0;
  color: #2D3748;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
}

.markdown-content :deep(pre code.html),
.markdown-content :deep(pre code.xml) {
  color: #ff6b6b;
}

.markdown-content :deep(pre code.css) {
  color: rgb(43, 74, 106);
}

.markdown-content :deep(pre code.javascript),
.markdown-content :deep(pre code.js) {
  color: rgb(43, 74, 106);
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(a) {
  color: #4a9eff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.markdown-content :deep(a:hover) {
  color: #FFFFFF;
  border-bottom-color: #4a9eff;
}

.no-content {
  text-align: center;
  padding: 60px 0;
  color: #718096;
  font-size: 18px;
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
</style>