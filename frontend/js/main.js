// frontend/js/main.js
import { movieDatabase, loadMovieDatabase, isUsingTMDB } from './database.js';
import { tmdbService } from './tmdb-service.js';

// Data containers
let database = [];
let selectedCategory = "all";
let filteredData = [];
let currentIndex = 0;

const ITEMS_PER_PAGE = 6;
let sectionState = {
    "latest-movies": 1,
    "latest-tv": 1,
    "upcoming-movies": 1
};

// Store section-specific data for TMDB
let sectionData = {
    "latest-movies": [],
    "latest-tv": [],
    "upcoming-movies": []
};

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Starting application...');
    
    try {
        console.log('📦 Loading database...');
        await loadMovieDatabase();
        database = Array.isArray(movieDatabase) ? [...movieDatabase] : [];
        console.log(`✅ Database loaded: ${database.length} items`);
        console.log(`🌐 Using TMDB: ${isUsingTMDB}`);
        
        console.log('Sample data:', database.slice(0, 3));
        
    } catch (err) {
        console.error('❌ Error during loadMovieDatabase():', err);
        database = [];
    }

    initializeApp();
});

function initializeApp() {
    console.log('🎬 Initializing app...');
    initializeCarousel();
    initializeFilters();
    applyFilters();
    setupSections();
}

async function setupSections() {
    console.log('📋 Setting up sections...');
    
    try {
        if (isUsingTMDB && database.length === 0) {
            console.log('🔄 Fetching sections from TMDB...');
            await loadTMDBDataForSections();
        } else {
            console.log('📂 Using existing database data...');
            
            const hasMovies = database.some(m => m.category === "movies");
            const hasTV = database.some(m => m.category === "tv");
            
            console.log(`Has movies: ${hasMovies}, Has TV: ${hasTV}`);
            
            if (!hasMovies && !hasTV) {
                console.log('🔄 Database empty, falling back to TMDB...');
                await loadTMDBDataForSections();
            } else {
                // For local database, use the old filtering logic
                const latestMovies = database.filter(m => m.category === "movies" && !["Springsteen: Deliver Me from Nowhere", "Regretting You", "Blue Moon"].includes(m.name));
                const latestTV = database.filter(m => m.category === "tv" && !["Physical: 100", "It: Welcome to Derry", "Talamasca: The Secret Order"].includes(m.name));
                const upcoming = database.filter(m => ["Springsteen: Deliver Me from Nowhere","Regretting You","Blue Moon","Physical: 100","It: Welcome to Derry","Talamasca: The Secret Order"].includes(m.name));
                
                sectionData["latest-movies"] = latestMovies;
                sectionData["latest-tv"] = latestTV;
                sectionData["upcoming-movies"] = upcoming;
                
                console.log(`Latest movies: ${latestMovies.length}, Latest TV: ${latestTV.length}, Upcoming: ${upcoming.length}`);
                
                renderPaginatedSection("latest-movies", latestMovies, 1);
                renderPaginatedSection("latest-tv", latestTV, 1);
                renderPaginatedSection("upcoming-movies", upcoming, 1);
            }
        }
        
    } catch (error) {
        console.error('❌ Error in setupSections:', error);
        renderFallbackSections();
    }
    
    setupShowMoreButtons();
}

async function loadTMDBDataForSections() {
    console.log('🌐 Loading TMDB data...');
    
    try {
        document.getElementById('latest-movies').innerHTML = '<div class="loading">Loading movies...</div>';
        document.getElementById('latest-tv').innerHTML = '<div class="loading">Loading TV shows...</div>';
        document.getElementById('upcoming-movies').innerHTML = '<div class="loading">Loading upcoming...</div>';
        
        // Fetch NOW PLAYING movies (current releases), airing TV shows, and upcoming
        const [movies, tvShows, upcoming] = await Promise.all([
            tmdbService.getNowPlayingMovies(1),
            tmdbService.getAiringTodayTV(1),
            tmdbService.getUpcomingMovies(1)
        ]);
        
        console.log(`TMDB Data - Movies: ${movies.length}, TV: ${tvShows.length}, Upcoming: ${upcoming.length}`);
        
        // Store in section-specific data
        sectionData["latest-movies"] = movies;
        sectionData["latest-tv"] = tvShows;
        sectionData["upcoming-movies"] = upcoming;
        
        // Update main database with all data
        database = [...movies, ...tvShows, ...upcoming];
        
        // Render sections
        renderPaginatedSection("latest-movies", movies, 1);
        renderPaginatedSection("latest-tv", tvShows, 1);
        
        // Render upcoming section (always render, even if empty)
        if (upcoming.length === 0) {
            document.getElementById('upcoming-movies').innerHTML = 
                '<div class="no-results">Тун удахгүй гарах кино одоогоор байхгүй байна</div>';
            const upcomingBtn = document.getElementById('show-more-upcoming');
            if (upcomingBtn) upcomingBtn.style.display = 'none';
        } else {
            renderPaginatedSection("upcoming-movies", upcoming, 1);
        }
        
        console.log('✅ All sections rendered successfully');
        
    } catch (error) {
        console.error('❌ Error loading TMDB data:', error);
        renderFallbackSections();
    }
}

function renderFallbackSections() {
    console.log('⚠️ Rendering fallback sections...');
    
    const fallbackMovies = [
        { "name": "The Conjuring: Last Rites", "category": "movies", "image": "movie1.jpg", "yearOrSeason": "2025 • Horror", "genre": ["horror"] },
        { "name": "Tron: Ares", "category": "movies", "image": "movie2.jpg", "yearOrSeason": "2025 • Sci-Fi", "genre": ["sci-fi"] }
    ];
    
    renderPaginatedSection("latest-movies", fallbackMovies, 1);
    renderPaginatedSection("latest-tv", fallbackMovies, 1);
    renderPaginatedSection("upcoming-movies", fallbackMovies, 1);
}

function setupShowMoreButtons() {
    console.log('🔘 Setting up Show More buttons...');
    
    const movieBtn = document.getElementById('show-more-movies');
    const tvBtn = document.getElementById('show-more-tv');
    const upcomingBtn = document.getElementById('show-more-upcoming');
    
    if (movieBtn) {
        movieBtn.addEventListener('click', async () => {
            console.log('🎬 Show More Movies clicked');
            sectionState["latest-movies"]++;
            await loadMoreForSection("latest-movies");
        });
    }
    
    if (tvBtn) {
        tvBtn.addEventListener('click', async () => {
            console.log('📺 Show More TV clicked');
            sectionState["latest-tv"]++;
            await loadMoreForSection("latest-tv");
        });
    }
    
    if (upcomingBtn) {
        upcomingBtn.addEventListener('click', async () => {
            console.log('⏰ Show More Upcoming clicked');
            sectionState["upcoming-movies"]++;
            await loadMoreForSection("upcoming-movies");
        });
    }
}

async function loadMoreForSection(sectionId) {
    console.log(`📥 Loading more for ${sectionId}, page ${sectionState[sectionId]}`);
    
    if (isUsingTMDB) {
        await loadMoreTMDBData(sectionId, sectionState[sectionId]);
    } else {
        const movies = sectionData[sectionId] || getMoviesBySection(sectionId);
        renderPaginatedSection(sectionId, movies, sectionState[sectionId]);
    }
}

async function loadMoreTMDBData(sectionId, page) {
    console.log(`🌐 Loading TMDB page ${page} for ${sectionId}`);
    
    try {
        let newData = [];
        
        if (sectionId === "latest-movies") {
            newData = await tmdbService.getNowPlayingMovies(page);
        } else if (sectionId === "latest-tv") {
            newData = await tmdbService.getAiringTodayTV(page);
        } else if (sectionId === "upcoming-movies") {
            newData = await tmdbService.getUpcomingMovies(page);
        }
        
        console.log(`✅ Loaded ${newData.length} new items`);
        
        // Append to section-specific data
        sectionData[sectionId] = [...sectionData[sectionId], ...newData];
        
        // Update main database
        database = [...database, ...newData];
        
        renderPaginatedSection(sectionId, sectionData[sectionId], page);
        
    } catch (error) {
        console.error(`❌ Error loading more TMDB data for ${sectionId}:`, error);
    }
}

function getMoviesBySection(sectionId) {
    switch(sectionId) {
        case "latest-movies":
            return database.filter(m => m.category === "movies" && !["Springsteen: Deliver Me from Nowhere", "Regretting You", "Blue Moon"].includes(m.name));
        case "latest-tv":
            return database.filter(m => m.category === "tv" && !["Physical: 100", "It: Welcome to Derry", "Talamasca: The Secret Order"].includes(m.name));
        case "upcoming-movies":
            return database.filter(m => ["Springsteen: Deliver Me from Nowhere","Regretting You","Blue Moon","Physical: 100","It: Welcome to Derry","Talamasca: The Secret Order"].includes(m.name));
        default:
            return [];
    }
}

function renderPaginatedSection(containerId, movies, page) {
    console.log(`📺 Rendering ${containerId} page ${page} with ${movies.length} total movies...`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Container ${containerId} not found!`);
        return;
    }

    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const visibleMovies = movies.slice(startIndex, endIndex);

    console.log(`Showing ${visibleMovies.length} movies (0 to ${endIndex})`);

    container.innerHTML = '';

    if (visibleMovies.length === 0) {
        container.innerHTML = '<div class="no-results">No movies found</div>';
        return;
    }

    visibleMovies.forEach((movie) => {
        const movieCard = document.createElement('movie-card');
        
        movieCard.setAttribute('name', movie.name || 'Unknown');
        movieCard.setAttribute('category', movie.category || 'movies');
        
        let imageUrl = movie.image || 'movie-placeholder.jpg';
        if (!imageUrl.startsWith('http') && !imageUrl.includes('frontend/images/')) {
            imageUrl = `./frontend/images/${imageUrl}`;
        }
        movieCard.setAttribute('image', imageUrl);
        
        movieCard.setAttribute('year-or-season', movie.yearOrSeason || 'N/A');
        
        if (movie.rating) movieCard.setAttribute('rating', movie.rating);
        if (movie.description) movieCard.setAttribute('description', movie.description);
        
        if (movie.genre && Array.isArray(movie.genre)) {
            movieCard.setAttribute('genre', JSON.stringify(movie.genre));
        } else if (movie.genres && Array.isArray(movie.genres)) {
            movieCard.setAttribute('genre', JSON.stringify(movie.genres));
        }
        
        if (movie.cast && Array.isArray(movie.cast)) {
            movieCard.setAttribute('cast', JSON.stringify(movie.cast));
        }
        
        if (movie.tmdb_id || movie.id) {
            movieCard.setAttribute('data-tmdb-id', movie.tmdb_id || movie.id);
        }
        if (movie.media_type) {
            movieCard.setAttribute('data-media-type', movie.media_type);
        }
        
        container.appendChild(movieCard);
    });

    const button = getShowMoreButtonForSection(containerId);
    if (button) {
        if (movies.length > endIndex) {
            button.style.display = "inline-block";
            console.log(`✅ Show More button visible (${movies.length} > ${endIndex})`);
        } else {
            button.style.display = "none";
            console.log(`⭕ Show More button hidden (all ${movies.length} items shown)`);
        }
    }
}

function getShowMoreButtonForSection(sectionId) {
    switch(sectionId) {
        case "latest-movies":
            return document.getElementById('show-more-movies');
        case "latest-tv":
            return document.getElementById('show-more-tv');
        case "upcoming-movies":
            return document.getElementById('show-more-upcoming');
        default:
            return null;
    }
}

function initializeCarousel() {
    console.log("Initializing carousel...");

    const track = document.querySelector(".carousel-track");
    const dotsContainer = document.querySelector(".dots");
    const movieName = document.querySelector(".movie-name");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");

    if (!track || !dotsContainer) {
        console.error("Carousel track or dots container not found!");
        return;
    }

    setTimeout(() => {
        const sourceForCarousel = (filteredData && filteredData.length > 0) ? filteredData : database;
        const carouselItems = sourceForCarousel.slice(0, 6);
        
        console.log(`Carousel items: ${carouselItems.length}`);

        if (carouselItems.length === 0) {
            track.innerHTML = '<div class="no-carousel">No movies available</div>';
            dotsContainer.innerHTML = '';
            if (movieName) movieName.textContent = "No Results Found";
            return;
        }

        track.innerHTML = "";
        dotsContainer.innerHTML = "";

        carouselItems.forEach((movie, i) => {
            const card = document.createElement("div");
            card.className = "card";
            card.dataset.index = i;
            
            let imageUrl = movie.image || 'movie-placeholder.jpg';
            if (!imageUrl.startsWith('http') && !imageUrl.includes('frontend/images/')) {
                imageUrl = `./frontend/images/${imageUrl}`;
            }
            
            card.innerHTML = `<img src="${imageUrl}" alt="${movie.name}" loading="lazy">`;
            track.appendChild(card);

            const dot = document.createElement("div");
            dot.className = "dot" + (i === 0 ? " active" : "");
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });

        let carouselIndex = 0;
        let carouselAnimating = false;

        function updateCarousel(newIndex) {
            if (carouselAnimating || carouselItems.length === 0) return;
            carouselAnimating = true;

            carouselIndex = (newIndex + carouselItems.length) % carouselItems.length;

            const cards = document.querySelectorAll(".card");
            const dots = document.querySelectorAll(".dot");

            cards.forEach((card, i) => {
                const offset = (i - carouselIndex + cards.length) % cards.length;
                card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

                if (offset === 0) card.classList.add("center");
                else if (offset === 1) card.classList.add("right-1");
                else if (offset === 2) card.classList.add("right-2");
                else if (offset === cards.length - 1) card.classList.add("left-1");
                else if (offset === cards.length - 2) card.classList.add("left-2");
                else card.classList.add("hidden");
            });

            dots.forEach((dot, i) => dot.classList.toggle("active", i === carouselIndex));

            if (movieName) {
                movieName.style.opacity = "0";
                setTimeout(() => {
                    movieName.textContent = carouselItems[carouselIndex]?.name || "No Results Found";
                    movieName.style.opacity = "1";
                }, 300);
            }

            setTimeout(() => {
                carouselAnimating = false;
            }, 800);
        }

        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", () => {
                const index = Number(card.dataset.index);
                if (index !== carouselIndex) {
                    updateCarousel(index);
                }
            });
            card.style.cursor = "pointer";
        });

        if (leftArrow) leftArrow.addEventListener("click", () => updateCarousel(carouselIndex - 1));
        if (rightArrow) rightArrow.addEventListener("click", () => updateCarousel(carouselIndex + 1));

        document.querySelectorAll(".dot").forEach(dot => {
            dot.addEventListener("click", () => updateCarousel(Number(dot.dataset.index)));
        });

        window.updateCarousel = updateCarousel;
        updateCarousel(0);
        
    }, 100);
}

function initializeFilters() {
    console.log("Initializing filters...");
    
    const categorySelect = document.getElementById("category-select");
    const searchInput = document.getElementById("search-input");

    if (categorySelect) {
        categorySelect.addEventListener("change", function() {
            selectedCategory = this.value;
            applyFilters();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }
}

function applyFilters() {
    console.log("Applying filters...");

    const searchInput = document.getElementById("search-input");
    const query = searchInput?.value.toLowerCase() || "";
    
    filteredData = (database || []).filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesQuery = item.name && item.name.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    console.log("Filtered data count:", filteredData.length);
    
    if (typeof window.updateCarousel === 'function') {
        initializeCarousel();
    }
}

const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 18px;
    }
    
    .no-results {
        text-align: center;
        padding: 40px;
        color: #999;
        font-style: italic;
    }
    
    .no-carousel {
        text-align: center;
        padding: 60px 20px;
        color: #999;
        font-size: 18px;
        background: rgba(0,0,0,0.05);
        border-radius: 10px;
    }
`;
document.head.appendChild(style);