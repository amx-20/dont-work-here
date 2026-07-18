// =====================================================
// READ THE COMPANY NAME FROM THE URL
// This page is loaded like: company.html?company=Concentrix
// This grabs "Concentrix" out of the address bar so we know
// which company's reviews to show.
// =====================================================
/**
/**
 * Global helper to generate your 3D star SVG.
 * @param {string} uniqueId - Unique string (e.g., 'header-1', 'row-5')
 * @param {number} size - Optional size (default 16)
 * @param {boolean} isFilled - True for gold, false for gray
 */
function getStarSvg(uniqueId, size = 16, isFilled = true) {
  const gradId = `star-grad-${uniqueId}`;
  const filterId = `star-shadow-${uniqueId}`;
  const fill = isFilled ? `url(#${gradId})` : '#d1d5db'; // #d1d5db is a nice light gray
  const filter = isFilled ? `filter="url(#${filterId})"` : '';
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#FF8C00" />
        </linearGradient>
        <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path fill="${fill}" ${filter} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  `;
}
const params = new URLSearchParams(window.location.search);
const companyName = params.get("company");
// Pre-fill the "Rate this company" link so clicking it lands on the
// submit page with this exact company already selected.
document.addEventListener("DOMContentLoaded", () => {
  const rateBtn = document.getElementById("rate-company-btn");
  if (rateBtn) rateBtn.href = `submit-review.html?company=${encodeURIComponent(companyName)}`;
});
// Sanitizes user input to prevent HTML/Javascript injection
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
// Holds the list of reviews for THIS company only, once data.json
// has been downloaded and filtered. Starts empty.
let companyReviews = [];

// The 6 new category questions, in the order they should appear
// on the radar chart and in each review's tooltip.
const CATEGORY_FIELDS = [
  { key: "salary_rating", label: "catSalary" },
  { key: "management_rating", label: "catManagement" },
  { key: "training_rating", label: "catTraining" },
  { key: "career_rating", label: "catCareer" },
  { key: "culture_rating", label: "catCulture" },
  { key: "work_life_rating", label: "catWorkLife" }
];

// Averages each category ACROSS all of a company's reviews (for the radar chart).
// Reviews submitted before this feature existed simply won't have these fields —
// they're safely ignored rather than counted as zero.
function categoryAverages(reviews) {
  return CATEGORY_FIELDS.map(cat => {
    const values = reviews.map(r => Number(r[cat.key])).filter(v => !isNaN(v) && v > 0);
    const avg = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    return { ...cat, avg };
  });
}

// Averages the 6 categories for ONE review only (for that review's star display).
// Returns null if this review has none of the new fields (old review).
function categoryAverageForReview(r) {
  const values = CATEGORY_FIELDS.map(c => Number(r[c.key])).filter(v => !isNaN(v) && v > 0);
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

// Turns "Raya CX" into "raya-cx" — same convention used on the homepage,
// so the same logo files work here too, no separate upload needed.
function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

// Builds the auto-generated Overview sentence, e.g.
// "Teleperformance has an employee rating of 3.6 out of 5, based on 94
// reviews. Rated highest on Work-Life Balance with 4.1, and lowest on
// Salary & Benefits with 3.1."
function buildSummarySentence(companyRating, reviewCount, validCats) {
  const t = translations[getLang()];
  if (validCats.length === 0) return t.notEnoughData;

  const highest = validCats.reduce((a, b) => (b.avg > a.avg ? b : a));
  const lowest = validCats.reduce((a, b) => (b.avg < a.avg ? b : a));

  if (getLang() === "ar") {
    return `شركة ${companyName} بتقييم موظفين <strong>${companyRating.toFixed(1)} من ٥</strong>، بناءً على ${reviewCount} تقييم.
      أعلى تقييم في <strong>${t[highest.label]}</strong> بـ ${highest.avg.toFixed(1)} من ٥،
      وأقل تقييم في <strong>${t[lowest.label]}</strong> بـ ${lowest.avg.toFixed(1)} من ٥.`;
  }
  return `${companyName} has an employee rating of <strong>${companyRating.toFixed(1)} out of 5</strong>, based on ${reviewCount} reviews.
    Rated highest on <strong>${t[highest.label]}</strong> with ${highest.avg.toFixed(1)},
    and lowest on <strong>${t[lowest.label]}</strong> with ${lowest.avg.toFixed(1)}.`;
}

// Builds the Reviews tab's summary box: logo, big rating number + stars,
// review count, and a stacked list of all 6 category scores.
function reviewsSummaryBoxHtml(companyRating, reviewCount, catAvgs, radarSvg) {
  const t = translations[getLang()];
  const filled = Math.round(companyRating);
  
  // Create the 5 stars for the header (Gold for filled, Gray for empty)
  const starsRow = Array.from({ length: 5 }, (_, i) => 
    getStarSvg(`header-${i}`, 18, i < filled)
  ).join("");

  const rows = catAvgs.map((c, index) => `
    <div class="cat-list-row">
      <span class="cat-list-star">${getStarSvg(`row-${index}`, 16, true)}</span>
      <span class="cat-list-num">${c.avg > 0 ? c.avg.toFixed(1) : "—"}</span>
      <span class="cat-list-label">${t[c.label]}</span>
    </div>
  `).join("");

  return `
    <div class="reviews-summary-box">
      <div class="reviews-summary-header clickable" onclick="this.parentElement.classList.toggle('expanded')">
        <div class="reviews-summary-toprow">
          <span class="reviews-summary-num">${companyRating > 0 ? companyRating.toFixed(1) : "—"}</span>
          <span class="reviews-summary-stars" style="display: flex;">${starsRow}</span>
          <span class="reviews-summary-count">(${reviewCount} ${t.reviewsWord})</span>
        </div>
        <span class="summary-expand-icon">🔽</span>
      </div>
      
      <div class="ratings-layout collapsible-area">
        <div class="ratings-left">
          <div class="cat-list">${rows}</div>
        </div>
        <div class="ratings-right">
          <h4 data-i18n="categoryBreakdown"></h4>
          ${radarSvg}
        </div>
      </div>
    </div>
  `;
}
function companyOverviewHtml(info) {

  const t = translations[getLang()];
  const rows = [];

  function addRow(label, value) {
    if (!value) return;
    rows.push(`
      <div class="overview-row">
        <span class="overview-label">${label}:</span>
        <span class="overview-value">${value}</span>
      </div>
    `);
  }

addRow(t.companyIndustry, info.industry);
addRow(t.companyFounded, info.founded);
addRow(t.companyHeadquarters, info.headquarters);
addRow(t.companyEmployees, info.employees_worldwide);
addRow(t.companyCountries, info.countries);
addRow(t.companyWorkModel, info.work_model);

return `
<div class="overview-card">

  <p class="overview-description">
    ${info.description || ""}
  </p>

  <div class="overview-table">
    ${rows.join("")}
  </div>

  ${
    Array.isArray(info.egypt_branches) && info.egypt_branches.length
      ? `
      <div class="overview-section">
        <h4>${t.companyBranches}</h4>
        <div class="overview-pills">
          ${info.egypt_branches.map(branch => `
            <span class="overview-pill">${branch}</span>
          `).join("")}
        </div>
      </div>
      `
      : ""
  }

  ${
    Array.isArray(info.languages) && info.languages.length
      ? `
      <div class="overview-section">
        <h4>${t.companyLanguages}</h4>
        <div class="overview-pills">
          ${info.languages.map(language => `
            <span class="overview-pill">${language}</span>
          `).join("")}
        </div>
      </div>
      `
      : ""
  }
<div class="overview-section">
  <h4>${t.companyWebsite}</h4>
  <div class="overview-links">

    ${
      info.website
        ? `
    <a href="${info.website}" target="_blank" aria-label="Website">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>
      <path d="M15 3h6v6"/>
      <path d="M10 14L21 3"/>
    </svg>
    </a>`
        : ""
    }

    ${
      info.linkedin
        ? `
    <a href="${info.linkedin}" target="_blank" aria-label="LinkedIn">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2 3.77-2 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21H9z"/>
    </svg>
    </a>`
        : ""
    }

    ${
      info.facebook
        ? `
    <a href="${info.facebook}" target="_blank" aria-label="Facebook">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
    </svg>
    </a>`
        : ""
    }

    ${
      info.wikipedia
        ? `
    <a href="${info.wikipedia}" target="_blank" aria-label="Wikipedia">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6h2l2.5 9L11 8h2l2.5 7L18 6h2l-3.8 12h-1.7L12 11l-2.5 7H7.8L4 6z"/>
    </svg>
    </a>`
        : ""
    }

    ${
      info.glassdoor
        ? `
    <a href="${info.glassdoor}" target="_blank" aria-label="Glassdoor">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm5 0h4v4h-4V4zm0 5h4v11h-4V9zm5 7h2v4h-7v-2h5v-2z"/>
    </svg>
    </a>`
        : ""
    }

  </div>

</div>
`;
}
// Turns a raw timestamp like "2026-07-08T20:31:24.000Z" into
// "3 months ago" / "منذ 3 شهور", based on the currently active language.
function timeAgo(dateStr) {
  const lang = getLang();
  const then = new Date(dateStr);
  if (isNaN(then)) return "";

  const diffMin = Math.floor((new Date() - then) / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (lang === "ar") {
    if (diffMin < 1) return "الآن";
    if (diffHr < 1) return `منذ ${diffMin} ${diffMin === 1 ? "دقيقة" : "دقايق"}`;
    if (diffDay < 1) return `منذ ${diffHr} ${diffHr === 1 ? "ساعة" : "ساعات"}`;
    if (diffMonth < 1) return `منذ ${diffDay} ${diffDay === 1 ? "يوم" : "أيام"}`;
    if (diffYear < 1) return `منذ ${diffMonth} ${diffMonth === 1 ? "شهر" : "شهور"}`;
    return `منذ ${diffYear} ${diffYear === 1 ? "سنة" : "سنين"}`;
  }

  if (diffMin < 1) return "Just now";
  if (diffHr < 1) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffDay < 1) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffMonth < 1) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffYear < 1) return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
  return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}

function categoryStarsHtml(avg) {
  const filled = Math.round(avg);

  let html = "";

  for (let i = 1; i <= 5; i++) {
    html += getStarSvg(
      `review-${filled}-${i}-${Math.random().toString(36).slice(2,8)}`,
      18,
      i <= filled
    );
  }

  return html;
}

// Builds the tooltip content showing each individual category as stars
// (e.g. "Career Growth ★★★☆☆") instead of a plain number.
function categoryTooltipHtml(r) {
  const t = translations[getLang()];
  return CATEGORY_FIELDS.map(c => {
    const val = Number(r[c.key]);
    const display = (!isNaN(val) && val > 0) ? categoryStarsHtml(val) : "—";
    return `<div><span>${t[c.label]}</span><span class="cat-val">${display}</span></div>`;
  }).join("");
}

// Draws the 6-point radar/spider chart as raw SVG, using plain geometry math
// (no charting library needed). Each category sits 60° apart around a circle.
function radarChartSvg(categoryAvgs) {
  const t = translations[getLang()];
  const size = 280, center = size / 2, maxR = 80;
  const n = categoryAvgs.length;
  const angleFor = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i, value) => {
    const r = (value / 5) * maxR;
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  };

  const rings = [0.2, 0.4, 0.6, 0.8, 1].map(pct => {
    const pts = categoryAvgs.map((c, i) => pointAt(i, 5 * pct).join(",")).join(" ");
    return `<polygon class="radar-ring" points="${pts}"/>`;
  }).join("");

  const spokes = categoryAvgs.map((c, i) => {
    const [x, y] = pointAt(i, 5);
    return `<line class="radar-spoke" x1="${center}" y1="${center}" x2="${x}" y2="${y}"/>`;
  }).join("");

  const shapePts = categoryAvgs.map((c, i) => pointAt(i, c.avg).join(",")).join(" ");
  const points = categoryAvgs.map((c, i) => {
    const [x, y] = pointAt(i, c.avg);
    return `<circle class="radar-point" cx="${x}" cy="${y}" r="3"/>`;
  }).join("");

  const labels = categoryAvgs.map((c, i) => {
    const [x, y] = pointAt(i, 6.2);
    return `<text class="radar-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${t[c.label]}</text>`;
  }).join("");

  return `<svg class="radar-chart" viewBox="0 0 ${size} ${size}">${rings}${spokes}<polygon class="radar-shape" points="${shapePts}"/>${points}${labels}</svg>`;
}

// Opens/closes a review's category tooltip. Closes any other open tooltip first.
function toggleCatTooltip(button) {
  const tooltip = button.nextElementSibling;
  const isOpen = tooltip.classList.contains("open");
  document.querySelectorAll(".cat-tooltip.open").forEach(el => el.classList.remove("open"));
  document.querySelectorAll(".cat-stars-btn.open").forEach(el => el.classList.remove("open"));
  if (!isOpen) {
    tooltip.classList.add("open");
    button.classList.add("open");
  }
}
// Closes any open tooltip if the visitor taps/clicks anywhere else on the page
document.addEventListener("click", (e) => {
  if (!e.target.closest(".cat-rating")) {
    document.querySelectorAll(".cat-tooltip.open").forEach(el => el.classList.remove("open"));
  }
});

// Switches between the Overview and Reviews panels — no page reload.
function switchTab(tab) {
  document.getElementById("tab-panel-overview").classList.toggle("hidden", tab !== "overview");
  document.getElementById("tab-panel-reviews").classList.toggle("hidden", tab !== "reviews");
  document.getElementById("tab-btn-overview").classList.toggle("active", tab === "overview");
  document.getElementById("tab-btn-reviews").classList.toggle("active", tab === "reviews");

  // The "See more" overflow check can't measure text height while the
  // Reviews panel is hidden (hidden elements report 0 height) — so we
  // recalculate it now, at the exact moment the panel becomes visible.
  if (tab === "reviews") refreshSeeMoreWhenReady();
}
// Shows/hides the "back to top" button based on scroll position
window.addEventListener("scroll", () => {
  const btn = document.getElementById("back-to-top");
  if (btn) btn.classList.toggle("visible", window.scrollY > 400);
});

// Swipe left/right to switch between Overview and Reviews on touch devices.
// Deliberately simple: with only 2 tabs, any clear horizontal swipe just
// toggles between them — no need to worry about swipe-direction meaning
// different things in Arabic vs English, which could easily get confusing.
let touchStartX = 0, touchStartY = 0;
const tabContent = document.getElementById("tab-content");
if (tabContent) {
  tabContent.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  tabContent.addEventListener("touchend", (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    // Ignore mostly-vertical swipes (those are just normal scrolling)
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
      const current = document.getElementById("tab-btn-overview").classList.contains("active") ? "overview" : "reviews";
      switchTab(current === "overview" ? "reviews" : "overview");
    }
  }, { passive: true });
}
// Runs when a "See more" button is clicked. Expands the text and
// flips the button's own label between "See more" and "See less".
function toggleClamp(button) {
  const t = translations[getLang()];
  const target = document.getElementById(button.dataset.target);
  const isExpanded = target.classList.toggle("expanded");
  button.textContent = isExpanded ? t.seeLess : t.seeMore;
}

// After the reviews are drawn, checks each pros/cons text block —
// if it's actually longer than 3 lines, shows its "See more" button.
// Short reviews are left alone with no button at all.
function updateSeeMoreButtons() {
  document.querySelectorAll(".clamp-text").forEach(el => {
    const btn = document.querySelector(`.see-more-btn[data-target="${el.id}"]`);
    if (!btn) return;
    if (el.scrollHeight > el.clientHeight + 2) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });
}

// Waits for the real fonts to finish loading before measuring text —
// measuring too early (with a temporary fallback font) gives wrong
// results, since different fonts wrap text at different points.
function refreshSeeMoreWhenReady() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateSeeMoreButtons);
  } else {
    updateSeeMoreButtons();
  }
}

// =====================================================
// MAIN RENDER FUNCTION
// Draws everything on the page: the company name, the 3 stat
// numbers, and the list of individual review cards.
// This function re-runs every time data first loads, AND every
// time the language button is clicked, so the wording and layout
// direction stay correct.
// =====================================================// Sanitizes user input to prevent HTML/Javascript injection
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Turns the stored English status value into the correct translated
// label, or falls back to "Anonymous Employee" for old reviews
// submitted before this question existed.
function employmentStatusLabel(status) {
  const t = translations[getLang()];
  if (status === "Current Employee" || status === "موظف حالي") return t.formStatusCurrent;
  if (status === "Former Employee" || status === "موظف سابق") return t.formStatusFormer;
  return t.anonymousReviewer;
}

// =====================================================
// MAIN RENDER FUNCTION
// Draws everything on the page: the company name, the header
// logo, the Overview tab, the Reviews tab summary box, and the
// list of individual review cards. Re-runs on first load AND
// every time the language button is clicked.
// =====================================================
function renderCompany() {
  const t = translations[getLang()];

  document.getElementById("cp-name").textContent = companyName;
  const logo = document.getElementById("cp-logo");

  if (logo) {
    logo.style.display = "block";
    if (logo.nextElementSibling) {
      logo.nextElementSibling.style.display = "none";
    }
    logo.src = `assets/logos/${slugify(companyName)}.png`;
    logo.alt = companyName;
  }

  if (companyReviews.length === 0) {
    document.getElementById("review-list").innerHTML = `<p class="empty-state">${t.noReviews}</p>`;
    document.getElementById("company-overview").innerHTML = "";
    document.getElementById("reviews-summary-box").innerHTML = "";
    return;
  }

  const catAvgs = categoryAverages(companyReviews);
  const validCats = catAvgs.filter(c => c.avg > 0);
  const companyRating = validCats.length
    ? validCats.reduce((s, c) => s + c.avg, 0) / validCats.length
    : 0;

  document.getElementById("company-overview").innerHTML = companyOverviewHtml(companyInfo);

  document.getElementById("reviews-summary-box").innerHTML = reviewsSummaryBoxHtml(
    companyRating,
    companyReviews.length,
    catAvgs,
    validCats.length > 0 ? radarChartSvg(catAvgs) : ""
  );

  const sorted = [...companyReviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  document.getElementById("review-list").innerHTML = sorted.map((r, i) => {
    const delay = Math.min(i * 0.05, 0.4);
    const catAvg = categoryAverageForReview(r);

// Safely splits any comma-separated strings into separate bubbles
    // and automatically removes any leftover brackets/quotes from old data
    let perks = [];
    if (Array.isArray(r.benefits)) {
      perks = r.benefits
        .flatMap(p => String(p).replace(/[\[\]"]/g, "").split(","))
        .map(p => p.trim())
        .filter(p => p !== "");
    }

    const perksHtml = perks.length > 0
      ? `<div class="review-package">
          ${perks.map(p => `<span class="perk-pill">${escapeHTML(p)}</span>`).join('')}
         </div>`
      : '';

    return `
    <div class="review anim-in" style="--delay: ${delay}s">

      <!-- Identity row: anonymous avatar + employment status, like a
           reviewer name, with the rating badge in the opposite corner -->
      <div class="review-identity">
        <div class="review-identity-left">
<div class="review-avatar" style="overflow: hidden; background: transparent; border: none;">
            <img src="assets/images/anon.webp" alt="Anonymous User" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <p class="review-status-name">${employmentStatusLabel(r.employment_status)}</p>
        </div>
        <div style="text-align:${t.dir === 'rtl' ? 'left' : 'right'}">
          ${catAvg !== null ? `
          <div class="cat-rating">
            <button class="cat-stars-btn" onclick="toggleCatTooltip(this)">
              ${categoryStarsHtml(catAvg)}
              <span class="cat-score">${catAvg.toFixed(1)}</span>
            </button>
            <div class="cat-tooltip" style="${t.dir === 'rtl' ? 'right: auto; left: 0;' : 'right: 0; left: auto;'}">${categoryTooltipHtml(r)}</div>
          </div>` : ""}
        </div>
      </div>

      <p class="review-jobtitle">${escapeHTML(r.job_title)}</p>

      <!-- Meta pills: icon-based, no emoji (perks below already use emoji) -->
      <div class="review-meta-tags">
        ${r.account ? `<span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M16 21v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9M4 21h16"/></svg>${escapeHTML(r.account)}</span>` : ""}
        ${r.branch ? `<span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.3"/></svg>${escapeHTML(r.branch)}</span>` : ""}
        ${r.duration_text ? `<span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>${escapeHTML(r.duration_text)}</span>` : ""}
      </div>

      ${perksHtml}

      <hr class="review-divider">

      <div class="pc-row">
        <div class="pc-block pros">
          <h4 data-i18n="pros">${t.pros}</h4>
          <p class="clamp-text" id="pros-${i}">${escapeHTML(r.pros)}</p>
          <button class="see-more-btn" data-target="pros-${i}" onclick="toggleClamp(this)">${t.seeMore}</button>
        </div>
        <div class="pc-block cons">
          <h4 data-i18n="cons">${t.cons}</h4>
          <p class="clamp-text" id="cons-${i}">${escapeHTML(r.cons)}</p>
          <button class="see-more-btn" data-target="cons-${i}" onclick="toggleClamp(this)">${t.seeMore}</button>
        </div>
      </div>

      <div class="review-timestamp">${timeAgo(r.timestamp)}</div>
    </div>
    `;
  }).join("");
  refreshSeeMoreWhenReady();
}

// =====================================================
// LOAD THE DATA
// Downloads data.json (the file GitHub Actions refreshes every
// 10 minutes), keeps only the reviews matching this company,
// then draws the page.
// =====================================================
let companyInfo = {};

Promise.all([
  fetch("data.json").then(r => r.json()),
  fetch("companies.json").then(r => r.json())
])
.then(([reviews, companies]) => {

  companyReviews = reviews.filter(review => review.company_name === companyName);

companyInfo = companies[companyName] || {};
console.log(companyInfo);

  renderCompany();

})
.catch(error => {
  console.error(error);
  document.getElementById("review-list").innerHTML =
    "<p class='empty-state'>Couldn't load reviews. Please try again later.</p>";
});
// =====================================================
// RE-DRAW WHEN LANGUAGE CHANGES
// Without this, switching languages would update labels like
// "Pros"/"إيه أحلى حاجة" but NOT rebuild the review cards
// themselves — so this makes sure everything stays in sync.
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) langBtn.addEventListener("click", () => {
    renderCompany();
  });
});
