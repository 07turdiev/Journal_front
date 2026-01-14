<template>
  <main>
    <PageBanner :title="$t('staff.title')" />
    <div class="page-content">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadStaffData" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <div v-else class="members-list">
          <div v-if="staffMembers.length === 0" class="no-results">{{ $t('staff.no_members') }}</div>
          <div v-for="member in staffMembers" :key="member.id" class="member-item">
            <h3 class="member-name">{{ member.name }}</h3>
            <div class="member-details">
              <img :src="member.image" :alt="member.name" class="member-photo" @error="handleImageError">
              <div class="member-info">
                <div v-html="member.htmlDescription || member.description" class="member-description"></div>
                <div class="member-contacts">
                  <div class="contact-item">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2C8.89543 2 8 2.89543 8 4C8 5.10457 8.89543 6 10 6C11.1046 6 12 5.10457 12 4C12 2.89543 11.1046 2 10 2ZM10 7C8.34315 7 7 5.65685 7 4C7 2.34315 8.34315 1 10 1C11.6569 1 13 2.34315 13 4C13 5.65685 11.6569 7 10 7ZM3 18C3 14.6863 5.68629 12 9 12H11C14.3137 12 17 14.6863 17 18V19H3V18ZM9 11C5.13401 11 2 14.134 2 18V20H18V18C18 14.134 14.866 11 11 11H9Z" fill="#2c5282" />
                    </svg>
                    <span><b>{{ $t('staff.position') }}</b> {{ member.position || $t('staff.no_position') }}</span>
                  </div>
                  <div class="contact-item">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 4H2C1.448 4 1 4.448 1 5V15C1 15.552 1.448 16 2 16H18C18.552 16 19 15.552 19 15V5C19 4.448 18.552 4 18 4ZM17.6 5L10 9.8L2.4 5H17.6ZM2 15V6.2L10 11.2L18 6.2V15H2Z" fill="#2c5282" />
                    </svg>
                    <span><b>{{ $t('staff.email') }}</b> {{ member.email || $t('staff.no_email') }}</span>
                  </div>
                </div>
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
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta'
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

useMeta({
  title: 'Ziyoli Avlod - Tahririyat Xodimlari',
  meta: [
    { name: 'description', content: 'Ziyoli Avlod jurnalining tahririyat xodimlari haqida ma\'lumotlar.' },
    { name: 'keywords', content: 'ziyoli avlod, tahririyat xodimlari, jamoa' },
    { property: 'og:title', content: 'Ziyoli Avlod - Tahririyat Xodimlari' },
    { property: 'og:description', content: 'Ziyoli Avlod jurnalining tahririyat xodimlari haqida ma\'lumotlar.' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const { t } = useI18n();
const staffMembers = ref([]);

const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();

const loadStaffData = async () => {
  try {
    const response = await fetchData('/tahririyat-xodimlaris', { populate: 'Rasmi' });
    
    if (response.data) {
      staffMembers.value = response.data.map(member => ({
        id: member.id,
        name: member.Ismi,
        description: getPlainText(member.Text),
        htmlDescription: parseRichText(member.Text),
        position: member.Lavozimi,
        email: member.email,
        image: getImageUrl(member.Rasmi)
      }));
    }
  } catch (err) {
    console.error('Staff data yuklanmadi:', err);
  }
};

const handleImageError = (event) => {
  event.target.src = '/assets/placeholder.png';
};

watch(currentLocale, () => {
  loadStaffData();
});

onMounted(() => {
  loadStaffData();
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

.members-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.member-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.member-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.member-name {
  margin: 0 0 32px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
}

.member-details {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.member-photo {
  width: 250px;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.member-info {
  flex: 1;
}

.member-description {
  color: #2d3748;
  line-height: 1.7;
}

.member-description :deep(p) {
  margin: 0 0 20px 0;
  font-size: 16px;
  line-height: 1.7;
  color: #4a5568;
}

.member-description :deep(p:last-child) {
  margin-bottom: 0;
}

.member-description :deep(h1),
.member-description :deep(h2),
.member-description :deep(h3),
.member-description :deep(h4),
.member-description :deep(h5),
.member-description :deep(h6) {
  margin: 0 0 16px 0;
  font-weight: 600;
  color: #1a202c;
  line-height: 1.3;
}

.member-description :deep(h1) { font-size: 28px; }
.member-description :deep(h2) { font-size: 24px; }
.member-description :deep(h3) { font-size: 22px; }
.member-description :deep(h4) { font-size: 20px; }
.member-description :deep(h5) { font-size: 18px; }
.member-description :deep(h6) { font-size: 16px; }

.member-description :deep(ul),
.member-description :deep(ol) {
  margin: 0 0 20px 0;
  padding-left: 24px;
}

.member-description :deep(li) {
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 1.7;
  color: #4a5568;
}

.member-description :deep(blockquote) {
  margin: 0 0 20px 0;
  padding: 16px 20px;
  border-left: 4px solid #2c5282;
  background: #f0f7ff;
  border-radius: 4px;
  font-style: italic;
  color: #2d3748;
}

.member-description :deep(pre) {
  margin: 0 0 20px 0;
  padding: 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow-x: auto;
}

.member-description :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #2c5282;
  background: #f7fafc;
  padding: 2px 6px;
  border-radius: 3px;
}

.member-description :deep(a) {
  color: #2c5282;
  text-decoration: none;
  transition: color 0.2s ease;
  border-bottom: 1px solid transparent;
}

.member-description :deep(a:hover) {
  color: #2a4a7a;
  border-bottom-color: #2a4a7a;
}

.member-description :deep(strong),
.member-description :deep(b) {
  font-weight: 600;
  color: #1a202c;
}

.member-description :deep(em),
.member-description :deep(i) {
  font-style: italic;
  color: #2d3748;
}

.member-description :deep(u) {
  text-decoration: underline;
  text-decoration-color: #2c5282;
}

.member-description :deep(s),
.member-description :deep(del) {
  text-decoration: line-through;
  opacity: 0.7;
  color: #718096;
}

.member-contacts {
  display: flex;
  gap: 24px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 200px;
}

.contact-item:hover {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.contact-item span {
  font-size: 15px;
  color: #2d3748;
  font-weight: 500;
}

.contact-item b {
  color: #1a202c;
  font-weight: 600;
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
  .member-details {
    gap: 32px;
  }
}

@media (max-width: 992px) {
  .member-details {
    flex-direction: column;
    gap: 24px;
  }

  .member-photo {
    width: 100%;
    max-width: 300px;
    height: auto;
    max-height: 400px;
    margin: 0 auto;
  }

  .member-name {
    font-size: 28px;
    text-align: center;
  }

  .member-contacts {
    justify-content: center;
  }

  .contact-item {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .members-list {
    gap: 32px;
  }

  .member-item {
    padding: 32px 24px;
  }
  
  .member-name {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .member-photo {
    max-width: 250px;
    max-height: 320px;
  }
  
  .member-description :deep(p) {
    font-size: 15px;
  }
  
  .member-contacts {
    flex-direction: column;
    gap: 12px;
  }

  .contact-item {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 576px) {
  .page-content {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .members-list {
    gap: 24px;
  }

  .member-item {
    padding: 24px 20px;
  }

  .member-name {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .member-photo {
    max-width: 200px;
    max-height: 260px;
  }

  .member-description :deep(p) {
    font-size: 14px;
  }

  .member-description :deep(h1) { font-size: 24px; }
  .member-description :deep(h2) { font-size: 22px; }
  .member-description :deep(h3) { font-size: 20px; }
  .member-description :deep(h4) { font-size: 18px; }
  .member-description :deep(h5) { font-size: 16px; }
  .member-description :deep(h6) { font-size: 15px; }

  .member-contacts {
    margin-top: 24px;
    padding-top: 20px;
  }

  .contact-item {
    padding: 10px 14px;
  }

  .contact-item span {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .member-item {
    padding: 20px 16px;
  }

  .member-name {
    font-size: 20px;
  }

  .member-photo {
    max-width: 180px;
    max-height: 240px;
  }
}
</style>
