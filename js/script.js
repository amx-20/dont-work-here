let companiesData = [];

function groupByCompany(rows) {
  const groups = {};
  rows.forEach(r => {
    if (!groups[r.company_name]) groups[r.company_name] = [];
    groups[r.company_name].push(r);
  });
  return Object.entries(groups).map(([name, reviews]) => {
    const avg = reviews.reduce((s, r) => s + Number(r.overall_rating), 0) / reviews.length;
    // "Recommend" = rating of 6 or higher out of 10, since the form no longer asks a separate yes/no question.
    const recPct = Math.round(100 * reviews.filter(r => Number(r.overall_rating) >= 6).length / reviews.length);
    return { name, reviews, avg, recPct };
  }).sort((a, b) => b.reviews.length - a.reviews.length);
}

function ratingClass(avg) {
  // Scale is out of 10
  if (avg >= 7) return "";
  if (avg >= 5) return "mid";
  return "low";
}

function waveformBars(reviews) {
  // 10 bars representing how many reviews gave each rating, 1 through 10
  const counts = new Array(10).fill(0);
  reviews.forEach(r => {
    const idx = Math.min(Math.max(Number(r.overall_rating), 1), 10) - 1;
    counts[idx]++;
  });
  const max = Math.max(...counts, 1);
  return counts.map(c => {
    const h = 6 + Math.round((c / max) * 28);
    const filled = c > 0 ? "filled" : "";
    return `<i class="${filled}" style="height:${h}px"></i>`;
  }).join("");
}

function renderGrid() {
  const t = translations[getLang()];
  const grid = document.getElementById("card-grid");

  if (companiesData.length === 0) {
    grid.innerHTML = `<p class="empty-state">${t.noReviews}</p>`;
    return;
  }

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

  document.getElementById("stat-companies").textContent = companiesData.length;
  document.getElementById("stat-reviews").textContent = companiesData.reduce((s, c) => s + c.reviews.length, 0);
}

fetch("data.json")
  .then(response => response.json())
  .then(data => {
    companiesData = groupByCompany(data);
    renderGrid();
  })
  .catch(error => {
    console.error(error);
    document.getElementById("card-grid").innerHTML = "<p class='empty-state'>Couldn't load reviews. Please try again later.</p>";
  });

// Re-render the cards (with correct wording) whenever the language button is clicked
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) langBtn.addEventListener("click", () => {
    if (companiesData.length > 0) renderGrid();
  });
});
