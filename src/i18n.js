// src/i18n.js
import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

const i18n = createI18n({
  // Standart (default) til
  locale: localStorage.getItem('locale') || 'uz',
  // Agar tarjima topilmasa, ishlatiladigan til
  fallbackLocale: 'uz',
  // Barcha tarjimalar
  messages: {
    uz,
    ru,
    en
  },
  // Konsoldagi ogohlantirishlarni o'chirish
  legacy: false,
  globalInjection: true
})

export default i18n