const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnS0UmPdi4mHXxfGXDgILA3vZfKF5m5sgI6HpFQ0Aa1_DPI4SGG0VV18gYkZUJtNu--nCpUmHkVlXFZKU5y6UkeOy8KZfGtLBBf_eJ5Fc-Q4YrgPvD5QPCoIoVsHChQgWS4zzi6EUllpsH-DE2zfooHf16fAAFkTkPKJpQhck3GW0l4n_uhKZVhB4IB0Mw6SQ75wHI9LkFoL0IG1TIthxhgJVs6fjxVg7zoVhialvI44cVhXE1M&lib=MaQxjQjLTcTJSyY71HQPmM36CZDhuSRl7";

const companiesDiv = document.getElementById("companies");

fetch(API_URL)
    .then(response => response.json())
    .then(data => {

        data.forEach(review => {

            companiesDiv.innerHTML += `
                <div class="company-card">
                    <h2>${review.company_name}</h2>
                    <p>⭐ ${review.overall_rating}</p>
                    <p>${review.branch}</p>
                </div>
            `;

        });

    })
    .catch(error => console.error(error));