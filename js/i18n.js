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
    heroSub: "تقييمات مجهولة من موظفين حاليين وسابقين في شركات الكول سنتر بمصر — المرتب، جو الشغل، الشيفتات، وكل حاجة الإعلان الوظيفي مش هيقولهالك.",  // paragraph under headline
    statCompanies: "شركة",                                              // label under the "companies" count
    statReviews: "تقييم",                                               // label under the "reviews" count
    browseCompanies: "تصفح الشركات",                                    // heading above the company grid
    sortedBy: "مرتبة حسب عدد التقييمات",                                // small caption next to that heading
    reviewsWord: "تقييم",                                               // used on each card, e.g. "5 تقييم"
    recommendPct: "بينصحوا بيها",                                       // used on each card next to the %
    backLink: "→ رجوع لكل الشركات",                                     // link on the company page back to homepage
    companySubtitle: "تقييمات من موظفين حاليين وسابقين",                // subtitle on the company page
    avgRating: "متوسط التقييم",                                         // stat label: average rating
    reviewsCount: "عدد التقييمات",                                      // stat label: review count
    wouldRecommend: "بينصحوا بيها",                                     // stat label: recommend %
    pros: "مميزاتها",                                                  // "Pros" heading on each review
    cons: "عيوبها",                                                  // "Cons" heading on each review
    duration: "مدة الشغل",                                              // duration label on each review
    footer: "المشروع بيعرض بيانات حقيقية من نموذج مجهول — مش تابع لأي شركة مذكورة هنا.",  // bottom disclaimer
    loading: "بنجيب البيانات...",                                       // shown briefly while data.json loads
    noReviews: "لسه مفيش تقييمات للشركة دي."                            // shown if a company has 0 reviews
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
    recommendPct: "recommend",
    backLink: "← Back to all companies",
    companySubtitle: "Reviews from current and former employees",
    avgRating: "Average rating",
    reviewsCount: "Reviews",
    wouldRecommend: "Would recommend",
    pros: "Pros",
    cons: "Cons",
    duration: "Time at company",
    footer: "This project displays real data from an anonymous form — not affiliated with any company listed here.",
    loading: "Loading reviews...",
    noReviews: "No reviews for this company yet."
  }
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
function applyLang() {
  const lang = getLang();
  const t = translations[lang];
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", t.dir);
  document.body.classList.toggle("rtl", t.dir === "rtl");

  // Fill in every element tagged with data-i18n="key"
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
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
