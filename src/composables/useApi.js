import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Environment variable'lar yordamida base URL'larni olish
const getBaseUrls = () => {
  // Environment variable'dan olish, agar yo'q bo'lsa default qiymatlar
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337'
  
  return {
    API_BASE_URL: `${baseUrl}/api`,
    STRAPI_BASE_URL: baseUrl
  }
}

const { API_BASE_URL, STRAPI_BASE_URL } = getBaseUrls()

// Console'da qaysi environment ishlatilayotganini ko'rsatish
console.log(`🌍 Environment: ${import.meta.env.MODE}`)
console.log(`🔗 API Base URL: ${API_BASE_URL}`)
console.log(`🖼️ Strapi Base URL: ${STRAPI_BASE_URL}`)

// Locale mapping - frontend locale'ni Strapi locale'ga o'tkazish
const LOCALE_MAPPING = {
  'uz': 'uz',
  'ru': 'ru', 
  'en': 'en'
}

export function useApi() {
  const { locale } = useI18n()
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const { populate, skipLocale, ...filters } = options
      
      const params = new URLSearchParams()
      
      if (!skipLocale) {
        const strapiLocale = LOCALE_MAPPING[locale.value] || 'uz'
        params.append('locale', strapiLocale)
      }
      
      if (populate) {
        if (Array.isArray(populate)) {
          populate.forEach((field, index) => {
            params.append(`populate[${index}]`, field)
          })
        } else if (typeof populate === 'string' && populate.includes(',')) {
          populate.split(',').forEach((field, index) => {
            params.append(`populate[${index}]`, field.trim())
          })
        } else {
          params.append('populate', populate)
        }
      }
      
      Object.keys(filters).forEach(key => {
        params.append(key, filters[key])
      })
      
      console.log(`API Request: ${endpoint}`)
      console.log(`Query params:`, Object.fromEntries(params))
      
      const response = await fetch(`${API_BASE_URL}${endpoint}?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Locale o'zgarishini kuzatish
  const currentLocale = computed(() => LOCALE_MAPPING[locale.value] || 'uz')

  // Rasm URL'ini olish uchun helper funksiya
  const getImageUrl = (imageData) => {
    if (!imageData) return 'https://placehold.co/600x400?text=Rasm'
    
    // Strapi'da rasm URL'i relative bo'lishi mumkin
    return imageData.url.startsWith('http') ? imageData.url : `${STRAPI_BASE_URL}${imageData.url}`
  }

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    currentLocale,
    fetchData,
    getImageUrl,
    API_BASE_URL
  }
}
