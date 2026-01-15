// src/composables/usePageMeta.js
// Meta tags composable uchun reusable helper

import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function usePageMeta() {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()

  // Default image
  const defaultImage = 'https://ziyoliavlod.com/og_default.jpg'

  // Set page meta tags
  const setPageMeta = (config) => {
    const {
      title,
      description,
      keywords,
      image = defaultImage,
      url,
      type = 'website',
      author,
      datePublished,
      dateModified
    } = config

    const fullUrl = url || `https://ziyoliavlod.com${route.fullPath}`
    const fullTitle = title ? `${title} - Ziyoli Avlod` : 'Ziyoli Avlod'

    useHead({
      title: fullTitle,
      meta: [
        {
          name: 'description',
          content: description || 'Ziyoli Avlod - O\'zbekiston ilmiy jurnali'
        },
        {
          name: 'keywords',
          content: keywords || 'jurnal, ilmiy, akademik'
        },
        {
          name: 'og:title',
          property: 'og:title',
          content: fullTitle
        },
        {
          name: 'og:description',
          property: 'og:description',
          content: description || 'Ziyoli Avlod - O\'zbekiston ilmiy jurnali'
        },
        {
          name: 'og:image',
          property: 'og:image',
          content: image || defaultImage
        },
        {
          name: 'og:url',
          property: 'og:url',
          content: fullUrl
        },
        {
          name: 'og:type',
          property: 'og:type',
          content: type
        },
        {
          name: 'og:locale',
          property: 'og:locale',
          content: getOGLocale(locale.value)
        },
        {
          name: 'twitter:card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          property: 'twitter:title',
          content: fullTitle
        },
        {
          name: 'twitter:description',
          property: 'twitter:description',
          content: description || 'Ziyoli Avlod - O\'zbekiston ilmiy jurnali'
        },
        {
          name: 'twitter:image',
          property: 'twitter:image',
          content: image || defaultImage
        }
      ]
    })

    // Add article-specific meta tags if datePublished exists
    if (datePublished) {
      useHead({
        meta: [
          {
            name: 'article:published_time',
            property: 'article:published_time',
            content: datePublished
          },
          {
            name: 'article:modified_time',
            property: 'article:modified_time',
            content: dateModified || datePublished
          },
          {
            name: 'article:author',
            property: 'article:author',
            content: author || 'Ziyoli Avlod'
          }
        ]
      })
    }
  }

  // Helper function to convert locale to OG locale format
  const getOGLocale = (lang) => {
    const localeMap = {
      uz: 'uz_UZ',
      en: 'en_US',
      ru: 'ru_RU'
    }
    return localeMap[lang] || 'uz_UZ'
  }

  // Set canonical URL
  const setCanonical = (url) => {
    useHead({
      link: [
        {
          rel: 'canonical',
          href: url || `https://ziyoliavlod.com${route.fullPath}`
        }
      ]
    })
  }

  return {
    setPageMeta,
    setCanonical,
    defaultImage
  }
}
