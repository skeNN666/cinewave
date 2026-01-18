// Movie Details Component - Comprehensive movie/TV information display
class MovieDetailsComponent extends HTMLElement {
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
            // Ensure render has been called first
            if (!this.shadowRoot.querySelector('.movie-details-container')) {
                this.render();
            }
            
            if (name === 'movie-id') {
                this.movieId = newValue;
            } else if (name === 'category') {
                this.category = newValue;
            }
            if (this.movieId && this.category) {
                // Use setTimeout to ensure DOM is ready
                setTimeout(() => {
                    this.loadMovieDetails();
                }, 0);
            }
        }
    }

    connectedCallback() {
        this.render();
        const movieId = this.getAttribute('movie-id') || this.movieId;
        const category = this.getAttribute('category') || this.category;
        
        if (movieId && category) {
            this.movieId = movieId;
            this.category = category;
            this.loadMovieDetails();
        } else {
            // Try to get from URL hash
            const hash = window.location.hash;
            const match = hash.match(/#\/movie-details\/(movies|tv)\/(\d+)/);
            if (match) {
                this.category = match[1];
                this.movieId = match[2];
                this.loadMovieDetails();
            }
        }
        
        // Listen for auth state changes
        window.addEventListener('storage', () => {
            this.updateAuthUI();
        });
        
        // Also check auth state on hash change (in case user just logged in)
        window.addEventListener('hashchange', () => {
            setTimeout(() => this.updateAuthUI(), 500);
        });
    }

    render() {
        // Only render if not already rendered
        if (this.shadowRoot.querySelector('.movie-details-container')) {
            return;
        }
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                /* Ensure Font Awesome icons render */
                .fas::before, .far::before, .fab::before {
                    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
                    display: inline-block;
                }

                .movie-details-container {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
                    color: #fff;
                    padding: 0;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 60vh;
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

                .error-container {
                    text-align: center;
                    padding: 60px 20px;
                    color: #ff4757;
                }

                .hero-section {
                    position: relative;
                    width: 100%;
                    margin: 0 0 40px 0;
                    border-radius: 0;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                }

                .hero-backdrop {
                    width: 100%;
                    height: 600px;
                    object-fit: cover;
                    filter: brightness(0.4);
                }

                .hero-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.95), transparent);
                    padding: 60px 40px 40px;
                }

                .back-button {
                    position: fixed;
                    top: 100px;
                    left: 30px;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border: none;
                    color: #fff;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 100;
                }

                .back-button:hover {
                    background: rgba(77, 163, 255, 0.8);
                    transform: translateX(-5px);
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    margin-bottom: 15px;
                    text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
                }

                .hero-tagline {
                    font-size: 1.3rem;
                    color: #ccc;
                    font-style: italic;
                    margin-bottom: 25px;
                }

                .hero-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    align-items: center;
                    margin-bottom: 20px;
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

                .action-buttons {
                    display: flex;
                    gap: 15px;
                    margin-top: 25px;
                    flex-wrap: wrap;
                }

                .action-btn {
                    padding: 14px 28px;
                    border: none;
                    border-radius: 14px;
                    font-size: 1.05rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    overflow: hidden;
                }

                .action-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .action-btn:hover::before {
                    left: 100%;
                }

                .action-btn i {
                    font-size: 1.2rem;
                    transition: transform 0.3s ease;
                }

                .action-btn:hover i {
                    transform: scale(1.1);
                }

                .primary-action {
                    background: linear-gradient(135deg, #4da3ff, #667eea);
                    color: white;
                    box-shadow: 0 6px 20px rgba(77, 163, 255, 0.4), 0 0 0 0 rgba(77, 163, 255, 0.4);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }

                .primary-action:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 8px 25px rgba(77, 163, 255, 0.6), 0 0 20px rgba(77, 163, 255, 0.3);
                }

                .primary-action:active {
                    transform: translateY(-1px) scale(0.98);
                }

                .secondary-action {
                    background: rgba(255, 255, 255, 0.12);
                    backdrop-filter: blur(12px);
                    border: 2px solid rgba(255, 255, 255, 0.25);
                    color: white;
                }

                .secondary-action:hover {
                    background: rgba(255, 255, 255, 0.18);
                    border-color: rgba(255, 255, 255, 0.4);
                    transform: translateY(-2px);
                }

                .icon-action-btn {
                    padding: 14px;
                    border: none;
                    border-radius: 14px;
                    font-size: 1.05rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    overflow: hidden;
                    width: 50px;
                    min-width: 50px;
                }

                .icon-action-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .icon-action-btn:hover::before {
                    left: 100%;
                }

                .icon-action-btn i {
                    font-size: 1.2rem;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }

                .icon-action-btn:hover i {
                    transform: scale(1.1);
                }

                .icon-action-btn span {
                    white-space: nowrap;
                    opacity: 0;
                    width: 0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .icon-action-btn:hover {
                    width: auto;
                    padding-right: 28px;
                }

                .icon-action-btn:hover span {
                    opacity: 1;
                    width: auto;
                }

                .trailer-btn {
                    background: rgba(229, 9, 20, 0.2);
                    border: 2px solid rgba(229, 9, 20, 0.5);
                    color: #ff4757;
                }

                .trailer-btn:hover {
                    background: rgba(229, 9, 20, 0.3);
                    border-color: #e50914;
                }

                .watchlist-btn {
                    background: rgba(77, 163, 255, 0.15);
                    backdrop-filter: blur(12px);
                    border: 2px solid rgba(77, 163, 255, 0.4);
                    color: #4da3ff;
                }

                .watchlist-btn:hover {
                    background: rgba(77, 163, 255, 0.25);
                    border-color: #4da3ff;
                    transform: translateY(-2px);
                }

                .watchlist-btn.active {
                    background: rgba(77, 163, 255, 0.3);
                    border-color: #4da3ff;
                    color: #4da3ff;
                }

                .watched-btn {
                    background: rgba(0, 204, 102, 0.15);
                    backdrop-filter: blur(12px);
                    border: 2px solid rgba(0, 204, 102, 0.4);
                    color: #00cc66;
                }

                .watched-btn:hover {
                    background: rgba(0, 204, 102, 0.25);
                    border-color: #00cc66;
                    transform: translateY(-2px);
                }

                .watched-btn.active {
                    background: rgba(0, 204, 102, 0.3);
                    border-color: #00cc66;
                    color: #00cc66;
                }

                .icon-action-btn:disabled {
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

                .content-wrapper-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 40px;
                }

                .poster-section {
                    position: sticky;
                    top: 120px;
                    height: fit-content;
                }

                .poster-image {
                    width: 100%;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                    margin-bottom: 20px;
                }

                .details-main {
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                }

                .section {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 15px;
                    padding: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .section-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #4da3ff;
                }

                .section-title i {
                    font-size: 1.5rem;
                }

                .description {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: #ddd;
                    margin-bottom: 30px;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .info-item {
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    border-left: 3px solid #4da3ff;
                }

                .info-label {
                    font-size: 0.85rem;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }

                .info-value {
                    font-size: 1.1rem;
                    color: #fff;
                    font-weight: 600;
                }

                .cast-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .cast-grid.collapsed {
                    max-height: 300px;
                    overflow: hidden;
                }

                .cast-member {
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .cast-member:hover {
                    transform: translateY(-5px);
                }

                .cast-expand-btn {
                    grid-column: 1 / -1;
                    padding: 15px 30px;
                    background: rgba(77, 163, 255, 0.1);
                    border: 2px solid rgba(77, 163, 255, 0.3);
                    border-radius: 12px;
                    color: #4da3ff;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .cast-expand-btn:hover {
                    background: rgba(77, 163, 255, 0.2);
                    border-color: #4da3ff;
                    transform: translateY(-2px);
                }

                .cast-member.expand-indicator {
                    background: rgba(77, 163, 255, 0.1);
                    border: 2px dashed rgba(77, 163, 255, 0.4);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-height: 200px;
                }

                .cast-member.expand-indicator:hover {
                    background: rgba(77, 163, 255, 0.2);
                    border-color: #4da3ff;
                    transform: translateY(-5px);
                }

                .expand-icon {
                    font-size: 3rem;
                    color: #4da3ff;
                    margin-bottom: 10px;
                }

                .expand-text {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #4da3ff;
                    margin-bottom: 5px;
                }

                .expand-count {
                    font-size: 0.9rem;
                    color: #999;
                }

                .cast-avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin: 0 auto 12px;
                    border: 3px solid #4da3ff;
                    box-shadow: 0 4px 15px rgba(77, 163, 255, 0.3);
                }

                .cast-name {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 5px;
                }

                .cast-character {
                    font-size: 0.85rem;
                    color: #999;
                }

                .crew-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .crew-member {
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .crew-role {
                    font-size: 0.85rem;
                    color: #4da3ff;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .crew-name {
                    font-size: 1rem;
                    color: #fff;
                    font-weight: 600;
                }

                .genre-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 15px;
                }

                .genre-tag {
                    padding: 8px 16px;
                    background: rgba(77, 163, 255, 0.2);
                    border: 1px solid rgba(77, 163, 255, 0.4);
                    border-radius: 20px;
                    color: #4da3ff;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .similar-movies-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 25px;
                    margin-top: 25px;
                }

                .similar-movie-card {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .similar-movie-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(77, 163, 255, 0.3);
                    border-color: #4da3ff;
                }

                .similar-poster {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                }

                .similar-info {
                    padding: 15px;
                }

                .similar-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 8px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .similar-meta {
                    font-size: 0.85rem;
                    color: #999;
                }

                .companies-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-top: 15px;
                }

                .company-badge {
                    padding: 10px 18px;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    color: #fff;
                    font-size: 0.95rem;
                }

                .reviews-section {
                    margin-top: 20px;
                }

                .reviews-container {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .review-form {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 25px;
                }

                .review-form-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .review-form-title i {
                    color: #4da3ff;
                }

                .rating-input-group {
                    margin-bottom: 20px;
                }

                .rating-label {
                    display: block;
                    color: #ccc;
                    font-size: 0.95rem;
                    margin-bottom: 10px;
                    font-weight: 600;
                }

                .rating-controls {
                    display: grid;
                    grid-template-columns: 1fr 110px;
                    gap: 12px;
                    align-items: center;
                    width: 100%;
                    max-width: 560px;
                }

                .rating-slider {
                    width: 100%;
                }

                .rating-number {
                    width: 110px;
                    padding: 10px 12px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    background: rgba(0, 0, 0, 0.25);
                    color: #fff;
                    font-weight: 800;
                    outline: none;
                }

                .rating-number:focus {
                    border-color: rgba(77, 163, 255, 0.8);
                    box-shadow: 0 0 0 3px rgba(77, 163, 255, 0.15);
                }

                .rating-value-display {
                    margin-left: 12px;
                    font-weight: 800;
                    color: #4da3ff;
                    min-width: 70px;
                }

                .ratings-summary {
                    display: grid;
                    grid-template-columns: 1.1fr 2fr;
                    gap: 22px;
                    margin: 0 0 20px;
                    padding: 18px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .summary-left {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    justify-content: center;
                }

                .avg-score {
                    font-size: 2.8rem;
                    font-weight: 900;
                    line-height: 1;
                }

                .avg-score span {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #999;
                    margin-left: 8px;
                }

                .summary-subtext {
                    color: #bbb;
                    font-size: 0.95rem;
                }

                .histogram {
                    display: grid;
                    grid-template-columns: repeat(10, 1fr);
                    grid-template-rows: 150px 20px;
                    gap: 4px;
                    align-items: end;
                    width: 100%;
                    height: 170px;
                }

                .hist-bar-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                    justify-content: flex-end;
                }

                .hist-bar {
                    width: 100%;
                    max-width: 20px;
                    background: rgba(255, 255, 255, 0.10);
                    border-radius: 4px 4px 0 0;
                    overflow: hidden;
                    position: relative;
                    transition: height 0.3s ease;
                }

                .hist-bar > div {
                    width: 100%;
                    background: linear-gradient(to top, rgba(77, 163, 255, 0.9), rgba(102, 126, 234, 0.85));
                    border-radius: 4px 4px 0 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }

                .hist-label {
                    margin-top: 4px;
                    font-size: 0.75rem;
                    color: #ccc;
                    text-align: center;
                    font-weight: 600;
                }

                .hist-value {
                    font-size: 0.7rem;
                    color: #999;
                    text-align: center;
                    margin-top: 2px;
                }

                @media (max-width: 900px) {
                    .ratings-summary {
                        grid-template-columns: 1fr;
                    }
                    
                    .histogram {
                        grid-template-columns: repeat(5, 1fr);
                        grid-template-rows: 120px 20px 120px 20px;
                        height: auto;
                        margin-top: 10px;
                    }
                    
                    .hist-bar-container:nth-child(n+6) {
                        grid-row: 3;
                    }
                    
                    .hist-bar-container:nth-child(1) { order: 10; }
                    .hist-bar-container:nth-child(2) { order: 9; }
                    .hist-bar-container:nth-child(3) { order: 8; }
                    .hist-bar-container:nth-child(4) { order: 7; }
                    .hist-bar-container:nth-child(5) { order: 6; }
                    .hist-bar-container:nth-child(6) { order: 5; }
                    .hist-bar-container:nth-child(7) { order: 4; }
                    .hist-bar-container:nth-child(8) { order: 3; }
                    .hist-bar-container:nth-child(9) { order: 2; }
                    .hist-bar-container:nth-child(10) { order: 1; }
                }

                .review-textarea {
                    width: 100%;
                    min-height: 120px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 10px;
                    color: #fff;
                    font-size: 1rem;
                    font-family: inherit;
                    resize: vertical;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }

                .review-textarea:focus {
                    outline: none;
                    border-color: #4da3ff;
                    background: rgba(255, 255, 255, 0.12);
                }

                .review-textarea::placeholder {
                    color: #999;
                }

                .submit-review-btn {
                    background: linear-gradient(135deg, #4da3ff, #667eea);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .submit-review-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(77, 163, 255, 0.4);
                }

                .submit-review-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .reviews-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .view-all-reviews-container {
                    margin-top: 10px;
                    display: flex;
                    justify-content: center;
                }

                .view-all-reviews-btn {
                    background: linear-gradient(135deg, #4da3ff, #667eea);
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 15px rgba(77, 163, 255, 0.3);
                }

                .view-all-reviews-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(77, 163, 255, 0.4);
                }

                .view-all-reviews-btn i {
                    font-size: 1.1rem;
                }

                .view-all-reviews-btn i.fa-arrow-right {
                    transition: transform 0.3s ease;
                }

                .view-all-reviews-btn:hover i.fa-arrow-right {
                    transform: translateX(5px);
                }

                .review-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                .review-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(77, 163, 255, 0.3);
                    transform: translateY(-2px);
                }

                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .review-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .review-author-avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4da3ff, #667eea);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .review-author-avatar img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .review-author-info {
                    display: flex;
                    flex-direction: column;
                }

                .review-author-name {
                    color: #fff;
                    font-weight: 600;
                    font-size: 1rem;
                    margin-bottom: 4px;
                }

                .review-author-badge {
                    display: inline-block;
                    background: rgba(77, 163, 255, 0.2);
                    color: #4da3ff;
                    padding: 3px 8px;
                    border-radius: 5px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-top: 4px;
                }

                .review-meta {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .review-rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .review-rating-stars {
                    color: #ffd700;
                    font-size: 1rem;
                }

                .review-rating-value {
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.95rem;
                }

                .review-date {
                    color: #999;
                    font-size: 0.85rem;
                }

                .review-content {
                    color: #ddd;
                    line-height: 1.7;
                    font-size: 0.95rem;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                .no-reviews {
                    text-align: center;
                    padding: 40px 20px;
                    color: #999;
                    font-size: 1rem;
                }

                .images-section {
                    margin-top: 20px;
                }

                .images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }

                .image-item {
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    cursor: pointer;
                    aspect-ratio: 16/9;
                    transition: transform 0.3s ease;
                }

                .image-item:hover {
                    transform: scale(1.05);
                    z-index: 10;
                }

                .image-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .images-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .image-tab {
                    padding: 10px 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 25px;
                    color: #ccc;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                }

                .image-tab:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .image-tab.active {
                    background: rgba(77, 163, 255, 0.2);
                    border-color: #4da3ff;
                    color: #4da3ff;
                }

                .image-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .image-modal.show {
                    display: flex;
                }

                .image-modal img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 10px;
                }

                .image-modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    color: white;
                    font-size: 2rem;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .content-wrapper {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px 40px;
                }

                @media (max-width: 1024px) {
                    .content-wrapper-inner {
                        grid-template-columns: 1fr;
                    }

                    .poster-section {
                        position: static;
                        max-width: 300px;
                        margin: 0 auto;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2rem;
                    }

                    .hero-tagline {
                        font-size: 1.1rem;
                    }

                    .hero-meta {
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

                    .icon-action-btn {
                        width: 45px;
                        min-width: 45px;
                        padding: 12px;
                        font-size: 0.95rem;
                    }

                    .icon-action-btn:hover {
                        padding-right: 24px;
                    }

                    .action-buttons {
                        gap: 10px;
                    }

                    .action-btn {
                        padding: 12px 22px;
                        font-size: 0.95rem;
                    }

                    .action-btn i {
                        font-size: 1.1rem;
                    }

                    .cast-grid {
                        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                        gap: 15px;
                    }

                    .cast-avatar {
                        width: 100px;
                        height: 100px;
                    }

                    .cast-member.expand-indicator {
                        min-height: 150px;
                    }

                    .expand-icon {
                        font-size: 2.5rem;
                    }

                    .expand-text {
                        font-size: 1rem;
                    }

                    .section {
                        padding: 20px;
                    }

                    .similar-movies-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 15px;
                    }

                    .review-form {
                        padding: 20px;
                    }

                    .review-form-title {
                        font-size: 1.1rem;
                    }

                    .star-icon {
                        font-size: 1.5rem;
                    }

                    .review-card {
                        padding: 15px;
                    }

                    .review-author-avatar {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }

                    .review-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .review-meta {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            </style>

            <div class="movie-details-container">
                <div class="loading-container" id="loading">
                    <div class="loading-spinner"></div>
                    <p>Ачааллаж байна...</p>
                </div>

                <div class="error-container" id="error" style="display: none;">
                    <h2>Алдаа гарлаа</h2>
                    <p id="error-message"></p>
                    <button class="action-btn primary-action" onclick="window.history.back()" style="margin-top: 20px;">
                        <i class="fas fa-arrow-left"></i> Буцах
                    </button>
                </div>

                <div id="content" style="display: none;"></div>
            </div>
        `;
    }

    async loadMovieDetails() {
        // Ensure render has been called first
        if (!this.shadowRoot.querySelector('.movie-details-container')) {
            this.render();
        }

        const loadingEl = this.shadowRoot.querySelector('#loading');
        const errorEl = this.shadowRoot.querySelector('#error');
        const contentEl = this.shadowRoot.querySelector('#content');
        const errorMsgEl = this.shadowRoot.querySelector('#error-message');

        // Check if elements exist before accessing
        if (!loadingEl || !errorEl || !contentEl || !errorMsgEl) {
            console.error('Required elements not found in shadow DOM');
            return;
        }

        try {
            loadingEl.style.display = 'flex';
            errorEl.style.display = 'none';
            contentEl.style.display = 'none';

            const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
            
            if (!service) {
                throw new Error('TMDB Service is not available');
            }

            // Fetch details first, then images (images might fail, but we don't want to block)
            const details = this.category === 'movies' 
                ? await service.getMovieDetails(this.movieId)
                : await service.getTVDetails(this.movieId);
            
            // Fetch images separately (don't block if it fails)
            let images = { backdrops: [], posters: [], logos: [] };
            try {
                images = this.category === 'movies'
                    ? await service.getMovieImages(this.movieId)
                    : await service.getTVImages(this.movieId);
            } catch (imgError) {
                console.warn('⚠️ Could not load images, continuing without them:', imgError);
            }

            if (!details) {
                throw new Error('Мэдээлэл олдсонгүй');
            }

            this.movieData = details;
            
            // Prioritize recommendations (more accurate, based on user ratings)
            // Only use similar movies if recommendations are insufficient
            console.log('📊 Similar data check:', {
                hasSimilar: !!details.similar,
                similarLength: details.similar?.length || 0,
                hasRecommendations: !!details.recommendations,
                recLength: details.recommendations?.length || 0,
                movieGenres: details.genres
            });

            // Get genre IDs and names from the movie for filtering
            const movieGenreNames = (details.genres || []).map(g => typeof g === 'string' ? g : g.name);
            const movieGenreIds = (details.genre_ids || []).filter(id => id != null);

            // Fetch recommendations if not enough (recommendations are more accurate)
            // Don't block if this fails - just use what we have
            if (!details.recommendations || details.recommendations.length < 8) {
                console.log('🔄 Fetching recommendations (more accurate than similar)...');
                try {
                    const fetchPromise = this.category === 'movies'
                        ? service.getRecommendedMovies(this.movieId)
                        : service.getRecommendedTVShows(this.movieId);
                    
                    // Set timeout to not block too long
                    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve([]), 3000));
                    const fetchedRecs = await Promise.race([fetchPromise, timeoutPromise]);
                    
                    if (fetchedRecs && fetchedRecs.length > 0) {
                        details.recommendations = [...(details.recommendations || []), ...fetchedRecs]
                            .filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
                            .slice(0, 20);
                    }
                    console.log('✅ Updated recommendations count:', details.recommendations?.length || 0);
                } catch (err) {
                    console.error('Error fetching recommendations:', err);
                    // Continue without recommendations
                    if (!details.recommendations) {
                        details.recommendations = [];
                    }
                }
            }

            // Filter similar movies to only include those sharing at least one genre
            // Similar movies can be inaccurate, so we filter them by genre
            if (details.similar && details.similar.length > 0) {
                console.log('🔍 Filtering similar movies by genre to ensure relevance...');
                const originalSimilarCount = details.similar.length;
                
                // Get genre IDs from original movie (from details response, not mapped data)
                const originalGenreIds = details.genre_ids || [];
                
                details.similar = details.similar.filter(item => {
                    // First check genre_ids (more reliable)
                    if (originalGenreIds.length > 0 && item.genre_ids && item.genre_ids.length > 0) {
                        const hasMatchingGenreId = item.genre_ids.some(id => originalGenreIds.includes(id));
                        if (hasMatchingGenreId) return true;
                    }
                    
                    // Fallback: check genre names if genre_ids not available
                    if (movieGenreNames.length > 0) {
                        const itemGenres = item.genres || [];
                        const itemGenreNames = Array.isArray(itemGenres) 
                            ? itemGenres.map(g => typeof g === 'string' ? g : (g.name || ''))
                            : [];
                        
                        const hasMatchingGenre = itemGenreNames.some(genre => 
                            movieGenreNames.some(mg => mg.toLowerCase() === genre.toLowerCase())
                        );
                        if (hasMatchingGenre) return true;
                    }
                    
                    // If no genre match found, exclude this item
                    return false;
                });
                
                console.log(`✅ Filtered similar movies: ${originalSimilarCount} → ${details.similar.length} (removed ${originalSimilarCount - details.similar.length} that don't share genres)`);
            }

            // Only use similar movies if we don't have enough recommendations
            const recCount = details.recommendations?.length || 0;
            if (recCount < 8 && details.similar && details.similar.length > 0) {
                console.log(`📊 Using ${recCount} recommendations + filtered similar movies as supplement`);
            } else if (recCount >= 8) {
                // We have enough recommendations, so we can ignore similar movies
                console.log(`✅ Using ${recCount} recommendations (sufficient, ignoring similar movies)`);
                details.similar = [];
            }

            // Add images to details
            details.images = images;

            if (loadingEl) loadingEl.style.display = 'none';
            this.renderContent(details);
            
            // Update auth UI after content is rendered (with small delay to ensure DOM is ready)
            setTimeout(() => {
                this.updateAuthUI();
            }, 100);

        } catch (error) {
            console.error('Error loading movie details:', error);
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'block';
            if (errorMsgEl) errorMsgEl.textContent = error.message || 'Мэдээлэл ачаалахад алдаа гарлаа';
        }
    }

    renderContent(details) {
        const contentEl = this.shadowRoot.querySelector('#content');
        const isMovie = this.category === 'movies';

        // Get service reference for trailer URL
        const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
        const getTrailerUrl = (trailerKey) => {
            if (!trailerKey) return null;
            if (service && service.getTrailerUrl) {
                return service.getTrailerUrl(trailerKey);
            }
            // Fallback: if it's already a full URL, return it, otherwise construct YouTube URL
            return trailerKey.startsWith('http') ? trailerKey : `https://www.youtube.com/watch?v=${trailerKey}`;
        };

        // Get all directors
        const directors = details.crew?.filter(person => person.job === 'Director') || [];
        
        // Get producers
        const producers = details.crew?.filter(person => 
            person.job === 'Producer' || person.job === 'Executive Producer'
        ) || [];

        // Get writers
        const writers = details.crew?.filter(person => 
            person.job === 'Writer' || person.job === 'Screenplay' || person.job === 'Story'
        ) || [];

        // Get cinematographers
        const cinematographers = details.crew?.filter(person => person.job === 'Director of Photography') || [];

        // Get composers
        const composers = details.crew?.filter(person => person.job === 'Original Music Composer') || [];

        // Prioritize recommendations (more accurate) over similar movies
        // Combine them with recommendations first, then add filtered similar movies if needed
        let allSimilar = [];
        
        // First, add recommendations (more accurate - based on user ratings)
        if (details.recommendations && details.recommendations.length > 0) {
            allSimilar = [...details.recommendations];
        }
        
        // Then add filtered similar movies only if we need more content
        // Similar movies are less accurate (based on keywords/genres only)
        if (allSimilar.length < 12 && details.similar && details.similar.length > 0) {
            // Only add similar movies that aren't already in recommendations
            const existingIds = new Set(allSimilar.map(item => item.id || item.tmdb_id));
            const additionalSimilar = details.similar.filter(item => {
                const itemId = item.id || item.tmdb_id;
                return itemId && !existingIds.has(itemId);
            });
            allSimilar = [...allSimilar, ...additionalSimilar];
        }
        
        // Filter out invalid items and deduplicate
        const similarContent = allSimilar
            .filter(item => item && (item.id || item.tmdb_id) && item.name)
            .map(item => ({
                ...item,
                id: item.id || item.tmdb_id,
                category: item.category || (isMovie ? 'movies' : 'tv'),
                image: item.image || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null),
                name: item.name || item.title || 'Unknown',
                year: item.year || (item.release_date ? item.release_date.split('-')[0] : null) || (item.first_air_date ? item.first_air_date.split('-')[0] : null),
                rating_value: item.rating_value || (item.vote_average ? item.vote_average.toFixed(1) : null) || item.rating?.toFixed(1)
            }))
            .filter((item, index, self) => 
                index === self.findIndex(t => t.id === item.id)
            )
            .slice(0, 12);

        console.log('🎬 Rendering content with:', {
            similarContent: similarContent.length,
            images: details.images ? {
                backdrops: details.images.backdrops?.length || 0,
                posters: details.images.posters?.length || 0
            } : null
        });

        // Prepare images data
        const backdrops = details.images?.backdrops?.slice(0, 12) || [];
        const posters = details.images?.posters?.slice(0, 12) || [];
        const hasImages = backdrops.length > 0 || posters.length > 0;

        contentEl.innerHTML = `
            <!-- Image Modal -->
            <div class="image-modal" id="image-modal">
                <button class="image-modal-close" onclick="this.closest('.image-modal').classList.remove('show')">&times;</button>
                <img id="modal-image" src="" alt="">
            </div>
            <button class="back-button" onclick="window.history.back()" style="position: fixed; top: 100px; left: 30px; z-index: 1000;">
                <i class="fas fa-arrow-left"></i>
            </button>

            <div class="hero-section">
                <img class="hero-backdrop" src="${details.backdrop || details.image}" alt="${details.name}">
                <div class="hero-overlay">
                    <h1 class="hero-title">${details.name}</h1>
                    ${details.tagline && details.tagline !== 'Тодорхойгүй' ? 
                        `<p class="hero-tagline">"${details.tagline}"</p>` : ''}
                    
                    <div class="hero-meta">
                        <div class="rating-badge">
                            <i class="fas fa-star"></i>
                            <span>${details.rating ? parseFloat(details.rating).toFixed(1) : 'N/A'}</span>
                        </div>
                        <div class="meta-badge badge-year">
                            <i class="fas fa-calendar"></i>
                            <span>${details.year || 'N/A'}</span>
                        </div>
                        ${details.duration && details.duration !== 'Тодорхойгүй' ? `
                            <div class="meta-badge badge-duration">
                                <i class="fas fa-clock"></i>
                                <span>${details.duration}</span>
                            </div>
                        ` : ''}
                        ${details.certification && details.certification !== 'Тодорхойгүй' ? `
                            <div class="meta-badge badge-certification">
                                <i class="fas fa-certificate"></i>
                                <span>${details.certification}</span>
                            </div>
                        ` : ''}
                        ${!isMovie && details.seasons ? `
                            <div class="meta-badge badge-seasons">
                                <i class="fas fa-tv"></i>
                                <span>${details.seasons} улирал</span>
                            </div>
                        ` : ''}
                        ${!isMovie && details.episodes ? `
                            <div class="meta-badge badge-episodes">
                                <i class="fas fa-list"></i>
                                <span>${details.episodes} анги</span>
                            </div>
                        ` : ''}
                        <div class="meta-badge ${isMovie ? 'badge-type-movie' : 'badge-type-tv'}">
                            <i class="${isMovie ? 'fas fa-film' : 'fas fa-tv'}"></i>
                            <span>${isMovie ? 'Кино' : 'Цуврал'}</span>
                        </div>
                    </div>

                    <div class="action-buttons">
                        ${details.trailer ? `
                            <button class="icon-action-btn trailer-btn" id="trailer-btn" data-trailer-url="${getTrailerUrl(details.trailer)}">
                                <i class="fas fa-play-circle"></i>
                                <span>Трейлер үзэх</span>
                            </button>
                        ` : `
                            <button class="icon-action-btn trailer-btn" id="trailer-btn" disabled>
                                <i class="fas fa-ban"></i>
                                <span>Трейлер байхгүй</span>
                            </button>
                        `}
                        <button class="icon-action-btn watchlist-btn" id="watchlist-btn">
                            <i class="fas fa-bookmark"></i>
                            <span>Watchlist</span>
                        </button>
                        <button class="icon-action-btn watched-btn" id="watched-btn">
                            <i class="fas fa-eye"></i>
                            <span>Үзсэн</span>
                        </button>
                    </div>

                    <div class="login-prompt" id="login-prompt" style="display: none;">
                        <p>Watchlist нэмэх, үзсэн гэж тэмдэглэхийн тулд нэвтрэх шаардлагатай</p>
                        <button class="login-btn" id="go-to-login-btn">Нэвтрэх</button>
                    </div>
                </div>
            </div>

            <div class="content-wrapper">
                <div class="content-wrapper-inner">
                    <div class="poster-section">
                        <img class="poster-image" src="${details.image}" alt="${details.name}">
                        ${details.genres && details.genres.length > 0 ? `
                            <div class="genre-tags">
                                ${details.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div class="details-main">
                    <div class="section">
                        <h2 class="section-title">
                            <i class="fas fa-align-left"></i>
                            Товч танилцуулга
                        </h2>
                        <p class="description">${details.description || 'Тайлбар байхгүй байна.'}</p>
                    </div>

                    ${details.cast && details.cast.length > 0 ? `
                        <div class="section">
                            <h2 class="section-title">
                                <i class="fas fa-users"></i>
                                Жүжигчид (${details.cast.length})
                            </h2>
                            <div class="cast-grid" id="cast-grid" data-expanded="false" data-all-cast='${JSON.stringify(details.cast).replace(/'/g, "&apos;")}'>
                                ${(() => {
                                    // Show 12 cast members initially (approximately 2 rows on desktop: 6x2)
                                    // On smaller screens this will be more than 2 rows, which is fine
                                    // The grid will automatically adjust based on screen size
                                    const initialCount = Math.min(12, details.cast.length);
                                    const visibleCast = details.cast.slice(0, initialCount);
                                    const remainingCount = details.cast.length - initialCount;
                                    
                                    let html = '';
                                    visibleCast.forEach((actor, index) => {
                                        html += `
                                            <div class="cast-member" data-index="${index}">
                                                ${actor.profile_path ? 
                                                    `<img class="cast-avatar" src="${actor.profile_path}" alt="${actor.name}" onerror="this.src='https://via.placeholder.com/185/333/fff?text=${encodeURIComponent(actor.name.substring(0, 2))}'">` :
                                                    `<div class="cast-avatar" style="background: linear-gradient(135deg, #4da3ff, #667eea); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.5rem;">${actor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</div>`
                                                }
                                                <div class="cast-name">${actor.name}</div>
                                                <div class="cast-character">${actor.character || 'Тодорхойгүй'}</div>
                                            </div>
                                        `;
                                    });
                                    
                                    // Add expand indicator if there are more cast members
                                    if (remainingCount > 0) {
                                        html += `
                                            <div class="cast-member expand-indicator" id="expand-cast-btn">
                                                <div class="expand-icon">+</div>
                                                <div class="expand-text">Дараагийн мөр</div>
                                                <div class="expand-count">+${remainingCount} үлдсэн</div>
                                            </div>
                                        `;
                                    }
                                    
                                    return html;
                                })()}
                            </div>
                        </div>
                    ` : ''}

                    ${directors.length > 0 || producers.length > 0 || writers.length > 0 ? `
                        <div class="section">
                            <h2 class="section-title">
                                <i class="fas fa-film"></i>
                                Хүрээлэн, Зохиол, Продюсер
                            </h2>
                            <div class="crew-section">
                                ${directors.map(director => `
                                    <div class="crew-member">
                                        <div class="crew-role">Найруулагч</div>
                                        <div class="crew-name">${director.name}</div>
                                    </div>
                                `).join('')}
                                ${producers.slice(0, 5).map(producer => `
                                    <div class="crew-member">
                                        <div class="crew-role">Продюсер</div>
                                        <div class="crew-name">${producer.name}</div>
                                    </div>
                                `).join('')}
                                ${writers.slice(0, 5).map(writer => `
                                    <div class="crew-member">
                                        <div class="crew-role">Зохиолч</div>
                                        <div class="crew-name">${writer.name}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="section">
                        <h2 class="section-title">
                            <i class="fas fa-info-circle"></i>
                            Дэлгэрэнгүй мэдээлэл
                        </h2>
                        <div class="info-grid">
                            ${isMovie ? `
                                ${details.budget && details.budget !== 'Тодорхойгүй' ? `
                                    <div class="info-item">
                                        <div class="info-label">Төсөв</div>
                                        <div class="info-value">${details.budget}</div>
                                    </div>
                                ` : ''}
                                ${details.revenue && details.revenue !== 'Тодорхойгүй' ? `
                                    <div class="info-item">
                                        <div class="info-label">Орлого</div>
                                        <div class="info-value">${details.revenue}</div>
                                    </div>
                                ` : ''}
                            ` : ''}
                            ${details.status ? `
                                <div class="info-item">
                                    <div class="info-label">Төлөв</div>
                                    <div class="info-value">${details.status}</div>
                                </div>
                            ` : ''}
                            ${details.original_language ? `
                                <div class="info-item">
                                    <div class="info-label">Анхны хэл</div>
                                    <div class="info-value">${details.original_language.toUpperCase()}</div>
                                </div>
                            ` : ''}
                            ${details.spoken_languages && details.spoken_languages.length > 0 ? `
                                <div class="info-item">
                                    <div class="info-label">Хэл</div>
                                    <div class="info-value">${details.spoken_languages.join(', ')}</div>
                                </div>
                            ` : ''}
                            ${details.production_countries && details.production_countries.length > 0 ? `
                                <div class="info-item">
                                    <div class="info-label">Улс</div>
                                    <div class="info-value">${details.production_countries.join(', ')}</div>
                                </div>
                            ` : ''}
                            ${details.vote_count ? `
                                <div class="info-item">
                                    <div class="info-label">Үнэлгээний тоо</div>
                                    <div class="info-value">${details.vote_count.toLocaleString()}</div>
                                </div>
                            ` : ''}
                            ${details.popularity ? `
                                <div class="info-item">
                                    <div class="info-label">Алдартай</div>
                                    <div class="info-value">${Math.round(details.popularity)}</div>
                                </div>
                            ` : ''}
                            ${details.imdb_id ? `
                                <div class="info-item">
                                    <div class="info-label">IMDB ID</div>
                                    <div class="info-value">
                                        <a href="https://www.imdb.com/title/${details.imdb_id}" target="_blank" style="color: #4da3ff; text-decoration: none;">
                                            ${details.imdb_id} <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </div>
                                </div>
                            ` : ''}
                            ${!isMovie && details.created_by && details.created_by.length > 0 ? `
                                <div class="info-item">
                                    <div class="info-label">Үүсгэсэн</div>
                                    <div class="info-value">${details.created_by.join(', ')}</div>
                                </div>
                            ` : ''}
                            ${!isMovie && details.networks && details.networks.length > 0 ? `
                                <div class="info-item">
                                    <div class="info-label">Сувгууд</div>
                                    <div class="info-value">${details.networks.join(', ')}</div>
                                </div>
                            ` : ''}
                            ${!isMovie && details.type ? `
                                <div class="info-item">
                                    <div class="info-label">Төрөл</div>
                                    <div class="info-value">${details.type}</div>
                                </div>
                            ` : ''}
                        </div>

                        ${details.production_companies && details.production_companies.length > 0 ? `
                            <div style="margin-top: 30px;">
                                <div class="info-label" style="margin-bottom: 15px;">Продюсерийн компаниуд</div>
                                <div class="companies-list">
                                    ${details.production_companies.map(company => `
                                        <span class="company-badge">${company}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="section reviews-section">
                        <h2 class="section-title">
                            <i class="fas fa-comments"></i>
                            Үнэлгээ, Сэтгэгдэл
                        </h2>
                        <div class="reviews-container">
                            <div class="review-form" id="review-form">
                                <div class="review-form-title">
                                    <i class="fas fa-edit"></i>
                                    Сэтгэгдэл үлдээх
                                </div>
                                <div class="rating-input-group">
                                    <label class="rating-label">Үнэлгээ (1-10)</label>
                                    <div class="rating-controls">
                                        <input class="rating-slider" id="rating-slider" type="range" min="1" max="10" step="0.1" value="7.0">
                                        <input class="rating-number" id="rating-number" type="number" min="1" max="10" step="0.1" value="7.0">
                                    </div>
                                    <div style="margin-top: 10px;">
                                        <span class="rating-value-display" id="rating-display">7.0/10</span>
                                    </div>
                                </div>
                                <textarea 
                                    class="review-textarea" 
                                    id="review-text" 
                                    placeholder="Сэтгэгдлээ бичнэ үү..."
                                    rows="5"
                                ></textarea>
                                <button class="submit-review-btn" id="submit-review-btn">
                                    <i class="fas fa-paper-plane"></i>
                                    <span>Илгээх</span>
                                </button>
                            </div>
                            <div class="ratings-summary" id="ratings-summary" style="display:none;">
                                <div class="summary-left">
                                    <div class="avg-score" id="avg-score">0.0 <span>/ 10</span></div>
                                    <div class="summary-subtext" id="summary-subtext">0 үнэлгээ</div>
                                </div>
                                <div class="histogram" id="histogram"></div>
                            </div>
                            <div class="reviews-list" id="reviews-list"></div>
                        </div>
                    </div>

                    ${hasImages ? `
                        <div class="section images-section">
                            <h2 class="section-title">
                                <i class="fas fa-images"></i>
                                Зургууд
                            </h2>
                            <div class="images-tabs">
                                ${backdrops.length > 0 ? `
                                    <button class="image-tab active" data-tab="backdrops" onclick="this.parentElement.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active')); this.classList.add('active'); this.parentElement.nextElementSibling.querySelectorAll('.image-grid-container').forEach(c => c.style.display='none'); this.parentElement.nextElementSibling.querySelector('#backdrops-grid').style.display='grid';">
                                        Backdrops (${backdrops.length})
                                    </button>
                                ` : ''}
                                ${posters.length > 0 ? `
                                    <button class="image-tab ${backdrops.length === 0 ? 'active' : ''}" data-tab="posters" onclick="this.parentElement.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active')); this.classList.add('active'); this.parentElement.nextElementSibling.querySelectorAll('.image-grid-container').forEach(c => c.style.display='none'); this.parentElement.nextElementSibling.querySelector('#posters-grid').style.display='grid';">
                                        Posters (${posters.length})
                                    </button>
                                ` : ''}
                            </div>
                            <div>
                                ${backdrops.length > 0 ? `
                                    <div class="image-grid-container images-grid" id="backdrops-grid" style="display: ${backdrops.length > 0 ? 'grid' : 'none'};">
                                        ${backdrops.map((img, idx) => `
                                            <div class="image-item" onclick="const modal = document.querySelector('movie-details-component')?.shadowRoot?.getElementById('image-modal'); const modalImg = modal?.querySelector('#modal-image'); if(modal && modalImg) { modalImg.src = '${img.file_path}'; modal.classList.add('show'); }">
                                                <img src="${img.file_path}" alt="Backdrop ${idx + 1}" loading="lazy">
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                ${posters.length > 0 ? `
                                    <div class="image-grid-container images-grid" id="posters-grid" style="display: ${backdrops.length === 0 ? 'grid' : 'none'};">
                                        ${posters.map((img, idx) => `
                                            <div class="image-item" onclick="const modal = document.querySelector('movie-details-component')?.shadowRoot?.getElementById('image-modal'); const modalImg = modal?.querySelector('#modal-image'); if(modal && modalImg) { modalImg.src = '${img.file_path}'; modal.classList.add('show'); }">
                                                <img src="${img.file_path}" alt="Poster ${idx + 1}" loading="lazy">
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}

                    ${similarContent.length > 0 ? `
                        <div class="section">
                            <h2 class="section-title">
                                <i class="fas fa-th"></i>
                                ${isMovie ? 'Төстэй кинонууд' : 'Төстэй цувралууд'} (${similarContent.length})
                            </h2>
                            <div class="similar-movies-grid">
                                ${similarContent.map(item => `
                                    <div class="similar-movie-card" onclick="window.location.hash = '#/movie-details/${item.category || (isMovie ? 'movies' : 'tv')}/${item.id || item.tmdb_id}'">
                                        <img class="similar-poster" src="${item.image || 'https://via.placeholder.com/500/333/fff?text=No+Image'}" alt="${item.name || 'Unknown'}" onerror="this.src='https://via.placeholder.com/500/333/fff?text=No+Image'">
                                        <div class="similar-info">
                                            <div class="similar-title">${item.name || 'Unknown'}</div>
                                            <div class="similar-meta">${item.year || 'N/A'} • ⭐ ${item.rating_value || item.rating?.toFixed(1) || 'N/A'}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : similarContent.length === 0 ? `
                        <div class="section">
                            <h2 class="section-title">
                                <i class="fas fa-th"></i>
                                ${isMovie ? 'Төстэй кинонууд' : 'Төстэй цувралууд'}
                            </h2>
                            <p style="color: #999; text-align: center; padding: 40px;">Төстэй контент олдсонгүй</p>
                        </div>
                    ` : ''}
                    </div>
                </div>
            </div>
        `;

        contentEl.style.display = 'block';

        // Setup image modal close on background click
        setTimeout(() => {
            const modal = this.shadowRoot.getElementById('image-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                    }
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && modal.classList.contains('show')) {
                        modal.classList.remove('show');
                    }
                });
            }

            // Setup cast expand functionality
            const expandBtn = this.shadowRoot.getElementById('expand-cast-btn');
            const castGrid = this.shadowRoot.getElementById('cast-grid');
            
            if (expandBtn && castGrid) {
                expandBtn.addEventListener('click', () => {
                    const allCastJson = castGrid.getAttribute('data-all-cast');
                    if (!allCastJson) return;
                    
                    try {
                        const allCast = JSON.parse(allCastJson.replace(/&apos;/g, "'"));
                        const currentMembers = castGrid.querySelectorAll('.cast-member:not(.expand-indicator)');
                        const currentCount = currentMembers.length;
                        
                        if (currentCount < allCast.length) {
                            // Calculate items per row based on screen width
                            // Desktop: ~6-7 per row, Tablet: ~4-5, Mobile: ~3
                            let itemsPerRow = 6; // default desktop
                            const width = window.innerWidth;
                            if (width <= 480) {
                                itemsPerRow = 3; // mobile
                            } else if (width <= 768) {
                                itemsPerRow = 4; // tablet
                            } else if (width <= 1024) {
                                itemsPerRow = 5; // small desktop
                            } else {
                                itemsPerRow = 6; // large desktop
                            }
                            
                            // Show next row
                            const nextBatch = allCast.slice(currentCount, currentCount + itemsPerRow);
                            
                            nextBatch.forEach((actor, idx) => {
                                const member = document.createElement('div');
                                member.className = 'cast-member';
                                member.setAttribute('data-index', currentCount + idx);
                                
                                if (actor.profile_path) {
                                    const img = document.createElement('img');
                                    img.className = 'cast-avatar';
                                    img.src = actor.profile_path;
                                    img.alt = actor.name;
                                    img.onerror = function() {
                                        this.src = `https://via.placeholder.com/185/333/fff?text=${encodeURIComponent(actor.name.substring(0, 2))}`;
                                    };
                                    member.appendChild(img);
                                } else {
                                    const div = document.createElement('div');
                                    div.className = 'cast-avatar';
                                    div.style.cssText = 'background: linear-gradient(135deg, #4da3ff, #667eea); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.5rem;';
                                    div.textContent = actor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                    member.appendChild(div);
                                }
                                
                                const nameDiv = document.createElement('div');
                                nameDiv.className = 'cast-name';
                                nameDiv.textContent = actor.name;
                                member.appendChild(nameDiv);
                                
                                const charDiv = document.createElement('div');
                                charDiv.className = 'cast-character';
                                charDiv.textContent = actor.character || 'Тодорхойгүй';
                                member.appendChild(charDiv);
                                
                                // Insert before expand button
                                castGrid.insertBefore(member, expandBtn);
                            });
                            
                            // Check if we've shown all cast members
                            const newCount = castGrid.querySelectorAll('.cast-member:not(.expand-indicator)').length;
                            if (newCount >= allCast.length) {
                                expandBtn.remove();
                            } else {
                                // Update remaining count
                                const remaining = allCast.length - newCount;
                                const countDiv = expandBtn.querySelector('.expand-count');
                                if (countDiv) {
                                    countDiv.textContent = `+${remaining} үлдсэн`;
                                }
                            }
                        }
                    } catch (err) {
                        console.error('Error expanding cast:', err);
                    }
                });
            }

            // Setup watchlist and watched buttons
            this.setupActionButtons();
            // Update auth UI after buttons are set up
            setTimeout(() => {
                this.updateAuthUI();
            }, 100);
            
            // Setup reviews section
            this.setupReviewsSection();
        }, 100);
    }

    setupReviewsSection() {
        const shadow = this.shadowRoot;
        const ratingSlider = shadow.getElementById('rating-slider');
        const ratingNumber = shadow.getElementById('rating-number');
        const ratingDisplay = shadow.getElementById('rating-display');
        const submitBtn = shadow.getElementById('submit-review-btn');
        const reviewText = shadow.getElementById('review-text');
        const reviewsList = shadow.getElementById('reviews-list');

        let selectedRating = 7.0;

        const clampRating = (v) => {
            const n = Number(v);
            if (Number.isNaN(n)) return 0;
            return Math.min(10, Math.max(1, n));
        };

        const formatRating = (v) => {
            const n = clampRating(v);
            return `${n.toFixed(1)}/10`;
        };

        const setRatingUI = (v) => {
            const n = clampRating(v);
            selectedRating = n;
            if (ratingSlider) ratingSlider.value = n.toFixed(1);
            if (ratingNumber) ratingNumber.value = n.toFixed(1);
            if (ratingDisplay) ratingDisplay.textContent = formatRating(n);
        };

        if (ratingSlider) {
            ratingSlider.addEventListener('input', () => setRatingUI(ratingSlider.value));
        }
        if (ratingNumber) {
            ratingNumber.addEventListener('input', () => setRatingUI(ratingNumber.value));
        }

        // Initialize UI
        setRatingUI(selectedRating);

        // Load existing reviews
        this.loadReviews(); // Async, no need to await here

        // Setup submit button
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitReview(selectedRating, reviewText?.value || '');
            });
        }
    }

    async loadReviews() {
        const shadow = this.shadowRoot;
        const reviewsList = shadow.getElementById('reviews-list');
        if (!reviewsList) return;
    
        const movieId = this.movieId;
        const category = this.category;
        const ratingsSummary = shadow.getElementById('ratings-summary');
        const avgScoreEl = shadow.getElementById('avg-score');
        const summarySubtextEl = shadow.getElementById('summary-subtext');
        const histogramEl = shadow.getElementById('histogram');
        
        try {
            // Try to load from backend API first
            const { authService } = await import('./auth-service.js');
            let reviews = [];
            
            try {
                reviews = await authService.getMovieReviews(movieId, category);
            } catch (error) {
                console.warn('Could not load reviews from backend, trying localStorage:', error);
                // Fallback to localStorage for backward compatibility
                const storageKey = `reviews_${category}_${movieId}`;
                const storedReviews = localStorage.getItem(storageKey);
                reviews = storedReviews ? JSON.parse(storedReviews) : [];
            }
            
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<div class="no-reviews">Одоогоор сэтгэгдэл байхгүй байна. Анхны сэтгэгдэл үлдээнэ үү!</div>';
                if (ratingsSummary) ratingsSummary.style.display = 'none';
                return;
            }
    
            // Movie/TV rating summary histogram (1-10) — show only on details page
            try {
                const counts = Array.from({ length: 10 }, () => 0);
                const ratings = reviews
                    .map(r => Number(r.rating))
                    .filter(v => !Number.isNaN(v) && v >= 1 && v <= 10);
    
                // Bucket by rounded integer (IMDb-like distribution)
                ratings.forEach(v => {
                    const bucket = Math.min(10, Math.max(1, Math.round(v)));
                    counts[bucket - 1]++;
                });
    
                const total = ratings.length;
                const avg = total ? (ratings.reduce((a, b) => a + b, 0) / total) : 0;
    
                if (ratingsSummary && avgScoreEl && summarySubtextEl && histogramEl) {
                    ratingsSummary.style.display = 'grid';
                    avgScoreEl.innerHTML = `${avg.toFixed(1)} <span>/ 10</span>`;
                    summarySubtextEl.textContent = `${total} үнэлгээ • ${reviews.length} сэтгэгдэл`;
    
                    const maxCount = Math.max(...counts, 1);
                    
                    // Create vertical histogram bars for scores 1-10
                    histogramEl.innerHTML = counts
                        .map((c, idx) => {
                            const score = idx + 1; // 1 to 10
                            const heightPct = total ? Math.round((c / maxCount) * 100) : 0;
                            const pct = total ? Math.round((c / total) * 100) : 0;
                            
                            return `
                                <div class="hist-bar-container">
                                    <div class="hist-bar" style="height: ${heightPct}%;">
                                        <div style="height: 100%;"></div>
                                    </div>
                                    <div class="hist-label">${score}</div>
                                    <div class="hist-value">${pct}%</div>
                                </div>
                            `;
                        })
                        .join('');
                }
            } catch (e) {
                if (ratingsSummary) ratingsSummary.style.display = 'none';
            }
    
            // Show only latest 3 reviews
            const latestReviews = reviews.slice(0, 3);
            
            let html = latestReviews.map(review => this.renderReviewCardHTML(review)).join('');
            
            // Add "View All Reviews" button if there are more than 3 reviews
            if (reviews.length > 3) {
                html += `
                    <div class="view-all-reviews-container">
                        <button class="view-all-reviews-btn" id="view-all-reviews-btn">
                            <i class="fas fa-comments"></i>
                            <span>Бүх сэтгэгдэл үзэх (${reviews.length})</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                `;
            }
            
            reviewsList.innerHTML = html;
            
            // Add event listener to "View All Reviews" button
            const viewAllBtn = shadow.getElementById('view-all-reviews-btn');
            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', () => {
                    window.location.hash = `#/movie-reviews/${category}/${movieId}`;
                });
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsList.innerHTML = '<div class="no-reviews">Сэтгэгдэл ачаалахад алдаа гарлаа</div>';
        }
    }

    renderReviewCardHTML(review) {
        const userData = JSON.parse(localStorage.getItem('cinewave_user') || '{}');
        const isCurrentUser = review.userId === (userData.id || userData._id || userData.email);
        const isAdmin = review.isAdmin || false;
        
        // Format date
        const date = new Date(review.date);
        const formattedDate = date.toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Get user initials for avatar
        const initials = review.username
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        // Generate star rating display
        const fullStars = Math.floor(review.rating);
        const hasHalfStar = review.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return `
            <review-card
                username="${this.escapeHtmlAttribute(review.username)}"
                rating="${review.rating}"
                text="${this.escapeHtmlAttribute(review.text)}"
                date="${review.date}"
                avatar="${review.avatar || ''}"
                is-admin="${isAdmin}"
                user-id="${review.userId || ''}">
            </review-card>
        `;
    }
    
    escapeHtmlAttribute(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async submitReview(rating, text) {
        if (!rating || rating === 0) {
            alert('Үнэлгээ сонгоно уу!');
            return;
        }

        if (!text.trim()) {
            alert('Сэтгэгдлээ бичнэ үү!');
            return;
        }

        const shadow = this.shadowRoot;
        const submitBtn = shadow.querySelector('#submit-review-btn');
        const originalText = submitBtn?.textContent;

        try {
            // Check if user is logged in
            const isLoggedIn = await this.checkAuthStatus();
            if (!isLoggedIn) {
                alert('Сэтгэгдэл үлдээхийн тулд нэвтрэх шаардлагатай');
                this.goToLoginPage();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Хадгалж байна...';
            }

            // Import auth service and submit review to backend
            const { authService } = await import('./auth-service.js');
            const movieId = this.movieId;
            const category = this.category;

            const result = await authService.submitReview(movieId, category, rating, text);
            
            // Show success message
            alert('Сэтгэгдэл амжилттай үлдээгдлээ!');
            
            // Reload reviews from backend
            await this.loadReviews();
            
            // Reset form
            const reviewText = shadow.getElementById('review-text');
            const ratingDisplay = shadow.getElementById('rating-display');
            const ratingSlider = shadow.getElementById('rating-slider');
            const ratingNumber = shadow.getElementById('rating-number');
            
            if (reviewText) reviewText.value = '';
            if (ratingSlider) ratingSlider.value = '7.0';
            if (ratingNumber) ratingNumber.value = '7.0';
            if (ratingDisplay) ratingDisplay.textContent = '7.0/10';
            
            // Scroll to new review
            setTimeout(() => {
                const reviewsList = shadow.getElementById('reviews-list');
                if (reviewsList) {
                    reviewsList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
            
        } catch (error) {
            console.error('Error saving review:', error);
            alert(error.message || 'Сэтгэгдэл хадгалахад алдаа гарлаа');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText || 'Илгээх';
            }
        }
    }

    async checkAuthStatus() {
        // Try to use auth service first (more reliable)
        try {
            const { authService } = await import('./auth-service.js');
            if (authService && authService.isAuthenticated()) {
                this.userData = authService.getCurrentUser();
                return true;
            }
        } catch (e) {
            // Fallback to localStorage check
        }
        
        // Fallback: Use the same keys as auth-service.js (with underscores, not hyphens)
        const token = localStorage.getItem('cinewave_token');
        const userData = localStorage.getItem('cinewave_user');
        
        if (token && userData) {
            try {
                this.userData = JSON.parse(userData);
                return true;
            } catch (e) {
                console.error('Error parsing user data:', e);
                return false;
            }
        }
        return false;
    }

    setupActionButtons() {
        const shadow = this.shadowRoot;
        const watchlistBtn = shadow.getElementById('watchlist-btn');
        const watchedBtn = shadow.getElementById('watched-btn');
        const loginBtn = shadow.getElementById('go-to-login-btn');
        const trailerBtn = shadow.getElementById('trailer-btn');

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

        // Trailer button handler
        if (trailerBtn && !trailerBtn.disabled) {
            trailerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const trailerUrl = trailerBtn.dataset.trailerUrl || trailerBtn.getAttribute('data-trailer-url');
                if (trailerUrl) {
                    window.open(trailerUrl, '_blank');
                }
            });
        }
    }

    async updateAuthUI() {
        const shadow = this.shadowRoot;
        const loginPrompt = shadow.getElementById('login-prompt');
        const watchlistBtn = shadow.getElementById('watchlist-btn');
        
        if (!loginPrompt) return;
        
        const isLoggedIn = await this.checkAuthStatus();
        
        if (!isLoggedIn) {
            loginPrompt.style.display = 'block';
            if (watchlistBtn) {
                watchlistBtn.classList.remove('active');
                const icon = watchlistBtn.querySelector('i');
                const span = watchlistBtn.querySelector('span');
                if (icon && span) {
                    icon.className = 'far fa-bookmark';
                    span.textContent = 'Watchlist';
                }
            }
        } else {
            loginPrompt.style.display = 'none';
            
            // Check watchlist status
            if (watchlistBtn && this.movieId) {
                try {
                    const { authService } = await import('./auth-service.js');
                    const user = authService.getCurrentUser();
                    const movieId = parseInt(this.movieId);
                    const isInWatchlist = user?.watchlist?.includes(movieId) || false;
                    
                    if (isInWatchlist) {
                        watchlistBtn.classList.add('active');
                        const icon = watchlistBtn.querySelector('i');
                        const span = watchlistBtn.querySelector('span');
                        if (icon && span) {
                            icon.className = 'fas fa-bookmark';
                            span.textContent = 'Нэмсэн';
                        }
                    } else {
                        watchlistBtn.classList.remove('active');
                        const icon = watchlistBtn.querySelector('i');
                        const span = watchlistBtn.querySelector('span');
                        if (icon && span) {
                            icon.className = 'far fa-bookmark';
                            span.textContent = 'Watchlist';
                        }
                    }
                } catch (error) {
                    console.error('Error checking watchlist status:', error);
                }
            }
        }
        
        // Also update periodically while component is visible
        if (!this.authCheckInterval) {
            this.authCheckInterval = setInterval(async () => {
                const currentIsLoggedIn = await this.checkAuthStatus();
                if (loginPrompt) {
                    loginPrompt.style.display = currentIsLoggedIn ? 'none' : 'block';
                }
            }, 1000);
        }
    }

    async handleUserAction(action) {
        const isLoggedIn = await this.checkAuthStatus();
        const movieName = this.movieData?.name || 'Unknown';
        
        if (!isLoggedIn) {
            alert('Энэ үйлдлийг хийхийн тулд нэвтрэх шаардлагатай');
            this.goToLoginPage();
            return;
        }
        
        const shadow = this.shadowRoot;
        const movieId = parseInt(this.movieId);
        
        switch(action) {
            case 'watchlist':
                try {
                    const { authService } = await import('./auth-service.js');
                    const watchlistBtn = shadow.getElementById('watchlist-btn');
                    
                    // Check if already in watchlist
                    const user = authService.getCurrentUser();
                    const isInWatchlist = user?.watchlist?.includes(movieId) || false;
                    
                    if (isInWatchlist) {
                        // Remove from watchlist
                        await authService.removeFromWatchlist(movieId);
                        if (watchlistBtn) {
                            watchlistBtn.classList.remove('active');
                            const icon = watchlistBtn.querySelector('i');
                            const span = watchlistBtn.querySelector('span');
                            if (icon && span) {
                                icon.className = 'far fa-bookmark';
                                span.textContent = 'Watchlist';
                            }
                        }
                        // Show notification
                        const notification = document.createElement('div');
                        notification.textContent = `"${movieName}" watchlist-аас хаслаа`;
                        notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #4da3ff; color: white; padding: 15px 25px; border-radius: 8px; z-index: 10000;';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                    } else {
                        // Add to watchlist
                        await authService.addToWatchlist(movieId);
                        if (watchlistBtn) {
                            watchlistBtn.classList.add('active');
                            const icon = watchlistBtn.querySelector('i');
                            const span = watchlistBtn.querySelector('span');
                            if (icon && span) {
                                icon.className = 'fas fa-bookmark';
                                span.textContent = 'Нэмсэн';
                            }
                        }
                        // Show notification
                        const notification = document.createElement('div');
                        notification.textContent = `"${movieName}" watchlist-д нэмэгдлээ!`;
                        notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #4da3ff; color: white; padding: 15px 25px; border-radius: 8px; z-index: 10000;';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
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
                    const watchedBtn = shadow.getElementById('watched-btn');
                    if (watchedBtn) {
                        watchedBtn.classList.add('active');
                        const icon = watchedBtn.querySelector('i');
                        const span = watchedBtn.querySelector('span');
                        if (icon && span) {
                            icon.className = 'fas fa-eye';
                            span.textContent = 'Үзсэн';
                        }
                    }
                }
                break;
        }
    }

    goToLoginPage() {
        window.location.hash = '#/login';
    }
}

customElements.define('movie-details-component', MovieDetailsComponent);
