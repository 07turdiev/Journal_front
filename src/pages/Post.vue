<template>
  <div class="post-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>{{ $t('loading') || 'Loading...' }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadPost">{{ $t('retry') || 'Try Again' }}</button>
    </div>

    <!-- Post Content -->
    <article v-else-if="post" class="post">
      <!-- Header -->
      <header class="post-header">
        <h1 class="post-title">{{ postTitle }}</h1>
        
        <div class="post-meta">
          <span class="author">
            <strong>{{ $t('author') }}:</strong> {{ post.author }}
          </span>
          <span class="published-date">
            <strong>{{ $t('publishedOn') }}:</strong> 
            {{ formatDate(post.publishedAt) }}
          </span>
        </div>

        <!-- Featured Image -->
        <figure v-if="post.image" class="featured-image">
          <img 
            :src="post.image" 
            :alt="postTitle"
            loading="lazy"
          />
        </figure>
      </header>

      <!-- Content -->
      <main class="post-content">
        <p class="post-description">{{ postDescription }}</p>
        <section class="post-body">
          {{ postContent }}
        </section>
      </main>

      <!-- Tags -->
      <footer v-if="post.tags && post.tags.length" class="post-footer">
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </footer>

      <!-- Related Posts -->
      <section v-if="relatedPosts.length" class="related-posts">
        <h2>{{ $t('relatedPosts') || 'Related Posts' }}</h2>
        <div class="related-posts-grid">
          <article 
            v-for="relPost in relatedPosts" 
            :key="relPost.id"
            class="related-post-card"
            @click="navigateToPost(relPost.id)"
          >
            <img v-if="relPost.image" :src="relPost.image" :alt="relPost.title[currentLanguage]" />
            <h3>{{ relPost.title[currentLanguage] }}</h3>
            <p>{{ relPost.description[currentLanguage] }}</p>
          </article>
        </div>
      </section>
    </article>

    <!-- No Post Found -->
    <div v-else class="no-post">
      <p>{{ $t('postNotFound') || 'Post not found' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSeoMeta } from '../composables/useSeoMeta'
import apiService from '../services/api'

// Component state
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const post = ref(null)
const relatedPosts = ref([])
const loading = ref(true)
const error = ref(null)

// Current language from route parameter
const currentLanguage = computed(() => route.params.language || 'uz')

/**
 * Localized post content - getters for current language
 */
const postTitle = computed(() => 
  post.value?.title?.[currentLanguage.value] || 'Untitled'
)

const postDescription = computed(() => 
  post.value?.description?.[currentLanguage.value] || ''
)

const postContent = computed(() => 
  post.value?.content?.[currentLanguage.value] || ''
)

/**
 * Dynamic SEO meta tags
 * Updates automatically when:
 * - Language changes
 * - Post data changes
 * - Route changes
 */
useSeoMeta({
  title: postTitle,
  description: postDescription,
  image: computed(() => post.value?.image || ''),
  currentLanguage: currentLanguage,
  url: computed(() => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ''
  }),
  author: computed(() => post.value?.author || 'Journal'),
  type: 'article',
  keywords: computed(() => post.value?.tags?.join(', ') || '')
})

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }
    return date.toLocaleDateString(currentLanguage.value, options)
  } catch (e) {
    return dateString
  }
}

/**
 * Load post data from API
 * Uses mock data if API is not available
 */
const loadPost = async () => {
  loading.value = true
  error.value = null
  
  try {
    const postId = route.params.id
    
    // Try to fetch from API first, fallback to mock data
    try {
      post.value = await apiService.getPost(postId)
    } catch (apiError) {
      console.log('API unavailable, using mock data:', apiError)
      post.value = await apiService.getMockPost(postId)
    }
    
    // Load related posts
    try {
      relatedPosts.value = await apiService.getRelatedPosts(postId, { limit: 3 })
    } catch (e) {
      console.log('Could not load related posts:', e)
      relatedPosts.value = []
    }
  } catch (err) {
    error.value = err.message || 'Failed to load post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

/**
 * Navigate to another post
 * @param {string|number} postId - Post ID to navigate to
 */
const navigateToPost = (postId) => {
  router.push({
    name: 'Post',
    params: {
      language: currentLanguage.value,
      id: postId
    }
  })
}

/**
 * Watch for route changes (post ID or language changes)
 * Re-fetch post when route changes
 */
watch(
  () => route.params.id,
  () => {
    loadPost()
  }
)

/**
 * Initial load on component mount
 */
onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Loading and Error States */
.loading,
.error,
.no-post {
  padding: 2rem;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.error {
  background: #fee;
  color: #c00;
}

.error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #c00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background: #a00;
}

/* Post Styles */
.post {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.post-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #222;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  gap: 2rem;
  font-size: 0.95rem;
  color: #666;
  flex-wrap: wrap;
}

.post-meta span {
  display: flex;
  gap: 0.5rem;
}

.featured-image {
  margin: 1.5rem 0 0 0;
  overflow: hidden;
  border-radius: 8px;
}

.featured-image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* Post Content */
.post-content {
  padding: 2rem;
}

.post-description {
  font-size: 1.1rem;
  color: #555;
  margin: 0 0 1.5rem 0;
  font-style: italic;
  border-left: 4px solid #667eea;
  padding-left: 1rem;
}

.post-body {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
  word-wrap: break-word;
}

/* Post Footer - Tags */
.post-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tag:hover {
  background: #764ba2;
}

/* Related Posts Section */
.related-posts {
  padding: 2rem;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.related-posts h2 {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  color: #222;
}

.related-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.related-post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.related-post-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.related-post-card h3 {
  padding: 1rem 1rem 0.5rem;
  margin: 0;
  font-size: 1rem;
  color: #222;
  line-height: 1.4;
}

.related-post-card p {
  padding: 0 1rem 1rem;
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 768px) {
  .post-container {
    padding: 1rem;
  }

  .post-header,
  .post-content,
  .post-footer,
  .related-posts {
    padding: 1.5rem;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-meta {
    gap: 1rem;
  }

  .related-posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
