// js/movie-detail-component.js
class MovieDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupTabs();
        this.setupButtons();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            this.setupTabs();
            this.setupButtons();
        }
    }

    static get observedAttributes() {
        return [
            'name', 
            'image', 
            'year-or-season', 
            'category',
            'description',
            'rating',
            'duration',
            'director',
            'cast',
            'genre',
            'trailer'
        ];
    }

    render() {
        const name = this.getAttribute('name') || 'Unknown Movie';
        const image = this.getAttribute('image') || 'placeholder.jpg';
        const yearOrSeason = this.getAttribute('year-or-season') || 'Unknown';
        const category = this.getAttribute('category') || 'movies';
        const description = this.getAttribute('description') || 'Тайлбар олдсонгүй.';
        const rating = this.getAttribute('rating') || 'N/A';
        const duration = this.getAttribute('duration') || '';
        const director = this.getAttribute('director') || '';
        const cast = this.getAttribute('cast') ? this.getAttribute('cast').split(',') : [];
        const genre = this.getAttribute('genre') ? this.getAttribute('genre').split(',') : [];
        const trailer = this.getAttribute('trailer') || '';

        this.shadowRoot.innerHTML = `
            <style>
                /* USE YOUR EXISTING CSS STYLES */
                :host {
                    display: block;
                    color: white;
                    font-family: "Nunito", "BBH Sans Bogle", sans-serif;
                }

                .movie-details-container {
                    display: grid;
                    grid-template-columns: 300px 1fr 200px;
                    gap: 2rem;
                    padding: 2rem;
                }

                /* Left column */
                .left-column {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 300px;
                }

                /* Middle column */
                .middle-column {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    width: 100%;
                }

                /* Right column */
                .right-column {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }

                /* Movie poster image */
                .movie-poster {
                    width: 100%;
                    height: 450px;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.5);
                    object-fit: cover;
                }

                /* Trailer button */
                .trailer-btn {
                    background-color: #2e2e2e;
                    color: #fff;
                    border: none;
                    padding: 0.7rem 1rem;
                    border-radius: 20px;
                    width: 100%;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.2s;
                    margin-top: 1rem;
                    font-family: "Nunito", sans-serif;
                }

                .trailer-btn:hover {
                    background-color: #444;
                }

                /* Info rating row */
                .info-rating-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    margin-bottom: 1.5rem;
                }

                .title-info {
                    display: flex;
                    flex-direction: column;
                }

                .movie-title {
                    margin: 0;
                    font-size: 2rem;
                    color: #fff;
                }

                .movie-info {
                    margin-top: 0.3rem;
                    font-size: 1rem;
                    color: #aaa;
                }

                /* Ratings */
                .ratings {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .wave-rating, .user-rating {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.9rem;
                    color: #fff;
                }

                .wave-rating i {
                    color: #ffcc00;
                }

                .user-rating i {
                    color: #aaa;
                }

                /* Description */
                .movie-description {
                    line-height: 1.5;
                    color: #ccc;
                    margin-bottom: 1.5rem;
                }

                /* Extra section (Tabs) */
                .extra-section {
                    background-color: #1e1e1e;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                }

                .extra-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .extra-tabs .tab-btn {
                    background-color: #2e2e2e;
                    border: none;
                    padding: 0.5rem 1rem;
                    color: #fff;
                    cursor: pointer;
                    border-radius: 6px;
                    font-weight: bold;
                    transition: background 0.2s;
                    font-family: "Nunito", sans-serif;
                }

                .extra-tabs .tab-btn.active {
                    background-color: #00ffff;
                    color: black;
                }

                /* Tab content */
                .tab-content {
                    display: none;
                    color: #fff;
                }

                .tab-content.active {
                    display: block;
                }

                /* People grid (cast) */
                .people-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 1rem;
                }

                .person {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #fff;
                }

                .person-placeholder {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #00ffff, #007bff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: black;
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 0.3rem;
                }

                /* Details list */
                .details-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .details-list li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    color: #ddd;
                }

                .details-list li strong {
                    color: #00ffff;
                    margin-right: 0.5rem;
                }

                /* Right column buttons */
                .right-column button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    background-color: #2e2e2e;
                    color: #fff;
                    border: none;
                    padding: 0.7rem 1rem;
                    border-radius: 20px;
                    width: 12rem;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.2s ease;
                    font-family: "Nunito", sans-serif;
                }

                .right-column button i {
                    font-size: 1rem;
                }

                .right-column button:hover {
                    background-color: #444;
                }

                .watch-now-btn {
                    background-color: #2e2e2e;
                }

                .add-watchlist-btn {
                    background-color: #2e2e2e;
                }

                .mark-watched-btn {
                    background-color: #2e2e2e;
                }

                /* Responsive */
                @media (max-width: 1200px) {
                    .movie-details-container {
                        grid-template-columns: 250px 1fr;
                    }
                    .right-column {
                        grid-column: 1 / -1;
                        flex-direction: row;
                        flex-wrap: wrap;
                    }
                    .right-column button {
                        width: auto;
                        min-width: 180px;
                    }
                }

                @media (max-width: 768px) {
                    .movie-details-container {
                        grid-template-columns: 1fr;
                        padding: 1rem;
                        gap: 1.5rem;
                    }
                    .left-column {
                        width: 100%;
                        max-width: 300px;
                        margin: 0 auto;
                    }
                    .movie-poster {
                        height: 400px;
                    }
                    .movie-title {
                        font-size: 1.8rem;
                    }
                    .people-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .right-column {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .right-column button {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .movie-poster {
                        height: 350px;
                    }
                    .movie-title {
                        font-size: 1.5rem;
                    }
                    .people-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .extra-tabs {
                        flex-wrap: wrap;
                    }
                }
            </style>

            <div class="movie-details-container">
                <!-- LEFT COLUMN: Poster & Trailer Button -->
                <div class="left-column">
                    <img src="images/${image}" alt="${name}" class="movie-poster" 
                         onerror="this.src='images/placeholder.jpg'">
                    ${trailer ? `<button class="trailer-btn" id="trailer-btn">Трейлэр үзэх</button>` : ''}
                </div>

                <!-- MIDDLE COLUMN: Info, Description, Tabs -->
                <div class="middle-column">
                    <div class="info-rating-row">
                        <div class="title-info">
                            <h1 class="movie-title">${name}</h1>
                            <p class="movie-info">${yearOrSeason}</p>
                        </div>
                        <div class="ratings">
                            <div class="wave-rating">
                                <span>Wave: </span>
                                <i class="fas fa-star"></i>
                                <span>${rating}</span>
                            </div>
                            <div class="user-rating">
                                <span>Your: </span>
                                <i class="far fa-star"></i>
                            </div>
                        </div>
                    </div>

                    <p class="movie-description">${description}</p>

                    <div class="extra-section">
                        <div class="extra-tabs">
                            <button class="tab-btn active" data-tab="cast">Жүжигчид</button>
                            <button class="tab-btn" data-tab="genres">Төрөл</button>
                            <button class="tab-btn" data-tab="details">Нэмэлт мэдээлэл</button>
                        </div>

                        <!-- CAST TAB -->
                        <div class="tab-content active" id="cast">
                            ${cast.length > 0 ? `
                                <div class="people-grid">
                                    ${cast.slice(0, 5).map(actor => `
                                        <div class="person">
                                            <div class="person-placeholder">${actor.charAt(0)}</div>
                                            <p>${actor}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p style="color: #aaa; text-align: center; padding: 1rem;">
                                    Жүжигчдийн мэдээлэл олдсонгүй
                                </p>
                            `}
                        </div>

                        <!-- GENRES TAB -->
                        <div class="tab-content" id="genres">
                            ${genre.length > 0 ? `
                                <p style="font-size: 1.1rem; line-height: 1.8;">
                                    ${genre.map(g => 
                                        `<span style="display: inline-block; background: rgba(0, 255, 255, 0.1); 
                                          padding: 0.3rem 0.8rem; margin: 0.2rem; border-radius: 20px; 
                                          border: 1px solid rgba(0, 255, 255, 0.3);">
                                            ${g.charAt(0).toUpperCase() + g.slice(1)}
                                        </span>`
                                    ).join(' ')}
                                </p>
                            ` : '<p>Төрлийн мэдээлэл олдсонгүй</p>'}
                        </div>

                        <!-- DETAILS TAB -->
                        <div class="tab-content" id="details">
                            <ul class="details-list">
                                ${director ? `<li><strong>Найруулагч:</strong> ${director}</li>` : ''}
                                ${duration ? `<li><strong>Үргэлжлэх хугацаа:</strong> ${duration}</li>` : ''}
                                ${rating !== 'N/A' ? `<li><strong>Үнэлгээ:</strong> ${rating}/10</li>` : ''}
                                ${genre.length ? `<li><strong>Төрөл:</strong> ${genre.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}</li>` : ''}
                                <li><strong>Ангилал:</strong> ${category === 'movies' ? 'Кино' : 'TV Цуврал'}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Action Buttons -->
                <div class="right-column">
                    <button class="watch-now-btn" id="watch-now-btn">
                        <i class="fas fa-play"></i> Үзэх
                    </button>
                    <button class="add-watchlist-btn" id="add-watchlist-btn">
                        <i class="fas fa-plus"></i> Жагсаалтад нэмэх
                    </button>
                    <button class="mark-watched-btn" id="mark-watched-btn">
                        <i class="fas fa-eye"></i> Үзсэн
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Trailer button
        const trailerBtn = this.shadowRoot.getElementById('trailer-btn');
        if (trailerBtn) {
            trailerBtn.addEventListener('click', () => {
                const trailerUrl = this.getAttribute('trailer');
                if (trailerUrl) {
                    window.open(trailerUrl, '_blank');
                }
            });
        }

        // Watch now button
        const watchNowBtn = this.shadowRoot.getElementById('watch-now-btn');
        if (watchNowBtn) {
            watchNowBtn.addEventListener('click', () => {
                alert('Үзэх функц идэвхжлээ. Энэ кино үзэх боломжтой болохыг хүлээнэ үү!');
            });
        }

        // Add to watchlist button
        const addWatchlistBtn = this.shadowRoot.getElementById('add-watchlist-btn');
        if (addWatchlistBtn) {
            addWatchlistBtn.addEventListener('click', () => {
                const movieName = this.getAttribute('name');
                alert(`"${movieName}" кино жагсаалтад амжилттай нэмэгдлээ!`);
                // Here you would normally save to localStorage or send to backend
            });
        }

        // Mark as watched button
        const markWatchedBtn = this.shadowRoot.getElementById('mark-watched-btn');
        if (markWatchedBtn) {
            markWatchedBtn.addEventListener('click', () => {
                const movieName = this.getAttribute('name');
                alert(`"${movieName}" киног үзсэн гэж тэмдэглэлээ!`);
                // Here you would normally save to localStorage or send to backend
            });
        }
    }

    setupTabs() {
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-btn');
        const tabContents = this.shadowRoot.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === target) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    setupButtons() {
        // Already handled in setupEventListeners
    }
}

// Register the component
customElements.define('movie-detail', MovieDetail);