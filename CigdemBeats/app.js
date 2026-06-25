// App State
let state = {
  activeLocation: 'dusseldorf',
  activeGenre: 'all',
  concerts: [],
  favorites: JSON.parse(localStorage.getItem('sp_favorites')) || [],
  searchHistory: JSON.parse(localStorage.getItem('sp_history')) || ['dusseldorf', 'spain'],
  apiKey: localStorage.getItem('sp_api_key') || ''
};

// Image libraries by genre
const genreImages = {
  rock: [
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80'
  ],
  pop: [
    'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=600&q=80'
  ],
  electronic: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=600&q=80'
  ],
  latin: [
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  ]
};

// DOM Elements
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const filterChips = document.querySelectorAll('.filter-chip');
const concertsContainer = document.getElementById('concerts-container');
const heroBanner = document.getElementById('hero-banner');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const heroTag = document.getElementById('hero-tag');
const historyList = document.getElementById('search-history');
const favoritesContainer = document.getElementById('favorites-container');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Modal Elements
const detailModal = document.getElementById('detail-modal');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalGenre = document.getElementById('modal-genre');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalTime = document.getElementById('modal-time');
const modalVenue = document.getElementById('modal-venue');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalTicketLink = document.getElementById('modal-ticket-link');
const modalFavBtn = document.getElementById('modal-fav-btn');

// Initialize Dashboard
function init() {
  // Load saved API Key input placeholder
  if (state.apiKey) {
    apiKeyInput.value = state.apiKey;
  }
  
  // Set up listeners
  searchBtn.addEventListener('click', handleSearchSubmit);
  searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  });
  
  saveKeyBtn.addEventListener('click', saveApiKey);
  
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeGenre = chip.getAttribute('data-genre');
      renderConcerts();
    });
  });
  
  modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === detailModal) closeModal();
  });
  
  // Initial Search
  executeSearch(state.activeLocation);
  renderHistory();
  renderFavoritesList();
}

// Show Toast Alert
function showToast(message, isError = false) {
  toastMessage.textContent = message;
  toast.style.background = isError ? '#ef4444' : '#10b981';
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Save Ticketmaster API Key
function saveApiKey() {
  const key = apiKeyInput.value.trim();
  state.apiKey = key;
  localStorage.setItem('sp_api_key', key);
  showToast(key ? 'API Key saved! Live search activated.' : 'API Key cleared. Switched to offline mode.');
  executeSearch(state.activeLocation);
}

// History Render
function renderHistory() {
  historyList.innerHTML = '';
  state.searchHistory.forEach(city => {
    const li = document.createElement('li');
    li.className = 'history-tag';
    li.innerHTML = `<i class="fa-solid fa-location-arrow" style="font-size:0.7rem; color:var(--secondary)"></i> ${capitalize(city)}`;
    li.addEventListener('click', () => {
      searchBar.value = capitalize(city);
      executeSearch(city);
    });
    historyList.appendChild(li);
  });
}

// Add City to History
function addToHistory(city) {
  city = city.toLowerCase().trim();
  if (!state.searchHistory.includes(city)) {
    state.searchHistory.unshift(city);
    if (state.searchHistory.length > 8) state.searchHistory.pop();
    localStorage.setItem('sp_history', JSON.stringify(state.searchHistory));
    renderHistory();
  }
}

// Generate Procedural Concerts for Uncached Cities
function generateProceduralConcerts(city) {
  const capitalizedCity = capitalize(city);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  
  const formattedDate = (days) => {
    const d = new Date(tomorrow);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const templates = [
    {
      name: `${capitalizedCity} Summer Beats Festival`,
      genre: "Electronic",
      venue: `Arena ${capitalizedCity} Park`,
      desc: `The biggest outdoor electronic festival in ${capitalizedCity} featuring global headlining DJs, stunning light shows, and premium food trucks.`,
      price: "€65.00 - €150.00"
    },
    {
      name: "The Neon Syndicate - World Tour",
      genre: "Pop / Dance",
      venue: "Central Hall Arena",
      desc: "Chart-topping electropop superstars bring their futuristic staging, choreography, and hit anthems to the city.",
      price: "€50.00 - €110.00"
    },
    {
      name: "Velvet Underground Revival Tour",
      genre: "Rock / Punk",
      venue: "Club Metro Underground",
      desc: "An evening of raw, alternative rock riffs and indie-punk energy. Featuring local support acts.",
      price: "€30.00 - €55.00"
    },
    {
      name: "Bailando Latino Night",
      genre: "Latin / Reggaeton",
      venue: "Sunset Beach Arena",
      desc: "Get ready to dance! A high-voltage celebration of reggaeton, salsa, and Latin trap music under the stars.",
      price: "€40.00 - €85.00"
    },
    {
      name: "Iron & Steel - Metal Festival",
      genre: "Metal / Alternative",
      venue: "Industrial Center Hall B",
      desc: "Headbanging guaranteed. An explosive heavy metal double-bill bringing epic guitar solos and powerhouse drums.",
      price: "€75.00"
    }
  ];

  return templates.map((t, idx) => {
    const imgList = genreImages[t.genre.split(' / ')[0].toLowerCase()] || genreImages.rock;
    const img = imgList[idx % imgList.length];
    return {
      id: `p-${city}-${idx}`,
      name: t.name,
      date: formattedDate(idx * 3 + 1),
      time: "19:30",
      venue: t.venue,
      genre: t.genre,
      price: t.price,
      image: img,
      url: "https://www.ticketmaster.com",
      description: t.desc
    };
  });
}

// Execute Concert Search
async function executeSearch(query) {
  if (!query) return;
  const normalizedQuery = query.toLowerCase().trim();
  
  showSkeletons();
  
  state.activeLocation = normalizedQuery;
  addToHistory(normalizedQuery);
  
  // Set hero section details
  heroTitle.textContent = `Music Events in ${capitalize(query)}`;
  heroSubtitle.textContent = `Finding ongoing shows and musical events scheduled for ${capitalize(query)}.`;
  
  // Decide whether to call Live API or Fallback
  if (state.apiKey) {
    try {
      state.concerts = await fetchLiveTicketmasterData(normalizedQuery, state.apiKey);
      heroTag.innerHTML = `<span style="color:#10b981"><i class="fa-solid fa-circle-dot"></i> Live Ticketmaster Search</span>`;
    } catch (err) {
      console.error(err);
      showToast('Live search failed. Using local generated database.', true);
      loadOfflineData(normalizedQuery);
    }
  } else {
    loadOfflineData(normalizedQuery);
  }
  
  // Simulated visual buffer
  setTimeout(() => {
    renderConcerts();
  }, 600);
}

// Load Offline Data
function loadOfflineData(query) {
  heroTag.innerHTML = `<span style="color:var(--secondary)"><i class="fa-solid fa-database"></i> Smart Offline Database</span>`;
  
  if (mockConcerts[query]) {
    state.concerts = mockConcerts[query];
  } else {
    state.concerts = generateProceduralConcerts(query);
  }
}

// Fetch Live Ticketmaster Data
async function fetchLiveTicketmasterData(city, apiKey) {
  // Try to search by city. Since we only want music events: classificationName=music
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${encodeURIComponent(city)}&apikey=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data._embedded || !data._embedded.events) {
    return []; // No events found
  }
  
  // Transform Ticketmaster format to match our state structure
  return data._embedded.events.map(event => {
    const venueObj = event._embedded?.venues?.[0];
    const venueName = venueObj ? `${venueObj.name}${venueObj.city ? ' (' + venueObj.city.name + ')' : ''}` : 'TBA Venue';
    const genreName = event.classifications?.[0]?.genre?.name || 'Music';
    const segmentName = event.classifications?.[0]?.segment?.name || 'Event';
    
    // Find a decent resolution image
    const bestImage = event.images?.sort((a, b) => b.width - a.width)?.[0]?.url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80';
    
    // Check price range
    const priceMin = event.priceRanges?.[0]?.min;
    const priceMax = event.priceRanges?.[0]?.max;
    const priceCurrency = event.priceRanges?.[0]?.currency || 'USD';
    const priceStr = priceMin ? `${priceCurrency === 'USD' ? '$' : priceCurrency}${priceMin} - ${priceCurrency === 'USD' ? '$' : priceCurrency}${priceMax}` : 'Register for prices';
    
    return {
      id: event.id,
      name: event.name,
      date: event.dates?.start?.localDate || 'Date TBA',
      time: event.dates?.start?.localTime?.substring(0, 5) || 'Time TBA',
      venue: venueName,
      genre: `${segmentName} / ${genreName}`,
      price: priceStr,
      image: bestImage,
      url: event.url || 'https://www.ticketmaster.com',
      description: event.info || event.pleaseNote || `Join us for the live performance of ${event.name} in ${city}! Tickets are selling out quickly.`
    };
  });
}

// Show loading skeleton cards
function showSkeletons() {
  concertsContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text" style="width: 50%;"></div>
      <div class="skeleton skeleton-text" style="width: 90%; margin-top: 10px;"></div>
      <div class="skeleton skeleton-text" style="width: 40%; margin-top: auto;"></div>
    `;
    concertsContainer.appendChild(skeleton);
  }
}

// Filter and Render Concert Cards
function renderConcerts() {
  concertsContainer.innerHTML = '';
  
  // Filter by active genre
  const filtered = state.concerts.filter(c => {
    if (state.activeGenre === 'all') return true;
    const genreLower = c.genre.toLowerCase();
    
    if (state.activeGenre === 'rock') {
      return genreLower.includes('rock') || genreLower.includes('metal') || genreLower.includes('punk') || genreLower.includes('alternative');
    }
    if (state.activeGenre === 'pop') {
      return genreLower.includes('pop') || genreLower.includes('dance') || genreLower.includes('vocal');
    }
    if (state.activeGenre === 'electronic') {
      return genreLower.includes('electronic') || genreLower.includes('amapiano') || genreLower.includes('techno') || genreLower.includes('house') || genreLower.includes('dance');
    }
    if (state.activeGenre === 'latin') {
      return genreLower.includes('latin') || genreLower.includes('reggaeton') || genreLower.includes('salsa') || genreLower.includes('rap');
    }
    return false;
  });

  if (filtered.length === 0) {
    concertsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-music-slash empty-icon"></i>
        <h3>No Concerts Found</h3>
        <p>No events in ${capitalize(state.activeLocation)} match the selected genre: ${capitalize(state.activeGenre)}.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(c => {
    const isFav = state.favorites.some(fav => fav.id === c.id);
    const card = document.createElement('article');
    card.className = 'concert-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img class="card-img" src="${c.image}" alt="${c.name}" loading="lazy">
        <span class="card-tag">${c.genre.split(' / ')[1] || c.genre}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${c.id}" aria-label="Add to favorites">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-date-badge">
          <i class="fa-regular fa-calendar-days"></i> ${formatFriendlyDate(c.date)} &bull; ${c.time}
        </div>
        <h4 class="card-title">${c.name}</h4>
        <div class="card-venue">
          <i class="fa-solid fa-location-dot"></i> ${c.venue}
        </div>
        <div class="card-price">
          <span>${c.price.split(' - ')[0]}</span>
          <button class="card-btn" data-id="${c.id}">View Details</button>
        </div>
      </div>
    `;
    
    // Add Click listeners
    card.querySelector('.fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(c);
    });
    
    card.querySelector('.card-btn').addEventListener('click', () => {
      openModal(c);
    });
    
    concertsContainer.appendChild(card);
  });
}

// Toggle Favorite
function toggleFavorite(concert) {
  const index = state.favorites.findIndex(fav => fav.id === concert.id);
  if (index === -1) {
    state.favorites.push(concert);
    showToast(`Added to Saved Shows: ${concert.name.split(' - ')[0]}`);
  } else {
    state.favorites.splice(index, 1);
    showToast(`Removed from Saved Shows: ${concert.name.split(' - ')[0]}`);
  }
  localStorage.setItem('sp_favorites', JSON.stringify(state.favorites));
  renderConcerts();
  renderFavoritesList();
  
  // Update modal fav button if active
  if (detailModal.classList.contains('active')) {
    const isNowFav = state.favorites.some(fav => fav.id === concert.id);
    modalFavBtn.innerHTML = isNowFav ? `<i class="fa-solid fa-heart"></i> Saved` : `<i class="fa-regular fa-heart"></i> Save`;
    if (isNowFav) {
      modalFavBtn.style.background = '#ef4444';
      modalFavBtn.style.color = '#fff';
    } else {
      modalFavBtn.style.background = 'transparent';
      modalFavBtn.style.color = 'var(--text-primary)';
    }
  }
}

// Render Favorites list on Sidebar
function renderFavoritesList() {
  favoritesContainer.innerHTML = '';
  if (state.favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div style="font-size:0.75rem; color:var(--text-muted); text-align:center; padding:1rem;">
        No saved shows yet. Click the heart icon on any card!
      </div>
    `;
    return;
  }
  
  state.favorites.forEach(c => {
    const div = document.createElement('div');
    div.className = 'fav-card';
    div.innerHTML = `
      <img class="fav-img" src="${c.image}" alt="">
      <div class="fav-details">
        <h5 class="fav-title">${c.name}</h5>
        <p class="fav-venue">${c.venue}</p>
        <span class="fav-date">${formatFriendlyDate(c.date)}</span>
      </div>
    `;
    div.addEventListener('click', () => {
      openModal(c);
    });
    favoritesContainer.appendChild(div);
  });
}

// Open Event Modal
function openModal(concert) {
  modalImg.src = concert.image;
  modalGenre.textContent = concert.genre;
  modalTitle.textContent = concert.name;
  modalDate.textContent = formatFriendlyDate(concert.date);
  modalTime.textContent = concert.time;
  modalVenue.textContent = concert.venue;
  modalPrice.textContent = concert.price;
  modalDesc.textContent = concert.description;
  modalTicketLink.href = concert.url;
  
  const isFav = state.favorites.some(fav => fav.id === concert.id);
  modalFavBtn.innerHTML = isFav ? `<i class="fa-solid fa-heart"></i> Saved` : `<i class="fa-regular fa-heart"></i> Save`;
  
  if (isFav) {
    modalFavBtn.style.background = '#ef4444';
    modalFavBtn.style.color = '#fff';
  } else {
    modalFavBtn.style.background = 'transparent';
    modalFavBtn.style.color = 'var(--text-primary)';
  }
  
  // Remove existing listener and attach new one
  const newFavBtn = modalFavBtn.cloneNode(true);
  modalFavBtn.parentNode.replaceChild(newFavBtn, modalFavBtn);
  
  document.getElementById('modal-fav-btn').addEventListener('click', () => {
    toggleFavorite(concert);
  });
  
  detailModal.classList.add('active');
}

// Close Modal
function closeModal() {
  detailModal.classList.remove('active');
}

// Search form submit
function handleSearchSubmit() {
  const query = searchBar.value.trim();
  if (query) {
    executeSearch(query);
  }
}

// Helper Utilities
function capitalize(str) {
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatFriendlyDate(dateStr) {
  if (dateStr === 'Date TBA') return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// Start App
document.addEventListener('DOMContentLoaded', init);
