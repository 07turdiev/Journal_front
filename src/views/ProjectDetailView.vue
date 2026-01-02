<template>
  <main>
    <PageBanner :title="route.meta.title" />
    <div class="page-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>{{ $t('footer.loading_data') }}</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>{{ $t('footer.error_occurred') }}: {{ error }}</p>
          <button @click="loadProjectData(route.params.slug)" class="retry-btn">{{ $t('footer.retry') }}</button>
        </div>
        
        <!-- Project content -->
        <div v-else-if="project" class="project-detail">
          <div class="project-hero">
            <div class="project-image-wrapper">
              <img :src="project.image" :alt="project.title" class="project-hero-image" @error="handleImageError">
            </div>
            <div class="project-header">
              <div class="project-badges">
                <span class="project-category-badge">{{ project.category }}</span>
                <span class="project-date-badge">{{ project.date }}</span>
              </div>
              <h1 class="project-title">{{ project.title }}</h1>
            </div>
          </div>

          <div class="project-body">
            <div class="project-description-section">
              <p class="project-description">{{ project.description }}</p>
            </div>

            <div v-if="project.fullDescription" class="project-full-description" v-html="project.fullDescription"></div>

            <div v-if="project.link && project.link !== '#'" class="project-actions">
              <a :href="project.link" target="_blank" class="project-action-btn">
                {{ $t('projects.view_project') }}
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.33333 1L15 7M15 7L9.33333 13M15 7H1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Not found -->
        <div v-else class="not-found">
          <p>{{ $t('projects.not_found') || 'Loyiha topilmadi...' }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PageBanner from '@/components/PageBanner.vue';

const route = useRoute();
const { t } = useI18n();

const loading = ref(false);
const error = ref(null);
const project = ref(null);

const staticProjects = [
  {
    id: 1,
    slug: 'ilmiy-tadqiqot-loyihasi',
    title: 'Ilmiy Tadqiqot Loyihasi',
    description: 'Bu loyiha ilmiy tadqiqotlar va innovatsion yechimlarni rivojlantirishga qaratilgan. Loyiha davomida turli sohalarda muhim natijalar erishildi.',
    fullDescription: '<p>Bu loyiha ilmiy tadqiqotlar va innovatsion yechimlarni rivojlantirishga qaratilgan. Loyiha davomida turli sohalarda muhim natijalar erishildi.</p><p>Loyiha maqsadi - zamonaviy ilmiy tadqiqotlar orqali yangi bilimlar va texnologiyalarni yaratish, jamiyatning turli sohalarida qo\'llash va rivojlantirishdir.</p>',
    date: '2024-yil Yanvar',
    category: 'Ilmiy Tadqiqot',
    image: '/assets/project-1.jpg',
    link: '#'
  },
  {
    id: 2,
    slug: 'talim-tizimini-rivojlantirish',
    title: 'Ta\'lim Tizimini Rivojlantirish',
    description: 'Zamonaviy ta\'lim metodlarini joriy etish va ta\'lim sifatini oshirish bo\'yicha keng qamrovli loyiha. Bu loyiha ta\'lim sohasida muhim o\'zgarishlarni olib keldi.',
    fullDescription: '<p>Zamonaviy ta\'lim metodlarini joriy etish va ta\'lim sifatini oshirish bo\'yicha keng qamrovli loyiha. Bu loyiha ta\'lim sohasida muhim o\'zgarishlarni olib keldi.</p><p>Loyiha doirasida ta\'lim tizimini modernizatsiya qilish, yangi o\'quv metodlarini joriy etish va ta\'lim sifatini oshirish bo\'yicha ishlar amalga oshirildi.</p>',
    date: '2024-yil Fevral',
    category: 'Ta\'lim',
    image: '/assets/project-2.jpg',
    link: '#'
  },
  {
    id: 3,
    slug: 'texnologik-innovatsiyalar',
    title: 'Texnologik Innovatsiyalar',
    description: 'Zamonaviy texnologiyalarni qo\'llash va yangi yechimlar ishlab chiqish bo\'yicha loyiha. Bu loyiha turli sohalarda samarali natijalar berdi.',
    fullDescription: '<p>Zamonaviy texnologiyalarni qo\'llash va yangi yechimlar ishlab chiqish bo\'yicha loyiha. Bu loyiha turli sohalarda samarali natijalar berdi.</p><p>Loyiha maqsadi - innovatsion texnologiyalarni joriy etish, yangi yechimlar ishlab chiqish va ularni amaliyotga tatbiq etishdir.</p>',
    date: '2024-yil Mart',
    category: 'Texnologiya',
    image: '/assets/project-3.jpg',
    link: '#'
  },
  {
    id: 4,
    slug: 'ijtimoiy-dasturlar',
    title: 'Ijtimoiy Dasturlar',
    description: 'Jamiyatning turli qatlamlariga yordam ko\'rsatish va ijtimoiy muammolarni hal qilish bo\'yicha loyiha. Bu loyiha ko\'plab odamlarga foyda keltirdi.',
    fullDescription: '<p>Jamiyatning turli qatlamlariga yordam ko\'rsatish va ijtimoiy muammolarni hal qilish bo\'yicha loyiha. Bu loyiha ko\'plab odamlarga foyda keltirdi.</p><p>Loyiha doirasida ijtimoiy muammolarni hal qilish, jamiyatning turli qatlamlariga yordam ko\'rsatish va ijtimoiy adolatni ta\'minlash bo\'yicha ishlar amalga oshirildi.</p>',
    date: '2024-yil Aprel',
    category: 'Ijtimoiy',
    image: '/assets/project-4.jpg',
    link: '#'
  },
  {
    id: 5,
    slug: 'ekologik-tahlil',
    title: 'Ekologik Tahlil',
    description: 'Atrof-muhitni muhofaza qilish va ekologik muammolarni hal qilish bo\'yicha loyiha. Bu loyiha ekologik barqarorlikni ta\'minlashga yordam berdi.',
    fullDescription: '<p>Atrof-muhitni muhofaza qilish va ekologik muammolarni hal qilish bo\'yicha loyiha. Bu loyiha ekologik barqarorlikni ta\'minlashga yordam berdi.</p><p>Loyiha maqsadi - atrof-muhitni muhofaza qilish, ekologik muammolarni hal qilish va barqaror rivojlanishni ta\'minlashdir.</p>',
    date: '2024-yil May',
    category: 'Ekologiya',
    image: '/assets/project-5.jpg',
    link: '#'
  },
  {
    id: 6,
    slug: 'madaniy-merosni-organish',
    title: 'Madaniy Merosni O\'rganish',
    description: 'Milliy madaniy merosni o\'rganish, saqlash va targ\'ib qilish bo\'yicha loyiha. Bu loyiha madaniy qadriyatlarni yangi avlodga yetkazishga yordam berdi.',
    fullDescription: '<p>Milliy madaniy merosni o\'rganish, saqlash va targ\'ib qilish bo\'yicha loyiha. Bu loyiha madaniy qadriyatlarni yangi avlodga yetkazishga yordam berdi.</p><p>Loyiha doirasida milliy madaniy merosni o\'rganish, saqlash va targ\'ib qilish, madaniy qadriyatlarni yangi avlodga yetkazish bo\'yicha ishlar amalga oshirildi.</p>',
    date: '2024-yil Iyun',
    category: 'Madaniyat',
    image: '/assets/project-6.jpg',
    link: '#'
  },
  {
    id: 7,
    slug: 'sogliqni-saqlash-tizimi',
    title: 'Sog\'liqni Saqlash Tizimi',
    description: 'Sog\'liqni saqlash sohasida zamonaviy yondashuvlarni joriy etish va tibbiy xizmatlar sifatini oshirish bo\'yicha loyiha. Bu loyiha aholi salomatligini yaxshilashga yordam berdi.',
    fullDescription: '<p>Sog\'liqni saqlash sohasida zamonaviy yondashuvlarni joriy etish va tibbiy xizmatlar sifatini oshirish bo\'yicha loyiha. Bu loyiha aholi salomatligini yaxshilashga yordam berdi.</p><p>Loyiha maqsadi - tibbiy xizmatlar sifatini oshirish, zamonaviy tibbiy texnologiyalarni joriy etish va aholi salomatligini yaxshilashdir.</p>',
    date: '2024-yil Iyul',
    category: 'Sog\'liqni Saqlash',
    image: '/assets/project-7.jpg',
    link: '#'
  },
  {
    id: 8,
    slug: 'qishloq-xojaligi-innovatsiyalari',
    title: 'Qishloq Xo\'jaligi Innovatsiyalari',
    description: 'Qishloq xo\'jaligida zamonaviy texnologiyalarni qo\'llash va qishloq xo\'jaligi mahsulotlarini oshirish bo\'yicha loyiha. Bu loyiha qishloq xo\'jaligini rivojlantirishga muhim hissa qo\'shdi.',
    fullDescription: '<p>Qishloq xo\'jaligida zamonaviy texnologiyalarni qo\'llash va qishloq xo\'jaligi mahsulotlarini oshirish bo\'yicha loyiha. Bu loyiha qishloq xo\'jaligini rivojlantirishga muhim hissa qo\'shdi.</p><p>Loyiha doirasida qishloq xo\'jaligida zamonaviy texnologiyalarni joriy etish, mahsulotlar sifatini oshirish va qishloq xo\'jaligini rivojlantirish bo\'yicha ishlar amalga oshirildi.</p>',
    date: '2024-yil Avgust',
    category: 'Qishloq Xo\'jaligi',
    image: '/assets/project-8.jpg',
    link: '#'
  }
];

const loadProjectData = async (slug) => {
  try {
    loading.value = true;
    error.value = null;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const foundProject = staticProjects.find(p => p.slug === slug);
    
    if (foundProject) {
      project.value = foundProject;
    } else {
      project.value = null;
    }
  } catch (err) {
    console.error('Project data yuklanmadi:', err);
    error.value = err.message || 'Xatolik yuz berdi';
    project.value = null;
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ERasm%3C/text%3E%3C/svg%3E';
};

watch(() => route.params.slug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    loadProjectData(newSlug);
  }
}, { immediate: false });

onMounted(() => {
  if (route.params.slug) {
    loadProjectData(route.params.slug);
  }
});
</script>

<style scoped>
.page-content {
  padding: 80px 0;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.project-detail {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.project-hero {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.project-image-wrapper {
  width: 100%;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  background: #f7fafc;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.project-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.project-image-wrapper:hover .project-hero-image {
  transform: scale(1.02);
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-badges {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.project-category-badge {
  font-size: 13px;
  color: #2c5282;
  background: #ebf8ff;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.project-date-badge {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.project-title {
  font-size: 42px;
  font-weight: 800;
  color: #2d3748;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.project-body {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.project-description-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e2e8f0;
}

.project-description {
  font-size: 20px;
  line-height: 1.8;
  color: #4a5568;
  margin: 0;
  font-weight: 400;
}

.project-full-description {
  font-size: 18px;
  line-height: 1.85;
  color: #2d3748;
  margin-bottom: 40px;
}

.project-full-description :deep(p) {
  margin-bottom: 1.5em;
  color: #4a5568;
  font-size: 18px;
  line-height: 1.85;
}

.project-full-description :deep(h1),
.project-full-description :deep(h2),
.project-full-description :deep(h3),
.project-full-description :deep(h4),
.project-full-description :deep(h5),
.project-full-description :deep(h6) {
  margin: 2em 0 1em 0;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.3;
}

.project-full-description :deep(h1) { 
  font-size: 32px; 
  margin-top: 2.5em;
}
.project-full-description :deep(h2) { 
  font-size: 28px; 
  margin-top: 2em;
}
.project-full-description :deep(h3) { 
  font-size: 24px; 
  margin-top: 1.5em;
}
.project-full-description :deep(h4) { 
  font-size: 22px; 
}
.project-full-description :deep(h5) { 
  font-size: 20px; 
}
.project-full-description :deep(h6) { 
  font-size: 18px; 
}

.project-full-description :deep(ul),
.project-full-description :deep(ol) {
  margin: 1.5em 0;
  padding-left: 2em;
}

.project-full-description :deep(li) {
  margin-bottom: 0.75em;
  font-size: 18px;
  line-height: 1.85;
  color: #4a5568;
}

.project-full-description :deep(blockquote) {
  margin: 2em 0;
  padding: 24px 32px;
  border-left: 4px solid #2c5282;
  background: linear-gradient(90deg, rgba(44, 82, 130, 0.05) 0%, rgba(44, 82, 130, 0.02) 100%);
  font-style: italic;
  color: #4a5568;
  border-radius: 0 12px 12px 0;
  font-size: 18px;
  line-height: 1.75;
}

.project-full-description :deep(pre) {
  margin: 2em 0;
  padding: 24px;
  background: #1e1e1e;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #2d2d2d;
}

.project-full-description :deep(code) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 16px;
  color: #e06c75;
  background-color: rgba(224, 108, 117, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
}

.project-full-description :deep(pre code) {
  background: transparent;
  color: #d4d4d4;
  padding: 0;
}

.project-full-description :deep(a) {
  color: #2c5282;
  text-decoration: none;
  border-bottom: 2px solid rgba(44, 82, 130, 0.2);
  transition: all 0.3s ease;
  font-weight: 500;
}

.project-full-description :deep(a:hover) {
  color: #2a4a7a;
  border-bottom-color: #2c5282;
}

.project-full-description :deep(strong) {
  font-weight: 700;
  color: #2d3748;
}

.project-full-description :deep(em) {
  font-style: italic;
  color: #4a5568;
}

.project-full-description :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 2em 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.project-actions {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.project-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 16px 32px;
  background: #2c5282;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(44, 82, 130, 0.3);
}

.project-action-btn:hover {
  background: #2a4a7a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(44, 82, 130, 0.4);
  gap: 14px;
}

.project-action-btn svg {
  transition: transform 0.3s ease;
}

.project-action-btn:hover svg {
  transform: translateX(4px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2c5282;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  color: #718096;
  margin: 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.error-state p {
  font-size: 15px;
  color: #e53e3e;
  margin: 0 0 16px 0;
}

.retry-btn {
  background: #2c5282;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #2a4a7a;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.not-found p {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

@media (max-width: 1280px) {
  .container {
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .project-image-wrapper {
    height: 400px;
  }

  .project-title {
    font-size: 36px;
  }

  .project-body {
    padding: 40px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 60px 0;
  }

  .container {
    padding: 0 20px;
  }

  .project-detail {
    gap: 30px;
  }

  .project-image-wrapper {
    height: 300px;
    border-radius: 12px;
  }

  .project-title {
    font-size: 28px;
  }

  .project-body {
    padding: 30px 20px;
    border-radius: 12px;
  }

  .project-description {
    font-size: 18px;
  }

  .project-full-description {
    font-size: 16px;
  }

  .project-full-description :deep(p) {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .page-content {
    padding: 40px 0;
  }

  .container {
    padding: 0 16px;
  }

  .project-detail {
    gap: 24px;
  }

  .project-image-wrapper {
    height: 250px;
    border-radius: 8px;
  }

  .project-title {
    font-size: 24px;
  }

  .project-body {
    padding: 24px 16px;
    border-radius: 8px;
  }

  .project-description {
    font-size: 16px;
  }

  .project-full-description {
    font-size: 15px;
  }

  .project-full-description :deep(p) {
    font-size: 15px;
  }

  .project-action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

