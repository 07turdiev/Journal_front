<template>
  <section class="info-cards-section">
    <div class="container">
      <div class="cards-wrapper">
        <RouterLink :to="card.to" v-for="(card, index) in cards" :key="index" class="card">
          <div class="card-icon" v-html="card.icon"></div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-description">{{ card.description }}</p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const { t } = useI18n();
const { getLocalizedPath } = useLocalizedRoute();

const cards = computed(() => [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="26" viewBox="0 0 23 26" fill="none">
<path d="M22.9343 18.2377V1.83636C22.9355 1.67059 22.9037 1.50621 22.8408 1.35262C22.7778 1.19902 22.6849 1.05921 22.5674 0.941172C22.45 0.823133 22.3102 0.729177 22.156 0.664669C22.0019 0.600161 21.8364 0.566364 21.6691 0.565208H1.26521C0.929876 0.565207 0.608258 0.697098 0.371022 0.931898C0.133785 1.1667 0.000337698 1.4852 0 1.81743V24.5594C0 25.2372 0.572084 25.8116 1.27668 25.8116H15.2857L22.9343 18.2377ZM20.3861 16.9754H14.0154V23.2869H2.54826V3.08985H20.3861V16.9754ZM6.37064 19.5H10.193V16.9754H6.37064V19.5ZM6.37064 14.4507H16.5637V11.9261H6.37064V14.4507ZM6.37064 9.40144H16.5637V6.8768H6.37064V9.40144Z" fill="#072AC8"/>
</svg>`,
    title: t('services.submit_article'),
    description: t('services.submit_article_desc'),
    to: getLocalizedPath('/submit-article'),
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none">
<path d="M23.2354 0.565186C23.8959 0.565186 24.432 1.07828 24.432 1.71048V17.7447C24.432 18.3769 23.8959 18.89 23.2354 18.89H5.83123L0.500488 22.8985V1.71048C0.500488 1.07828 1.03655 0.565186 1.69706 0.565186H23.2354ZM22.0388 2.85578H2.89364V18.1856L5.0032 16.5994H22.0388V2.85578ZM10.6893 5.61825L11.2242 6.40621C9.2283 7.44042 9.26301 9.09995 9.26301 9.45729C9.44847 9.43438 9.64352 9.4298 9.83736 9.44698C10.9167 9.54319 11.7674 10.3919 11.7674 11.4455C11.7674 12.5519 10.8293 13.4498 9.67343 13.4498C9.03087 13.4498 8.41703 13.1692 8.02934 12.7741C7.4131 12.1487 7.08165 11.4455 7.08165 10.306C7.08165 8.30168 8.55104 6.50585 10.6893 5.61825ZM16.6722 5.61825L17.2071 6.40621C15.2112 7.44042 15.2459 9.09995 15.2459 9.45729C15.4313 9.43438 15.6264 9.4298 15.8202 9.44698C16.8995 9.54319 17.7503 10.3919 17.7503 11.4455C17.7503 12.5519 16.8122 13.4498 15.6563 13.4498C15.0137 13.4498 14.3999 13.1692 14.0122 12.7741C13.396 12.1487 13.0645 11.4455 13.0645 10.306C13.0645 8.30168 14.5339 6.50585 16.6722 5.61825Z" fill="#072AC8"/>
</svg>`,
    title: t('services.author_guide'),
    description: t('services.author_guide_desc'),
    to: getLocalizedPath('/author-guide'),
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
<path d="M18.8392 16.1014H3.88206C3.6176 16.1014 3.36397 16.2037 3.17697 16.3858C2.98997 16.5679 2.88492 16.8149 2.88492 17.0724C2.88492 17.33 2.98997 17.5769 3.17697 17.759C3.36397 17.9411 3.6176 18.0434 3.88206 18.0434H18.8392V19.9855H3.88206C3.08868 19.9855 2.3278 19.6786 1.7668 19.1323C1.20579 18.586 0.890625 17.845 0.890625 17.0724V2.50721C0.890625 1.99216 1.10074 1.49819 1.47474 1.13399C1.84874 0.769791 2.356 0.565186 2.88492 0.565186H18.8392V16.1014ZM2.88492 14.2079C3.04645 14.1759 3.21298 14.1594 3.38349 14.1594H16.845V2.50721H2.88492V14.2079ZM13.8535 7.36229H5.87635V5.42026H13.8535V7.36229Z" fill="#072AC8"/>
</svg>`,
    title: t('services.journal_issues'),
    description: t('services.journal_issues_desc'),
    to: getLocalizedPath('/issues'),
  },
]);
</script>

<style scoped>
.info-cards-section {
  padding: 40px 0;
  transform: translateY(-60%);
  margin-bottom: -280px;
  position: relative;
  z-index: 10;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.cards-wrapper {
  background: rgb(43, 74, 106);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.card {
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 30px 25px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-decoration: none;
  display: block;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(43, 74, 106, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(43, 74, 106, 0.1), transparent);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease;
  z-index: -1;
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-color: rgb(43, 74, 106);
}

.card:hover::before {
  opacity: 1;
}

.card:hover::after {
  transform: translate(-50%, -50%) scale(1.5);
}

.card-icon {
  margin-bottom: 20px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.card-icon svg {
  transition: transform 0.3s ease;
}

.card:hover .card-icon svg {
  transform: scale(1.15) rotateY(180deg);
}

.card-icon svg path {
  fill: rgb(43, 74, 106);
  transition: fill 0.3s ease;
}

.card:hover .card-icon svg path {
  fill: rgb(44, 62, 80);
}

.card-icon svg {
  filter: drop-shadow(0 4px 8px rgba(43, 74, 106, 0.3));
}

.card-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: rgb(43, 74, 106);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.1;
  z-index: -1;
}

.card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 1.3;
  color: rgb(43, 74, 106);
  margin: 0 0 15px 0;
  text-decoration: none;
  transition: all 0.3s ease;
}

.card:hover .card-title {
  color: rgb(44, 62, 80);
  transform: scale(1.05);
}

.card-description {
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 13px;
  line-height: 1.6;
  color: #4A5568;
  margin: 0;
  transition: color 0.3s ease;
}

.card:hover .card-description {
  color: #2D3748;
}

/* RESPONSIVE STILLAR */
@media (max-width: 992px) {
  .cards-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .info-cards-section {
    transform: translateY(0);
    margin-bottom: 0;
    padding: 50px 0;
    background: rgb(43, 74, 106);
  }

  .cards-wrapper {
    grid-template-columns: 1fr;
    background: transparent;
    border: none;
    padding: 0;
    box-shadow: none;
    backdrop-filter: none;
  }

  .card {
    margin-bottom: 20px;
  }
}
</style>