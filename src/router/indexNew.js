import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

/**
 * Router configuration with language-based routing
 * Routes follow the pattern: /[language]/[path]
 * Example: /uz/post/1, /en/post/1, /ru/post/1
 */

const routes = [
  {
    path: '/',
    redirect: '/uz' // Default redirect to Uzbek
  },
  
  // Language-prefixed root routes
  {
    path: '/:language(uz|en|ru)',
    component: { template: '<RouterView />' },
    meta: { requiresLanguage: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView,
        meta: { 
          title: 'home',
          requiresLanguage: true 
        }
      },
      {
        path: 'post/:id',
        name: 'Post',
        component: () => import('../pages/Post.vue'),
        meta: { 
          title: 'post',
          requiresLanguage: true 
        }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../pages/About.vue'),
        meta: { 
          title: 'about',
          requiresLanguage: true 
        }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('../pages/Contact.vue'),
        meta: { 
          title: 'contact',
          requiresLanguage: true 
        }
      }
    ]
  },
  
  // Catch-all 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position if available, otherwise scroll to top
    return savedPosition || { top: 0 }
  }
})

/**
 * Navigation guard to validate language parameter
 * Ensures the language parameter matches one of the supported languages
 */
router.beforeEach((to, from, next) => {
  const supportedLanguages = ['uz', 'en', 'ru']
  const language = to.params.language
  
  // If route requires language parameter and it's not valid, redirect to default
  if (to.meta.requiresLanguage && language && !supportedLanguages.includes(language)) {
    next('/')
    return
  }
  
  next()
})

export default router
