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
function groupByCompany(rows) {
  const groups = {};
  rows.forEach(r => {
    if (!groups[r.company_name]) groups[r.company_name] = [];
    groups[r.company_name].push(r);
  });
  return Object.entries(groups).map(([name, reviews]) => {
    // Average rating: sum of all ratings ÷ number of reviews
    const avg = reviews.reduce((s, r) => s + Number(r.overall_rating), 0) / reviews.length;
    // "Recommend" = rating of 6 or higher out of 10, since the form no longer asks a separate yes/no question.
    const recPct = Math.round(100 * reviews.filter(r => Number(r.overall_rating) >= 6).length / reviews.length);
    return { name, reviews, avg, recPct };
  }).sort((a, b) => b.reviews.length - a.reviews.length); // most-reviewed company shows first
}

// =====================================================
// DECIDE THE RATING BADGE COLOR
// Returns a CSS class name based on how good the average rating is.
// Matches the color classes defined in css/style.css:
// "" (default/signal color) = good, "mid" = okay, "low" = bad.
// Scale is out of 10.
// =====================================================
function ratingClass(avg) {
  if (avg >= 7) return "";
  if (avg >= 5) return "mid";
  return "low";
}

// =====================================================
// BUILD THE "WAVEFORM" BAR CHART
// For one company, counts how many reviews gave each rating from
// 1 to 10, then draws 10 small vertical bars — taller bars mean
// more reviews landed on that rating. This is the little bar-chart
// visual shown inside each company card.
// =====================================================
function waveformBars(reviews) {
  const counts = new Array(10).fill(0); // one counter per rating value, 1 through 10
  reviews.forEach(r => {
    const idx = Math.min(Math.max(Number(r.overall_rating), 1), 10) - 1;
    counts[idx]++;
  });
  const max = Math.max(...counts, 1); // tallest bar, used to scale all bars proportionally
  return counts.map(c => {
    const h = 6 + Math.round((c / max) * 28); // bar height in pixels
    const filled = c > 0 ? "filled" : ""; // colors the bar only if at least 1 review landed there
    return `<i class="${filled}" style="height:${h}px"></i>`;
  }).join("");
}

// =====================================================
// MAIN RENDER FUNCTION
// Draws the entire homepage grid of company cards, plus the two
// hero stat numbers (total companies, total reviews).
// Re-runs both on first load AND every time the language button
// is clicked, so wording like "5 Reviews" vs "٥ تقييم" stays correct.
// =====================================================
function renderGrid() {
  const t = translations[getLang()];
  const grid = document.getElementById("card-grid");

  // ---- Handle the case where there's no data at all ----
  if (companiesData.length === 0) {
    grid.innerHTML = `<p class="empty-state">${t.noReviews}</p>`;
    return;
  }

  // ---- Build one clickable card per company ----
  grid.innerHTML = companiesData.map(c => `
    <div class="card" tabindex="0" role="button"
         onclick="window.location.href='company.html?company=${encodeURIComponent(c.name)}'"
         onkeydown="if(event.key==='Enter')window.location.href='company.html?company=${encodeURIComponent(c.name)}'">
      <div class="card-top">
        <div class="company-name">${c.name}</div>
        <div class="rating-badge ${ratingClass(c.avg)}">${c.avg.toFixed(1)}</div>
      </div>
      <div class="waveform">${waveformBars(c.reviews)}</div>
      <div class="card-meta">
        <span>${c.reviews.length} ${t.reviewsWord}</span>
        <span class="recommend">${c.recPct}% ${t.recommendPct}</span>
      </div>
    </div>
  `).join("");

  // ---- Fill in the two big stat numbers in the hero section ----
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
