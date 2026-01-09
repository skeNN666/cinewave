// Simplified Movie Card with Quick Preview Modal
class MovieCard extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        
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
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #ccc;
            font-size: 0.9rem;
        }

        .meta-item i {
            color: #4da3ff;
        }

        .rating-badge {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #000;
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 5px;
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

            .meta-item {
                font-size: 0.85rem;
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
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span id="modal-year"></span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span id="modal-duration"></span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-film"></i>
                            <span class="modal-type"></span>
                        </div>
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
        
        // Ensure body overflow is reset when navigating away
        window.addEventListener('hashchange', () => {
            document.body.style.overflow = 'auto';
            // Close modal if open when navigating
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
    }

    async loadTMDBData(tmdbId, mediaType) {
        const shadow = this.shadowRoot;
        
        try {
            // Access tmdbService from window (for non-module scripts) or use imported version
            const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
            
            if (!service) {
                throw new Error('TMDB Service is not available');
            }
            
            const details = mediaType === 'movie' 
                ? await service.getMovieDetails(tmdbId)
                : await service.getTVDetails(tmdbId);
            
            if (!details) throw new Error('TMDB-аас мэдээлэл ирээгүй');
            
            // Debug: Log cast data
            console.log('📋 Cast data received:', details.cast?.length || 0, 'actors');
            if (details.cast && details.cast.length > 0) {
                console.log('Sample cast:', details.cast.slice(0, 3).map(a => ({ name: a.name, character: a.character, hasImage: !!a.profile_path })));
            }
            
            this.populateQuickPreview(details);
            
        } catch (error) {
            console.error('TMDB мэдээлэл авахад алдаа:', error);
            this.loadLocalData();
        }
    }

    populateQuickPreview(details) {
        const shadow = this.shadowRoot;
        
        // Header
        shadow.querySelector('.modal-title').textContent = details.name;
        // Use backdrop image if available, otherwise fall back to poster
        const backdropImage = details.backdrop || details.image;
        shadow.querySelector('.modal-backdrop').src = backdropImage;
        shadow.querySelector('.modal-backdrop').alt = details.name;
        shadow.querySelector('.modal-type').textContent = details.category === 'movies' ? 'Кино' : 'Цуврал';
        
        // Meta info
        shadow.querySelector('#modal-year').textContent = details.year || 'N/A';
        
        const durationEl = shadow.querySelector('#modal-duration');
        // For TV series, show seasons/episodes; for movies, show runtime
        if (details.category === 'tv') {
            // TV Series: Show seasons and episodes in format "S3/EP24"
            if (details.seasons && details.episodes) {
                durationEl.textContent = `S${details.seasons}/EP${details.episodes}`;
            } else if (details.episodes) {
                durationEl.textContent = `EP${details.episodes}`;
            } else if (details.seasons) {
                durationEl.textContent = `S${details.seasons}`;
            } else {
                durationEl.textContent = 'N/A';
            }
        } else {
            // Movies: Show runtime/duration
            if (details.duration && details.duration !== 'Тодорхойгүй') {
                durationEl.textContent = details.duration;
            } else if (details.runtime) {
                const hours = Math.floor(details.runtime / 60);
                const minutes = details.runtime % 60;
                durationEl.textContent = hours > 0 ? `${hours}ц ${minutes}м` : `${minutes}м`;
            } else {
                durationEl.textContent = 'N/A';
            }
        }
        
        // Rating
        if (details.rating) {
            const rating = parseFloat(details.rating);
            shadow.querySelector('#modal-rating').textContent = rating.toFixed(1);
        }
        
        // Genres (max 4)
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
        
        // Description (truncated to 3 lines)
        shadow.querySelector('.movie-description').textContent = 
            details.description || 'Энэ киноны тухай дэлгэрэнгүй тайлбар байхгүй байна.';
        
        // All cast members
        this.displayTopCast(details.cast || []);
        
        // Trailer
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
        
        // Show all cast members
        console.log(`🎭 Displaying ${cast.length} cast members`);
        
        cast.forEach((actor, index) => {
            const castDiv = document.createElement('div');
            castDiv.className = 'cast-member';
            
            let avatarHTML = '';
            if (actor.profile_path) {
                // Ensure profile_path is a valid URL
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
        shadow.querySelector('.modal-type').textContent = category === 'movies' ? 'Кино' : 'Цуврал';
        
        // Year
        const yearMatch = yearOrSeason.match(/\d{4}/);
        shadow.querySelector('#modal-year').textContent = yearMatch ? yearMatch[0] : 'N/A';
        
        // Duration/Episodes - Show seasons/episodes for TV series, duration for movies
        const durationEl = shadow.querySelector('#modal-duration');
        if (category === 'tv') {
            // TV Series: Try to get seasons and episodes from attributes
            const seasons = this.getAttribute('seasons');
            const episodes = this.getAttribute('episodes');
            if (seasons && episodes) {
                durationEl.textContent = `S${seasons}/EP${episodes}`;
            } else if (episodes) {
                durationEl.textContent = `EP${episodes}`;
            } else if (seasons) {
                durationEl.textContent = `S${seasons}`;
            } else {
                durationEl.textContent = 'N/A';
            }
        } else {
            // Movies: Show duration
            const duration = this.getAttribute('duration');
            durationEl.textContent = duration || 'N/A';
        }
        
        // Rating
        if (rating) {
            shadow.querySelector('#modal-rating').textContent = parseFloat(rating).toFixed(1);
        }
        
        // Genres
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
        
        // Description
        shadow.querySelector('.movie-description').textContent = description || 'Энэ киноны тухай дэлгэрэнгүй тайлбар байхгүй байна.';
        
        // Cast
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
        
        // Trailer
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

    handleUserAction(action) {
        const isLoggedIn = this.checkAuthStatus();
        const movieName = this.getAttribute('name');
        
        if (!isLoggedIn) {
            alert('Энэ үйлдлийг хийхийн тулд нэвтрэх шаардлагатай');
            this.goToLoginPage();
            return;
        }
        
        const shadow = this.shadowRoot;
        
        switch(action) {
            case 'watchlist':
                alert(`"${movieName}" кино watchlist-д нэмэгдлээ!`);
                const watchlistBtn = shadow.querySelector('#watchlist-btn');
                watchlistBtn.classList.add('active');
                watchlistBtn.innerHTML = '<i class="fas fa-bookmark"></i> Нэмсэн';
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
        // Close the modal first
        const modal = this.shadowRoot.querySelector('.movie-modal');
        if (modal) {
            this.closeModal(modal);
        }
        
        const movieId = this.getAttribute('data-tmdb-id') || this.getAttribute('name');
        const category = this.getAttribute('category') || 'movies';
        
        // Navigate to movie details page
        // Note: You'll need to create the movie-details route and component
        window.location.hash = `#/movie-details/${category}/${movieId}`;
    }

    goToLoginPage() {
        // Use hash-based routing to navigate to login page
        window.location.hash = '#/login';
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
        // Always ensure body overflow is reset
        document.body.style.overflow = 'auto';
    }
}

customElements.define('movie-card', MovieCard);