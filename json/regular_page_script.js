document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;
    if (query) {
        window.location.href = `../search.html?q=${encodeURIComponent(query)}`;
    }
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

        fetch('../../json/search-index.json')
            .then(response => response.json())
            .then(data => {
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
                    if (tags.hasOwnProperty(tagKey)) {
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

                            console.log(`Element with class ${tags[tagKey].category}-tags not found`);
                        }
                    }
                });

                document.querySelectorAll('.tag-filter').forEach(filter => {
                    filter.addEventListener('change', function () {
                        const selectedTags = Array.from(document.querySelectorAll('.tag-filter:checked')).map(checkbox => checkbox.value);
                        document.querySelectorAll('.image-container').forEach(box => {
                            const boxTags = box.getAttribute('data-tags').split(' ');
                            const isVisible = selectedTags.some(tag => boxTags.includes(tag));
                            box.style.display = isVisible || selectedTags.length === 0 ? 'block' : 'none';
                        });
                    });
                });


                attachTagsToBoxes();
            })
    } catch (error) {
        console.error('Error:', error);
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
}