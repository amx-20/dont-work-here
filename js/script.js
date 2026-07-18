
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
// Holds every company, already grouped and averaged, once data.json loads.

// Starts empty; renderGrid() draws nothing meaningful until this is filled.
let companiesData = [];
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

// =====================================================
// GROUP REVIEWS BY COMPANY
// Takes the flat list of individual reviews from data.json
// (one entry per employee submission) and organizes them into
// one group per company, with the average rating and "recommend %"
// calculated for each group.
// Returns companies sorted by whoever has the most reviews first.
// =====================================================
// Turns "Raya CX" into "raya-cx" so it matches the logo filename convention.
// If you add a new company later, its logo file must follow this same rule.
function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

// The 6 category fields (1–5 scale). "Real rating" now means these,
// NOT overall_rating — that field is just "would you recommend? Yes/No"
// and can no longer produce a meaningful 1–10 average or distribution.
const CATEGORY_KEYS = ["salary_rating", "management_rating", "training_rating", "career_rating", "culture_rating", "work_life_rating"];

// A company's overall rating = the average of the 6 category dimensions
// (each dimension itself averaged across all the company's reviews).
// Same method used on the company page, so the number matches everywhere.
// Reviews with no category data (very old, pre-feature reviews) are
// safely excluded rather than counted as zero.
function categoryCompanyAverage(reviews) {
  const dimAverages = CATEGORY_KEYS.map(key => {
    const values = reviews.map(r => Number(r[key])).filter(v => !isNaN(v) && v > 0);
    return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
  }).filter(v => v > 0);
  return dimAverages.length ? dimAverages.reduce((s, v) => s + v, 0) / dimAverages.length : 0;
}

// A single review's own composite rating (average of its 6 categories).
// Returns null for reviews with no category data — used to safely skip
// them in the distribution chart below instead of miscounting them.
function categoryAverageForReview(r) {
  const values = CATEGORY_KEYS.map(k => Number(r[k])).filter(v => !isNaN(v) && v > 0);
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

// Groups reviews by company, and also counts how many DIFFERENT branches
// each company has (based on unique, non-empty branch names in the reviews).
function groupByCompany(rows) {
  const groups = {};
  rows.forEach(r => {
    if (!groups[r.company_name]) groups[r.company_name] = [];
    groups[r.company_name].push(r);
  });
  return Object.entries(groups).map(([name, reviews]) => {
    const avg = categoryCompanyAverage(reviews);
    const branchCount = new Set(reviews.map(r => String(r.branch || "").trim()).filter(Boolean)).size;
    return { name, reviews, avg, branchCount };
  }).sort((a, b) => b.reviews.length - a.reviews.length);
}

// Decides the star/text color: good (default), medium ("mid"), or poor ("low")
// Decides the star/text color: good (default), medium ("mid"), or poor ("low")
// Rescaled to 1–5, since ratings are no longer the 1–10 recommend field.
function ratingClass(avg) {
  if (avg >= 3.5) return "";
  if (avg >= 2.5) return "mid";
  return "low";
}

// Builds the "★★★★☆" text directly from a 1–5 average — no conversion needed anymore.
function starsHtml(avg) {
  const filled = Math.round(avg);

  return `
    <span class="stars" style="display:flex;align-items:center;gap:2px;">
      ${Array.from({ length: 5 }, (_, i) =>
        getStarSvg(`card-${i}`, 16, i < filled)
      ).join("")}
    </span>
  `;
}

// Builds the 10 rating-distribution bars for one company
// Builds 10 bar+number pairs. Bar height is still based on how many
// reviews gave that rating, relative to whichever rating got the most
// (unchanged logic — just now paired directly with its own number).
function waveformBars(reviews) {
  const counts = new Array(5).fill(0);
  reviews.forEach(r => {
    const val = categoryAverageForReview(r);
    if (val === null) return; // old review with no category data — excluded, not miscounted
    const idx = Math.min(Math.max(Math.round(val), 1), 5) - 1;
    counts[idx]++;
  });
  const max = Math.max(...counts, 1);
  return counts.map((c, i) => {
    const filled = c > 0 ? "filled" : "";
    const h = 6 + Math.round((c / max) * 30);
    return `<div class="dist-col">
      <div class="dist-bar-wrap"><div class="dist-bar ${filled}" style="height:${h}px"></div></div>
      <span class="dist-num">${i + 1}</span>
    </div>`;
  }).join("");
}
function renderGrid() {
  const t = translations[getLang()];
  const grid = document.getElementById("card-grid");

  if (companiesData.length === 0) {
    grid.innerHTML = `<p class="empty-state">${t.noReviews}</p>`;
    return;
  }

    grid.innerHTML = companiesData.map((c, i) => {
    const slug = slugify(c.name);
    // Cards stagger in one after another, capped at 0.4s max delay so a
    // long company list doesn't make the last cards wait several seconds.
    const delay = Math.min(i * 0.05, 0.4);
    return `
    <div class="card anim-in" style="--delay: ${delay}s" tabindex="0" role="button"
         onclick="window.location.href='company.html?company=${encodeURIComponent(c.name)}'"
         onkeydown="if(event.key==='Enter')window.location.href='company.html?company=${encodeURIComponent(c.name)}'">

      <div class="card-info">
        <!-- Logo image: shows assets/logos/[company-slug].png.
             If that file doesn't exist, onerror hides the broken image
             and reveals the fallback building icon right next to it. -->
        <div class="card-logo">
          <img src="assets/logos/${slug}.png" alt="${c.name}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="logo-fallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M16 21v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9M4 21h16M7 8h1M7 11h1M7 14h1M10 8h1M10 11h1M10 14h1"/>
            </svg>
          </div>
        </div>

        <div>
          <p class="company-name">${c.name}</p>
          <div class="card-stars ${ratingClass(c.avg)}">${starsHtml(c.avg)} ${c.avg > 0 ? Number(c.avg.toFixed(1)) + "/5" : "—"}</div>
          <div class="card-meta">
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
            <strong>${c.branchCount}</strong> ${t.branchWord}
          </span>

          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20l1-5.3a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>
            </svg>
            <strong>${c.reviews.length}</strong> ${t.reviewsWord}
          </span>
          </div>
        </div>
      </div>
     <div class="card-distribution">
            <p class="dist-label">${t.ratingDistribution}</p>
            <div class="dist-bars">${waveformBars(c.reviews)}</div>
          </div>

    </div>
  `;
}).join("");
  document.getElementById("stat-companies").textContent = companiesData.length;
  document.getElementById("stat-reviews").textContent = companiesData.reduce((s, c) => s + c.reviews.length, 0);
}

// =====================================================
// LOAD THE DATA
// Downloads data.json (refreshed automatically every 10 minutes
// by GitHub Actions), groups it by company, then draws the page.
// =====================================================
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    companiesData = groupByCompany(data);
    renderGrid();
  })
  .catch(error => {
    // If data.json can't be loaded at all (e.g. missing file, broken link)
    console.error(error);
    document.getElementById("card-grid").innerHTML = "<p class='empty-state'>Couldn't load reviews. Please try again later.</p>";
  });

// =====================================================
// RE-DRAW WHEN LANGUAGE CHANGES
// Without this, switching languages would update static labels
// but NOT rebuild the company cards themselves (which contain
// dynamic text like "5 Reviews") — this keeps everything in sync.
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) langBtn.addEventListener("click", () => {
    if (companiesData.length > 0) renderGrid();
  });
});
