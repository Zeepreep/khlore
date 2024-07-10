const basePath = '../';

fetch('../json/search-index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(characters => {
        const charactersGrid = document.querySelector('.characters-grid');

        charactersGrid.innerHTML = '';

        const createCharacterElement = (character) => {
            const link = basePath + character.link;
            const image = basePath + character.image;

            const anchorElement = document.createElement('a');
            anchorElement.href = link;

            const characterElement = document.createElement('div');
            characterElement.className = 'character';

            const characterNameElement = document.createElement('div');
            characterNameElement.className = 'character-name';
            characterNameElement.textContent = character.name[1];
            characterNameElement.style.backgroundColor = character.color;

            if (character.image) {
                const imageElement = document.createElement('img');
                imageElement.src = image;
                imageElement.alt = character.name[1];
                imageElement.className = 'image-container';
                characterElement.appendChild(imageElement);
            }

            characterElement.appendChild(characterNameElement);
            anchorElement.appendChild(characterElement);

            return anchorElement;
        };

        const createCategorySection = (characters, categoryName) => {
            const section = document.createElement('div');
            section.className = 'category-section';

            const title = document.createElement('h2');
            title.textContent = categoryName;
            charactersGrid.appendChild(title); // Append the title to the charactersGrid, not the section

            characters.forEach(character => {
                if (character.category === 'character' || character.category === 'group') {
                    section.appendChild(createCharacterElement(character));
                }
            });

            return section;
        };

        const groups = [...new Set(characters.map(character => character.group))];

        groups.forEach(group => {
            const groupCharacters = characters.filter(character => character.group === group);
            charactersGrid.appendChild(createCategorySection(groupCharacters, group));
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