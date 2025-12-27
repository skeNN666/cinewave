import { tmdbService } from './tmdb-service.js';

class MoviesPage {
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
        this.init();
    }

    async init() {
        console.log('🎬 Movies page initializing...');
        
        // Initialize genres
        await this.fetchGenres();
        this.renderGenreFilters();
        
        // Load initial data
        await this.loadMovies();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup infinite scroll
        this.setupInfiniteScroll();
        
        console.log('✅ Movies page initialized');
    }

    async fetchGenres() {
        try {
            console.log('📚 Fetching genres...');
            
            // Fetch movie genres
            const movieGenres = await tmdbService.fetchFromTMDB('/genre/movie/list');
            this.genres.movies = movieGenres.genres || [];
            
            // Fetch TV genres
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
                { id: 99, name: 'Documentary' },
                { id: 18, name: 'Drama' },
                { id: 10751, name: 'Family' },
                { id: 14, name: 'Fantasy' },
                { id: 36, name: 'History' },
                { id: 27, name: 'Horror' },
                { id: 10402, name: 'Music' },
                { id: 9648, name: 'Mystery' },
                { id: 10749, name: 'Romance' },
                { id: 878, name: 'Science Fiction' },
                { id: 10770, name: 'TV Movie' },
                { id: 53, name: 'Thriller' },
                { id: 10752, name: 'War' },
                { id: 37, name: 'Western' }
            ];
            
            this.genres.tv = [
                { id: 10759, name: 'Action & Adventure' },
                { id: 16, name: 'Animation' },
                { id: 35, name: 'Comedy' },
                { id: 80, name: 'Crime' },
                { id: 99, name: 'Documentary' },
                { id: 18, name: 'Drama' },
                { id: 10751, name: 'Family' },
                { id: 10762, name: 'Kids' },
                { id: 9648, name: 'Mystery' },
                { id: 10763, name: 'News' },
                { id: 10764, name: 'Reality' },
                { id: 10765, name: 'Sci-Fi & Fantasy' },
                { id: 10766, name: 'Soap' },
                { id: 10767, name: 'Talk' },
                { id: 10768, name: 'War & Politics' },
                { id: 37, name: 'Western' }
            ];
            
            console.log(`⚠️ Using fallback genres: ${this.genres.movies.length} movie, ${this.genres.tv.length} TV`);
        }
    }

    renderGenreFilters() {
        const genreContainer = document.querySelector('.genre-filters');
        if (!genreContainer) {
            console.error('❌ Genre filters container not found');
            return;
        }
        
        genreContainer.innerHTML = '';
        
        // Create "All Genres" button
        const allGenresBtn = document.createElement('button');
        allGenresBtn.className = 'genre-btn active';
        allGenresBtn.textContent = 'Бүх төрөл';
        allGenresBtn.dataset.genre = 'all';
        genreContainer.appendChild(allGenresBtn);
        
        // Show movie genres by default
        this.renderCurrentCategoryGenres();
    }

    renderCurrentCategoryGenres() {
        const genreContainer = document.querySelector('.genre-filters');
        if (!genreContainer) return;
        
        // Remove existing genre buttons (except "All Genres")
        const existingGenreBtns = genreContainer.querySelectorAll('.genre-btn:not([data-genre="all"])');
        existingGenreBtns.forEach(btn => btn.remove());
        
        // Get genres for current category
        const currentGenres = this.currentCategory === 'tv' ? this.genres.tv : this.genres.movies;
        
        // Create genre buttons
        currentGenres.forEach(genre => {
            const genreBtn = document.createElement('button');
            genreBtn.className = 'genre-btn';
            genreBtn.textContent = this.translateGenre(genre.name);
            genreBtn.dataset.genre = genre.id;
            genreBtn.title = this.translateGenre(genre.name);
            genreContainer.appendChild(genreBtn);
        });
        
        console.log(`📋 Rendered ${currentGenres.length} genre buttons for ${this.currentCategory}`);
    }

    translateGenre(genreName) {
        const genreTranslations = {
            // Movie genres
            'Action': 'Экшн',
            'Adventure': 'Адал явдалт',
            'Animation': 'Анимейшн',
            'Comedy': 'Инээдмийн',
            'Crime': 'Гэмт хэрэг',
            'Documentary': 'Баримтат',
            'Drama': 'Драма',
            'Family': 'Гэр бүл',
            'Fantasy': 'Фэнтези',
            'History': 'Түүхэн',
            'Horror': 'Аймшгийн',
            'Music': 'Хөгжмийн',
            'Mystery': 'Нууцлаг',
            'Romance': 'Урлаг',
            'Science Fiction': 'Шинжлэх ухааны уран зөгнөлт',
            'Thriller': 'Сэтгэл хөдөлгөм',
            'War': 'Дайны',
            'Western': 'Барууны',
            'TV Movie': 'ТВ кино',
            
            // TV genres
            'Action & Adventure': 'Экшн ба адал явдалт',
            'Kids': 'Хүүхэд',
            'News': 'Мэдээ',
            'Reality': 'Реалити',
            'Sci-Fi & Fantasy': 'Шинжлэх ухаан ба фэнтези',
            'Soap': 'Сооп',
            'Talk': 'Яриа',
            'War & Politics': 'Дайн ба улс төр'
        };
        
        return genreTranslations[genreName] || genreName;
    }

    async loadMovies() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        console.log(`🎬 Loading ${this.currentCategory} page ${this.currentPage}...`);
        
        try {
            let data = [];
            
            // Load data based on category
            if (this.currentCategory === 'all') {
                // For "All", load 50% movies, 50% TV shows
                const [movies, tvShows] = await Promise.all([
                    tmdbService.getNowPlayingMovies(this.currentPage),
                    tmdbService.getAiringTodayTV(this.currentPage)
                ]);
                
                console.log(`📊 Loaded ${movies.length} movies, ${tvShows.length} TV shows`);
                
                // Interleave movies and TV shows for better mix
                const maxLength = Math.max(movies.length, tvShows.length);
                data = [];
                for (let i = 0; i < maxLength; i++) {
                    if (i < movies.length) data.push(movies[i]);
                    if (i < tvShows.length) data.push(tvShows[i]);
                }
                
            } else if (this.currentCategory === 'movies') {
                data = await tmdbService.getNowPlayingMovies(this.currentPage);
                console.log(`🎥 Loaded ${data.length} movies`);
                
            } else if (this.currentCategory === 'tv') {
                data = await tmdbService.getAiringTodayTV(this.currentPage);
                console.log(`📺 Loaded ${data.length} TV shows`);
            }
            
            // Apply genre filter if not "all"
            if (this.currentGenre !== 'all') {
                const genreId = parseInt(this.currentGenre);
                data = data.filter(item => 
                    item.genre_ids && item.genre_ids.includes(genreId)
                );
                console.log(`🔍 Filtered to ${data.length} items with genre ${this.currentGenre}`);
            }
            
            // Remove duplicates by ID
            const uniqueIds = new Set();
            data = data.filter(item => {
                if (uniqueIds.has(item.id)) return false;
                uniqueIds.add(item.id);
                return true;
            });
            
            // If first page, replace content
            if (this.currentPage === 1) {
                this.allMovies = data;
            } else {
                // Append new data
                this.allMovies = [...this.allMovies, ...data];
            }
            
            console.log(`✅ Total movies loaded: ${this.allMovies.length}`);
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
        if (!container) {
            console.error('❌ Movies container not found');
            return;
        }
        
        // Clear container if first page
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
            
            // Add retry button listener
            container.querySelector('.retry-btn')?.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadMovies();
            });
            
            return;
        }
        
        // Create movie cards
        this.allMovies.forEach((movie, index) => {
            const movieCard = document.createElement('movie-card');
            
            // Calculate yearOrSeason string
            let yearOrSeason = '';
            if (movie.year) {
                yearOrSeason = movie.year;
                if (movie.rating) {
                    yearOrSeason += ` • ${movie.rating}/10`;
                }
            } else if (movie.release_date) {
                const year = movie.release_date.split('-')[0];
                yearOrSeason = year;
                if (movie.rating) {
                    yearOrSeason += ` • ${movie.rating}/10`;
                }
            }
            
            // Set attributes for movie-card component
            movieCard.setAttribute('name', movie.name || movie.title || 'Unknown');
            movieCard.setAttribute('image', movie.image || movie.poster_path || '');
            movieCard.setAttribute('year-or-season', yearOrSeason);
            movieCard.setAttribute('category', movie.category || movie.media_type || 'movies');
            movieCard.setAttribute('rating', movie.rating_value || movie.vote_average || '0.0');
            movieCard.setAttribute('data-tmdb-id', movie.tmdb_id || movie.id || index);
            movieCard.setAttribute('data-media-type', movie.media_type || movie.category || 'movie');
            
            // Set description if available
            if (movie.description || movie.overview) {
                movieCard.setAttribute('description', movie.description || movie.overview || '');
            }
            
            // Set genres
            const genres = this.getGenreNames(movie.genre_ids, movie.category || movie.media_type);
            if (genres.length > 0) {
                movieCard.setAttribute('genre', JSON.stringify(genres));
            }
            
            // Add lazy loading
            if (index > 20) {
                movieCard.querySelector('img')?.setAttribute('loading', 'lazy');
            }
            
            container.appendChild(movieCard);
        });
        
        console.log(`✅ Rendered ${this.allMovies.length} movie cards`);
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
            .slice(0, 3); // Limit to 3 genres
    }

    setupEventListeners() {
        // Category filter buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        if (categoryButtons.length === 0) {
            console.error('❌ Category buttons not found');
            return;
        }
        
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.changeCategory(category);
            });
        });
        
        // Genre filter buttons (using event delegation)
        const genreContainer = document.querySelector('.genre-filters');
        if (genreContainer) {
            genreContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('genre-btn')) {
                    const genre = e.target.dataset.genre;
                    this.changeGenre(genre);
                }
            });
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+1 for All
            if (e.ctrlKey && e.key === '1') {
                e.preventDefault();
                this.changeCategory('all');
            }
            // Ctrl+2 for Movies
            else if (e.ctrlKey && e.key === '2') {
                e.preventDefault();
                this.changeCategory('movies');
            }
            // Ctrl+3 for TV
            else if (e.ctrlKey && e.key === '3') {
                e.preventDefault();
                this.changeCategory('tv');
            }
        });
    }

    changeCategory(category) {
        if (this.currentCategory === category) return;
        
        console.log(`🔄 Changing category to: ${category}`);
        
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        // Update current category
        this.currentCategory = category;
        
        // Update genre filters
        this.renderCurrentCategoryGenres();
        
        // Reset filters and reload
        this.currentGenre = 'all';
        this.currentPage = 1;
        
        // Update "All Genres" button to active
        const allGenresBtn = document.querySelector('.genre-btn[data-genre="all"]');
        if (allGenresBtn) {
            document.querySelectorAll('.genre-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            allGenresBtn.classList.add('active');
        }
        
        // Show loading state
        this.allMovies = [];
        this.loadMovies();
    }

    changeGenre(genre) {
        if (this.currentGenre === genre) return;
        
        console.log(`🔄 Changing genre to: ${genre}`);
        
        // Update active genre button
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.genre === genre);
        });
        
        // Reset and reload
        this.currentGenre = genre;
        this.currentPage = 1;
        this.allMovies = [];
        this.loadMovies();
    }

    setupInfiniteScroll() {
        let throttleTimeout;
        
        window.addEventListener('scroll', () => {
            // Throttle scroll events
            if (throttleTimeout) return;
            
            throttleTimeout = setTimeout(() => {
                const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
                
                // Load more when 100px from bottom and not loading
                if (scrollTop + clientHeight >= scrollHeight - 100 && 
                    !this.isLoading && 
                    this.currentPage < 10) { // Limit to 10 pages
                    
                    this.currentPage++;
                    console.log(`📄 Loading page ${this.currentPage}...`);
                    this.loadMovies();
                }
                
                throttleTimeout = null;
            }, 200);
        });
    }

    showLoading() {
        // Remove existing loader if any
        this.hideLoading();
        
        const container = document.getElementById('movies-container');
        if (!container) return;
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>Кинонуудыг дуудаж байна...</p>
        `;
        
        // Add to container if it exists
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
        
        // Add retry button listener
        container.querySelector('.retry-btn')?.addEventListener('click', () => {
            this.currentPage = 1;
            this.loadMovies();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting MoviesPage...');
    
    // Check if TMDB service is available
    if (typeof tmdbService === 'undefined') {
        console.error('❌ TMDB Service is not defined. Check the import path.');
        alert('TMDB Service алдаа. Консолыг шалгана уу.');
        return;
    }
    
    new MoviesPage();
});

// Export for debugging
window.MoviesPage = MoviesPage;