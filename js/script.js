const API_URL = "https://script.google.com/macros/s/AKfycbyPmIQcDGRObjEiNxXzsbQUQb6m3gVb9VW67i0rtLDz3ql8qY1kDtrJn7KmXEyLY6uP/exec";

const companiesDiv = document.getElementById("companies");

fetch(API_URL)
    .then(response => response.json())
    .then(data => {

companiesDiv.innerHTML = "";

// Group reviews by company
const companies = {};

data.forEach(review => {

                if (!companies[review.company_name]) {

                    companies[review.company_name] = {
                        name: review.company_name,
                        reviews: [],
                        totalRating: 0
                    };

                }

                companies[review.company_name].reviews.push(review);
                companies[review.company_name].totalRating += Number(review.overall_rating);

            });

            // Display one card per company
            Object.values(companies).forEach(company => {

                const averageRating =
                    (company.totalRating / company.reviews.length).toFixed(1);

                companiesDiv.innerHTML += `
                    <div class="company-card"
                        onclick="window.location.href='company.html?company=${encodeURIComponent(company.name)}'">
                        <h2>${company.name}</h2>
                        <p>⭐ ${averageRating}/10</p>
                        <p>${company.reviews.length} Review(s)</p>

                        <button>
                            View Reviews
                        </button>
                    </div>
                `;

            });
    })
    .catch(error => console.error(error));
