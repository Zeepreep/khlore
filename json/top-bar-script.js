fetch('../../json/search-index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        document.getElementById('search-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const query = document.getElementById('search-query').value;
            if (query) {
                window.location.href = `../main-pages/search.html?q=${encodeURIComponent(query)}`;
            }
        });

        console.log(json);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });