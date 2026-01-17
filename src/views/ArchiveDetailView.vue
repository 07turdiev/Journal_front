<template>
    <main>
        <PageBanner :title="bannerTitle" :breadcrumbs="breadcrumbs" />

        <div class="page-content">
            <div class="container">

                <div class="filters-panel">
                    <div class="issue-selector">
                        {{ archiveId }}
                    </div>
                    <div class="filters">
                        <div class="filter-btn">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 1H1L5.8 7.30667V11.6667L8.2 13V7.30667L13 1Z" stroke="#072AC8"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span>{{ $t('issues.filter') }}</span>
                        </div>
                        <select v-model="selectedCategory">
                            <option value="">{{ $t('issues.article_direction') }}</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                        <select v-model="selectedAuthor">
                            <option value="">{{ $t('issues.author_name') }}</option>
                            <option v-for="auth in authors" :key="auth" :value="auth">{{ auth }}</option>
                        </select>
                        <input type="text" v-model.trim="searchQuery" :placeholder="$t('issues.search_placeholder')">
                    </div>
                </div>

                <div class="articles-table">
                    <div class="table-header">
                        <div class="col-id">{{ $t('issues.article_id') }}</div>
                        <div class="col-cat">{{ $t('issues.direction') }}</div>
                        <div class="col-title">{{ $t('issues.article_topic') }}</div>
                        <div class="col-author">{{ $t('issues.researcher') }}</div>
                        <div class="col-action">{{ $t('issues.actions') }}</div>
                    </div>

                    <div v-for="(article) in filteredArticles" :key="article.id" class="table-row">
                        <div :data-label="$t('issues.article_id')" class="col-id">{{ article.id }}</div>
                        <div :data-label="$t('issues.direction')" class="col-cat">{{ article.category }}</div>
                        <div :data-label="$t('issues.article_topic')" class="col-title">{{ article.title }}</div>
                        <div :data-label="$t('issues.researcher')" class="col-author">{{ article.author }}</div>
                        <div class="col-action" @click.stop>
                            <button class="btn-download" :class="article.type">{{ $t('issues.download') }}</button>
                            <button class="btn-more" @click="toggleActionMenu(article.id)">
                                <svg width="4" height="16" viewBox="0 0 4 16" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2" cy="2" r="2" fill="#171B1E" />
                                    <circle cx="2" cy="8" r="2" fill="#171B1E" />
                                    <circle cx="2" cy="14" r="2" fill="#171B1E" />
                                </svg>
                            </button>
                            <ul class="actions-dropdown" v-if="openActionMenu === article.id">
                                <li><a href="#">{{ $t('issues.copy_link') }}</a></li>
                                <li><a href="#">{{ $t('issues.download_certificate') }}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="table-footer">
                    <div class="pagination">
                        <a href="#" class="page-number active">1</a>
                        <a href="#" class="page-number">2</a>
                        <a href="#" class="page-number">3</a>
                        <a href="#" class="page-number">...</a>
                        <a href="#" class="page-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13"
                                fill="none">
                                <path
                                    d="M7.07031 6.36328L1.41406 12.0205L0.707031 11.3135L5.30371 6.71777L5.65723 6.36426L0.707031 1.41406L1.41406 0.707031L7.07031 6.36328Z"
                                    fill="black" stroke="black" />
                            </svg>
                        </a>
                    </div>
                    <button class="btn-download-all">
                        <span>{{ $t('issues.download_journal') }}</span>
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1V11M7 11L11 7M7 11L3 7M1 15H13" stroke="white" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageBanner from '@/components/PageBanner.vue';
import { useDynamicSeoMeta } from '@/composables/useDynamicSeoMeta';

const { t } = useI18n();
const route = useRoute();
const openActionMenu = ref(null);
const archiveItem = ref(null);

useDynamicSeoMeta(archiveItem, 'archive');

// O'ZGARTIRILDI: archiveId'ni 'computed'ga o'zgartirdik, bu uni reaktiv qiladi
const archiveId = computed(() => route.params.id);

// Banner sarlavhasini dinamik yaratamiz
const bannerTitle = computed(() => `${t('archive.archive_title')} ${archiveId.value}`);

// Breadcrumbs'ni dinamik yaratamiz
const breadcrumbs = computed(() => [
    { text: t('archive.breadcrumb_home'), to: '/' },
    { text: t('archive.breadcrumb_authors') },
    { text: t('archive.breadcrumb_archive'), to: '/archive' },
    { text: archiveId.value } // Oxirgi element joriy sahifa (slug nomi)
]);

const articles = ref([
    { id: '#0015', category: 'Fizika', title: 'Arxivdagi 1-maqola sarlavhasi', author: 'Fizikov Fizik Fizikovich', type: 'primary' },
    { id: '#0016', category: 'Kimyo', title: 'Arxivdagi 2-maqola sarlavhasi', author: 'Ximikova Ximiya Ximikovna', type: 'primary' },
]);

// Filter state
const selectedCategory = ref('');
const selectedAuthor = ref('');
const searchQuery = ref('');

// Derived filter options
const categories = computed(() => {
    const set = new Set(articles.value.map(a => a.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const authors = computed(() => {
    const set = new Set(articles.value.map(a => a.author).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// Runtime filtered list
const filteredArticles = computed(() => {
    const query = (searchQuery.value || '').toLowerCase();
    return articles.value.filter(a => {
        const matchesCategory = selectedCategory.value ? a.category === selectedCategory.value : true;
        const matchesAuthor = selectedAuthor.value ? a.author === selectedAuthor.value : true;
        const matchesQuery = query
            ? (a.id?.toLowerCase().includes(query)
                || a.title?.toLowerCase().includes(query)
                || a.author?.toLowerCase().includes(query)
                || a.category?.toLowerCase().includes(query))
            : true;
        return matchesCategory && matchesAuthor && matchesQuery;
    });
});

const toggleActionMenu = (articleId) => {
    openActionMenu.value = openActionMenu.value === articleId ? null : articleId;
};

// Life-cycle hooks endi kerak emas, chunki 'computed' reaktivlikni ta'minlaydi
</script>

<style scoped>
/* Stillar o'zgarishsiz qoldirilgan */
.page-content {
    padding: 60px 0;
}

.container {
    max-width: 1140px;
    margin: 0 auto;
    padding: 0 15px;
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
    background: #072AC8;
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

.articles-table {
    border: 1px solid #EAEAEA;
    border-radius: 4px;
    overflow: hidden;
}

.table-header,
.table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr 2fr 1.5fr;
    align-items: center;
    padding: 20px;
    gap: 15px;
}

.table-header {
    background: #FAFAFA;
    font-weight: 700;
    font-size: 14px;
    color: #171B1E;
    border-bottom: 1px solid #EAEAEA;
}

.table-row {
    background: #FFFFFF;
    border-bottom: 1px solid #EAEAEA;
    font-size: 14px;
    color: #171B1E;
}

.table-row:nth-child(even) {
    background: #F8F8F8;
}

.table-row:last-child {
    border-bottom: none;
}

.col-title,
.col-author {
    font-weight: 500;
}

.col-action {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
}

.btn-download {
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    padding: 8px 25px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
}

.btn-download.primary {
    background-color: #072AC8;
}

.btn-download:hover {
    background-color: #09BD3C;
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

.actions-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: #FFFFFF;
    list-style: none;
    padding: 0;
    margin-top: 8px;
    width: max-content;
    min-width: 180px;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
    z-index: 10;
}

.actions-dropdown li a {
    display: block;
    padding: 12px 16px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    color: rgba(7, 25, 70, 0.7);
    transition: all 0.2s ease;
    white-space: nowrap;
}

.actions-dropdown li a:hover {
    background: rgba(0, 57, 203, 0.1);
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
}

@media (max-width: 992px) {
    /* ... responsive stillar ... */
}
</style>