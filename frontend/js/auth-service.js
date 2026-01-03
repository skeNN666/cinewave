// auth-service.js - Updated to use real backend API
class AuthService {
    constructor() {
        this.API_URL = 'http://localhost:5000/api';
        this.currentUser = null;
        this.token = null;
        this.loadFromStorage();
    }

    // Load user and token from localStorage
    loadFromStorage() {
        try {
            const token = localStorage.getItem('cinewave_token');
            const userData = localStorage.getItem('cinewave_user');
            
            if (token && userData) {
                this.token = token;
                this.currentUser = JSON.parse(userData);
                console.log('✅ User session restored:', this.currentUser.email);
            }
        } catch (error) {
            console.error('❌ Error loading session:', error);
            this.clearStorage();
        }
    }

    // Save to localStorage
    saveToStorage(token, user) {
        try {
            localStorage.setItem('cinewave_token', token);
            localStorage.setItem('cinewave_user', JSON.stringify(user));
            this.token = token;
            this.currentUser = user;
        } catch (error) {
            console.error('❌ Error saving session:', error);
        }
    }

    // Clear localStorage
    clearStorage() {
        localStorage.removeItem('cinewave_token');
        localStorage.removeItem('cinewave_user');
        this.token = null;
        this.currentUser = null;
    }

    // API request helper
    async apiRequest(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    }

    // Register new user
    async register(userData) {
        console.log('📝 Registering new user:', userData.email);
        
        try {
            const response = await this.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password
                })
            });

            // Save token and user
            this.saveToStorage(response.token, response.user);

            console.log('✅ User registered successfully');
            return { success: true, user: response.user };

        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw new Error(error.message || 'Бүртгэл үүсгэхэд алдаа гарлаа');
        }
    }

    // Login user
    async login(email, password) {
        console.log('🔐 Attempting login:', email);
        
        try {
            const response = await this.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Save token and user
            this.saveToStorage(response.token, response.user);

            console.log('✅ Login successful');
            return { success: true, user: response.user };

        } catch (error) {
            console.error('❌ Login failed:', error);
            throw new Error(error.message || 'Нэвтрэхэд алдаа гарлаа');
        }
    }

    // Logout user
    logout() {
        console.log('👋 Logging out user:', this.currentUser?.email);
        this.clearStorage();
        window.location.hash = '#/';
    }

    // Get current user (from API)
    async getCurrentUserFromAPI() {
        try {
            const response = await this.apiRequest('/auth/me');
            this.currentUser = response.user;
            localStorage.setItem('cinewave_user', JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            console.error('❌ Failed to get user:', error);
            this.clearStorage();
            throw error;
        }
    }

    // Get current user (from memory)
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.token !== null && this.currentUser !== null;
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        console.log('📝 Updating profile:', updates);
        
        try {
            const response = await this.apiRequest('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });

            // Update local user data
            this.currentUser = response.user;
            localStorage.setItem('cinewave_user', JSON.stringify(response.user));

            console.log('✅ Profile updated successfully');
            return { success: true, user: response.user };

        } catch (error) {
            console.error('❌ Update failed:', error);
            throw new Error(error.message || 'Профайл шинэчлэхэд алдаа гарлаа');
        }
    }

    // Change password
    async changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        console.log('🔒 Changing password');
        
        try {
            await this.apiRequest('/user/password', {
                method: 'PUT',
                body: JSON.stringify({ oldPassword, newPassword })
            });

            console.log('✅ Password changed successfully');
            return { success: true };

        } catch (error) {
            console.error('❌ Password change failed:', error);
            throw new Error(error.message || 'Нууц үг солихоо алдаа гарлаа');
        }
    }

    // Watchlist methods
    async getWatchlist() {
        try {
            const response = await this.apiRequest('/user/watchlist');
            return response.watchlist;
        } catch (error) {
            console.error('❌ Get watchlist failed:', error);
            return [];
        }
    }

    async addToWatchlist(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest(`/user/watchlist/${movieId}`, {
                method: 'POST'
            });
            
            // Update local user
            this.currentUser.watchlist = response.watchlist;
            localStorage.setItem('cinewave_user', JSON.stringify(this.currentUser));
            
            return response.watchlist;
        } catch (error) {
            console.error('❌ Add to watchlist failed:', error);
            throw error;
        }
    }

    async removeFromWatchlist(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest(`/user/watchlist/${movieId}`, {
                method: 'DELETE'
            });
            
            // Update local user
            this.currentUser.watchlist = response.watchlist;
            localStorage.setItem('cinewave_user', JSON.stringify(this.currentUser));
            
            return response.watchlist;
        } catch (error) {
            console.error('❌ Remove from watchlist failed:', error);
            throw error;
        }
    }

    // Favorites methods
    async getFavorites() {
        try {
            const response = await this.apiRequest('/user/favorites');
            return response.favorites;
        } catch (error) {
            console.error('❌ Get favorites failed:', error);
            return [];
        }
    }

    async addToFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest(`/user/favorites/${movieId}`, {
                method: 'POST'
            });
            
            // Update local user
            this.currentUser.favorites = response.favorites;
            localStorage.setItem('cinewave_user', JSON.stringify(this.currentUser));
            
            return response.favorites;
        } catch (error) {
            console.error('❌ Add to favorites failed:', error);
            throw error;
        }
    }

    async removeFromFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest(`/user/favorites/${movieId}`, {
                method: 'DELETE'
            });
            
            // Update local user
            this.currentUser.favorites = response.favorites;
            localStorage.setItem('cinewave_user', JSON.stringify(this.currentUser));
            
            return response.favorites;
        } catch (error) {
            console.error('❌ Remove from favorites failed:', error);
            throw error;
        }
    }

    // Rating methods
    async getRatings() {
        try {
            const response = await this.apiRequest('/user/ratings');
            return response.ratings;
        } catch (error) {
            console.error('❌ Get ratings failed:', error);
            return {};
        }
    }

    async rateMovie(movieId, rating) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest(`/user/rate/${movieId}`, {
                method: 'POST',
                body: JSON.stringify({ rating })
            });
            
            // Update local user
            this.currentUser.ratings = response.ratings;
            localStorage.setItem('cinewave_user', JSON.stringify(this.currentUser));
            
            return response.ratings;
        } catch (error) {
            console.error('❌ Rate movie failed:', error);
            throw error;
        }
    }

    // Delete account
    async deleteAccount() {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            await this.apiRequest('/user/account', {
                method: 'DELETE'
            });
            
            this.logout();
            
        } catch (error) {
            console.error('❌ Delete account failed:', error);
            throw new Error(error.message || 'Бүртгэл устгахад алдаа гарлаа');
        }
    }
}

// Export singleton instance
export const authService = new AuthService();

// For debugging
window.authService = authService;