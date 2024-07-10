const basePath = '../';

fetch('../json/search-index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const games = data.filter(item => item.category === 'game');
        const gamesGrid = document.querySelector('.games-grid');

        gamesGrid.innerHTML = '';

        const createGameElement = (game) => {
            const link = basePath + game.link;
            const image = basePath + game.image;

            const anchorElement = document.createElement('a');
            anchorElement.href = link;

            const gameElement = document.createElement('div');
            gameElement.className = 'game';

            const gameNameElement = document.createElement('div');
            gameNameElement.className = 'game-name';
            gameNameElement.textContent = game.name[1];
            gameNameElement.style.backgroundColor = game.color;

            if (game.image) {
                const imageElement = document.createElement('img');
                imageElement.src = image;
                imageElement.alt = game.name[0];
                imageElement.className = 'image-container';
                gameElement.appendChild(imageElement);
            }

            gameElement.appendChild(gameNameElement);
            anchorElement.appendChild(gameElement);

            if (game.group) {
                const groupElement = document.createElement('div');
                groupElement.textContent = game.group;
                gameElement.appendChild(groupElement);
            }

            return anchorElement;
        };

        const createCategorySection = (games, categoryName) => {
            const section = document.createElement('div');
            section.className = 'category-section';

            const title = document.createElement('h2');
            title.textContent = categoryName;
            gamesGrid.appendChild(title);

            games.forEach(game => {
                section.appendChild(createGameElement(game));
            });

            return section;
        };

        const groups = [...new Set(games.map(game => game.group))];

        groups.forEach(group => {
            const groupGames = games.filter(game => game.group === group);
            if (groupGames.length > 0) {
                gamesGrid.appendChild(createCategorySection(groupGames, group));
            }
        });

        document.getElementById('search-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const query = document.getElementById('search-query').value;
            if (query) {
                window.location.href = `../pages/search.html?q=${encodeURIComponent(query)}`;
            }
        });
    })
    .catch(error => console.error('Error:', error));