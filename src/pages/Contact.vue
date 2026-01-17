<template>
  <div class="contact-container">
    <header class="contact-header">
      <h1>{{ pageTitle }}</h1>
      <p class="lead">{{ pageDescription }}</p>
    </header>

    <form class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">{{ $t('name') || 'Name' }}</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Your name"
        />
      </div>

      <div class="form-group">
        <label for="email">{{ $t('email') || 'Email' }}</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="your@email.com"
        />
      </div>

      <div class="form-group">
        <label for="message">{{ $t('message') || 'Message' }}</label>
        <textarea
          id="message"
          v-model="form.message"
          required
          placeholder="Your message..."
          rows="5"
        ></textarea>
      </div>

      <button type="submit" class="submit-btn">
        {{ $t('send') || 'Send' }}
      </button>

      <div v-if="submitMessage" :class="['submit-message', submitStatus]">
        {{ submitMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useSeoMeta } from '../composables/useSeoMeta'

const route = useRoute()
const currentLanguage = computed(() => route.params.language || 'uz')

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitMessage = ref('')
const submitStatus = ref('')

const pageTitle = computed(() => {
  const titles = {
    uz: 'Алоқа',
    en: 'Contact Us',
    ru: 'Свяжитесь с нами'
  }
  return titles[currentLanguage.value] || 'Contact'
})

const pageDescription = computed(() => {
  const descriptions = {
    uz: 'Биз билан боғланиш ўчун форма тўлдиринг',
    en: 'Get in touch with us by filling out the form below',
    ru: 'Свяжитесь с нами, заполнив форму ниже'
  }
  return descriptions[currentLanguage.value] || ''
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  image: 'https://via.placeholder.com/1200x630?text=Contact',
  currentLanguage: currentLanguage,
  url: computed(() => window.location.href),
  type: 'website'
})

const handleSubmit = async () => {
  try {
    // Simulate form submission
    submitMessage.value = 'Сообщение отправлено успешно!'
    submitStatus.value = 'success'
    
    setTimeout(() => {
      form.name = ''
      form.email = ''
      form.message = ''
      submitMessage.value = ''
    }, 3000)
  } catch (error) {
    submitMessage.value = 'Ошибка при отправке'
    submitStatus.value = 'error'
  }
}
</script>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.contact-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-header h1 {
  font-size: 2rem;
  color: #222;
  margin-bottom: 0.5rem;
}

.lead {
  color: #666;
  margin: 0;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #764ba2;
}

.submit-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.submit-message.success {
  background: #d4edda;
  color: #155724;
}

.submit-message.error {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .contact-container {
    padding: 1rem;
  }

  .contact-form {
    padding: 1.5rem;
  }
}
</style>
