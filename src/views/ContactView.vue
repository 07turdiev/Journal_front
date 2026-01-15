<template>
    <main>
        <PageBanner :title="$t('contact.title')" />
        <div class="page-content">
            <div class="container">
        <div class="content-wrapper">
          <div class="contact-info-wrapper">
            <div class="contact-header">
              <h2 class="contact-title">{{ $t('contact.title') }}</h2>
              <p class="contact-subtitle">{{ $t('contact.description') }}</p>
            </div>
            <div class="contact-details-section">
                            <div v-if="loading" class="contact-loading">
                                <div class="loading-spinner"></div>
                <p>{{ $t('footer.loading_data') }}</p>
                            </div>
                            <div v-else-if="error" class="contact-error">
                <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
                <button @click="loadContactData" class="retry-btn">{{ $t('footer.retry') }}</button>
                            </div>
                            <template v-else-if="contactData">
                                <div class="contact-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.192 14.904L15.36 13.488C14.816 13.208 14.152 13.368 13.76 13.76L12.16 15.36C9.568 14.216 7.216 11.864 6.072 9.272L7.672 7.672C8.064 7.28 8.224 6.616 7.944 6.072L6.528 3.24C6.152 2.528 5.272 2.168 4.52 2.384L2.2 3.128C1.52 3.32 1 3.928 1 4.648C1 12.92 7.504 19.424 15.776 19.424C16.496 19.424 17.104 18.9 17.296 18.224L18.04 15.904C18.256 15.152 17.896 14.272 18.192 14.904Z" fill="#2c5282" />
                                    </svg>
                                    <a :href="`tel:${contactData.Telefon}`">{{ contactData.Telefon }}</a>
                                </div>
                                <div class="contact-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4H2C1.448 4 1 4.448 1 5V15C1 15.552 1.448 16 2 16H18C18.552 16 19 15.552 19 15V5C19 4.448 18.552 4 18 4ZM17.6 5L10 9.8L2.4 5H17.6ZM2 15V6.2L10 11.2L18 6.2V15H2Z" fill="#2c5282" />
                                    </svg>
                                    <a :href="`mailto:${contactData.email}`">{{ contactData.email }}</a>
                                </div>
                                <div class="social-icons" v-if="hasSocialLinks">
                  <a v-if="contactData.Telegram && contactData.Telegram.trim()" :href="contactData.Telegram" target="_blank" rel="noopener noreferrer" class="social-link" title="Telegram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM6.89 11.17L4.392 10.391C3.852 10.226 3.849 9.854 4.513 9.587L14.246 5.827C14.811 5.597 15.131 5.888 14.948 6.617L13.291 14.437C13.175 14.994 12.84 15.127 12.375 14.87L9.824 12.982L8.635 14.13C8.513 14.248 8.414 14.349 8.226 14.374C8.039 14.4 7.885 14.344 7.772 14.034L6.902 11.163L6.89 11.17Z" fill="#2c5282" />
                                        </svg>
                                    </a>
                  <a v-if="contactData.Instagram && contactData.Instagram.trim()" :href="contactData.Instagram.startsWith('http') ? contactData.Instagram : `https://${contactData.Instagram}`" target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5ZM16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75ZM10 2C7.526 2 7.122 2.007 5.971 2.058C5.187 2.095 4.661 2.2 4.173 2.39C3.739 2.558 3.426 2.759 3.093 3.093C2.78001 3.3954 2.53935 3.76458 2.389 4.173C2.199 4.663 2.094 5.188 2.058 5.971C2.006 7.075 2 7.461 2 10C2 12.474 2.007 12.878 2.058 14.029C2.095 14.812 2.2 15.339 2.389 15.826C2.559 16.261 2.759 16.574 3.091 16.906C3.428 17.242 3.741 17.443 4.171 17.609C4.665 17.8 5.191 17.906 5.971 17.942C7.075 17.994 7.461 18 10 18C12.474 18 12.878 17.993 14.029 17.942C14.811 17.905 15.338 17.8 15.826 17.611C16.259 17.442 16.574 17.241 16.906 16.909C17.243 16.572 17.444 16.259 17.61 15.829C17.8 15.336 17.906 14.809 17.942 14.029C17.994 12.925 18 12.539 18 10C18 7.526 17.993 7.122 17.942 5.971C17.905 5.189 17.8 4.661 17.61 4.173C17.4593 3.765 17.2191 3.39596 16.907 3.093C16.6047 2.77985 16.2355 2.53917 15.827 2.389C15.337 2.199 14.811 2.094 14.029 2.058C12.925 2.006 12.539 2 10 2ZM10 0C12.717 0 13.056 0.00999994 14.122 0.0599999C15.187 0.11 15.912 0.277 16.55 0.525C17.21 0.779 17.766 1.123 18.322 1.678C18.8305 2.1779 19.224 2.78259 19.475 3.45C19.722 4.087 19.89 4.813 19.94 5.878C19.987 6.944 20 7.283 20 10C20 12.717 19.99 13.056 19.94 14.122C19.89 15.187 19.722 15.912 19.475 16.55C19.2247 17.2178 18.8311 17.8226 18.322 18.322C17.822 18.8303 17.2173 19.2238 16.55 19.475C15.913 19.722 15.187 19.89 14.122 19.94C13.056 19.987 12.717 20 10 20C7.283 20 6.944 19.99 5.878 19.94C4.813 19.89 4.088 19.722 3.45 19.475C2.78233 19.2245 2.17753 18.8309 1.678 18.322C1.16941 17.8222 0.775931 17.2175 0.525 16.55C0.277 15.913 0.11 15.187 0.0599999 14.122C0.0129999 13.056 0 12.717 0 10C0 7.283 0.00999994 6.944 0.0599999 5.878C0.11 4.812 0.277 4.088 0.525 3.45C0.775236 2.78218 1.1688 2.17732 1.678 1.678C2.17767 1.16923 2.78243 0.775729 3.45 0.525C4.088 0.277 4.812 0.11 5.878 0.0599999C6.944 0.0129999 7.283 0 10 0Z" fill="#2c5282" />
                                        </svg>
                                    </a>
                  <a v-if="contactData.Facebook && contactData.Facebook.trim()" :href="contactData.Facebook.startsWith('http') ? contactData.Facebook : `https://${contactData.Facebook}`" target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M11 17.938C13.0173 17.6813 14.8611 16.6661 16.1568 15.0988C17.4525 13.5314 18.1027 11.5295 17.9754 9.49997C17.848 7.47041 16.9527 5.56549 15.4713 4.17238C13.9898 2.77927 12.0336 2.00252 10 2C7.96396 1.99848 6.00395 2.77334 4.51934 4.16668C3.03473 5.56002 2.13724 7.46699 2.00974 9.49904C1.88225 11.5311 2.53434 13.5353 3.83314 15.1033C5.13195 16.6712 6.97974 17.685 9 17.938V12H7V10H9V8.346C9 7.009 9.14 6.524 9.4 6.035C9.65611 5.55119 10.052 5.15569 10.536 4.9C10.918 4.695 11.393 4.572 12.223 4.519C12.552 4.498 12.978 4.524 13.501 4.599V6.499H13C12.083 6.499 11.704 6.542 11.478 6.663C11.3431 6.73236 11.2334 6.84215 11.164 6.977C11.044 7.203 11 7.427 11 8.345V10H13.5L13 12H11V17.938ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20Z" fill="#2c5282" />
                                        </svg>
                                    </a>
                  <a v-if="contactData.Twitter && contactData.Twitter.trim()" :href="contactData.Twitter.startsWith('http') ? contactData.Twitter : `https://${contactData.Twitter}`" target="_blank" rel="noopener noreferrer" class="social-link" title="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" fill="#2c5282" />
                                        </svg>
                                    </a>
                  <a v-if="contactData.Youtube && contactData.Youtube.trim()" :href="contactData.Youtube" target="_blank" rel="noopener noreferrer" class="social-link" title="YouTube">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                      <path d="M17.606 2.995C17.53 2.697 17.314 2.472 17.067 2.403C16.63 2.28 14.5 2 10 2C5.5 2 3.372 2.28 2.931 2.403C2.687 2.471 2.471 2.696 2.394 2.995C2.285 3.419 2 5.196 2 8C2 10.804 2.285 12.58 2.394 13.006C2.47 13.303 2.686 13.528 2.932 13.596C3.372 13.72 5.5 14 10 14C14.5 14 16.629 13.72 17.069 13.597C17.313 13.529 17.529 13.304 17.606 13.005C17.715 12.581 18 10.8 18 8C18 5.2 17.715 3.42 17.606 2.995ZM19.543 2.498C20 4.28 20 8 20 8C20 8 20 11.72 19.543 13.502C19.289 14.487 18.546 15.262 17.605 15.524C15.896 16 10 16 10 16C10 16 4.107 16 2.395 15.524C1.45 15.258 0.708 14.484 0.457 13.502C2.98023e-08 11.72 0 8 0 8C0 8 2.98023e-08 4.28 0.457 2.498C0.711 1.513 1.454 0.738 2.395 0.476C4.107 -1.78814e-07 10 0 10 0C10 0 15.896 -1.78814e-07 17.605 0.476C18.55 0.742 19.292 1.516 19.543 2.498ZM8 11.5V4.5L14 8L8 11.5Z" fill="#2c5282" />
                                        </svg>
                                    </a>
                                </div>
                            </template>
                            <template v-else>
                                <div class="contact-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.192 14.904L15.36 13.488C14.816 13.208 14.152 13.368 13.76 13.76L12.16 15.36C9.568 14.216 7.216 11.864 6.072 9.272L7.672 7.672C8.064 7.28 8.224 6.616 7.944 6.072L6.528 3.24C6.152 2.528 5.272 2.168 4.52 2.384L2.2 3.128C1.52 3.32 1 3.928 1 4.648C1 12.92 7.504 19.424 15.776 19.424C16.496 19.424 17.104 18.9 17.296 18.224L18.04 15.904C18.256 15.152 17.896 14.272 18.192 14.904Z" fill="#2c5282" />
                                    </svg>
                  <a href="tel:+998909999999">{{ $t('footer.phone') }}</a>
                                </div>
                                <div class="contact-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4H2C1.448 4 1 4.448 1 5V15C1 15.552 1.448 16 2 16H18C18.552 16 19 15.552 19 15V5C19 4.448 18.552 4 18 4ZM17.6 5L10 9.8L2.4 5H17.6ZM2 15V6.2L10 11.2L18 6.2V15H2Z" fill="#2c5282" />
                                    </svg>
                  <a href="mailto:elbekturdiyev20020707@gmail.com">{{ $t('footer.email') }}</a>
                                </div>
                            </template>
                        </div>
          </div>

          <div class="contact-form-wrapper">
            <div class="contact-header">
              <h2 class="contact-title">{{ $t('contact.form_title') }}</h2>
                    </div>
                    <form class="contact-form" @submit="handleSubmit">
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="fullName"
                  @input="sanitizeName"
                  :placeholder="$t('contact.name_placeholder')"
                  autocomplete="name"
                  inputmode="text"
                  required
                  pattern="^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ''\-\s]+$"
                  class="form-field"
                >
              </div>
              <div class="input-wrapper">
                <input
                  type="tel"
                  v-model="phone"
                  @input="formatPhone"
                  :placeholder="$t('contact.phone_placeholder')"
                  inputmode="numeric"
                  :maxlength="16"
                  required
                  pattern="^\+998\s\d{2}\s\d{3}\s\d{4}$"
                  class="form-field"
                >
              </div>
              <div class="input-wrapper">
                <textarea
                  v-model="message"
                  :placeholder="$t('contact.message_placeholder')"
                  required
                  :minlength="20"
                  class="form-field textarea-field"
                  rows="6"
                ></textarea>
                        </div>
              <button type="submit" class="submit-button" :disabled="!isFormValid || isSubmitting">
                            <span v-if="!isSubmitting">{{ $t('contact.send_message') }}</span>
                <span v-else>{{ $t('contact_faq.submitting') }}</span>
                <svg v-if="!isSubmitting" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9H15M15 9L10.5 4.5M15 9L10.5 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div v-else class="loading-spinner-small"></div>
                        </button>
              <div v-if="submitSuccess" class="alert-message success">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                <span>{{ $t('contact_faq.success_message') }}</span>
                        </div>
              <div v-if="submitError" class="alert-message error">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 6V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 12H9.0075" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>{{ submitError }}</span>
                        </div>
                    </form>
          </div>
                </div>

                <div class="note-banner">
                    <div class="note-content">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3.33331L3.33337 33.3333H36.6667L20 3.33331Z" stroke="#FEC335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 23.3333V16.6666" stroke="#FEC335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 30H20.0167" stroke="#FEC335" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p>{{ $t('contact.note_text') }}</p>
                    </div>
                    <RouterLink :to="getLocalizedPath('/faq')" class="btn-note">{{ $t('contact.faq_link') }}</RouterLink>
                </div>

        <div class="map-section">
          <h3 class="map-title">{{ $t('footer.address') }}</h3>
          <div class="map-container">
            <div v-if="loading" class="map-loading">
              <div class="loading-spinner"></div>
              <p>{{ $t('footer.map_loading') }}</p>
            </div>
            <div v-else-if="error" class="map-error">
              <p>{{ $t('footer.map_error') }}</p>
            </div>
            <div v-else-if="contactData && contactData.google_maps" 
                 v-html="contactData.google_maps" 
                 class="google-map-wrapper">
            </div>
            <div v-else class="map-placeholder">
              <p>{{ $t('footer.map_not_available') }}</p>
            </div>
          </div>
        </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';
import PageBanner from '@/components/PageBanner.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const route = useRoute();
const { t } = useI18n();
const { setPageMeta, setCanonical } = usePageMeta();

onMounted(() => {
  setPageMeta({
    title: t('contact.title') || 'Aloqa',
    description: t('contact.description') || 'Ziyoli Avlod jurnali bilan aloqa qilish. Email, telefon va ijtimoiy tarmoq havolalari.',
    keywords: t('contact.keywords') || 'aloqa, kontakt, email, telefon'
  });
  setCanonical(`https://ziyoliavlod.com${route.fullPath}`);
  loadContactData();
});

const phone = ref('');
const PHONE_REGEX = /^\+998\s\d{2}\s\d{3}\s\d{4}$/;
const isPhoneValid = computed(() => PHONE_REGEX.test(phone.value));

const formatPhone = (event) => {
    const digits = (event.target.value || '').replace(/\D/g, '');
    let trimmed = digits.startsWith('998') ? digits.slice(3) : digits;
    let parts = [];
    if (trimmed.length > 0) {
        const p1 = trimmed.slice(0, 2);
        parts.push(p1);
    }
    if (trimmed.length > 2) {
        const p2 = trimmed.slice(2, 5);
        parts.push(p2);
    }
    if (trimmed.length > 5) {
        const p3 = trimmed.slice(5, 9);
        parts.push(p3);
    }
    const joined = parts.join(' ').trim();
    const formatted = joined.length ? `+998 ${joined}` : '+998 ';
  phone.value = formatted.slice(0, 16);
};

const fullName = ref('');
const NAME_REGEX = /^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ'’\-\s]+$/;
const sanitizeName = (event) => {
    const raw = event.target.value || '';
  const cleaned = raw.replace(/[^A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ'’\-\s]/g, '');
    fullName.value = cleaned;
};

const message = ref('');
const isNameValid = computed(() => fullName.value.length > 0 && NAME_REGEX.test(fullName.value));
const isMessageValid = computed(() => (message.value || '').trim().length >= 20);
const isFormValid = computed(() => isNameValid.value && isPhoneValid.value && isMessageValid.value);

const { API_BASE_URL, loading, error, fetchData, currentLocale } = useApi();
const { getLocalizedPath } = useLocalizedRoute();

const contactData = ref(null);

const hasSocialLinks = computed(() => {
    if (!contactData.value) return false;
    return !!(contactData.value.Telegram?.trim() ||
        contactData.value.Instagram?.trim() ||
        contactData.value.Facebook?.trim() ||
        contactData.value.Twitter?.trim() ||
        contactData.value.Youtube?.trim());
});

const loadContactData = async () => {
    try {
        const response = await fetchData('/aloqa');
        if (response.data) {
            contactData.value = response.data;
        }
    } catch (err) {
        console.error('Contact data yuklanmadi:', err);
    }
};

watch(currentLocale, () => {
    loadContactData();
});

onMounted(() => {
    loadContactData();
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid.value) {
        return;
    }

    isSubmitting.value = true;
    submitError.value = '';
    submitSuccess.value = false;

    try {
        const richTextMessage = [
            {
                type: "paragraph",
                children: [
                    {
                        text: message.value.trim(),
                        type: "text"
                    }
                ]
            }
        ];

        const response = await fetch(`${API_BASE_URL}/murojaatlars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    Ismi: fullName.value.trim(),
                    Telefon: phone.value,
                    Murojaat_matni: richTextMessage
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Murojaat muvaffaqiyatli yuborildi:', result);

        submitSuccess.value = true;
        fullName.value = '';
        phone.value = '';
        message.value = '';

        setTimeout(() => {
            submitSuccess.value = false;
        }, 5000);

    } catch (err) {
        console.error('Murojaat yuborishda xatolik:', err);
        submitError.value = err.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
    } finally {
        isSubmitting.value = false;
    }
};
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
    margin-bottom: 40px;
}

.contact-info-wrapper,
.contact-form-wrapper {
  background: #ffffff;
}

.contact-header {
  margin-bottom: 32px;
}

.contact-title {
  font-size: 32px;
    font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.contact-subtitle {
  font-size: 15px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.contact-details-section {
    display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
    display: flex;
    align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.contact-item:hover {
  border-color: #cbd5e0;
  background: #edf2f7;
}

.contact-item a {
  color: #2d3748;
    text-decoration: none;
  font-size: 15px;
    font-weight: 500;
  transition: color 0.2s ease;
}

.contact-item a:hover {
  color: #2c5282;
}

.social-icons {
    display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  border-radius: 8px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
    text-decoration: none;
}

.social-link:hover {
  background: #2c5282;
  border-color: #2c5282;
}

.social-link:hover svg path {
    fill: #ffffff;
}

.contact-loading,
.contact-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  padding: 40px 20px;
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

.contact-loading p,
.contact-error p {
    margin: 0;
  font-size: 15px;
  color: #718096;
}

.contact-error p {
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

.contact-form {
    display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-wrapper {
  position: relative;
}

.form-field {
    width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  color: #1a202c;
  transition: all 0.2s ease;
    box-sizing: border-box;
}

.form-field::placeholder {
  color: #a0aec0;
}

.form-field:focus {
  outline: none;
  border-color: #2c5282;
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
}

.textarea-field {
    resize: vertical;
  min-height: 120px;
  font-family: 'Poppins', sans-serif;
}

.submit-button {
  display: flex;
    align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: #2c5282;
  color: #ffffff;
    border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
    cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.submit-button:hover:not(:disabled) {
  background: #2a4a7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 82, 130, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading-spinner-small {
    width: 16px;
    height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.alert-message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
  border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-message.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert-message.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-message svg {
    flex-shrink: 0;
}

.note-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0424B4;
  border-radius: 8px;
  padding: 32px 40px;
    flex-wrap: wrap;
    gap: 20px;
}

.note-content {
    display: flex;
    align-items: center;
  gap: 20px;
}

.note-content p {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #FEC335;
    line-height: 1.5;
    max-width: 630px;
}

.btn-note {
    border: 1px solid #FEC335;
    color: #EEB93E;
  border-radius: 8px;
  padding: 14px 28px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
    flex-shrink: 0;
  font-size: 15px;
}

.btn-note:hover {
    background-color: #FEC335;
    color: #0424B4;
  }

  .map-section {
    margin-top: 40px;
  }

  .map-title {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 24px 0;
    line-height: 1.2;
  }

  .map-container {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    background: #ffffff;
  }

  .google-map-wrapper {
    width: 100%;
    height: 450px;
    position: relative;
  }

  .google-map-wrapper :deep(iframe) {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .map-loading,
  .map-error,
  .map-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background: #f7fafc;
    min-height: 300px;
    border-radius: 8px;
  }

  .map-loading p,
  .map-error p,
  .map-placeholder p {
    margin: 16px 0 0 0;
    font-size: 15px;
    color: #718096;
  }

  .map-error p {
    color: #e53e3e;
  }

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .content-wrapper {
    gap: 50px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-title {
    font-size: 28px;
  }

  .map-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .content-wrapper {
    gap: 32px;
  }

  .contact-title {
    font-size: 24px;
    }

  .contact-subtitle {
    font-size: 14px;
  }

  .map-title {
    font-size: 24px;
    margin-bottom: 20px;
    }

  .google-map-wrapper {
    height: 350px;
    }

    .note-banner {
        justify-content: center;
        text-align: center;
    padding: 24px 20px;
    }

    .note-content {
        flex-direction: column;
        text-align: center;
    }
}

@media (max-width: 576px) {
  .page-content {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .content-wrapper {
    gap: 28px;
  }

  .contact-header {
    margin-bottom: 24px;
  }

  .contact-title {
    font-size: 22px;
  }

  .contact-subtitle {
    font-size: 13px;
  }

  .map-title {
    font-size: 22px;
    margin-bottom: 16px;
  }

  .google-map-wrapper {
    height: 300px;
  }

  .map-loading,
  .map-error,
  .map-placeholder {
    min-height: 250px;
    padding: 40px 16px;
  }

  .form-field {
    padding: 12px 14px;
    font-size: 14px;
  }

  .submit-button {
    padding: 12px 20px;
    font-size: 14px;
  }

  .note-banner {
    padding: 20px 16px;
  }

  .note-content p {
    font-size: 14px;
  }

  .btn-note {
    padding: 12px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .contact-title {
    font-size: 20px;
  }

  .map-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .google-map-wrapper {
    height: 250px;
  }

  .form-field {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
