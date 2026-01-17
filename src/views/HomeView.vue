<template>
  <div class="home-page">
    <HeroSection />
    <ServicesCards />
    <InformationSection />
    <ContactFaqSection />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue';
import ServicesCards from '../components/ServicesCards.vue';
import InformationSection from '../components/InformationSection.vue';
import ContactFaqSection from '../components/ContactFaqSection.vue';
import { useDynamicSeoMeta } from '@/composables/useDynamicSeoMeta';

useDynamicSeoMeta({
  fallbackKey: 'home',
  useApiData: false
});
</script>

<style scoped>
.home-page {
  background: transparent;
  position: relative;
  min-height: 100vh;
}
</style>