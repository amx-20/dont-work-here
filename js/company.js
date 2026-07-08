const API_URL = "https://script.google.com/macros/s/AKfycbyPmIQcDGRObjEiNxXzsbQUQb6m3gVb9VW67i0rtLDz3ql8qY1kDtrJn7KmXEyLY6uP/exec";

// Get company name from URL
const params = new URLSearchParams(window.location.search);
const companyName = params.get("company");

// HTML elements
const companyNameElement = document.getElementById("company-name");
const companyRatingElement = document.getElementById("company-rating");
const reviewCountElement = document.getElementById("review-count");
const reviewsDiv = document.getElementById("reviews");

fetch("data.json")
    .then(response => response.json())
    .then(data => {

        // Get reviews for this company
        const reviews = data.filter(review => review.company_name === companyName);

        // Sort newest first (by submission time, since we no longer collect employment dates)
        reviews.sort((a, b) =>
            new Date(b.Timestamp) - new Date(a.Timestamp)
        );

        // Company title
        companyNameElement.textContent = companyName;

        // Review count
        reviewCountElement.textContent = `${reviews.length} Employee Review${reviews.length !== 1 ? "s" : ""}`;

        // Average rating (out of 10)
        const averageRating =
            (
                reviews.reduce((sum, review) => sum + Number(review.overall_rating), 0)
                / reviews.length
            ).toFixed(1);

        companyRatingElement.textContent = `⭐ ${averageRating}/10`;

        // Clear reviews
        reviewsDiv.innerHTML = "";

        // Display reviews
        reviews.forEach(review => {

            reviewsDiv.innerHTML += `
                <div class="company-card">

                    <strong>
                        ${review.account}
                    </strong>
                    |
                    ${review.job_title}
                    |
                    ${review.branch}
                    |
                    ⭐ ${review.overall_rating}/10

                    <br><br>

                    مدة الشغل: ${review.duration_text}

                    <br><br>

                    <strong>Pros</strong>

                    <p>${review.pros}</p>

                    <hr>

                    <strong>Cons</strong>

                    <p>${review.cons}</p>

                </div>
            `;

        });

    })
    .catch(error => console.error(error));
