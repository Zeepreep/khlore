document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;
    if (query) {
        window.location.href = `../search.html?q=${encodeURIComponent(query)}`;
    }
});

document.querySelectorAll('.filter-tabs button').forEach(button => {
    button.addEventListener('click', function () {
        const slidingBackground = document.getElementById('sliding-background');
        const rect = this.getBoundingClientRect();
        const containerRect = this.parentElement.getBoundingClientRect();

        slidingBackground.style.left = `${rect.left - containerRect.left}px`;
        slidingBackground.style.width = `${rect.width}px`;
    });
});

function toggleSidebar() {
    const sidebar = document.querySelector('.content-side-bar');
    const button = document.querySelector('.toggle-sidebar-btn');
    if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
        button.innerHTML = '☰';
    } else {
        sidebar.style.display = 'block';
        button.innerHTML = '✖';
    }
}


let tags = {};

async function createFilterTags() {
    const uniqueTags = gatherUniqueTags();

    try {
        const response = await fetch('../../json/search-index.json');
        const data = await response.json();

        data.forEach(item => {
            if (item.hasOwnProperty('tag') && item.hasOwnProperty('color') && item.hasOwnProperty('name') && item.hasOwnProperty('category')) {
                let tag = item.tag;
                let color = item.color;
                let name = item.name;
                let category = item.category;

                tags[tag] = {color: color, name: name, category: category};
            }
        });

        const gamesDiv = document.querySelector('.header .games');

        uniqueTags.forEach(tagKey => {
            if (tags.hasOwnProperty(tagKey) && tags[tagKey].category !== 'group') {
                const filterTagsContainer = document.querySelector(`.${tags[tagKey].category}-tags`);
                if (filterTagsContainer) {
                    const tagContainer = document.createElement('div');
                    tagContainer.classList.add(`tag-${tagKey}-tags`);

                    const tagData = tags[tagKey];
                    const tagElement = document.createElement('label');
                    tagElement.classList.add('game-tag');
                    tagElement.style.setProperty('--color', tagData.color);

                    const displayName = getTagName(tagKey, false);

                    tagElement.innerHTML = `<input type="checkbox" class="tag-filter" value="${tagKey}"> ${displayName}`;
                    tagContainer.appendChild(tagElement);
                    filterTagsContainer.appendChild(tagContainer);

                    if (tagData.category === 'game' && gamesDiv) {
                        const gameDiv = document.createElement('div');
                        gameDiv.className = `game ${tagKey}`;
                        gameDiv.textContent = tagData.name[0];
                        gameDiv.style.setProperty('--color', tagData.color);
                        gamesDiv.appendChild(gameDiv);
                    }
                } else {
                    console.log(`Element with class ${tags[tagKey].category}-tags not found`);
                }
            }
        });

        document.querySelectorAll('.tag-filter').forEach(filter => {
            filter.addEventListener('change', function () {
                const isChecked = this.checked;
                const label = this.parentElement;

                if (isChecked) {
                    label.classList.add('checked');
                    label.style.outline = 'none';
                } else {
                    label.classList.remove('checked');
                    label.style.outline = '';
                }

                filterImages();
            });
        });


        attachTagsToBoxes();
    } catch
        (error) {
        console.error('Error:', error);
    }
}

function filterImages() {
    const selectedTags = Array.from(document.querySelectorAll('.tag-filter:checked')).map(filter => filter.value);

    if (selectedTags.length === 0) {
        document.querySelectorAll('.image-container').forEach(container => {
            container.style.display = 'grid';
        });
    } else {
        document.querySelectorAll('.image-container').forEach(container => {
            const containerTags = container.getAttribute('data-tags').split(' ');

            const hasSelectedTag = containerTags.some(tag => selectedTags.includes(tag));

            container.style.display = hasSelectedTag ? 'grid' : 'none';
        });

    }
}

function showFilter(type) {
    document.querySelectorAll('.filter-tags').forEach(el => el.classList.remove('active'));
    document.querySelector(`.${type}-tags`).classList.add('active');
    document.querySelectorAll('.filter-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${type}-tab`).classList.add('active');
}


function attachTagsToBoxes() {
    document.querySelectorAll('.image-container').forEach(container => {
        const containerTags = container.getAttribute('data-tags').split(' ');

        const tagsGroup = document.createElement('div');
        tagsGroup.classList.add('tags-container');

        while (tagsGroup.firstChild) {
            tagsGroup.removeChild(tagsGroup.firstChild);
        }

        containerTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('block-tag');
            tagElement.style.setProperty('--color', getTagColor(tag));

            const displayName = getTagName(tag, false);
            if (displayName) {
                tagElement.textContent = displayName;
                tagsGroup.appendChild(tagElement);
            }
        });

        container.prepend(tagsGroup);
    });
}

async function changeTopBarColor() {
    try {
        const response = await fetch('../../json/search-index.json');
        const data = await response.json();

        const url = window.location.href;
        const characterTag = url.split('/').pop().split('.')[0];

        console.log('characterTag:', characterTag);

        const character = data.find(item => {
            console.log('item.tag:', item.tag); 
            return typeof item.tag === 'string' && item.tag.toLowerCase() === characterTag.toLowerCase();
        });

        console.log('character:', character);

        if (character && character.color) {
            const topBar = document.querySelector('.top-bar');
            if (topBar) {
                topBar.style.backgroundColor = character.color;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function gatherUniqueTags() {
    const uniqueTags = new Set();
    document.querySelectorAll('.image-container').forEach(container => {
        const containerTags = container.getAttribute('data-tags').split(' ');
        containerTags.forEach(tag => uniqueTags.add(tag));
    });
    return Array.from(uniqueTags);
}

function getTagName(tag, isFullName) {
    const tagObject = tags[tag];

    return tagObject ? (isFullName ? tagObject.name[1] : tagObject.name[0]) : '';
}

function getTagColor(tag) {
    const tagObject = tags[tag];

    return tagObject ? tagObject.color : '#000000';
}

window.onload = async function () {
    await createFilterTags();
    attachTagsToBoxes();
    changeTopBarColor();
}