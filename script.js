const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnT8z9sYqYHc3FOujGYkAmQXfWYqZ5Z7IdHtqXyNuU_g0fTk2bbj1XbQ6TKvGSDbBPWeQ6EfY8XzHV84NDjw_1-YCjdRm5ytEsr9fuEDDBWhksLoLuyJfQfrsI66deAvbyx9fd0Ro3xJY10_1axGC9KmFblS0GUH-WckQIWb4qjC_-usye9llx5e8DUSEDwsqo5RLe_Z5-J-YQZlsKajuqIqjjxN7uDKLGxphyV49UuV7jL9ykuKo0uAwM7pP2QcWRRLXETq5Cn7zUlTjJ9LrYRVy7Y6dg&lib=MaQxjQjLTcTJSyY71HQPmM36CZDhuSRl7";

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