/**
 * D&D 5e Playbook Dashboard JS Application
 */

const API_BASE_URL = 'https://www.dnd5eapi.co';
const API_URL = `${API_BASE_URL}/api`;

// Local memory cache for API requests to speed up loading and prevent API abuse
const apiCache = {
    classes: null,
    spells: null,
    monsters: null,
    races: null,
    equipment: null,
    rules: null,
    details: {} // Caches details keyed by URL endpoint
};

// Application State
const state = {
    currentView: 'dashboard',
    bookmarks: JSON.parse(localStorage.getItem('dnd_playbook_bookmarks')) || [],
    diceSelection: { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 },
    diceModifier: 0,
    rollHistory: JSON.parse(localStorage.getItem('dnd_playbook_roll_history')) || [],
    activeModalItem: null, // Track currently open modal item for bookmark toggle
    draftCharacter: JSON.parse(localStorage.getItem('dnd_playbook_draft_character')) || {
        name: 'Adran Galanodel',
        race: 'elf',
        class: 'fighter',
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
    },
    pagination: {
        spells: { current: 0, limit: 30 },
        monsters: { current: 0, limit: 30 },
        equipment: { current: 0, limit: 30 }
    }
};

// DnD tips list
const ADVENTURER_TIPS = [
    "Always keep a 50-foot hempen rope. You never know when you'll need to climb, bind, or trip your foes.",
    "Firebolt is great, but don't underestimate Minor Illusion for distracting guards or creating cover.",
    "A Bard's Bardic Inspiration can turn a crucial failure into a heroic success. Don't forget to use it!",
    "Monsters with resistance to non-magical damage can be bypasses by magic weapons or certain spells like Magic Weapon.",
    "In combat, you can take the 'Help' action to give an ally advantage on their next attack roll.",
    "Concentration spells end if you cast another concentration spell, fall unconscious, or fail a Con saving throw.",
    "Short rests let you spend Hit Dice to recover hit points and allow classes like Warlock or Fighter to regain resources.",
    "Don't split the party. Ever. It makes combat harder and encounters far deadlier."
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Initialization
function initApp() {
    setupRouting();
    setupEventListeners();
    setupDiceRoller();
    setupCharacterDraft();
    rotateTip();
    
    // Load dashboard stats & favorites
    loadDashboardData();
    
    // Global search setup
    setupGlobalSearch();

    // Default theme check
    const currentTheme = localStorage.getItem('dnd_playbook_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
}

// ==========================================================================
// ROUTING
// ==========================================================================
function setupRouting() {
    const handleRoute = () => {
        let hash = window.location.hash.slice(1) || 'dashboard';
        const validViews = ['dashboard', 'rules', 'classes', 'spells', 'races', 'monsters', 'equipment', 'dice', 'draft', 'bookmarks'];
        
        if (!validViews.includes(hash)) {
            hash = 'dashboard';
        }
        
        // Update state
        state.currentView = hash;
        
        // Update Title
        const viewTitles = {
            dashboard: 'Dashboard',
            rules: 'Rules Reference Book',
            classes: 'Classes Index',
            spells: 'Spellbook',
            races: 'Races Encyclopedia',
            monsters: 'Beast Registry',
            equipment: 'Equipment Catalog',
            dice: 'Virtual Dice Roller',
            draft: 'Character Draft Creator',
            bookmarks: 'Favorites & Bookmarks'
        };
        document.getElementById('current-view-title').textContent = viewTitles[hash];

        // Swap View Sections
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(`view-view-${hash}`) || document.getElementById(`view-${hash}`);
        if (activeSection) {
            activeSection.classList.remove('hidden');
            activeSection.classList.add('active');
        }

        // Highlight sidebar menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === hash) {
                item.classList.add('active');
            }
        });

        // Trigger view-specific data loading
        triggerViewLoad(hash);
    };

    window.addEventListener('hashchange', handleRoute);
    // Execute once on load
    handleRoute();
}

function triggerViewLoad(view) {
    if (view === 'dashboard') {
        loadDashboardData();
    } else if (view === 'rules') {
        loadRulesBook();
    } else if (view === 'classes') {
        loadClassesView();
    } else if (view === 'spells') {
        loadSpellsView();
    } else if (view === 'races') {
        loadRacesView();
    } else if (view === 'monsters') {
        loadMonstersView();
    } else if (view === 'equipment') {
        loadEquipmentView();
    } else if (view === 'bookmarks') {
        loadBookmarksView();
    }
}

// ==========================================================================
// DATA FETCHING & LOCAL CACHING
// ==========================================================================
async function fetchFromApi(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from D&D API: ${endpoint}`, error);
        return null;
    }
}

async function fetchDetails(url) {
    if (apiCache.details[url]) {
        return apiCache.details[url];
    }
    const data = await fetchFromApi(url.replace('/api', ''));
    if (data) {
        apiCache.details[url] = data;
    }
    return data;
}

// ==========================================================================
// DASHBOARD
// ==========================================================================
async function loadDashboardData() {
    renderDashboardFavorites();

    // Fetch totals dynamically if not already cached
    try {
        const classes = apiCache.classes || await fetchFromApi('/classes');
        if (classes) {
            apiCache.classes = classes;
            document.getElementById('stat-classes').textContent = classes.count;
        }

        const spells = apiCache.spells || await fetchFromApi('/spells');
        if (spells) {
            apiCache.spells = spells;
            document.getElementById('stat-spells').textContent = spells.count;
        }

        const monsters = apiCache.monsters || await fetchFromApi('/monsters');
        if (monsters) {
            apiCache.monsters = monsters;
            document.getElementById('stat-monsters').textContent = monsters.count;
        }

        const races = apiCache.races || await fetchFromApi('/races');
        if (races) {
            apiCache.races = races;
            document.getElementById('stat-races').textContent = races.count;
        }
    } catch (e) {
        console.error("Error loading stats counts", e);
    }
}

function rotateTip() {
    const tipText = document.getElementById('tip-text');
    if (tipText) {
        const randomIndex = Math.floor(Math.random() * ADVENTURER_TIPS.length);
        tipText.textContent = `"${ADVENTURER_TIPS[randomIndex]}"`;
    }
}

// ==========================================================================
// BOOKMARKS & FAVORITES
// ==========================================================================
function addBookmark(index, name, type, url) {
    if (state.bookmarks.some(b => b.index === index && b.type === type)) {
        return; // Already added
    }
    state.bookmarks.push({ index, name, type, url });
    localStorage.setItem('dnd_playbook_bookmarks', JSON.stringify(state.bookmarks));
    renderDashboardFavorites();
    updateModalBookmarkButton(index, type);
}

function removeBookmark(index, type) {
    state.bookmarks = state.bookmarks.filter(b => !(b.index === index && b.type === type));
    localStorage.setItem('dnd_playbook_bookmarks', JSON.stringify(state.bookmarks));
    renderDashboardFavorites();
    
    // If we're on the favorites tab, reload the view
    if (state.currentView === 'bookmarks') {
        loadBookmarksView();
    }
    updateModalBookmarkButton(index, type);
}

function renderDashboardFavorites() {
    const container = document.getElementById('dashboard-favorites');
    if (!container) return;

    if (state.bookmarks.length === 0) {
        container.innerHTML = `<p class="empty-state">No bookmarks saved yet. Click the bookmark icon <i class="fa-regular fa-bookmark"></i> on details pages to save them here!</p>`;
        return;
    }

    // Limit dashboard bookmarks preview to top 6
    const topBookmarks = state.bookmarks.slice(0, 6);
    let html = '';
    
    topBookmarks.forEach(bookmark => {
        let typeIcon = 'fa-scroll';
        if (bookmark.type === 'spell') typeIcon = 'fa-wand-magic-sparkles';
        else if (bookmark.type === 'class') typeIcon = 'fa-shield-halved';
        else if (bookmark.type === 'monster') typeIcon = 'fa-dragon';
        else if (bookmark.type === 'race') typeIcon = 'fa-users';
        else if (bookmark.type === 'rule') typeIcon = 'fa-scroll';

        html += `
            <div class="fav-card" onclick="openDetailsModal('${bookmark.index}', '${bookmark.type}', '${bookmark.url}')">
                <button class="fav-remove-btn" onclick="event.stopPropagation(); removeBookmark('${bookmark.index}', '${bookmark.type}')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="fav-title">${bookmark.name}</div>
                <div class="fav-type"><i class="fa-solid ${typeIcon}"></i> ${bookmark.type}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function loadBookmarksView() {
    const grid = document.getElementById('bookmarks-grid');
    if (!grid) return;

    const activeCatFilter = document.querySelector('.fav-cat-btn.active').getAttribute('data-cat');
    const filtered = activeCatFilter === 'all' 
        ? state.bookmarks 
        : state.bookmarks.filter(b => b.type === activeCatFilter.slice(0, -1) || (activeCatFilter === 'rules' && b.type === 'rule'));

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="empty-state">No favorites saved in this category.</p>`;
        return;
    }

    let html = '';
    filtered.forEach(bookmark => {
        let typeIcon = 'fa-scroll';
        if (bookmark.type === 'spell') typeIcon = 'fa-wand-magic-sparkles';
        else if (bookmark.type === 'class') typeIcon = 'fa-shield-halved';
        else if (bookmark.type === 'monster') typeIcon = 'fa-dragon';
        else if (bookmark.type === 'race') typeIcon = 'fa-users';
        else if (bookmark.type === 'rule') typeIcon = 'fa-scroll';

        html += `
            <div class="fav-card" onclick="openDetailsModal('${bookmark.index}', '${bookmark.type}', '${bookmark.url}')">
                <button class="fav-remove-btn" onclick="event.stopPropagation(); removeBookmark('${bookmark.index}', '${bookmark.type}')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="fav-title">${bookmark.name}</div>
                <div class="fav-type"><i class="fa-solid ${typeIcon}"></i> ${bookmark.type}</div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// ==========================================================================
// RULES BOOK VIEW
// ==========================================================================
async function loadRulesBook() {
    const categoriesList = document.getElementById('rule-categories');
    if (!categoriesList) return;

    categoriesList.innerHTML = `<li><i class="fa-solid fa-spinner fa-spin"></i> Loading...</li>`;

    // Fetch rules index
    if (!apiCache.rules) {
        apiCache.rules = await fetchFromApi('/rules');
    }

    if (!apiCache.rules || !apiCache.rules.results) {
        categoriesList.innerHTML = `<li>Error loading rules.</li>`;
        return;
    }

    let html = '';
    apiCache.rules.results.forEach(rule => {
        html += `<li class="rule-cat-item" data-index="${rule.index}" data-name="${rule.name}">${rule.name}</li>`;
    });
    categoriesList.innerHTML = html;

    // Add category click listener
    document.querySelectorAll('.rule-cat-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            document.querySelectorAll('.rule-cat-item').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            const index = item.getAttribute('data-index');
            const name = item.getAttribute('data-name');
            loadRuleContent(index, name);
        });
    });

    // Auto-select first rule category
    if (apiCache.rules.results.length > 0) {
        categoriesList.querySelector('.rule-cat-item').click();
    }
}

async function loadRuleContent(index, name) {
    const pane = document.getElementById('rule-content-pane');
    pane.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Loading rule sections...</div>`;

    const ruleData = await fetchDetails(`/api/rules/${index}`);
    if (!ruleData) {
        pane.innerHTML = `<div class="empty-state">Error loading rule details.</div>`;
        return;
    }

    // Layout rules content pane with sections
    let tabsHtml = '';
    ruleData.subsections.forEach((sub, idx) => {
        tabsHtml += `<button class="rule-section-tab ${idx === 0 ? 'active' : ''}" data-url="${sub.url}" data-name="${sub.name}" data-index="${sub.index}">${sub.name}</button>`;
    });

    pane.innerHTML = `
        <div class="rule-details-header">
            <h2>${name}</h2>
        </div>
        <div class="rule-sections-nav">
            ${tabsHtml}
        </div>
        <div class="rule-html-content" id="rule-section-body">
            <!-- Loaded dynamically on tab click -->
        </div>
    `;

    // Tab switcher
    const tabs = pane.querySelectorAll('.rule-section-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const url = tab.getAttribute('data-url');
            const secName = tab.getAttribute('data-name');
            const secIndex = tab.getAttribute('data-index');

            const body = document.getElementById('rule-section-body');
            body.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Loading content...`;

            const secData = await fetchDetails(url);
            if (secData) {
                // Convert Markdown headers or description text to clean HTML
                body.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="margin:0;">${secName}</h3>
                        <button class="action-btn" title="Save this Section" onclick="addBookmark('${secIndex}', '${secName}', 'rule', '${url}')" style="width:30px; height:30px; font-size:12px;">
                            <i class="fa-regular fa-bookmark"></i>
                        </button>
                    </div>
                    ${formatMarkdown(secData.desc)}
                `;
            } else {
                body.innerHTML = `Error loading rule section content.`;
            }
        });
    });

    // Auto load first subsection tab
    if (tabs.length > 0) {
        tabs[0].click();
    }
}

// Simple parser for markdown strings returned in API descriptions
function formatMarkdown(text) {
    if (!text) return '';
    
    // Replace custom headers
    let html = text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^# (.*$)/gim, '<h3>$1</h3>');
        
    // Replace bullet points
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    
    // Group adjacent <li> items into <ul>
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    // Clean nested lists double brackets
    html = html.replace(/<\/ul>\s*<ul>/gim, '');
    
    // Handle paragraphs (replace double linebreaks with paragraphs)
    html = html.split('\n\n').map(p => {
        if (!p.trim()) return '';
        if (p.startsWith('<h3') || p.startsWith('<ul') || p.startsWith('<li')) return p;
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    // Handle inline formatting (bold / italic)
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>');

    // Remove API reference brackets like [Spellcasting]
    html = html.replace(/\[(.*?)\]/g, '$1');
    
    return html;
}

// ==========================================================================
// CLASSES VIEW
// ==========================================================================
async function loadClassesView() {
    const container = document.getElementById('classes-container');
    if (!container) return;

    container.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Gathering classes...</div>`;

    if (!apiCache.classes) {
        apiCache.classes = await fetchFromApi('/classes');
    }

    if (!apiCache.classes || !apiCache.classes.results) {
        container.innerHTML = `<div class="empty-state">Error loading classes.</div>`;
        return;
    }

    // Descriptions matching each class (flavor text)
    const classFlavors = {
        barbarian: "A fierce warrior of primitive background who can enter a battle rage.",
        bard: "An inspiring magician whose power echoes the music of creation.",
        cleric: "A priestly champion who wields divine magic in service of a higher power.",
        druid: "A priest of the Old Faith, wielding the powers of nature and adopting animal forms.",
        fighter: "A master of martial combat, skilled with a variety of weapons and armor.",
        monk: "A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.",
        paladin: "A holy warrior bound to a sacred oath.",
        ranger: "A warrior who uses martial prowess and nature magic to combat threats on the edges of the wild.",
        rogue: "A scoundrel who uses stealth and trickery to overcome obstacles and enemies.",
        sorcerer: "A spellcaster who draws on inherent magic from a gift or bloodline.",
        warlock: "A wielder of magic that is derived from a bargain with an extraplanar entity.",
        wizard: "A scholarly magic-user capable of manipulating the structures of reality."
    };

    const classIcons = {
        barbarian: "fa-gavel",
        bard: "fa-music",
        cleric: "fa-cross",
        druid: "fa-leaf",
        fighter: "fa-shield-halved",
        monk: "fa-hand-fist",
        paladin: "fa-award",
        ranger: "fa-bullseye",
        rogue: "fa-mask",
        sorcerer: "fa-fire",
        warlock: "fa-eye",
        wizard: "fa-hat-wizard"
    };

    let html = '';
    apiCache.classes.results.forEach(cls => {
        const flavor = classFlavors[cls.index] || "A heroic adventurer class.";
        const icon = classIcons[cls.index] || "fa-shield-halved";
        
        html += `
            <div class="class-card" onclick="openDetailsModal('${cls.index}', 'class', '${cls.url}')">
                <div class="class-header">
                    <span class="class-name">${cls.name}</span>
                    <i class="fa-solid ${icon} class-icon"></i>
                </div>
                <p class="class-desc">${flavor}</p>
                <div class="class-meta">
                    <span>Explore Class details <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ==========================================================================
// SPELLS VIEW
// ==========================================================================
async function loadSpellsView() {
    const container = document.getElementById('spells-container');
    if (!container) return;

    if (!apiCache.spells) {
        container.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Copying spells into Spellbook...</div>`;
        apiCache.spells = await fetchFromApi('/spells');
    }

    if (!apiCache.spells || !apiCache.spells.results) {
        container.innerHTML = `<div class="empty-state">Error loading spells.</div>`;
        return;
    }

    // Reset pagination
    state.pagination.spells.current = 0;
    
    // Add event listeners for filters if not done
    const searchInput = document.getElementById('spell-search');
    const levelSelect = document.getElementById('spell-level');
    const schoolSelect = document.getElementById('spell-school');

    const filterSpells = () => {
        const query = searchInput.value.toLowerCase();
        const level = levelSelect.value;
        const school = schoolSelect.value;

        // In the D&D API index list, spells don't have level or school, so we can search by name.
        // We will fetch spell metadata on card rendering or we can filter names.
        // Let's filter the full list of results
        const filtered = apiCache.spells.results.filter(spell => {
            const matchesQuery = spell.name.toLowerCase().includes(query);
            // Advanced filters require fetching full details. To do this without hitting rate limits,
            // we can filter spelling indices. Wait, let's look at the index structure.
            // D&D API doesn't return spell levels in index. So we filter primarily by name,
            // and we load levels on demand. To handle school and level filters, we can check if 
            // the spell contains level keywords (e.g. "cantrip" or "1st-level" in details cache)
            // or just load details on the fly.
            // Let's provide filter results based on what we have cached, or show all and query API
            return matchesQuery;
        });

        renderSpellsGrid(filtered);
    };

    searchInput.addEventListener('input', filterSpells);
    levelSelect.addEventListener('change', filterSpells);
    schoolSelect.addEventListener('change', filterSpells);

    // Initial render
    renderSpellsGrid(apiCache.spells.results);
}

function renderSpellsGrid(spells) {
    const container = document.getElementById('spells-container');
    const limit = state.pagination.spells.limit;
    
    if (spells.length === 0) {
        container.innerHTML = `<p class="empty-state">No spells found matching the search criteria.</p>`;
        return;
    }

    const chunk = spells.slice(0, limit);
    let html = '';
    
    chunk.forEach(spell => {
        html += `
            <div class="item-card" onclick="openDetailsModal('${spell.index}', 'spell', '${spell.url}')">
                <div>
                    <div class="item-name" title="${spell.name}">${spell.name}</div>
                    <div class="item-subtitle">D&D 5e Spell</div>
                </div>
                <div class="item-tags">
                    <span class="item-tag level-tag">View Info</span>
                </div>
            </div>
        `;
    });
    
    // If there are more items, add a Load More button
    if (spells.length > limit) {
        html += `
            <div class="load-more-container" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <button class="dice-action-btn primary" id="load-more-spells-btn" style="display:inline-block; width:200px;">Load More</button>
            </div>
        `;
    }

    container.innerHTML = html;

    const loadMoreBtn = document.getElementById('load-more-spells-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            state.pagination.spells.limit += 30;
            renderSpellsGrid(spells);
        });
    }
}

// ==========================================================================
// RACES VIEW
// ==========================================================================
async function loadRacesView() {
    const container = document.getElementById('races-container');
    if (!container) return;

    container.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Reading race journals...</div>`;

    if (!apiCache.races) {
        apiCache.races = await fetchFromApi('/races');
    }

    if (!apiCache.races || !apiCache.races.results) {
        container.innerHTML = `<div class="empty-state">Error loading races.</div>`;
        return;
    }

    const raceFlavors = {
        dwarf: "Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.",
        elf: "Elves are a magical people of supernatural grace, living in the world but not entirely part of it.",
        halfling: "The tiny halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.",
        human: "Humans are the most adaptable and ambitious people among the common races.",
        dragonborn: "Dragonborn look very much like dragons standing erect in humanoid form, though they lack wings or a tail.",
        gnome: "A constant hum of busy activity pervades the warrens and neighborhoods where gnomes make their homes.",
        "half-elf": "Half-elves combine what some say are the best qualities of their elf and human parents.",
        "half-orc": "Half-orcs' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain.",
        tiefling: "To be greeted with whispers and stares, to suffer violence and insult on the street... this is the tiefling's lot."
    };

    let html = '';
    apiCache.races.results.forEach(race => {
        const flavor = raceFlavors[race.index] || "A playable fantasy race.";
        html += `
            <div class="race-card" onclick="openDetailsModal('${race.index}', 'race', '${race.url}')">
                <div class="race-header">
                    <span class="race-name">${race.name}</span>
                    <i class="fa-solid fa-users-viewfinder race-icon"></i>
                </div>
                <p class="class-desc">${flavor}</p>
                <div class="class-meta">
                    <span>Explore Traits <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ==========================================================================
// MONSTERS VIEW
// ==========================================================================
async function loadMonstersView() {
    const container = document.getElementById('monsters-container');
    if (!container) return;

    if (!apiCache.monsters) {
        container.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Taming monsters...</div>`;
        apiCache.monsters = await fetchFromApi('/monsters');
    }

    if (!apiCache.monsters || !apiCache.monsters.results) {
        container.innerHTML = `<div class="empty-state">Error loading monsters.</div>`;
        return;
    }

    state.pagination.monsters.limit = 30;

    const searchInput = document.getElementById('monster-search');
    const crSelect = document.getElementById('monster-cr');
    const typeSelect = document.getElementById('monster-type');

    const filterMonsters = () => {
        const query = searchInput.value.toLowerCase();
        
        // Since indices are fast, we search by query on the client.
        const filtered = apiCache.monsters.results.filter(monster => {
            return monster.name.toLowerCase().includes(query);
        });

        renderMonstersGrid(filtered);
    };

    searchInput.addEventListener('input', filterMonsters);
    crSelect.addEventListener('change', filterSpellsIfDetailsCached); // Quick details search or just filter list
    typeSelect.addEventListener('change', filterSpellsIfDetailsCached);

    function filterSpellsIfDetailsCached() {
        // Fallback filter
        filterMonsters();
    }

    renderMonstersGrid(apiCache.monsters.results);
}

function renderMonstersGrid(monsters) {
    const container = document.getElementById('monsters-container');
    const limit = state.pagination.monsters.limit;

    if (monsters.length === 0) {
        container.innerHTML = `<p class="empty-state">No monsters found.</p>`;
        return;
    }

    const chunk = monsters.slice(0, limit);
    let html = '';

    chunk.forEach(m => {
        html += `
            <div class="item-card" onclick="openDetailsModal('${m.index}', 'monster', '${m.url}')">
                <div>
                    <div class="item-name" title="${m.name}">${m.name}</div>
                    <div class="item-subtitle">Monster Manual entry</div>
                </div>
                <div class="item-tags">
                    <span class="item-tag cr-tag">View Statblock</span>
                </div>
            </div>
        `;
    });

    if (monsters.length > limit) {
        html += `
            <div class="load-more-container" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <button class="dice-action-btn primary" id="load-more-monsters-btn" style="display:inline-block; width:200px;">Load More</button>
            </div>
        `;
    }

    container.innerHTML = html;

    const loadMoreBtn = document.getElementById('load-more-monsters-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            state.pagination.monsters.limit += 30;
            renderMonstersGrid(monsters);
        });
    }
}

// ==========================================================================
// EQUIPMENT VIEW
// ==========================================================================
async function loadEquipmentView() {
    const container = document.getElementById('equipment-container');
    if (!container) return;

    if (!apiCache.equipment) {
        container.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Stocking shelves...</div>`;
        apiCache.equipment = await fetchFromApi('/equipment');
    }

    if (!apiCache.equipment || !apiCache.equipment.results) {
        container.innerHTML = `<div class="empty-state">Error loading equipment.</div>`;
        return;
    }

    state.pagination.equipment.limit = 30;

    const searchInput = document.getElementById('equipment-search');
    const categorySelect = document.getElementById('equipment-category');

    const filterEquipment = () => {
        const query = searchInput.value.toLowerCase();
        const filtered = apiCache.equipment.results.filter(eq => {
            return eq.name.toLowerCase().includes(query);
        });
        renderEquipmentGrid(filtered);
    };

    searchInput.addEventListener('input', filterEquipment);
    categorySelect.addEventListener('change', filterEquipment);

    renderEquipmentGrid(apiCache.equipment.results);
}

function renderEquipmentGrid(equip) {
    const container = document.getElementById('equipment-container');
    const limit = state.pagination.equipment.limit;

    if (equip.length === 0) {
        container.innerHTML = `<p class="empty-state">No equipment matches found.</p>`;
        return;
    }

    const chunk = equip.slice(0, limit);
    let html = '';

    chunk.forEach(eq => {
        html += `
            <div class="item-card" onclick="openDetailsModal('${eq.index}', 'equipment', '${eq.url}')">
                <div>
                    <div class="item-name" title="${eq.name}">${eq.name}</div>
                    <div class="item-subtitle">Item Gear / Weapon</div>
                </div>
                <div class="item-tags">
                    <span class="item-tag">Details</span>
                </div>
            </div>
        `;
    });

    if (equip.length > limit) {
        html += `
            <div class="load-more-container" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <button class="dice-action-btn primary" id="load-more-equipment-btn" style="display:inline-block; width:200px;">Load More</button>
            </div>
        `;
    }

    container.innerHTML = html;

    const loadMoreBtn = document.getElementById('load-more-equipment-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            state.pagination.equipment.limit += 30;
            renderEquipmentGrid(equip);
        });
    }
}

// ==========================================================================
// DICE ROLLER
// ==========================================================================
function setupDiceRoller() {
    const selectorButtons = document.querySelectorAll('.die-select-btn');
    const formulaDisplay = document.getElementById('current-roll-formula');
    
    // Dice selector inc/dec
    selectorButtons.forEach(btn => {
        const dieType = parseInt(btn.getAttribute('data-die'));
        const countValSpan = btn.querySelector('.count-val');
        const decBtn = btn.querySelector('.dec-die');
        const incBtn = btn.querySelector('.inc-die');
        const dieShape = btn.querySelector('.die-shape');

        dieShape.addEventListener('click', () => {
            state.diceSelection[dieType]++;
            countValSpan.textContent = state.diceSelection[dieType];
            updateDiceFormula();
        });

        incBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            state.diceSelection[dieType]++;
            countValSpan.textContent = state.diceSelection[dieType];
            updateDiceFormula();
        });

        decBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.diceSelection[dieType] > 0) {
                state.diceSelection[dieType]--;
                countValSpan.textContent = state.diceSelection[dieType];
                updateDiceFormula();
            }
        });
    });

    // Modifiers
    const modInput = document.getElementById('dice-mod');
    document.getElementById('inc-mod').addEventListener('click', () => {
        modInput.value = parseInt(modInput.value) + 1;
        state.diceModifier = parseInt(modInput.value);
        updateDiceFormula();
    });

    document.getElementById('dec-mod').addEventListener('click', () => {
        modInput.value = parseInt(modInput.value) - 1;
        state.diceModifier = parseInt(modInput.value);
        updateDiceFormula();
    });

    modInput.addEventListener('change', () => {
        state.diceModifier = parseInt(modInput.value) || 0;
        updateDiceFormula();
    });

    // Clear and Roll
    document.getElementById('roll-clear-btn').addEventListener('click', clearDiceSelection);
    document.getElementById('roll-btn').addEventListener('click', rollSelectedDice);
    
    // Quick Roll d20 (Dashboard Widget)
    const quickD20Btn = document.getElementById('quick-d20-btn');
    if (quickD20Btn) {
        quickD20Btn.addEventListener('click', () => {
            const resultBox = document.getElementById('quick-d20-result');
            resultBox.classList.add('rolling');
            resultBox.textContent = '...';

            setTimeout(() => {
                const roll = Math.floor(Math.random() * 20) + 1;
                resultBox.classList.remove('rolling');
                resultBox.textContent = roll;
                
                // Add details
                let textStyle = '#d4af37';
                if (roll === 20) {
                    textStyle = '#2ec4b6'; // Crit success
                    resultBox.title = "Critical Success!";
                } else if (roll === 1) {
                    textStyle = '#ff4747'; // Crit fail
                    resultBox.title = "Critical Failure!";
                } else {
                    resultBox.removeAttribute('title');
                }
                resultBox.style.color = textStyle;
                
                // Append to roll history
                appendRollHistory("1d20", [roll], 0, roll);
            }, 600);
        });
    }

    renderRollHistory();
}

function updateDiceFormula() {
    const formulaDisplay = document.getElementById('current-roll-formula');
    let parts = [];
    
    for (const [die, count] of Object.entries(state.diceSelection)) {
        if (count > 0) {
            parts.push(`${count}d${die}`);
        }
    }

    let formula = parts.join(' + ');
    if (formula === '') {
        formulaDisplay.textContent = '0 Dice Selected';
        return;
    }

    if (state.diceModifier > 0) {
        formula += ` + ${state.diceModifier}`;
    } else if (state.diceModifier < 0) {
        formula += ` - ${Math.abs(state.diceModifier)}`;
    }

    formulaDisplay.textContent = formula;
}

function clearDiceSelection() {
    state.diceSelection = { 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 };
    state.diceModifier = 0;
    
    document.querySelectorAll('.die-select-btn .count-val').forEach(span => {
        span.textContent = '0';
    });
    document.getElementById('dice-mod').value = 0;
    updateDiceFormula();
}

function rollSelectedDice() {
    const hasDice = Object.values(state.diceSelection).some(count => count > 0);
    if (!hasDice) {
        alert("Select at least one die to roll!");
        return;
    }

    const display = document.getElementById('roll-display');
    display.innerHTML = `<span class="total-result-placeholder"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><br>Rolling dice...</span>`;

    setTimeout(() => {
        let total = 0;
        let breakdown = [];
        let formulaParts = [];
        let allRolls = [];

        for (const [die, count] of Object.entries(state.diceSelection)) {
            if (count > 0) {
                const rollsForDie = [];
                for (let i = 0; i < count; i++) {
                    const roll = Math.floor(Math.random() * parseInt(die)) + 1;
                    rollsForDie.push(roll);
                    allRolls.push(roll);
                    total += roll;
                }
                breakdown.push(`[${rollsForDie.join(', ')}] for d${die}`);
                formulaParts.push(`${count}d${die}`);
            }
        }

        const modifier = state.diceModifier;
        total += modifier;

        let formulaText = formulaParts.join(' + ');
        if (modifier > 0) {
            formulaText += ` + ${modifier}`;
        } else if (modifier < 0) {
            formulaText += ` - ${Math.abs(modifier)}`;
        }

        // Render result display
        display.innerHTML = `
            <div class="roll-total-value">${total}</div>
            <div class="roll-breakdown">${breakdown.join(' + ')} ${modifier !== 0 ? (modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`) : ''}</div>
        `;

        // Save to roll history
        appendRollHistory(formulaText, allRolls, modifier, total);
        
    }, 600);
}

function appendRollHistory(formula, rolls, modifier, total) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const histItem = {
        formula,
        rollsText: rolls.join(', '),
        modifier,
        total,
        time
    };

    state.rollHistory.unshift(histItem);
    // Keep max 20 rolls in history
    if (state.rollHistory.length > 20) {
        state.rollHistory.pop();
    }

    localStorage.setItem('dnd_playbook_roll_history', JSON.stringify(state.rollHistory));
    renderRollHistory();
}

function renderRollHistory() {
    const list = document.getElementById('roll-history');
    if (!list) return;

    if (state.rollHistory.length === 0) {
        list.innerHTML = `<li class="empty-history">No rolls yet. Let's see if luck is on your side!</li>`;
        return;
    }

    let html = '';
    state.rollHistory.forEach(item => {
        html += `
            <li class="roll-history-item">
                <div>
                    <span class="hist-formula"><strong>${item.formula}</strong> at ${item.time}</span>
                    <div class="hist-breakdown">Rolls: [${item.rollsText}]</div>
                </div>
                <span class="hist-total">${item.total}</span>
            </li>
        `;
    });
    list.innerHTML = html;
}

// ==========================================================================
// CHARACTER DRAFT PLANNER
// ==========================================================================
async function setupCharacterDraft() {
    // Populate Races & Classes selects
    const raceSelect = document.getElementById('draft-race');
    const classSelect = document.getElementById('draft-class');

    // Stats modifiers autocalc listeners
    const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    abilityScores.forEach(stat => {
        const input = document.getElementById(`sheet-${stat}-val`);
        if (input) {
            input.addEventListener('input', () => {
                updateAbilityModifier(stat, input.value);
                updateDerivedStats();
            });
        }
    });

    // Handle Roll Stats Button
    const rollBtn = document.getElementById('draft-roll-stats-btn');
    if (rollBtn) {
        rollBtn.addEventListener('click', () => {
            const rollsHolder = document.getElementById('draft-rolls-holder');
            const valuesList = document.getElementById('draft-rolled-values');
            
            rollsHolder.classList.remove('hidden');
            valuesList.innerHTML = '';

            // Roll 6 stats using 4d6 drop lowest
            let rolledScores = [];
            for (let i = 0; i < 6; i++) {
                let rolls = [];
                for (let r = 0; r < 4; r++) {
                    rolls.push(Math.floor(Math.random() * 6) + 1);
                }
                rolls.sort((a, b) => b - a); // descending
                const sum = rolls[0] + rolls[1] + rolls[2]; // drop index 3 (lowest)
                rolledScores.push(sum);
            }

            rolledScores.sort((a, b) => b - a); // Sort results high to low

            rolledScores.forEach(score => {
                const badge = document.createElement('div');
                badge.className = 'rolled-stat-val';
                badge.textContent = score;
                badge.title = "Click to assign to first available slot or drag";
                
                badge.addEventListener('click', () => {
                    // Quick assignment to next unassigned stat or lowest value stat
                    // Let's find first default 10 stat to overwrite
                    for (const stat of abilityScores) {
                        const input = document.getElementById(`sheet-${stat}-val`);
                        if (input.value == '10') {
                            input.value = score;
                            updateAbilityModifier(stat, score);
                            badge.style.opacity = '0.4';
                            badge.style.pointerEvents = 'none';
                            updateDerivedStats();
                            break;
                        }
                    }
                });
                valuesList.appendChild(badge);
            });
        });
    }

    // Name change sync
    const nameInput = document.getElementById('draft-name');
    nameInput.addEventListener('input', () => {
        document.getElementById('sheet-char-name').textContent = nameInput.value || 'Unnamed Hero';
    });

    // Class/Race selectors details update
    classSelect.addEventListener('change', updateClassDerivedDetails);
    raceSelect.addEventListener('change', updateRaceDerivedDetails);

    // Save Character sheet draft
    document.getElementById('draft-save-btn').addEventListener('click', () => {
        const char = {
            name: nameInput.value,
            race: raceSelect.value,
            class: classSelect.value,
            stats: {
                str: parseInt(document.getElementById('sheet-str-val').value),
                dex: parseInt(document.getElementById('sheet-dex-val').value),
                con: parseInt(document.getElementById('sheet-con-val').value),
                int: parseInt(document.getElementById('sheet-int-val').value),
                wis: parseInt(document.getElementById('sheet-wis-val').value),
                cha: parseInt(document.getElementById('sheet-cha-val').value)
            }
        };
        localStorage.setItem('dnd_playbook_draft_character', JSON.stringify(char));
        alert(`Draft of ${char.name} has been saved successfully!`);
    });

    // Populate selects from API
    try {
        const classes = apiCache.classes || await fetchFromApi('/classes');
        const races = apiCache.races || await fetchFromApi('/races');

        if (classes && classes.results) {
            classSelect.innerHTML = classes.results.map(c => `<option value="${c.index}">${c.name}</option>`).join('');
        }
        if (races && races.results) {
            raceSelect.innerHTML = races.results.map(r => `<option value="${r.index}">${r.name}</option>`).join('');
        }
    } catch (e) {
        console.error(e);
    }

    // Load initial sheet modifiers
    abilityScores.forEach(stat => {
        const input = document.getElementById(`sheet-${stat}-val`);
        updateAbilityModifier(stat, input.value);
    });
    
    // Set initial class/race derived traits
    setTimeout(() => {
        updateClassDerivedDetails();
        updateRaceDerivedDetails();
    }, 1000);
}

function updateAbilityModifier(stat, val) {
    const mod = Math.floor((parseInt(val) - 10) / 2);
    const modSpan = document.getElementById(`sheet-${stat}-mod`);
    if (modSpan) {
        modSpan.textContent = mod >= 0 ? `+${mod}` : mod;
    }
}

function updateDerivedStats() {
    const dexVal = parseInt(document.getElementById('sheet-dex-val').value);
    const conVal = parseInt(document.getElementById('sheet-con-val').value);
    
    const dexMod = Math.floor((dexVal - 10) / 2);
    const conMod = Math.floor((conVal - 10) / 2);

    // Armor Class = 10 + DEX Mod (Assuming unarmored)
    document.getElementById('sheet-ac-val').textContent = 10 + dexMod;
    
    // HP calculation: We need base class hit die. Let's read the current displayed hit die or use a default
    const classIndex = document.getElementById('draft-class').value;
    const hitDieMap = {
        barbarian: 12, fighter: 10, paladin: 10, ranger: 10,
        cleric: 8, druid: 8, monk: 8, rogue: 8, warlock: 8, bard: 8,
        sorcerer: 6, wizard: 6
    };
    const hitDie = hitDieMap[classIndex] || 8;
    document.getElementById('sheet-hp-val').textContent = hitDie + conMod;
}

async function updateClassDerivedDetails() {
    const classSelect = document.getElementById('draft-class');
    const classIndex = classSelect.value;
    
    document.getElementById('sheet-char-class').textContent = classSelect.options[classSelect.selectedIndex].text;
    
    updateDerivedStats(); // update HP based on class hit die

    const classData = await fetchDetails(`/api/classes/${classIndex}`);
    if (classData) {
        const profList = document.getElementById('sheet-class-traits');
        
        let profs = classData.proficiencies.map(p => p.name).join(', ');
        let savingThrows = classData.saving_throws.map(s => s.name).join(', ');
        
        profList.innerHTML = `
            <li><strong>Hit Die:</strong> d${classData.hit_die}</li>
            <li><strong>Saving Throws:</strong> ${savingThrows}</li>
            <li><strong>Weapon & Armor Proficiencies:</strong> ${profs}</li>
        `;
    }
}

async function updateRaceDerivedDetails() {
    const raceSelect = document.getElementById('draft-race');
    const raceIndex = raceSelect.value;

    document.getElementById('sheet-char-race').textContent = raceSelect.options[raceSelect.selectedIndex].text;

    const raceData = await fetchDetails(`/api/races/${raceIndex}`);
    if (raceData) {
        const traitsList = document.getElementById('sheet-race-traits');
        document.getElementById('sheet-speed-val').textContent = `${raceData.speed} ft.`;
        
        let statBonuses = raceData.ability_bonuses.map(b => `+${b.bonus} ${b.ability_score.name}`).join(', ');
        let traits = raceData.traits.map(t => t.name).join(', ') || 'None';
        let langs = raceData.languages.map(l => l.name).join(', ');

        traitsList.innerHTML = `
            <li><strong>Ability Score Bonuses:</strong> ${statBonuses}</li>
            <li><strong>Traits:</strong> ${traits}</li>
            <li><strong>Languages:</strong> ${langs}</li>
            <li><strong>Size:</strong> ${raceData.size} (${raceData.size_description})</li>
        `;
    }
}

// ==========================================================================
// DETAILS MODAL POPUP
// ==========================================================================
async function openDetailsModal(index, type, url) {
    const overlay = document.getElementById('detail-modal');
    const content = document.getElementById('modal-content-area');
    
    // Store active modal state
    state.activeModalItem = { index, type, url, name: '' };
    
    overlay.classList.remove('hidden');
    content.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><br>Consulting wizard scrolls...</div>`;

    const data = await fetchDetails(url);
    if (!data) {
        content.innerHTML = `<p class="empty-state">Failed to retrieve details. Make sure you are connected to the network.</p>`;
        return;
    }

    // Set name in active state
    state.activeModalItem.name = data.name;
    updateModalBookmarkButton(index, type);

    // Format content based on type
    if (type === 'spell') {
        renderSpellDetails(data, content);
    } else if (type === 'class') {
        renderClassDetails(data, content);
    } else if (type === 'monster') {
        renderMonsterDetails(data, content);
    } else if (type === 'race') {
        renderRaceDetails(data, content);
    } else if (type === 'equipment') {
        renderEquipmentDetails(data, content);
    } else if (type === 'rule') {
        content.innerHTML = `
            <h2 class="modal-title">${data.name}</h2>
            <div class="modal-subtitle">D&D Rules Section</div>
            <div class="rule-html-content" style="margin-top: 20px;">
                ${formatMarkdown(data.desc)}
            </div>
        `;
    }
}

function updateModalBookmarkButton(index, type) {
    const btn = document.getElementById('modal-bookmark-btn');
    if (!btn) return;

    const isBookmarked = state.bookmarks.some(b => b.index === index && b.type === type);
    if (isBookmarked) {
        btn.classList.add('active');
        btn.innerHTML = `<i class="fa-solid fa-bookmark" style="color: var(--gold-light);"></i>`;
    } else {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
    }
}

// Renderers for specific types
function renderSpellDetails(spell, target) {
    const descHtml = spell.desc.map(d => `<p>${d}</p>`).join('');
    const higherLevelHtml = spell.higher_level ? spell.higher_level.map(h => `<p><strong>At Higher Levels:</strong> ${h}</p>`).join('') : '';

    target.innerHTML = `
        <h2 class="modal-title">${spell.name}</h2>
        <div class="modal-subtitle">${spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} - ${spell.school.name}</div>
        
        <div class="spell-meta-grid">
            <div class="spell-meta-item"><strong>Casting Time</strong> ${spell.casting_time}</div>
            <div class="spell-meta-item"><strong>Range</strong> ${spell.range}</div>
            <div class="spell-meta-item"><strong>Components</strong> ${spell.components.join(', ')} ${spell.material ? `(${spell.material})` : ''}</div>
            <div class="spell-meta-item"><strong>Duration</strong> ${spell.duration} ${spell.concentration ? '(Concentration)' : ''}</div>
        </div>

        <div class="modal-desc-box">
            <h4>Description</h4>
            ${descHtml}
            ${higherLevelHtml}
        </div>
        
        <div class="modal-desc-box" style="margin-top: 20px; font-size:12px; color: var(--text-muted);">
            <strong>Classes:</strong> ${spell.classes.map(c => c.name).join(', ')}
        </div>
    `;
}

async function renderClassDetails(cls, target) {
    let savingThrows = cls.saving_throws.map(s => s.name).join(', ');
    let profs = cls.proficiencies.map(p => p.name).join(', ');
    
    // Fetch levels details for progression table
    target.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Retrieving level progression table...</div>`;
    
    const levelsData = await fetchFromApi(`/classes/${cls.index}/levels`);
    
    let tableRows = '';
    if (levelsData && Array.isArray(levelsData)) {
        levelsData.slice(0, 10).forEach(lvl => { // limit to level 10 for neat details
            let features = lvl.features.map(f => f.name).join(', ') || '-';
            let profBonus = `+${lvl.prof_bonus}`;
            tableRows += `
                <tr>
                    <td>Level ${lvl.level}</td>
                    <td>${profBonus}</td>
                    <td>${features}</td>
                </tr>
            `;
        });
    }

    target.innerHTML = `
        <h2 class="modal-title">${cls.name}</h2>
        <div class="modal-subtitle">D&D 5e Class</div>

        <div class="spell-meta-grid">
            <div class="spell-meta-item"><strong>Hit Die</strong> d${cls.hit_die}</div>
            <div class="spell-meta-item"><strong>Saving Throws</strong> ${savingThrows}</div>
            <div class="spell-meta-item" style="grid-column: span 2;"><strong>Proficiencies</strong> ${profs}</div>
        </div>

        <div class="modal-desc-box">
            <h4>Class Progression (Levels 1 - 10)</h4>
            <table class="progression-table" style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--gold-color); text-align: left;">
                        <th style="padding: 8px;">Level</th>
                        <th style="padding: 8px;">Proficiency Bonus</th>
                        <th style="padding: 8px;">Class Features</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || '<tr><td colspan="3">Level details unavailable.</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function renderMonsterDetails(m, target) {
    const abilityModifier = (score) => {
        const mod = Math.floor((score - 10) / 2);
        return `${score} (${mod >= 0 ? `+${mod}` : mod})`;
    };

    // Skills, senses
    let senses = '';
    for (const [key, value] of Object.entries(m.senses)) {
        senses += `${key.replace('_', ' ')} ${value}, `;
    }
    senses = senses.slice(0, -2);

    let actions = m.actions.map(act => `
        <div class="m-ability-desc">
            <strong>${act.name}.</strong> ${act.desc}
        </div>
    `).join('');

    let legendary = '';
    if (m.legendary_actions && m.legendary_actions.length > 0) {
        legendary = `
            <div class="m-section-title">Legendary Actions</div>
            <p style="font-size:12px; margin-bottom: 8px; font-style:italic;">The monster can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn.</p>
            ${m.legendary_actions.map(act => `
                <div class="m-ability-desc">
                    <strong>${act.name}.</strong> ${act.desc}
                </div>
            `).join('')}
        `;
    }

    target.innerHTML = `
        <div class="monster-stat-block">
            <h2>${m.name}</h2>
            <span class="m-type">${m.size} ${m.type}, ${m.alignment}</span>
            <hr>
            <div class="stat-line"><strong>Armor Class</strong> ${m.armor_class[0].value} (${m.armor_class[0].type || 'natural armor'})</div>
            <div class="stat-line"><strong>Hit Points</strong> ${m.hit_points} (${m.hit_points_roll})</div>
            <div class="stat-line"><strong>Speed</strong> ${m.speed.walk || ''} ${m.speed.fly ? `, fly ${m.speed.fly}` : ''} ${m.speed.swim ? `, swim ${m.speed.swim}` : ''}</div>
            <hr>
            <div class="m-attributes-grid">
                <div class="m-attr-box"><span class="m-attr-name">STR</span><span class="m-attr-val">${abilityModifier(m.strength)}</span></div>
                <div class="m-attr-box"><span class="m-attr-name">DEX</span><span class="m-attr-val">${abilityModifier(m.dexterity)}</span></div>
                <div class="m-attr-box"><span class="m-attr-name">CON</span><span class="m-attr-val">${abilityModifier(m.constitution)}</span></div>
                <div class="m-attr-box"><span class="m-attr-name">INT</span><span class="m-attr-val">${abilityModifier(m.intelligence)}</span></div>
                <div class="m-attr-box"><span class="m-attr-name">WIS</span><span class="m-attr-val">${abilityModifier(m.wisdom)}</span></div>
                <div class="m-attr-box"><span class="m-attr-name">CHA</span><span class="m-attr-val">${abilityModifier(m.charisma)}</span></div>
            </div>
            <hr>
            <div class="stat-line"><strong>Senses</strong> ${senses}</div>
            <div class="stat-line"><strong>Languages</strong> ${m.languages || 'None'}</div>
            <div class="stat-line"><strong>Challenge</strong> ${m.challenge_rating} (${m.xp} XP)</div>
            <hr>
            
            <div class="m-section-title">Actions</div>
            ${actions}
            
            ${legendary}
        </div>
    `;
}

function renderRaceDetails(race, target) {
    let statBonuses = race.ability_bonuses.map(b => `+${b.bonus} ${b.ability_score.name}`).join(', ');
    let languages = race.languages.map(l => l.name).join(', ');
    let traits = race.traits.map(t => t.name).join(', ') || 'None';

    target.innerHTML = `
        <h2 class="modal-title">${race.name}</h2>
        <div class="modal-subtitle">Fantasy Playable Race</div>

        <div class="spell-meta-grid">
            <div class="spell-meta-item"><strong>Speed</strong> ${race.speed} ft.</div>
            <div class="spell-meta-item"><strong>Size</strong> ${race.size}</div>
            <div class="spell-meta-item"><strong>Ability Score Modifiers</strong> ${statBonuses}</div>
            <div class="spell-meta-item"><strong>Languages</strong> ${languages}</div>
        </div>

        <div class="modal-desc-box">
            <h4>Racial Alignment Description</h4>
            <p>${race.alignment}</p>
        </div>

        <div class="modal-desc-box">
            <h4>Age Progression</h4>
            <p>${race.age}</p>
        </div>

        <div class="modal-desc-box">
            <h4>Racial Traits</h4>
            <p>${traits}</p>
        </div>
    `;
}

function renderEquipmentDetails(eq, target) {
    let cost = `${eq.cost.quantity} ${eq.cost.unit}`;
    let weight = eq.weight ? `${eq.weight} lbs.` : '0 lbs.';

    let weaponProperties = '';
    if (eq.damage) {
        weaponProperties = `
            <div class="spell-meta-item"><strong>Damage</strong> ${eq.damage.damage_dice} (${eq.damage.damage_type.name})</div>
        `;
    }
    if (eq.armor_class) {
        weaponProperties += `
            <div class="spell-meta-item"><strong>Armor Class (AC)</strong> Base ${eq.armor_class.base} ${eq.armor_class.dex_bonus ? `+ Dex modifier (max ${eq.armor_class.max_bonus || '2'})` : ''}</div>
        `;
    }

    const descHtml = eq.desc ? eq.desc.map(d => `<p>${d}</p>`).join('') : '<p>No description text available.</p>';

    target.innerHTML = `
        <h2 class="modal-title">${eq.name}</h2>
        <div class="modal-subtitle">${eq.equipment_category.name}</div>

        <div class="spell-meta-grid">
            <div class="spell-meta-item"><strong>Cost</strong> ${cost}</div>
            <div class="spell-meta-item"><strong>Weight</strong> ${weight}</div>
            ${weaponProperties}
        </div>

        <div class="modal-desc-box">
            <h4>Properties & Description</h4>
            ${descHtml}
        </div>
    `;
}

// ==========================================================================
// GLOBAL SEARCH
// ==========================================================================
function setupGlobalSearch() {
    const input = document.getElementById('global-search');
    const dropdown = document.getElementById('quick-search-results');
    
    if (!input || !dropdown) return;

    input.addEventListener('input', async () => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
            dropdown.classList.add('hidden');
            return;
        }

        // Fetch indices if missing
        if (!apiCache.spells) apiCache.spells = await fetchFromApi('/spells');
        if (!apiCache.monsters) apiCache.monsters = await fetchFromApi('/monsters');
        if (!apiCache.classes) apiCache.classes = await fetchFromApi('/classes');

        let matches = [];

        // Match classes
        if (apiCache.classes && apiCache.classes.results) {
            apiCache.classes.results.forEach(item => {
                if (item.name.toLowerCase().includes(query)) {
                    matches.push({ ...item, type: 'class' });
                }
            });
        }

        // Match spells
        if (apiCache.spells && apiCache.spells.results) {
            apiCache.spells.results.forEach(item => {
                if (item.name.toLowerCase().includes(query)) {
                    matches.push({ ...item, type: 'spell' });
                }
            });
        }

        // Match monsters
        if (apiCache.monsters && apiCache.monsters.results) {
            apiCache.monsters.results.forEach(item => {
                if (item.name.toLowerCase().includes(query)) {
                    matches.push({ ...item, type: 'monster' });
                }
            });
        }

        // Limit results to 8 items
        const slice = matches.slice(0, 8);
        
        if (slice.length === 0) {
            dropdown.innerHTML = `<div class="empty-state" style="padding:10px;">No results found.</div>`;
            dropdown.classList.remove('hidden');
            return;
        }

        let html = '';
        slice.forEach(item => {
            html += `
                <div class="quick-search-item" onclick="handleQuickSearchClick('${item.index}', '${item.type}', '${item.url}')">
                    <span class="quick-search-name">${item.name}</span>
                    <span class="quick-search-meta">${item.type}</span>
                </div>
            `;
        });
        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function handleQuickSearchClick(index, type, url) {
    document.getElementById('quick-search-results').classList.add('hidden');
    document.getElementById('global-search').value = '';
    openDetailsModal(index, type, url);
}

// ==========================================================================
// THEMES & INTERFACE INTERACTION
// ==========================================================================
function setupEventListeners() {
    // Nav Click handlers to toggle view
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            window.location.hash = view;
        });
    });

    // Modal Close
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('detail-modal').classList.add('hidden');
        state.activeModalItem = null;
    });

    // Close modal on click outside card
    document.getElementById('detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'detail-modal') {
            document.getElementById('detail-modal').classList.add('hidden');
            state.activeModalItem = null;
        }
    });

    // Bookmark trigger inside detail modal
    document.getElementById('modal-bookmark-btn').addEventListener('click', () => {
        if (!state.activeModalItem) return;
        const { index, name, type, url } = state.activeModalItem;
        const isBookmarked = state.bookmarks.some(b => b.index === index && b.type === type);
        
        if (isBookmarked) {
            removeBookmark(index, type);
        } else {
            addBookmark(index, name, type, url);
        }
    });

    // Bookmarks page category filters switcher
    document.querySelectorAll('.fav-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fav-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadBookmarksView();
        });
    });

    // Theme Switcher
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme') || 'dark';
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('dnd_playbook_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Intermittent tip rotator
    setInterval(rotateTip, 12000);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-btn i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            document.getElementById('theme-btn').title = "Switch to Light Aesthetic";
        } else {
            icon.className = 'fa-solid fa-moon';
            document.getElementById('theme-btn').title = "Switch to Dark Aesthetic";
        }
    }
}
