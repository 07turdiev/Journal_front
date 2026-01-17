/**
 * API Service for fetching multilingual content
 * Handles communication with REST API endpoints
 */

class ApiService {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL
  }

  /**
   * Make HTTP request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise<any>} JSON response
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  /**
   * Fetch a single post/article by ID
   * Returns multilingual content structure:
   * {
   *   id: number,
   *   title: { uz: string, en: string, ru: string },
   *   description: { uz: string, en: string, ru: string },
   *   content: { uz: string, en: string, ru: string },
   *   image: string,
   *   author: string,
   *   publishedAt: string,
   *   tags: string[]
   * }
   * 
   * @param {string|number} id - Post ID
   * @returns {Promise<Object>} Post data with multilingual content
   */
  async getPost(id) {
    return this.request(`/posts/${id}`)
  }

  /**
   * Fetch multiple posts with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.sort - Sort field (default: 'publishedAt')
   * @param {string} params.order - Sort order 'asc'|'desc' (default: 'desc')
   * @returns {Promise<Object>} Posts data with pagination info
   */
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/posts${queryString ? `?${queryString}` : ''}`)
  }

  /**
   * Fetch a page by slug
   * Pages typically include static content like About, Contact, etc.
   * 
   * @param {string} slug - Page slug (e.g., 'about', 'contact')
   * @returns {Promise<Object>} Page data with multilingual content
   */
  async getPage(slug) {
    return this.request(`/pages/${slug}`)
  }

  /**
   * Fetch site configuration and metadata
   * @returns {Promise<Object>} Site config with SEO defaults
   */
  async getSiteConfig() {
    return this.request('/config')
  }

  /**
   * Search posts by query
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {string} params.language - Filter by language (uz|en|ru)
   * @returns {Promise<Array>} Search results
   */
  async searchPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/search${queryString ? `?${queryString}` : ''}`)
  }

  /**
   * Fetch author information
   * @param {string|number} id - Author ID
   * @returns {Promise<Object>} Author data
   */
  async getAuthor(id) {
    return this.request(`/authors/${id}`)
  }

  /**
   * Fetch categories
   * @returns {Promise<Array>} List of categories
   */
  async getCategories() {
    return this.request('/categories')
  }

  /**
   * Fetch tags
   * @returns {Promise<Array>} List of tags
   */
  async getTags() {
    return this.request('/tags')
  }

  /**
   * Fetch related posts for a given post
   * @param {string|number} postId - Post ID
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of related posts (default: 5)
   * @returns {Promise<Array>} Related posts
   */
  async getRelatedPosts(postId, params = { limit: 5 }) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/posts/${postId}/related${queryString ? `?${queryString}` : ''}`)
  }

  /**
   * Mock data for development/testing
   * Remove this in production
   * @returns {Promise<Object>} Mock post data
   */
  async getMockPost(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(id),
          title: {
            uz: `Мақола ${id} - Ўзбек Тилида`,
            en: `Post ${id} - English Title`,
            ru: `Статья ${id} - На Русском`
          },
          description: {
            uz: `Бу ўзбек тилида мақоланинг кичик таврифи. ${id}`,
            en: `This is the English description for post ${id}.`,
            ru: `Это русское описание для статьи ${id}.`
          },
          content: {
            uz: `Бу ўзбек тилида мақоланинг толиқ матни. Мақола рақами: ${id}`,
            en: `This is the full English content for post ${id}. Lorem ipsum dolor sit amet.`,
            ru: `Это полное содержание на русском языке для статьи ${id}. Lorem ipsum dolor sit amet.`
          },
          image: `https://picsum.photos/1200/630?random=${id}`,
          author: 'John Doe',
          publishedAt: new Date().toISOString(),
          tags: ['tutorial', 'vue', 'seo']
        })
      }, 500)
    })
  }
}

// Export singleton instance
export default new ApiService(
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
)

// Export class for creating custom instances if needed
export { ApiService }
