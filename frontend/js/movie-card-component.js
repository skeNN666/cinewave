// movie-card-component.js
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
        
        .actors-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
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
        
        /* Column 3: Action Buttons */
        .actions-column {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .action-btn {
            border: none;
            border-radius: 8px;
            padding: 14px 20px;
            font-size: 1rem;
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
            background: #2e2e2e;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(194, 27, 227, 0.4);
        }
        
        .add-to-list-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .add-to-list-btn:hover {
            background: #2e2e2e;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(194, 27, 227, 0.4);
        }
        
        .watched-btn {
            background: #1e1e1e;
            color: white;
        }
        
        .watched-btn:hover {
            background: #2e2e2e;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(194, 27, 227, 0.4);
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

        .movie-description {
            color: #ccc;
            line-height: 1.6;
            margin: 0;
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
                margin: 10px;
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

    connectedCallback() {
        this.updateContent();
        this.addClickHandler();
        this.setupModal();
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
        
        // Trailer button - updated
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
        const shadow = this.shadowRoot;
        
        // Get data from attributes
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
        
        // Update modal content
        shadow.querySelector('.modal-title').textContent = movieName;
        shadow.querySelector('.modal-poster').src = shadow.querySelector('img').src;
        shadow.querySelector('.modal-poster').alt = movieName;
        shadow.querySelector('.modal-year').textContent = yearOrSeason;
        shadow.querySelector('.modal-type').textContent = category === 'movies' ? 'Кино' : 'Цуврал';
        
        // Store trailer URL in button data attribute
        const trailerBtn = shadow.querySelector('.trailer-btn');
        if (trailerUrl) {
            trailerBtn.dataset.trailerUrl = trailerUrl;
        }
        
        // Update rating if available
        if (rating) {
            const ratingNum = parseFloat(rating);
            const starCount = Math.round(ratingNum / 2); // Convert 0-10 to 0-5 stars
            const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
            shadow.querySelector('.stars').textContent = stars;
            shadow.querySelector('.rating-text').textContent = `${rating}/10`;
        } else {
            // Default rating
            shadow.querySelector('.stars').textContent = '★★★☆☆';
            shadow.querySelector('.rating-text').textContent = '7.5/10';
        }
        
        // Update genres if available
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
        
        // Update description if available
        if (description) {
            shadow.querySelector('.movie-description').textContent = description;
        } else {
            shadow.querySelector('.movie-description').textContent = 'Энэ киноны тухай дэлгэрэнгүй тайлбар байхгүй байна.';
        }
        
        // Update cast if available
        const actorsList = shadow.querySelector('.actors-list');
        actorsList.innerHTML = '';
        
        if (castAttr) {
            try {
                const cast = JSON.parse(castAttr);
                if (Array.isArray(cast) && cast.length > 0) {
                    // Show up to 4 actors
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
        
        // Update additional details
        const moreDetails = shadow.querySelector('.more-details');
        moreDetails.innerHTML = '';
        
        if (director) {
            const p = document.createElement('p');
            p.textContent = `• Найруулагч: ${director}`;
            moreDetails.appendChild(p);
        }
        
        // Extract year from yearOrSeason for additional info
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
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    addActorToModal(actorName, container) {
        const actorDiv = document.createElement('div');
        actorDiv.className = 'actor';
        
        // Get initials for avatar
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

    showTrailer() {
        const trailerBtn = this.shadowRoot.querySelector('.trailer-btn');
        const trailerUrl = trailerBtn.dataset.trailerUrl || this.getAttribute('trailer');
        
        if (trailerUrl) {
            // Open trailer in new tab
            window.open(trailerUrl, '_blank', 'noopener,noreferrer');
        } else {
            alert('Трейлер холбоос олдсонгүй. Уучлаарай!');
        }
    }

    handleAction(action) {
        const movieName = this.getAttribute('name') || 'Unknown Movie';
        
        switch(action) {
            case 'Үзэх':
                alert(`"${movieName}" кино эхлэх болно...`);
                break;
            case 'Жагсаалтад нэмэх':
                alert(`"${movieName}" амжилттай жагсаалтад нэмэгдлээ!`);
                break;
            case 'Үзсэн':
                alert(`"${movieName}" кино үзсэн тэмдэглэгдлээ!`);
                break;
        }
    }
}

customElements.define('movie-card', MovieCard);