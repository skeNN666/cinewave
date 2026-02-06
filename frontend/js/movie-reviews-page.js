class MovieReviewsPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.movieId = null;
        this.category = null;
        this.movieData = null;
    }

    static get observedAttributes() {
        return ['movie-id', 'category'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'movie-id') {
                this.movieId = newValue;
            } else if (name === 'category') {
                this.category = newValue;
            }
            if (this.movieId && this.category) {
                console.log('🔄 MovieReviewsPage attributes changed:', { movieId: this.movieId, category: this.category });
                this.render();
                setTimeout(() => {
                    this.loadReviews(); 
                    this.loadMovieInfo();
                }, 100);
            }
        }
    }

    connectedCallback() {
        this.render();
        const movieId = this.getAttribute('movie-id') || this.movieId;
        const category = this.getAttribute('category') || this.category;
        
        console.log('🎬 MovieReviewsPage connectedCallback:', { movieId, category });
        
        if (movieId && category) {
            this.movieId = movieId;
            this.category = category;
            setTimeout(() => {
                this.loadReviews(); 
                this.loadMovieInfo();
            }, 100);
        } else {
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .reviews-page-container {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
                    color: #fff;
                    padding: 120px 20px 40px;
                }

                .page-header {
                    max-width: 1400px;
                    margin: 0 auto 40px;
                }

                .back-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 30px;
                    text-decoration: none;
                }

                .back-button:hover {
                    background: rgba(77, 163, 255, 0.3);
                    border-color: #4da3ff;
                    transform: translateX(-5px);
                }

                .back-button i {
                    font-size: 1.1rem;
                }

                .movie-info {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }

                .movie-poster {
                    width: 150px;
                    height: 225px;
                    border-radius: 12px;
                    object-fit: cover;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }

                .movie-details {
                    flex: 1;
                    min-width: 250px;
                }

                .movie-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-bottom: 10px;
                    color: #fff;
                }

                .movie-meta {
                    color: #999;
                    font-size: 1.1rem;
                    margin-bottom: 20px;
                }

                .reviews-count {
                    background: rgba(77, 163, 255, 0.2);
                    border: 1px solid rgba(77, 163, 255, 0.4);
                    color: #4da3ff;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    display: inline-block;
                }

                .content-wrapper {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .section-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #4da3ff;
                }

                .section-title i {
                    font-size: 1.8rem;
                }

                .reviews-list {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .no-reviews {
                    text-align: center;
                    padding: 80px 20px;
                    color: #999;
                    font-size: 1.2rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .no-reviews i {
                    font-size: 4rem;
                    color: #666;
                    margin-bottom: 20px;
                    display: block;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    color: #ccc;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(77, 163, 255, 0.3);
                    border-top-color: #4da3ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .reviews-page-container {
                        padding: 100px 15px 30px;
                    }

                    .movie-title {
                        font-size: 1.8rem;
                    }

                    .movie-poster {
                        width: 120px;
                        height: 180px;
                    }

                    .movie-info {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .section-title {
                        font-size: 1.5rem;
                    }
                }
            </style>

            <div class="reviews-page-container">
                <div class="page-header">
                    <button class="back-button" id="back-btn">
                        <i class="fas fa-arrow-left"></i>
                        <span>Буцах</span>
                    </button>
                    
                    <div class="movie-info" id="movie-info" style="display: none;">
                        <img class="movie-poster" id="movie-poster" src="" alt="">
                        <div class="movie-details">
                            <h1 class="movie-title" id="movie-title">Киноны нэр</h1>
                            <div class="movie-meta" id="movie-meta"></div>
                            <div class="reviews-count" id="reviews-count">0 сэтгэгдэл</div>
                        </div>
                    </div>
                </div>

                <div class="content-wrapper">
                    <div class="loading-container" id="loading">
                        <div class="loading-spinner"></div>
                        <p>Ачааллаж байна...</p>
                    </div>

                    <div id="content" style="display: none;">
                        <h2 class="section-title">
                            <i class="fas fa-comments"></i>
                            Бүх сэтгэгдэл
                        </h2>
                        <div class="reviews-list" id="reviews-list"></div>
                    </div>
                </div>
            </div>
        `;

        const backBtn = this.shadowRoot.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }
    }

    async loadMovieInfo() {
        const shadow = this.shadowRoot;
        const movieInfo = shadow.getElementById('movie-info');
        const moviePoster = shadow.getElementById('movie-poster');
        const movieTitle = shadow.getElementById('movie-title');
        const movieMeta = shadow.getElementById('movie-meta');

        if (!movieInfo || !moviePoster || !movieTitle || !movieMeta) return;

        try {
            const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
            
            if (!service) {
                movieInfo.style.display = 'flex';
                movieTitle.textContent = 'Киноны нэр';
                return;
            }

            const details = this.category === 'movies' 
                ? await service.getMovieDetails(this.movieId)
                : await service.getTVDetails(this.movieId);

            if (details) {
                this.movieData = details;
                movieInfo.style.display = 'flex';
                moviePoster.src = details.image || details.poster_path || '';
                moviePoster.alt = details.name || 'Movie Poster';
                movieTitle.textContent = details.name || 'Киноны нэр';
                
                const metaParts = [];
                if (details.year) metaParts.push(details.year);
                if (details.rating) metaParts.push(`⭐ ${parseFloat(details.rating).toFixed(1)}`);
                movieMeta.textContent = metaParts.join(' • ');
            }
        } catch (error) {
            console.error('Error loading movie info:', error);
            movieInfo.style.display = 'flex';
        }
    }

    async loadReviews() {
        const shadow = this.shadowRoot;
        const loading = shadow.getElementById('loading');
        const content = shadow.getElementById('content');
        const reviewsList = shadow.getElementById('reviews-list');
        const reviewsCount = shadow.getElementById('reviews-count');

        if (!reviewsList || !loading || !content) {
            console.error('❌ Missing DOM elements in reviews page');
            return;
        }

        const movieId = this.movieId;
        const category = this.category;
        
        if (!movieId || !category) {
            console.error('❌ Missing movieId or category:', { movieId, category });
            loading.style.display = 'none';
            content.style.display = 'block';
            reviewsList.innerHTML = '<div class="no-reviews"><h3>Алдаа: Киноны мэдээлэл дутуу байна</h3></div>';
            return;
        }
        
        try {
            const { authService } = await import('./auth-service.js');
            let reviews = [];
            
            console.log(`📖 Loading reviews for movieId: ${movieId}, category: ${category}`);
            
            try {
                reviews = await authService.getMovieReviews(movieId, category);
                console.log(`✅ Loaded ${reviews.length} reviews from backend:`, reviews);
            } catch (error) {
                const storageKey = `reviews_${category}_${movieId}`;
                const storedReviews = localStorage.getItem(storageKey);
                reviews = storedReviews ? JSON.parse(storedReviews) : [];
                console.log(`📦 Loaded ${reviews.length} reviews from localStorage`);
            }
            
            loading.style.display = 'none';
            content.style.display = 'block';
            
            if (!reviews || reviews.length === 0) {
                console.log('⚠️ No reviews found for this movie');
                reviewsList.innerHTML = `
                    <div class="no-reviews">
                        <i class="fas fa-comments"></i>
                        <h3>Одоогоор сэтгэгдэл байхгүй байна</h3>
                        <p>Анхны сэтгэгдэл үлдээнэ үү!</p>
                    </div>
                `;
                if (reviewsCount) {
                    reviewsCount.textContent = '0 сэтгэгдэл';
                }
                return;
            }

            if (reviewsCount) {
                reviewsCount.textContent = `${reviews.length} сэтгэгдэл`;
            }

            console.log('🎨 Rendering reviews:', reviews);
            reviewsList.innerHTML = reviews.map(review => {
                const userData = JSON.parse(localStorage.getItem('cinewave_user') || '{}');
                const currentUserId = userData.id || userData._id || userData.email;
                const reviewUserId = review.userId?.toString() || review.userId;
                const isCurrentUser = reviewUserId === currentUserId?.toString();
                const isAdmin = review.isAdmin || false;
                
                return `
                    <review-card
                        username="${this.escapeHtmlAttribute(review.username || 'Хэрэглэгч')}"
                        rating="${review.rating || 0}"
                        text="${this.escapeHtmlAttribute(review.text || '')}"
                        date="${review.date || review.createdAt || new Date().toISOString()}"
                        avatar="${review.avatar || ''}"
                        is-admin="${isAdmin}"
                        user-id="${this.escapeHtmlAttribute(reviewUserId || '')}">
                    </review-card>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading reviews:', error);
            loading.style.display = 'none';
            content.style.display = 'block';
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Сэтгэгдэл ачаалахад алдаа гарлаа</h3>
                    <p>${error.message || ''}</p>
                </div>
            `;
        }
    }

    escapeHtmlAttribute(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}

customElements.define('movie-reviews-page', MovieReviewsPage);