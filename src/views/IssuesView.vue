<template>
    <main>
        <PageBanner :title="$t('issues.title')" />
        <div class="page-content">
            <div class="container">
                <!-- Loading state -->
                <div v-if="loading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Maqolalar yuklanmoqda...</p>
                </div>
                
                <!-- Error state -->
                <div v-else-if="error" class="error-state">
                    <p>Xatolik yuz berdi: {{ error }}</p>
                    <button @click="loadArticlesData" class="retry-btn">Qayta urinish</button>
                </div>
                
                <!-- Content -->
                <div v-else>
                    <div class="filters-panel">
                        
                        <div class="filters">
                            <button class="filter-btn">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 1H1L5.8 7.30667V11.6667L8.2 13V7.30667L13 1Z" stroke="#072AC8"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>{{ $t('issues.filter') }}</span>
                            </button>
                            <select v-model="selectedAuthor">
                                <option value="">{{ $t('issues.author_name') }}</option>
                                <option v-for="auth in authors" :key="auth" :value="auth">{{ auth }}</option>
                            </select>
                            <input type="text" v-model.trim="searchQuery" :placeholder="$t('issues.search_placeholder')">
                        </div>
                    </div>

                    <div class="articles-grid">
                        <div v-if="filteredArticles.length === 0" class="no-results">
                            Natija topilmadi.
                        </div>
                        <div v-for="(article) in paginatedArticles" :key="article.id" class="article-card">
                            <div class="card-header">
                                <div class="title-wrapper">
                                    <svg class="checkmark-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#4A90E2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <h3 class="article-title">
                                        <RouterLink v-if="article.slug" :to="getLocalizedPath(`/issues/${article.slug}`)" class="title-link" v-html="getHighlightedHtml(article.title, searchQuery)">
                                </RouterLink>
                                <span v-else v-html="getHighlightedHtml(article.title, searchQuery)"></span>
                                    </h3>
                            </div>
                                <div class="article-author">
                                <RouterLink v-if="article.authorSlug" :to="getLocalizedPath(`/author/${article.authorSlug}`)" class="author-link">
                                    {{ article.author }}
                                </RouterLink>
                                <span v-else>{{ article.author }}</span>
                                </div>
                            </div>

                            <div class="card-body">
                                <p class="article-abstract" v-html="getHighlightedHtml(article.abstract || 'Maqola annotatsiyasi mavjud emas.', searchQuery)"></p>
                            </div>
                            
                            <div class="card-footer">
                                <button class="btn-date">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.6667 2.33333H10.5V1.16667C10.5 0.991667 10.3583 0.875 10.2083 0.875H9.33333C9.18333 0.875 9.04167 0.991667 9.04167 1.16667V2.33333H4.95833V1.16667C4.95833 0.991667 4.81667 0.875 4.66667 0.875H3.79167C3.64167 0.875 3.5 0.991667 3.5 1.16667V2.33333H2.33333C1.40833 2.33333 0.666667 3.075 0.666667 4V11.6667C0.666667 12.5917 1.40833 13.3333 2.33333 13.3333H11.6667C12.5917 13.3333 13.3333 12.5917 13.3333 11.6667V4C13.3333 3.075 12.5917 2.33333 11.6667 2.33333ZM11.6667 11.6667H2.33333V5.83333H11.6667V11.6667Z" fill="currentColor"/>
                                    </svg>
                                    {{ article.date || '27.12.2025' }}
                                </button>
                                <button class="btn-volume">
                                    {{ article.volumeIssue || 'Volume 4 Issue 12' }}
                                </button>
                                <RouterLink v-if="article.slug" :to="getLocalizedPath(`/issues/${article.slug}`)" class="btn-view">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 3C4.66667 3 1.82 5.07333 0.666667 8C1.82 10.9267 4.66667 13 8 13C11.3333 13 14.18 10.9267 15.3333 8C14.18 5.07333 11.3333 3 8 3ZM8 11.3333C6.16 11.3333 4.66667 9.84 4.66667 8C4.66667 6.16 6.16 4.66667 8 4.66667C9.84 4.66667 11.3333 6.16 11.3333 8C11.3333 9.84 9.84 11.3333 8 11.3333ZM8 6C6.89333 6 6 6.89333 6 8C6 9.10667 6.89333 10 8 10C9.10667 10 10 9.10667 10 8C10 6.89333 9.10667 6 8 6Z" fill="currentColor"/>
                                    </svg>
                                    Batafsil ko'rish
                                </RouterLink>
                                <button 
                                    class="btn-download" 
                                    @click="downloadPDF(article)"
                                    :disabled="!article.pdfUrl"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 2V10M8 10L11 7M8 10L5 7M2 14H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Yuklab olish
                                </button>
                                <a
                                    v-if="article.googleScholar"
                                    :href="article.googleScholar"
                                    class="btn-scholar"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :title="`Google Scholar: ${article.title}`"
                                    aria-label="Open in Google Scholar"
                                >
                                    <img src="/assets/scholar.svg" alt="Google Scholar" class="scholar-icon" />
                                </a>
                                </div>
                            </div>
                        </div>
                    </div>

                <div class="table-footer">
                    <div class="pagination" v-if="totalItems > pageSize">
                        <a href="#" class="page-arrow" @click.prevent="goToPrevPage" :aria-disabled="currentPage === 1" :style="{ opacity: currentPage === 1 ? 0.5 : 1 }">
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
                                <path d="M1 1L7 7L1 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a 
                            v-for="page in pages"
                            :key="page"
                            href="#"
                            class="page-number"
                            :class="{ active: page === currentPage }"
                            @click.prevent="goToPage(page)"
                        >{{ page }}</a>
                        <a href="#" class="page-arrow" @click.prevent="goToNextPage" :aria-disabled="currentPage === totalPages" :style="{ opacity: currentPage === totalPages ? 0.5 : 1 }">
                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L1 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PageBanner from '@/components/PageBanner.vue';
import { useApi } from '@/composables/useApi';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const { t } = useI18n();
const { loading, error, fetchData, currentLocale, getImageUrl } = useApi();
const { getLocalizedPath } = useLocalizedRoute();

const articles = ref([]);

// Filter state
const selectedAuthor = ref('');
const searchQuery = ref('');

// Options from data
const authors = computed(() => {
    const set = new Set(articles.value.map(a => a.author).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// Filtered list
const filteredArticles = computed(() => {
    const q = (searchQuery.value || '').toLowerCase();
    return articles.value.filter(a => {
        const matchesAuthor = selectedAuthor.value ? a.author === selectedAuthor.value : true;
        const matchesQuery = q
            ? (a.title?.toLowerCase().includes(q)
                || a.abstract?.toLowerCase().includes(q))
            : true;
        return matchesAuthor && matchesQuery;
    });
});

// Pagination
const pageSize = 6;
const currentPage = ref(1);
const totalItems = computed(() => filteredArticles.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)));
const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredArticles.value.slice(start, start + pageSize);
});
const pages = computed(() => {
    const count = totalPages.value;
    const arr = [];
    for (let i = 1; i <= count; i++) arr.push(i);
    return arr;
});
const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
const goToPrevPage = () => goToPage(currentPage.value - 1);
const goToNextPage = () => goToPage(currentPage.value + 1);

// Load articles data from API
const loadArticlesData = async () => {
    try {
        console.log('Loading articles data...');
        const response = await fetchData('/jurnallars', { 
            populate: 'pdf'
        });
        console.log('Articles response:', response);
        
        if (response.data) {
            articles.value = response.data.map(article => {
                const abstract = article.Annotatsiya || '';
                const formattedDate = article.sana ? formatDate(article.sana) : null;

                return {
                    id: `#${article.maqola_id || article.id}`,
                    documentId: article.documentId,
                    slug: article.slug || null,
                    category: null, // Yangi API'da category yo'q
                    title: article.mavzu || '',
                    author: article.Muallif || 'Noma\'lum muallif',
                    authorSlug: null, // Yangi API'da authorSlug yo'q
                    abstract: abstract,
                    date: formattedDate || article.sana || null,
                    volume: null, // son field'dan ajratish mumkin, lekin hozircha null
                    issue: null,
                    volumeIssue: article.son || null,
                    doi: null, // Yangi API'da DOI yo'q
                    type: 'primary',
                    pdfUrl: article.pdf?.url ? getImageUrl(article.pdf) : null,
                    pdfName: article.pdf?.name || 'Maqola.pdf',
                    // Google Scholar link (may be undefined/null)
                    googleScholar: article.google_scholar || null
                };
            });
        }
    } catch (err) {
        console.error('Articles data yuklanmadi:', err);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (e) {
        return dateString;
    }
};

// Download PDF
const downloadPDF = (article) => {
    if (article.pdfUrl) {
        const link = document.createElement('a');
        link.href = article.pdfUrl;
        link.download = article.pdfName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Watch for locale changes
watch(currentLocale, () => {
    loadArticlesData();
});

// Reset page when filters/search change
watch([selectedAuthor, searchQuery], () => {
    currentPage.value = 1;
});

const escapeHtml = (str) => {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const getHighlightedHtml = (text, queryText) => {
    const raw = String(text || '');
    const q = String(queryText || '').trim();
    if (!q) return escapeHtml(raw);
    try {
        const pattern = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        return escapeHtml(raw).replace(pattern, (m) => `<mark class="hl">${escapeHtml(m)}</mark>`);
    } catch (e) {
        return escapeHtml(raw);
    }
};

onMounted(() => {
    loadArticlesData();
});
</script>

<style scoped>
.page-content {
    padding: 60px 0;
}

.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
}

/* Loading and error states */
.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #081330;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-state p,
.error-state p {
    font-size: 18px;
    color: #666;
    margin: 0 0 20px 0;
}

.error-state p {
    color: #e74c3c;
}

.retry-btn {
    background-color: #081330;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.retry-btn:hover {
    background-color: #0a1a3a;
}

.filters-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 20px;
}

.issue-selector {
    background: #09BD3C;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 20px;
    padding: 12px 25px;
    border-radius: 4px;
}

.filters {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.filters select,
.filters input {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #EEEEEE;
    background: #FFFFFF;
    font-size: 14px;
}

.filter-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
}

.articles-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.no-results {
    text-align: center;
    padding: 60px 20px;
    color: #666;
    font-size: 18px;
}

.article-card {
    background: #FFFFFF;
    border: 1px solid #EAEAEA;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
}

.article-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    margin-bottom: 16px;
}

.title-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
}

.checkmark-icon {
    flex-shrink: 0;
    margin-top: 2px;
}

.article-title {
    font-size: 18px;
    font-weight: 700;
    color: #171B1E;
    line-height: 1.4;
    margin: 0;
    flex: 1;
}

.title-link {
    color: #171B1E;
    text-decoration: none;
    transition: color 0.3s ease;
}

.title-link:hover {
    color: #072AC8;
}

.article-author {
    font-size: 16px;
    color: #171B1E;
    font-weight: 500;
    margin-left: 32px;
}

.card-body {
    margin-bottom: 20px;
}

.article-abstract {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
    margin-left: 32px;
}

.card-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-left: 32px;
    position: relative;
}

.btn-date,
.btn-volume {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #F5F5F5;
    border: 1px solid #EEEEEE;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #171B1E;
    cursor: default;
}

.btn-scholar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 6px;
    background: transparent; /* keep background neutral for a small icon */
    color: #171B1E;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.scholar-icon {
    width: 70px;
    height: auto;
    display: block;
}

@media (max-width: 576px) {
    .scholar-icon {
        width: 22px;
    }
}

.btn-date svg {
    color: #666;
}

.btn-view {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    background: #4A90E2;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.btn-view:hover {
    background: #357ABD;
}

.btn-download {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    background: #09BD3C;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-download:hover:not(:disabled) {
    background: #08A834;
}

.btn-download:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.author-link,
.article-title-link {
    color: #072AC8;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.author-link:hover,
.article-title-link:hover {
    color: #081330;
    text-decoration: underline;
}

.article-title-link {
    display: block;
    width: 100%;
}

.btn-more {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.btn-more:hover {
    background-color: #e0e0e0;
}

.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    flex-wrap: wrap;
    gap: 20px;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: auto;
}

.page-number,
.page-arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 700;
    color: #000000;
    background-color: #D9D9D9;
    transition: all 0.3s ease;
}

.page-number.active,
.page-number:hover {
    background-color: #072AC8;
    color: #FFFFFF;
}

.page-arrow:hover {
    background-color: #c4c4c4;
}

.btn-download-all {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #072AC8;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    margin-left: auto;
}

@media (max-width: 992px) {
    .article-card {
        padding: 20px;
    }
    
    .article-title {
        font-size: 16px;
    }
    
    .article-author,
    .article-abstract {
        margin-left: 0;
    }
    
    .card-footer {
        margin-left: 0;
        flex-direction: column;
        align-items: stretch;
    }
    
    .btn-date,
    .btn-volume,
    .btn-view,
    .btn-download {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 576px) {
    .table-footer {
        justify-content: center;
    }
    
    .title-wrapper {
        flex-direction: column;
        gap: 8px;
    }
    
    .checkmark-icon {
        align-self: flex-start;
    }
    
    .article-author,
    .article-abstract {
        margin-left: 0;
    }
    
    .card-footer {
        margin-left: 0;
    }
}

.hl {
    background-color: #fef08a;
    padding: 2px 4px;
    border-radius: 3px;
}
</style>