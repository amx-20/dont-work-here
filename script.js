const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnR_Yzst6ad2MiRsNP5pIweHMd7DAXwesD4AjSPc4PyDqU9o1K-NSny1HSM7bOoKLGFP1npEjLPhwDmybg0a7lkWT6FJEiOrFXR6tI4JyrlJUfZWcyhXjEHMcdRGMLN3JGs2WUrzyXAu7rWpcsVvkkM31952mHM6o_jjFa3uPuuhlllTX1icfsvDOeXFArWp807dAtwvLMANXzjlY8O3LaVsfL59VslZbXB4IV0Bx4MseLeZqV8&lib=MaQxjQjLTcTJSyY71HQPmM36CZDhuSRl7";

const companiesDiv = document.getElementById("companies");

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