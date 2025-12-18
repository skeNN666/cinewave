// movie-card-component.js (UPDATED - Dynamic reviews from JSON)
class MovieCard extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        this.movieData = null;
        
        this.shadowRoot.innerHTML = `
    <style>
        .movie-card {
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-align: center;
            height: 400px;
            width: 100%;
            display: block;
            position: relative;
        }

        :host(.poster-mode) .movie-card {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 15px !important;
            height: 500px !important;
            width: 100% !important;
        }

        :host(.poster-mode) .title-container,
        :host(.poster-mode) .neg-yum {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        :host(.poster-mode) .movie-card img {
            border-radius: 15px !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5) !important;
            height: 90% !important;
            width: 100% !important;
            object-fit: cover !important;
            position: relative !important;
            top: auto !important;
            left: auto !important;
        }

        .movie-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .movie-card img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
        }

        .title-container {
            height: 35px;
            display: block;
            position: absolute;
            top: 305px;
            left: 0;
            right: 0;
            padding: 1rem 1rem;
            overflow: hidden;
        }

        .movie-card h3 {
            font-size: 1rem;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            width: 100%;
            line-height: 1.2;
            padding: 0;
            display: block;
        }

        .neg-yum {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: black;
            padding: 1rem;
            height: 30px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .genre-year {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }

        .type {
            font-weight: bold;
            flex-shrink: 0;
            margin-left: 10px;
        }
        
        /* Modal styles */
        .movie-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background-color: #000;
            border-radius: 15px;
            width: 95%;
            max-width: 1100px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            padding: 20px;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #333;
            position: sticky;
            top: 0;
            background: #000;
            z-index: 10;
        }
        
        .modal-title {
            font-size: 1.8rem;
            margin: 0;
            color: #fff;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #fff;
            line-height: 1;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .close-modal:hover {
            color: #ccc;
        }
        
        .modal-body {
            display: grid;
            grid-template-columns: 1.2fr 1.8fr 1fr;
            gap: 30px;
        }
        
        /* Column 1: Poster & Trailer Button */
        .poster-column {
            display: flex;
            flex-direction: column;
            gap: 15px;
            position: sticky;
            top: 80px;
            align-self: start;
            height: fit-content;
        }
        
        .modal-poster {
            width: 100%;
            border-radius: 10px;
            object-fit: cover;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .trailer-btn {
            background: #1e1e1e;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .trailer-btn:hover {
            background: #2e2e2e;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(194, 27, 227, 0.4);
        }

        /* User Actions */
        .user-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .action-btn {
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .watchlist-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .watchlist-btn:hover, .watchlist-btn.active {
            background: #4da3ff;
            transform: translateY(-2px);
        }
        
        .watched-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .watched-btn:hover, .watched-btn.active {
            background: #00cc66;
            transform: translateY(-2px);
        }
        
        /* Column 2: Movie Info */
        .info-column {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .movie-info-section {
            background: #1a1a1a;
            border-radius: 10px;
            padding: 20px;
        }
        
        .section-title {
            font-size: 1.2rem;
            color: #fff;
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px;
        }
        
        .info-label {
            font-weight: 600;
            color: #ccc;
            min-width: 120px;
        }
        
        .info-value {
            color: #fff;
        }
        
        .rating {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .stars {
            color: #ffc107;
            font-size: 1.2rem;
            letter-spacing: 2px;
        }
        
        /* ACTORS MOVED TO COLUMN 3 - REMOVED FROM HERE */
        
        .movie-description {
            color: #ccc;
            line-height: 1.6;
            margin: 0;
        }
        
        .show-more-btn {
            background: #444;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 0.9rem;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.3s ease;
        }
        
        .show-more-btn:hover {
            background: #555;
        }
        
        /* Show More Content */
        .more-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease;
            margin-top: 15px;
        }
        
        .more-content.expanded {
            max-height: 500px;
        }
        
        .more-info {
            background: #1a1a1a;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
            color: #fff;
        }

        .more-info h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #fff;
        }

        .more-info p {
            margin: 5px 0;
            color: #ccc;
        }

        .genre-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
        }
        
        .genre-tag {
            background: #333;
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            display: inline-block;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        
        /* Column 3: Streaming Options & Actors */
        .actions-column {
            display: flex;
            flex-direction: column;
            gap: 12px;
            position: sticky;
            top: 80px;
            align-self: start;
            height: fit-content;
        }
        
        .streaming-btn {
            border: none;
            border-radius: 8px;
            padding: 14px 20px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .netflix-btn {
            background: #e50914;
            color: white;
        }
        
        .netflix-btn:hover {
            background: #b81d24;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(229, 9, 20, 0.4);
        }
        
        .amazon-btn {
            background: #00a8e1;
            color: white;
        }
        
        .amazon-btn:hover {
            background: #0087b3;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 168, 225, 0.4);
        }
        
        .watch-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .watch-btn:hover {
            background: #2e2e2e;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(194, 27, 227, 0.4);
        }
        
        /* Actors Section in Column 3 */
        .actors-section {
            background: #1a1a1a;
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
        }
        
        .actors-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 5px;
        }
        
        .actors-list::-webkit-scrollbar {
            width: 6px;
        }
        
        .actors-list::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 4px;
        }
        
        .actors-list::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 4px;
        }
        
        .actor {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
        }
        
        .actor-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e50914 0%, #b81d24 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            flex-shrink: 0;
        }
        
        .actor-name {
            font-weight: 500;
            color: #fff;
            font-size: 0.95rem;
        }
        
        .actor-role {
            font-size: 0.85rem;
            color: #aaa;
        }
        
        /* Reviews Section */
        .review-section {
            margin-top: 10px;
        }
        
        .review-form {
            background: #1a1a1a;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            display: none;
        }
        
        .login-prompt {
            text-align: center;
            padding: 20px;
            background: #1a1a1a;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .login-prompt p {
            color: #ccc;
            margin-bottom: 15px;
        }
        
        .login-btn {
            background: #4da3ff;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
        }
        
        .reviews-list {
            max-height: 300px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        .reviews-list::-webkit-scrollbar {
            width: 8px;
        }
        
        .reviews-list::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 4px;
        }
        
        .reviews-list::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 4px;
        }
        
        .review-item {
            background: #2a2a2a;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .review-user {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
            color: #4da3ff;
            font-size: 0.95rem;
        }
        
        .user-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .verified-badge {
            color: #00cc66;
            font-size: 0.8rem;
        }
        
        .review-rating {
            color: gold;
            font-size: 0.9rem;
        }
        
        .review-text {
            color: #ccc;
            line-height: 1.5;
            margin-bottom: 10px;
            font-size: 0.9rem;
            max-height: 60px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .review-text.expanded {
            max-height: none;
        }
        
        .review-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #777;
        }
        
        .read-more-btn {
            background: none;
            border: none;
            color: #4da3ff;
            cursor: pointer;
            font-size: 0.8rem;
            padding: 0;
            margin-top: 5px;
        }
        
        .read-more-btn:hover {
            text-decoration: underline;
        }
        
        .review-stats {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .review-like {
            background: none;
            border: none;
            color: #777;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.8rem;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .review-like:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ff4757;
        }
        
        .review-like.liked {
            color: #ff4757;
        }
        
        .review-date {
            color: #777;
            font-size: 0.8rem;
        }
        
        .no-reviews {
            text-align: center;
            padding: 20px;
            color: #777;
            background: #1a1a1a;
            border-radius: 8px;
        }
        
        .review-count {
            color: #4da3ff;
            font-weight: bold;
        }
        
        .average-rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
        }
        
        .average-rating-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: gold;
        }
        
        .average-rating-text {
            color: #ccc;
            font-size: 0.9rem;
        }
        
        @media (max-width: 1024px) {
            .modal-body {
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            
            .poster-column, .actions-column {
                position: static;
            }
            
            .actions-column {
                grid-column: span 2;
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .streaming-btn {
                flex: 1;
                min-width: 150px;
            }
            
            .actors-section {
                grid-column: span 2;
                margin-top: 0;
            }
        }
        
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
            }
            
            .poster-column, .actions-column {
                position: static;
            }
            
            .actions-column {
                grid-column: span 1;
                flex-direction: column;
            }
            
            .actors-section {
                grid-column: span 1;
                order: 3;
            }
            
            .modal-content {
                padding: 15px;
                margin: 10px;
            }
            
            .user-actions {
                flex-direction: row;
            }
        }
    </style>
<article class="movie-card">
        <img src="" alt="">
        <div class="title-container">
            <h3></h3>
        </div>
        <div class="neg-yum">
            <span class="genre-year"></span>
            <span class="type"></span>
        </div>
    </article>
    
    <!-- Modal for movie details -->
    <div class="movie-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title"></h2>
                <button class="close-modal">&times;</button>
            </div>
            
            <div class="modal-body">
                <!-- Column 1: Poster & User Actions (FIXED) -->
                <div class="poster-column">
                    <img class="modal-poster" src="" alt="">
                    <button class="trailer-btn">
                        <i class="fas fa-play"></i> Трейлер үзэх
                    </button>
                    
                    <!-- User Actions -->
                    <div class="user-actions">
                        <button class="action-btn watchlist-btn" id="watchlist-btn">
                            <i class="fas fa-plus"></i> Watchlist
                        </button>
                        <button class="action-btn watched-btn" id="watched-btn">
                            <i class="fas fa-check"></i> Үзсэн
                        </button>
                    </div>
                </div>
                
                <!-- Column 2: Movie Information & Reviews (SCROLLS) -->
                <div class="info-column">
                    <div class="movie-info-section">
                        <h3 class="section-title">Киноны мэдээлэл</h3>
                        <div class="info-grid">
                            <div class="info-label">Он/Үргэлжлэх хугацаа:</div>
                            <div class="info-value modal-year"></div>
                            
                            <div class="info-label">Төрөл:</div>
                            <div class="info-value modal-type"></div>
                            
                            <div class="info-label">Үнэлгээ:</div>
                            <div class="info-value">
                                <div class="rating">
                                    <span class="stars">★★★☆☆</span>
                                    <span class="rating-text">7.5/10</span>
                                </div>
                            </div>
                            
                            <div class="info-label">Жанр:</div>
                            <div class="info-value">
                                <div class="genre-tags"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ACTORS REMOVED FROM HERE -->
                    
                    <div class="movie-info-section">
                        <h3 class="section-title">Тайлбар</h3>
                        <div class="movie-description"></div>
                        <button class="show-more-btn">Дэлгэрэнгүй үзэх</button>
                        <div class="more-content">
                            <div class="more-info">
                                <h4>Нэмэлт мэдээлэл:</h4>
                                <div class="more-details"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reviews Section -->
                    <div class="movie-info-section review-section">
                        <h3 class="section-title">Хэрэглэгчийн үнэлгээ</h3>
                        
                        <!-- Average Rating -->
                        <div class="average-rating" id="average-rating">
                            <!-- Will be populated dynamically -->
                        </div>
                        
                        <!-- Login Prompt -->
                        <div class="login-prompt" id="login-prompt">
                            <p>Үнэлгээ өгөх, watchlist нэмэх эсвэл кино үзсэн гэж тэмдэглэхийн тулд нэвтрэх шаардлагатай</p>
                            <button class="login-btn" id="go-to-login-btn">Нэвтрэх</button>
                        </div>
                        
                        <!-- Reviews List -->
                        <div class="reviews-list" id="reviews-list">
                            <!-- Reviews will be loaded here -->
                        </div>
                    </div>
                </div>
                
                <!-- Column 3: Streaming Options & Actors (FIXED) -->
                <div class="actions-column">
                    <button class="streaming-btn netflix-btn">
                        <i class="fab fa-netflix"></i> Netflix
                    </button>
                    <button class="streaming-btn amazon-btn">
                        <i class="fab fa-amazon"></i> Amazon Prime
                    </button>
                    <button class="streaming-btn watch-btn">
                        <i class="fas fa-play"></i> Үзэх
                    </button>
                    
                    <!-- Actors Section Moved Here -->
                    <div class="actors-section">
                        <h3 class="section-title">Гол дүрүд</h3>
                        <div class="actors-list"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
    }

    connectedCallback() {
        this.updateContent();
        this.addClickHandler();
        this.setupModal();
        this.checkAuthStatus();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateContent();
        }
    }

    static get observedAttributes() {
        return ['name', 'image', 'year-or-season', 'category', 'rating', 'duration', 'description', 'director', 'cast', 'genre', 'trailer'];
    }

    updateContent() {
        const shadow = this.shadowRoot;
        const currentPath = window.location.pathname;
        const imageAttr = this.getAttribute('image');
        
        let imagePath;
        
        if (imageAttr && (imageAttr.includes('/') || imageAttr.includes('../'))) {
            imagePath = imageAttr;
        } else {
            let imageBasePath;
            
            if (currentPath.includes('/html/') || currentPath.includes('movie-detail.html')) {
                imageBasePath = '../images/';
            } else {
                imageBasePath = 'frontend/images/';
            }
            
            imagePath = `${imageBasePath}${imageAttr}`;
        }
        
        shadow.querySelector('h3').textContent = this.getAttribute('name') || 'Unknown Movie';
        shadow.querySelector('img').src = imagePath;
        shadow.querySelector('img').alt = this.getAttribute('name') || 'Movie Poster';
        shadow.querySelector('.genre-year').textContent = this.getAttribute('year-or-season') || 'Unknown';
        
        const category = this.getAttribute('category');
        shadow.querySelector('.type').textContent = category === 'movies' ? 'Кино' : 'Цуврал';
    }

    checkAuthStatus() {
        const token = localStorage.getItem('cinewave-token');
        const userData = localStorage.getItem('cinewave-user');
        
        if (token && userData) {
            this.userData = JSON.parse(userData);
            return true;
        }
        return false;
    }

    addClickHandler() {
        this.shadowRoot.querySelector('.movie-card').addEventListener('click', () => {
            const isClickable = this.getAttribute('clickable') !== 'false';
            
            if (isClickable) {
                this.showMovieDetails();
            }
        });
    }

    setupModal() {
        const modal = this.shadowRoot.querySelector('.movie-modal');
        const closeBtn = this.shadowRoot.querySelector('.close-modal');
        const trailerBtn = this.shadowRoot.querySelector('.trailer-btn');
        const showMoreBtn = this.shadowRoot.querySelector('.show-more-btn');
        const moreContent = this.shadowRoot.querySelector('.more-content');
        const streamingBtns = this.shadowRoot.querySelectorAll('.streaming-btn');
        const watchlistBtn = this.shadowRoot.querySelector('#watchlist-btn');
        const watchedBtn = this.shadowRoot.querySelector('#watched-btn');
        const loginBtn = this.shadowRoot.querySelector('#go-to-login-btn');
        
        closeBtn.addEventListener('click', () => this.closeModal(modal, moreContent, showMoreBtn));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal, moreContent, showMoreBtn);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal(modal, moreContent, showMoreBtn);
            }
        });
        
        trailerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showTrailer();
        });
        
        showMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreContent.classList.toggle('expanded');
            showMoreBtn.textContent = moreContent.classList.contains('expanded') 
                ? 'Багасгах' 
                : 'Дэлгэрэнгүй үзэх';
        });
        
        streamingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.textContent;
                this.handleStreamingAction(action);
            });
        });
        
        if (watchlistBtn) {
            watchlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleUserAction('watchlist');
            });
        }
        
        if (watchedBtn) {
            watchedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleUserAction('watched');
            });
        }
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goToLoginPage();
            });
        }
    }

    goToLoginPage() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('.html') === false) {
            window.location.href = 'html/login.html';
        } 
        else if (currentPath.includes('/html/')) {
            window.location.href = 'login.html';
        }
        else {
            window.location.href = '../html/login.html';
        }
    }

    async showMovieDetails() {
        const modal = this.shadowRoot.querySelector('.movie-modal');
        const shadow = this.shadowRoot;
        
        const movieName = this.getAttribute('name') || 'Unknown Movie';
        const yearOrSeason = this.getAttribute('year-or-season') || 'Unknown';
        const category = this.getAttribute('category');
        const rating = this.getAttribute('rating');
        const duration = this.getAttribute('duration');
        const description = this.getAttribute('description');
        const director = this.getAttribute('director');
        const castAttr = this.getAttribute('cast');
        const genreAttr = this.getAttribute('genre');
        const trailerUrl = this.getAttribute('trailer');
        
        shadow.querySelector('.modal-title').textContent = movieName;
        shadow.querySelector('.modal-poster').src = shadow.querySelector('img').src;
        shadow.querySelector('.modal-poster').alt = movieName;
        shadow.querySelector('.modal-year').textContent = yearOrSeason;
        shadow.querySelector('.modal-type').textContent = category === 'movies' ? 'Кино' : 'Цуврал';
        
        const trailerBtn = shadow.querySelector('.trailer-btn');
        if (trailerUrl) {
            trailerBtn.dataset.trailerUrl = trailerUrl;
        }
        
        if (rating) {
            const ratingNum = parseFloat(rating);
            const starCount = Math.round(ratingNum / 2);
            const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
            shadow.querySelector('.stars').textContent = stars;
            shadow.querySelector('.rating-text').textContent = `${rating}/10`;
        } else {
            shadow.querySelector('.stars').textContent = '★★★☆☆';
            shadow.querySelector('.rating-text').textContent = '7.5/10';
        }
        
        const genreContainer = shadow.querySelector('.genre-tags');
        genreContainer.innerHTML = '';
        
        if (genreAttr) {
            try {
                const genres = JSON.parse(genreAttr);
                if (Array.isArray(genres) && genres.length > 0) {
                    genres.forEach(genre => {
                        const tag = document.createElement('span');
                        tag.className = 'genre-tag';
                        tag.textContent = genre;
                        genreContainer.appendChild(tag);
                    });
                } else {
                    this.showDefaultGenres(genreContainer, category);
                }
            } catch (e) {
                this.showDefaultGenres(genreContainer, category);
            }
        } else {
            this.showDefaultGenres(genreContainer, category);
        }
        
        if (description) {
            shadow.querySelector('.movie-description').textContent = description;
        } else {
            shadow.querySelector('.movie-description').textContent = 'Энэ киноны тухай дэлгэрэнгүй тайлбар байхгүй байна.';
        }
        
        const actorsList = shadow.querySelector('.actors-list');
        actorsList.innerHTML = '';
        
        if (castAttr) {
            try {
                const cast = JSON.parse(castAttr);
                if (Array.isArray(cast) && cast.length > 0) {
                    const actorsToShow = cast.slice(0, 4);
                    actorsToShow.forEach(actor => {
                        this.addActorToModal(actor, actorsList);
                    });
                } else {
                    this.showDefaultActors(actorsList);
                }
            } catch (e) {
                this.showDefaultActors(actorsList);
            }
        } else {
            this.showDefaultActors(actorsList);
        }
        
        const moreDetails = shadow.querySelector('.more-details');
        moreDetails.innerHTML = '';
        
        if (director) {
            const p = document.createElement('p');
            p.textContent = `• Найруулагч: ${director}`;
            moreDetails.appendChild(p);
        }
        
        const yearMatch = yearOrSeason.match(/\d{4}/);
        if (yearMatch) {
            const p = document.createElement('p');
            p.textContent = `• Бүтээсэн он: ${yearMatch[0]}`;
            moreDetails.appendChild(p);
        }
        
        if (duration) {
            const p = document.createElement('p');
            p.textContent = `• Үргэлжлэх хугацаа: ${duration}`;
            moreDetails.appendChild(p);
        }
        
        const isLoggedIn = this.checkAuthStatus();
        
        if (isLoggedIn) {
            const loginPrompt = shadow.querySelector('#login-prompt');
            if (loginPrompt) {
                loginPrompt.innerHTML = `
                    <p>Та нэвтэрсэн байна. Киноны үнэлгээ өгч, watchlist нэмэх боломжтой.</p>
                    <div style="margin-top: 10px;">
                        <button id="add-review-btn" class="login-btn">Үнэлгээ нэмэх</button>
                        <button id="check-watchlist-btn" class="login-btn" style="margin-left: 10px; background: #00cc66;">Watchlist шалгах</button>
                    </div>
                `;
                
                const addReviewBtn = shadow.querySelector('#add-review-btn');
                const checkWatchlistBtn = shadow.querySelector('#check-watchlist-btn');
                
                if (addReviewBtn) {
                    addReviewBtn.addEventListener('click', () => {
                        this.addReview(movieName);
                    });
                }
                
                if (checkWatchlistBtn) {
                    checkWatchlistBtn.addEventListener('click', () => {
                        this.checkWatchlistStatus(movieName);
                    });
                }
            }
            
            const watchlistBtn = shadow.querySelector('#watchlist-btn');
            const watchedBtn = shadow.querySelector('#watched-btn');
            
            if (watchlistBtn) {
                watchlistBtn.style.cursor = 'pointer';
                watchlistBtn.title = 'Watchlist-д нэмэх';
            }
            
            if (watchedBtn) {
                watchedBtn.style.cursor = 'pointer';
                watchedBtn.title = 'Үзсэн гэж тэмдэглэх';
            }
        } else {
            const watchlistBtn = shadow.querySelector('#watchlist-btn');
            const watchedBtn = shadow.querySelector('#watched-btn');
            
            if (watchlistBtn) {
                watchlistBtn.style.cursor = 'pointer';
                watchlistBtn.title = 'Watchlist-д нэмэх (Нэвтрэх шаардлагатай)';
            }
            
            if (watchedBtn) {
                watchedBtn.style.cursor = 'pointer';
                watchedBtn.title = 'Үзсэн гэж тэмдэглэх (Нэвтрэх шаардлагатай)';
            }
        }
        
        // Load reviews dynamically from JSON
        await this.loadReviewsFromJSON(movieName);
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // NEW METHOD: Load reviews from JSON file
    async loadReviewsFromJSON(movieName) {
        try {
            const currentPath = window.location.pathname;
            let jsonPath;
            
            // Determine correct path for reviews.json
            if (currentPath.includes('/html/') || currentPath.includes('movie-detail.html')) {
                jsonPath = '../data/reviews.json';
            } else {
                jsonPath = 'frontend/data/reviews.json';
            }
            
            // Fetch reviews from JSON file
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to load reviews: ${response.status}`);
            }
            
            const data = await response.json();
            const allReviews = data.reviews || [];
            
            // Filter reviews for this specific movie
            const movieReviews = allReviews.filter(review => 
                this.matchesMovieName(review.movie, movieName)
            );
            
            // Display the reviews
            this.displayReviews(movieName, movieReviews);
            
        } catch (error) {
            console.error('Error loading reviews from JSON:', error);
            // Fallback to localStorage if JSON fetch fails
            this.loadReviewsFromLocalStorage(movieName);
        }
    }
    
    // Helper: Check if review matches movie name
    matchesMovieName(reviewMovie, movieName) {
        // Convert to lowercase and remove special characters for comparison
        const normalize = (str) => 
            str.toLowerCase()
               .replace(/[^a-z0-9\s]/g, '')
               .replace(/\s+/g, ' ')
               .trim();
        
        const reviewNorm = normalize(reviewMovie);
        const movieNorm = normalize(movieName);
        
        // Check for partial matches (in case names are slightly different)
        return reviewNorm.includes(movieNorm) || 
               movieNorm.includes(reviewNorm) ||
               this.getMovieNameVariants(movieName).some(variant => 
                   reviewNorm.includes(normalize(variant))
               );
    }
    
    // Helper: Generate possible name variants
    getMovieNameVariants(movieName) {
        const variants = [movieName];
        
        // Remove common prefixes/suffixes
        const withoutYear = movieName.replace(/\s*\(\d{4}\)\s*$/, '').trim();
        if (withoutYear !== movieName) {
            variants.push(withoutYear);
        }
        
        // Remove "The " prefix
        const withoutThe = movieName.replace(/^The\s+/i, '').trim();
        if (withoutThe !== movieName) {
            variants.push(withoutThe);
        }
        
        return variants;
    }
    
    // Fallback: Load reviews from localStorage
    loadReviewsFromLocalStorage(movieName) {
        try {
            const savedReviews = localStorage.getItem(`reviews-${movieName}`);
            let reviews = [];
            
            if (savedReviews) {
                reviews = JSON.parse(savedReviews);
            } else {
                // Default sample reviews if none exist
                reviews = [
                    {
                        reviewer: 'Батар',
                        rating: 9,
                        content: 'Гайхалтай кино! Найруулагчийн бүтээл сэтгэл хөдлөм.',
                        timestamp: new Date().toISOString(),
                        avatar: 'https://ui-avatars.com/api/?name=Батар&background=FF6B6B&color=fff',
                        verified: true
                    }
                ];
                
                localStorage.setItem(`reviews-${movieName}`, JSON.stringify(reviews));
            }
            
            this.displayReviews(movieName, reviews);
        } catch (error) {
            console.error('Error loading reviews from localStorage:', error);
            this.displayReviews(movieName, []);
        }
    }
    
    // Display reviews in the modal
    displayReviews(movieName, reviews) {
        const shadow = this.shadowRoot;
        const reviewsList = shadow.querySelector('#reviews-list');
        const averageRatingEl = shadow.querySelector('#average-rating');
        
        if (!reviewsList) return;
        
        // Calculate average rating
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            const starCount = Math.round(averageRating / 2);
            const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
            
            if (averageRatingEl) {
                averageRatingEl.innerHTML = `
                    <div class="average-rating-number">${averageRating.toFixed(1)}</div>
                    <div>
                        <div class="stars">${stars}</div>
                        <div class="average-rating-text">Дундаж үнэлгээ (<span class="review-count">${reviews.length}</span> үнэлгээ)</div>
                    </div>
                `;
            }
        } else {
            if (averageRatingEl) {
                averageRatingEl.innerHTML = `
                    <div class="average-rating-number">0.0</div>
                    <div class="average-rating-text">Хэрэглэгчийн үнэлгээ байхгүй</div>
                `;
            }
        }
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <p>Энэ кинонд хэрэглэгчийн үнэлгээ байхгүй байна.</p>
                    <p>Та анхны үнэлгээ өгөх боломжтой!</p>
                </div>
            `;
            return;
        }
        
        // Sort reviews by date (newest first)
        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        reviewsList.innerHTML = reviews.map(review => {
            // Format date
            const reviewDate = new Date(review.timestamp);
            const formattedDate = reviewDate.toLocaleDateString('mn-MN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Create star rating
            const starCount = Math.round(review.rating / 2);
            const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
            
            // Check if content needs "Read More"
            const content = review.content || '';
            const needsReadMore = content.length > 200;
            const displayContent = needsReadMore ? content.substring(0, 200) + '...' : content;
            
            return `
                <div class="review-item" data-review-id="${review.id}">
                    <div class="review-header">
                        <div class="review-user">
                            ${review.avatar ? `<img src="${review.avatar}" alt="${review.reviewer}" class="user-avatar">` : ''}
                            <div>
                                <div>${review.reviewer}</div>
                                ${review.verified ? `<div class="verified-badge">✓ Баталгаажсан</div>` : ''}
                            </div>
                        </div>
                        <div class="review-rating">
                            ${stars} <span style="margin-left: 5px;">(${review.rating}/10)</span>
                        </div>
                    </div>
                    <p class="review-text" id="review-text-${review.id}">
                        ${displayContent}
                    </p>
                    ${needsReadMore ? 
                        `<button class="read-more-btn" data-review-id="${review.id}" data-full-text="${content.replace(/"/g, '&quot;')}">
                            Дэлгэрэнгүй унших
                        </button>` 
                        : ''
                    }
                    <div class="review-footer">
                        <div class="review-date">${formattedDate}</div>
                        <div class="review-stats">
                            <button class="review-like" data-review-id="${review.id}">
                                <i class="fas fa-heart"></i> <span class="like-count">${review.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners
        reviewsList.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const reviewId = btn.dataset.reviewId;
                const fullText = btn.dataset.fullText;
                const reviewTextEl = shadow.querySelector(`#review-text-${reviewId}`);
                
                if (reviewTextEl.classList.contains('expanded')) {
                    // Collapse
                    const shortText = fullText.substring(0, 200) + '...';
                    reviewTextEl.textContent = shortText;
                    reviewTextEl.classList.remove('expanded');
                    btn.textContent = 'Дэлгэрэнгүй унших';
                } else {
                    // Expand
                    reviewTextEl.textContent = fullText;
                    reviewTextEl.classList.add('expanded');
                    btn.textContent = 'Багасгах';
                }
            });
        });
        
        reviewsList.querySelectorAll('.review-like').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const reviewId = btn.dataset.reviewId;
                this.likeReview(movieName, reviewId, btn);
            });
        });
    }

    likeReview(movieName, reviewId, button) {
        const isLoggedIn = this.checkAuthStatus();
        
        if (!isLoggedIn) {
            alert('Үнэлгээнд таалагдлаа илэрхийлэхийн тулд нэвтрэх шаардлагатай');
            this.goToLoginPage();
            return;
        }
        
        // Get current likes
        const likeCountEl = button.querySelector('.like-count');
        let currentLikes = parseInt(likeCountEl.textContent) || 0;
        
        // Update UI
        currentLikes += 1;
        likeCountEl.textContent = currentLikes;
        button.classList.add('liked');
        
        // In a real app, you would save this to your backend
        // For now, we'll update localStorage
        try {
            const savedReviews = localStorage.getItem(`reviews-${movieName}`);
            if (savedReviews) {
                let reviews = JSON.parse(savedReviews);
                reviews = reviews.map(review => {
                    if (review.id == reviewId) {
                        return { ...review, likes: (review.likes || 0) + 1 };
                    }
                    return review;
                });
                localStorage.setItem(`reviews-${movieName}`, JSON.stringify(reviews));
            }
        } catch (error) {
            console.error('Error saving like:', error);
        }
    }

    // Rest of the methods remain the same...
    handleUserAction(action) {
        const isLoggedIn = this.checkAuthStatus();
        const movieName = this.getAttribute('name');
        
        if (!isLoggedIn) {
            alert('Энэ үйлдлийг хийхийн тулд нэвтрэх шаардлагатай');
            this.goToLoginPage();
            return;
        }
        
        switch(action) {
            case 'watchlist':
                this.addToWatchlist(movieName);
                break;
            case 'watched':
                this.markAsWatched(movieName);
                break;
        }
    }

    addToWatchlist(movieName) {
        if (!this.checkAuthStatus()) {
            this.goToLoginPage();
            return;
        }
        
        alert(`"${movieName}" кино watchlist-д нэмэгдлээ!`);
        
        const shadow = this.shadowRoot;
        const watchlistBtn = shadow.querySelector('#watchlist-btn');
        if (watchlistBtn) {
            watchlistBtn.classList.add('active');
            watchlistBtn.innerHTML = '<i class="fas fa-check"></i> Watchlist';
        }
    }

    markAsWatched(movieName) {
        if (!this.checkAuthStatus()) {
            this.goToLoginPage();
            return;
        }
        
        const rating = prompt('Энэ киног 1-10-аар үнэлнэ үү:', '8');
        
        if (!rating || rating < 1 || rating > 10) {
            alert('Зөв үнэлгээ оруулна уу (1-10)');
            return;
        }
        
        alert(`"${movieName}" кино үзсэн гэж тэмдэглэгдлээ! Үнэлгээ: ${rating}/10`);
        
        const shadow = this.shadowRoot;
        const watchedBtn = shadow.querySelector('#watched-btn');
        if (watchedBtn) {
            watchedBtn.classList.add('active');
            watchedBtn.innerHTML = `<i class="fas fa-check"></i> Үзсэн (${rating})`;
        }
    }

    addReview(movieName) {
        const reviewText = prompt('Энэ киноны тухай сэтгэгдлээ бичнэ үү:');
        if (!reviewText || reviewText.trim() === '') return;
        
        const rating = prompt('1-10-аар үнэлнэ үү:');
        if (!rating || rating < 1 || rating > 10) {
            alert('Зөв үнэлгээ оруулна уу (1-10)');
            return;
        }
        
        // Get user info
        const userData = JSON.parse(localStorage.getItem('cinewave-user') || '{}');
        const username = userData.username || 'Зочин';
        
        const newReview = {
            id: Date.now(),
            reviewer: username,
            rating: parseFloat(rating),
            content: reviewText,
            movie: movieName,
            timestamp: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=4ECDC4&color=fff`,
            verified: userData.verified || false,
            likes: 0
        };
        
        // Save to localStorage
        try {
            const savedReviews = localStorage.getItem(`reviews-${movieName}`);
            let reviews = [];
            
            if (savedReviews) {
                reviews = JSON.parse(savedReviews);
            }
            
            reviews.unshift(newReview);
            localStorage.setItem(`reviews-${movieName}`, JSON.stringify(reviews));
            
            // Reload reviews
            this.loadReviewsFromLocalStorage(movieName);
            alert('Үнэлгээ амжилттай нэмэгдлээ!');
        } catch (error) {
            console.error('Error saving review:', error);
            alert('Үнэлгээ нэмэхэд алдаа гарлаа.');
        }
    }

    checkWatchlistStatus(movieName) {
        alert(`"${movieName}" кино таны watchlist-д байгаа эсэхийг шалгаж байна...`);
    }

    showTrailer() {
        const trailerBtn = this.shadowRoot.querySelector('.trailer-btn');
        const trailerUrl = trailerBtn.dataset.trailerUrl || this.getAttribute('trailer');
        
        if (trailerUrl) {
            window.open(trailerUrl, '_blank');
        } else {
            alert('Трейлер холбоос олдсонгүй');
        }
    }

    handleStreamingAction(action) {
        const movieName = this.getAttribute('name');
        
        switch(action) {
            case 'Netflix':
                alert(`"${movieName}" кино Netflix дээр үзэх боломжтой`);
                break;
            case 'Amazon Prime':
                alert(`"${movieName}" кино Amazon Prime дээр үзэх боломжтой`);
                break;
            case 'Үзэх':
                alert(`"${movieName}" кино эхлэх болно...`);
                break;
        }
    }

    addActorToModal(actorName, container) {
        const actorDiv = document.createElement('div');
        actorDiv.className = 'actor';
        
        const nameParts = actorName.split(' ');
        const initials = nameParts.length >= 2 
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : actorName.substring(0, 2).toUpperCase();
        
        actorDiv.innerHTML = `
            <div class="actor-avatar">${initials}</div>
            <div>
                <div class="actor-name">${actorName}</div>
                <div class="actor-role">Гол дүр</div>
            </div>
        `;
        container.appendChild(actorDiv);
    }

    showDefaultActors(container) {
        const defaultActors = [
            'Том Круз',
            'Женнифер Лоуренс', 
            'Леонардо ДиКаприо',
            'Скарлет Йоханссон'
        ];
        
        defaultActors.forEach(actor => {
            this.addActorToModal(actor, container);
        });
    }

    showDefaultGenres(container, category) {
        const defaultMovieGenres = ['Адал явдал', 'Драма', 'Триллер'];
        const defaultTVGenres = ['Драма', 'Цуврал', 'Инээдмийн'];
        
        const genres = category === 'movies' ? defaultMovieGenres : defaultTVGenres;
        
        genres.forEach(genre => {
            const tag = document.createElement('span');
            tag.className = 'genre-tag';
            tag.textContent = genre;
            container.appendChild(tag);
        });
    }

    closeModal(modal, moreContent, showMoreBtn) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (moreContent && showMoreBtn) {
            moreContent.classList.remove('expanded');
            showMoreBtn.textContent = 'Дэлгэрэнгүй үзэх';
        }
    }
}

customElements.define('movie-card', MovieCard);