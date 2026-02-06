class MovieCard extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <style>
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
        .movie-card {
            background: #333;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
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
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(77, 163, 255, 0.3);
            border-color: #4da3ff;
        }

        .movie-card img {
            width: 100%;
            height: 300px;
            object-fit: cover;
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
            color: #fff;
        }

        .neg-yum {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #ccc;
            padding: 1rem;
            height: 55px;
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
            color: #ccc;
        }

        .type {
            font-weight: bold;
            flex-shrink: 0;
            margin-left: 10px;
            color: #4da3ff;
        }
        
        /* Quick Preview Modal styles */
        .movie-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            padding: 0;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
            animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-header {
            position: relative;
            height: 450px;
            overflow: hidden;
            border-radius: 20px 20px 0 0;
        }

        .modal-backdrop {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
            filter: brightness(0.4);
        }

        .modal-header-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 30px;
            background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
        }
        
        .modal-title {
            font-size: 2rem;
            margin: 0 0 10px 0;
            color: #fff;
            font-weight: 700;
        }

        .modal-meta {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .meta-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(12px);
            border-radius: 30px;
            font-size: 0.95rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }

        .meta-badge:hover {
            background: rgba(255, 255, 255, 0.18);
            transform: translateY(-2px);
            border-color: rgba(77, 163, 255, 0.3);
        }

        .meta-badge i {
            color: #4da3ff;
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
            filter: drop-shadow(0 2px 4px rgba(77, 163, 255, 0.3));
        }

        /* Special icon colors for different badge types */
        .meta-badge.badge-year i {
            color: #ff6b9d;
        }

        .meta-badge.badge-duration i {
            color: #00d9ff;
        }

        .meta-badge.badge-certification i {
            color: #ffd700;
        }

        .meta-badge.badge-seasons i {
            color: #9d4edd;
        }

        .meta-badge.badge-episodes i {
            color: #06ffa5;
        }

        .meta-badge.badge-type-movie i {
            color: #ff6b35;
        }

        .meta-badge.badge-type-tv i {
            color: #4ecdc4;
        }

        .rating-badge {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            font-weight: 700;
            padding: 12px 22px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .rating-badge:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
        }

        .rating-badge i {
            color: #ff8c00;
            font-size: 1.2rem;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #fff;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
        }
        
        .close-modal:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        .modal-body {
            padding: 30px;
        }

        .genre-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .genre-tag {
            background: rgba(77, 163, 255, 0.15);
            border: 1px solid rgba(77, 163, 255, 0.3);
            color: #4da3ff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .description-section {
            margin-bottom: 25px;
        }

        .section-title {
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-title i {
            color: #4da3ff;
            font-size: 1rem;
        }
        
        .movie-description {
            color: #ccc;
            line-height: 1.7;
            font-size: 0.95rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .top-cast {
            margin-bottom: 25px;
        }

        .cast-list {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding-bottom: 10px;
        }

        .cast-list::-webkit-scrollbar {
            height: 6px;
        }

        .cast-list::-webkit-scrollbar-track {
            background: #1a1a1a;
            border-radius: 3px;
        }

        .cast-list::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 3px;
        }

        .cast-member {
            flex-shrink: 0;
            text-align: center;
            width: 80px;
        }

        .cast-avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
            background: linear-gradient(135deg, #4da3ff, #667eea);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            margin: 0 auto 8px;
            border: 3px solid #2a2a2a;
        }

        .cast-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .cast-name {
            color: #fff;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .cast-role {
            color: #999;
            font-size: 0.75rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 25px;
        }
        
        .primary-btn {
            background: linear-gradient(135deg, #4da3ff, #667eea);
            color: white;
            border: none;
            padding: 14px 20px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(77, 163, 255, 0.3);
            grid-column: span 2;
        }
        
        .primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(77, 163, 255, 0.5);
        }

        .primary-btn i {
            font-size: 1.1rem;
        }
        
        .secondary-btn {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .secondary-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        .secondary-btn.active {
            background: rgba(77, 163, 255, 0.2);
            border-color: #4da3ff;
            color: #4da3ff;
        }

        .secondary-btn.active i {
            animation: iconPop 0.4s ease;
        }

        @keyframes iconPop {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }

        .watchlist-btn.active {
            background: rgba(77, 163, 255, 0.25);
            border-color: #4da3ff;
        }

        .watched-btn.active {
            background: rgba(0, 204, 102, 0.25);
            border-color: #00cc66;
            color: #00cc66;
        }

        .trailer-btn {
            background: rgba(229, 9, 20, 0.2);
            border: 1px solid rgba(229, 9, 20, 0.5);
            color: #ff4757;
            grid-column: span 2;
        }

        .trailer-btn:hover {
            background: rgba(229, 9, 20, 0.3);
            border-color: #e50914;
        }

        .trailer-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .login-prompt {
            background: rgba(77, 163, 255, 0.1);
            border: 1px solid rgba(77, 163, 255, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
        }
        
        .login-prompt p {
            color: #ccc;
            margin-bottom: 15px;
            font-size: 0.9rem;
        }
        
        .login-btn {
            background: #4da3ff;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px 24px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .login-btn:hover {
            background: #667eea;
            transform: translateY(-2px);
        }

        /* Loading state */
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                max-height: 90vh;
            }

            .modal-header {
                height: 300px;
            }

            .modal-header-content {
                padding: 20px;
            }

            .modal-title {
                font-size: 1.5rem;
            }

            .modal-body {
                padding: 20px;
            }

            .action-buttons {
                grid-template-columns: 1fr;
            }

            .primary-btn,
            .trailer-btn {
                grid-column: span 1;
            }
        }

        @media (max-width: 480px) {
            .modal-title {
                font-size: 1.3rem;
            }

            .modal-meta {
                gap: 10px;
            }

            .meta-badge {
                font-size: 0.85rem;
                padding: 8px 14px;
                gap: 8px;
            }

            .meta-badge i {
                font-size: 1rem;
                width: 18px;
            }

            .rating-badge {
                padding: 10px 18px;
                font-size: 0.9rem;
            }

            .rating-badge i {
                font-size: 1.1rem;
            }

            .cast-list {
                gap: 10px;
            }

            .cast-member {
                width: 70px;
            }

            .cast-avatar {
                width: 60px;
                height: 60px;
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
    
    <!-- Quick Preview Modal -->
    <div class="movie-modal">
        <div class="modal-content">
            <div class="modal-header">
                <img class="modal-backdrop" src="" alt="">
                <button class="close-modal">&times;</button>
                <div class="modal-header-content">
                    <h2 class="modal-title"></h2>
                    <div class="modal-meta">
                        <div class="rating-badge">
                            <i class="fas fa-star"></i>
                            <span id="modal-rating">0.0</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="genre-tags" id="genre-tags"></div>
                
                <div class="description-section">
                    <h3 class="section-title">
                        <i class="fas fa-align-left"></i>
                        Товч танилцуулга
                    </h3>
                    <p class="movie-description"></p>
                </div>

                <div class="top-cast">
                    <h3 class="section-title">
                        <i class="fas fa-users"></i>
                        Гол дүрүүд
                    </h3>
                    <div class="cast-list" id="cast-list"></div>
                </div>
                
                <div class="action-buttons">
                    <button class="primary-btn" id="view-details-btn">
                        <i class="fas fa-info-circle"></i>
                        Дэлгэрэнгүй үзэх
                    </button>
                    
                    <button class="secondary-btn" id="watchlist-btn">
                        <i class="fas fa-bookmark"></i>
                        Watchlist
                    </button>
                    
                    <button class="secondary-btn" id="watched-btn">
                        <i class="fas fa-eye"></i>
                        Үзсэн
                    </button>

                    <button class="secondary-btn trailer-btn" id="trailer-btn">
                        <i class="fas fa-play"></i>
                        Трейлер
                    </button>
                </div>

                <div class="login-prompt" id="login-prompt" style="display: none;">
                    <p>Watchlist нэмэх, үзсэн гэж тэмдэглэхийн тулд нэвтрэх шаардлагатай</p>
                    <button class="login-btn" id="go-to-login-btn">Нэвтрэх</button>
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
        
        window.addEventListener('hashchange', () => {
            document.body.style.overflow = 'auto';
            const modal = this.shadowRoot.querySelector('.movie-modal');
            if (modal && modal.style.display === 'flex') {
                this.closeModal(modal);
            }
        });
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
        const token = localStorage.getItem('cinewave_token');
        const userData = localStorage.getItem('cinewave_user');
        
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
                this.showQuickPreview();
            }
        });
    }

    setupModal() {
        const modal = this.shadowRoot.querySelector('.movie-modal');
        const closeBtn = this.shadowRoot.querySelector('.close-modal');
        const viewDetailsBtn = this.shadowRoot.querySelector('#view-details-btn');
        const trailerBtn = this.shadowRoot.querySelector('#trailer-btn');
        const watchlistBtn = this.shadowRoot.querySelector('#watchlist-btn');
        const watchedBtn = this.shadowRoot.querySelector('#watched-btn');
        const loginBtn = this.shadowRoot.querySelector('#go-to-login-btn');
        
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal(modal);
            }
        });
        
        viewDetailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.goToDetailsPage();
        });
        
        trailerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showTrailer();
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

    async showQuickPreview() {
        const modal = this.shadowRoot.querySelector('.movie-modal');
        const shadow = this.shadowRoot;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const tmdbId = this.getAttribute('data-tmdb-id');
        const mediaType = this.getAttribute('data-media-type') || 'movie';
        
        if (tmdbId) {
            await this.loadTMDBData(tmdbId, mediaType);
        } else {
            this.loadLocalData();
        }
        
        this.updateAuthUI();
        
        const checkAuthInterval = setInterval(() => {
            if (modal.style.display === 'flex') {
                this.updateAuthUI();
            } else {
                clearInterval(checkAuthInterval);
            }
        }, 500);
    }

    async loadTMDBData(tmdbId, mediaType) {
        const shadow = this.shadowRoot;
        
        try {
            const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
            
            if (!service) {
                throw new Error('TMDB Service is not available');
            }
            
            const details = mediaType === 'movie' 
                ? await service.getMovieDetails(tmdbId)
                : await service.getTVDetails(tmdbId);
            
            if (!details) throw new Error('TMDB-аас мэдээлэл ирээгүй');
            
            if (details.cast && details.cast.length > 0) {
                console.log('Sample cast:', details.cast.slice(0, 3).map(a => ({ name: a.name, character: a.character, hasImage: !!a.profile_path })));
            }
            
            this.populateQuickPreview(details);
            
        } catch (error) {
            this.loadLocalData();
        }
    }

    populateQuickPreview(details) {
        const shadow = this.shadowRoot;
        
        shadow.querySelector('.modal-title').textContent = details.name;
        const backdropImage = details.backdrop || details.image;
        shadow.querySelector('.modal-backdrop').src = backdropImage;
        shadow.querySelector('.modal-backdrop').alt = details.name;
        
        const modalMeta = shadow.querySelector('.modal-meta');
        const isMovie = details.category === 'movies';
        
        const ratingBadge = modalMeta.querySelector('.rating-badge');
        modalMeta.innerHTML = '';
        if (ratingBadge) {
            modalMeta.appendChild(ratingBadge);
        }
        
        if (!ratingBadge) {
            const ratingBadgeEl = document.createElement('div');
            ratingBadgeEl.className = 'rating-badge';
            ratingBadgeEl.innerHTML = `
                <i class="fas fa-star"></i>
                <span id="modal-rating">${details.rating ? parseFloat(details.rating).toFixed(1) : '0.0'}</span>
            `;
            modalMeta.appendChild(ratingBadgeEl);
        } else {
            shadow.querySelector('#modal-rating').textContent = details.rating ? parseFloat(details.rating).toFixed(1) : '0.0';
        }
        
        const yearBadge = document.createElement('div');
        yearBadge.className = 'meta-badge badge-year';
        yearBadge.innerHTML = `
            <i class="fas fa-calendar"></i>
            <span>${details.year || 'N/A'}</span>
        `;
        modalMeta.appendChild(yearBadge);
        
        if (isMovie && details.duration && details.duration !== 'Тодорхойгүй') {
            const durationBadge = document.createElement('div');
            durationBadge.className = 'meta-badge badge-duration';
            durationBadge.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${details.duration}</span>
            `;
            modalMeta.appendChild(durationBadge);
        } else if (isMovie && details.runtime) {
            const hours = Math.floor(details.runtime / 60);
            const minutes = details.runtime % 60;
            const durationText = hours > 0 ? `${hours}ц ${minutes}м` : `${minutes}м`;
            const durationBadge = document.createElement('div');
            durationBadge.className = 'meta-badge badge-duration';
            durationBadge.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${durationText}</span>
            `;
            modalMeta.appendChild(durationBadge);
        }
        
        if (isMovie && details.certification && details.certification !== 'Тодорхойгүй') {
            const certBadge = document.createElement('div');
            certBadge.className = 'meta-badge badge-certification';
            certBadge.innerHTML = `
                <i class="fas fa-certificate"></i>
                <span>${details.certification}</span>
            `;
            modalMeta.appendChild(certBadge);
        }
        
        if (!isMovie && details.seasons) {
            const seasonsBadge = document.createElement('div');
            seasonsBadge.className = 'meta-badge badge-seasons';
            seasonsBadge.innerHTML = `
                <i class="fas fa-tv"></i>
                <span>${details.seasons} улирал</span>
            `;
            modalMeta.appendChild(seasonsBadge);
        }
        
        if (!isMovie && details.episodes) {
            const episodesBadge = document.createElement('div');
            episodesBadge.className = 'meta-badge badge-episodes';
            episodesBadge.innerHTML = `
                <i class="fas fa-list"></i>
                <span>${details.episodes} анги</span>
            `;
            modalMeta.appendChild(episodesBadge);
        }
        
        const typeBadge = document.createElement('div');
        typeBadge.className = `meta-badge ${isMovie ? 'badge-type-movie' : 'badge-type-tv'}`;
        typeBadge.innerHTML = `
            <i class="${isMovie ? 'fas fa-film' : 'fas fa-tv'}"></i>
            <span>${isMovie ? 'Кино' : 'Цуврал'}</span>
        `;
        modalMeta.appendChild(typeBadge);
        
        if (details.rating) {
            const rating = parseFloat(details.rating);
            shadow.querySelector('#modal-rating').textContent = rating.toFixed(1);
        }
        
        const genreContainer = shadow.querySelector('#genre-tags');
        genreContainer.innerHTML = '';
        if (details.genres && details.genres.length > 0) {
            details.genres.slice(0, 4).forEach(genre => {
                const tag = document.createElement('span');
                tag.className = 'genre-tag';
                tag.textContent = genre;
                genreContainer.appendChild(tag);
            });
        }
        
        shadow.querySelector('.movie-description').textContent = 
            details.description || 'Энэ киноны тухай дэлгэрэнгүй тайлбар байхгүй байна.';
        
        this.displayTopCast(details.cast || []);
        
        const trailerBtn = shadow.querySelector('#trailer-btn');
        if (details.trailer) {
            const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
            if (service) {
                trailerBtn.dataset.trailerUrl = service.getTrailerUrl(details.trailer);
            } else {
                trailerBtn.dataset.trailerUrl = details.trailer.startsWith('http') 
                    ? details.trailer 
                    : `https://www.youtube.com/watch?v=${details.trailer}`;
            }
            trailerBtn.disabled = false;
        } else {
            trailerBtn.disabled = true;
            trailerBtn.innerHTML = '<i class="fas fa-ban"></i> Трейлер байхгүй';
        }
    }

    displayTopCast(cast) {
        const shadow = this.shadowRoot;
        const castList = shadow.querySelector('#cast-list');
        
        castList.innerHTML = '';
        
        if (!cast || cast.length === 0) {
            console.warn('⚠️ No cast data available');
            castList.innerHTML = '<p style="color: #999; font-size: 0.9rem;">Жүжигчдийн мэдээлэл олдсонгүй</p>';
            return;
        }
        
        console.log(`🎭 Displaying ${cast.length} cast members`);
        
        cast.forEach((actor, index) => {
            const castDiv = document.createElement('div');
            castDiv.className = 'cast-member';
            
            let avatarHTML = '';
            if (actor.profile_path) {
                const imageUrl = actor.profile_path.startsWith('http') 
                    ? actor.profile_path 
                    : `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
                avatarHTML = `<img src="${imageUrl}" alt="${actor.name}" onerror="this.parentElement.textContent='${actor.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}'">`;
            } else {
                const nameParts = actor.name.split(' ');
                const initials = nameParts.length >= 2 
                    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                    : actor.name.substring(0, 2).toUpperCase();
                avatarHTML = initials;
            }
            
            castDiv.innerHTML = `
                <div class="cast-avatar">${avatarHTML}</div>
                <div class="cast-name">${actor.name || 'Unknown'}</div>
                <div class="cast-role">${(actor.character || 'Дүр').substring(0, 15)}</div>
            `;
            castList.appendChild(castDiv);
        });
    }

    loadLocalData() {
        const shadow = this.shadowRoot;
        
        const movieName = this.getAttribute('name') || 'Unknown Movie';
        const yearOrSeason = this.getAttribute('year-or-season') || 'Unknown';
        const category = this.getAttribute('category');
        const rating = this.getAttribute('rating');
        const description = this.getAttribute('description');
        const genreAttr = this.getAttribute('genre');
        const castAttr = this.getAttribute('cast');
        
        shadow.querySelector('.modal-title').textContent = movieName;
        shadow.querySelector('.modal-backdrop').src = shadow.querySelector('img').src;
        
        const modalMeta = shadow.querySelector('.modal-meta');
        const isMovie = category === 'movies';
        
        const ratingBadge = modalMeta.querySelector('.rating-badge');
        modalMeta.innerHTML = '';
        if (ratingBadge) {
            modalMeta.appendChild(ratingBadge);
        }
        
        if (!ratingBadge) {
            const ratingBadgeEl = document.createElement('div');
            ratingBadgeEl.className = 'rating-badge';
            const ratingText = rating ? parseFloat(rating).toFixed(1) : '0.0';
            ratingBadgeEl.innerHTML = `
                <i class="fas fa-star"></i>
                <span id="modal-rating">${ratingText}</span>
            `;
            modalMeta.appendChild(ratingBadgeEl);
        } else {
            shadow.querySelector('#modal-rating').textContent = rating ? parseFloat(rating).toFixed(1) : '0.0';
        }
        
        const yearMatch = yearOrSeason.match(/\d{4}/);
        const yearBadge = document.createElement('div');
        yearBadge.className = 'meta-badge badge-year';
        yearBadge.innerHTML = `
            <i class="fas fa-calendar"></i>
            <span>${yearMatch ? yearMatch[0] : 'N/A'}</span>
        `;
        modalMeta.appendChild(yearBadge);
        
        if (isMovie) {
            const duration = this.getAttribute('duration');
            if (duration) {
                const durationBadge = document.createElement('div');
                durationBadge.className = 'meta-badge badge-duration';
                durationBadge.innerHTML = `
                    <i class="fas fa-clock"></i>
                    <span>${duration}</span>
                `;
                modalMeta.appendChild(durationBadge);
            }
        } else {
            const seasons = this.getAttribute('seasons');
            const episodes = this.getAttribute('episodes');
            if (seasons) {
                const seasonsBadge = document.createElement('div');
                seasonsBadge.className = 'meta-badge badge-seasons';
                seasonsBadge.innerHTML = `
                    <i class="fas fa-tv"></i>
                    <span>${seasons} улирал</span>
                `;
                modalMeta.appendChild(seasonsBadge);
            }
            if (episodes) {
                const episodesBadge = document.createElement('div');
                episodesBadge.className = 'meta-badge badge-episodes';
                episodesBadge.innerHTML = `
                    <i class="fas fa-list"></i>
                    <span>${episodes} анги</span>
                `;
                modalMeta.appendChild(episodesBadge);
            }
        }
        
        const typeBadge = document.createElement('div');
        typeBadge.className = `meta-badge ${isMovie ? 'badge-type-movie' : 'badge-type-tv'}`;
        typeBadge.innerHTML = `
            <i class="${isMovie ? 'fas fa-film' : 'fas fa-tv'}"></i>
            <span>${isMovie ? 'Кино' : 'Цуврал'}</span>
        `;
        modalMeta.appendChild(typeBadge);
        
        const genreContainer = shadow.querySelector('#genre-tags');
        genreContainer.innerHTML = '';
        if (genreAttr) {
            try {
                const genres = JSON.parse(genreAttr);
                if (Array.isArray(genres)) {
                    genres.slice(0, 4).forEach(genre => {
                        const tag = document.createElement('span');
                        tag.className = 'genre-tag';
                        tag.textContent = genre;
                        genreContainer.appendChild(tag);
                    });
                }
            } catch (e) {
                console.error('Error parsing genres:', e);
            }
        }
        
        shadow.querySelector('.movie-description').textContent = description || 'Энэ киноны тухай дэлгэрэнгүй тайлбар байхгүй байна.';
        
        const castList = shadow.querySelector('#cast-list');
        castList.innerHTML = '';
        
        if (castAttr) {
            try {
                const cast = JSON.parse(castAttr);
                if (Array.isArray(cast)) {
                    cast.slice(0, 3).forEach(actorName => {
                        const nameParts = actorName.split(' ');
                        const initials = nameParts.length >= 2 
                            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                            : actorName.substring(0, 2).toUpperCase();
                        
                        const castDiv = document.createElement('div');
                        castDiv.className = 'cast-member';
                        castDiv.innerHTML = `
                            <div class="cast-avatar">${initials}</div>
                            <div class="cast-name">${actorName}</div>
                            <div class="cast-role">Гол дүр</div>
                        `;
                        castList.appendChild(castDiv);
                    });
                }
            } catch (e) {
                console.error('Error parsing cast:', e);
            }
        }
        
        const trailerBtn = shadow.querySelector('#trailer-btn');
        const trailerUrl = this.getAttribute('trailer');
        if (trailerUrl) {
            trailerBtn.dataset.trailerUrl = trailerUrl;
            trailerBtn.disabled = false;
        } else {
            trailerBtn.disabled = true;
            trailerBtn.innerHTML = '<i class="fas fa-ban"></i> Трейлер байхгүй';
        }
    }

    updateAuthUI() {
        const shadow = this.shadowRoot;
        const isLoggedIn = this.checkAuthStatus();
        const loginPrompt = shadow.querySelector('#login-prompt');
        
        if (!isLoggedIn) {
            loginPrompt.style.display = 'block';
        } else {
            loginPrompt.style.display = 'none';
        }
    }

    async handleUserAction(action) {
        const isLoggedIn = this.checkAuthStatus();
        const movieName = this.getAttribute('name');
        
        if (!isLoggedIn) {
            alert('Энэ үйлдлийг хийхийн тулд нэвтрэх шаардлагатай');
            this.goToLoginPage();
            return;
        }
        
        const shadow = this.shadowRoot;
        const movieId = parseInt(this.getAttribute('data-tmdb-id'));
        
        if (!movieId) {
            alert('Киноны ID олдсонгүй');
            return;
        }
        
        switch(action) {
            case 'watchlist':
                try {
                    const { authService } = await import('./auth-service.js');
                    const watchlistBtn = shadow.querySelector('#watchlist-btn');
                    
                    const user = authService.getCurrentUser();
                    const isInWatchlist = user?.watchlist?.includes(movieId) || false;
                    
                    if (isInWatchlist) {
                        await authService.removeFromWatchlist(movieId);
                        if (watchlistBtn) {
                            watchlistBtn.classList.remove('active');
                            watchlistBtn.innerHTML = '<i class="far fa-bookmark"></i> Watchlist';
                        }
                    } else {
                        await authService.addToWatchlist(movieId);
                        if (watchlistBtn) {
                            watchlistBtn.classList.add('active');
                            watchlistBtn.innerHTML = '<i class="fas fa-bookmark"></i> Нэмсэн';
                        }
                    }
                } catch (error) {
                    console.error('Watchlist error:', error);
                    alert(error.message || 'Watchlist шинэчлэхэд алдаа гарлаа');
                }
                break;
            case 'watched':
                const rating = prompt('Энэ киног 1-10-аар үнэлнэ үү:', '8');
                if (rating && rating >= 1 && rating <= 10) {
                    alert(`"${movieName}" кино үзсэн гэж тэмдэглэгдлээ! Үнэлгээ: ${rating}/10`);
                    const watchedBtn = shadow.querySelector('#watched-btn');
                    watchedBtn.classList.add('active');
                    watchedBtn.innerHTML = `<i class="fas fa-eye"></i> Үзсэн`;
                }
                break;
        }
    }

    showTrailer() {
        const trailerBtn = this.shadowRoot.querySelector('#trailer-btn');
        const trailerUrl = trailerBtn.dataset.trailerUrl || this.getAttribute('trailer');
        
        if (trailerUrl) {
            window.open(trailerUrl, '_blank');
        } else {
            alert('Трейлер холбоос олдсонгүй');
        }
    }

    goToDetailsPage() {
        const modal = this.shadowRoot.querySelector('.movie-modal');
        if (modal) {
            this.closeModal(modal);
        }
        
        const movieId = this.getAttribute('data-tmdb-id') || this.getAttribute('name');
        const category = this.getAttribute('category') || 'movies';
        
        if (movieId) {
            window.location.hash = `#/movie-details/${category}/${movieId}`;
        }
    }

    goToLoginPage() {
        window.location.hash = '#/login';
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }
}

customElements.define('movie-card', MovieCard);