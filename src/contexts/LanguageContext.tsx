import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru' | 'ge' | 'he' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    catalog: 'Catalog',
    aboutUs: 'About Us',
    rent: 'Rent',
    buy: 'Buy',
    projects: 'Projects',
    contacts: 'Contacts',
    
    // Hero
    heroTitle: 'From viewing to keys — without extra hassle',
    heroSubtitle: 'We will select, show and arrange — you just have to choose.',
    yourName: 'Your Name',
    email: 'Your Email',
    phone: 'Phone Number',
    submit: 'Submit',
    
    // Search
    searchLocation: 'Location',
    propertyType: 'Property Type',
    priceRange: 'Price Range',
    bedrooms: 'Bedrooms',
    searchButton: 'Search Properties',
    
    // Property Types
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    commercial: 'Commercial',
    
    // Featured Properties
    featuredProperties: 'Featured Properties',
    viewDetails: 'View Details',
    contactAgent: 'Contact Agent',
    
    // Why Trust Home
    whyTrustHome: 'Why Trust Home?',
    secureDeals: 'Secure Deals',
    secureDealsDesc: 'All transactions are legally protected with comprehensive insurance coverage',
    verifiedListings: 'Verified Listings',
    verifiedListingsDesc: 'Every property is thoroughly inspected and verified by our expert team',
    trustedDevelopers: 'Trusted Developers',
    trustedDevelopersDesc: 'We work only with reputable developers with proven track records',
    easyProcess: 'Easy Process',
    easyProcessDesc: 'Streamlined workflow from initial search to final key handover',
    
    // Reviews
    customerReviews: 'Customer Reviews',
    
    // Request Form
    leaveRequest: 'Leave a Request',
    requestSubtitle: 'Tell us about your preferences and we will select the perfect property for you',
    requestSubmit: 'Send Request',
    
    // Footer
    footerDescription: 'Trust Home - your reliable partner in real estate. We help find the perfect property for life and investment.',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Information',
    followUs: 'Follow Us',
    
    // Pages
    favorites: 'Favorites',
    propertiesFor: 'Properties for',
    forRent: 'For Rent',
    forSale: 'For Sale',
    developmentProjects: 'Development Projects',
    investmentOpportunities: 'Investment Opportunities',
    
    // About Us
    aboutUsTitle: 'About Trust Home',
    aboutUsContent: 'Trust Home is a leading real estate marketplace connecting buyers, sellers, and renters with their perfect properties. With years of experience in the market, we provide transparent, secure, and efficient property transactions.',
    ourMission: 'Our Mission',
    missionContent: 'To make real estate transactions simple, transparent, and trustworthy for everyone.',
    ourValues: 'Our Values',
    
    // Contact
    getInTouch: 'Get in Touch',
    address: 'Service Areas',
    workingHours: 'Working Hours',
    mondayFriday: 'Monday - Friday: 9:00 - 18:00',
    saturday: 'Saturday: 10:00 - 16:00',
    
    // Common
    from: 'from',
    usd: 'USD',
    perMonth: '/month',
    bedrooms_count: 'bedrooms',
    bathrooms: 'bathrooms',
    sqft: 'sq ft',
    viewProject: 'View Project',
    learnMore: 'Learn More',
    
    // Booking & Modal
    scheduleViewing: 'Schedule Viewing',
    selectDate: 'Select Date',
    preferredTime: 'Preferred Time',
    morning: 'Morning (9:00 - 12:00)',
    afternoon: 'Afternoon (12:00 - 17:00)',
    evening: 'Evening (17:00 - 20:00)',
    additionalComments: 'Additional Comments',
    viewingPreferences: 'Viewing Preferences',
    preferredLanguage: 'Preferred Language',
    numberOfPeople: 'Number of People',
    person: 'person',
    people: 'people',
    additionalServices: 'Additional Services',
    transportationService: 'Transportation Service',
    transportationDesc: 'We\'ll pick you up and take you to the viewing',
    refreshments: 'Refreshments',
    refreshmentsDesc: 'Power bank, drinks, snacks',
    specifyPreferences: 'Specify preferences...',
    specialConsiderations: 'Special Considerations',
    comingWithChildren: 'Coming with children',
    comingWithPets: 'Coming with pets',
    manageFavoritesTip: 'You can manage all your viewing appointments in the Favorites section',
    goToFavorites: 'Go to Favorites →',
    back: 'Back',
    continue: 'Continue',
    submitRequest: 'Submit Request',
    
    // Favorites
    scheduleViewings: 'Schedule Viewings',
    scheduleMultipleViewings: 'Schedule viewings for multiple properties at once',
    noFavoritesYet: 'No Favorites Yet',
    noFavoritesDesc: 'Start exploring our properties and click the heart icon to add them to your favorites.',
    browseProperties: 'Browse Properties',
    viewRentals: 'View Rentals',
    tipsForManaging: 'Tips for Managing Your Favorites',
    compareProperties: 'Compare Properties',
    comparePropertiesDesc: 'Use your favorites list to easily compare different properties side by side.',
    quickAccess: 'Quick Access',
    quickAccessDesc: 'Your favorites are saved and accessible from any device when you\'re signed in.',
    shareWithOthers: 'Share with Others',
    shareWithOthersDesc: 'Contact our agents to share your favorite properties with family or friends.',
    getNotifications: 'Get Notifications',
    getNotificationsDesc: 'We\'ll notify you if there are price changes or updates to your favorite properties.',
    
    // Enhanced Home Form
    description: 'Description',
    optional: 'Optional',
    desiredPriceRange: 'Desired Price Range',
    bookingPreferences: 'Booking Preferences',
    requestSent: 'Request sent! We will contact you soon',
    
    // Admin Panel
    displayCategories: 'Display Categories',
    showInBuy: 'Show in "Buy" section',
    showInRent: 'Show in "Rent" section',
    showInProjects: 'Show in "Projects" section',
    featuredProperty: 'Featured Property',
    showOnHomepage: 'Show on homepage',
    
    // Languages
    english: 'English',
    russian: 'Russian',
    georgian: 'Georgian',
    hebrew: 'Hebrew',
    arabic: 'Arabic',
  },
  ru: {
    // Navigation
    catalog: 'Каталог',
    aboutUs: 'О нас',
    rent: 'Аренда',
    buy: 'Покупка',
    projects: 'Проекты',
    contacts: 'Контакты',
    
    // Hero
    heroTitle: 'От просмотра до ключей — без лишних забот',
    heroSubtitle: 'Мы подберём, покажем и оформим — вам останется выбрать.',
    yourName: 'Ваше имя',
    email: 'Email',
    phone: 'Номер телефона',
    submit: 'Отправить',
    
    // Search
    searchLocation: 'Местоположение',
    propertyType: 'Тип недвижимости',
    priceRange: 'Ценовой диапазон',
    bedrooms: 'Спальни',
    searchButton: 'Поиск недвижимости',
    
    // Property Types
    apartment: 'Квартира',
    house: 'Дом',
    villa: 'Вилла',
    commercial: 'Коммерческая',
    
    // Featured Properties
    featuredProperties: 'Рекомендуемые объекты',
    viewDetails: 'Подробнее',
    contactAgent: 'Связаться с агентом',
    
    // Why Trust Home
    whyTrustHome: 'Почему Trust Home?',
    secureDeals: 'Безопасные сделки',
    secureDealsDesc: 'Все транзакции юридически защищены с полным страховым покрытием',
    verifiedListings: 'Проверенные объекты',
    verifiedListingsDesc: 'Каждая недвижимость тщательно проверена нашей командой экспертов',
    trustedDevelopers: 'Надёжные застройщики',
    trustedDevelopersDesc: 'Мы работаем только с проверенными застройщиками с безупречной репутацией',
    easyProcess: 'Простой процесс',
    easyProcessDesc: 'Упрощённый workflow от поиска до получения ключей',
    
    // Reviews
    customerReviews: 'Отзывы клиентов',
    
    // Request Form
    leaveRequest: 'Оставить заявку',
    requestSubtitle: 'Расскажите о своих предпочтениях, и мы подберём идеальную недвижимость для вас',
    requestSubmit: 'Отправить заявку',
    
    // Footer
    footerDescription: 'Trust Home - ваш надёжный партнёр в сфере недвижимости. Помогаем найти идеальную недвижимость для жизни и инвестиций.',
    quickLinks: 'Быстрые ссылки',
    contactInfo: 'Контактная информация',
    followUs: 'Следите за нами',
    
    // Pages
    propertiesFor: 'Недвижимость для',
    forRent: 'Аренды',
    forSale: 'Продажи',
    developmentProjects: 'Проекты застройки',
    investmentOpportunities: 'Инвестиционные возможности',
    
    // About Us
    aboutUsTitle: 'О Trust Home',
    aboutUsContent: 'Trust Home - ведущая платформа недвижимости, соединяющая покупателей, продавцов и арендаторов с их идеальной недвижимостью. Имея многолетний опыт работы на рынке, мы обеспечиваем прозрачные, безопасные и эффективные сделки с недвижимостью.',
    ourMission: 'Наша миссия',
    missionContent: 'Сделать сделки с недвижимостью простыми, прозрачными и надёжными для всех.',
    ourValues: 'Наши ценности',
    
    // Contact
    getInTouch: 'Связаться с нами',
    address: 'Зоны обслуживания',
    workingHours: 'Часы работы',
    mondayFriday: 'Понедельник - Пятница: 9:00 - 18:00',
    saturday: 'Суббота: 10:00 - 16:00',
    
    // Common
    from: 'от',
    usd: 'USD',
    perMonth: '/мес',
    bedrooms_count: 'спальни',
    bathrooms: 'ванные',
    sqft: 'кв. м',
    viewProject: 'Посмотреть проект',
    learnMore: 'Узнать больше',
    
    // Booking & Modal
    scheduleViewing: 'Назначить просмотр',
    selectDate: 'Выберите дату',
    preferredTime: 'Предпочтительное время',
    morning: 'Утро (9:00 - 12:00)',
    afternoon: 'День (12:00 - 17:00)',
    evening: 'Вечер (17:00 - 20:00)',
    additionalComments: 'Дополнительные комментарии',
    viewingPreferences: 'Предпочтения просмотра',
    preferredLanguage: 'Предпочтительный язык',
    numberOfPeople: 'Количество человек',
    person: 'человек',
    people: 'человек',
    additionalServices: 'Дополнительные услуги',
    transportationService: 'Транспортная услуга',
    transportationDesc: 'Мы заберем вас и отвезем на просмотр',
    refreshments: 'Угощения',
    refreshmentsDesc: 'Павербанк, напитки, снеки',
    specifyPreferences: 'Укажите предпочтения...',
    specialConsiderations: 'Особые пожелания',
    comingWithChildren: 'Приду с детьми',
    comingWithPets: 'Приду с питомцами',
    manageFavoritesTip: 'Вы можете управлять всеми записями на просмотр в разделе Избранное',
    goToFavorites: 'Перейти в Избранное →',
    back: 'Назад',
    continue: 'Продолжить',
    submitRequest: 'Отправить заявку',
    
    // Favorites
    scheduleViewings: 'Назначить просмотры',
    scheduleMultipleViewings: 'Возможность назначить просмотр сразу на несколько объектов',
    noFavoritesYet: 'Пока нет избранных',
    noFavoritesDesc: 'Начните изучать наши объекты и нажимайте на сердечко, чтобы добавить их в избранное.',
    browseProperties: 'Просмотреть объекты',
    viewRentals: 'Посмотреть аренду',
    tipsForManaging: 'Советы по управлению избранным',
    compareProperties: 'Сравнение объектов',
    comparePropertiesDesc: 'Используйте список избранного для легкого сравнения разных объектов.',
    quickAccess: 'Быстрый доступ',
    quickAccessDesc: 'Ваше избранное сохраняется и доступно с любого устройства при входе в систему.',
    shareWithOthers: 'Поделиться с другими',
    shareWithOthersDesc: 'Свяжитесь с нашими агентами, чтобы поделиться избранными объектами с семьей или друзьями.',
    getNotifications: 'Получать уведомления',
    getNotificationsDesc: 'Мы уведомим вас об изменениях цен или обновлениях ваших избранных объектов.',
    
    // Enhanced Home Form
    description: 'Описание',
    optional: 'Необязательно',
    desiredPriceRange: 'Желаемый ценовой диапазон',
    bookingPreferences: 'Предпочтения бронирования',
    requestSent: 'Заявка отправлена! Мы свяжемся с вами в ближайшее время',
    
    // Admin Panel
    displayCategories: 'Категории отображения',
    showInBuy: 'Показывать в разделе "Покупка"',
    showInRent: 'Показывать в разделе "Аренда"',
    showInProjects: 'Показывать в разделе "Проекты"',
    featuredProperty: 'Топовый объект',
    showOnHomepage: 'Показывать на главной странице',
    
    // Languages
    english: 'Английский',
    russian: 'Русский',
    georgian: 'Грузинский',
    hebrew: 'Иврит',
    arabic: 'Арабский',
  },
  ge: {
    // Navigation
    catalog: 'კატალოგი',
    aboutUs: 'ჩვენს შესახებ',
    rent: 'ქირავდება',
    buy: 'იყიდება',
    projects: 'პროექტები',
    contacts: 'კონტაქტები',
    
    // Hero
    heroTitle: 'დათვალიერებიდან გასაღებებამდე — ზედმეტი პრობლემების გარეშე',
    heroSubtitle: 'ჩვენ შევარჩევთ, გაჩვენებთ და გავაფორმებთ — თქვენ მხოლოდ უნდა აირჩიოთ.',
    yourName: 'თქვენი სახელი',
    email: 'ელ. ფოსტა',
    phone: 'ტელეფონის ნომერი',
    submit: 'გაგზავნა',
    
    // Search
    searchLocation: 'მდებარეობა',
    propertyType: 'უძრავი ქონების ტიპი',
    priceRange: 'ფასების დიაპაზონი',
    bedrooms: 'საძინებელი',
    searchButton: 'უძრავი ქონების ძებნა',
    
    // Property Types
    apartment: 'ბინა',
    house: 'სახლი',
    villa: 'ვილა',
    commercial: 'კომერციული',
    
    // Featured Properties
    featuredProperties: 'რჩეული ობიექტები',
    viewDetails: 'დეტალები',
    contactAgent: 'აგენტთან კავშირი',
    
    // Why Trust Home
    whyTrustHome: 'რატომ Trust Home?',
    secureDeals: 'უსაფრთხო გარიგებები',
    secureDealsDesc: 'ყველა ტრანზაქცია იურიდიულად დაცულია სრული სადაზღვეო დაცვით',
    verifiedListings: 'გადამოწმებული ობიექტები',
    verifiedListingsDesc: 'ყოველი ქონება საფუძვლიანად შემოწმებულია ჩვენი ექსპერტთა გუნდის მიერ',
    trustedDevelopers: 'სანდო დეველოპერები',
    trustedDevelopersDesc: 'ვმუშაობთ მხოლოდ სანდო დეველოპერებთან დადასტურებული რეპუტაციით',
    easyProcess: 'მარტივი პროცესი',
    easyProcessDesc: 'გამარტივებული workflow-ი ძიებიდან საბოლოო გასაღებების მიღებამდე',
    
    // Reviews
    customerReviews: 'მომხმარებელთა შეფასებები',
    
    // Request Form
    leaveRequest: 'მოთხოვნის დატოვება',
    requestSubtitle: 'მოგვითხარით თქვენს პრეფერენციებზე და ჩვენ შევარჩევთ თქვენთვის სრულყოფილ ქონებას',
    requestSubmit: 'მოთხოვნის გაგზავნა',
    
    // Footer
    footerDescription: 'Trust Home - თქვენი სანდო პარტნიორი უძრავი ქონების სფეროში. ვეხმარებით იპოვოთ სრულყოფილი ქონება ცხოვრებისა და ინვესტიციისთვის.',
    quickLinks: 'სწრაფი ბმულები',
    contactInfo: 'საკონტაქტო ინფორმაცია',
    followUs: 'გაგვყევით',
    
    // Pages
    propertiesFor: 'უძრავი ქონება',
    forRent: 'ქირავდება',
    forSale: 'იყიდება',
    developmentProjects: 'განვითარების პროექტები',
    investmentOpportunities: 'საინვესტიციო შესაძლებლობები',
    
    // About Us
    aboutUsTitle: 'Trust Home-ის შესახებ',
    aboutUsContent: 'Trust Home არის უძრავი ქონების წამყვანი მარკეტპლეისი, რომელიც აკავშირებს მყიდველებს, გამყიდველებს და მქირავნეებს მათ სრულყოფილ ქონებასთან. მრავალწლიანი გამოცდილებით ბაზარზე, ჩვენ უზრუნველვყოფთ გამჭვირვალე, უსაფრთხო და ეფექტურ უძრავი ქონების ტრანზაქციებს.',
    ourMission: 'ჩვენი მისია',
    missionContent: 'უძრავი ქონების ტრანზაქციები გავხადოთ მარტივი, გამჭვირვალე და სანდო ყველასთვის.',
    ourValues: 'ჩვენი ღირებულებები',
    
    // Contact
    getInTouch: 'დაგვიკავშირდით',
    address: 'მომსახურების ზონები',
    workingHours: 'სამუშაო საათები',
    mondayFriday: 'ორშაბათი - პარასკევი: 9:00 - 18:00',
    saturday: 'შაბათი: 10:00 - 16:00',
    
    // Common
    from: 'დან',
    usd: 'USD',
    perMonth: '/თვე',
    bedrooms_count: 'საძინებელი',
    bathrooms: 'სააბაზანო',
    sqft: 'კვ. მ',
    viewProject: 'პროექტის ნახვა',
    learnMore: 'მეტის გაგება',
    
    // Booking & Modal
    scheduleViewing: 'ნახვის დანიშვნა',
    selectDate: 'აირჩიეთ თარიღი',
    preferredTime: 'სასურველი დრო',
    morning: 'დილა (9:00 - 12:00)',
    afternoon: 'დღე (12:00 - 17:00)',
    evening: 'საღამო (17:00 - 20:00)',
    additionalComments: 'დამატებითი კომენტარები',
    viewingPreferences: 'ნახვის პრეფერენციები',
    preferredLanguage: 'სასურველი ენა',
    numberOfPeople: 'ადამიანების რაოდენობა',
    person: 'ადამიანი',
    people: 'ადამიანი',
    additionalServices: 'დამატებითი სერვისები',
    transportationService: 'ტრანსპორტის სერვისი',
    transportationDesc: 'ჩვენ მოგიყვანთ და წავიყვანთ ნახვაზე',
    refreshments: 'გამაგრილებელი',
    refreshmentsDesc: 'პაუერბანკი, სასმელები, სნეკები',
    specifyPreferences: 'მიუთითეთ პრეფერენციები...',
    specialConsiderations: 'სპეციალური მოთხოვნები',
    comingWithChildren: 'ბავშვებთან ერთად',
    comingWithPets: 'შინაური ცხოველებით',
    manageFavoritesTip: 'შეგიძლიათ მართოთ ყველა ნახვის ჩანაწერი რჩეულების განყოფილებაში',
    goToFavorites: 'რჩეულებში გადასვლა →',
    back: 'უკან',
    continue: 'გაგრძელება',
    submitRequest: 'მოთხოვნის გაგზავნა',
    
    // Favorites
    scheduleViewings: 'ნახვების დანიშვნა',
    scheduleMultipleViewings: 'რამდენიმე ობიექტზე ერთდროულად ნახვის დანიშვნის შესაძლებლობა',
    noFavoritesYet: 'ჯერ არ არის რჩეული',
    noFavoritesDesc: 'დაიწყეთ ჩვენი ობიექტების შესწავლა და დააჭირეთ გულს, რომ დაამატოთ რჩეულებში.',
    browseProperties: 'ობიექტების დათვალიერება',
    viewRentals: 'ქირავნობის ნახვა',
    tipsForManaging: 'რჩეულების მართვის რჩევები',
    compareProperties: 'ობიექტების შედარება',
    comparePropertiesDesc: 'გამოიყენეთ რჩეულების სია სხვადასხვა ობიექტების ადვილად შესადარებლად.',
    quickAccess: 'სწრაფი წვდომა',
    quickAccessDesc: 'თქვენი რჩეული ინახება და ხელმისაწვდომია ნებისმიერი მოწყობილობიდან შესვლისას.',
    shareWithOthers: 'სხვებთან გაზიარება',
    shareWithOthersDesc: 'დაუკავშირდით ჩვენს აგენტებს რჩეული ობიექტების ოჯახთან ან მეგობრებთან გასაზიარებლად.',
    getNotifications: 'შეტყობინებების მიღება',
    getNotificationsDesc: 'ჩვენ გაცნობებთ ფასების ცვლილებებზე ან თქვენი რჩეული ობიექტების განახლებებზე.',
    
    // Enhanced Home Form
    description: 'აღწერა',
    optional: 'არასავალდებულო',
    desiredPriceRange: 'სასურველი ფასების დიაპაზონი',
    bookingPreferences: 'ჯავშნის პრეფერენციები',
    requestSent: 'მოთხოვნა გაიგზავნა! ჩვენ დაგიკავშირდებით მალე',
    
    // Admin Panel
    displayCategories: 'ჩვენების კატეგორიები',
    showInBuy: 'ჩვენება "ყიდვის" განყოფილებაში',
    showInRent: 'ჩვენება "ქირავნობის" განყოფილებაში',
    showInProjects: 'ჩვენება "პროექტების" განყოფილებაში',
    featuredProperty: 'ტოპ ობიექტი',
    showOnHomepage: 'მთავარ გვერდზე ჩვენება',
    
    // Languages
    english: 'ინგლისური',
    russian: 'რუსული',
    georgian: 'ქართული',
    hebrew: 'ებრაული',
    arabic: 'არაბული',
  },
  he: {
    // Navigation
    catalog: 'קטלוג',
    aboutUs: 'אודותינו',
    rent: 'השכרה',
    buy: 'קנייה',
    projects: 'פרויקטים',
    contacts: 'צור קשר',
    
    // Hero
    heroTitle: 'מצפייה למפתחות — ללא טרחה מיותרת',
    heroSubtitle: 'אנחנו נבחר, נראה ונסדר — אתם רק צריכים לבחור.',
    yourName: 'השם שלכם',
    email: 'אימייל',
    phone: 'מספר טלפון',
    submit: 'שלח',
    
    // Search
    searchLocation: 'מיקום',
    propertyType: 'סוג נכס',
    priceRange: 'טווח מחירים',
    bedrooms: 'חדרי שינה',
    searchButton: 'חיפוש נכסים',
    
    // Property Types
    apartment: 'דירה',
    house: 'בית',
    villa: 'וילה',
    commercial: 'מסחרי',
    
    // Featured Properties
    featuredProperties: 'נכסים מומלצים',
    viewDetails: 'פרטים',
    contactAgent: 'צור קשר עם סוכן',
    
    // Why Trust Home
    whyTrustHome: 'למה Trust Home?',
    secureDeals: 'עסקאות בטוחות',
    secureDealsDesc: 'כל העסקאות מוגנות משפטית עם כיסוי ביטוח מקיף',
    verifiedListings: 'נכסים מאומתים',
    verifiedListingsDesc: 'כל נכס נבדק ומאומת ביסודיות על ידי צוות המומחים שלנו',
    trustedDevelopers: 'יזמים מהימנים',
    trustedDevelopersDesc: 'אנחנו עובדים רק עם יזמים מהימנים עם רקורד מוכח',
    easyProcess: 'תהליך קל',
    easyProcessDesc: 'זרימת עבודה מייעלת מחיפוש ראשוני ועד למסירת מפתחות',
    
    // Reviews
    customerReviews: 'ביקורות לקוחות',
    
    // Request Form
    leaveRequest: 'השאר בקשה',
    requestSubtitle: 'ספר לנו על ההעדפות שלך ואנחנו נבחר עבורך את הנכס המושלם',
    requestSubmit: 'שלח בקשה',
    
    // Footer
    footerDescription: 'Trust Home - השותף המהימן שלכם בנדל"ן. אנחנו עוזרים למצוא את הנכס המושלם לחיים ולהשקעה.',
    quickLinks: 'קישורים מהירים',
    contactInfo: 'פרטי התקשרות',
    followUs: 'עקבו אחרינו',
    
    // Pages
    favorites: 'מועדפים',
    propertiesFor: 'נכסים ל',
    forRent: 'השכרה',
    forSale: 'מכירה',
    developmentProjects: 'פרויקטי פיתוח',
    investmentOpportunities: 'הזדמנויות השקעה',
    
    // About Us
    aboutUsTitle: 'אודות Trust Home',
    aboutUsContent: 'Trust Home הוא שוק נדל"ן מוביל המחבר קונים, מוכרים ושוכרים עם הנכסים המושלמים שלהם. עם שנים של ניסיון בשוק, אנחנו מספקים עסקאות נדל"ן שקופות, בטוחות ויעילות.',
    ourMission: 'המשימה שלנו',
    missionContent: 'להפוך עסקאות נדל"ן לפשוטות, שקופות ומהימנות עבור כולם.',
    ourValues: 'הערכים שלנו',
    
    // Contact
    getInTouch: 'צור קשר',
    address: 'אזורי שירות',
    workingHours: 'שעות פעילות',
    mondayFriday: 'ראשון - חמישי: 9:00 - 18:00',
    saturday: 'שבת: 10:00 - 16:00',
    
    // Common
    from: 'מ',
    usd: 'USD',
    perMonth: '/חודש',
    bedrooms_count: 'חדרי שינה',
    bathrooms: 'חדרי רחצה',
    sqft: 'מ"ר',
    viewProject: 'צפה בפרויקט',
    learnMore: 'למד עוד',
    
    // Booking & Modal
    scheduleViewing: 'קבע צפייה',
    selectDate: 'בחר תאריך',
    preferredTime: 'זמן מועדף',
    morning: 'בוקר (9:00 - 12:00)',
    afternoon: 'אחר הצהריים (12:00 - 17:00)',
    evening: 'ערב (17:00 - 20:00)',
    additionalComments: 'הערות נוספות',
    viewingPreferences: 'העדפות צפייה',
    preferredLanguage: 'שפה מועדפת',
    numberOfPeople: 'מספר אנשים',
    person: 'אדם',
    people: 'אנשים',
    additionalServices: 'שירותים נוספים',
    transportationService: 'שירות הסעות',
    transportationDesc: 'אנחנו נאסוף אותך ונקח אותך לצפייה',
    refreshments: 'כיבוד',
    refreshmentsDesc: 'פאוור בנק, משקאות, חטיפים',
    specifyPreferences: 'ציין העדפות...',
    specialConsiderations: 'שיקולים מיוחדים',
    comingWithChildren: 'מגיע עם ילדים',
    comingWithPets: 'מגיע עם חיות מחמד',
    manageFavoritesTip: 'אתה יכול לנהל את כל פגישות הצפייה בקטע המועדפים',
    goToFavorites: 'עבור למועדפים →',
    back: 'חזור',
    continue: 'המשך',
    submitRequest: 'שלח בקשה',
    
    // Favorites
    scheduleViewings: 'קבע צפיות',
    scheduleMultipleViewings: 'קבע צפיות למספר נכסים בבת אחת',
    noFavoritesYet: 'אין מועדפים עדיין',
    noFavoritesDesc: 'התחל לחקור את הנכסים שלנו ולחץ על הלב כדי להוסיף אותם למועדפים.',
    browseProperties: 'עיין בנכסים',
    viewRentals: 'צפה בהשכרות',
    tipsForManaging: 'טיפים לניהול המועדפים',
    compareProperties: 'השווה נכסים',
    comparePropertiesDesc: 'השתמש ברשימת המועדפים כדי להשוות בקלות נכסים שונים.',
    quickAccess: 'גישה מהירה',
    quickAccessDesc: 'המועדפים שלך נשמרים וזמינים מכל מכשיר כשאתה מחובר.',
    shareWithOthers: 'שתף עם אחרים',
    shareWithOthersDesc: 'צור קשר עם הסוכנים שלנו כדי לשתף את הנכסים המועדפים עליך עם המשפחה או חברים.',
    getNotifications: 'קבל התראות',
    getNotificationsDesc: 'אנחנו נודיע לך אם יש שינויי מחיר או עדכונים לנכסים המועדפים עליך.',
    
    // Enhanced Home Form
    description: 'תיאור',
    optional: 'אופציונלי',
    desiredPriceRange: 'טווח מחירים רצוי',
    bookingPreferences: 'העדפות הזמנה',
    requestSent: 'הבקשה נשלחה! אנחנו ניצור איתך קשר בקרוב',
    
    // Admin Panel
    displayCategories: 'קטגוריות תצוגה',
    showInBuy: 'הצג בקטע "קנייה"',
    showInRent: 'הצג בקטע "השכרה"',
    showInProjects: 'הצג בקטע "פרויקטים"',
    featuredProperty: 'נכס מומלץ',
    showOnHomepage: 'הצג בעמוד הבית',
    
    // Languages
    english: 'אנגלית',
    russian: 'רוסית',
    georgian: 'גאורגית',
    hebrew: 'עברית',
    arabic: 'ערבית',
  },
  ar: {
    // Navigation
    catalog: 'الكتالوج',
    aboutUs: 'من نحن',
    rent: 'للإيجار',
    buy: 'للشراء',
    projects: 'المشاريع',
    contacts: 'اتصل بنا',
    
    // Hero
    heroTitle: 'من المشاهدة إلى المفاتيح — بدون متاعب إضافية',
    heroSubtitle: 'سنختار ونعرض ونرتب — عليك فقط أن تختار.',
    yourName: 'اسمك',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    submit: 'إرسال',
    
    // Search
    searchLocation: 'الموقع',
    propertyType: 'نوع العقار',
    priceRange: 'نطاق السعر',
    bedrooms: 'غرف النوم',
    searchButton: 'البحث عن العقارات',
    
    // Property Types
    apartment: 'شقة',
    house: 'منزل',
    villa: 'فيلا',
    commercial: 'تجاري',
    
    // Featured Properties
    featuredProperties: 'العقارات المميزة',
    viewDetails: 'التفاصيل',
    contactAgent: 'اتصل بالوكيل',
    
    // Why Trust Home
    whyTrustHome: 'لماذا Trust Home؟',
    secureDeals: 'صفقات آمنة',
    secureDealsDesc: 'جميع المعاملات محمية قانونياً مع تغطية تأمينية شاملة',
    verifiedListings: 'قوائم موثقة',
    verifiedListingsDesc: 'كل عقار يتم فحصه والتحقق منه بدقة من قبل فريق الخبراء لدينا',
    trustedDevelopers: 'مطورون موثوقون',
    trustedDevelopersDesc: 'نعمل فقط مع المطورين ذوي السمعة الطيبة والسجل المثبت',
    easyProcess: 'عملية سهلة',
    easyProcessDesc: 'سير عمل مبسط من البحث الأولي إلى تسليم المفاتيح النهائي',
    
    // Reviews
    customerReviews: 'آراء العملاء',
    
    // Request Form
    leaveRequest: 'اترك طلباً',
    requestSubtitle: 'أخبرنا عن تفضيلاتك وسنختار لك العقار المثالي',
    requestSubmit: 'إرسال الطلب',
    
    // Footer
    footerDescription: 'Trust Home - شريكك الموثوق في العقارات. نساعدك في العثور على العقار المثالي للحياة والاستثمار.',
    quickLinks: 'روابط سريعة',
    contactInfo: 'معلومات الاتصال',
    followUs: 'تابعنا',
    
    // Pages
    favorites: 'المفضلة',
    propertiesFor: 'عقارات لـ',
    forRent: 'للإيجار',
    forSale: 'للبيع',
    developmentProjects: 'مشاريع التطوير',
    investmentOpportunities: 'فرص الاستثمار',
    
    // About Us
    aboutUsTitle: 'حول Trust Home',
    aboutUsContent: 'Trust Home هو سوق عقاري رائد يربط المشترين والبائعين والمستأجرين بعقاراتهم المثالية. مع سنوات من الخبرة في السوق، نوفر معاملات عقارية شفافة وآمنة وفعالة.',
    ourMission: 'مهمتنا',
    missionContent: 'جعل المعاملات العقارية بسيطة وشفافة وموثوقة للجميع.',
    ourValues: 'قيمنا',
    
    // Contact
    getInTouch: 'تواصل معنا',
    address: 'مناطق الخدمة',
    workingHours: 'ساعات العمل',
    mondayFriday: 'الاثنين - الجمعة: 9:00 - 18:00',
    saturday: 'السبت: 10:00 - 16:00',
    
    // Common
    from: 'من',
    usd: 'دولار',
    perMonth: '/شهر',
    bedrooms_count: 'غرف نوم',
    bathrooms: 'حمامات',
    sqft: 'متر مربع',
    viewProject: 'عرض المشروع',
    learnMore: 'اعرف المزيد',
    
    // Booking & Modal
    scheduleViewing: 'جدولة المشاهدة',
    selectDate: 'اختر التاريخ',
    preferredTime: 'الوقت المفضل',
    morning: 'الصباح (9:00 - 12:00)',
    afternoon: 'بعد الظهر (12:00 - 17:00)',
    evening: 'المساء (17:00 - 20:00)',
    additionalComments: 'تعليقات إضافية',
    viewingPreferences: 'تفضيلات المشاهدة',
    preferredLanguage: 'اللغة المفضلة',
    numberOfPeople: 'عدد الأشخاص',
    person: 'شخص',
    people: 'أشخاص',
    additionalServices: 'خدمات إضافية',
    transportationService: 'خدمة النقل',
    transportationDesc: 'سنأتي لاصطحابك وأخذك للمشاهدة',
    refreshments: 'المرطبات',
    refreshmentsDesc: 'بنك الطاقة، المشروبات، الوجبات الخفيفة',
    specifyPreferences: 'حدد التفضيلات...',
    specialConsiderations: 'اعتبارات خاصة',
    comingWithChildren: 'القدوم مع الأطفال',
    comingWithPets: 'القدوم مع الحيوانات الأليفة',
    manageFavoritesTip: 'يمكنك إدارة جميع مواعيد المشاهدة في قسم المفضلة',
    goToFavorites: 'اذهب إلى المفضلة →',
    back: 'رجوع',
    continue: 'متابعة',
    submitRequest: 'إرسال الطلب',
    
    // Favorites
    scheduleViewings: 'جدولة المشاهدات',
    scheduleMultipleViewings: 'جدولة مشاهدات لعدة عقارات في وقت واحد',
    noFavoritesYet: 'لا توجد مفضلة بعد',
    noFavoritesDesc: 'ابدأ في استكشاف عقاراتنا واضغط على أيقونة القلب لإضافتها إلى المفضلة.',
    browseProperties: 'تصفح العقارات',
    viewRentals: 'عرض الإيجارات',
    tipsForManaging: 'نصائح لإدارة المفضلة',
    compareProperties: 'مقارنة العقارات',
    comparePropertiesDesc: 'استخدم قائمة المفضلة لمقارنة العقارات المختلفة بسهولة.',
    quickAccess: 'وصول سريع',
    quickAccessDesc: 'مفضلتك محفوظة ومتاحة من أي جهاز عند تسجيل الدخول.',
    shareWithOthers: 'شارك مع الآخرين',
    shareWithOthersDesc: 'اتصل بوكلائنا لمشاركة عقاراتك المفضلة مع العائلة أو الأصدقاء.',
    getNotifications: 'احصل على الإشعارات',
    getNotificationsDesc: 'سنخطرك إذا كانت هناك تغييرات في الأسعار أو تحديثات لعقاراتك المفضلة.',
    
    // Enhanced Home Form
    description: 'الوصف',
    optional: 'اختياري',
    desiredPriceRange: 'نطاق السعر المرغوب',
    bookingPreferences: 'تفضيلات الحجز',
    requestSent: 'تم إرسال الطلب! سنتواصل معك قريباً',
    
    // Admin Panel
    displayCategories: 'فئات العرض',
    showInBuy: 'عرض في قسم "الشراء"',
    showInRent: 'عرض في قسم "الإيجار"',
    showInProjects: 'عرض في قسم "المشاريع"',
    featuredProperty: 'عقار مميز',
    showOnHomepage: 'عرض في الصفحة الرئيسية',
    
    // Languages
    english: 'الإنجليزية',
    russian: 'الروسية',
    georgian: 'الجورجية',
    hebrew: 'العبرية',
    arabic: 'العربية',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};