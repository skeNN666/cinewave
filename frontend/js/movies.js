// Import the database loader
  import { movieDatabase, loadMovieDatabase } from '../js/database.js';
  
  // State for filters
  let currentFilters = {
    category: 'all',
    genres: [],
    search: ''
  };
  
  // Wait for page to load
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Page loaded, loading database...');
    
    // 1. Load the database
    await loadMovieDatabase();
    console.log('🎬 Movies ready:', movieDatabase.length);
    console.log('Sample movie:', movieDatabase[0]);
    
    // 2. Create genre buttons
    createGenreButtons();
    
    // 3. Setup event listeners FIRST
    setupEventListeners();
    
    // 4. Render initial movies
    renderMovies();
    
    // 5. Add clear all button
    addClearAllButton();
  });
  
  // ============ CORE FUNCTIONS ============
  
  // Function to render movies
  function renderMovies() {
    console.log('🔄 Rendering movies with filters:', currentFilters);
    
    const container = document.getElementById('movies-container');
    if (!container) {
      console.error('❌ movies-container not found!');
      return;
    }
    
    container.innerHTML = '';
    
    // Filter movies
    let filteredMovies = [...movieDatabase];
    
    // 1. Category filter
    if (currentFilters.category !== 'all') {
      filteredMovies = filteredMovies.filter(movie => 
        movie.category === currentFilters.category
      );
      console.log(`📁 After category filter (${currentFilters.category}):`, filteredMovies.length);
    }
    
    // 2. Genre filter (AND logic - must have ALL selected genres)
    if (currentFilters.genres.length > 0) {
      filteredMovies = filteredMovies.filter(movie => {
        const hasAllGenres = currentFilters.genres.every(selectedGenre => 
          movie.genre.includes(selectedGenre)
        );
        return hasAllGenres;
      });
      console.log(`🎭 After genre filter (${currentFilters.genres.join(', ')}):`, filteredMovies.length);
    }
    
    // 3. Search filter
    if (currentFilters.search.trim() !== '') {
      const searchTerm = currentFilters.search.toLowerCase();
      filteredMovies = filteredMovies.filter(movie => 
        movie.name.toLowerCase().includes(searchTerm) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm))
      );
      console.log(`🔍 After search filter ("${currentFilters.search}"):`, filteredMovies.length);
    }
    
    // Update count
    updateItemsCount(filteredMovies.length);
    
    // Render movies
    if (filteredMovies.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);">
          <h3>Кино олдсонгүй</h3>
          <p>Шүүлтүүр тохируулна уу</p>
        </div>
      `;
    } else {
      filteredMovies.forEach(movie => {
        const movieCard = document.createElement('movie-card');
        movieCard.setAttribute('name', movie.name);
        movieCard.setAttribute('image', movie.image);
        movieCard.setAttribute('year-or-season', movie.yearOrSeason);
        movieCard.setAttribute('category', movie.category);
        movieCard.setAttribute('genre', movie.genre.join(', '));
        container.appendChild(movieCard);
      });
    }
    
    // Update active filters display
    updateActiveFilters();
    
    console.log(`✅ Displaying ${filteredMovies.length} movies`);
  }
  
  // Function to update items count
  function updateItemsCount(count) {
    let countElement = document.getElementById('items-count');
    
    // Create the element if it doesn't exist
    if (!countElement) {
      countElement = document.createElement('div');
      countElement.id = 'items-count';
      countElement.className = 'items-count';
      
      // Insert it in the right place
      const moviesGrid = document.getElementById('movies-container');
      const main = document.querySelector('main');
      main.insertBefore(countElement, moviesGrid);
    }
    
    // Build the display text
    let filterText = '';
    
    // Category
    if (currentFilters.category !== 'all') {
      filterText += currentFilters.category === 'movies' ? ' • Кино' : ' • TV Цуврал';
    }
    
    // Genres
    if (currentFilters.genres.length > 0) {
      const genreNames = currentFilters.genres.map(g => 
        g.charAt(0).toUpperCase() + g.slice(1)
      );
      filterText += ` • ${genreNames.join(' + ')}`;
    }
    
    // Search
    if (currentFilters.search.trim() !== '') {
      filterText += ` • "${currentFilters.search}"`;
    }
    
    countElement.innerHTML = `Нийт: <span>${count}</span> кино олдлоо${filterText}`;
  }
  
  // Function to update active filters display
  function updateActiveFilters() {
    let filtersContainer = document.querySelector('.active-filters');
    if (!filtersContainer) return;
    
    const hasActiveFilters = 
      currentFilters.category !== 'all' || 
      currentFilters.genres.length > 0 || 
      currentFilters.search.trim() !== '';
    
    if (!hasActiveFilters) {
      filtersContainer.style.display = 'none';
      return;
    }
    
    filtersContainer.style.display = 'flex';
    filtersContainer.innerHTML = '';
    
    // Category badge
    if (currentFilters.category !== 'all') {
      const categoryName = currentFilters.category === 'movies' ? 'Кино' : 'TV Цуврал';
      const badge = createFilterBadge(categoryName, 'category');
      filtersContainer.appendChild(badge);
    }
    
    // Genre badges
    currentFilters.genres.forEach(genre => {
      const genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
      const badge = createFilterBadge(genreName, 'genre', genre);
      filtersContainer.appendChild(badge);
    });
    
    // Search badge
    if (currentFilters.search.trim() !== '') {
      const badge = createFilterBadge(`Хайлт: "${currentFilters.search}"`, 'search');
      filtersContainer.appendChild(badge);
    }
    
    // Add remove handlers
    filtersContainer.querySelectorAll('.remove').forEach(removeBtn => {
      removeBtn.addEventListener('click', (e) => {
        const filterType = e.target.getAttribute('data-filter');
        const specificGenre = e.target.getAttribute('data-genre');
        
        if (filterType === 'genre' && specificGenre) {
          // Remove specific genre
          currentFilters.genres = currentFilters.genres.filter(g => g !== specificGenre);
          updateGenreButtons();
        } else {
          clearFilter(filterType);
        }
        
        renderMovies();
      });
    });
  }
  
  // Helper to create filter badge
  function createFilterBadge(text, filterType, specificValue = '') {
    const badge = document.createElement('div');
    badge.className = 'filter-badge';
    
    if (specificValue) {
      badge.innerHTML = `${text} <span class="remove" data-filter="${filterType}" data-genre="${specificValue}">×</span>`;
    } else {
      badge.innerHTML = `${text} <span class="remove" data-filter="${filterType}">×</span>`;
    }
    
    return badge;
  }
  
  // Function to clear a specific filter
  function clearFilter(filterType) {
    switch(filterType) {
      case 'category':
        currentFilters.category = 'all';
        updateCategoryButtons();
        // Clear genres when category changes
        currentFilters.genres = [];
        updateGenreButtons();
        break;
      case 'genre':
        currentFilters.genres = [];
        updateGenreButtons();
        break;
      case 'search':
        currentFilters.search = '';
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        break;
    }
  }
  
  // ============ GENRE FUNCTIONS ============
  
  // Get all unique genres from current filtered movies
  function getAllGenres() {
    const allGenres = new Set();
    
    // Get movies based on current category
    let moviesToCheck = [...movieDatabase];
    if (currentFilters.category !== 'all') {
      moviesToCheck = moviesToCheck.filter(movie => 
        movie.category === currentFilters.category
      );
    }
    
    // Add all genres from these movies
    moviesToCheck.forEach(movie => {
      movie.genre.forEach(g => allGenres.add(g));
    });
    
    return Array.from(allGenres).sort();
  }
  
  // Create genre buttons
  function createGenreButtons() {
    const genres = getAllGenres();
    const genreFilters = document.querySelector('.genre-filters');
    if (!genreFilters) return;
    
    genreFilters.innerHTML = '';
    
    genres.forEach(genre => {
      const button = document.createElement('button');
      button.className = 'genre-btn';
      button.setAttribute('data-genre', genre);
      button.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
      
      // Mark as active if selected
      if (currentFilters.genres.includes(genre)) {
        button.classList.add('active');
      }
      
      genreFilters.appendChild(button);
    });
    
    console.log(`🎭 Created ${genres.length} genre buttons`);
  }
  
  // Update genre button states
  function updateGenreButtons() {
    document.querySelectorAll('.genre-btn').forEach(button => {
      const genre = button.getAttribute('data-genre');
      if (currentFilters.genres.includes(genre)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
  
  // ============ EVENT LISTENERS ============
  
  function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
      button.addEventListener('click', handleCategoryClick);
    });
    
    // Genre buttons (will be attached dynamically)
    attachGenreHandlers();
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        console.log('🔍 Search:', currentFilters.search);
        renderMovies();
      });
    }
  }
  
  function handleCategoryClick(e) {
    const selectedCategory = e.target.getAttribute('data-category');
    console.log('📁 Category clicked:', selectedCategory);
    
    // Update UI
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Update filters
    currentFilters.category = selectedCategory;
    currentFilters.genres = []; // Clear genres when category changes
    
    // Recreate genre buttons for new category
    createGenreButtons();
    
    // Re-attach genre handlers
    attachGenreHandlers();
    
    // Render movies
    renderMovies();
  }
  
  function attachGenreHandlers() {
    document.querySelectorAll('.genre-btn').forEach(button => {
      // Remove existing listeners
      button.replaceWith(button.cloneNode(true));
    });
    
    // Add new listeners
    document.querySelectorAll('.genre-btn').forEach(button => {
      button.addEventListener('click', handleGenreClick);
    });
  }
  
  function handleGenreClick(e) {
    const selectedGenre = e.target.getAttribute('data-genre');
    console.log('🎭 Genre clicked:', selectedGenre);
    
    // Toggle genre
    if (currentFilters.genres.includes(selectedGenre)) {
      // Remove if already selected
      currentFilters.genres = currentFilters.genres.filter(g => g !== selectedGenre);
      e.target.classList.remove('active');
    } else {
      // Add if not selected
      currentFilters.genres.push(selectedGenre);
      e.target.classList.add('active');
    }
    
    console.log('Current genres:', currentFilters.genres);
    renderMovies();
  }
  
  function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(button => {
      const category = button.getAttribute('data-category');
      button.classList.toggle('active', category === currentFilters.category);
    });
  }
  
  // ============ CLEAR ALL BUTTON ============
  
  function addClearAllButton() {
    // Remove existing button if any
    const existingBtn = document.querySelector('.clear-all-btn');
    if (existingBtn) existingBtn.remove();
    
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'clear-all-btn';
    clearAllBtn.textContent = 'Шүүлтүүрийг цэвэрлэх';
    clearAllBtn.style.cssText = `
      display: block;
      margin: 1rem auto 2rem auto;
      padding: 0.5rem 1.5rem;
      background: rgba(255, 71, 87, 0.2);
      border: 1px solid rgba(255, 71, 87, 0.5);
      color: #ff6b81;
      border-radius: 20px;
      cursor: pointer;
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
      transition: all 0.3s ease;
    `;
    
    clearAllBtn.addEventListener('mouseenter', () => {
      clearAllBtn.style.background = 'rgba(255, 71, 87, 0.3)';
      clearAllBtn.style.transform = 'translateY(-2px)';
    });
    
    clearAllBtn.addEventListener('mouseleave', () => {
      clearAllBtn.style.background = 'rgba(255, 71, 87, 0.2)';
      clearAllBtn.style.transform = 'translateY(0)';
    });
    
    clearAllBtn.addEventListener('click', () => {
      console.log('🧹 Clearing all filters');
      
      // Reset filters
      currentFilters = {
        category: 'all',
        genres: [],
        search: ''
      };
      
      // Reset UI
      updateCategoryButtons();
      updateGenreButtons();
      
      // Clear search input
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
      
      // Recreate genre buttons
      createGenreButtons();
      
      // Re-attach handlers
      attachGenreHandlers();
      
      // Render
      renderMovies();
    });
    
    // Insert button
    const moviesGrid = document.getElementById('movies-container');
    if (moviesGrid && moviesGrid.parentNode) {
      moviesGrid.parentNode.insertBefore(clearAllBtn, moviesGrid);
    }
  }