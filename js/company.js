// =====================================================
// READ THE COMPANY NAME FROM THE URL
// This page is loaded like: company.html?company=Concentrix
// This grabs "Concentrix" out of the address bar so we know
// which company's reviews to show.
// =====================================================
const params = new URLSearchParams(window.location.search);
const companyName = params.get("company");

// Holds the list of reviews for THIS company only, once data.json
// has been downloaded and filtered. Starts empty.
// Holds the list of reviews for THIS company only, once data.json
// has been downloaded and filtered. Starts empty.
let companyReviews = [];

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
    if (btn && el.scrollHeight > el.clientHeight + 2) {
      btn.classList.add("visible");
    }
  });
}

// =====================================================
// MAIN RENDER FUNCTION
// Draws everything on the page: the company name, the 3 stat
// numbers, and the list of individual review cards.
// This function re-runs every time data first loads, AND every
// time the language button is clicked, so the wording and layout
// direction stay correct.
// =====================================================
function renderCompany() {
  // Gets the current language's dictionary of words (see js/i18n.js)
  const t = translations[getLang()];

  // Fills in the company name at the top of the page
  document.getElementById("cp-name").textContent = companyName;

  // ---- Handle the case where this company has no reviews yet ----
  if (companyReviews.length === 0) {
    document.getElementById("review-list").innerHTML = `<p class="empty-state">${t.noReviews}</p>`;
    document.getElementById("cp-rating").textContent = "—";
    document.getElementById("cp-count").textContent = "0";
    document.getElementById("cp-recommend").textContent = "—";
    return; // stop here, nothing more to draw
  }

  // ---- Calculate the 3 stat numbers ----
  // Average rating: adds up every review's rating, divides by how many reviews there are
  const avg = companyReviews.reduce((s, r) => s + Number(r.overall_rating), 0) / companyReviews.length;

  // Recommend %: percentage of reviews rated 6 or higher out of 10
  const recPct = Math.round(100 * companyReviews.filter(r => Number(r.overall_rating) >= 6).length / companyReviews.length);

  document.getElementById("cp-rating").textContent = avg.toFixed(1); // e.g. "7.4"
  document.getElementById("cp-count").textContent = companyReviews.length;
  document.getElementById("cp-recommend").textContent = recPct + "%";

  // ---- Sort reviews newest first ----
  // Uses the automatic Google Forms "Timestamp" (when it was submitted),
  // since we no longer collect real employment dates.
  const sorted = [...companyReviews].sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

  // ---- Build one HTML "card" per review ----
  document.getElementById("review-list").innerHTML = sorted.map((r, i) => {
    const rating10 = Number(r.overall_rating);
    // Converts the 1–10 rating into a 1–5 star display (10/10 = 5 stars, 4/10 = 2 stars, etc.)
    const filledStars = Math.round(rating10 / 2);

    return `
    <div class="review">
      <div class="review-top">
        <div>
          <!-- Job title, e.g. "Support Advisor" -->
          <div class="review-role">${r.job_title || ""}</div>
          <!-- Account + branch, e.g. "Microsoft · Alexandria" -->
          <div class="review-tags">${r.account || ""} · ${r.branch || ""}</div>
        </div>
        <!-- Star rating and duration, aligned to the correct side depending on language direction -->
        <div style="text-align:${t.dir === 'rtl' ? 'left' : 'right'}">
          <div class="stars">${"★".repeat(filledStars)}${"☆".repeat(5 - filledStars)} (${rating10}/10)</div>
          <div class="review-dates">${t.duration}: ${r.duration_text || "—"}</div>
        </div>
      </div>
      <!-- Pros and Cons, side by side (stacked on mobile via CSS) -->
<div class="pc-row">
        <div class="pc-block pros">
          <h4 data-i18n="pros">${t.pros}</h4>
          <p class="clamp-text" id="pros-${i}">${r.pros || ""}</p>
          <button class="see-more-btn" data-target="pros-${i}" onclick="toggleClamp(this)">${t.seeMore}</button>
        </div>
        <div class="pc-block cons">
          <h4 data-i18n="cons">${t.cons}</h4>
          <p class="clamp-text" id="cons-${i}">${r.cons || ""}</p>
          <button class="see-more-btn" data-target="cons-${i}" onclick="toggleClamp(this)">${t.seeMore}</button>
        </div>
      </div>
    </div>
  `;
}).join("");
  updateSeeMoreButtons(); // checks each review's text and shows "See more" only where needed
}

// =====================================================
// LOAD THE DATA
// Downloads data.json (the file GitHub Actions refreshes every
// 10 minutes), keeps only the reviews matching this company,
// then draws the page.
// =====================================================
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    companyReviews = data.filter(review => review.company_name === companyName);
    renderCompany();
  })
  .catch(error => {
    // If data.json can't be loaded at all (e.g. missing file, broken link)
    console.error(error);
    document.getElementById("review-list").innerHTML = "<p class='empty-state'>Couldn't load reviews. Please try again later.</p>";
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
