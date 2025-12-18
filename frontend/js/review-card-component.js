// review-card-component.js - With 2-line Read More
class ReviewCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isExpanded = false;
        this.maxLines = 2; // Show only 2 lines initially
    }

    connectedCallback() {
        this.render();
        this.checkIfNeedsReadMore();
    }

    static get observedAttributes() {
        return ['reviewer', 'rating', 'content', 'movie', 'timestamp', 'avatar', 'verified'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            setTimeout(() => this.checkIfNeedsReadMore(), 0);
        }
    }

    get ratingStars() {
        const rating = parseFloat(this.getAttribute('rating') || 0);
        let stars = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    get verifiedBadge() {
        const isVerified = this.getAttribute('verified') === 'true';
        return isVerified ? 
            '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : 
            '';
    }

    checkIfNeedsReadMore() {
        const contentElement = this.shadowRoot.querySelector('.review-content');
        if (!contentElement) return;

        const lineHeight = parseInt(getComputedStyle(contentElement).lineHeight) || 24;
        const contentHeight = contentElement.scrollHeight;
        const maxHeight = lineHeight * this.maxLines;

        const readMoreBtn = this.shadowRoot.querySelector('.read-more-btn');
        
        if (contentHeight > maxHeight) {
            if (!contentElement.classList.contains('truncated')) {
                contentElement.classList.add('truncated');
            }
            if (readMoreBtn) {
                readMoreBtn.style.display = 'flex';
            }
        } else {
            contentElement.classList.remove('truncated');
            if (readMoreBtn) {
                readMoreBtn.style.display = 'none';
            }
        }
    }

    toggleReadMore() {
        this.isExpanded = !this.isExpanded;
        const contentElement = this.shadowRoot.querySelector('.review-content');
        const readMoreBtn = this.shadowRoot.querySelector('.read-more-btn');
        
        if (contentElement) {
            if (this.isExpanded) {
                contentElement.classList.remove('truncated');
                readMoreBtn.innerHTML = '<span class="read-more-text">Бага</span><i class="read-more-icon fas fa-chevron-up"></i>';
            } else {
                contentElement.classList.add('truncated');
                readMoreBtn.innerHTML = '<span class="read-more-text">Илүү</span><i class="read-more-icon fas fa-chevron-down"></i>';
            }
        }
    }

    render() {
        const reviewer = this.getAttribute('reviewer') || 'Anonymous';
        const rating = this.getAttribute('rating') || '0';
        const content = this.getAttribute('content') || 'No review content';
        const movie = this.getAttribute('movie') || 'Unknown Movie';
        const timestamp = this.getAttribute('timestamp') || '';
        const avatar = this.getAttribute('avatar') || 'https://ui-avatars.com/api/?name=' + reviewer + '&background=random';
        const isVerified = this.getAttribute('verified') === 'true';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 20px;
                    font-family: 'Nunito', sans-serif;
                }

                .review-card {
                    background: #1a1a1a;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid #333;
                }

                .review-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                }

                .review-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-right: 16px;
                }

                .reviewer-info {
                    flex-grow: 1;
                }

                .reviewer-name {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fff;
                }

                .verified-badge {
                    background: #007fff;
                    color: white;
                    padding: 5px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                }

                .rating {
                    color: #ffd700;
                    font-size: 1.1rem;
                    margin: 8px 0;
                }

                .rating .fa-star {
                    margin-right: 2px;
                }

                .rating-value {
                    color: #ffd700;
                    font-weight: 700;
                    margin-left: 8px;
                    font-size: 1.1rem;
                }

                .movie-title {
                    color: #007fff;
                    font-weight: 600;
                    margin-bottom: 12px;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .movie-title i {
                    font-size: 0.9rem;
                }

                .review-content {
                    color: #ccc;
                    line-height: 1.6;
                    font-size: 1rem;
                    margin-bottom: 8px;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }

                .review-content.truncated {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-height: calc(1.6em * 2);
                }

                .read-more-btn {
                    display: none;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    color: #007fff;
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 4px 0;
                    font-weight: 600;
                    transition: color 0.2s;
                    margin-bottom: 12px;
                }

                .read-more-icon {
                    font-size: 0.8rem;
                }

                .review-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #333;
                    padding-top: 12px;
                    margin-top: 12px;
                }

                .timestamp {
                    color: #888;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .review-actions {
                    display: flex;
                    gap: 16px;
                }

                .review-action {
                    background: none;
                    border: none;
                    color: #ccc;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                    transition: color 0.2s;
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                .review-action:hover {
                    color: #00ffff;
                }

                @media (max-width: 768px) {
                    .review-card {
                        padding: 16px;
                    }
                    
                    .review-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .avatar {
                        margin-bottom: 12px;
                    }
                    
                    .review-footer {
                        flex-direction: column;
                        gap: 12px;
                        align-items: flex-start;
                    }
                    
                    .review-actions {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            </style>

            <div class="review-card">
                <div class="review-header">
                    <img src="${avatar}" alt="${reviewer}" class="avatar" loading="lazy">
                    <div class="reviewer-info">
                        <div class="reviewer-name">
                            ${reviewer}
                            ${this.verifiedBadge}
                        </div>
                        <div class="rating">
                            ${this.ratingStars}
                            <span class="rating-value">${rating}/5</span>
                        </div>
                    </div>
                </div>
                
                <div class="movie-title">
                    <i class="fas fa-film"></i>
                    ${movie}
                </div>
                
                <div class="review-content truncated">
                    ${content}
                </div>
                
                <button class="read-more-btn">
                    <span class="read-more-text">Илүү</span>
                    <i class="read-more-icon fas fa-chevron-down"></i>
                </button>
                
                <div class="review-footer">
                    <div class="timestamp">
                        <i class="far fa-clock"></i> ${timestamp}
                    </div>
                    <div class="review-actions">
                        <button class="review-action" data-action="like">
                            <i class="far fa-thumbs-up"></i> Like
                        </button>
                        <button class="review-action" data-action="reply">
                            <i class="far fa-comment"></i> Reply
                        </button>
                        <button class="review-action" data-action="share">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        // Read More button
        const readMoreBtn = this.shadowRoot.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleReadMore();
            });
        }

        // Action buttons
        const buttons = this.shadowRoot.querySelectorAll('.review-action');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
            });
        });
    }

    handleAction(action) {
        const reviewer = this.getAttribute('reviewer');
        const movie = this.getAttribute('movie');
        
        switch(action) {
            case 'like':
                this.dispatchEvent(new CustomEvent('review-liked', {
                    bubbles: true,
                    composed: true,
                    detail: { reviewer, movie }
                }));
                break;
            case 'reply':
                this.dispatchEvent(new CustomEvent('review-reply', {
                    bubbles: true,
                    composed: true,
                    detail: { reviewer, movie }
                }));
                break;
            case 'share':
                this.dispatchEvent(new CustomEvent('review-share', {
                    bubbles: true,
                    composed: true,
                    detail: { reviewer, movie }
                }));
                break;
        }
    }
}

customElements.define('review-card', ReviewCard);