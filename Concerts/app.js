// BeatSync Application JavaScript

// App State
const state = {
    allConcerts: {},
    currentCity: 'stockholm',
    searchQuery: '',
    maxPrice: 3000,
    selectedGenres: [],
    sortBy: 'date-asc'
};

// Currency Configurations for each City
const currencyConfig = {
    stockholm: { code: 'SEK', symbol: 'SEK', maxPrice: 3000, step: 100 },
    berlin: { code: 'EUR', symbol: '€', maxPrice: 400, step: 10 },
    london: { code: 'GBP', symbol: '£', maxPrice: 500, step: 10 },
    paris: { code: 'EUR', symbol: '€', maxPrice: 400, step: 10 }
};

// Elements
const el = {
    citySelector: document.getElementById('city-selector'),
    searchInput: document.getElementById('search-input'),
    priceRange: document.getElementById('price-range'),
    priceVal: document.getElementById('price-val'),
    genreFilters: document.getElementById('genre-filters'),
    dashboardTitle: document.getElementById('dashboard-title'),
    totalEvents: document.getElementById('total-events-num'),
    avgPrice: document.getElementById('avg-price-num'),
    uniqueGenres: document.getElementById('unique-genres-num'),
    genreChart: document.getElementById('genre-chart'),
    eventsGrid: document.getElementById('events-grid'),
    noResults: document.getElementById('no-results'),
    sortSelect: document.getElementById('sort-select')
};

// Initialize App
async function init() {
    try {
        const response = await fetch('data/concerts.json');
        if (!response.ok) throw new Error('Failed to fetch concert data');
        state.allConcerts = await response.json();
        
        setupEventListeners();
        switchCity(state.currentCity);
    } catch (error) {
        console.error('Error initializing BeatSync:', error);
        el.eventsGrid.innerHTML = `<div class="error-msg">Failed to load concert listings. Please make sure data/concerts.json is available.</div>`;
    }
}

// Set up event listeners
function setupEventListeners() {
    // City Selector
    el.citySelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.city-btn');
        if (!btn) return;
        
        document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        switchCity(btn.dataset.city);
    });

    // Search Input
    el.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        render();
    });

    // Price Slider
    el.priceRange.addEventListener('input', (e) => {
        state.maxPrice = parseInt(e.target.value);
        el.priceVal.innerText = `${state.maxPrice} ${currencyConfig[state.currentCity].symbol}`;
        render();
    });

    // Sort Select
    el.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        render();
    });
}

// Switch Active City
function switchCity(cityKey) {
    state.currentCity = cityKey;
    
    // Reset inputs
    state.searchQuery = '';
    el.searchInput.value = '';
    state.selectedGenres = [];
    
    // Configure Price Slider for City Currency
    const config = currencyConfig[cityKey];
    el.priceRange.max = config.maxPrice;
    el.priceRange.step = config.step;
    state.maxPrice = config.maxPrice;
    el.priceRange.value = config.maxPrice;
    
    // Update labels
    document.querySelectorAll('.currency-label').forEach(label => label.innerText = config.symbol);
    el.priceVal.innerText = `${config.maxPrice} ${config.symbol}`;
    el.dashboardTitle.innerText = `Live Concerts in ${cityKey.charAt(0).toUpperCase() + cityKey.slice(1)}`;

    // Build genre checkboxes
    buildGenreFilters();
    
    // Render list
    render();
}

// Generate unique genres filters dynamically
function buildGenreFilters() {
    const concerts = state.allConcerts[state.currentCity] || [];
    const genres = [...new Set(concerts.map(c => c.genre.split(' / ')[0]))].sort();
    
    el.genreFilters.innerHTML = '';
    
    genres.forEach(genre => {
        const label = document.createElement('label');
        label.className = 'genre-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = genre;
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.selectedGenres.push(genre);
            } else {
                state.selectedGenres = state.selectedGenres.filter(g => g !== genre);
            }
            render();
        });
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${genre}`));
        el.genreFilters.appendChild(label);
    });
}

// Render Dashboard (Filtering, Stats, Chart, Cards)
function render() {
    const config = currencyConfig[state.currentCity];
    let concerts = [...(state.allConcerts[state.currentCity] || [])];
    
    // 1. Apply Filters
    
    // Search Query
    if (state.searchQuery) {
        concerts = concerts.filter(c => 
            c.artist.toLowerCase().includes(state.searchQuery) ||
            c.venue.toLowerCase().includes(state.searchQuery)
        );
    }
    
    // Price Range
    concerts = concerts.filter(c => {
        if (c.min_price !== undefined) {
            return c.min_price <= state.maxPrice;
        }
        return true; // Keep TBD prices
    });
    
    // Genres
    if (state.selectedGenres.length > 0) {
        concerts = concerts.filter(c => {
            const primaryGenre = c.genre.split(' / ')[0];
            return state.selectedGenres.includes(primaryGenre);
        });
    }

    // 2. Apply Sorting
    concerts.sort((a, b) => {
        if (state.sortBy === 'date-asc') {
            return new Date(a.date) - new Date(b.date);
        } else if (state.sortBy === 'price-asc') {
            const priceA = a.min_price !== undefined ? a.min_price : 999999;
            const priceB = b.min_price !== undefined ? b.min_price : 999999;
            return priceA - priceB;
        } else if (state.sortBy === 'price-desc') {
            const priceA = a.min_price !== undefined ? a.min_price : -1;
            const priceB = b.min_price !== undefined ? b.min_price : -1;
            return priceB - priceA;
        }
        return 0;
    });

    // 3. Render Stats Cards
    const totalCount = concerts.length;
    el.totalEvents.innerText = totalCount;
    
    // Calculate Average Price
    const pricedConcerts = concerts.filter(c => c.min_price !== undefined);
    if (pricedConcerts.length > 0) {
        const avg = Math.round(pricedConcerts.reduce((acc, curr) => acc + curr.min_price, 0) / pricedConcerts.length);
        el.avgPrice.innerText = `${avg} ${config.symbol}`;
    } else {
        el.avgPrice.innerText = 'N/A';
    }
    
    const uniqueG = [...new Set(concerts.map(c => c.genre.split(' / ')[0]))].length;
    el.uniqueGenres.innerText = uniqueG;

    // 4. Render Genre Bar Chart
    renderGenreChart(concerts);

    // 5. Render Cards
    renderCards(concerts, config);
}

// Render dynamic animated Genre Bar Chart
function renderGenreChart(concerts) {
    el.genreChart.innerHTML = '';
    if (concerts.length === 0) {
        el.genreChart.innerHTML = `<div class="chart-empty">No data</div>`;
        return;
    }

    // Count by genre
    const counts = {};
    concerts.forEach(c => {
        const primary = c.genre.split(' / ')[0];
        counts[primary] = (counts[primary] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts));

    // Sort by count desc
    const sortedGenres = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    sortedGenres.forEach(([genre, count]) => {
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        const group = document.createElement('div');
        group.className = 'chart-bar-group';
        
        const val = document.createElement('span');
        val.className = 'chart-bar-val';
        val.innerText = count;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        
        const label = document.createElement('span');
        label.className = 'chart-label';
        label.innerText = genre;
        label.title = genre;

        group.appendChild(val);
        group.appendChild(bar);
        group.appendChild(label);
        el.genreChart.appendChild(group);

        // Animate bar height after insert
        setTimeout(() => {
            bar.style.height = `${pct}%`;
        }, 50);
    });
}

// Render Concert Cards
function renderCards(concerts, config) {
    el.eventsGrid.innerHTML = '';
    
    if (concerts.length === 0) {
        el.noResults.classList.remove('hidden');
        return;
    }
    el.noResults.classList.add('hidden');

    concerts.forEach((c, index) => {
        const card = document.createElement('div');
        card.className = 'concert-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        // Format Date
        const dateObj = new Date(c.date);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        card.innerHTML = `
            <div class="card-top">
                <span class="card-genre-badge">${c.genre}</span>
                <h4 class="card-artist">${c.artist}</h4>
                <div class="card-details">
                    <div class="card-detail-item">
                        <i class="fa-solid fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="card-detail-item">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${c.venue}</span>
                    </div>
                </div>
            </div>
            <div class="card-bottom">
                <div class="card-price-info">
                    <span class="card-price-label">Price Range</span>
                    <span class="card-price-val">${c.price}</span>
                </div>
                <a href="${c.link}" target="_blank" class="ticket-btn">
                    Get Tickets <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </div>
        `;
        
        el.eventsGrid.appendChild(card);
    });
}

// Start Application on Load
document.addEventListener('DOMContentLoaded', init);
