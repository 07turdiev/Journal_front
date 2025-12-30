<template>
  <main>
    <PageBanner :title="$t('dropdown.partners')" />
    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadPartnersData" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <div v-else class="partners-grid">
          <div v-if="partners.length === 0" class="no-results">{{ $t('partners.no_partners') }}</div>
          <div v-for="(partner, index) in partners" :key="partner.id" class="partner-card">
            <img :src="partner.logo" :alt="'Hamkor ' + (index + 1)" @error="handleImageError">
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';

const { t } = useI18n();
const partners = ref([]);

const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();

const loadPartnersData = async () => {
  try {
    const response = await fetchData('/hamkorlars', { populate: 'icon' });
    
    if (response.data) {
      partners.value = response.data.map(partner => ({
        id: partner.id,
        logo: getImageUrl(partner.icon)
      }));
    }
  } catch (err) {
    console.error('Partners data yuklanmadi:', err);
  }
};

const handleImageError = (event) => {
  event.target.src = '/assets/logo.svg';
};

watch(currentLocale, () => {
  loadPartnersData();
});

onMounted(() => {
  loadPartnersData();
});
</script>

<style scoped>
.page-content {
  padding: 80px 0;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.partner-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 196px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.partner-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.partner-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2c5282;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p,
.error-state p {
  margin: 0;
  font-size: 15px;
  color: #718096;
}

.error-state p {
  color: #e53e3e;
  margin-bottom: 16px;
}

.retry-btn {
  background: #2c5282;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #2a4a7a;
}

.no-results {
  grid-column: 1 / -1;
  padding: 60px 20px;
  text-align: center;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 16px;
}

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .partners-grid {
    gap: 24px;
  }
}

@media (max-width: 992px) {
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .partners-grid {
    gap: 20px;
  }

  .partner-card {
    height: 160px;
    padding: 16px;
  }
}

@media (max-width: 576px) {
  .page-content {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .partners-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .partner-card {
    height: 140px;
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .partner-card {
    height: 120px;
    padding: 12px;
  }
}
</style>
