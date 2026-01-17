// src/composables/useDynamicSeoMeta.js
// Global SEO meta handling with API data integration, language detection, and reactive updates

import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from './usePageMeta'

export function useDynamicSeoMeta(apiDataRef = null, fallbackKey = null) {
  const route = useRoute()
  const { locale, t } = useI18n()
  const { setPageMeta, setCanonical } = usePageMeta()

  // Get localized value from API response fields
  const getLocalizedValue = (field) => {
    if (!field) return ''
    
    // If it's a string, return it directly
    if (typeof field === 'string') return field
    
    // If it's an object with locale keys
    if (typeof field === 'object' && locale.value in field) {
      return field[locale.value]
    }
    
    return ''
  }

  // Apply meta tags from API data or i18n fallback
  const applyMetaTags = () => {
    let title = ''
    let description = ''
    let keywords = ''
    let image = ''

    // Try to extract from API data first
    if (apiDataRef && apiDataRef.value) {
      const data = apiDataRef.value
      
      // Try different possible field names for title
      title = getLocalizedValue(data.title) || 
              getLocalizedValue(data.Nomi) ||
              getLocalizedValue(data.Mavzu) ||
              data.title ||
              data.Nomi ||
              data.Mavzu ||
              ''
      
      // Try different possible field names for description
      description = getLocalizedValue(data.description) || 
                   getLocalizedValue(data.abstract) ||
                   getLocalizedValue(data.Text) ||
                   data.description ||
                   data.abstract ||
                   data.Text ||
                   ''
      
      // Try different possible field names for keywords
      keywords = getLocalizedValue(data.keywords) || 
                data.keywords ||
                ''
      
      // Try different possible field names for image
      image = data.image || 
              data.Rasmi ||
              data.cover ||
              data.imageUrl ||
              ''
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

    // Get additional metadata from API data if available
    const author = apiDataRef?.value?.author?.name || 
                   getLocalizedValue(apiDataRef?.value?.author) ||
                   'Ziyoli Avlod'
    
    const datePublished = apiDataRef?.value?.datePublished || 
                         apiDataRef?.value?.date ||
                         apiDataRef?.value?.Sana ||
                         apiDataRef?.value?.createdAt ||
                         null
    
    const dateModified = apiDataRef?.value?.dateModified || 
                        apiDataRef?.value?.updatedAt ||
                        datePublished

    const type = apiDataRef?.value?.type || 'article'

    // Set the page meta
    // Set page meta tags
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

  // Watch API data for changes and update meta tags
  if (apiDataRef) {
    watch(
      () => apiDataRef.value,
      () => {
        applyMetaTags()
      },
      { deep: true }
    )
  }

  // Watch for language changes and update meta tags
  watch(
    () => locale.value,
    () => {
      applyMetaTags()
    }
  )

  // Watch for route changes and update meta tags
  watch(
    () => route.fullPath,
    () => {
      applyMetaTags()
    }
  )

  // Initial setup - apply meta tags immediately
  applyMetaTags()

  return {
    applyMetaTags
  }
}
