// src/composables/useDynamicSeoMeta.js
// Global SEO meta handling with API integration, language detection, and reactive updates

import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from './usePageMeta'
import { useApi } from './useApi'

export function useDynamicSeoMeta(options = {}) {
  const {
    endpoint = null,
    fallbackKey = null,
    data = null,
    useApiData = true
  } = options

  const route = useRoute()
  const { locale, t } = useI18n()
  const { setPageMeta, setCanonical } = usePageMeta()
  const { fetchData } = useApi()

  const apiData = ref(data)

  // Extract language-specific value from API response
  const getLocalizedValue = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    if (typeof obj === 'object' && locale.value in obj) {
      return obj[locale.value]
    }
    return ''
  }

  // Apply meta tags from API data or i18n fallback
  const applyMetaTags = () => {
    let title = ''
    let description = ''
    let keywords = ''
    let image = ''
    let author = 'Ziyoli Avlod'
    let datePublished = null
    let dateModified = null
    let type = 'website'

    // Try to use API data first if available
    if (apiData.value && useApiData) {
      // Handle different API field names
      title = getLocalizedValue(apiData.value.title) || 
              getLocalizedValue(apiData.value.Mavzu) ||
              getLocalizedValue(apiData.value.Nomi) ||
              apiData.value.name ||
              apiData.value.nomi ||
              ''
      
      description = getLocalizedValue(apiData.value.description) || 
                   getLocalizedValue(apiData.value.abstract) ||
                   getLocalizedValue(apiData.value.Text) ||
                   getLocalizedValue(apiData.value.tavsifi) ||
                   ''
      
      keywords = getLocalizedValue(apiData.value.keywords) || 
                getLocalizedValue(apiData.value.Kalit_Sözlər) ||
                ''
      
      image = apiData.value.image || 
              apiData.value.cover?.src ||
              apiData.value.Rasmi ||
              apiData.value.muqova?.url ||
              ''
      
      author = apiData.value.author?.name || 
               getLocalizedValue(apiData.value.author) ||
               apiData.value.mualliflar?.name ||
               apiData.value.mualliflars?.[0]?.name ||
               'Ziyoli Avlod'
      
      datePublished = apiData.value.datePublished || 
                     apiData.value.date ||
                     apiData.value.Sana ||
                     apiData.value.createdAt ||
                     null
      
      dateModified = apiData.value.dateModified || 
                    apiData.value.updatedAt ||
                    datePublished

      type = apiData.value.type || 'article'
    }

    // Fallback to i18n if no API data or required fields missing
    if (!title && fallbackKey) {
      title = t(`${fallbackKey}.title`) || ''
    }
    if (!description && fallbackKey) {
      description = t(`${fallbackKey}.description`) || ''
    }
    if (!keywords && fallbackKey) {
      keywords = t(`${fallbackKey}.keywords`) || ''
    }
    if (!image && fallbackKey) {
      image = t(`${fallbackKey}.image`) || ''
    }

    // Set the page meta
    setPageMeta({
      title,
      description,
      keywords,
      image,
      url: `https://ziyoliavlod.com${route.fullPath}`,
      type,
      author,
      datePublished,
      dateModified
    })

    // Set canonical URL
    setCanonical(`https://ziyoliavlod.com${route.fullPath}`)
  }

  // Update API data when passed as prop/option changes
  const updateData = (newData) => {
    apiData.value = newData
    applyMetaTags()
  }

  // Watch for language changes and update meta tags
  watch(
    () => locale.value,
    () => {
      applyMetaTags()
    }
  )

  // Watch for route changes and fetch new data if endpoint provided
  watch(
    () => route.fullPath,
    () => {
      if (endpoint) {
        fetchSeoData()
      } else {
        applyMetaTags()
      }
    }
  )

  // Watch for data changes if data is passed as option
  watch(
    () => data,
    (newData) => {
      if (newData) {
        updateData(newData)
      }
    },
    { deep: true }
  )

  // Initial setup
  onMounted(() => {
    if (apiData.value && useApiData) {
      applyMetaTags()
    } else if (endpoint) {
      fetchSeoData()
    } else if (fallbackKey) {
      applyMetaTags()
    }
  })

  return {
    apiData,
    updateData,
    applyMetaTags
  }
}
