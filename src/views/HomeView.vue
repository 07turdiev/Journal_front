<template>
  <div class="home-page">
    <HeroSection />
    <ServicesCards />
    <InformationSection />
    <ContactFaqSection />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePageMeta } from '@/composables/usePageMeta';
import HeroSection from '../components/HeroSection.vue';
import ServicesCards from '../components/ServicesCards.vue';
import InformationSection from '../components/InformationSection.vue';
import ContactFaqSection from '../components/ContactFaqSection.vue';

const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();

onMounted(() => {
  setPageMeta({
    title: t('home.title') || 'Ziyoli Avlod',
    description: t('home.description') || 'Ziyoli Avlod - O\'zbekiston ilmiy jurnali. Akademik maqolalar, tadqiqot, yangiliklar va tadbirlar.',
    keywords: t('home.keywords') || 'Ziyoli Avlod, jurnal, ilmiy, akademik, O\'zbekiston',
    image: 'https://ziyoliavlod.uz/og_default.jpg',
    url: 'https://ziyoliavlod.uz/'
  });
  setCanonical('https://ziyoliavlod.uz/');
});
</script>

<style scoped>
.home-page {
  background: transparent;
  position: relative;
  min-height: 100vh;
}
</style>