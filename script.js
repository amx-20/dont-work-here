fetch(API_URL)
    .then(response => response.json())
    .then(data => {

        console.log(data);

        data.forEach(review => {

            console.log(review);

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