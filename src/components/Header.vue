<template>
  <header class="site-header" @click.stop>
    <div class="container">
      <div class="header-inner">
        <div class="logo">
          <RouterLink :to="localizedRoutes.home"><img src="/assets/logo.svg" alt="Ziyoli Avlod Logo"></RouterLink>
        </div>

        <nav class="main-nav" :class="{ 'is-open': isMobileMenuOpen }">
          <ul>
            <li>
              <RouterLink :to="localizedRoutes.home">{{ $t('header.home') }}</RouterLink>
            </li>
            
            <li>
              <RouterLink :to="localizedRoutes.issues">{{ $t('dropdown.journal_issues') }}</RouterLink>
            </li>

            <li class="has-dropdown">
              <a href="#" @click.prevent="toggleDropdown('journal')">
                {{ $t('header.editorial_office') }}
                <svg class="dropdown-arrow" :class="{ 'is-open': openDropdown === 'journal' }" width="10" height="6"
                  viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </a>
              <ul class="dropdown-menu" v-if="openDropdown === 'journal'">
                <li>
                  <RouterLink :to="localizedRoutes.about">{{ $t('dropdown.about_journal') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.editorialBoard">{{ $t('dropdown.editorial_board') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.staff">{{ $t('dropdown.editorial_staff') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.partners">{{ $t('dropdown.partners') }}</RouterLink>
                </li>
              </ul>
            </li>

            <li class="has-dropdown">
              <a href="#" @click.prevent="toggleDropdown('news')">{{ $t('header.news') }} <svg class="dropdown-arrow"
                  :class="{ 'is-open': openDropdown === 'news' }" width="10" height="6" viewBox="0 0 10 6" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg></a>
              <ul class="dropdown-menu" v-if="openDropdown === 'news'">
                <li>
                  <RouterLink :to="localizedRoutes.news">{{ $t('dropdown.all_news') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.announcements">{{ $t('dropdown.announcements') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.events">{{ $t('dropdown.events') }}</RouterLink>
                </li>
              </ul>
            </li>

            <li class="has-dropdown">
              <a href="#" @click.prevent="toggleDropdown('authors')">{{ $t('header.for_authors') }}<svg
                  class="dropdown-arrow" :class="{ 'is-open': openDropdown === 'authors' }" width="10" height="6"
                  viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg></a>
              <ul class="dropdown-menu" v-if="openDropdown === 'authors'">
                <li>
                  <RouterLink :to="localizedRoutes.submitArticle">{{ $t('dropdown.submit_article') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.authorGuide">{{ $t('dropdown.author_guide') }}</RouterLink>
                </li>
                <li>
                  <RouterLink :to="localizedRoutes.faq">{{ $t('faq.title') }}</RouterLink>
                </li>
              </ul>
            </li>

            <li class="mobile-only">
              <RouterLink :to="localizedRoutes.contact" class="btn-contact-mobile">{{ $t('header.contact') }}</RouterLink>
            </li>
            
          </ul>
        </nav>

        <div class="header-actions">
          <RouterLink :to="localizedRoutes.contact" class="btn-contact desktop-only">{{ $t('header.contact') }}</RouterLink>
          <div class="lang-switcher has-dropdown">
            <a href="#" @click.prevent="toggleDropdown('lang')">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.25 9C17.25 13.8225 13.3225 17.25 9 17.25C4.6775 17.25 0.75 13.8225 0.75 9C0.75 4.1775 4.6775 0.75 9 0.75C13.3225 0.75 17.25 4.1775 17.25 9Z"
                  stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M0.75 9H17.25" stroke="white" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path
                  d="M9 0.75C11.071 3.424 12.0835 6.163 12.0835 9C12.0835 11.837 11.071 14.576 9 17.25C6.929 14.576 5.9165 11.837 5.9165 9C5.9165 6.163 6.929 3.424 9 0.75Z"
                  stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>{{ locale.toUpperCase() }}</span>
            </a>
            <ul class="dropdown-menu lang-dropdown" v-if="openDropdown === 'lang'">
              <li @click="changeLanguage('uz')"><a href="#">UZ</a></li>
              <li @click="changeLanguage('ru')"><a href="#">RU</a></li>
              <li @click="changeLanguage('en')"><a href="#">EN</a></li>
            </ul>
          </div>
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <svg v-if="!isMobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 6H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 18H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocalizedRoute } from '../composables/useLocalizedRoute';

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const { getLocalizedPath, getCurrentPathWithoutLocale } = useLocalizedRoute();

const isMobileMenuOpen = ref(false);
const openDropdown = ref(null);

const localizedRoutes = computed(() => ({
  home: getLocalizedPath('/'),
  about: getLocalizedPath('/about'),
  editorialBoard: getLocalizedPath('/editorial-board'),
  staff: getLocalizedPath('/staff'),
  partners: getLocalizedPath('/partners'),
  news: getLocalizedPath('/news'),
  announcements: getLocalizedPath('/announcements'),
  events: getLocalizedPath('/events'),
  submitArticle: getLocalizedPath('/submit-article'),
  authorGuide: getLocalizedPath('/author-guide'),
  faq: getLocalizedPath('/faq'),
  issues: getLocalizedPath('/issues'),
  contact: getLocalizedPath('/contact'),
  authors: getLocalizedPath('/authors')
}));

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('locale', lang);
  
  const currentPath = getCurrentPathWithoutLocale();
  const newPath = getLocalizedPath(currentPath, lang);
  
  router.push(newPath);
  closeDropdown();
};

const toggleMobileMenu = () => { 
  isMobileMenuOpen.value = !isMobileMenuOpen.value; 
  if (!isMobileMenuOpen.value) { 
    closeDropdown(); 
  } 
};

const toggleDropdown = (dropdownName) => { 
  openDropdown.value = openDropdown.value === dropdownName ? null : dropdownName; 
};

const closeDropdown = () => { 
  openDropdown.value = null; 
};

onMounted(() => { 
  window.addEventListener('click', closeDropdown); 
});

onUnmounted(() => { 
  window.removeEventListener('click', closeDropdown); 
});

watch(() => route.fullPath, () => { 
  isMobileMenuOpen.value = false; 
  closeDropdown(); 
});
</script>

<style scoped>
.site-header {
  background: rgb(44, 62, 80);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px 0;
  color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 60px;
  width: auto;
  filter: brightness(1.2) contrast(1.1);
  transition: transform 0.3s ease;
}


.mobile-only {
  display: none;
}

.main-nav>ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 35px;
}

.main-nav a,
.lang-switcher>a {
  color: #FFFFFF;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 15px;
  text-transform: none;
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  letter-spacing: 0.3px;
}

.main-nav a:hover,
.lang-switcher>a:hover {
  color: rgba(255, 255, 255, 0.9);
}

.main-nav>ul>li>a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.main-nav>ul>li>a:hover::after {
  width: 80%;
}

.router-link-exact-active:not(.btn-contact) {
  color: rgba(255, 255, 255, 0.95) !important;
}

.router-link-exact-active:not(.btn-contact)::after {
  width: 80% !important;
}

.has-dropdown {
  position: relative;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  margin-left: 4px;
}

.dropdown-arrow path {
  stroke: currentColor;
}

.dropdown-arrow.is-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #FFFFFF;
  list-style: none;
  padding: 8px;
  margin-top: 20px;
  width: max-content;
  min-width: 240px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: dropdownSlide 0.3s ease;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu li {
  display: block;
  width: 100%;
}

.dropdown-menu li a {
  font-weight: 500;
  font-size: 14px;
  color: rgb(44, 62, 80);
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
  border-radius: 8px;
  margin: 2px 0;
}

.dropdown-menu li a:hover,
.dropdown-menu li a.router-link-active {
  background: rgb(43, 74, 106);
  color: #FFFFFF;
  transform: translateX(5px);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
}

.btn-contact {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 10px 28px;
  color: #FFFFFF;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.btn-contact::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn-contact:hover {
  background: rgb(43, 74, 106);
  border-color: transparent;
  transform: translateY(-2px);
}

.btn-contact.router-link-active {
  background: rgb(43, 74, 106);
  border-color: transparent;
}

.lang-switcher {
  position: relative;
}

.lang-switcher>a {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.lang-switcher>a:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.lang-dropdown {
  min-width: 80px;
  width: auto;
  right: 0;
  left: auto;
}

.lang-dropdown li {
  cursor: pointer;
}

.mobile-menu-toggle {
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

@media (max-width: 991px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block;
  }

  .mobile-menu-toggle {
    display: block;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .mobile-menu-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  .main-nav {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgb(44, 62, 80);
    max-height: 0;
    overflow-y: auto;
    transition: max-height 0.5s ease-out;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .main-nav.is-open {
    max-height: calc(100vh - 100px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .main-nav>ul {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 15px;
    gap: 5px;
  }

  .main-nav li {
    width: 100%;
    text-align: left;
  }

  .main-nav li>a {
    padding: 15px 10px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
    color: #FFFFFF;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .main-nav li>a:hover {
    background: rgba(255, 255, 255, 0.1);
    padding-left: 20px;
  }
  
  .main-nav li>a.router-link-exact-active {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95) !important;
    border-left: 3px solid rgba(255, 255, 255, 0.8);
  }

  /* TUZATILGAN QISM */
  .dropdown-menu {
    position: static;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: none;
    width: 100%;
    margin: 10px 0;
    padding-left: 20px;
    box-sizing: border-box;
    border-radius: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .dropdown-menu li a {
    color: #FFFFFF;
    opacity: 0.9;
    padding: 12px 20px;
    font-weight: 400;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .dropdown-menu li a:hover,
  .dropdown-menu li a.router-link-active {
    background: rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
    opacity: 1;
    border-radius: 10px;
    transform: translateX(5px);
  }

  /* Language dropdown opens as an independent popup on mobile */
  .lang-dropdown {
    position: fixed;
    top: 80px;
    right: 15px;
    left: auto;
    width: auto;
    min-width: 100px;
    margin: 0;
    padding: 8px;
    background: #FFFFFF;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    z-index: 1100;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .lang-dropdown li a {
    color: rgb(44, 62, 80);
    font-weight: 500;
    padding: 10px 14px;
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .lang-dropdown li a:hover,
  .lang-dropdown li a.router-link-active {
    background: rgb(43, 74, 106);
    color: #FFFFFF;
    transform: translateX(3px);
  }

  .btn-contact-mobile {
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
    padding: 15px 10px;
    color: #FFFFFF;
    border-radius: 10px;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  .btn-contact-mobile:hover {
    background: rgba(255, 255, 255, 0.1);
    padding-left: 20px;
  }
  
  .btn-contact-mobile.router-link-exact-active {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95) !important;
    border-left: 3px solid rgba(255, 255, 255, 0.8);
  }
}
</style>