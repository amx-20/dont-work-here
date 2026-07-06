const API_URL = "https://script.google.com/macros/s/AKfycbxoiZ1Toe9nYZvnCTE2tzuaB4kPUmLNJ5mlA_KLrxNh1Yq47WBOlTHmCvdexfndE5u4/exec";

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