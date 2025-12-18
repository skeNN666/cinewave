// reviews.js - Simplified version
class ReviewsManager {
    constructor() {
        this.reviewsContainer = document.getElementById('reviews-container');
        this.reviewsData = [];
        this.moviesData = [];
        this.filteredReviews = [];
        this.currentSort = 'newest';
        this.isLoading = false;
        this.init();
    }

    async init() {
        this.showLoading();
        await Promise.all([
            this.loadReviewsData(),
            this.loadMoviesData()
        ]);
        this.hideLoading();
        this.filteredReviews = [...this.reviewsData];
        this.createFilterControls();
        this.renderReviews();
        this.addEventListeners();
    }

    async loadReviewsData() {
        try {
            const response = await fetch('../data/reviews.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.reviewsData = data.reviews || [];
        } catch (error) {
            console.error('Error loading reviews data:', error);
            this.reviewsData = this.getSampleReviews();
        }
    }

    async loadMoviesData() {
        try {
            const response = await fetch('../data/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.moviesData = data.movies || [];
        } catch (error) {
            console.error('Error loading movies data:', error);
            const movieNames = [...new Set(this.reviewsData.map(review => review.movie))];
            this.moviesData = movieNames.map(name => ({ name }));
        }
    }

    getSampleReviews() {
        return [
            {
                "id": 1,
                "reviewer": "Батаа",
                "rating": 5,
                "content": "Гайхалтай кино! Надад таалагдсан хамгийн шилдэг кинонуудын нэг.",
                "movie": "The Conjuring: Last Rites",
                "timestamp": "2024-01-15 14:30:00",
                "avatar": "https://ui-avatars.com/api/?name=Батаа&background=FF6B6B&color=fff",
                "verified": true
            },
            {
                "id": 2,
                "reviewer": "Сараа",
                "rating": 4.5,
                "content": "Сонирхолтой сюжет, сайхан дүрүүд.",
                "movie": "Mission Impossible: The Final Reckoning",
                "timestamp": "2024-01-10 09:15:00",
                "avatar": "https://ui-avatars.com/api/?name=Сараа&background=4ECDC4&color=fff",
                "verified": true
            }
        ];
    }

    showLoading() {
        this.reviewsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Сэтгэгдлүүдийг ачаалж байна...</p>
            </div>
        `;
    }

    hideLoading() {
        const loadingContainer = this.reviewsContainer.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }

    createFilterControls() {
        const controlsHTML = `
            <div class="reviews-controls">
                <div class="search-section">
                    <div class="search-container">
                        <i class="fas fa-search"></i>
                        <input type="text" id="movie-search" class="movie-search" 
                               placeholder="Киноны нэрээр хайх..." autocomplete="off">
                        <div class="search-results" id="search-results"></div>
                    </div>
                    
                    <div class="sort-container">
                        <label for="sort-select">Эрэмбэлэх:</label>
                        <select id="sort-select" class="sort-select">
                            <option value="newest">Шинээр нь</option>
                            <option value="oldest">Хуучин нь</option>
                            <option value="highest">Дээд үнэлгээ</option>
                            <option value="lowest">Доод үнэлгээ</option>
                        </select>
                    </div>
                </div>
                
                <div class="stats-section">
                    <div class="stat-item">
                        <i class="fas fa-star"></i>
                        <span>Дундаж үнэлгээ: ${this.calculateAverageRating()}/5</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-comments"></i>
                        <span>Нийт сэтгэгдэл: ${this.reviewsData.length}</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-film"></i>
                        <span>Киноны тоо: ${this.getUniqueMovieCount()}</span>
                    </div>
                </div>
                
                <div class="active-filters" id="active-filters"></div>
            </div>
        `;

        this.reviewsContainer.insertAdjacentHTML('afterbegin', controlsHTML);
        this.addControlsStyles();
    }

    getUniqueMovieCount() {
        const movies = [...new Set(this.reviewsData.map(review => review.movie))];
        return movies.length;
    }

    calculateAverageRating() {
        if (this.reviewsData.length === 0) return '0.0';
        const total = this.reviewsData.reduce((sum, review) => sum + review.rating, 0);
        return (total / this.reviewsData.length).toFixed(1);
    }

    sortReviews(sortBy) {
        switch(sortBy) {
            case 'newest':
                return this.filteredReviews.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
            case 'oldest':
                return this.filteredReviews.sort((a, b) => 
                    new Date(a.timestamp) - new Date(b.timestamp)
                );
            case 'highest':
                return this.filteredReviews.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return this.filteredReviews.sort((a, b) => a.rating - b.rating);
            default:
                return this.filteredReviews;
        }
    }

    searchMovies(query) {
        if (!query.trim()) {
            return this.moviesData.slice(0, 10);
        }
        
        const lowerQuery = query.toLowerCase();
        return this.moviesData
            .filter(movie => 
                movie.name.toLowerCase().includes(lowerQuery) ||
                (movie.genre && movie.genre.some(g => g.toLowerCase().includes(lowerQuery)))
            )
            .slice(0, 10);
    }

    filterReviews() {
        const searchInput = document.getElementById('movie-search');
        const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const sortSelect = document.getElementById('sort-select');
        const sortBy = sortSelect ? sortSelect.value : 'newest';

        this.filteredReviews = [...this.reviewsData];

        if (searchQuery) {
            this.filteredReviews = this.filteredReviews.filter(
                review => review.movie.toLowerCase().includes(searchQuery)
            );
            
            this.updateActiveFilters(searchQuery);
        } else {
            this.updateActiveFilters('');
        }

        this.sortReviews(sortBy);
        this.updateStats();
        this.renderReviewCards();
    }

    updateActiveFilters(searchQuery) {
        const activeFilters = document.getElementById('active-filters');
        
        if (!searchQuery) {
            activeFilters.innerHTML = '';
            return;
        }
        
        activeFilters.innerHTML = `
            <div class="active-filter">
                <span>Хайлт: "${searchQuery}"</span>
                <button class="clear-filter" id="clear-search">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    updateStats() {
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const avgRating = this.filteredReviews.length > 0 ? 
                (this.filteredReviews.reduce((sum, r) => sum + r.rating, 0) / this.filteredReviews.length).toFixed(1) : 
                '0.0';
            
            const uniqueMovies = [...new Set(this.filteredReviews.map(r => r.movie))].length;
            
            statsSection.innerHTML = `
                <div class="stat-item">
                    <i class="fas fa-star"></i>
                    <span>Дундаж үнэлгээ: ${avgRating}/5</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-comments"></i>
                    <span>Харагдаж буй: ${this.filteredReviews.length}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-film"></i>
                    <span>Киноны тоо: ${uniqueMovies}</span>
                </div>
            `;
        }
    }

    renderReviews() {
        this.sortReviews(this.currentSort);
        this.renderReviewCards();
    }

    renderReviewCards() {
        let reviewsListContainer = document.querySelector('.reviews-list');
        
        if (!reviewsListContainer) {
            const listHTML = `<div class="reviews-list"></div>`;
            const controls = document.querySelector('.reviews-controls');
            if (controls) {
                controls.insertAdjacentHTML('afterend', listHTML);
            } else {
                this.reviewsContainer.innerHTML = listHTML;
            }
            reviewsListContainer = document.querySelector('.reviews-list');
        }

        reviewsListContainer.innerHTML = '';

        if (this.filteredReviews.length === 0) {
            const searchInput = document.getElementById('movie-search');
            const searchQuery = searchInput ? searchInput.value : '';
            
            reviewsListContainer.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-search"></i>
                    <h3>Сэтгэгдэл олдсонгүй</h3>
                    <p>"${searchQuery}" кинонд тохирох сэтгэгдэл олдсонгүй.</p>
                    <button class="clear-search-btn" id="clear-all-filters">Бүх шүүлтүүрийг арилгах</button>
                </div>
            `;
            return;
        }

        this.filteredReviews.forEach(review => {
            const reviewCard = document.createElement('review-card');
            
            reviewCard.setAttribute('reviewer', review.reviewer);
            reviewCard.setAttribute('rating', review.rating);
            reviewCard.setAttribute('content', review.content);
            reviewCard.setAttribute('movie', review.movie);
            reviewCard.setAttribute('timestamp', review.timestamp);
            reviewCard.setAttribute('avatar', review.avatar || '');
            reviewCard.setAttribute('verified', review.verified || false);
            
            reviewsListContainer.appendChild(reviewCard);
        });
    }

    addEventListeners() {
        const searchInput = document.getElementById('movie-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                this.showSearchResults(query);
                this.filterReviews();
            });
            
            searchInput.addEventListener('focus', () => {
                const query = searchInput.value;
                if (query) {
                    this.showSearchResults(query);
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    this.hideSearchResults();
                }
            });
        }

        document.addEventListener('change', (e) => {
            if (e.target.matches('.sort-select')) {
                this.filterReviews();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('#clear-search') || e.target.closest('#clear-search')) {
                this.clearSearch();
            }
            
            if (e.target.matches('#clear-all-filters')) {
                this.clearAllFilters();
            }
        });

        document.addEventListener('review-liked', (e) => {
            this.showNotification(`Та "${e.detail.reviewer}"-н сэтгэгдлийг дуртай гэж тэмдэглэлээ!`);
        });

        document.addEventListener('review-reply', (e) => {
            this.showNotification(`Та "${e.detail.reviewer}"-н сэтгэгдэлд хариулах болно.`);
        });

        document.addEventListener('review-share', (e) => {
            if (navigator.share) {
                navigator.share({
                    title: `${e.detail.movie} - Сэтгэгдэл`,
                    text: `${e.detail.reviewer}-н сэтгэгдлийг үзээрэй: ${e.detail.movie}`,
                    url: window.location.href
                });
            } else {
                this.showNotification(`"${e.detail.movie}" киноны сэтгэгдлийг хуваалцах холбоосыг хууллаа.`);
                navigator.clipboard.writeText(window.location.href);
            }
        });
    }

    showSearchResults(query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        const results = this.searchMovies(query);
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item no-results">Кино олдсонгүй</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        resultsContainer.innerHTML = results.map(movie => `
            <div class="search-result-item" data-movie="${movie.name}">
                <i class="fas fa-film"></i>
                <div>
                    <div class="movie-name">${movie.name}</div>
                    <div class="movie-details">
                        ${movie.yearOrSeason ? movie.yearOrSeason.split('•')[0].trim() : ''}
                        ${movie.genre ? '• ' + movie.genre.slice(0, 2).join(', ') : ''}
                    </div>
                </div>
            </div>
        `).join('');

        resultsContainer.style.display = 'block';

        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const movieName = item.dataset.movie;
                const searchInput = document.getElementById('movie-search');
                if (searchInput) {
                    searchInput.value = movieName;
                    this.hideSearchResults();
                    this.filterReviews();
                }
            });
        });
    }

    hideSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('movie-search');
        if (searchInput) {
            searchInput.value = '';
            this.filterReviews();
            this.hideSearchResults();
        }
    }

    clearAllFilters() {
        const searchInput = document.getElementById('movie-search');
        const sortSelect = document.getElementById('sort-select');
        
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'newest';
        
        this.filterReviews();
        this.hideSearchResults();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'review-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .review-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #2a2a2a;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                    border-left: 4px solid #e50914;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                
                .review-notification i {
                    color: #4CAF50;
                    font-size: 1.2rem;
                }
                
                .loading-container {
                    text-align: center;
                    padding: 60px 20px;
                    color: #888;
                }
                
                .loading-spinner {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    color: #e50914;
                }
                
                .loading-spinner .fa-spinner {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    addControlsStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .reviews-controls {
                background: #2a2a2a;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 30px;
                border: 1px solid #444;
            }
            
            .search-section {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .search-container {
                flex: 1;
                min-width: 300px;
                position: relative;
            }
            
            .movie-search {
                width: 90%;
                padding: 12px 20px 12px 45px;
                border-radius: 8px;
                border: 2px solid #444;
                background: #1a1a1a;
                color: #fff;
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                transition: border-color 0.3s;
            }
            
            .movie-search:focus {
                outline: none;
                border-color: #e50914;
            }
            
            .search-container .fa-search {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #888;
                font-size: 1.1rem;
            }
            
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #1a1a1a;
                border: 2px solid #444;
                border-top: none;
                border-radius: 0 0 8px 8px;
                max-height: 300px;
                overflow-y: auto;
                display: none;
                z-index: 100;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .search-result-item {
                padding: 12px 15px;
                color: #ccc;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s;
            }
            
            .search-result-item:hover {
                background: #2a2a2a;
            }
            
            .search-result-item .fa-film {
                color: #e50914;
                font-size: 0.9rem;
            }
            
            .movie-name {
                font-weight: 600;
                color: #fff;
                margin-bottom: 4px;
            }
            
            .movie-details {
                font-size: 0.85rem;
                color: #888;
            }
            
            .no-results {
                color: #888;
                text-align: center;
                padding: 20px;
            }
            
            .sort-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .sort-container label {
                color: #fff;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .sort-select {
                padding: 10px 16px;
                border-radius: 8px;
                border: 2px solid #444;
                background: #1a1a1a;
                color: #fff;
                font-family: 'Nunito', sans-serif;
                min-width: 180px;
                cursor: pointer;
                transition: border-color 0.3s;
            }
            
            .sort-select:hover {
                border-color: #e50914;
            }
            
            .stats-section {
                display: flex;
                flex-wrap: wrap;
                gap: 30px;
                padding: 20px 0;
                border-top: 1px solid #444;
                border-bottom: 1px solid #444;
                margin-bottom: 20px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #fff;
                font-size: 1rem;
            }
            
            .stat-item i {
                color: #e50914;
                font-size: 1.2rem;
            }
            
            .active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                min-height: 40px;
            }
            
            .active-filter {
                background: #e50914;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9rem;
            }
            
            .clear-filter {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                font-size: 0.8rem;
            }
            
            .clear-filter:hover {
                color: #ffcccb;
            }
            
            .clear-search-btn {
                margin-top: 15px;
                padding: 8px 20px;
                background: #e50914;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Nunito', sans-serif;
                font-size: 0.9rem;
                transition: background 0.3s;
            }
            
            .clear-search-btn:hover {
                background: #f40612;
            }
            
            .reviews-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 25px;
                margin-top: 20px;
            }
            
            .no-reviews {
                text-align: center;
                padding: 60px 20px;
                grid-column: 1 / -1;
                color: #888;
            }
            
            .no-reviews i {
                font-size: 4rem;
                margin-bottom: 20px;
                color: #444;
            }
            
            .no-reviews h3 {
                color: #fff;
                margin-bottom: 10px;
            }
            
            @media (max-width: 768px) {
                .search-section {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .search-container {
                    min-width: 100%;
                }
                
                .sort-container {
                    width: 100%;
                    justify-content: space-between;
                }
                
                .reviews-list {
                    grid-template-columns: 1fr;
                }
                
                .stats-section {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReviewsManager();
});