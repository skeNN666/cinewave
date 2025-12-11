// movie-card-component.js
class MovieCard extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        this.movieData = null;
        this.movieId = null;
        
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
            border-bottom: 1px solid #eee;
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
            color: #666;
            line-height: 1;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
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
        }
        
        .modal-poster {
            width: 100%;
            border-radius: 10px;
            object-fit: cover;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        /* Column 2: Movie Info */
        .info-column {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .movie-info-section {
            background: #1e1e1e;
            border-radius: 10px;
            padding: 20px;
        }
        
        .section-title {
            font-size: 1.2rem;
            color: #fff;
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #fff;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px;
        }
        
        .info-label {
            font-weight: 600;
            color: #fff;
            min-width: 100px;
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
        
        .actors-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .actor-name {
            font-weight: 500;
            color: #333;
        }
        
        .actor-role {
            font-size: 0.9rem;
            color: #666;
        }
        
        /* Column 3: Action Buttons */
        .actions-column {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .action-btn {
            border: none;
            border-radius: 10px;
            padding: 16px 20px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .watch-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .watch-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .add-to-list-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .add-to-list-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .watched-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .watched-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .show-more-btn {
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.3s ease;
        }
        
        .show-more-btn:hover {
            background: #5a6268;
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
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
            color: #fff;
        }

        .genre-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
        }
        
        .genre-tag {
            background: #e9ecef;
            color: #495057;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
        }
        
        @media (max-width: 1024px) {
            .modal-body {
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            
            .actions-column {
                grid-column: span 2;
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .action-btn {
                flex: 1;
                min-width: 150px;
            }
        }
        
        @media (max-width: 768px) {
            .modal-body {
                grid-template-columns: 1fr;
            }
            
            .actions-column {
                grid-column: span 1;
                flex-direction: column;
            }
            
            .modal-content {
                padding: 15px;
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
                <!-- Column 1: Poster & Trailer -->
                <div class="poster-column">
                    <img class="modal-poster" src="" alt="">
                    <button class="trailer-btn">
                        <span>Трейлер үзэх</span>
                    </button>
                </div>
                
                <!-- Column 2: Movie Information -->
                <div class="info-column">
                    <div class="movie-info-section">
                        <h3 class="section-title">Киноны мэдээлэл</h3>
                        <div class="info-grid">
                            <div class="info-label">Он/Үргэлжлэх Хугацаа:</div>
                            <div class="info-value modal-year"></div>
                            
                            <div class="info-label">Төрөл:</div>
                            <div class="info-value modal-type"></div>
                            
                            <div class="info-label">Үнэлгээ:</div>
                            <div class="info-value">
                                <div class="rating">
                                    <span class="stars"></span>
                                    <span class="rating-text"></span>
                                </div>
                            </div>
                            
                            <div class="info-label">Үргэлжлэх хугацаа:</div>
                            <div class="info-value modal-duration"></div>
                            
                            <div class="info-label">Жанр:</div>
                            <div class="info-value">
                                <div class="genre-tags"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="movie-info-section">
                        <h3 class="section-title">Гол дүрүүд</h3>
                        <div class="actors-list"></div>
                    </div>
                    
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
                </div>
                
                <!-- Column 3: Action Buttons -->
                <div class="actions-column">
                    <button class="action-btn watch-btn">Үзэх</button>
                    <button class="action-btn add-to-list-btn">Жагсаалтад нэмэх</button>
                    <button class="action-btn watched-btn">Үзсэн</button>
                </div>
            </div>
        </div>
    </div>
`;
    }

    async connectedCallback() {
        // Get movie ID from attribute
        this.movieId = this.getAttribute('data-movie-id');
        if (this.movieId !== null) {
            await this.loadMovieData();
        } else {
            // Fallback to old attribute system
            this.updateContent();
        }
        this.addClickHandler();
        this.setupModal();
    }

    async loadMovieData() {
        try {
            // Import the database module
            const { loadMovieDatabase } = await import('./database.js');
            const movieDatabase = await loadMovieDatabase();
            
            // Find movie by index (or you could use a unique ID)
            const movieIndex = parseInt(this.movieId);
            if (movieIndex >= 0 && movieIndex < movieDatabase.length) {
                this.movieData = movieDatabase[movieIndex];
                this.updateContentFromData();
            } else {
                console.error('Movie not found with ID:', this.movieId);
            }
        } catch (error) {
            console.error('Error loading movie data:', error);
        }
    }

    updateContentFromData() {
        if (!this.movieData) return;
        
        const shadow = this.shadowRoot;
        const currentPath = window.location.pathname;
        
        // Get image path
        let imagePath;
        if (currentPath.includes('/html/') || currentPath.includes('movie-detail.html')) {
            imagePath = `../images/${this.movieData.image}`;
        } else {
            imagePath = `frontend/images/${this.movieData.image}`;
        }
        
        // Update basic card content
        shadow.querySelector('h3').textContent = this.movieData.name;
        shadow.querySelector('img').src = imagePath;
        shadow.querySelector('img').alt = this.movieData.name;
        shadow.querySelector('.genre-year').textContent = this.movieData.yearOrSeason;
        shadow.querySelector('.type').textContent = this.movieData.category === 'movies' ? 'Кино' : 'Цуврал';
    }

    updateContent() {
        // Old method for backward compatibility
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
        const actionBtns = this.shadowRoot.querySelectorAll('.action-btn');
        
        // Close modal
        closeBtn.addEventListener('click', () => this.closeModal(modal, moreContent, showMoreBtn));
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal, moreContent, showMoreBtn);
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal(modal, moreContent, showMoreBtn);
            }
        });
        
        // Trailer button
        trailerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showTrailer();
        });
        
        // Show more button
        showMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreContent.classList.toggle('expanded');
            showMoreBtn.textContent = moreContent.classList.contains('expanded') 
                ? 'Багасгах' 
                : 'Дэлгэрэнгүй үзэх';
        });
        
        // Action buttons
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.textContent;
                this.handleAction(action);
            });
        });
    }

    showMovieDetails() {
        const modal = this.shadowRoot.querySelector('.movie-modal');
        
        if (this.movieData) {
            // Use JSON data
            this.populateModalWithData();
        } else {
            // Fallback to old attribute system
            const movieName = this.getAttribute('name') || 'Unknown Movie';
            this.shadowRoot.querySelector('.modal-title').textContent = movieName;
            this.shadowRoot.querySelector('.modal-poster').src = this.shadowRoot.querySelector('img').src;
            this.shadowRoot.querySelector('.modal-poster').alt = movieName;
            this.shadowRoot.querySelector('.modal-year').textContent = this.getAttribute('year-or-season') || 'Unknown';
            
            const category = this.getAttribute('category');
            this.shadowRoot.querySelector('.modal-type').textContent = category === 'movies' ? 'Кино' : 'Цуврал';
        }
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    populateModalWithData() {
        if (!this.movieData) return;
        
        const shadow = this.shadowRoot;
        
        // Basic info
        shadow.querySelector('.modal-title').textContent = this.movieData.name;
        shadow.querySelector('.modal-poster').src = shadow.querySelector('img').src;
        shadow.querySelector('.modal-poster').alt = this.movieData.name;
        shadow.querySelector('.modal-year').textContent = this.movieData.yearOrSeason;
        shadow.querySelector('.modal-type').textContent = this.movieData.category === 'movies' ? 'Кино' : 'Цуврал';
        shadow.querySelector('.modal-duration').textContent = this.movieData.duration || 'Н/М';
        
        // Rating (convert to stars)
        const rating = this.movieData.rating || 0;
        const starCount = Math.round(rating / 2); // Convert 0-10 to 0-5 stars
        const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
        shadow.querySelector('.stars').textContent = stars;
        shadow.querySelector('.rating-text').textContent = `${rating}/10`;
        
        // Genres
        const genreTags = this.movieData.genre || [];
        const genreContainer = shadow.querySelector('.genre-tags');
        genreContainer.innerHTML = '';
        genreTags.forEach(genre => {
            const tag = document.createElement('span');
            tag.className = 'genre-tag';
            tag.textContent = genre;
            genreContainer.appendChild(tag);
        });
        
        // Description
        shadow.querySelector('.movie-description').textContent = this.movieData.description || '';
        
        // Cast
        const cast = this.movieData.cast || [];
        const actorsList = shadow.querySelector('.actors-list');
        actorsList.innerHTML = '';
        cast.forEach(actor => {
            const actorDiv = document.createElement('div');
            actorDiv.className = 'actor';
            
            // Get initials for avatar
            const nameParts = actor.split(' ');
            const initials = nameParts.length >= 2 
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : actor.substring(0, 2).toUpperCase();
            
            actorDiv.innerHTML = `
                <div class="actor-avatar">${initials}</div>
                <div>
                    <div class="actor-name">${actor}</div>
                    <div class="actor-role">Гол дүр</div>
                </div>
            `;
            actorsList.appendChild(actorDiv);
        });
        
        // Additional details
        const moreDetails = shadow.querySelector('.more-details');
        moreDetails.innerHTML = '';
        
        if (this.movieData.director) {
            const p = document.createElement('p');
            p.textContent = `• Найруулагч: ${this.movieData.director}`;
            moreDetails.appendChild(p);
        }
        
        // Add more details as needed
        const yearMatch = this.movieData.yearOrSeason.match(/\d{4}/);
        if (yearMatch) {
            const p = document.createElement('p');
            p.textContent = `• Бүтээсэн он: ${yearMatch[0]}`;
            moreDetails.appendChild(p);
        }
        
        // Set trailer button data
        const trailerBtn = shadow.querySelector('.trailer-btn');
        if (this.movieData.trailer) {
            trailerBtn.dataset.trailerUrl = this.movieData.trailer;
        }
    }

    closeModal(modal, moreContent, showMoreBtn) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (moreContent && showMoreBtn) {
            moreContent.classList.remove('expanded');
            showMoreBtn.textContent = 'Дэлгэрэнгүй үзэх';
        }
    }

    showTrailer() {
        const trailerBtn = this.shadowRoot.querySelector('.trailer-btn');
        const trailerUrl = trailerBtn.dataset.trailerUrl || this.movieData?.trailer;
        
        if (trailerUrl) {
            // Open trailer in new tab
            window.open(trailerUrl, '_blank');
        } else {
            alert('Трейлер холбоос олдсонгүй');
        }
    }

    handleAction(action) {
        const movieName = this.movieData?.name || this.getAttribute('name');
        
        switch(action) {
            case 'Үзэх':
                alert(`"${movieName}" кино эхлэх болно...`);
                // Implement movie player
                break;
            case 'Жагсаалтад нэмэх':
                alert(`"${movieName}" амжилттай жагсаалтад нэмэгдлээ!`);
                // Add to user's list
                break;
            case 'Үзсэн':
                alert(`"${movieName}" кино үзсэн тэмдэглэгдлээ!`);
                // Mark as watched
                break;
        }
    }
}

customElements.define('movie-card', MovieCard);