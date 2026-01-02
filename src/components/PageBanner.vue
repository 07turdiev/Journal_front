<template>
  <div class="page-banner">
    <div class="container">
      <h1 class="page-title">{{ computedTitle }}</h1>
      <div class="breadcrumbs">
        <template v-for="(item, index) in computedBreadcrumbs" :key="index">
          <RouterLink v-if="item.to" :to="item.to">{{ item.text }}</RouterLink>
          <span v-else :class="{ 'current': !item.to }">{{ item.text }}</span>
          <span v-if="index < computedBreadcrumbs.length - 1" class="separator">></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const route = useRoute();
const { t } = useI18n();
const { getLocalizedPath } = useLocalizedRoute();

const props = defineProps({
  title: { type: String, required: false },
  breadcrumbs: { type: Array, required: false, default: undefined }
});

// Title va breadcrumbs matnlarini translate qilish uchun mapping
const translateText = computed(() => {
  return (text) => {
    if (!text) return '';
    
    const translations = {
      'Bosh sahifa': t('archive.breadcrumb_home'),
      'Jurnal haqida': t('about.title'),
      'Jurnal tahririyati': t('header.editorial_office'),
      'Tahrir Hay\'ati': t('dropdown.editorial_board'),
      'Tahririyat Xodimlari': t('staff.title'),
      'Hamkorlar': t('dropdown.partners'),
      'Yangiliklar': t('news.title'),
      'E\'lonlar': t('announcements.title'),
      'Tadbirlar': t('dropdown.events'),
      'Maqola Yuborish': t('submit_article.title'),
      'Maqola yuborish': t('submit_article.title'),
      'Mualliflarga': t('archive.breadcrumb_authors'),
      'Mualliflar uchun qo\'llanma': t('author_guide.title'),
      'Maqolalar': t('issues.title'),
      'Maqola': t('issues.title'),
      'Aloqa': t('contact.title'),
      'Tez-tez eriladigan savollar': t('faq.title'),
      'Tez-tez beriladigan savollar': t('faq.title'),
      'Mualliflar': t('authors.title'),
      'Muallif': t('authors.title'),
      'Loyihalar': t('projects.title'),
      'Loyiha': t('projects.title'),
      'Sahifa topilmadi': 'Sahifa topilmadi'
    };
    
    return translations[text] || text;
  };
});

const computedTitle = computed(() => {
  const title = props.title ?? route.meta.title ?? '';
  return translateText.value(title);
});

const computedBreadcrumbs = computed(() => {
  const breadcrumbs = props.breadcrumbs ?? route.meta.breadcrumbs ?? [];
  return breadcrumbs.map(item => ({
    ...item,
    text: translateText.value(item.text),
    to: item.to ? getLocalizedPath(item.to) : undefined
  }));
});
</script>

<style scoped>
.page-banner {
  background: rgb(43, 74, 106);
  padding: 40px 0;
  text-align: center;
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-transform: lowercase;
  color: #FFFFFF;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.page-title::first-letter {
  text-transform: uppercase;
}

.breadcrumbs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
}

.breadcrumbs a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.breadcrumbs a:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.breadcrumbs .current {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
}

.breadcrumbs .separator {
  user-select: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .page-banner {
    padding: 30px 0;
  }
}
</style>