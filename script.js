const API_URL = "https://script.google.com/macros/s/AKfycbxoiZ1Toe9nYZvnCTE2tzuaB4kPUmLNJ5mlA_KLrxNh1Yq47WBOlTHmCvdexfndE5u4/exec";

const companiesDiv = document.getElementById("companies");

fetch(API_URL)
    .then(response => response.json())
    .then(data => {

        console.log(data);

        data.forEach(review => {

            companiesDiv.innerHTML += `
                <div class="company-card">
                    <h2>${review["Company Name"]}</h2>
                    <p>⭐ ${review["Overall Rating of Employment Experience"]}</p>
                    <p>${review["Branch"]}</p>
                    <p><strong>Account:</strong> ${review["Project/Account"]}</p>
                    <p><strong>Job:</strong> ${review["Job Title"]}</p>
                    <p><strong>Pros:</strong> ${review["What were the primary pros of working here?"]}</p>
                    <p><strong>Cons:</strong> ${review["What were the primary cons of working here?"]}</p>
                    <p><strong>Recommend:</strong> ${review["Would you recommend this company to others?"]}</p>
                </div>
            `;

        });

    })
    .catch(error => console.error(error));