// Fetch the data from the search-index.json file
fetch('json/search-index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(characters => {
        const charactersGrid = document.querySelector('.characters-grid');

        charactersGrid.innerHTML = '';

        characters.forEach(character => {
            // Check if the category is either "character" or "group"
            if (character.category === 'character' || character.category === 'group') {
                // Create the anchor element
                const anchorElement = document.createElement('a');
                anchorElement.href = character.link;

                const characterElement = document.createElement('div');
                characterElement.className = 'character';

                // Create the character name element
                const characterNameElement = document.createElement('div');
                characterNameElement.className = 'character-name';
                characterNameElement.textContent = character.name[1];
                characterNameElement.style.backgroundColor = character.color;

                // Check if the character has an image
                if (character.image) {
                    const imageElement = document.createElement('img');
                    imageElement.src = character.image;
                    imageElement.alt = character.name[1];
                    imageElement.className = 'image-container';
                    characterElement.appendChild(imageElement);
                }

                characterElement.appendChild(characterNameElement);
                anchorElement.appendChild(characterElement);
                charactersGrid.appendChild(anchorElement);
            }
        });
    })
    .catch(error => console.error('Error:', error));