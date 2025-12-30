import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const SUPPORTED_LOCALES = ['uz', 'en', 'ru']
const DEFAULT_LOCALE = 'uz'

export function useLocalizedRoute() {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()

  const currentLocale = computed(() => {
    const pathParts = route.path.split('/').filter(Boolean)
    const firstPart = pathParts[0]
    if (SUPPORTED_LOCALES.includes(firstPart)) {
      return firstPart
    }
    return locale.value || DEFAULT_LOCALE
  })

  const getLocalizedPath = (path, targetLocale = null) => {
    const target = targetLocale || currentLocale.value || DEFAULT_LOCALE
    
    if (!path || path === '/') {
      return `/${target}`
    }
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const pathParts = cleanPath.split('/').filter(Boolean)
    
    if (SUPPORTED_LOCALES.includes(pathParts[0])) {
      pathParts[0] = target
    } else {
      pathParts.unshift(target)
    }
    
    return `/${pathParts.join('/')}`
  }

  const navigateToLocalized = (path, targetLocale = null) => {
    const localizedPath = getLocalizedPath(path, targetLocale)
    router.push(localizedPath)
  }

  const getCurrentPathWithoutLocale = () => {
    const pathParts = route.path.split('/').filter(Boolean)
    if (SUPPORTED_LOCALES.includes(pathParts[0])) {
      pathParts.shift()
    }
    return pathParts.length > 0 ? `/${pathParts.join('/')}` : '/'
  }

  return {
    currentLocale,
    getLocalizedPath,
    navigateToLocalized,
    getCurrentPathWithoutLocale
  }
}

