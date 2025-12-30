<template>
  <section class="contact-faq-section">
    <div class="container">
      <div class="content-wrapper">
        <div class="faq-wrapper">
          <div class="faq-header">
            <h2 class="faq-title">{{ $t('faq.title') }}</h2>
            <p class="faq-subtitle">{{ $t('contact_faq.faq_subtitle') }}</p>
          </div>
          <div class="faq-container">
            <div v-if="loading" class="faq-loading">
              <div class="loading-spinner"></div>
              <p>{{ $t('contact_faq.loading_questions') }}</p>
            </div>
            <div v-else-if="error" class="faq-error">
              <p>{{ $t('contact_faq.error_occurred') }}: {{ error }}</p>
              <button @click="loadLatestFaqs" class="retry-btn">{{ $t('contact_faq.retry') }}</button>
            </div>
            <div v-else-if="faqs.length === 0" class="no-faqs">
              <p>{{ $t('contact_faq.no_questions') }}</p>
            </div>
            <div v-else class="faq-items">
              <div v-for="(faq, index) in faqs" :key="faq.id" 
                   class="faq-item" 
                   :class="{ 'active': openFaqIndex === index }"
                   @click="toggleFaq(index)">
                <div class="faq-question-wrapper">
                  <span class="faq-index">{{ index + 1 }}</span>
                  <h3 class="faq-question">{{ faq.question }}</h3>
                  <div class="faq-toggle">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div class="faq-answer-wrapper" :class="{ 'open': openFaqIndex === index }">
                  <div class="faq-answer" v-html="faq.htmlAnswer || faq.answer"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="faq-footer">
            <RouterLink :to="getLocalizedPath('/faq')" class="faq-link">{{ $t('contact_faq.view_all_questions') }} →</RouterLink>
          </div>
        </div>

        <div class="contact-wrapper">
          <div class="contact-header">
            <h2 class="contact-title">{{ $t('contact.title') }}</h2>
            <p class="contact-subtitle">{{ $t('contact.description') }}</p>
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
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const openFaqIndex = ref(0);

const toggleFaq = (index) => {
  if (openFaqIndex.value === index) {
    openFaqIndex.value = null;
  } else {
    openFaqIndex.value = index;
  }
};

const { t } = useI18n();

const { loading, error, fetchData, currentLocale } = useApi();
const { getLocalizedPath } = useLocalizedRoute();
const faqs = ref([]);

const loadLatestFaqs = async () => {
  try {
    const response = await fetchData('/tez-tez-beriladigan-savollars', { 
      'pagination[pageSize]': 3,
      'sort[0]': 'publishedAt:desc'
    });
    
    if (response.data) {
      faqs.value = response.data.map(faq => ({
        id: faq.id,
        question: faq.Savol,
        answer: getPlainText(faq.Javob),
        htmlAnswer: parseRichText(faq.Javob)
      }));
    }
  } catch (err) {
    console.error('Latest FAQs yuklanmadi:', err);
  }
};

watch(currentLocale, () => {
  loadLatestFaqs();
});

onMounted(() => {
  loadLatestFaqs();
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

const { API_BASE_URL } = useApi();

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
.contact-faq-section {
  padding: 80px 0;
  padding-top: 0;
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
}

.faq-wrapper,
.contact-wrapper {
  background: #ffffff;
}

.faq-header,
.contact-header {
  margin-bottom: 32px;
}

.faq-title,
.contact-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.faq-subtitle,
.contact-subtitle {
  font-size: 15px;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.faq-container {
  margin-bottom: 24px;
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
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
  box-shadow: 0 2px 8px rgba(44, 82, 130, 0.1);
}

.faq-question-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.faq-index {
  font-size: 14px;
  font-weight: 600;
  color: #2c5282;
  background: #e6f2ff;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  flex-shrink: 0;
}

.faq-question {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.5;
}

.faq-toggle {
  color: #718096;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.faq-item.active .faq-toggle {
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
  margin-top: 16px;
}

.faq-answer-wrapper > * {
  min-height: 0;
  overflow: hidden;
}

.faq-answer {
  font-size: 14px;
  line-height: 1.7;
  color: #4a5568;
  padding-left: 44px;
}

.faq-answer p {
  margin: 0 0 12px 0;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

.faq-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.faq-link {
  color: #2c5282;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.faq-link:hover {
  color: #2a4a7a;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.faq-loading,
.faq-error,
.no-faqs {
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

.faq-loading p,
.faq-error p,
.no-faqs p {
  margin: 0;
  font-size: 15px;
  color: #718096;
}

.faq-error p {
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
  .content-wrapper {
    gap: 50px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .faq-title,
  .contact-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .contact-faq-section {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .content-wrapper {
    gap: 32px;
  }

  .faq-title,
  .contact-title {
    font-size: 24px;
  }

  .faq-subtitle,
  .contact-subtitle {
    font-size: 14px;
  }

  .faq-item {
    padding: 18px;
  }

  .faq-question {
    font-size: 15px;
  }
}

@media (max-width: 576px) {
  .contact-faq-section {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .content-wrapper {
    gap: 28px;
  }

  .faq-header,
  .contact-header {
    margin-bottom: 24px;
  }

  .faq-title,
  .contact-title {
    font-size: 22px;
  }

  .faq-subtitle,
  .contact-subtitle {
    font-size: 13px;
  }

  .faq-item {
    padding: 16px;
  }

  .faq-question {
    font-size: 14px;
  }

  .faq-answer {
    padding-left: 0;
    font-size: 13px;
  }

  .faq-index {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .form-field {
    padding: 12px 14px;
    font-size: 14px;
  }

  .submit-button {
    padding: 12px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .faq-title,
  .contact-title {
    font-size: 20px;
  }

  .faq-item {
    padding: 14px;
  }

  .form-field {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
