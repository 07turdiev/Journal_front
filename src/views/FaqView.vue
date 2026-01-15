<template>
    <main>
        <PageBanner :title="route.meta.title" :breadcrumbs="route.meta.breadcrumbs" />
        <div class="page-content">
            <div class="container">
        <div class="faq-header">
        </div>

        <div class="faq-content">
          <div v-if="loading" class="faq-loading">
                    <div class="loading-spinner"></div>
            <p>{{ $t('contact_faq.loading_questions') }}</p>
                </div>
                
          <div v-else-if="error" class="faq-error">
            <p>{{ $t('contact_faq.error_occurred') }}: {{ error }}</p>
            <button @click="loadFaqsData" class="retry-btn">{{ $t('contact_faq.retry') }}</button>
                </div>
                
          <div v-else-if="faqs.length === 0" class="no-faqs">
            <p>{{ $t('contact_faq.no_questions') }}</p>
                    </div>
          
          <div v-else class="faq-list">
            <div v-for="(faq, index) in faqs" :key="faq.id" 
                 class="faq-item" 
                 :class="{ 'active': openIndex === index }"
                 @click="toggleAccordion(index)">
              <div class="faq-question-wrapper">
                <span class="faq-number">{{ String(index + 1).padStart(2, '0') }}</span>
                <h3 class="faq-question">{{ faq.question }}</h3>
                <div class="faq-toggle" :class="{ 'is-open': openIndex === index }">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
              </div>
              <div class="faq-answer-wrapper" :class="{ 'open': openIndex === index }">
                <div class="faq-answer" v-html="faq.htmlAnswer || faq.answer"></div>
              </div>
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
import { usePageMeta } from '@/composables/usePageMeta';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const route = useRoute();
const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();

const openIndex = ref(0);

onMounted(() => {
  setPageMeta({
    title: t('faq.title') || 'Tez-Tez Beriladigan Savollar',
    description: t('faq.description') || 'Ziyoli Avlod jurnali haqida tez-tez beriladigan savollar va ularning javoblari.',
    keywords: t('faq.keywords') || 'FAQ, savollar, javoblar, ko\'rsatmalar'
  });
  setCanonical(`https://ziyoliavlod.uz${route.fullPath}`);
  loadFaqsData();
});

const toggleAccordion = (index) => {
  if (openIndex.value === index) {
    openIndex.value = null;
  } else {
    openIndex.value = index;
  }
};

const { loading, error, fetchData, currentLocale } = useApi();
const faqs = ref([]);

const loadFaqsData = async () => {
  try {
    const response = await fetchData('/tez-tez-beriladigan-savollars');
    
    if (response.data) {
      faqs.value = response.data.map(faq => ({
        id: faq.id,
        question: faq.Savol,
        answer: getPlainText(faq.Javob),
        htmlAnswer: parseRichText(faq.Javob)
      }));
      openIndex.value = 0;
    } else {
      faqs.value = [];
    }
  } catch (err) {
    console.error('FAQ data yuklanmadi:', err);
    faqs.value = [];
  }
};

watch(currentLocale, (newLocale, oldLocale) => {
  if (newLocale !== oldLocale) {
  loadFaqsData();
  }
});

onMounted(() => {
  loadFaqsData();
});
</script>

<style scoped>
.page-content {
  padding: 60px 0 80px 0;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1280px;
    margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.faq-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.faq-content {
  max-width: 900px;
  margin: 0 auto;
}

.faq-list {
    display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
    cursor: pointer;
  transition: all 0.2s ease;
}

.faq-item:hover {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.faq-item.active {
  background: #ffffff;
  border-color: #2c5282;
  box-shadow: 0 4px 12px rgba(44, 82, 130, 0.1);
}

.faq-question-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.faq-number {
  font-size: 16px;
    font-weight: 700;
  color: #2c5282;
  background: #e6f2ff;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.faq-question {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
    margin: 0;
    line-height: 1.5;
}

.faq-toggle {
  color: #718096;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-toggle.is-open {
  transform: rotate(180deg);
  color: #2c5282;
}

.faq-answer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0;
  overflow: hidden;
}

.faq-answer-wrapper.open {
  grid-template-rows: 1fr;
  margin-top: 20px;
}

.faq-answer-wrapper > * {
  min-height: 0;
  overflow: hidden;
}

.faq-answer {
  font-size: 15px;
  line-height: 1.7;
  color: #4a5568;
  padding-left: 56px;
}

.faq-answer p {
  margin: 0 0 16px 0;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

.faq-answer :deep(h1),
.faq-answer :deep(h2),
.faq-answer :deep(h3),
.faq-answer :deep(h4),
.faq-answer :deep(h5),
.faq-answer :deep(h6) {
  margin: 20px 0 12px 0;
  font-weight: 600;
  color: #2d3748;
}

.faq-answer :deep(h1) { font-size: 24px; }
.faq-answer :deep(h2) { font-size: 22px; }
.faq-answer :deep(h3) { font-size: 20px; }
.faq-answer :deep(h4) { font-size: 18px; }
.faq-answer :deep(h5) { font-size: 16px; }
.faq-answer :deep(h6) { font-size: 15px; }

.faq-answer :deep(ul),
.faq-answer :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.faq-answer :deep(li) {
  margin-bottom: 8px;
}

.faq-answer :deep(strong) {
    font-weight: 600;
  color: #2d3748;
}

.faq-answer :deep(a) {
  color: #2c5282;
  text-decoration: none;
  transition: color 0.2s ease;
}

.faq-answer :deep(a:hover) {
  color: #2a4a7a;
    text-decoration: underline;
}

.faq-loading,
.faq-error,
.no-faqs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  padding: 80px 20px;
    text-align: center;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.loading-spinner {
    width: 40px;
    height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2c5282;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.faq-loading p,
.faq-error p,
.no-faqs p {
    margin: 0;
  font-size: 16px;
  color: #718096;
}

.faq-error p {
  color: #e53e3e;
  margin-bottom: 20px;
}

.retry-btn {
  background: #2c5282;
  color: #ffffff;
    border: none;
    padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
    cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #2a4a7a;
}

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 40px 0 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .faq-header {
    margin-bottom: 40px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 15px;
  }

  .faq-item {
    padding: 20px;
    }

  .faq-question {
    font-size: 16px;
  }

  .faq-answer {
    padding-left: 0;
    font-size: 14px;
  }

  .faq-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
    }
}

@media (max-width: 576px) {
  .page-content {
    padding: 30px 0 50px 0;
  }

  .container {
    padding: 0 16px;
  }

  .faq-header {
    margin-bottom: 32px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .faq-item {
    padding: 16px;
  }

  .faq-question {
    font-size: 15px;
  }

  .faq-answer {
    font-size: 13px;
  }

  .faq-number {
    width: 28px;
    height: 28px;
    font-size: 12px;
    }
}
</style>
