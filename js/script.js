// Holds every company, already grouped and averaged, once data.json loads.
// Starts empty; renderGrid() draws nothing meaningful until this is filled.
let companiesData = [];

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

// Groups reviews by company, and also counts how many DIFFERENT branches
// each company has (based on unique, non-empty branch names in the reviews).
function groupByCompany(rows) {
  const groups = {};
  rows.forEach(r => {
    if (!groups[r.company_name]) groups[r.company_name] = [];
    groups[r.company_name].push(r);
  });
  return Object.entries(groups).map(([name, reviews]) => {
    const avg = reviews.reduce((s, r) => s + Number(r.overall_rating), 0) / reviews.length;
    const branchCount = new Set(reviews.map(r => String(r.branch || "").trim()).filter(Boolean)).size;
    return { name, reviews, avg, branchCount };
  }).sort((a, b) => b.reviews.length - a.reviews.length);
}

// Decides the star/text color: good (default), medium ("mid"), or poor ("low")
function ratingClass(avg) {
  if (avg >= 7) return "";
  if (avg >= 5) return "mid";
  return "low";
}

// Builds the "★★★★☆" text from a 1–10 average (10/10 = 5 filled stars)
function starsHtml(avg) {
  const filled = Math.round(avg / 2);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

// Builds the 10 rating-distribution bars for one company
// Builds 10 bar+number pairs. Bar height is still based on how many
// reviews gave that rating, relative to whichever rating got the most
// (unchanged logic — just now paired directly with its own number).
function waveformBars(reviews) {
  const counts = new Array(10).fill(0);
  reviews.forEach(r => {
    const idx = Math.min(Math.max(Number(r.overall_rating), 1), 10) - 1;
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

  grid.innerHTML = companiesData.map(c => {
    const slug = slugify(c.name);
    return `
    <div class="card" tabindex="0" role="button"
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
          <div class="card-stars ${ratingClass(c.avg)}">${starsHtml(c.avg)} ${c.avg.toFixed(1)}/10</div>
          <div class="card-meta">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>${c.branchCount} ${t.branchWord}</span>
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20l1-5.3a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>${c.reviews.length} ${t.reviewsWord}</span>
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
