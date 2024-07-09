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

function createFilterTags() {
    const tags = {
        game: new Set(),
        character: new Set(),
        world: new Set()
    };

    document.querySelectorAll('.image-container').forEach(container => {
        const containerTags = container.getAttribute('data-tags').split(' ');
        containerTags.forEach(tag => {
            if (tag.match(/^(kh1|recom|kh2|358|bbs|ddd|kh3|dr)$/)) {
                tags.game.add(tag);
            } else if (tag.match(/^(sora|roxas|organization-xiii|marluxia|vexen|axel)$/)) {
                tags.character.add(tag);
            } else {
                tags.world.add(tag);
            }
        });
    });

    Object.keys(tags).forEach(type => {
        const filterTagsContainer = document.querySelector(`.${type}-tags`);
        filterTagsContainer.innerHTML = '';
        tags[type].forEach(tag => {
            const tagElement = document.createElement('label');
            tagElement.classList.add('game-tag');
            tagElement.style.setProperty('--color', getTagColor(tag));

            const displayName = getTagName(tag, false);

            tagElement.innerHTML = `<input type="checkbox" class="tag-filter" value="${tag}"> ${displayName}`;
            filterTagsContainer.appendChild(tagElement);
        });
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
}

function getTagColor(tag) {
    const colors = {
        kh1: '#58ab58',
        recom: '#ffffff',
        kh2: '#5fc0e0',
        358: '#a80000',
        bbs: '#7694fd',
        ddd: '#cd03c5',
        kh3: '#fda654',
        dr: '#808080',
        sora: '#ffd700',
        roxas: '#ffa500',
        marluxia: '#f19bf1',
        vexen: '#5b9191',
        axel: '#ff0c0c',
        'organization-xiii': '#484848',
        'twilight-town': '#00ff00',
        'the-world-that-never-was': '#0000ff',
        'castle-oblivion': '#bbbbbb',
    };
    return colors[tag] || '#000000';
}

function getTagName(tag, isShort) {
    const tagNames = {
        kh1: ['KH1', 'Kingdom Hearts'],
        recom: ['RE:COM', 'Re:Chain of Memories'],
        kh2: ['KH2', 'Kingdom Hearts II'],
        358: ['358/2', '358/2 Days'],
        bbs: ['BBS', 'Birth by Sleep'],
        ddd: ['DDD', 'Dream Drop Distance'],
        kh3: ['KH3', 'Kingdom Hearts III'],
        dr: ['DR', 'Dark Road'],
        sora: ['Sora', 'Sora'],
        roxas: ['Roxas', 'Roxas'],
        marluxia: ['Marluxia', 'Marluxia'],
        vexen: ['Vexen', 'Vexen'],
        axel: ['Axel', 'Axel'],
        'organization-xiii': ['Org XIII', 'Organization XIII'],
        'twilight-town': ['Twilight Town', 'Twilight Town'],
        'the-world-that-never-was': ['TWTNW', 'The World That Never Was'],
        'castle-oblivion': ['Castle Oblivion', 'Castle Oblivion'],
    };
    return tagNames[tag] ? tagNames[tag][isShort ? 0 : 1] : tag;
}

function showFilter(type) {
    document.querySelectorAll('.filter-tags').forEach(el => el.classList.remove('active'));
    document.querySelector(`.${type}-tags`).classList.add('active');
    document.querySelectorAll('.filter-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${type}-tab`).classList.add('active');
}

window.onload = function () {
    createFilterTags();
}

function attachTagsToBoxes() {
    document.querySelectorAll('.image-container').forEach(container => {
        const containerTags = container.getAttribute('data-tags').split(' ');

        const tagsGroup = document.createElement('div');
        tagsGroup.classList.add('tags-container');

        containerTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('block-tag');
            tagElement.style.setProperty('--color', getTagColor(tag));

            const displayName = getTagName(tag, true);
            tagElement.textContent = displayName;

            tagsGroup.appendChild(tagElement);
        });

        container.prepend(tagsGroup);
    });
}

window.onload = function () {
    createFilterTags();
    attachTagsToBoxes();
}

;