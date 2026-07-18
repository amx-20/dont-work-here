// =====================================================
// TRANSLATION DICTIONARY
// Every piece of on-screen text on the whole site lives here,
// in two versions: "ar" (Arabic) and "en" (English).
//
// TO CHANGE ANY WORDING: find the key (the word before the colon,
// like "heroTitle") and edit the text after it. Both language
// versions use the SAME keys, so whatever you rename/add on one
// side, do the same on the other side too.
//
// dir: "rtl" / "ltr" tells the page which reading direction to
// use for that language — this is what flips the whole layout.
// =====================================================
const translations = {
  ar: {
    dir: "rtl",
    tagline: "تجارب حقيقية من موظفين، قبل ما تقدّم.",                    // small text under the logo
    heroTitle: "هل تستاهل الشركة إنك تشتغل فيها؟",                       // main headline, first half
    heroTitleEm: "اسأل اللي اشتغلوا فيها قبلك.",                          // main headline, highlighted half
    heroSub: "تقييمات مجهولة من موظفين حاليين وسابقين في شركات الكول سنتر في مصر — المرتب، جو الشغل، الشيفتات، وكل حاجة الإعلان الوظيفي مش هيقولهالك.",  // paragraph under headline
    statCompanies: "شركة",                                              // label under the "companies" count
    statReviews: "تقييم",                                               // label under the "reviews" count
    browseCompanies: "تصفح الشركات",                                    // heading above the company grid
    sortedBy: "مرتبة حسب عدد التقييمات",                                // small caption next to that heading
    reviewsWord: "تقييم",                                               // used on each card, e.g. "5 تقييم"                                     // used on each card next to the %
    backLink: "→ رجوع لكل الشركات",                                     // link on the company page back to homepage
    companySubtitle: "تقييمات من موظفين حاليين وسابقين",                // subtitle on the company page
    avgRating: "متوسط التقييم",                                         // stat label: average rating
    reviewsCount: "عدد التقييمات",                                      // stat label: review count
    pros: "مميزاتها",                                                  // "Pros" heading on each review
    cons: "عيوبها",                                                  // "Cons" heading on each review
    duration: "مدة الشغل", 
    ratingDistribution: "توزيع التقييمات",                        // small label above the bar chart on each card
    branchWord: "فرع", 
    seeMore: "اقرأ المزيد",
    seeLess: "أقل",// used next to branch count, e.g. "٣ فرع"
    footer:"جميع التقييمات المنشورة تعبر عن آراء وتجارب أصحابها الشخصية، ولا تمثل رأي هذا الموقع أو أي من الشركات المذكورة.",  // bottom disclaimer
    loading: "بنجيب البيانات...",  
    catSalary: "المرتب",
    catManagement: "الإدارة",
    catTraining: "التدريب",
    catCareer: "فرص الترقي",
    catCulture: "بيئة العمل",
    tabOverview: "نظرة عامة",
    tabReviews: "التقييمات",
    aboutContactTitle: "تواصل معايا",
    aboutContactText: "لو عندك أي سؤال، اقتراح، أو حابب تتواصل، تقدر توصلني من خلال:",  
    catWorkLife: "التوازن بين الشغل والحياة",
    categoryBreakdown: "نقاط القوة والضعف"  ,                                   // shown briefly while data.json loads
    noReviews: "لسه مفيش تقييمات للشركة دي."   ,                       // shown if a company has 0 reviews
    aboutStoryTitle: "ليه عملت الموقع ده؟",
    navHome: "الرئيسية",
    navAbout: "عن الموقع",
    navSubmit: "أضف تقييم",
    navCompare: "قارن بين الشركات",
    notEnoughData: "لسه مفيش بيانات كافية لعرض تفاصيل التقييم.",
    submitTitle: "شارك تجربتك",
    submitDesc: "تقييمك هيكون مجهول تماماً ومش هياخد أكتر من 3 دقايق.",
    formCompany: "اسم الشركة",
    formCompanySelect: "اختار الشركة...",
    formOther: "أخرى",
    formBranch: "الفرع / المدينة",
    formBranchPh: "مثال: المعادي، الإسكندرية",
    formAccount: "الأكاونت / المشروع",
    formAccountPh: "مثال: Vodafone UK, Microsoft",
    formJobTitle: "المسمى الوظيفي",
    formJobTitlePh: "مثال: Customer Service Advisor",
    formStatus: "حالة العمل",
    formStatusCurrent: "موظف حالي",
    formStatusFormer: "موظف سابق",
    formStartDate: "تاريخ البداية",
    formStartDatePh: "مثال: يناير 2024",
    formEndDate: "تاريخ النهاية",
    formEndDatePh: "حتى الآن",
    formRateTitle: "قيّم تجربتك",
    formPerksTitle: "الامتيازات اللي الشركة بتوفرها",
    formMoreTitle: "قولنا تفاصيل أكتر",
    formProsPh: "إيه أكتر حاجة عجبتك في الشغل هناك؟",
    formConsPh: "اذكر المشاكل أو العيوب، أو أي تجربة سلبية حابب الناس تعرفها",
    formRec: "هل تنصح غيرك يشتغل في الشركة دي؟",
    formRecYes: "👍 أيوه",
    formRecNo: "👎 لأ",
    formSubmitBtn: "إرسال التقييم",
    formAnonNote: "🔒 إحنا مش بنسجل اسمك أو إيميلك مع التقييم.",
    formDuplicate: "أنت قيمت الشركة دي قبل كده من نفس الجهاز.",
    formConfirmTitle: "شكراً على تقييمك!",
    formConfirmDesc: "هيظهر في صفحة الشركة خلال دقايق.",
    formConfirmBtn: "تصفح الشركات",
    perkTransport: "🚌 مواصلات",
    perkMedical: "🏥 تأمين طبي",
    perkBonus: "💰 بونص",
    perkWFH: "🏠 شغل من البيت",
    formDuration: "قضيت قد إيه في الشركة؟",
    formDurationSelect: "اختار المدة...",
    dur1: "أقل من ٦ شهور",
    dur2: "من ٦ شهور لسنة",
    dur3: "من سنة لسنة ونص",
    dur4: "سنتين أو أكتر",
    formCompanyCustomPh: "اكتب اسم الشركة...",
    formBranchSelectInitial: "اختار الشركة الأول...",
    formBranchSelect: "اختار الفرع...",
    formBranchOther: "فرع تاني...",
    formBranchCustomPh: "اكتب اسم الفرع أو المدينة...",
    compareTitle: "قارن بين الشركات",
    compareDesc: "اختار شركتين عشان تشوف الفرق بينهم في كل حاجة.",
    compareEmptyState: "اختار شركتين عشان تبدأ المقارنة.",
    comparePickCompany: "اختار شركة",
    comparePickSearch: "دور على شركة...",
    compareAddCompany: "إضافة شركة",
    companyIndustry: "القطاع",
    companyFounded: "سنة التأسيس",
    companyHeadquarters: "المقر الرئيسي",
    companyBranches: "الفروع",
    companyCountries: "الدول",
    companyEmployees: "عدد الموظفين",
    companyWorkModel: "نظام العمل",
    companyLanguages: "اللغات",
    companyWebsite: "روابط",
    companyLinkedIn: "لينكدإن",
    companyWikipedia: "ويكيبيديا",
    anonymousReviewer: "موظف مجهول",
    rateCompanyBtn: "قيّم الشركة",
    aboutStoryP1:
    "فكرة الموقع بدأت بسؤال بسيط: هل فعلًا شركات الكول سنتر في مصر سيئة زي ما الناس بتقول؟",
    aboutStoryP2:
    "أي حد دور على شغل في الكول سنتر أكيد شاف بوستات وتعليقات وقصص كتير على فيسبوك. ناس بتحكي عن تجارب سيئة جدًا، وناس تانية بتقول إن الشغل كان بداية كويسة لمستقبلهم. لكن صعب تعرف الحقيقة وسط كل الآراء دي.",
    aboutStoryP3:
    "معظم المعلومات موجودة بشكل عشوائي في جروبات ومنشورات قديمة، وكلها مبنية على تجارب فردية. الهدف من الموقع هو جمع آراء الموظفين الحاليين والسابقين في مكان واحد بشكل منظم وشفاف.",
    aboutStoryP4:
    "الموقع مش معمول عشان يهاجم شركة أو يروج لشركة، لكنه معمول عشان يساعد أي شخص بيدور على شغل ياخد قرار وهو عنده معلومات حقيقية، وفي نفس الوقت يوضح للشركات نقاط القوة والضعف من وجهة نظر الموظفين.",
    aboutStoryP5:
    "كل تقييم صادق بيخلي الموقع أكثر فائدة. ومع الوقت نقدر نبني أكبر مصدر موثوق لمراجعات شركات الكول سنتر في مصر."
  },
  en: {
    dir: "ltr",
    tagline: "Real employee experiences, before you apply.",
    heroTitle: "Should you work there?",
    heroTitleEm: "Ask the people who already did.",
    heroSub: "Anonymous reviews from current and former call center employees across Egypt — pay, culture, shifts, and everything the job ad won't tell you.",
    statCompanies: "Companies",
    statReviews: "Reviews",
    browseCompanies: "Browse companies",
    sortedBy: "sorted by review count",
    reviewsWord: "Reviews",
    tabOverview: "Overview",
    tabReviews: "Reviews",
    backLink: "← Back to all companies",
    companySubtitle: "Reviews from current and former employees",
    avgRating: "Average rating",
    reviewsCount: "Reviews",
    pros: "Pros",
    cons: "Cons",
    duration: "Time at company",
    ratingDistribution: "Rating Distribution",
    branchWord: "branches",
    footer: "Reviews reflect the personal opinions of their authors and do not represent the views of this website or the companies listed.",
    loading: "Loading reviews...",
    seeMore: "See more",
    seeLess: "See less",catSalary: "Salary",
    catManagement: "Management",
    catTraining: "Training",
    catCareer: "Career Growth",
    catCulture: "Company Culture",
    catWorkLife: "Work-Life Balance",
    categoryBreakdown: "Strengths & Weaknesses",
    noReviews: "No reviews for this company yet.",
    aboutStoryTitle: "Why This Project Exists",
    navHome: "Home",
    navAbout: "About",
    navCompare: "Compare Companies",
    navSubmit: "Submit a Review",
    submitTitle: "Share your experience",
    submitDesc: "Your review is completely anonymous. Takes about 3 minutes.",
    formCompany: "Company Name",
    formCompanySelect: "Select a company...",
    formOther: "Other",
    formBranch: "Branch / City",
    formBranchPh: "e.g. Cairo, Alexandria",
    formAccount: "Account / Project",
    formAccountPh: "e.g. Microsoft, Vodafone UK",
    formJobTitle: "Job Title",
    formJobTitlePh: "e.g. Customer Service Advisor",
    formStatus: "Employment Status",
    formStatusCurrent: "Current Employee",
    formStatusFormer: "Former Employee",
    formStartDate: "Start Date",
    formStartDatePh: "e.g. Jan 2024",
    formEndDate: "End Date",
    formEndDatePh: "Present",
    formRateTitle: "Rate your experience",
    formPerksTitle: "Perks & benefits provided",
    formMoreTitle: "Tell us more",
    formProsPh: "What did you like about working here?",
    formConsPh: "What could be improved?",
    formRec: "Would you recommend this company to a friend?",
    formRecYes: "👍 Yes",
    formRecNo: "👎 No",
    formSubmitBtn: "Submit Review",
    formAnonNote: "🔒 We never collect your name or email with your review.",
    formDuplicate: "You've already submitted a review for this company from this device.",
    formConfirmTitle: "Thank you for your review!",
    formConfirmDesc: "It'll appear on the company page shortly — usually within a few minutes.",
    formConfirmBtn: "Browse Companies",
    perkTransport: "🚌 Transportation",
    perkMedical: "🏥 Medical Insurance",
    perkBonus: "💰 Bonus",
    perkWFH: "🏠 Work from Home",
    formDuration: "How long did you work there?",
    formDurationSelect: "Select duration...",
    dur1: "Less than 6 months",
    dur2: "6 months to 1 year",
    dur3: "1 to 1.5 years",
    dur4: "2+ years",
    companyIndustry: "Industry",
    companyFounded: "Founded",
    companyHeadquarters: "Headquarters",
    companyBranches: "Branches",
    companyCountries: "Countries",
    companyEmployees: "Employees",
    companyWorkModel: "Work Model",
    companyLanguages: "Main Languages",
    companyWebsite: "Links",
    companyLinkedIn: "LinkedIn",
    companyWikipedia: "Wikipedia",
    formCompanyCustomPh: "Type company name...",
    formBranchSelectInitial: "Select a company first...",
    formBranchSelect: "Select branch...",
    formBranchOther: "Other branch...",
    formBranchCustomPh: "Type your branch/city...",
    notEnoughData: "Not enough data yet to show a detailed breakdown.",
    compareTitle: "Compare Companies",
    compareDesc: "Pick two companies to see how they stack up against each other.",
    compareEmptyState: "Select two companies to start comparing.",
    comparePickCompany: "Select a company",
    comparePickSearch: "Search...",
    compareAddCompany: "Add Company",
    anonymousReviewer: "Anonymous Employee",
    rateCompanyBtn: "Rate this company",
    aboutStoryP1:
    "The idea for Call Center Reviews Egypt started with a simple question: Are call centers in Egypt really as bad as people say?",
    aboutStoryP2:
    "If you've ever searched for a call center job, you've probably seen countless Facebook posts, comments, and stories. Some people describe terrible experiences, while others say their job helped them build a successful career. It's difficult to know what's actually true.",
    aboutStoryP3:
    "Most information is scattered across social media and based on individual opinions. This project aims to collect anonymous reviews in one place so employees can share their real experiences in a structured and transparent way.",
    aboutStoryP4:
    "The goal isn't to promote or attack any company. It's to help job seekers make informed decisions while giving companies valuable feedback about what they're doing well and what they can improve.",
    aboutStoryP5:
    "Every honest review makes this platform more useful. Together, we can build the most trusted source of information about Egypt's call center industry.",
    aboutContactTitle: "Get in touch",
    aboutContactText: "If you have a question, suggestion, or just want to reach out, you can find me here:" }
};

// =====================================================
// SAVED PREFERENCES (LANGUAGE + THEME)
// The visitor's choice is saved in their browser's storage
// (localStorage), so it carries over between index.html and
// company.html, and stays remembered next time they visit.
// If nothing is saved yet, Arabic + dark are the defaults.
// =====================================================
function getLang() {
  return localStorage.getItem("ccr_lang") || "ar";
}
function getTheme() {
  return localStorage.getItem("ccr_theme") || "dark";
}

// Called when the language button is clicked — saves the new
// choice, then immediately re-applies it to the page.
function setLang(lang) {
  localStorage.setItem("ccr_lang", lang);
  applyLang();
}

// Called when the theme button is clicked — same idea, for theme.
function setTheme(theme) {
  localStorage.setItem("ccr_theme", theme);
  applyTheme();
}

// =====================================================
// APPLY LANGUAGE TO THE PAGE
// This is the function that actually does the work of
// switching everything to Arabic or English:
// - sets the page's lang/dir attributes (affects text direction)
// - adds/removes the "rtl" class on <body> (used by css/style.css
//   to swap in Arabic fonts)
// - finds every element with data-i18n="something" and fills in
//   the matching text from the dictionary above
// - updates the button's own label (shows "EN" when in Arabic
//   mode, since that's what you'd switch TO)
// =====================================================
// =====================================================
// APPLY LANGUAGE TO THE PAGE
// =====================================================
function applyLang() {
  const lang = getLang();
  const t = translations[lang];
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", t.dir);
  document.body.classList.toggle("rtl", t.dir === "rtl");

  // 1. Fill in every standard text element tagged with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // 2. Fill in input placeholders tagged with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) el.setAttribute("placeholder", t[key]);
  });

  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) toggleBtn.textContent = lang === "ar" ? "EN" : "AR";
}
// =====================================================
// APPLY THEME TO THE PAGE
// Sets data-theme="dark" or "light" on the page (this is what
// css/style.css reads to pick the right color palette), and
// updates the theme button's icon (☀ = "switch to light" shown
// while in dark mode, ☾ = "switch to dark" shown while in light mode).
// =====================================================
function applyTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);
  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀" : "☾";
}

// =====================================================
// STARTUP
// Runs once, as soon as the page loads:
// 1. Applies the saved language and theme immediately
// 2. Connects the two buttons so clicking them actually
//    toggles between Arabic/English and dark/light
// =====================================================
function initLangAndTheme() {
  applyLang();
  applyTheme();

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      setLang(getLang() === "ar" ? "en" : "ar");
    });
  }

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }
}

// Waits until the page's HTML has fully loaded before running the setup above
document.addEventListener("DOMContentLoaded", initLangAndTheme);
