// app.js - Integrated SPA Application with existing functionality
import router from './router.js';
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

// Initialize app
async function initializeApp() {
    console.log('🚀 Starting application...');
    
    try {
        console.log('📦 Loading database...');
        await loadMovieDatabase();
        database = Array.isArray(movieDatabase) ? [...movieDatabase] : [];
        console.log(`✅ Database loaded: ${database.length} items`);
        console.log(`🌐 Using TMDB: ${isUsingTMDB}`);
        
    } catch (err) {
        console.error('❌ Error during loadMovieDatabase():', err);
        database = [];
    }
}

// Page Views
const views = {
    home: async () => {
        const main = document.querySelector('main');
        main.innerHTML = `
            <section class="movie-slider">
                <div class="carousel-container">
                    <button class="nav-arrow left">‹</button>
                    <div class="carousel-track"></div>
                    <button class="nav-arrow right">›</button>
                </div>
                <div class="movie-info">
                    <h2 class="movie-name"></h2>
                </div>
                <div class="dots"></div>
            </section>

            <article class="promo-section">
                <img src="./frontend/images/promo-bg.jpg" alt="Promo" class="promo-bg">
                <div class="slogan top-left">Дуртай киногоо үз</div>
                <div class="slogan center">Бодол санаагаа бич</div>
                <div class="slogan bottom-right">Бусдад түгээ</div>
                <button class="join-btn">Бидэнтэй нэгд</button>
            </article>

            <section class="movies">
                <div class="section-header">
                    <h2>Сүүлд нэмэгдсэн кино</h2>
                    <button id="show-more-movies" class="show-more-btn">Илүү ихийг</button>
                </div>
                <hr class="line">
                <section class="movies-section" id="latest-movies"></section>
            </section>

            <section class="movies">
                <div class="section-header">
                    <h2>Сүүлд нэмэгдсэн цуврал</h2>
                    <button id="show-more-tv" class="show-more-btn">Илүү ихийг</button>
                </div>
                <hr class="line">
                <section class="movies-section" id="latest-tv"></section>
            </section>

            <section class="movies">
                <div class="section-header">
                    <h2>Тун удахгүй</h2>
                    <button id="show-more-upcoming" class="show-more-btn">Илүү ихийг</button>
                </div>
                <hr class="line">
                <section class="movies-section" id="upcoming-movies"></section>
            </section>
        `;
        
        // Initialize home page functionality
        await initializeHomePage();
    },

    movies: async () => {
        const main = document.querySelector('main');
        main.innerHTML = `
            <main>
    <h1 class="page-title">Кинонууд</h1>
    <p class="page-subtitle">6,000+ кино, цувралуудыг сонирхлоороо сонгоно уу</p>
    <div class="category-filters">
        <button class="category-btn active" data-category="all">Бүгд</button>
        <button class="category-btn" data-category="movies">Кино</button>
        <button class="category-btn" data-category="tv">TV Цуврал</button>
    </div>
    
    <div class="genre-filters">
    </div>
    <div class="movies-grid" id="movies-container">
    </div>
</main>
        `;
        
        await initMoviesPage();
    },

    customlist: () => {
        const main = document.querySelector('main');
        main.innerHTML = `
            <section class="page-content" style="padding-top: 100px;">
                <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: white; margin-bottom: 30px; font-size: 36px;">Миний жагсаалт</h1>
                    <div class="custom-list-container">
                        <p style="color: #999; text-align: center; padding: 60px 20px; font-size: 18px;">
                            Таны хадгалсан кино, цуврал энд харагдана
                        </p>
                    </div>
                </div>
            </section>
        `;
    },

    reviews: () => {
        const main = document.querySelector('main');
        main.innerHTML = `
            <section class="page-content" style="padding-top: 100px;">
                <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: white; margin-bottom: 30px; font-size: 36px;">Шүүмж</h1>
                    <div class="reviews-container">
                        <p style="color: #999; text-align: center; padding: 60px 20px; font-size: 18px;">
                            Шүүмжүүд удахгүй нэмэгдэнэ
                        </p>
                    </div>
                </div>
            </section>
        `;
    },

    login: () => {
        const main = document.querySelector('main');
        main.innerHTML = `
            <section class="page-content" style="padding-top: 100px;">
                <div style="padding: 40px 20px; max-width: 500px; margin: 0 auto;">
                    <h1 style="color: white; text-align: center; margin-bottom: 30px;">Нэвтрэх</h1>
                    <form class="login-form" style="background: #1e1e1e; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                        <div style="margin-bottom: 20px;">
                            <label style="color: white; display: block; margin-bottom: 8px; font-weight: 600;">Имэйл</label>
                            <input type="email" required style="width: 100%; padding: 12px; border-radius: 4px; border: 1px solid #555; background: #333; color: white; font-family: 'Nunito', sans-serif; font-size: 15px;">
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="color: white; display: block; margin-bottom: 8px; font-weight: 600;">Нууц үг</label>
                            <input type="password" required style="width: 100%; padding: 12px; border-radius: 4px; border: 1px solid #555; background: #333; color: white; font-family: 'Nunito', sans-serif; font-size: 15px;">
                        </div>
                        <button type="submit" style="width: 100%; padding: 12px; background: #00ffff; color: black; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 16px; transition: all 0.2s;">
                            Нэвтрэх
                        </button>
                        <p style="color: #999; text-align: center; margin-top: 20px;">
                            Бүртгэлгүй юу? <a href="/register" data-link style="color: #00ffff; text-decoration: none; font-weight: 600;">Бүртгүүлэх</a>
                        </p>
                    </form>
                </div>
            </section>
        `;
        
        const form = document.querySelector('.login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Нэвтрэх функц удахгүй нэмэгдэнэ');
        });
    }
};

// ============================================
// HOME PAGE FUNCTIONALITY
// ============================================

async function initializeHomePage() {
    console.log('🎬 Initializing home page...');
    initializeCarousel();
    initializeFilters();
    applyFilters();
    await setupSections();
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
            
            if (!hasMovies && !hasTV) {
                console.log('🔄 Database empty, falling back to TMDB...');
                await loadTMDBDataForSections();
            } else {
                const latestMovies = database.filter(m => m.category === "movies" && !["Springsteen: Deliver Me from Nowhere", "Regretting You", "Blue Moon"].includes(m.name));
                const latestTV = database.filter(m => m.category === "tv" && !["Physical: 100", "It: Welcome to Derry", "Talamasca: The Secret Order"].includes(m.name));
                const upcoming = database.filter(m => ["Springsteen: Deliver Me from Nowhere","Regretting You","Blue Moon","Physical: 100","It: Welcome to Derry","Talamasca: The Secret Order"].includes(m.name));
                
                sectionData["latest-movies"] = latestMovies;
                sectionData["latest-tv"] = latestTV;
                sectionData["upcoming-movies"] = upcoming;
                
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
        
        const [movies, tvShows, upcoming] = await Promise.all([
            tmdbService.getNowPlayingMovies(1),
            tmdbService.getAiringTodayTV(1),
            tmdbService.getUpcomingMovies(1)
        ]);
        
        sectionData["latest-movies"] = movies;
        sectionData["latest-tv"] = tvShows;
        sectionData["upcoming-movies"] = upcoming;
        
        database = [...movies, ...tvShows, ...upcoming];
        
        renderPaginatedSection("latest-movies", movies, 1);
        renderPaginatedSection("latest-tv", tvShows, 1);
        
        if (upcoming.length === 0) {
            document.getElementById('upcoming-movies').innerHTML = 
                '<div class="no-results">Тун удахгүй гарах кино одоогоор байхгүй байна</div>';
            const upcomingBtn = document.getElementById('show-more-upcoming');
            if (upcomingBtn) upcomingBtn.style.display = 'none';
        } else {
            renderPaginatedSection("upcoming-movies", upcoming, 1);
        }
        
    } catch (error) {
        console.error('❌ Error loading TMDB data:', error);
        renderFallbackSections();
    }
}

function renderFallbackSections() {
    const fallbackMovies = [
        { "name": "The Conjuring: Last Rites", "category": "movies", "image": "movie1.jpg", "yearOrSeason": "2025 • Horror", "genre": ["horror"] },
        { "name": "Tron: Ares", "category": "movies", "image": "movie2.jpg", "yearOrSeason": "2025 • Sci-Fi", "genre": ["sci-fi"] }
    ];
    
    renderPaginatedSection("latest-movies", fallbackMovies, 1);
    renderPaginatedSection("latest-tv", fallbackMovies, 1);
    renderPaginatedSection("upcoming-movies", fallbackMovies, 1);
}

function setupShowMoreButtons() {
    const movieBtn = document.getElementById('show-more-movies');
    const tvBtn = document.getElementById('show-more-tv');
    const upcomingBtn = document.getElementById('show-more-upcoming');
    
    if (movieBtn) {
        movieBtn.onclick = async () => {
            sectionState["latest-movies"]++;
            await loadMoreForSection("latest-movies");
        };
    }
    
    if (tvBtn) {
        tvBtn.onclick = async () => {
            sectionState["latest-tv"]++;
            await loadMoreForSection("latest-tv");
        };
    }
    
    if (upcomingBtn) {
        upcomingBtn.onclick = async () => {
            sectionState["upcoming-movies"]++;
            await loadMoreForSection("upcoming-movies");
        };
    }
}

async function loadMoreForSection(sectionId) {
    if (isUsingTMDB) {
        await loadMoreTMDBData(sectionId, sectionState[sectionId]);
    } else {
        const movies = sectionData[sectionId] || getMoviesBySection(sectionId);
        renderPaginatedSection(sectionId, movies, sectionState[sectionId]);
    }
}

async function loadMoreTMDBData(sectionId, page) {
    try {
        let newData = [];
        
        if (sectionId === "latest-movies") {
            newData = await tmdbService.getNowPlayingMovies(page);
        } else if (sectionId === "latest-tv") {
            newData = await tmdbService.getAiringTodayTV(page);
        } else if (sectionId === "upcoming-movies") {
            newData = await tmdbService.getUpcomingMovies(page);
        }
        
        sectionData[sectionId] = [...sectionData[sectionId], ...newData];
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
    const container = document.getElementById(containerId);
    if (!container) return;

    const endIndex = page * ITEMS_PER_PAGE;
    const visibleMovies = movies.slice(0, endIndex);

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
        button.style.display = movies.length > endIndex ? "inline-block" : "none";
    }
}

function getShowMoreButtonForSection(sectionId) {
    switch(sectionId) {
        case "latest-movies": return document.getElementById('show-more-movies');
        case "latest-tv": return document.getElementById('show-more-tv');
        case "upcoming-movies": return document.getElementById('show-more-upcoming');
        default: return null;
    }
}

function initializeCarousel() {
    const track = document.querySelector(".carousel-track");
    const dotsContainer = document.querySelector(".dots");
    const movieName = document.querySelector(".movie-name");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");

    if (!track || !dotsContainer) return;

    setTimeout(() => {
        const sourceForCarousel = (filteredData && filteredData.length > 0) ? filteredData : database;
        const carouselItems = sourceForCarousel.slice(0, 6);

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

            setTimeout(() => { carouselAnimating = false; }, 800);
        }

        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", () => {
                const index = Number(card.dataset.index);
                if (index !== carouselIndex) updateCarousel(index);
            });
        });

        if (leftArrow) leftArrow.onclick = () => updateCarousel(carouselIndex - 1);
        if (rightArrow) rightArrow.onclick = () => updateCarousel(carouselIndex + 1);

        document.querySelectorAll(".dot").forEach(dot => {
            dot.onclick = () => updateCarousel(Number(dot.dataset.index));
        });

        updateCarousel(0);
    }, 100);
}

function initializeFilters() {
}

function applyFilters() {
    const searchInput = document.querySelector('cinewave-navbar')?.shadowRoot?.querySelector('#search-input');
    const query = searchInput?.value.toLowerCase() || "";
    
    filteredData = (database || []).filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesQuery = item.name && item.name.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });
    
    initializeCarousel();
}

// ============================================
// MOVIES PAGE FUNCTIONALITY (Complete Implementation)
// ============================================

class MoviesPageController {
    constructor() {
        this.currentCategory = 'all';
        this.currentGenre = 'all';
        this.currentPage = 1;
        this.totalPages = 1;
        this.isLoading = false;
        this.allMovies = [];
        this.genres = {
            movies: [],
            tv: []
        };
    }

    async init() {
        console.log('🎬 Movies page initializing...');
        console.log('Step 1: Fetching genres...');
        
        await this.fetchGenres();
        console.log('Step 2: Genres fetched, rendering filters...');
        
        this.renderGenreFilters();
        console.log('Step 3: Filters rendered, loading movies...');
        
        await this.loadMovies();
        console.log('Step 4: Movies loaded, setting up listeners...');
        
        this.setupEventListeners();
        console.log('Step 5: Listeners set up, setting up scroll...');
        
        this.setupInfiniteScroll();
        console.log('✅ Movies page initialized successfully!');
    }

    async fetchGenres() {
        try {
            console.log('📚 Fetching genres...');
            
            // Check if tmdbService exists
            if (typeof tmdbService === 'undefined') {
                throw new Error('TMDB Service not available');
            }
            
            const movieGenres = await tmdbService.fetchFromTMDB('/genre/movie/list');
            this.genres.movies = movieGenres.genres || [];
            
            const tvGenres = await tmdbService.fetchFromTMDB('/genre/tv/list');
            this.genres.tv = tvGenres.genres || [];
            
            console.log(`✅ Loaded ${this.genres.movies.length} movie genres and ${this.genres.tv.length} TV genres`);
            
        } catch (error) {
            console.error('❌ Error fetching genres:', error);
            // Fallback genres
            this.genres.movies = [
                { id: 28, name: 'Action' },
                { id: 12, name: 'Adventure' },
                { id: 16, name: 'Animation' },
                { id: 35, name: 'Comedy' },
                { id: 80, name: 'Crime' },
                { id: 18, name: 'Drama' },
                { id: 14, name: 'Fantasy' },
                { id: 27, name: 'Horror' },
                { id: 9648, name: 'Mystery' },
                { id: 10749, name: 'Romance' },
                { id: 878, name: 'Science Fiction' },
                { id: 53, name: 'Thriller' }
            ];
            
            this.genres.tv = [
                { id: 10759, name: 'Action & Adventure' },
                { id: 16, name: 'Animation' },
                { id: 35, name: 'Comedy' },
                { id: 80, name: 'Crime' },
                { id: 18, name: 'Drama' },
                { id: 10765, name: 'Sci-Fi & Fantasy' }
            ];
            
            console.log('⚠️ Using fallback genres');
        }
    }

    renderGenreFilters() {
        const genreContainer = document.querySelector('.genre-filters');
        if (!genreContainer) return;
        
        genreContainer.innerHTML = '';
        
        const allGenresBtn = document.createElement('button');
        allGenresBtn.className = 'genre-btn active';
        allGenresBtn.textContent = 'Бүх төрөл';
        allGenresBtn.dataset.genre = 'all';
        genreContainer.appendChild(allGenresBtn);
        
        this.renderCurrentCategoryGenres();
    }

    renderCurrentCategoryGenres() {
        const genreContainer = document.querySelector('.genre-filters');
        if (!genreContainer) return;
        
        const existingGenreBtns = genreContainer.querySelectorAll('.genre-btn:not([data-genre="all"])');
        existingGenreBtns.forEach(btn => btn.remove());
        
        const currentGenres = this.currentCategory === 'tv' ? this.genres.tv : this.genres.movies;
        
        currentGenres.forEach(genre => {
            const genreBtn = document.createElement('button');
            genreBtn.className = 'genre-btn';
            genreBtn.textContent = this.translateGenre(genre.name);
            genreBtn.dataset.genre = genre.id;
            genreContainer.appendChild(genreBtn);
        });
    }

    translateGenre(genreName) {
        const translations = {
            'Action': 'Экшн', 'Adventure': 'Адал явдалт', 'Animation': 'Анимейшн',
            'Comedy': 'Инээдмийн', 'Crime': 'Гэмт хэрэг', 'Documentary': 'Баримтат',
            'Drama': 'Драма', 'Family': 'Гэр бүл', 'Fantasy': 'Фэнтези',
            'History': 'Түүхэн', 'Horror': 'Аймшгийн', 'Music': 'Хөгжмийн',
            'Mystery': 'Нууцлаг', 'Romance': 'Урлаг', 'Science Fiction': 'Шинжлэх ухааны',
            'Thriller': 'Сэтгэл хөдөлгөм', 'War': 'Дайны', 'Western': 'Барууны',
            'Action & Adventure': 'Экшн ба адал явдалт', 'Sci-Fi & Fantasy': 'Шинжлэх ухаан ба фэнтези'
        };
        return translations[genreName] || genreName;
    }

    async loadMovies() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        console.log(`🎬 Loading ${this.currentCategory} page ${this.currentPage}...`);
        
        try {
            // Check if tmdbService exists
            if (typeof tmdbService === 'undefined') {
                throw new Error('TMDB Service not available');
            }
            
            let data = [];
            
            if (this.currentCategory === 'all') {
                const [movies, tvShows] = await Promise.all([
                    tmdbService.getNowPlayingMovies(this.currentPage),
                    tmdbService.getAiringTodayTV(this.currentPage)
                ]);
                
                const maxLength = Math.max(movies.length, tvShows.length);
                data = [];
                for (let i = 0; i < maxLength; i++) {
                    if (i < movies.length) data.push(movies[i]);
                    if (i < tvShows.length) data.push(tvShows[i]);
                }
                
            } else if (this.currentCategory === 'movies') {
                data = await tmdbService.getNowPlayingMovies(this.currentPage);
            } else if (this.currentCategory === 'tv') {
                data = await tmdbService.getAiringTodayTV(this.currentPage);
            }
            
            console.log(`✅ Loaded ${data.length} items`);
            
            if (this.currentGenre !== 'all') {
                const genreId = parseInt(this.currentGenre);
                data = data.filter(item => 
                    item.genre_ids && item.genre_ids.includes(genreId)
                );
            }
            
            const uniqueIds = new Set();
            data = data.filter(item => {
                if (uniqueIds.has(item.id)) return false;
                uniqueIds.add(item.id);
                return true;
            });
            
            if (this.currentPage === 1) {
                this.allMovies = data;
            } else {
                this.allMovies = [...this.allMovies, ...data];
            }
            
            console.log(`✅ Total movies: ${this.allMovies.length}`);
            this.renderMovies();
            
        } catch (error) {
            console.error('❌ Error loading movies:', error);
            this.showError();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    renderMovies() {
        const container = document.getElementById('movies-container');
        if (!container) return;
        
        if (this.currentPage === 1) {
            container.innerHTML = '';
        }
        
        if (this.allMovies.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-film"></i>
                    <h3>Кинонууд олдсонгүй</h3>
                    <p>Уучлаарай, сонгосон шүүлтүүрт тохирох кино олдсонгүй.</p>
                    <button class="retry-btn">Дахин оролдох</button>
                </div>
            `;
            
            container.querySelector('.retry-btn')?.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadMovies();
            });
            
            return;
        }
        
        this.allMovies.forEach((movie, index) => {
            const movieCard = document.createElement('movie-card');
            
            let yearOrSeason = '';
            if (movie.year) {
                yearOrSeason = movie.year;
                if (movie.rating) yearOrSeason += ` • ${movie.rating}/10`;
            } else if (movie.release_date) {
                const year = movie.release_date.split('-')[0];
                yearOrSeason = year;
                if (movie.rating) yearOrSeason += ` • ${movie.rating}/10`;
            }
            
            movieCard.setAttribute('name', movie.name || movie.title || 'Unknown');
            movieCard.setAttribute('image', movie.image || movie.poster_path || '');
            movieCard.setAttribute('year-or-season', yearOrSeason);
            movieCard.setAttribute('category', movie.category || movie.media_type || 'movies');
            movieCard.setAttribute('rating', movie.rating_value || movie.vote_average || '0.0');
            movieCard.setAttribute('data-tmdb-id', movie.tmdb_id || movie.id || index);
            movieCard.setAttribute('data-media-type', movie.media_type || movie.category || 'movie');
            
            if (movie.description || movie.overview) {
                movieCard.setAttribute('description', movie.description || movie.overview || '');
            }
            
            const genres = this.getGenreNames(movie.genre_ids, movie.category || movie.media_type);
            if (genres.length > 0) {
                movieCard.setAttribute('genre', JSON.stringify(genres));
            }
            
            container.appendChild(movieCard);
        });
    }

    getGenreNames(genreIds, category) {
        if (!genreIds || !Array.isArray(genreIds)) return [];
        
        const genreList = category === 'tv' ? this.genres.tv : this.genres.movies;
        return genreIds
            .map(id => {
                const genre = genreList.find(g => g.id === id);
                return genre ? this.translateGenre(genre.name) : '';
            })
            .filter(name => name !== '')
            .slice(0, 3);
    }

    setupEventListeners() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.changeCategory(category);
            });
        });
        
        const genreContainer = document.querySelector('.genre-filters');
        if (genreContainer) {
            genreContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('genre-btn')) {
                    const genre = e.target.dataset.genre;
                    this.changeGenre(genre);
                }
            });
        }
    }

    changeCategory(category) {
        if (this.currentCategory === category) return;
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.currentCategory = category;
        this.renderCurrentCategoryGenres();
        this.currentGenre = 'all';
        this.currentPage = 1;
        
        const allGenresBtn = document.querySelector('.genre-btn[data-genre="all"]');
        if (allGenresBtn) {
            document.querySelectorAll('.genre-btn').forEach(btn => btn.classList.remove('active'));
            allGenresBtn.classList.add('active');
        }
        
        this.allMovies = [];
        this.loadMovies();
    }

    changeGenre(genre) {
        if (this.currentGenre === genre) return;
        
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.genre === genre);
        });
        
        this.currentGenre = genre;
        this.currentPage = 1;
        this.allMovies = [];
        this.loadMovies();
    }

    setupInfiniteScroll() {
        let throttleTimeout;
        
        window.addEventListener('scroll', () => {
            if (throttleTimeout) return;
            
            throttleTimeout = setTimeout(() => {
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                
                if (scrollTop + clientHeight >= scrollHeight - 100 && 
                    !this.isLoading && 
                    this.currentPage < 10) {
                    
                    this.currentPage++;
                    this.loadMovies();
                }
                
                throttleTimeout = null;
            }, 200);
        });
    }

    showLoading() {
        this.hideLoading();
        
        const container = document.getElementById('movies-container');
        if (!container) return;
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>Кинонуудыг дуудаж байна...</p>
        `;
        
        if (this.currentPage === 1) {
            container.innerHTML = '';
        }
        container.appendChild(loader);
    }

    hideLoading() {
        const loader = document.querySelector('.loader');
        if (loader) loader.remove();
    }

    showError() {
        const container = document.getElementById('movies-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Алдаа гарлаа</h3>
                <p>Кинонуудыг дуудахад алдаа гарлаа. Дахин оролдоно уу.</p>
                <button class="retry-btn">Дахин оролдох</button>
            </div>
        `;
        
        container.querySelector('.retry-btn')?.addEventListener('click', () => {
            this.currentPage = 1;
            this.loadMovies();
        });
    }
}

// Global instance
let moviesPageInstance = null;

async function initMoviesPage() {
    console.log('🎬 initMoviesPage called');
    console.log('Current URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    
    // Cleanup previous instance
    if (moviesPageInstance) {
        console.log('♻️ Cleaning up previous movies page instance');
        moviesPageInstance = null;
    }
    
    // Check if tmdbService is available
    if (typeof tmdbService === 'undefined') {
        console.error('❌ TMDB Service not found!');
        const container = document.getElementById('movies-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <h3 style="color: white;">TMDB Service байхгүй байна</h3>
                    <p style="color: #999;">tmdb-service.js файл ачаалагдаагүй байна.</p>
                </div>
            `;
        }
        return;
    }
    
    console.log('✅ TMDB Service available');
    console.log('🔧 Creating MoviesPageController instance...');
    
    try {
        moviesPageInstance = new MoviesPageController();
        console.log('✅ Instance created, calling init()...');
        
        // Add timeout to catch hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Init timeout after 30 seconds')), 30000);
        });
        
        await Promise.race([
            moviesPageInstance.init(),
            timeoutPromise
        ]);
        
        console.log('✅ Movies page fully initialized');
    } catch (error) {
        console.error('❌ Error in initMoviesPage:', error);
        const container = document.getElementById('movies-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <h3 style="color: white;">Алдаа гарлаа</h3>
                    <p style="color: #999;">${error.message}</p>
                    <button class="retry-btn" onclick="window.location.hash='#/'" style="padding: 10px 30px; background: #2196f3; color: white; border: none; border-radius: 25px; cursor: pointer;">Нүүр хуудас</button>
                </div>
            `;
        }
    }
}

// ============================================
// ROUTER SETUP
// ============================================

// Register all routes
router.addRoute('/', views.home);
router.addRoute('/movies', views.movies);
router.addRoute('/customlist', views.customlist);
router.addRoute('/reviews', views.reviews);
router.addRoute('/login', views.login);

// Initialize app and start router
initializeApp().then(() => {
    router.start();
});

// Handle search from navbar
document.addEventListener('search', (e) => {
    const { query, category } = e.detail;
    selectedCategory = category === 'all' ? 'all' : category;
    applyFilters();
});

// Add styles
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