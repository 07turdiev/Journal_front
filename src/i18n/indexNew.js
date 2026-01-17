import { createI18n } from 'vue-i18n'

/**
 * Internationalization (i18n) configuration
 * Supports: Uzbek (uz), English (en), Russian (ru)
 */

// Define available languages
const languages = {
  uz: 'Ўзбек',
  en: 'English',
  ru: 'Русский'
}

// Translation messages for each language
const messages = {
  uz: {
    appTitle: 'Қўл Халал',
    home: 'Асосий',
    post: 'Мақола',
    about: 'Ҳақимизда',
    contact: 'Алоқа',
    notFound: 'Саҳифа топилмади',
    readMore: 'Кўпроқ ўқиш',
    publishedOn: 'Эълон қилинди:',
    author: 'Муаллиф:',
    
    // Home page content
    homeTitle: 'Добро пожаловать',
    homeDescription: 'Ўзбек тилида онлайн журнал',
    
    // Meta tags
    siteTitle: 'Қўл Халал - Онлайн Журнал',
    siteDescription: 'Ўзбек тилида эслатма, мўлоқосулар ва сўзширалар.',
  },
  en: {
    appTitle: 'Journal Front',
    home: 'Home',
    post: 'Post',
    about: 'About',
    contact: 'Contact',
    notFound: 'Page Not Found',
    readMore: 'Read More',
    publishedOn: 'Published on:',
    author: 'Author:',
    
    // Home page content
    homeTitle: 'Welcome',
    homeDescription: 'Online journal in English',
    
    // Meta tags
    siteTitle: 'Journal Front - Online Magazine',
    siteDescription: 'English online journal with articles, news, and more.',
  },
  ru: {
    appTitle: 'Журнал',
    home: 'Главная',
    post: 'Статья',
    about: 'О нас',
    contact: 'Контакты',
    notFound: 'Страница не найдена',
    readMore: 'Читать далее',
    publishedOn: 'Опубликовано:',
    author: 'Автор:',
    
    // Home page content
    homeTitle: 'Добро пожаловать',
    homeDescription: 'Онлайн журнал на русском языке',
    
    // Meta tags
    siteTitle: 'Журнал - Онлайн Издание',
    siteDescription: 'Русский онлайн журнал со статьями, новостями и многим другим.',
  }
}

/**
 * Create and configure i18n instance
 * - locale: Default language (can be changed dynamically)
 * - fallbackLocale: Fallback language if translation is missing
 * - messages: Translation strings for each language
 * - legacy: false for Composition API compatibility
 */
const i18n = createI18n({
  legacy: false,
  locale: 'uz', // Default language
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

export default i18n
export { languages, messages }
