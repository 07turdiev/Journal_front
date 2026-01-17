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
    useApiData = true
  } = options

  const route = useRoute()
  const { locale, t } = useI18n()
  const { setPageMeta, setCanonical } = usePageMeta()
  const { fetchData } = useApi()

  const apiData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Extract language-specific value from API response
  const getLocalizedValue = (obj) => {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    if (typeof obj === 'object' && locale.value in obj) {
      return obj[locale.value]
    }
    return ''
  }

  // Fetch data from API endpoint
  const fetchSeoData = async () => {
    if (!endpoint) return

    loading.value = true
    error.value = null

    try {
      const data = await fetchData(endpoint)
      apiData.value = data
      applyMetaTags()
    } catch (err) {
      error.value = err.message
      // Fallback to i18n if API fails
      if (fallbackKey) {
        applyMetaTags()
      }
    } finally {
      loading.value = false
    }
  }

  // Apply meta tags from API data or i18n fallback
  const applyMetaTags = () => {
    let title = ''
    let description = ''
    let keywords = ''
    let image = ''

    if (apiData.value && useApiData) {
      // Extract from API data with language-specific fields
      title = getLocalizedValue(apiData.value.title) || getLocalizedValue(apiData.value.Mavzu)
      description = getLocalizedValue(apiData.value.description) || 
                   getLocalizedValue(apiData.value.abstract) ||
                   ''
      keywords = getLocalizedValue(apiData.value.keywords) || ''
      image = apiData.value.image || apiData.value.cover || ''
    }

    // Fallback to i18n if no API data or fields missing
    if (!title && fallbackKey) {
      title = t(`${fallbackKey}.title`) || ''
    }
    if (!description && fallbackKey) {
      description = t(`${fallbackKey}.description`) || ''
    }
    if (!keywords && fallbackKey) {
      keywords = t(`${fallbackKey}.keywords`) || ''
    }

    // Get additional metadata
    const author = apiData.value?.author?.name || 
                   getLocalizedValue(apiData.value?.author) ||
                   'Ziyoli Avlod'
    
    const datePublished = apiData.value?.datePublished || 
                         apiData.value?.date ||
                         apiData.value?.createdAt ||
                         null
    
    const dateModified = apiData.value?.dateModified || 
                        apiData.value?.updatedAt ||
                        datePublished

    const type = apiData.value?.type || 'website'

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

  // Watch for language changes and update meta tags
  watch(
    () => locale.value,
    () => {
      applyMetaTags()
    }
  )

  // Watch for route changes and fetch new data
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

  // Initial setup
  onMounted(() => {
    if (endpoint) {
      fetchSeoData()
    } else if (fallbackKey) {
      applyMetaTags()
    }
  })

  return {
    apiData,
    loading,
    error,
    fetchSeoData,
    applyMetaTags
  }
}
