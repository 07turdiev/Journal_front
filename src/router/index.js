import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import i18n from '../i18n'

const SUPPORTED_LOCALES = ['uz', 'en', 'ru']
const DEFAULT_LOCALE = 'uz'

function createLocalizedRoutes() {
  const routes = []

  const routeDefinitions = [
    { path: '', name: 'home', component: HomeView },
    { path: 'about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: 'Jurnal haqida', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Jurnal tahririyati' }, { text: 'Jurnal haqida' }] } },
    { path: 'editorial-board', name: 'editorial-board', component: () => import('../views/EditorialBoardView.vue'), meta: { title: 'Tahrir Hay\'ati', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Jurnal tahririyati' }, { text: 'Tahrir Hay\'ati' }] } },
    { path: 'staff', name: 'staff', component: () => import('../views/StaffView.vue'), meta: { title: 'Tahririyat Xodimlari', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Jurnal tahririyati' }, { text: 'Tahririyat Xodimlari' }] } },
    { path: 'partners', name: 'partners', component: () => import('../views/PartnersView.vue'), meta: { title: 'Hamkorlar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Jurnal tahririyati' }, { text: 'Hamkorlar' }] } },
    { path: 'news', name: 'news', component: () => import('../views/NewsView.vue'), meta: { title: 'Yangiliklar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Yangiliklar' }] } },
    { path: 'announcements', name: 'announcements', component: () => import('../views/AnnouncementsView.vue'), meta: { title: 'E\'lonlar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'E\'lonlar' }] } },
    { path: 'events', name: 'events', component: () => import('../views/EventsView.vue'), meta: { title: 'Tadbirlar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Tadbirlar' }] } },
    { path: 'news/:slug', name: 'news-detail', component: () => import('../views/NewsDetailView.vue'), meta: { title: 'Yangiliklar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Yangiliklar', to: '/news' }] } },
    { path: 'announcements/:slug', name: 'announcement-detail', component: () => import('../views/AnnouncementDetailView.vue'), meta: { title: 'E\'lonlar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'E\'lonlar', to: '/announcements' }] } },
    { path: 'events/:slug', name: 'event-detail', component: () => import('../views/EventDetailView.vue'), meta: { title: 'Tadbirlar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Tadbirlar', to: '/events' }] } },
    { path: 'submit-article', name: 'submit-article', component: () => import('../views/SubmitArticleView.vue'), meta: { title: 'Maqola Yuborish', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Mualliflarga' }, { text: 'Maqola yuborish' }] } },
    { path: 'author-guide', name: 'author-guide', component: () => import('../views/AuthorGuideView.vue'), meta: { title: 'Mualliflar uchun qo‘llanma', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Mualliflarga' }, { text: 'Mualliflar uchun qo‘llanma' }] } },
    { path: 'issues', name: 'issues', component: () => import('../views/IssuesView.vue'), meta: { title: 'Maqolalar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Maqolalar' }] } },
    { path: 'issues/:slug', name: 'issue-article-detail', component: () => import('../views/IssueArticleDetailView.vue'), meta: { title: 'Maqola', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Maqolalar', to: '/issues' }] } },
    { path: 'archive', redirect: (to) => {
      const locale = to.path.split('/')[1] || 'uz';
      return `/${locale}/issues`;
    }},
    { path: 'contact', name: 'contact', component: () => import('../views/ContactView.vue'), meta: { title: 'Aloqa', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Aloqa' }] } },
    { path: 'faq', name: 'faq', component: () => import('../views/FaqView.vue'), meta: { title: 'Tez-tez eriladigan savollar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Aloqa' }, { text: 'Tez-tez beriladigan savollar' }] } },
    { path: 'authors', name: 'authors', component: () => import('../views/AuthorsView.vue'), meta: { title: 'Mualliflar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Mualliflar' }] } },
    { path: 'author/:slug', name: 'author-detail', component: () => import('../views/AuthorDetailView.vue'), meta: { title: 'Muallif', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Mualliflar', to: '/authors' }] } },
    { path: 'projects', name: 'projects', component: () => import('../views/ProjectsView.vue'), meta: { title: 'Ijodiy tanlovlar', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Ijodiy tanlovlar' }] } },
    { path: 'projects/:slug', name: 'project-detail', component: () => import('../views/ProjectDetailView.vue'), meta: { title: 'Ijodiy tanlovi', breadcrumbs: [{ text: 'Bosh sahifa', to: '/' }, { text: 'Ijodiy tanlovlar', to: '/projects' }] } },
    { path: 'archive/:id', redirect: (to) => {
      const locale = to.path.split('/')[1] || 'uz';
      return `/${locale}/issues`;
    }}
  ]

  SUPPORTED_LOCALES.forEach(locale => {
    routeDefinitions.forEach(routeDef => {
      const fullPath = routeDef.path === ''
        ? `/${locale}`
        : `/${locale}/${routeDef.path}`

      routes.push({
        path: fullPath,
        name: `${routeDef.name}-${locale}`,
        component: routeDef.component,
        meta: routeDef.meta
      })
    })
    // localized catch-all -> show localized 404 under same layout
    routes.push({
      path: `/${locale}/:pathMatch(.*)*`,
      name: `not-found-${locale}`,
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: 'Sahifa topilmadi',
        breadcrumbs: [
          { text: 'Bosh sahifa', to: '/' },
          { text: 'Sahifa topilmadi' }
        ]
      }
    })
  })

  return routes
}

const routes = [
  ...createLocalizedRoutes(),
  {
    path: '/',
    redirect: () => {
      const savedLocale = localStorage.getItem('locale') || DEFAULT_LOCALE
      return `/${savedLocale}`
    }
  },
  {
    // Global catch-all: redirect non-localized paths to the saved locale so
    // the localized not-found route renders within the normal layout (header/footer)
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      const parts = to.path.split('/').filter(Boolean)
      const savedLocale = localStorage.getItem('locale') || DEFAULT_LOCALE
      if (parts.length && SUPPORTED_LOCALES.includes(parts[0])) {
        // already a localized path; keep as-is
        return to.path
      }
      return `/${savedLocale}${to.path}`
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  routes
})

router.beforeEach((to, from, next) => {
  const path = to.path

  if (path === '/' || path === '') {
    const savedLocale = localStorage.getItem('locale') || DEFAULT_LOCALE
    i18n.global.locale.value = savedLocale
    return next(`/${savedLocale}`)
  }

  const pathParts = path.split('/').filter(Boolean)
  const firstPart = pathParts[0]

  if (SUPPORTED_LOCALES.includes(firstPart)) {
    // set the locale when a localized path is visited
    i18n.global.locale.value = firstPart
    localStorage.setItem('locale', firstPart)
    return next()
  }

  // For any non-localized path, redirect to the saved/default locale so the
  // localized routes (including the localized 404) handle rendering.
  const savedLocale = localStorage.getItem('locale') || DEFAULT_LOCALE
  i18n.global.locale.value = savedLocale
  return next(`/${savedLocale}${path}`)
})

export default router
