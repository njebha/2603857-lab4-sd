document.getElementById('searchButton').addEventListener('click', () => {
    const countryName = document.getElementById('countryInput').value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) throw new Error("Country not found.");
            return response.json();
        })
        .then(data => {
            const country = data[0]; // Get the first result
            displayCountryInfo(country);
        })
        .catch(error => {
            document.getElementById('country-info').innerHTML = `<p style="color: red;">${error.message}</p>`;
            document.getElementById('bordering-countries').innerHTML = "";
        });
});

function displayCountryInfo(country) {
    const countryInfo = document.getElementById('country-info');
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
    `;

    if (country.borders) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`)
            .then(response => response.json())
            .then(neighbors => {
                const borderingSection = document.getElementById('bordering-countries');
                borderingSection.innerHTML = "<h3>Bordering Countries:</h3>";
                neighbors.forEach(neighbor => {
                    borderingSection.innerHTML += `
                        <p>${neighbor.name.common}</p>
                        <img src="${neighbor.flags.svg}" alt="Flag of ${neighbor.name.common}">
                    `;
                });
            })
            .catch(() => document.getElementById('bordering-countries').innerHTML = "<p>No neighboring countries found.</p>");
    } else {
        document.getElementById('bordering-countries').innerHTML = "<p>No bordering countries.</p>";
    }
}
