// Review Card Component - Reusable component for displaying individual reviews
class ReviewCardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['username', 'rating', 'text', 'date', 'avatar', 'is-admin', 'user-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const username = this.getAttribute('username') || 'Хэрэглэгч';
        const rating = parseFloat(this.getAttribute('rating') || '0');
        const text = this.getAttribute('text') || '';
        const date = this.getAttribute('date') || new Date().toISOString();
        const avatar = this.getAttribute('avatar') || '';
        const isAdmin = this.getAttribute('is-admin') === 'true';
        const userId = this.getAttribute('user-id') || '';

        // Get user initials for avatar
        const initials = username
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        // Format date
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Generate star rating display
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
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

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .review-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .review-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(77, 163, 255, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
                    overflow: hidden;
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
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .review-date i {
                    font-size: 0.8rem;
                }

                .review-content {
                    color: #ddd;
                    line-height: 1.7;
                    font-size: 0.95rem;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }

                @media (max-width: 768px) {
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

            <div class="review-card">
                <div class="review-header">
                    <div class="review-author">
                        <div class="review-author-avatar">
                            ${avatar ? `<img src="${avatar}" alt="${username}" onerror="this.style.display='none'; this.parentElement.textContent='${initials}'">` : initials}
                        </div>
                        <div class="review-author-info">
                            <div class="review-author-name">${this.escapeHtml(username)}</div>
                            ${isAdmin ? '<span class="review-author-badge">Админ</span>' : ''}
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-rating">
                            <div class="review-rating-stars">${starsHTML}</div>
                            <span class="review-rating-value">${rating}/5</span>
                        </div>
                        <div class="review-date">
                            <i class="far fa-clock"></i>
                            <span>${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="review-content">${this.escapeHtml(text)}</div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('review-card', ReviewCardComponent);