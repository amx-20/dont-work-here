const params = new URLSearchParams(window.location.search);
const companyName = params.get("company");

let companyReviews = [];

function renderCompany() {
  const t = translations[getLang()];

  document.getElementById("cp-name").textContent = companyName;

  if (companyReviews.length === 0) {
    document.getElementById("review-list").innerHTML = `<p class="empty-state">${t.noReviews}</p>`;
    document.getElementById("cp-rating").textContent = "—";
    document.getElementById("cp-count").textContent = "0";
    document.getElementById("cp-recommend").textContent = "—";
    return;
  }

  const avg = companyReviews.reduce((s, r) => s + Number(r.overall_rating), 0) / companyReviews.length;
  const recPct = Math.round(100 * companyReviews.filter(r => Number(r.overall_rating) >= 6).length / companyReviews.length);

  document.getElementById("cp-rating").textContent = avg.toFixed(1);
  document.getElementById("cp-count").textContent = companyReviews.length;
  document.getElementById("cp-recommend").textContent = recPct + "%";

  // Newest first, based on submission time
  const sorted = [...companyReviews].sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

  document.getElementById("review-list").innerHTML = sorted.map(r => {
    const rating10 = Number(r.overall_rating);
    const filledStars = Math.round(rating10 / 2); // convert 10-point scale to 5 stars for display
    return `
    <div class="review">
      <div class="review-top">
        <div>
          <div class="review-role">${r.job_title || ""}</div>
          <div class="review-tags">${r.account || ""} · ${r.branch || ""}</div>
        </div>
        <div style="text-align:${t.dir === 'rtl' ? 'left' : 'right'}">
          <div class="stars">${"★".repeat(filledStars)}${"☆".repeat(5 - filledStars)} (${rating10}/10)</div>
          <div class="review-dates">${t.duration}: ${r.duration_text || "—"}</div>
        </div>
      </div>
      <div class="pc-row">
        <div class="pc-block pros"><h4 data-i18n="pros">${t.pros}</h4><p>${r.pros || ""}</p></div>
        <div class="pc-block cons"><h4 data-i18n="cons">${t.cons}</h4><p>${r.cons || ""}</p></div>
      </div>
    </div>
  `;
  }).join("");
}

fetch("data.json")
  .then(response => response.json())
  .then(data => {
    companyReviews = data.filter(review => review.company_name === companyName);
    renderCompany();
  })
  .catch(error => {
    console.error(error);
    document.getElementById("review-list").innerHTML = "<p class='empty-state'>Couldn't load reviews. Please try again later.</p>";
  });

document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) langBtn.addEventListener("click", () => {
    renderCompany();
  });
});
