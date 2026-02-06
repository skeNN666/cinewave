function getApiBaseUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api/auth';
    }
    const customUrl = localStorage.getItem('api_url');
    if (customUrl) {
        return customUrl;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname;
    if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return `${protocol}//${hostname}:3000/api/auth`;
    }
    
    return 'http://localhost:3000/api/auth';
}

const API_BASE_URL = getApiBaseUrl();

class AuthService {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.loadUserFromStorage();
    }

    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('cinewave_user');
            const tokenData = localStorage.getItem('cinewave_token');
            
            if (userData && tokenData) {
                this.currentUser = JSON.parse(userData);
                this.token = tokenData;
                this.getProfile().catch(() => {
                    localStorage.removeItem('cinewave_user');
                    localStorage.removeItem('cinewave_token');
                    this.currentUser = null;
                    this.token = null;
                }).catch(() => {
                });
            }
        } catch (error) {
            localStorage.removeItem('cinewave_user');
            localStorage.removeItem('cinewave_token');
            this.currentUser = null;
            this.token = null;
        }
    }
    saveUserToStorage(user, token) {
        try {
            localStorage.setItem('cinewave_user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('cinewave_token', token);
                this.token = token;
            }
            this.currentUser = user;
            
            window.dispatchEvent(new Event('storage'));
            
            setTimeout(() => {
                const navbar = document.querySelector('cinewave-navbar');
                if (navbar) {
                    navbar.updateNavForAuth();
                }
            }, 100);
        } catch (error) {
        }
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async apiRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        
        try {
            const response = await this.apiRequest('/register', {
                method: 'POST',
                body: JSON.stringify({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone || '',
                    password: userData.password,
                    confirmPassword: userData.confirmPassword
                })
            });

            this.saveUserToStorage(response.user, response.token);

            return { success: true, user: response.user, token: response.token };
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        
        try {
            const response = await this.apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            this.saveUserToStorage(response.user, response.token);

            console.log('✅ Login successful');
            return { success: true, user: response.user, token: response.token };
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    }

    logout() {
        console.log('👋 Logging out user:', this.currentUser?.email);
        localStorage.removeItem('cinewave_user');
        localStorage.removeItem('cinewave_token');
        localStorage.removeItem('cinewave_all_users');
        this.currentUser = null;
        this.token = null;
        
        window.dispatchEvent(new Event('storage'));
        
        const navbar = document.querySelector('cinewave-navbar');
        if (navbar) {
            navbar.updateNavForAuth();
        }
        
        window.location.hash = '#/';
    }

    async getProfile() {
        try {
            const response = await this.apiRequest('/profile', {
                method: 'GET'
            });

            this.saveUserToStorage(response.user, this.token);
            return response.user;
        } catch (error) {
            console.error('❌ Get profile error:', error);
            throw error;
        }
    }

    getCurrentUser() {
        return this.currentUser || null;
    }

    isAuthenticated() {
        return this.currentUser !== null && this.token !== null;
    }

    async updateProfile(updates) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }


        try {
            const response = await this.apiRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });

            this.saveUserToStorage(response.user, this.token);

            return { success: true, user: response.user };
        } catch (error) {
            throw error;
        }
    }

    async changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/change-password', {
                method: 'PUT',
                body: JSON.stringify({ oldPassword, newPassword })
            });

            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    async addToWatchlist(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/watchlist', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'add' })
            });

            if (this.currentUser) {
                this.currentUser.watchlist = response.watchlist;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async removeFromWatchlist(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/watchlist', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'remove' })
            });

            if (this.currentUser) {
                this.currentUser.watchlist = response.watchlist;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async addToFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/favorites', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'add' })
            });

            if (this.currentUser) {
                this.currentUser.favorites = response.favorites;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async removeFromFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/favorites', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'remove' })
            });

            if (this.currentUser) {
                this.currentUser.favorites = response.favorites;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async rateMovie(movieId, rating) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/rating', {
                method: 'POST',
                body: JSON.stringify({ movieId, rating })
            });

            if (this.currentUser) {
                this.currentUser.ratings = response.ratings;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    getBaseUrl() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        
        const customUrl = localStorage.getItem('api_url');
        if (customUrl) {
            return customUrl.replace('/api/auth', '');
        }
        
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const hostname = window.location.hostname;
        if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
            return `${protocol}//${hostname}:3000`;
        }
        
        return 'http://localhost:3000';
    }

    async submitReview(movieId, category, rating, text) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        try {
            const baseUrl = this.getBaseUrl();
            const url = `${baseUrl}/api/reviews`;
            
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ movieId: parseInt(movieId), category, rating, text })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Review submission failed');
            }

            return { success: true, review: data.review };
        } catch (error) {
            throw error;
        }
    }

    async getMovieReviews(movieId, category) {
        const baseUrl = this.getBaseUrl();
        const url = `${baseUrl}/api/reviews/movie/${category}/${movieId}`;
        
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            let message = `HTTP error! status: ${response.status}`;
            try {
                const maybeJson = await response.json();
                message = maybeJson?.message || message;
            } catch (_) {
            }
            throw new Error(message);
        }

        const data = await response.json();

        return data.reviews || [];
    }

    async getAllReviews() {
        const baseUrl = this.getBaseUrl();
        const url = `${baseUrl}/api/reviews`;
        
        console.log('📖 Fetching all reviews from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            let message = `HTTP error! status: ${response.status}`;
            try {
                const maybeJson = await response.json();
                message = maybeJson?.message || message;
            } catch (_) {
            }
            throw new Error(message);
        }

        const data = await response.json();
        console.log('✅ All reviews fetched:', data.reviews?.length || 0, 'reviews');

        return data.reviews || [];
    }

    async getUserReviews() {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        const baseUrl = this.getBaseUrl();
        const url = `${baseUrl}/api/reviews/user`;
        
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });

        if (!response.ok) {
            let message = `HTTP error! status: ${response.status}`;
            try {
                const maybeJson = await response.json();
                message = maybeJson?.message || message;
            } catch (_) {
            }
            throw new Error(message);
        }

        const data = await response.json();

        return data.reviews || [];
    }
}

export const authService = new AuthService();

window.authService = authService;