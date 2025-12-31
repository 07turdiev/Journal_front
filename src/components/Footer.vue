<template>
  <footer class="site-footer">
    <div class="container">

      <div class="footer-main">
        <div class="footer-column footer-social">
          <h3 class="column-title">{{ $t('footer.social_networks') }}</h3>
          <div v-if="loading" class="footer-loading">
            <div class="loading-spinner"></div>
            <p>{{ $t('footer.loading_data') }}</p>
          </div>
          <div v-else-if="error" class="footer-error">
            <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
            <button @click="loadContactData" class="retry-btn">{{ $t('footer.retry') }}</button>
          </div>
          <div v-else-if="contactData && hasSocialLinks" class="social-media">
              <a v-if="contactData.Telegram && contactData.Telegram.trim()" 
                 :href="contactData.Telegram" target="_blank" rel="noopener noreferrer" 
                 class="social-link" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM6.89 11.17L4.392 10.391C3.852 10.226 3.849 9.854 4.513 9.587L14.246 5.827C14.811 5.597 15.131 5.888 14.948 6.617L13.291 14.437C13.175 14.994 12.84 15.127 12.375 14.87L9.824 12.982L8.635 14.13C8.513 14.248 8.414 14.349 8.226 14.374C8.039 14.4 7.885 14.344 7.772 14.034L6.902 11.163L6.89 11.17Z" fill="white" />
                </svg>
              </a>
              <a v-if="contactData.Instagram && contactData.Instagram.trim()" 
                 :href="contactData.Instagram.startsWith('http') ? contactData.Instagram : `https://${contactData.Instagram}`" 
                 target="_blank" rel="noopener noreferrer" class="social-link" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5ZM16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75ZM10 2C7.526 2 7.122 2.007 5.971 2.058C5.187 2.095 4.661 2.2 4.173 2.39C3.739 2.558 3.426 2.759 3.093 3.093C2.78001 3.3954 2.53935 3.76458 2.389 4.173C2.199 4.663 2.094 5.188 2.058 5.971C2.006 7.075 2 7.461 2 10C2 12.474 2.007 12.878 2.058 14.029C2.095 14.812 2.2 15.339 2.389 15.826C2.559 16.261 2.759 16.574 3.091 16.906C3.428 17.242 3.741 17.443 4.171 17.609C4.665 17.8 5.191 17.906 5.971 17.942C7.075 17.994 7.461 18 10 18C12.474 18 12.878 17.993 14.029 17.942C14.811 17.905 15.338 17.8 15.826 17.611C16.259 17.442 16.574 17.241 16.906 16.909C17.243 16.572 17.444 16.259 17.61 15.829C17.8 15.336 17.906 14.809 17.942 14.029C17.994 12.925 18 12.539 18 10C18 7.526 17.993 7.122 17.942 5.971C17.905 5.189 17.8 4.661 17.61 4.173C17.4593 3.765 17.2191 3.39596 16.907 3.093C16.6047 2.77985 16.2355 2.53917 15.827 2.389C15.337 2.199 14.811 2.094 14.029 2.058C12.925 2.006 12.539 2 10 2ZM10 0C12.717 0 13.056 0.00999994 14.122 0.0599999C15.187 0.11 15.912 0.277 16.55 0.525C17.21 0.779 17.766 1.123 18.322 1.678C18.8305 2.1779 19.224 2.78259 19.475 3.45C19.722 4.087 19.89 4.813 19.94 5.878C19.987 6.944 20 7.283 20 10C20 12.717 19.99 13.056 19.94 14.122C19.89 15.187 19.722 15.912 19.475 16.55C19.2247 17.2178 18.8311 17.8226 18.322 18.322C17.822 18.8303 17.2173 19.2238 16.55 19.475C15.913 19.722 15.187 19.89 14.122 19.94C13.056 19.987 12.717 20 10 20C7.283 20 6.944 19.99 5.878 19.94C4.813 19.89 4.088 19.722 3.45 19.475C2.78233 19.2245 2.17753 18.8309 1.678 18.322C1.16941 17.8222 0.775931 17.2175 0.525 16.55C0.277 15.913 0.11 15.187 0.0599999 14.122C0.0129999 13.056 0 12.717 0 10C0 7.283 0.00999994 6.944 0.0599999 5.878C0.11 4.812 0.277 4.088 0.525 3.45C0.775236 2.78218 1.1688 2.17732 1.678 1.678C2.17767 1.16923 2.78243 0.775729 3.45 0.525C4.088 0.277 4.812 0.11 5.878 0.0599999C6.944 0.0129999 7.283 0 10 0Z" fill="white" />
                </svg>
              </a>
              <a v-if="contactData.Facebook && contactData.Facebook.trim()" 
                 :href="contactData.Facebook.startsWith('http') ? contactData.Facebook : `https://${contactData.Facebook}`" 
                 target="_blank" rel="noopener noreferrer" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M11 17.938C13.0173 17.6813 14.8611 16.6661 16.1568 15.0988C17.4525 13.5314 18.1027 11.5295 17.9754 9.49997C17.848 7.47041 16.9527 5.56549 15.4713 4.17238C13.9898 2.77927 12.0336 2.00252 10 2C7.96396 1.99848 6.00395 2.77334 4.51934 4.16668C3.03473 5.56002 2.13724 7.46699 2.00974 9.49904C1.88225 11.5311 2.53434 13.5353 3.83314 15.1033C5.13195 16.6712 6.97974 17.685 9 17.938V12H7V10H9V8.346C9 7.009 9.14 6.524 9.4 6.035C9.65611 5.55119 10.052 5.15569 10.536 4.9C10.918 4.695 11.393 4.572 12.223 4.519C12.552 4.498 12.978 4.524 13.501 4.599V6.499H13C12.083 6.499 11.704 6.542 11.478 6.663C11.3431 6.73236 11.2334 6.84215 11.164 6.977C11.044 7.203 11 7.427 11 8.345V10H13.5L13 12H11V17.938ZM10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20Z" fill="white" />
                </svg>
              </a>
              <a v-if="contactData.Twitter && contactData.Twitter.trim()" 
                 :href="contactData.Twitter.startsWith('http') ? contactData.Twitter : `https://${contactData.Twitter}`" 
                 target="_blank" rel="noopener noreferrer" class="social-link" title="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" fill="white" />
                </svg>
              </a>
              <a v-if="contactData.Youtube && contactData.Youtube.trim()" 
                 :href="contactData.Youtube" target="_blank" rel="noopener noreferrer" 
                 class="social-link" title="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M17.606 2.995C17.53 2.697 17.314 2.472 17.067 2.403C16.63 2.28 14.5 2 10 2C5.5 2 3.372 2.28 2.931 2.403C2.687 2.471 2.471 2.696 2.394 2.995C2.285 3.419 2 5.196 2 8C2 10.804 2.285 12.58 2.394 13.006C2.47 13.303 2.686 13.528 2.932 13.596C3.372 13.72 5.5 14 10 14C14.5 14 16.629 13.72 17.069 13.597C17.313 13.529 17.529 13.304 17.606 13.005C17.715 12.581 18 10.8 18 8C18 5.2 17.715 3.42 17.606 2.995ZM19.543 2.498C20 4.28 20 8 20 8C20 8 20 11.72 19.543 13.502C19.289 14.487 18.546 15.262 17.605 15.524C15.896 16 10 16 10 16C10 16 4.107 16 2.395 15.524C1.45 15.258 0.708 14.484 0.457 13.502C2.98023e-08 11.72 0 8 0 8C0 8 2.98023e-08 4.28 0.457 2.498C0.711 1.513 1.454 0.738 2.395 0.476C4.107 -1.78814e-07 10 0 10 0C10 0 15.896 -1.78814e-07 17.605 0.476C18.55 0.742 19.292 1.516 19.543 2.498ZM8 11.5V4.5L14 8L8 11.5Z" fill="white" />
                </svg>
              </a>
            </div>
          <div v-else class="social-media">
            <p class="no-social">{{ $t('footer.no_social_links') }}</p>
          </div>
        </div>

        <div class="footer-column footer-menu">
          <h3 class="column-title">{{ $t('footer.menu') }}</h3>
          <ul class="footer-menu-list">
            <li>
              <RouterLink :to="getLocalizedPath('/about')">{{ $t('footer.about_journal') }}</RouterLink>
            </li>
            <li>
              <RouterLink :to="getLocalizedPath('/author-guide')">{{ $t('footer.author_guide') }}</RouterLink>
            </li>
            <li>
              <RouterLink :to="getLocalizedPath('/issues')">{{ $t('footer.journal_issues') }}</RouterLink>
            </li>
            <li>
              <RouterLink :to="getLocalizedPath('/archive')">{{ $t('footer.archive_issues') }}</RouterLink>
            </li>
            <li>
              <RouterLink :to="getLocalizedPath('/partners')">{{ $t('footer.partners') }}</RouterLink>
            </li>
            <li>
              <RouterLink :to="getLocalizedPath('/contact')">{{ $t('footer.contact') }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="footer-column footer-map">
          <h3 class="column-title">{{ $t('footer.address') }}</h3>
          <div class="map-container">
            <div v-if="loading" class="map-loading">
              <div class="loading-spinner"></div>
              <p>{{ $t('footer.map_loading') }}</p>
            </div>
            <div v-else-if="error" class="map-error">
              <p>{{ $t('footer.map_error') }}</p>
            </div>
            <div v-else-if="contactData && contactData.google_maps" 
                 v-html="contactData.google_maps" 
                 class="google-map-wrapper">
        </div>
            <div v-else class="map-placeholder">
              <p>{{ $t('footer.map_not_available') }}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>{{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const { t } = useI18n();

// API integration
const { loading, error, fetchData, currentLocale } = useApi();
const { getLocalizedPath } = useLocalizedRoute();

// Contact data
const contactData = ref(null);

// Check if there are any social links available
const hasSocialLinks = computed(() => {
  if (!contactData.value) return false;
  return !!(contactData.value.Telegram?.trim() || 
           contactData.value.Instagram?.trim() || 
           contactData.value.Facebook?.trim() || 
           contactData.value.Twitter?.trim() || 
           contactData.value.Youtube?.trim());
});

// Load contact data from API
const loadContactData = async () => {
  try {
    const response = await fetchData('/aloqa');
    if (response.data) {
      // Sanitize google_maps HTML so backend can't force width/height
      const data = { ...response.data };
      if (data.google_maps && typeof window !== 'undefined') {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.google_maps, 'text/html');
          const embeds = doc.querySelectorAll('iframe, embed, object, video');
          embeds.forEach((el) => {
            // Remove size attributes that prevent responsiveness
            el.removeAttribute('width');
            el.removeAttribute('height');

            // Normalize and remove any inline style properties that include width/height (e.g. max-width)
            const style = el.getAttribute('style');
            if (style) {
              const newStyle = style
                .split(';')
                .map(s => s.trim())
                .filter(s => {
                  if (!s) return false;
                  // drop any style rule whose property name contains 'width' or 'height'
                  const prop = s.split(':')[0].trim().toLowerCase();
                  return !(prop.includes('width') || prop.includes('height'));
                })
                .join('; ');
              if (newStyle) el.setAttribute('style', newStyle);
              else el.removeAttribute('style');
            }

            // Force responsive sizing and good defaults
            try {
              el.style.width = '100%';
              el.style.height = '100%';
              el.style.display = 'block';
              el.style.border = '0';
            } catch (e) {
              // ignore if can't set style
            }

            // ensure recommended attributes
            if (!el.getAttribute('loading')) el.setAttribute('loading', 'lazy');
            if (!el.getAttribute('referrerpolicy')) el.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
            // add a helper class so CSS can target it if needed
            el.classList.add('responsive-embed');
          });

          // If the Google widget is wrapped in an extra container that sets size, try to neutralize it
          const wrappers = doc.querySelectorAll('div');
          wrappers.forEach((w) => {
            const style = w.getAttribute('style');
            if (style && /(width|height)\s*:/i.test(style)) {
              // remove width/height declarations from wrapper styles
              const newStyle = style
                .split(';')
                .map(s => s.trim())
                .filter(s => {
                  if (!s) return false;
                  const prop = s.split(':')[0].trim().toLowerCase();
                  return !(prop.includes('width') || prop.includes('height'));
                })
                .join('; ');
              if (newStyle) w.setAttribute('style', newStyle);
              else w.removeAttribute('style');
            }
          });

          data.google_maps = doc.body.innerHTML;
        } catch (err) {
          // If sanitization fails, fall back to raw value
          console.warn('Map HTML sanitization failed:', err);
        }
      }

      contactData.value = data;
    }
  } catch (err) {
    console.error('Contact data yuklanmadi:', err);
  }
};

// Locale o'zgarishini kuzatish
watch(currentLocale, () => {
  loadContactData();
});

onMounted(() => {
  loadContactData();
});
</script>

<style scoped>
.site-footer {
  background: rgb(44, 62, 80);
  color: #FFFFFF;
  font-family: 'Poppins', sans-serif;
  padding-top: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

/* Yuqori navigatsiya */

.footer-top-nav ul {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-top-nav a {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 12px;
  border-radius: 8px;
}

.footer-top-nav a:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.footer-main {
  padding: 40px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  align-items: start;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}

.footer-social .social-media {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-social .no-social {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: all 0.5s ease;
}

.social-link:hover {
  background: rgb(43, 74, 106);
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border-color: transparent;
}

.social-link:hover::before {
  width: 100px;
  height: 100px;
}

.social-link svg {
  transition: all 0.3s ease;
}

/* Loading and error states for footer */
.footer-loading,
.footer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  text-align: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.footer-loading p,
.footer-error p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.footer-error p {
  color: #ff6b6b;
  margin-bottom: 10px;
}

.retry-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.footer-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-menu-list li {
  margin: 0;
}

.footer-menu-list a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.3s ease;
  display: block;
  padding: 8px 0;
  position: relative;
  padding-left: 20px;
}

.footer-menu-list a::before {
  content: '→';
  position: absolute;
  left: 0;
  opacity: 0;
  transition: all 0.3s ease;
}

.footer-menu-list a:hover {
  color: #FFFFFF;
  padding-left: 25px;
}

.footer-menu-list a:hover::before {
  opacity: 1;
  left: 5px;
}

        .footer-map .map-container {
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive embed: use modern aspect-ratio so map adapts to any screen size */
.google-map-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* default ratio */
  overflow: hidden;
  min-height: 200px; /* sensible minimum for small screens */
  border-radius: 8px;
}

.google-map-wrapper iframe,
.google-map-wrapper embed,
.google-map-wrapper object,
.google-map-wrapper > div {
  position: absolute !important;
  inset: 0 !important; /* shorthand for top/right/bottom/left: 0 */
  width: 100% !important;
  height: 100% !important;
  border: 0 !important;
  display: block !important;
}

/* Tweak aspect ratio on very small screens for better vertical space use */
@media (max-width: 576px) {
  .google-map-wrapper {
    aspect-ratio: 4 / 3;
    min-height: 180px;
  }
}

/* Slightly taller map for very large screens */
@media (min-width: 1200px) {
  .google-map-wrapper {
    aspect-ratio: 16 / 7;
  }
}



.map-loading .loading-spinner {
  margin-bottom: 10px;
}

/* Eng pastki qism */
.footer-bottom {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  margin: 0;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.5px;
}

@media (max-width: 992px) {
  .footer-main {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .footer-map {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-map {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .footer-top-nav ul {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
}
</style>