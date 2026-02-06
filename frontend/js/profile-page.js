export function renderProfilePage() {
    return `
        <div class="profile-page">
            <div class="profile-header">
                <div class="profile-banner"></div>
                <div class="profile-info-section">
                    <div class="profile-avatar-wrapper">
                        <img id="profile-avatar" src="" alt="Profile" class="profile-avatar">
                        <button class="change-avatar-btn" id="change-avatar-btn">
                            <i class="fas fa-camera"></i>
                        </button>
                    </div>
                    <div class="profile-details">
                        <h1 id="profile-name"></h1>
                        <p id="profile-email"></p>
                        <p class="member-since" id="member-since"></p>
                    </div>
                    <button class="edit-profile-btn" id="edit-profile-btn">
                        <i class="fas fa-edit"></i> Засах
                    </button>
                </div>
            </div>

            <div class="profile-content">
                <div class="profile-tabs">
                    <button class="tab-btn active" data-tab="overview">Ерөнхий</button>
                    <button class="tab-btn" data-tab="watchlist">Үзэх жагсаалт</button>
                    <button class="tab-btn" data-tab="favorites">Дуртай</button>
                    <button class="tab-btn" data-tab="ratings">Шүүмж</button>
                    <button class="tab-btn" data-tab="settings">Тохиргоо</button>
                </div>

                <div class="tab-content active" id="tab-overview">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-list"></i>
                            <div class="stat-info">
                                <h3 id="watchlist-count">0</h3>
                                <p>Үзэх жагсаалт</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-heart"></i>
                            <div class="stat-info">
                                <h3 id="favorites-count">0</h3>
                                <p>Дуртай кино</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-star"></i>
                            <div class="stat-info">
                                <h3 id="ratings-count">0</h3>
                                <p>Үнэлгээ өгсөн</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-comment"></i>
                            <div class="stat-info">
                                <h3 id="reviews-count">0</h3>
                                <p>Шүүмж бичсэн</p>
                            </div>
                        </div>
                    </div>

                    <div class="recent-activity">
                        <h2>Сүүлийн үйлдлүүд</h2>
                        <div id="activity-list" class="activity-list">
                            <p class="no-data">Үйлдэл байхгүй байна</p>
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="tab-watchlist">
                    <h2>Үзэх жагсаалт</h2>
                    <div id="watchlist-container" class="movies-grid">
                        <p class="no-data">Үзэх жагсаалт хоосон байна</p>
                    </div>
                </div>

                <div class="tab-content" id="tab-favorites">
                    <h2>Дуртай кинонууд</h2>
                    <div id="favorites-container" class="movies-grid">
                        <p class="no-data">Дуртай кино нэмээгүй байна</p>
                    </div>
                </div>

                <div class="tab-content" id="tab-ratings">
                    <h2>Миний үнэлгээ</h2>
                    <div id="ratings-container" class="ratings-list">
                        <p class="no-data">Үнэлгээ өгөөгүй байна</p>
                    </div>
                </div>

                <div class="tab-content" id="tab-settings">
                    <h2>Тохиргоо</h2>
                    
                    <div class="settings-section">
                        <h3>Хувийн мэдээлэл</h3>
                        <form id="profile-form" class="profile-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Овог</label>
                                    <input type="text" id="edit-lastName" required>
                                </div>
                                <div class="form-group">
                                    <label>Нэр</label>
                                    <input type="text" id="edit-firstName" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Имэйл</label>
                                <input type="email" id="edit-email" disabled>
                            </div>
                            <div class="form-group">
                                <label>Утас</label>
                                <input type="tel" id="edit-phone">
                            </div>
                            <button type="submit" class="save-btn">Хадгалах</button>
                        </form>
                    </div>

                    <div class="settings-section">
                        <h3>Нууц үг солих</h3>
                        <form id="password-form" class="password-form">
                            <div class="form-group">
                                <label>Хуучин нууц үг</label>
                                <input type="password" id="old-password" required>
                            </div>
                            <div class="form-group">
                                <label>Шинэ нууц үг</label>
                                <input type="password" id="new-password" required>
                            </div>
                            <div class="form-group">
                                <label>Шинэ нууц үг баталгаажуулах</label>
                                <input type="password" id="confirm-password" required>
                            </div>
                            <button type="submit" class="save-btn">Нууц үг солих</button>
                        </form>
                    </div>

                    <div class="settings-section danger-zone">
                        <p>Бүртгэлээ устгах нь таны бүх мэдээлэл, үнэлгээ, шүүмжийг бүрмөсөн устгана.</p>
                        <button class="delete-account-btn" id="delete-account-btn">
                            <i class="fas fa-trash"></i> Бүртгэл устгах
                        </button>
                    </div>

                    <div class="settings-section">
                        <button class="logout-btn" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Гарах
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div class="modal" id="edit-profile-modal">
            <div class="modal-content">
                <button class="modal-close" id="close-modal">&times;</button>
                <h2>Профайл засах</h2>
                <form id="quick-edit-form">
                    <div class="form-group">
                        <label>Овог</label>
                        <input type="text" id="quick-lastName" required>
                    </div>
                    <div class="form-group">
                        <label>Нэр</label>
                        <input type="text" id="quick-firstName" required>
                    </div>
                    <div class="form-group">
                        <label>Утас</label>
                        <input type="tel" id="quick-phone">
                    </div>
                    <button type="submit" class="save-btn">Хадгалах</button>
                </form>
            </div>
        </div>

        <!-- Avatar Upload Modal -->
        <div class="modal" id="avatar-upload-modal">
            <div class="modal-content avatar-modal">
                <button class="modal-close" id="close-avatar-modal">&times;</button>
                <h2>Профайл зураг солих</h2>
                
                <div class="avatar-options">
                    <button class="avatar-option-btn" id="upload-from-device">
                        <i class="fas fa-upload"></i>
                        <span>Энэ төхөөрөмжөөс оруулах</span>
                    </button>
                    
                    <button class="avatar-option-btn" id="take-photo">
                        <i class="fas fa-camera"></i>
                        <span>Камераар авах</span>
                    </button>
                    
                    <button class="avatar-option-btn" id="enter-url">
                        <i class="fas fa-link"></i>
                        <span>URL оруулах</span>
                    </button>
                </div>

                <div class="avatar-preview" id="avatar-preview" style="display: none;">
                    <img id="preview-image" src="" alt="Preview">
                    <div class="preview-actions">
                        <button class="btn-secondary" id="cancel-preview">Цуцлах</button>
                        <button class="btn-primary" id="save-avatar">Хадгалах</button>
                    </div>
                </div>

                <input type="file" id="file-input" accept="image/*" style="display: none;">
                <input type="file" id="camera-input" accept="image/*" capture="user" style="display: none;">
            </div>
        </div>

        <style>
            .avatar-modal {
                max-width: 500px;
            }

            .avatar-options {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin: 20px 0;
            }

            .avatar-option-btn {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                background: #2a2a2a;
                border: 2px solid #333;
                border-radius: 12px;
                color: white;
                font-family: 'Nunito', sans-serif;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .avatar-option-btn:hover {
                background: rgba(0, 123, 255, 0.1);
                border-color: #007bff;
                transform: translateY(-2px);
            }

            .avatar-option-btn i {
                font-size: 24px;
                color: #00ffff;
            }

            .avatar-preview {
                margin-top: 20px;
                text-align: center;
            }

            .avatar-preview img {
                max-width: 100%;
                max-height: 300px;
                border-radius: 12px;
                margin-bottom: 20px;
                object-fit: contain;
            }

            .preview-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
            }

            .btn-primary, .btn-secondary {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-family: 'Nunito', sans-serif;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
            }

            .btn-secondary {
                background: #2a2a2a;
                color: white;
                border: 2px solid #333;
            }

            .btn-secondary:hover {
                border-color: #555;
            }

            @media (max-width: 600px) {
                .avatar-modal {
                    max-width: 90%;
                }

                .avatar-option-btn {
                    padding: 15px;
                    font-size: 14px;
                }

                .avatar-option-btn i {
                    font-size: 20px;
                }

                .preview-actions {
                    flex-direction: column;
                }

                .btn-primary, .btn-secondary {
                    width: 100%;
                }
            }
        </style>
    `;
}

export async function initProfilePage(authService) {

    const user = authService.getCurrentUser();
    if (!user) {
        window.location.hash = '#/login';
        return;
    }

    try {
        const freshUser = await authService.getProfile();
        loadUserData(freshUser);
    } catch (error) {
        console.warn('⚠️ Could not fetch fresh profile, using cached data:', error);
        loadUserData(user);
    }

    await loadUserReviews(authService);
    
    await loadWatchlist(authService);

    setupTabs(authService);
    setupProfileForm(authService);
    setupPasswordForm(authService);
    setupQuickEditForm(authService);
    setupButtons(authService);
    setupAvatarUpload(authService);

    console.log('✅ Profile page initialized');
}

function loadUserData(user) {
    const avatarImg = document.getElementById('profile-avatar');
    if (user.avatar) {
        avatarImg.src = user.avatar;
    } else {
        avatarImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23007bff"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="white"%3E' + (user.firstName?.[0] || 'U') + '%3C/text%3E%3C/svg%3E';
    }
    document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profile-email').textContent = user.email;
    
    const joinDate = user.createdAt ? new Date(user.createdAt) : new Date();
    document.getElementById('member-since').textContent = 
        `Нэгдсэн: ${joinDate.toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    document.getElementById('watchlist-count').textContent = user.watchlist?.length || 0;
    document.getElementById('favorites-count').textContent = user.favorites?.length || 0;
    document.getElementById('ratings-count').textContent = user.ratings?.length || 0;

    document.getElementById('edit-firstName').value = user.firstName;
    document.getElementById('edit-lastName').value = user.lastName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-phone').value = user.phone || '';
}

async function loadUserReviews(authService) {
    try {
        const reviews = await authService.getUserReviews();
        const reviewsCountEl = document.getElementById('reviews-count');
        const ratingsContainer = document.getElementById('ratings-container');
        
        if (reviewsCountEl) {
            reviewsCountEl.textContent = reviews.length || 0;
        }
        
        if (ratingsContainer) {
            if (reviews.length === 0) {
                ratingsContainer.innerHTML = '<p class="no-data">Сэтгэгдэл бичээгүй байна</p>';
            } else {
                const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
                const movieInfoMap = new Map();
                
                if (service) {
                    const uniqueMovies = new Set(reviews.map(r => `${r.category}_${r.movieId}`));
                    const movieInfoPromises = Array.from(uniqueMovies).map(async (movieKey) => {
                        const [category, movieId] = movieKey.split('_');
                        try {
                            const details = category === 'movies' 
                                ? await service.getMovieDetails(movieId)
                                : await service.getTVDetails(movieId);
                            
                            if (details) {
                                movieInfoMap.set(movieKey, {
                                    name: details.name || 'Unknown',
                                    image: details.image || details.poster_path || '',
                                    category: category
                                });
                            }
                        } catch (error) {
                            console.error(`Error loading movie info for ${movieKey}:`, error);
                            movieInfoMap.set(movieKey, {
                                name: 'Unknown Movie',
                                image: '',
                                category: category
                            });
                        }
                    });
                    
                    await Promise.allSettled(movieInfoPromises);
                }
                
                ratingsContainer.innerHTML = reviews.map(review => {
                    const movieKey = `${review.category}_${review.movieId}`;
                    const movieInfo = movieInfoMap.get(movieKey) || {
                        name: 'Unknown Movie',
                        image: '',
                        category: review.category
                    };
                    
                    function escapeHtmlAttribute(text) {
                        return String(text || '')
                            .replace(/&/g, '&amp;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#39;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
                    }
                    
                    return `
                        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; margin-bottom: 20px;">
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                ${movieInfo.image ? `
                                    <img src="${movieInfo.image}" alt="${escapeHtmlAttribute(movieInfo.name)}" style="width: 80px; height: 120px; border-radius: 8px; object-fit: cover; cursor: pointer;" onclick="window.location.hash = '#/movie-details/${movieInfo.category}/${review.movieId}'">
                                ` : `
                                    <div style="width: 80px; height: 120px; border-radius: 8px; background: linear-gradient(135deg, #4da3ff, #667eea); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                                        <i class="fas fa-${movieInfo.category === 'movies' ? 'film' : 'tv'}"></i>
                                    </div>
                                `}
                                <div style="flex: 1;">
                                    <h3 style="color: #fff; font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; cursor: pointer;" onclick="window.location.hash = '#/movie-details/${movieInfo.category}/${review.movieId}'">${escapeHtmlAttribute(movieInfo.name)}</h3>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span style="color: #999; font-size: 0.9rem;">
                                            <i class="fas fa-${movieInfo.category === 'movies' ? 'film' : 'tv'}" style="color: #4da3ff; margin-right: 5px;"></i>
                                            ${movieInfo.category === 'movies' ? 'Кино' : 'Цуврал'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <review-card
                                username="${escapeHtmlAttribute(review.username || 'Хэрэглэгч')}"
                                rating="${review.rating || 0}"
                                text="${escapeHtmlAttribute(review.text || '')}"
                                date="${review.date || review.createdAt || new Date().toISOString()}"
                                avatar="${review.avatar || ''}"
                                is-admin="false"
                                user-id="${escapeHtmlAttribute(review.userId || '')}">
                            </review-card>
                        </div>
                    `;
                }).join('');
            }
        }
        
        console.log(`✅ Loaded ${reviews.length} user reviews`);
    } catch (error) {
        console.error('❌ Error loading user reviews:', error);
        const reviewsCountEl = document.getElementById('reviews-count');
        const ratingsContainer = document.getElementById('ratings-container');
        
        if (reviewsCountEl) {
            reviewsCountEl.textContent = '0';
        }
        if (ratingsContainer) {
            ratingsContainer.innerHTML = '<p class="no-data">Сэтгэгдэл ачаалахад алдаа гарлаа</p>';
        }
    }
}

async function loadWatchlist(authService) {
    try {
        const user = authService.getCurrentUser();
        const watchlistIds = user?.watchlist || [];
        const watchlistContainer = document.getElementById('watchlist-container');
        
        if (!watchlistContainer) return;
        
        if (watchlistIds.length === 0) {
            watchlistContainer.innerHTML = '<p class="no-data">Үзэх жагсаалт хоосон байна</p>';
            return;
        }
        
        const service = window.tmdbService || (typeof tmdbService !== 'undefined' ? tmdbService : null);
        if (!service) {
            watchlistContainer.innerHTML = '<p class="no-data">TMDB сервис ашиглах боломжгүй байна</p>';
            return;
        }
        
        watchlistContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;"><div class="loading-spinner" style="width: 50px; height: 50px; border: 4px solid rgba(77, 163, 255, 0.3); border-top-color: #4da3ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div><p>Ачааллаж байна...</p></div>';
        
        const moviePromises = watchlistIds.map(async (movieId) => {
            try {
                const details = await service.getMovieDetails(movieId);
                return { ...details, category: 'movies', id: movieId };
            } catch (error) {
                try {
                    const details = await service.getTVDetails(movieId);
                    return { ...details, category: 'tv', id: movieId };
                } catch (tvError) {
                    console.error(`Error loading watchlist item ${movieId}:`, error, tvError);
                    return null;
                }
            }
        });
        
        const movies = (await Promise.allSettled(moviePromises))
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value);
        
        if (movies.length === 0) {
            watchlistContainer.innerHTML = '<p class="no-data">Үзэх жагсаалт хоосон байна</p>';
            return;
        }
        
        watchlistContainer.innerHTML = '';
        movies.forEach((movie) => {
            const movieCard = document.createElement('movie-card');
            
            movieCard.setAttribute('name', movie.name || movie.title || 'Unknown');
            movieCard.setAttribute('category', movie.category || 'movies');
            movieCard.setAttribute('image', movie.image || movie.poster_path || '');
            movieCard.setAttribute('data-tmdb-id', movie.id || movie.tmdb_id || '');
            movieCard.setAttribute('data-media-type', movie.category === 'tv' ? 'tv' : 'movie');
            
            if (movie.year || movie.release_date) {
                const year = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '');
                movieCard.setAttribute('year-or-season', year || 'N/A');
            }
            
            if (movie.rating || movie.vote_average) {
                movieCard.setAttribute('rating', (movie.rating || movie.vote_average || 0).toFixed(1));
            }
            
            if (movie.description || movie.overview) {
                movieCard.setAttribute('description', movie.description || movie.overview || '');
            }
            
            watchlistContainer.appendChild(movieCard);
        });
        
        console.log(`✅ Loaded ${movies.length} watchlist items`);
    } catch (error) {
        console.error('❌ Error loading watchlist:', error);
        const watchlistContainer = document.getElementById('watchlist-container');
        if (watchlistContainer) {
            watchlistContainer.innerHTML = '<p class="no-data">Үзэх жагсаалт ачаалахад алдаа гарлаа</p>';
        }
    }
}

function setupTabs(authService) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            if (tabId === 'watchlist' && authService) {
                loadWatchlist(authService);
            }
        });
    });
}

function setupProfileForm(authService) {
    const form = document.getElementById('profile-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.save-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Хадгалж байна...';

        try {
            await authService.updateProfile({
                firstName: document.getElementById('edit-firstName').value,
                lastName: document.getElementById('edit-lastName').value,
                phone: document.getElementById('edit-phone').value
            });

            showNotification('Амжилттай хадгалагдлаа!', 'success');
            
            const user = authService.getCurrentUser();
            loadUserData(user);

        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Хадгалах';
        }
    });
}

function setupPasswordForm(authService) {
    const form = document.getElementById('password-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            showNotification('Шинэ нууц үг таарахгүй байна', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showNotification('Нууц үг 6-аас дээш тэмдэгттэй байх ёстой', 'error');
            return;
        }

        const submitBtn = form.querySelector('.save-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Солиж байна...';

        try {
            await authService.changePassword(oldPassword, newPassword);
            showNotification('Нууц үг амжилттай солигдлоо!', 'success');
            form.reset();
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Нууц үг солих';
        }
    });
}

function setupQuickEditForm(authService) {
    const modal = document.getElementById('edit-profile-modal');
    const form = document.getElementById('quick-edit-form');
    const closeBtn = document.getElementById('close-modal');
    const editBtn = document.getElementById('edit-profile-btn');

    editBtn.addEventListener('click', () => {
        const user = authService.getCurrentUser();
        document.getElementById('quick-firstName').value = user.firstName;
        document.getElementById('quick-lastName').value = user.lastName;
        document.getElementById('quick-phone').value = user.phone || '';
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            await authService.updateProfile({
                firstName: document.getElementById('quick-firstName').value,
                lastName: document.getElementById('quick-lastName').value,
                phone: document.getElementById('quick-phone').value
            });

            showNotification('Амжилттай хадгалагдлаа!', 'success');
            modal.classList.remove('show');
            
            const user = authService.getCurrentUser();
            loadUserData(user);

        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
}

function setupAvatarUpload(authService) {
    const modal = document.getElementById('avatar-upload-modal');
    const closeBtn = document.getElementById('close-avatar-modal');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarOptions = document.querySelector('.avatar-options');
    const avatarPreview = document.getElementById('avatar-preview');
    const previewImage = document.getElementById('preview-image');
    
    const fileInput = document.getElementById('file-input');
    const cameraInput = document.getElementById('camera-input');
    
    let currentImageData = null;

    changeAvatarBtn.addEventListener('click', () => {
        modal.classList.add('show');
        avatarOptions.style.display = 'flex';
        avatarPreview.style.display = 'none';
        currentImageData = null;
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        resetModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            resetModal();
        }
    });

    document.getElementById('upload-from-device').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    document.getElementById('take-photo').addEventListener('click', () => {
        cameraInput.click();
    });

    cameraInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    document.getElementById('enter-url').addEventListener('click', () => {
        const avatarUrl = prompt('Зургийн URL оруулна уу:');
        if (avatarUrl) {
            previewImage.src = avatarUrl;
            currentImageData = avatarUrl;
            showPreview();
        }
    });

    document.getElementById('cancel-preview').addEventListener('click', () => {
        resetModal();
    });

    document.getElementById('save-avatar').addEventListener('click', async () => {
        if (!currentImageData) return;

        try {
            await authService.updateProfile({ avatar: currentImageData });
            document.getElementById('profile-avatar').src = currentImageData;
            showNotification('Зураг амжилттай солигдлоо!', 'success');
            modal.classList.remove('show');
            resetModal();
        } catch (error) {
            showNotification('Зураг хадгалахад алдаа гарлаа', 'error');
        }
    });

    function handleFileSelect(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showNotification('Зөвхөн зураг файл оруулна уу', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showNotification('Файлын хэмжээ 5MB-аас бага байх ёстой', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageData = e.target.result;
            previewImage.src = currentImageData;
            showPreview();
        };
        reader.readAsDataURL(file);
    }

    function showPreview() {
        avatarOptions.style.display = 'none';
        avatarPreview.style.display = 'block';
    }

    function resetModal() {
        avatarOptions.style.display = 'flex';
        avatarPreview.style.display = 'none';
        currentImageData = null;
        fileInput.value = '';
        cameraInput.value = '';
    }
}

function setupButtons(authService) {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.onclick = () => {
        if (confirm('Та гарахдаа итгэлтэй байна уу?')) {
            authService.logout();
        }
    };

    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) deleteBtn.onclick = () => {
        const confirmed = confirm('Та бүртгэлээ устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй!');
        if (confirmed) {
            const doubleCheck = prompt('Баталгаажуулахын тулд "DELETE" гэж бичнэ үү:');
            if (doubleCheck === 'DELETE') {
                authService.logout();
                showNotification('Бүртгэл амжилттай устлаа', 'success');
            }
        }
    };
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}