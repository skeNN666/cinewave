// auth-service.js - Complete Authentication Service with MongoDB Backend
const API_BASE_URL = 'http://localhost:3000/api/auth';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.loadUserFromStorage();
    }

    // Load user and token from localStorage
    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('cinewave_user');
            const tokenData = localStorage.getItem('cinewave_token');
            
            if (userData && tokenData) {
                this.currentUser = JSON.parse(userData);
                this.token = tokenData;
                console.log('✅ User loaded from storage:', this.currentUser.email);
                
                // Optionally verify token is still valid (non-blocking)
                // If token is invalid, user will be logged out on next API call
                this.getProfile().catch(() => {
                    // Token invalid, clear storage silently
                    console.warn('⚠️ Token invalid, clearing storage');
                    localStorage.removeItem('cinewave_user');
                    localStorage.removeItem('cinewave_token');
                    this.currentUser = null;
                    this.token = null;
                }).catch(() => {
                    // Silently handle any errors during verification
                });
            }
        } catch (error) {
            console.error('❌ Error loading user:', error);
            localStorage.removeItem('cinewave_user');
            localStorage.removeItem('cinewave_token');
            this.currentUser = null;
            this.token = null;
        }
    }

    // Save user and token to localStorage
    saveUserToStorage(user, token) {
        try {
            localStorage.setItem('cinewave_user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('cinewave_token', token);
                this.token = token;
            }
            this.currentUser = user;
        } catch (error) {
            console.error('❌ Error saving user:', error);
        }
    }

    // Get authorization header for API requests
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Make API request helper
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
            console.error('API request error:', error);
            throw error;
        }
    }

    // Register new user
    async register(userData) {
        console.log('📝 Registering new user:', userData.email);
        
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

            // Save user and token (auto-login after registration)
            this.saveUserToStorage(response.user, response.token);

            console.log('✅ User registered successfully');
            return { success: true, user: response.user, token: response.token };
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        console.log('🔐 Attempting login:', email);
        
        try {
            const response = await this.apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Save user and token
            this.saveUserToStorage(response.user, response.token);

            console.log('✅ Login successful');
            return { success: true, user: response.user, token: response.token };
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    }

    // Logout user
    logout() {
        console.log('👋 Logging out user:', this.currentUser?.email);
        localStorage.removeItem('cinewave_user');
        localStorage.removeItem('cinewave_token');
        localStorage.removeItem('cinewave_all_users'); // Clean up old localStorage data
        this.currentUser = null;
        this.token = null;
        
        // Redirect to home
        window.location.hash = '#/';
    }

    // Get current user profile from server
    async getProfile() {
        try {
            const response = await this.apiRequest('/profile', {
                method: 'GET'
            });

            // Update current user
            this.saveUserToStorage(response.user, this.token);
            return response.user;
        } catch (error) {
            console.error('❌ Get profile error:', error);
            throw error;
        }
    }

    // Get current user (from memory)
    getCurrentUser() {
        return this.currentUser || null;
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.currentUser !== null && this.token !== null;
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        console.log('📝 Updating profile:', updates);

        try {
            const response = await this.apiRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });

            // Update current user
            this.saveUserToStorage(response.user, this.token);

            console.log('✅ Profile updated successfully');
            return { success: true, user: response.user };
        } catch (error) {
            console.error('❌ Update profile error:', error);
            throw error;
        }
    }

    // Change password
    async changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        console.log('🔒 Changing password');

        try {
            const response = await this.apiRequest('/change-password', {
                method: 'PUT',
                body: JSON.stringify({ oldPassword, newPassword })
            });

            console.log('✅ Password changed successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Change password error:', error);
            throw error;
        }
    }

    // Add to watchlist
    async addToWatchlist(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/watchlist', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'add' })
            });

            // Update current user
            if (this.currentUser) {
                this.currentUser.watchlist = response.watchlist;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            console.error('❌ Add to watchlist error:', error);
            throw error;
        }
    }

    // Remove from watchlist
    async removeFromWatchlist(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/watchlist', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'remove' })
            });

            // Update current user
            if (this.currentUser) {
                this.currentUser.watchlist = response.watchlist;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            console.error('❌ Remove from watchlist error:', error);
            throw error;
        }
    }

    // Add to favorites
    async addToFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/favorites', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'add' })
            });

            // Update current user
            if (this.currentUser) {
                this.currentUser.favorites = response.favorites;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            console.error('❌ Add to favorites error:', error);
            throw error;
        }
    }

    // Remove from favorites
    async removeFromFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/favorites', {
                method: 'POST',
                body: JSON.stringify({ movieId, action: 'remove' })
            });

            // Update current user
            if (this.currentUser) {
                this.currentUser.favorites = response.favorites;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            console.error('❌ Remove from favorites error:', error);
            throw error;
        }
    }

    // Rate movie
    async rateMovie(movieId, rating) {
        if (!this.isAuthenticated()) {
            throw new Error('Нэвтрээгүй байна');
        }

        try {
            const response = await this.apiRequest('/rating', {
                method: 'POST',
                body: JSON.stringify({ movieId, rating })
            });

            // Update current user
            if (this.currentUser) {
                this.currentUser.ratings = response.ratings;
                this.saveUserToStorage(this.currentUser, this.token);
            }

            return response;
        } catch (error) {
            console.error('❌ Rate movie error:', error);
            throw error;
        }
    }

    // Helper methods - Legacy methods removed (no longer needed with MongoDB)
    // Password hashing and verification now handled by backend
}

// Export singleton instance
export const authService = new AuthService();

// For debugging
window.authService = authService;