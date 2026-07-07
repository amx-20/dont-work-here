const API_URL = "https://script.google.com/macros/s/AKfycbwP-jab4KFiOaZpb0dXL2Mcn02wkSAy5dYwurKK_oakaP_vvbrHdWqPtXq7RKPj1NSv/exec";

const companiesDiv = document.getElementById("companies");

fetch(API_URL)
    .then(response => response.json())
    .then(data => {

        companiesDiv.innerHTML = "";

        data.forEach(review => {

            companiesDiv.innerHTML += `
                <div class="company-card">
                    <h2>${review.company_name}</h2>
                    <p>⭐ ${review.overall_rating}</p>
                    <p>📍 ${review.branch}</p>
                    <p><strong>Account:</strong> ${review.account}</p>
                    <p><strong>Job:</strong> ${review.job_title}</p>
                    <p><strong>Pros:</strong> ${review.pros}</p>
                    <p><strong>Cons:</strong> ${review.cons}</p>
                    <p><strong>Recommend:</strong> ${review.would_recommend}</p>
                </div>
            `;
        });

    })
    .catch(error => console.error(error));