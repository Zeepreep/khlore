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
            } else if (tag.match(/^(sora|roxas|organization-xiii)$/)) {
                tags.character.add(tag);
            } else {
                tags.world.add(tag);
            }
        });
    });

    Object.keys(tags).forEach(type => {
        const filterTagsContainer = document.querySelector(`.${type}-tags`);
        filterTagsContainer.innerHTML = ''; // Clear existing tags
        tags[type].forEach(tag => {
            const tagElement = document.createElement('label');
            tagElement.classList.add('game-tag');
            tagElement.style.setProperty('--color', getTagColor(tag));
            tagElement.innerHTML = `<input type="checkbox" class="tag-filter" value="${tag}"> ${tag.toUpperCase()}`;
            filterTagsContainer.appendChild(tagElement);
        });
    });

    // Add event listeners to the newly created checkboxes
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
        'organization-xiii': '#000000',
        'twilight-town': '#00ff00',
        'the-world-that-never-was': '#0000ff'
    };
    return colors[tag] || '#000000';
}

function showFilter(type) {
    document.querySelectorAll('.filter-tags').forEach(el => el.classList.remove('active'));
    document.querySelector(`.${type}-tags`).classList.add('active');
    document.querySelectorAll('.filter-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${type}-tab`).classList.add('active');
}

// Initialize filters on page load
window.onload = function () {
    createFilterTags();
};