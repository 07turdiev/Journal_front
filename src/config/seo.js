// SEO Meta Tags Configuration
// Bu fayl har bir sahifa uchun title, description va og: tags'ni o'rnatish uchun

export const seoConfig = {
  // Default
  default: {
    title: 'Ziyoli Avlod - O\'zbekiston Ilmiy Jurnali',
    description: 'Ziyoli Avlod - O\'zbekiston ilmiy jurnali. Akademik maqolalar, tadqiqot, yangiliklar va tadbirlar.',
    keywords: 'jurnal, ilmiy, akademik, O\'zbekiston, tadqiqot, maqola',
    image: 'https://ziyoliavlod.com/og-image.jpg'
  },

  pages: {
    uz: {
      home: {
        title: 'Ziyoli Avlod - O\'zbekiston Ilmiy Jurnali',
        description: 'Ziyoli Avlod ilmiy jurnalining rasmiy veb-saytiga xush kelibsiz. Akademik maqolalar, yangiliklar va tadbirlar haqida ma\'lumot olib turish.',
        keywords: 'Ziyoli Avlod, jurnal, ilmiy, akademik, O\'zbekiston'
      },
      about: {
        title: 'Jurnal Haqida - Ziyoli Avlod',
        description: 'Ziyoli Avlod ilmiy jurnali haqida, uning missiyasi, maqsadi va ta\'rixi haqida batafsil ma\'lumot.'
      },
      news: {
        title: 'Yangiliklar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalining oxirgi yangiliklar va e\'lonlari. Akademik dunyodagi eng muhim voqealarni kuzatib turing.'
      },
      announcements: {
        title: 'E\'lonlar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalining rasmiy e\'lonlari. Muhim xabarlar va e\'lonlarni vaqtida bilib oling.'
      },
      events: {
        title: 'Tadbirlar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnali tomonidan o\'tkaziladigan ilmiy tadbirlar, konferensiyalar va seminarlar.'
      },
      issues: {
        title: 'Maqolalar va Nashriyotlar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalining barcha nashriyotlari, maqolalari va tadqiqotlari. Qidiruv va filtrlash orqali kerakli maqolani toping.'
      },
      authors: {
        title: 'Mualliflar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalida nashr ettirilgan mualliflar ro\'yxati. Mualliflar haqida ma\'lumot va ularning nashriyotlarini ko\'ring.'
      },
      'author-guide': {
        title: 'Mualliflar Uchun Qo\'llanma - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalida maqola nashr ettirishni istagan mualliflar uchun qo\'llanma va ko\'rsatmalar.'
      },
      'submit-article': {
        title: 'Maqola Yuborish - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalida o\'z maqolangizni yuborish. To\'liq forma va kerakli hujjatlar uchun qo\'llanma.'
      },
      contact: {
        title: 'Aloqa - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnali bilan aloqa qilish. Email, telefon va ijtimoiy tarmoq havolalari.'
      },
      faq: {
        title: 'Tez-Tez Beriladigan Savollar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnali haqida tez-tez beriladigan savollar va ularning javoblari.'
      },
      projects: {
        title: 'Loyihalar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnali tomonidan amalga oshiriladigan ilmiy loyihalar va dasturlar.'
      },
      'editorial-board': {
        title: 'Tahrir Hay\'ati - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalining tahrir hay\'ati a\'zolari va ularning professional faoliyati.'
      },
      staff: {
        title: 'Tahririyat Xodimlari - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalining tahririyat xodimlari va ularning mas\'uliyatlari.'
      },
      partners: {
        title: 'Hamkorlar - Ziyoli Avlod',
        description: 'Ziyoli Avlod jurnalining hamkor tashkilotlar va universitetlari.'
      }
    },

    en: {
      home: {
        title: 'Ziyoli Avlod - Scientific Journal of Uzbekistan',
        description: 'Welcome to Ziyoli Avlod scientific journal official website. Stay informed about academic articles, research, news and events.',
        keywords: 'Ziyoli Avlod, journal, scientific, academic, Uzbekistan'
      },
      about: {
        title: 'About the Journal - Ziyoli Avlod',
        description: 'Learn more about Ziyoli Avlod scientific journal, its mission, goals and history.'
      },
      news: {
        title: 'News - Ziyoli Avlod',
        description: 'Latest news and announcements from Ziyoli Avlod journal. Follow the most important events in the academic world.'
      },
      announcements: {
        title: 'Announcements - Ziyoli Avlod',
        description: 'Official announcements from Ziyoli Avlod journal. Get important news and announcements on time.'
      },
      events: {
        title: 'Events - Ziyoli Avlod',
        description: 'Scientific events, conferences and seminars organized by Ziyoli Avlod journal.'
      },
      issues: {
        title: 'Articles and Publications - Ziyoli Avlod',
        description: 'All publications, articles and research from Ziyoli Avlod journal. Find the article you need through search and filters.'
      },
      authors: {
        title: 'Authors - Ziyoli Avlod',
        description: 'List of authors published in Ziyoli Avlod journal. View author information and their publications.'
      },
      'author-guide': {
        title: 'Author Guidelines - Ziyoli Avlod',
        description: 'Guidelines and instructions for authors who want to publish articles in Ziyoli Avlod journal.'
      },
      'submit-article': {
        title: 'Submit Article - Ziyoli Avlod',
        description: 'Submit your article to Ziyoli Avlod journal. Complete form and instructions for required documents.'
      },
      contact: {
        title: 'Contact - Ziyoli Avlod',
        description: 'Contact Ziyoli Avlod journal. Email, phone and social media links.'
      },
      faq: {
        title: 'Frequently Asked Questions - Ziyoli Avlod',
        description: 'Frequently asked questions about Ziyoli Avlod journal and their answers.'
      },
      projects: {
        title: 'Projects - Ziyoli Avlod',
        description: 'Scientific projects and programs implemented by Ziyoli Avlod journal.'
      },
      'editorial-board': {
        title: 'Editorial Board - Ziyoli Avlod',
        description: 'Members of the Ziyoli Avlod journal editorial board and their professional activities.'
      },
      staff: {
        title: 'Editorial Staff - Ziyoli Avlod',
        description: 'Ziyoli Avlod journal editorial staff and their responsibilities.'
      },
      partners: {
        title: 'Partners - Ziyoli Avlod',
        description: 'Partner organizations and universities of Ziyoli Avlod journal.'
      }
    },

    ru: {
      home: {
        title: 'Ziyoli Avlod - Научный журнал Узбекистана',
        description: 'Добро пожаловать на официальный сайт научного журнала Ziyoli Avlod. Будьте в курсе последних академических статей, исследований, новостей и событий.',
        keywords: 'Ziyoli Avlod, журнал, научный, академический, Узбекистан'
      },
      about: {
        title: 'О журнале - Ziyoli Avlod',
        description: 'Узнайте больше о научном журнале Ziyoli Avlod, его миссии, целях и истории.'
      },
      news: {
        title: 'Новости - Ziyoli Avlod',
        description: 'Последние новости и объявления журнала Ziyoli Avlod. Следите за самыми важными событиями в академическом мире.'
      },
      announcements: {
        title: 'Объявления - Ziyoli Avlod',
        description: 'Официальные объявления журнала Ziyoli Avlod. Получайте важные новости и объявления вовремя.'
      },
      events: {
        title: 'События - Ziyoli Avlod',
        description: 'Научные события, конференции и семинары, организованные журналом Ziyoli Avlod.'
      },
      issues: {
        title: 'Статьи и Публикации - Ziyoli Avlod',
        description: 'Все публикации, статьи и исследования журнала Ziyoli Avlod. Найдите нужную статью через поиск и фильтры.'
      },
      authors: {
        title: 'Авторы - Ziyoli Avlod',
        description: 'Список авторов, опубликованных в журнале Ziyoli Avlod. Просмотрите информацию об авторах и их публикации.'
      },
      'author-guide': {
        title: 'Руководство для авторов - Ziyoli Avlod',
        description: 'Рекомендации и инструкции для авторов, которые хотят публиковать статьи в журнале Ziyoli Avlod.'
      },
      'submit-article': {
        title: 'Подправка статьи - Ziyoli Avlod',
        description: 'Отправьте вашу статью в журнал Ziyoli Avlod. Полная форма и инструкции по необходимым документам.'
      },
      contact: {
        title: 'Контакты - Ziyoli Avlod',
        description: 'Свяжитесь с журналом Ziyoli Avlod. Email, телефон и ссылки на социальные сети.'
      },
      faq: {
        title: 'Часто задаваемые вопросы - Ziyoli Avlod',
        description: 'Часто задаваемые вопросы о журнале Ziyoli Avlod и их ответы.'
      },
      projects: {
        title: 'Проекты - Ziyoli Avlod',
        description: 'Научные проекты и программы, реализуемые журналом Ziyoli Avlod.'
      },
      'editorial-board': {
        title: 'Редакционная коллегия - Ziyoli Avlod',
        description: 'Члены редакционной коллегии журнала Ziyoli Avlod и их профессиональная деятельность.'
      },
      staff: {
        title: 'Редакционный персонал - Ziyoli Avlod',
        description: 'Редакционный персонал журнала Ziyoli Avlod и их обязанности.'
      },
      partners: {
        title: 'Партнеры - Ziyoli Avlod',
        description: 'Партнерские организации и университеты журнала Ziyoli Avlod.'
      }
    }
  }
};

// Helper function to get SEO config for a page
export function getPageSEO(locale = 'uz', pageName = 'home') {
  const localeConfig = seoConfig.pages[locale] || seoConfig.pages.uz;
  const pageConfig = localeConfig[pageName] || localeConfig.home;
  
  return {
    title: pageConfig.title || seoConfig.default.title,
    description: pageConfig.description || seoConfig.default.description,
    keywords: pageConfig.keywords || seoConfig.default.keywords,
    image: pageConfig.image || seoConfig.default.image,
    url: `https://ziyoliavlod.com/${locale}/${pageName === 'home' ? '' : pageName}`
  };
}
