const basePath = '../';

fetch('../json/search-index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const worlds = data.filter(item => item.category === 'world');
        const worldsGrid = document.querySelector('.worlds-grid');

        worldsGrid.innerHTML = '';

        const createWorldElement = (world) => {
            const link = basePath + world.link;
            const image = basePath + world.image;

            const anchorElement = document.createElement('a');
            anchorElement.href = link;

            const worldElement = document.createElement('div');
            worldElement.className = 'world';

            const worldNameElement = document.createElement('div');
            worldNameElement.className = 'world-name';
            worldNameElement.textContent = world.name[1];
            worldNameElement.style.backgroundColor = world.color;

            if (world.image) {
                const imageElement = document.createElement('img');
                imageElement.src = image;
                imageElement.alt = world.name[0];
                imageElement.className = 'image-container';
                worldElement.appendChild(imageElement);
            }

            worldElement.appendChild(worldNameElement);
            anchorElement.appendChild(worldElement);

            if (world.group) {
                const groupElement = document.createElement('div');
                groupElement.textContent = world.group;
                worldElement.appendChild(groupElement);
            }

            return anchorElement;
        };

        const createCategorySection = (worlds, categoryName) => {
            const section = document.createElement('div');
            section.className = 'category-section';

            const title = document.createElement('h2');
            title.textContent = categoryName;
            worldsGrid.appendChild(title);

            worlds.forEach(world => {
                section.appendChild(createWorldElement(world));
            });

            return section;
        };

        const groups = [...new Set(worlds.map(world => world.group))];

        groups.forEach(group => {
            const groupWorlds = worlds.filter(world => world.group === group);
            if (groupWorlds.length > 0) {
                worldsGrid.appendChild(createCategorySection(groupWorlds, group));
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