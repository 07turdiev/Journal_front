<template>
  <div class="home-page">
    <HeroSection />
    <ServicesCards />
    <InformationSection />
    <ContactFaqSection />
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import HeroSection from '../components/HeroSection.vue';
import ServicesCards from '../components/ServicesCards.vue';
import InformationSection from '../components/InformationSection.vue';
import ContactFaqSection from '../components/ContactFaqSection.vue';

useHead({
  title: 'Ziyoli Avlod',
  meta: [
    { name: 'description', content: 'Ziyoli Avlod jurnali - ilm-fan va ta\'lim sohasidagi eng so\'nggi yangiliklar, maqolalar va tadbirlar.' },
    { name: 'keywords', content: 'ziyoli avlod, jurnal, ilm-fan, ta\'lim, maqolalar, yangiliklar' },
    { property: 'og:title', content: 'Ziyoli Avlod - Bosh sahifa' },
    { property: 'og:description', content: 'Ziyoli Avlod jurnali - ilm-fan va ta\'lim sohasidagi eng so\'nggi yangiliklar.' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<style scoped>
.home-page {
  background: transparent;
  position: relative;
  min-height: 100vh;
}
</style>