<template>
  <main>
    <PageBanner :title="$t('submit_article.title')" />
    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadContactData" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <div v-else class="content-wrapper">
          <div class="submission-card">
            <div class="card-avatar">
              <img src="/assets/placeholder.png" alt="ORU Admin Avatar">
              <div class="active-icon"></div>
            </div>
            <div class="card-info">
              <h2 class="admin-name">{{ $t('submit_article.admin_name') }}</h2>
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#2c5282" stroke-width="2" />
                  <path d="M15 12.4556V14.42C15.0001 14.5607 14.9468 14.6961 14.8509 14.799C14.755 14.9019 14.6236 14.9646 14.4833 14.9744C14.2406 14.9911 14.0422 15 13.8889 15C8.97944 15 5 11.0206 5 6.11111C5 5.95778 5.00833 5.75944 5.02556 5.51667C5.0354 5.37636 5.0981 5.24501 5.201 5.14912C5.3039 5.05323 5.43935 4.99994 5.58 5H7.54444C7.61336 4.99993 7.67983 5.02548 7.73096 5.07168C7.78209 5.11788 7.81422 5.18143 7.82111 5.25C7.83389 5.37778 7.84556 5.47944 7.85667 5.55667C7.96707 6.32718 8.19334 7.07657 8.52778 7.77944C8.58056 7.89056 8.54611 8.02333 8.44611 8.09444L7.24722 8.95111C7.98025 10.6591 9.34142 12.0203 11.0494 12.7533L11.905 11.5567C11.94 11.5078 11.991 11.4727 12.0492 11.4576C12.1073 11.4425 12.169 11.4482 12.2233 11.4739C12.9261 11.8077 13.6753 12.0334 14.4456 12.1433C14.5228 12.1544 14.6244 12.1667 14.7511 12.1789C14.8196 12.1859 14.883 12.2181 14.9291 12.2692C14.9752 12.3203 15.0001 12.3867 15 12.4556Z" fill="#2c5282" />
                </svg>
                <span>{{ contactData?.phone || $t('submit_article.phone') }}</span>
              </div>
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM6.89 11.17L4.392 10.391C3.852 10.226 3.849 9.854 4.513 9.587L14.246 5.827C14.811 5.597 15.131 5.888 14.948 6.617L13.291 14.437C13.175 14.994 12.84 15.127 12.375 14.87L9.824 12.982L8.635 14.13C8.513 14.248 8.414 14.349 8.226 14.374C8.039 14.4 7.885 14.344 7.772 14.034L6.902 11.163L6.89 11.17Z" fill="#2c5282" />
                </svg>
                <a :href="contactData?.telegram || '#'" target="_blank" rel="noopener noreferrer">{{ $t('submit_article.telegram') }}</a>
              </div>
              <p class="instruction">{{ $t('submit_article.instruction') }}</p>
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM6.89 11.17L4.392 10.391C3.852 10.226 3.849 9.854 4.513 9.587L14.246 5.827C14.811 5.597 15.131 5.888 14.948 6.617L13.291 14.437C13.175 14.994 12.84 15.127 12.375 14.87L9.824 12.982L8.635 14.13C8.513 14.248 8.414 14.349 8.226 14.374C8.039 14.4 7.885 14.344 7.772 14.034L6.902 11.163L6.89 11.17Z" fill="#2c5282" />
                </svg>
                <a :href="contactData?.telegram2 || '#'" target="_blank" rel="noopener noreferrer">{{ $t('submit_article.admin_link') }}</a>
              </div>
            </div>
            <div class="card-qr">
              <img :src="contactData?.qrCode || '/assets/QRCode.png'" alt="QR Code" @error="handleImageError">
              <div class="qr-caption">
                {{ $t('submit_article.qr_caption') }}
              </div>
            </div>
          </div>

          <div class="note-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 3.33331L3.33337 33.3333H36.6667L20 3.33331Z" stroke="#FEC335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 23.3333V16.6666" stroke="#FEC335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 30H20.0167" stroke="#FEC335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p>{{ $t('submit_article.note') }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';

const route = useRoute();
const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();

const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const contactData = ref(null);

onMounted(() => {
  setPageMeta({
    title: t('submit_article.title') || 'Maqola Yuborish',
    description: t('submit_article.description') || 'Ziyoli Avlod jurnalida o\'z maqolangizni yuborish. To\'liq forma va kerakli hujjatlar uchun qo\'llanma.',
    keywords: t('submit_article.keywords') || 'maqola yuborish, nashr etish, ilmiy maqola'
  });
  setCanonical(`https://ziyoliavlod.uz${route.fullPath}`);
  loadContactData();
});
const contactData = ref(null);

const loadContactData = async () => {
  try {
    const response = await fetchData('/maqola-yuborish', { populate: 'qr' });
    
    if (response.data) {
      contactData.value = {
        phone: response.data.Telefon,
        telegram: response.data.Telegram,
        telegram2: response.data.Telegram2,
        qrCode: getImageUrl(response.data.qr)
      };
    }
  } catch (err) {
    console.error('Contact data yuklanmadi:', err);
  }
};

const handleImageError = (event) => {
  event.target.src = '/assets/QRCode.png';
};

watch(currentLocale, () => {
  loadContactData();
});

onMounted(() => {
  loadContactData();
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

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.submission-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 40px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-avatar {
  position: relative;
  flex-shrink: 0;
}

.card-avatar img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.active-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  background: #09BD3C;
  border: 4px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-info {
  flex: 1;
}

.admin-name {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.info-item:hover {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.info-item span,
.info-item a {
  font-size: 15px;
  color: #2d3748;
  text-decoration: none;
  font-weight: 500;
}

.info-item a {
  color: #2c5282;
  transition: color 0.2s ease;
}

.info-item a:hover {
  color: #2a4a7a;
  text-decoration: underline;
}

.instruction {
  font-size: 15px;
  font-weight: 500;
  color: #4a5568;
  margin: 20px 0;
  line-height: 1.6;
  padding: 16px;
  background: #f0f7ff;
  border-left: 4px solid #2c5282;
  border-radius: 4px;
}

.card-qr {
  flex-shrink: 0;
  text-align: center;
}

.card-qr img {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  display: block;
  margin: 0 auto 12px auto;
  border: 1px solid #e2e8f0;
}

.qr-caption {
  background: #2c5282;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  width: 180px;
  margin: 0 auto;
  line-height: 1.4;
}

.note-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #0424B4;
  border-radius: 8px;
  padding: 32px 40px;
}

.note-banner p {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #FEC335;
  line-height: 1.5;
  flex: 1;
}

.note-banner svg {
  flex-shrink: 0;
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

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .submission-card {
    gap: 30px;
    padding: 32px;
  }
}

@media (max-width: 992px) {
  .submission-card {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 32px;
  }

  .card-avatar {
    margin: 0 auto;
  }

  .info-item {
    justify-content: flex-start;
  }

  .card-qr {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .submission-card {
    padding: 24px;
  }

  .admin-name {
    font-size: 22px;
  }

  .card-avatar img {
    width: 140px;
    height: 140px;
  }

  .active-icon {
    width: 32px;
    height: 32px;
    bottom: 6px;
    right: 6px;
  }

  .card-qr img {
    width: 160px;
    height: 160px;
  }

  .qr-caption {
    width: 160px;
    font-size: 11px;
  }

  .note-banner {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }
}

@media (max-width: 576px) {
  .page-content {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .submission-card {
    padding: 20px;
    gap: 24px;
  }

  .admin-name {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .info-item {
    padding: 10px 12px;
    margin-bottom: 12px;
  }

  .info-item span,
  .info-item a {
    font-size: 14px;
  }

  .instruction {
    font-size: 14px;
    padding: 12px;
    margin: 16px 0;
  }

  .card-avatar img {
    width: 120px;
    height: 120px;
  }

  .active-icon {
    width: 28px;
    height: 28px;
    border-width: 3px;
  }

  .card-qr img {
    width: 140px;
    height: 140px;
  }

  .qr-caption {
    width: 140px;
    font-size: 10px;
    padding: 10px;
  }

  .note-banner {
    padding: 20px 16px;
  }

  .note-banner p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .submission-card {
    padding: 16px;
  }

  .admin-name {
    font-size: 18px;
  }

  .card-avatar img {
    width: 100px;
    height: 100px;
  }

  .card-qr img {
    width: 120px;
    height: 120px;
  }

  .qr-caption {
    width: 120px;
  }
}
</style>
