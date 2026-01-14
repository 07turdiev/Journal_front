<template>
    <main>
        <PageBanner :title="$t('archive.title')" />
        <div class="page-content">
            <div class="container">

                <div class="filters-panel">
                    <div class="filter-group">
                        <div class="filter-label">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 1H1L5.8 7.30667V11.6667L8.2 13V7.30667L13 1Z" stroke="#072AC8"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span>{{ $t('archive.filter') }}</span>
                        </div>
                        <select v-model="selectedCount">
                            <option value="">{{ $t('archive.article_count') }}</option>
                            <option v-for="c in counts" :key="c" :value="c">{{ c }}</option>
                        </select>
                        <select v-model="selectedDate">
                            <option value="">{{ $t('archive.date') }}</option>
                            <option v-for="d in dates" :key="d" :value="d">{{ d }}</option>
                        </select>
                    </div>
                    <div class="search-group">
                        <input type="text" v-model.trim="searchQuery" :placeholder="$t('archive.search_placeholder')">
                    </div>
                </div>

                <div class="archive-table">
                    <div class="table-header">
                        <div>{{ $t('archive.article_count_label') }}</div>
                        <div>{{ $t('archive.article_date_label') }}</div>
                        <div></div>
                    </div>
                    <div v-for="archive in filteredArchives" :key="archive.id" class="table-row"
                        @click="goToArchive(archive.id)">
                        <div :data-label="$t('archive.article_count_label')">{{ archive.name }}</div>
                        <div :data-label="$t('archive.article_date_label')">{{ archive.date }}</div>
                        <div class="action-col">
                            <button class="btn-download" @click.stop="downloadJournal(archive.id)">
                                <span>{{ $t('archive.download_journal') }}</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 1V8M6 8L9 5M6 8L3 5M1 11H11" stroke="white" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHead } from '@vueuse/head'
import PageBanner from '@/components/PageBanner.vue';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const { t } = useI18n();

useHead({
  title: 'Ziyoli Avlod - Arxiv',
  meta: [
    { name: 'description', content: 'Ziyoli Avlod jurnalining arxiv sonlarini ko\'ring.' },
    { name: 'keywords', content: 'ziyoli avlod, arxiv, sonlar' },
    { property: 'og:title', content: 'Ziyoli Avlod - Arxiv' },
    { property: 'og:description', content: 'Ziyoli Avlod jurnalining arxiv sonlarini ko\'ring.' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const router = useRouter();
const { getLocalizedPath } = useLocalizedRoute();
const archives = ref([
    { id: '1-son-2025', name: '1-Son', date: '01.01.2025' }, { id: '2-son-2025', name: '2-Son', date: '01.02.2025' },
    { id: '3-son-2025', name: '3-Son', date: '01.03.2025' }, { id: '4-son-2025', name: '4-Son', date: '01.04.2025' },
]);
const goToArchive = (archiveId) => { router.push(getLocalizedPath(`/archive/${archiveId}`)); };
const downloadJournal = (archiveId) => { console.log(`${archiveId} arxivini yuklab olish...`); };

// Filter state
const selectedCount = ref('');
const selectedDate = ref('');
const searchQuery = ref('');

// Select options derived from data
const counts = computed(() => {
    const set = new Set(archives.value.map(a => a.name).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const dates = computed(() => {
    const set = new Set(archives.value.map(a => a.date).filter(Boolean));
    // Assuming DD.MM.YYYY; sort by parsed date descending
    return Array.from(set).sort((a, b) => {
        const [da, ma, ya] = a.split('.').map(Number);
        const [db, mb, yb] = b.split('.').map(Number);
        return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
    });
});

// Runtime filtered list
const filteredArchives = computed(() => {
    const q = (searchQuery.value || '').toLowerCase();
    return archives.value.filter(a => {
        const matchesCount = selectedCount.value ? a.name === selectedCount.value : true;
        const matchesDate = selectedDate.value ? a.date === selectedDate.value : true;
        const matchesQuery = q
            ? (a.id?.toLowerCase().includes(q)
                || a.name?.toLowerCase().includes(q)
                || a.date?.toLowerCase().includes(q))
            : true;
        return matchesCount && matchesDate && matchesQuery;
    });
});
</script>

<style scoped>
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
  background: #F0EFEF;
  padding: 9px;
  border-radius: 4px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}
.filter-group, .search-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 14px;
}
.filters-panel select, .filters-panel input {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #EEEEEE;
  background: #FFFFFF;
  font-size: 14px;
  color: #717579;
}
.search-group {
  position: relative;
  flex-grow: 1; /* Kengayish uchun */
  min-width: 200px;
}
.search-group input {
  width: 100%;
  padding-right: 35px;
  box-sizing: border-box;
}
.search-group button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}


.archive-table {
    border: 1px solid #EAEAEA;
    border-radius: 4px;
    overflow: hidden;
}

.table-header,
.table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 20px;
    gap: 15px;
}

.table-header {
    background: #FAFAFA;
    font-weight: 700;
    text-align: left;
}

/* O'ZGARTIRILDI: Qator bosilishi mumkinligini ko'rsatish uchun stillar */
.table-row {
    background: #FFFFFF;
    border-bottom: 1px solid #EAEAEA;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.table-row:hover {
    background-color: #f8f8f8;
}

.table-row:nth-child(even) {
    background: #F8F8F8;
}

.table-row:nth-child(even):hover {
    background-color: #f0f0f0;
}

.action-col {
    text-align: right;
}

.btn-download {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #072AC8;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    padding: 8px 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
}

@media (max-width: 768px) {
    /* ... responsive stillar o'zgarishsiz ... */
}
</style>