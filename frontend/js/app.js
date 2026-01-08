// app.js - Integrated SPA Application with existing functionality
import router from './router.js';
import { movieDatabase, loadMovieDatabase, isUsingTMDB } from './database.js';
import { tmdbService } from './tmdb-service.js';
import { authService } from './auth-service.js';
import { renderProfilePage, initProfilePage } from './profile-page.js';

// Data containers
let database = [];
let selectedCategory = "all";
let filteredData = [];

const ITEMS_PER_PAGE = 6;
let sectionState = {
    "latest-movies": 1,
    "latest-tv": 1,
    "upcoming-movies": 1
};

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
                <img src="../frontend/images/promo.png" alt="Promo" class="promo-bg">
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
        await initializeHomePage();
    },

    movies: async () => {
        const main = document.querySelector('main');
        main.innerHTML = `
            <section>
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
            </section>
        `;
        
        await initMoviesPage();
    },

    profile: async () => {
        const main = document.querySelector('main');
        main.innerHTML = renderProfilePage();
        await initProfilePage(authService);
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

    search: async () => {
        const main = document.querySelector('main');
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const query = urlParams.get('q') || '';
        
        main.innerHTML = `
            <section>
                <h1 class="page-title">Хайлтын үр дүн</h1>
                <div class="movies-grid" id="search-results-container">
                    <div class="loading">Хайж байна...</div>
                </div>
            </section>
        `;
        
        await initSearchPage(query);
    },

    login: async () => {
        const main = document.querySelector('main');
        main.innerHTML = `
      <div class="page-wrapper-login">
        <div class="main-content-login">
          <div class="auth-container">
            <div class="floating-particles" id="particles"></div>
            
            <div class="form-section">
              <div class="logo">
                <span class="cine">CINE</span><span class="wave">WAVE</span>
              </div>
              <div class="form-container" id="loginForm">
                <h1>Нэвтрэх</h1>
                <div class="social-buttons">
                  <button class="social-btn" id="google-btn">
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                    Google
                  </button>
                  <button class="social-btn" id="facebook-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>

                <div class="divider"><span>эсвэл</span></div>

                <form id="login-form">
                  <div class="input-group">
                    <label>И-мейл</label>
                    <input type="email" placeholder="example@gmail.com" required>
                  </div>

                  <div class="input-group">
                    <label>Нууц үг</label>
                    <input type="password" placeholder="••••••••" required>
                    <div class="forgot-password">
                      <a href="#" id="forgot-password">Нууц үгээ мартсан уу?</a>
                    </div>
                  </div>

                  <button type="submit" class="primary-btn">Нэвтрэх</button>
                </form>

                <div class="switch-form">
                  Бүртгэлгүй хэрэглэгч? <a id="showSignup">Бүртгүүлэх</a>
                </div>
              </div>
              <div class="form-container hidden" id="signupForm">
                <h1>Бүртгүүлэх</h1>
                <div class="social-buttons">
                  <button class="social-btn" id="google-btn-signup">
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                    Google
                  </button>
                  <button class="social-btn" id="facebook-btn-signup">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>

                <div class="divider"><span>эсвэл</span></div>

                <form id="signup-form">
                  <div class="name-row">
                    <div class="input-group">
                      <label>Овог</label>
                      <input type="text" placeholder="Овог" required>
                    </div>
                    <div class="input-group">
                      <label>Нэр</label>
                      <input type="text" placeholder="Нэр" required>
                    </div>
                  </div>

                  <div class="input-group">
                    <label>И-мейл</label>
                    <input type="email" placeholder="example@gmail.com" required>
                  </div>

                  <div class="input-group">
                    <label>Утасны дугаар</label>
                    <input type="tel" placeholder="+976 9999 9999" required>
                  </div>

                  <div class="input-group">
                    <label>Нууц үг</label>
                    <input type="password" placeholder="••••••••" required>
                  </div>

                  <div class="input-group">
                    <label>Нууц үг баталгаажуулах</label>
                    <input type="password" placeholder="••••••••" required>
                  </div>

                  <button type="submit" class="primary-btn">Бүртгүүлэх</button>
                </form>

                <div class="switch-form">
                  Бүртгэлтэй хэрэглэгч? <a id="showLogin">Нэвтрэх</a>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h2>CINEWAVE-д тавтай морилно уу</h2>
              <p>Кино, цуврал үзэх туршлагаа илүү сайн болго. Таны дуртай контентыг танд зориулан.</p>
              <ul class="features">
                <li>Хувь хүний санал зөвлөмж — Таны амттай тохирсон контент</li>
                <li>Үзэх жагсаалт — Ирээдүйн үзэх киногоо хянах</li>
                <li>Үнэлгээ өгөх — Үзсэн контентоо үнэлээд санаж бай</li>
                <li>CINEWAVE-д хувь нэмэр оруулах — Олон сая хэрэглэгчдэд туслах мэдээлэл нэмэх</li>
                <li>Илүүд үзэх платформ — Дуртай стриминг үйлчилгээгээ тохируулах</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
        
        await initLoginPage();
    }
};

async function initializeHomePage() {
    console.log('🎬 Initializing home page...');
    initializeCarousel();
    initializeFilters();
    applyFilters();
    await setupSections();
    setupPromoButton();
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
function setupPromoButton() {
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            window.location.hash = '#/login';
        });
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
        let autoSlideInterval;

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

        function startAutoSlide() {
            // Clear any existing interval
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            
            // Set up new interval for auto-sliding every 3 seconds
            autoSlideInterval = setInterval(() => {
                if (!carouselAnimating) {
                    updateCarousel(carouselIndex + 1);
                }
            }, 3000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        // Start auto-sliding on initialization
        startAutoSlide();

        // Pause auto-sliding when hovering over the carousel
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                stopAutoSlide();
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
        }

        // Pause auto-sliding when hovering over individual cards
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("mouseenter", () => {
                stopAutoSlide();
            });
            
            card.addEventListener("mouseleave", () => {
                startAutoSlide();
            });
            
            card.addEventListener("click", () => {
                const index = Number(card.dataset.index);
                if (index !== carouselIndex) updateCarousel(index);
            });
        });

        if (leftArrow) {
            leftArrow.onclick = () => {
                stopAutoSlide();
                updateCarousel(carouselIndex - 1);
                // Restart auto-slide after manual interaction
                setTimeout(() => startAutoSlide(), 5000);
            };
        }
        
        if (rightArrow) {
            rightArrow.onclick = () => {
                stopAutoSlide();
                updateCarousel(carouselIndex + 1);
                // Restart auto-slide after manual interaction
                setTimeout(() => startAutoSlide(), 5000);
            };
        }

        document.querySelectorAll(".dot").forEach(dot => {
            dot.onclick = () => {
                stopAutoSlide();
                updateCarousel(Number(dot.dataset.index));
                // Restart auto-slide after manual interaction
                setTimeout(() => startAutoSlide(), 5000);
            };
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

// ============================================
// SEARCH PAGE FUNCTIONALITY
// ============================================

class SearchPageController {
    constructor(query) {
        this.query = query;
        this.searchResults = [];
        this.isLoading = false;
    }

    async init() {
        if (!this.query || !this.query.trim()) {
            this.showEmptyState();
            return;
        }

        await this.performSearch();
    }

    async performSearch() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            if (typeof tmdbService === 'undefined') {
                throw new Error('TMDB Service not available');
            }
            
            console.log(`🔍 Searching TMDB for: "${this.query}"`);
            const results = await tmdbService.search(this.query, 1);
            
            this.searchResults = results;
            console.log(`✅ Found ${results.length} results`);
            
            this.renderResults();
            
        } catch (error) {
            console.error('❌ Error searching:', error);
            this.showError();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    renderResults() {
        const container = document.getElementById('search-results-container');
        if (!container) return;
        
        if (this.searchResults.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 64px; color: #666; margin-bottom: 20px;"></i>
                    <h3 style="color: white; margin-bottom: 10px;">Үр дүн олдсонгүй</h3>
                    <p style="color: #999;">"${this.query}" гэсэн хайлтад тохирох кино, цуврал олдсонгүй.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.searchResults.forEach((item) => {
            const movieCard = document.createElement('movie-card');
            
            let yearOrSeason = '';
            if (item.year) {
                yearOrSeason = item.year;
                if (item.rating) yearOrSeason += ` • ${item.rating}/10`;
            } else if (item.release_date) {
                const year = item.release_date.split('-')[0];
                yearOrSeason = year;
                if (item.rating) yearOrSeason += ` • ${item.rating}/10`;
            } else if (item.first_air_date) {
                const year = item.first_air_date.split('-')[0];
                yearOrSeason = year;
                if (item.rating) yearOrSeason += ` • ${item.rating}/10`;
            }
            
            movieCard.setAttribute('name', item.name || 'Unknown');
            movieCard.setAttribute('image', item.image || '');
            movieCard.setAttribute('year-or-season', yearOrSeason);
            movieCard.setAttribute('category', item.category || item.media_type || 'movies');
            movieCard.setAttribute('rating', item.rating_value || item.rating || '0.0');
            movieCard.setAttribute('data-tmdb-id', item.tmdb_id || item.id || '');
            movieCard.setAttribute('data-media-type', item.media_type || item.category || 'movie');
            
            if (item.description) {
                movieCard.setAttribute('description', item.description);
            }
            
            container.appendChild(movieCard);
        });
    }

    showLoading() {
        const container = document.getElementById('search-results-container');
        if (container) {
            container.innerHTML = '<div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">Хайж байна...</div>';
        }
    }

    hideLoading() {
        // Loading is hidden when results are rendered
    }

    showError() {
        const container = document.getElementById('search-results-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #f44336; margin-bottom: 20px;"></i>
                    <h3 style="color: white; margin-bottom: 10px;">Алдаа гарлаа</h3>
                    <p style="color: #999;">Хайлт хийхэд алдаа гарлаа. Дахин оролдоно уу.</p>
                    <button class="retry-btn" style="margin-top: 20px; padding: 10px 20px; background: #00ffff; color: #000; border: none; border-radius: 5px; cursor: pointer;">Дахин оролдох</button>
                </div>
            `;
            
            container.querySelector('.retry-btn')?.addEventListener('click', () => {
                this.performSearch();
            });
        }
    }

    showEmptyState() {
        const container = document.getElementById('search-results-container');
        if (container) {
            container.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 64px; color: #666; margin-bottom: 20px;"></i>
                    <h3 style="color: white; margin-bottom: 10px;">Хайлтын үг оруулна уу</h3>
                    <p style="color: #999;">Дээд хэсгийн хайлтын талбар ашиглан кино, цуврал хайна уу.</p>
                </div>
            `;
        }
    }
}

let searchPageInstance = null;

async function initSearchPage(query) {
    console.log('🔍 initSearchPage called with query:', query);
    
    if (searchPageInstance) {
        searchPageInstance = null;
    }
    
    if (typeof tmdbService === 'undefined') {
        console.error('❌ TMDB Service not found!');
        const container = document.getElementById('search-results-container');
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
    
    try {
        searchPageInstance = new SearchPageController(query);
        await searchPageInstance.init();
    } catch (error) {
        console.error('❌ Error in initSearchPage:', error);
        const container = document.getElementById('search-results-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <h3 style="color: white;">Алдаа гарлаа</h3>
                    <p style="color: #999;">Хайлт хийхэд алдаа гарлаа.</p>
                </div>
            `;
        }
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
// LOGIN PAGE FUNCTIONALITY
// ============================================

function initLoginPage() {
    console.log('🔐 Initializing login page...');
    
    createParticles();
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.animation = 'formSwitchOut 0.4s ease forwards';
            
            setTimeout(() => {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                signupForm.style.animation = 'formSwitchIn 0.4s ease forwards';
            }, 400);
            
            setTimeout(() => {
                loginForm.style.animation = '';
                signupForm.style.animation = '';
            }, 800);
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.style.animation = 'formSwitchOut 0.4s ease forwards';
            
            setTimeout(() => {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                loginForm.style.animation = 'formSwitchIn 0.4s ease forwards';
            }, 400);
            
            setTimeout(() => {
                signupForm.style.animation = '';
                loginForm.style.animation = '';
            }, 800);
        });
    }
    
    const googleBtn = document.getElementById('google-btn');
    const facebookBtn = document.getElementById('facebook-btn');
    const googleBtnSignup = document.getElementById('google-btn-signup');
    const facebookBtnSignup = document.getElementById('facebook-btn-signup');
    
    if (googleBtn) googleBtn.onclick = () => handleSocialLogin('Google', googleBtn);
    if (facebookBtn) facebookBtn.onclick = () => handleSocialLogin('Facebook', facebookBtn);
    if (googleBtnSignup) googleBtnSignup.onclick = () => handleSocialLogin('Google', googleBtnSignup);
    if (facebookBtnSignup) facebookBtnSignup.onclick = () => handleSocialLogin('Facebook', facebookBtnSignup);
    
    const loginFormEl = document.getElementById('login-form');
    const signupFormEl = document.getElementById('signup-form');
    
    // In initLoginPage function, update form handlers:
        if (loginFormEl) {
            loginFormEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('.primary-btn');
                submitBtn.textContent = 'Түр хүлээнэ үү...';
                submitBtn.disabled = true;
                
                try {
                    const email = e.target.querySelector('input[type="email"]').value;
                    const password = e.target.querySelector('input[type="password"]').value;
                    
                    await authService.login(email, password);
                    showNotification('Амжилттай нэвтэрлээ!', 'success');
                    
                    // Redirect to profile
                    setTimeout(() => {
                        window.location.hash = '#/profile';
                    }, 1000);
                    
                } catch (error) {
                    showNotification(error.message, 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Нэвтрэх';
                }
            });
        }

        if (signupFormEl) {
            signupFormEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('.primary-btn');
                submitBtn.textContent = 'Түр хүлээнэ үү...';
                submitBtn.disabled = true;
                
                try {
                    const form = e.target;
                    const userData = {
                        firstName: form.querySelector('input[placeholder="Нэр"]').value,
                        lastName: form.querySelector('input[placeholder="Овог"]').value,
                        email: form.querySelector('input[type="email"]').value,
                        phone: form.querySelector('input[type="tel"]').value,
                        password: form.querySelectorAll('input[type="password"]')[0].value,
                        confirmPassword: form.querySelectorAll('input[type="password"]')[1].value
                    };
                    
                    if (userData.password !== userData.confirmPassword) {
                        throw new Error('Нууц үг таарахгүй байна');
                    }
                    
                    await authService.register(userData);
                    showNotification('Амжилттай бүртгэгдлээ!', 'success');
                    
                    // Redirect to profile
                    setTimeout(() => {
                        window.location.hash = '#/profile';
                    }, 1000);
                    
                } catch (error) {
                    showNotification(error.message, 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Бүртгүүлэх';
                }
            });
        }
    
    console.log('✅ Login page initialized');
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 2;
        const posX = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.background = i % 3 === 0 ? 
            'rgba(0, 123, 255, 0.3)' : 
            i % 3 === 1 ? 
            'rgba(0, 255, 255, 0.3)' : 
            'rgba(255, 255, 255, 0.2)';
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

function handleSocialLogin(provider, btn) {
    console.log(`${provider} sign in`);
    btn.style.transform = 'scale(0.95)';
    btn.style.background = provider === 'Google' ? 'rgba(66, 133, 244, 0.2)' : 'rgba(24, 119, 242, 0.2)';
    setTimeout(() => {
        btn.style.transform = '';
        btn.style.background = '';
        showNotification(`${provider}-ээр нэвтрэх функц удахгүй нэмэгдэнэ`, 'success');
    }, 300);
}

function handleFormSubmit(form) {
    const submitBtn = form.querySelector('.primary-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Түр хүлээнэ үү...';
    submitBtn.style.opacity = '0.8';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        showNotification('Амжилттай!', 'success');
    }, 1500);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#007bff' : '#ff4757'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease forwards;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================
// ROUTER SETUP
// ============================================

// Register all routes
router.addRoute('/', views.home);
router.addRoute('/movies', views.movies);
router.addRoute('/profile', views.profile);
router.addRoute('/customlist', views.customlist);
router.addRoute('/reviews', views.reviews);
router.addRoute('/login', views.login);
router.addRoute('/search', views.search);

// Initialize app and start router
initializeApp().then(() => {
    router.start();
});

// Handle search from navbar
document.addEventListener('search', (e) => {
    const { query } = e.detail;
    if (query && query.trim()) {
        // Navigate to search page with query parameter
        window.location.hash = `/search?q=${encodeURIComponent(query.trim())}`;
    }
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