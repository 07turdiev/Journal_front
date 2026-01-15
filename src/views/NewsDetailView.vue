<template>
  <main class="news-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Ma'lumotlar yuklanmoqda...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Xatolik yuz berdi</h2>
      <p>{{ error }}</p>
      <button @click="loadArticleData(route.params.slug)" class="retry-btn">Qayta urinish</button>
    </div>

    <div v-else-if="article" class="article-wrapper">
      <!-- Main Content -->
      <div class="article-content-wrapper">
        <!-- Left Sidebar -->
        <div class="sidebar">
          <button @click="goBack" class="sidebar-btn" title="Orqaga">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <a :href="telegramShareUrl" target="_blank" class="sidebar-btn" title="Telegram'da ulashish">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
          </a>
          <a :href="facebookShareUrl" target="_blank" class="sidebar-btn" title="Facebook'da ulashish">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>

        <div class="article-main-content">
          <div class="article-header">
            <div class="article-meta">
              <span class="meta-category">{{ article.category || 'Yangiliklar' }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-date">{{ formattedDate }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-views">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {{ article.views || '0' }}
              </span>
              <span class="meta-separator">•</span>
              <span class="meta-reading-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {{ readingTime }} daqiqa o'qiladi
              </span>
            </div>
            <h1 class="article-title">{{ article.title }}</h1>

          </div>

          <!-- Article Image -->


          <div class="article-body">
            <div class="article-image-container" v-if="article.image">
              <img :src="article.image" :alt="article.title" class="article-image" @error="handleImageError">
            </div>
            <div class="article-content" v-html="article.htmlContent || article.content"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <div class="not-found-icon">📰</div>
      <h2>Yangilik topilmadi</h2>
      <p>Kechirasiz, so'ralgan yangilik mavjud emas.</p>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { usePageMeta } from '@/composables/usePageMeta';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';
import { getPlainText, parseRichText } from '@/utils/richTextParser';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { getLocalizedPath } = useLocalizedRoute();
const { setPageMeta, setCanonical } = usePageMeta();

// API integration
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();

const article = ref(null);

// API dan ma'lumotlarni olish
const loadArticleData = async (slug) => {
  try {
    console.log(`Loading article with slug: ${slug} in locale: ${currentLocale.value}`);

    // Avval o'zbek tilida slug orqali documentId'ni topish
    const searchResponse = await fetchData('/yangiliklars', {
      'filters[slug][$eq]': slug,
      'filters[locale][$eq]': 'uz', // Faqat o'zbek tilida qidirish
      'fields[0]': 'documentId'
    });

    if (searchResponse.data && searchResponse.data.length > 0) {
      const uzArticleData = searchResponse.data[0];
      console.log(`Found Uzbek article with documentId: ${uzArticleData.documentId}`);

      // DocumentId orqali joriy tildagi ma'lumotni olish
      const fullResponse = await fetchData(`/yangiliklars/${uzArticleData.documentId}`, {
        populate: 'Rasmi'
      });

      if (fullResponse.data) {
        const fullArticleData = fullResponse.data;
        console.log(`Full article loaded: ${fullArticleData.Nomi} in ${fullArticleData.locale}`);

        // O'zbek tilidagi slug'ni ishlatish
        const uzSlug = slug; // O'zbek tilidagi slug

        const plainText = getPlainText(fullArticleData.Text);
        const words = plainText.split(/\s+/).filter(word => word.length > 0);
        const readingTimeMinutes = Math.ceil(words.length / 200); // Average reading speed: 200 words per minute

        // Extract intro from first paragraph
        let intro = '';
        if (fullArticleData.Text && Array.isArray(fullArticleData.Text)) {
          const firstParagraph = fullArticleData.Text.find(block => block.type === 'paragraph');
          if (firstParagraph && firstParagraph.children) {
            const introText = firstParagraph.children
              .map(child => {
                if (child.type === 'text') return child.text || '';
                if (child.type === 'link' && child.children) {
                  return child.children.map(c => c.text || '').join('');
                }
                return '';
              })
              .join('')
              .trim();
            if (introText) {
              intro = introText.length > 200 ? introText.substring(0, 200) + '...' : introText;
            }
          }
        }

        article.value = {
          id: fullArticleData.id,
          title: fullArticleData.Nomi,
          content: plainText,
          htmlContent: parseRichText(fullArticleData.Text),
          date: fullArticleData.Sana,
          slug: uzSlug,
          image: getImageUrl(fullArticleData.Rasmi),
          category: fullArticleData.Kategoriya || 'Yangiliklar',
          views: fullArticleData.Korishlar || Math.floor(Math.random() * 5000) + 1000, // Placeholder if not available
          readingTime: readingTimeMinutes,
          intro: intro
        };
      } else {
        console.log(`Failed to load full article data`);
        article.value = null;
      }
    } else {
      console.log(`No article found with slug: ${slug} in Uzbek locale`);
      article.value = null;
    }
  } catch (err) {
    console.error('Article data yuklanmadi:', err);
    article.value = null;
  }
};

// Rasm yuklanmagan taqdirda placeholder ko'rsatish
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/600x400?text=Rasm';
};

// Go back function
const goBack = () => {
  router.back();
};

// Format date
const formattedDate = computed(() => {
  if (!article.value?.date) return '';

  try {
    const date = new Date(article.value.date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} / ${day}.${month}.${year}`;
  } catch (e) {
    return article.value.date;
  }
});

// Reading time
const readingTime = computed(() => {
  return article.value?.readingTime || 3;
});

// Share URLs
const telegramShareUrl = computed(() => {
  if (!article.value) return '#';
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(article.value.title);
  return `https://t.me/share/url?url=${url}&text=${text}`;
});

const facebookShareUrl = computed(() => {
  if (!article.value) return '#';
  const url = encodeURIComponent(window.location.href);
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
});

// Locale o'zgarishini kuzatish
watch(currentLocale, (newLocale, oldLocale) => {
  // Faqat locale haqiqatan o'zgargan bo'lsa qayta yuklash
  if (newLocale !== oldLocale && route.params.slug) {
    console.log(`Locale changed from ${oldLocale} to ${newLocale}, reloading article...`);
    loadArticleData(route.params.slug);
  }
});

// Slug o'zgarishini kuzatish
watch(() => route.params.slug, (newSlug, oldSlug) => {
  // Faqat slug haqiqatan o'zgargan bo'lsa qayta yuklash
  if (newSlug && newSlug !== oldSlug) {
    console.log(`Slug changed from ${oldSlug} to ${newSlug}, loading new article...`);
    loadArticleData(newSlug);
  }
}, { immediate: false });

// Maqola ma'lumotlari yuklangandan keyin meta teglarni yangilash
watch(article, (newArticle) => {
  if (newArticle) {
    setPageMeta({
      title: newArticle.title,
      description: newArticle.intro || newArticle.content.substring(0, 160),
      keywords: `${newArticle.title}, ziyoli avlod, yangiliklar`,
      image: newArticle.image,
      url: `https://ziyoliavlod.com${route.fullPath}`,
      type: 'article',
      author: 'Ziyoli Avlod',
      datePublished: newArticle.date,
      dateModified: newArticle.date
    });
    setCanonical(`https://ziyoliavlod.com${route.fullPath}`);
  }
});

onMounted(() => {
  if (route.params.slug) {
    loadArticleData(route.params.slug);
  }
});
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  background: #F2F3F4;
}

.article-wrapper {
  min-height: 100vh;
  padding-top: 30px;
  position: relative;
  padding-bottom: 10px;
}

/* Main Content Wrapper */
.article-content-wrapper {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 20px;
  background: #F2F3F4;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 100px;
  left: 0;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
  float: left;
  margin-right: 24px;
  z-index: 10;
}

.sidebar-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #0039CB;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-btn:hover {
  background: #072AC8;
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(7, 42, 200, 0.3);
}

.sidebar-btn svg {
  width: 20px;
  height: 20px;
}

.article-main-content {
  overflow: hidden;
}

.article-header {
  margin-bottom: 40px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.meta-category {
  color: #333;
  font-weight: 500;
}

.meta-separator {
  color: #999;
}

.meta-date {
  color: #666;
}

.meta-views,
.meta-reading-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
}

.meta-views svg,
.meta-reading-time svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.article-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.3;
  color: #021467;
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
}

.article-intro {
  font-size: 20px;
  line-height: 1.8;
  color: #2d2d2d;
  margin-top: 16px;
  font-weight: 400;
}

.article-image-container {
  width: 100%;
  height: 500px;
  margin: 0 0 40px 0;
  border-radius: 12px;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.article-body {
  background: #ffffff;
  border-radius: 8px;
  padding: 40px;
  margin-top: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.article-content {
  font-size: 20px;
  line-height: 1.85;
  color: #1a1a1a;
  font-weight: 400;
}

.article-content :deep(p) {
  margin-bottom: 1.75em;
  color: #2d2d2d;
}

.article-content :deep(p:first-child) {
  font-size: 22px;
  line-height: 1.8;
  color: #4a4a4a;
  font-weight: 400;
  margin-bottom: 2em;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  margin: 2em 0 1em 0;
  font-weight: 700;
  color: #081330;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.article-content :deep(h1) {
  font-size: 36px;
  margin-top: 2.5em;
}

.article-content :deep(h2) {
  font-size: 32px;
  margin-top: 2.5em;
}

.article-content :deep(h3) {
  font-size: 28px;
  margin-top: 2em;
}

.article-content :deep(h4) {
  font-size: 24px;
}

.article-content :deep(h5) {
  font-size: 22px;
}

.article-content :deep(h6) {
  font-size: 20px;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 1.5em 0;
  padding-left: 2em;
}

.article-content :deep(li) {
  margin-bottom: 0.75em;
  font-size: 20px;
  line-height: 1.8;
  color: #2d2d2d;
}

.article-content :deep(blockquote) {
  margin: 2em 0;
  padding: 30px 40px;
  border-left: 4px solid #072AC8;
  background: linear-gradient(90deg, rgba(7, 42, 200, 0.05) 0%, rgba(7, 42, 200, 0.02) 100%);
  font-style: italic;
  color: #4a4a4a;
  border-radius: 0 12px 12px 0;
  font-size: 22px;
  line-height: 1.7;
  position: relative;
}

.article-content :deep(blockquote::before) {
  content: '"';
  font-size: 60px;
  color: #072AC8;
  position: absolute;
  left: 15px;
  top: 10px;
  opacity: 0.2;
  font-family: Georgia, serif;
}

.article-content :deep(pre) {
  margin: 2em 0;
  padding: 24px;
  background: #1e1e1e;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #2d2d2d;
}

.article-content :deep(code) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 16px;
  color: #e06c75;
  background-color: rgba(224, 108, 117, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
}

.article-content :deep(pre code) {
  background: transparent;
  color: #d4d4d4;
  padding: 0;
}

.article-content :deep(a) {
  color: #072AC8;
  text-decoration: none;
  border-bottom: 2px solid rgba(7, 42, 200, 0.2);
  transition: all 0.3s ease;
  font-weight: 500;
}

.article-content :deep(a:hover) {
  color: #081330;
  border-bottom-color: #072AC8;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: #081330;
}

.article-content :deep(em) {
  font-style: italic;
  color: #4a4a4a;
}

.article-content :deep(u) {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.article-content :deep(s) {
  text-decoration: line-through;
  opacity: 0.6;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 2em 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.article-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 3em 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 80px 24px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #072AC8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 24px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 18px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 80px 24px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.error-state h2 {
  font-size: 32px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 16px 0;
}

.error-state p {
  font-size: 18px;
  color: #666;
  margin: 0 0 32px 0;
  max-width: 500px;
}

.retry-btn {
  background: linear-gradient(135deg, #072AC8 0%, #081330 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(7, 42, 200, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(7, 42, 200, 0.4);
}

.retry-btn:active {
  transform: translateY(0);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 80px 24px;
}

.not-found-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.not-found h2 {
  font-size: 32px;
  font-weight: 700;
  color: #081330;
  margin: 0 0 16px 0;
}

.not-found p {
  font-size: 18px;
  color: #666;
  margin: 0;
  max-width: 500px;
}

/* Tablet and smaller */
@media (max-width: 1024px) {
  .article-content-wrapper {
    padding: 0 24px 60px 80px;
  }

  .sidebar {
    margin-right: 16px;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .article-wrapper {
    padding-top: 20px;
    padding-bottom: 60px;
  }

  .sidebar {
    margin-right: 12px;
    top: 80px;
  }

  .sidebar-btn {
    width: 40px;
    height: 40px;
  }

  .sidebar-btn svg {
    width: 18px;
    height: 18px;
  }

  .article-content-wrapper {
    padding: 0 20px 50px 60px;
  }

  .article-title {
    font-size: 32px;
    line-height: 1.3;
  }

  .article-image-container {
    height: 400px;
    margin: 30px 0;
    border-radius: 8px;
  }

  .article-meta {
    font-size: 13px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .article-body {
    padding: 30px 20px;
    margin-top: 30px;
  }

  .article-content {
    font-size: 18px;
    line-height: 1.75;
  }

  .article-content :deep(p:first-child) {
    font-size: 20px;
  }

  .article-content :deep(h1) {
    font-size: 28px;
  }

  .article-content :deep(h2) {
    font-size: 26px;
  }

  .article-content :deep(h3) {
    font-size: 24px;
  }

  .article-content :deep(blockquote) {
    padding: 20px 24px;
    font-size: 18px;
  }

  .error-state h2,
  .not-found h2 {
    font-size: 24px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .article-wrapper {
    padding-top: 15px;
    padding-bottom: 40px;
  }

  .sidebar {
    margin-right: 8px;
    top: 60px;
    gap: 12px;
  }

  .sidebar-btn {
    width: 36px;
    height: 36px;
  }

  .sidebar-btn svg {
    width: 16px;
    height: 16px;
  }

  .article-content-wrapper {
    padding: 0 16px 40px 50px;
  }

  .article-title {
    font-size: 24px;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .article-image-container {
    height: 250px;
    margin: 20px 0;
    border-radius: 6px;
  }

  .article-meta {
    font-size: 11px;
    gap: 6px;
    flex-wrap: wrap;
  }

  .meta-views svg,
  .meta-reading-time svg {
    width: 14px;
    height: 14px;
  }

  .article-body {
    padding: 20px 16px;
    margin-top: 20px;
    border-radius: 6px;
  }

  .article-content {
    font-size: 16px;
    line-height: 1.7;
  }

  .article-content :deep(p:first-child) {
    font-size: 18px;
  }

  .article-content :deep(h1) {
    font-size: 24px;
    margin-top: 1.5em;
  }

  .article-content :deep(h2) {
    font-size: 22px;
    margin-top: 1.5em;
  }

  .article-content :deep(h3) {
    font-size: 20px;
    margin-top: 1.5em;
  }

  .article-content :deep(blockquote) {
    padding: 16px 20px;
    font-size: 16px;
    margin: 1.5em 0;
  }

  .article-content :deep(ul),
  .article-content :deep(ol) {
    padding-left: 1.5em;
  }

  .article-content :deep(li) {
    font-size: 16px;
    margin-bottom: 0.5em;
  }

  .error-state,
  .not-found {
    padding: 60px 20px;
  }

  .error-state h2,
  .not-found h2 {
    font-size: 22px;
  }

  .loading-state {
    padding: 60px 20px;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .article-content-wrapper {
    padding: 0 12px 30px 45px;
  }

  .sidebar {
    margin-right: 6px;
  }

  .sidebar-btn {
    width: 32px;
    height: 32px;
  }

  .sidebar-btn svg {
    width: 14px;
    height: 14px;
  }

  .article-title {
    font-size: 22px;
  }

  .article-image-container {
    height: 200px;
  }

  .article-body {
    padding: 16px 12px;
  }

  .article-content {
    font-size: 15px;
  }
}
</style>