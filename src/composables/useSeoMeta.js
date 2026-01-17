import { useHead } from '@vueuse/head'
import { computed } from 'vue'

/**
 * Composable for managing SEO meta tags
 * Integrates with @vueuse/head to dynamically set meta tags based on:
 * - Current language
 * - API data (title, description, image)
 * - Dynamic route changes
 * 
 * @param {Object} options - Configuration object
 * @param {string|Ref} options.title - Page title (localized)
 * @param {string|Ref} options.description - Page description (localized)
 * @param {string|Ref} options.image - Image URL for OG/Twitter cards
 * @param {string|Ref} options.currentLanguage - Current language code (uz|en|ru)
 * @param {string} options.url - Full URL of the page (optional)
 * @param {string} options.type - OpenGraph type (default: 'website')
 * @returns {void}
 * 
 * @example
 * const { t } = useI18n()
 * useSeoMeta({
 *   title: computed(() => postData.value.title[currentLanguage.value]),
 *   description: computed(() => postData.value.description[currentLanguage.value]),
 *   image: computed(() => postData.value.image),
 *   currentLanguage: currentLanguage,
 *   url: 'https://example.com/post/1'
 * })
 */
export const useSeoMeta = (options) => {
  const {
    title,
    description,
    image = 'https://via.placeholder.com/1200x630',
    currentLanguage = 'en',
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website',
    author = '',
    keywords = ''
  } = options

  /**
   * Build OpenGraph meta tags
   * These are used by social media platforms to create rich previews
   */
  const getOpenGraphTags = () => {
    const tags = [
      // OpenGraph Protocol tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      
      // Language-specific OpenGraph tags
      { property: 'og:locale', content: getLocaleCode(currentLanguage) },
      
      // Fallback locales for language variants
      { property: 'og:locale:alternate', content: 'uz_UZ' },
      { property: 'og:locale:alternate', content: 'en_US' },
      { property: 'og:locale:alternate', content: 'ru_RU' }
    ]
    
    return tags
  }

  /**
   * Build Twitter Card meta tags
   * These provide rich previews when links are shared on Twitter/X
   */
  const getTwitterCardTags = () => {
    return [
      // Twitter Card protocol tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:creator', content: author || '@journal' }
    ]
  }

  /**
   * Build standard meta tags
   * These are basic HTML meta tags for SEO and accessibility
   */
  const getStandardMetaTags = () => {
    const tags = [
      { name: 'description', content: description },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'charset', content: 'UTF-8' }
    ]
    
    // Add language attribute
    if (currentLanguage) {
      tags.push({ 'http-equiv': 'content-language', content: getLanguageCode(currentLanguage) })
    }
    
    // Add keywords if provided
    if (keywords) {
      tags.push({ name: 'keywords', content: keywords })
    }
    
    // Add author if provided
    if (author) {
      tags.push({ name: 'author', content: author })
    }
    
    return tags
  }

  /**
   * Convert language code to full locale code
   * uz -> uz_UZ, en -> en_US, ru -> ru_RU
   * @param {string} lang - Language code
   * @returns {string} Full locale code
   */
  const getLocaleCode = (lang) => {
    const localeMap = {
      uz: 'uz_UZ',
      en: 'en_US',
      ru: 'ru_RU'
    }
    return localeMap[lang] || lang
  }

  /**
   * Convert language code to HTML lang attribute
   * uz -> uz, en -> en, ru -> ru
   * @param {string} lang - Language code
   * @returns {string} HTML lang code
   */
  const getLanguageCode = (lang) => {
    return lang || 'en'
  }

  /**
   * Compile all meta tags and apply with @vueuse/head
   * This function is automatically called when any dependency changes
   */
  const compiledHead = computed(() => {
    const meta = [
      ...getStandardMetaTags(),
      ...getOpenGraphTags(),
      ...getTwitterCardTags()
    ]
    
    return {
      title: title,
      meta: meta,
      htmlAttrs: {
        lang: getLanguageCode(currentLanguage)
      },
      link: [
        // Alternate language links for multi-language sites (for SEO)
        {
          rel: 'alternate',
          hrefLang: 'uz',
          href: url.replace(/\/(uz|en|ru)\//, '/uz/')
        },
        {
          rel: 'alternate',
          hrefLang: 'en',
          href: url.replace(/\/(uz|en|ru)\//, '/en/')
        },
        {
          rel: 'alternate',
          hrefLang: 'ru',
          href: url.replace(/\/(uz|en|ru)\//, '/ru/')
        },
        {
          rel: 'canonical',
          href: url
        }
      ]
    }
  })

  /**
   * Apply the compiled head configuration
   * This updates the document head dynamically
   */
  useHead(compiledHead)
}

/**
 * Alternative version for simple use cases
 * Accepts pre-processed title and description strings
 */
export const useSimpleSeoMeta = ({ title, description, image, currentLanguage }) => {
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:locale', content: getLocaleCodeSimple(currentLanguage) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ],
    htmlAttrs: {
      lang: currentLanguage || 'en'
    }
  })
}

const getLocaleCodeSimple = (lang) => {
  const localeMap = {
    uz: 'uz_UZ',
    en: 'en_US',
    ru: 'ru_RU'
  }
  return localeMap[lang] || lang
}

export default useSeoMeta
