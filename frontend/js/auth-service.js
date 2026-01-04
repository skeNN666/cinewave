// auth-service.js - Complete Authentication Service
class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    // Load user from localStorage
    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('cinewave_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('✅ User loaded from storage:', this.currentUser.email);
            }
        } catch (error) {
            console.error('❌ Error loading user:', error);
            localStorage.removeItem('cinewave_user');
        }
    }

    // Save user to localStorage
    saveUserToStorage(user) {
        try {
            localStorage.setItem('cinewave_user', JSON.stringify(user));
            this.currentUser = user;
        } catch (error) {
            console.error('❌ Error saving user:', error);
        }
    }

    // Register new user
    async register(userData) {
        console.log('📝 Registering new user:', userData.email);
        
        // Simulate API delay
        await this.delay(1000);
        
        // Check if user already exists
        const existingUsers = this.getAllUsers();
        const userExists = existingUsers.some(u => u.email === userData.email);
        
        if (userExists) {
            throw new Error('Энэ имэйл хаягаар бүртгэлтэй хэрэглэгч байна');
        }

        // Create new user
        const newUser = {
            id: this.generateUserId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            password: this.hashPassword(userData.password), // In production, hash on server
            avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=007bff&color=fff&size=200`,
            joinDate: new Date().toISOString(),
            watchlist: [],
            favorites: [],
            ratings: {},
            reviews: []
        };

        // Save to all users list
        existingUsers.push(newUser);
        localStorage.setItem('cinewave_all_users', JSON.stringify(existingUsers));

        // Set as current user (auto-login after registration)
        this.saveUserToStorage(newUser);

        console.log('✅ User registered successfully');
        return { success: true, user: this.sanitizeUser(newUser) };
    }

    // Login user
    async login(email, password) {
        console.log('🔐 Attempting login:', email);
        
        // Simulate API delay
        await this.delay(800);
        
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('Имэйл хаяг эсвэл нууц үг буруу байна');
        }

        // Check password
        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Имэйл хаяг эсвэл нууц үг буруу байна');
        }

        // Save as current user
        this.saveUserToStorage(user);

        console.log('✅ Login successful');
        return { success: true, user: this.sanitizeUser(user) };
    }

    // Logout user
    logout() {
        console.log('👋 Logging out user:', this.currentUser?.email);
        localStorage.removeItem('cinewave_user');
        this.currentUser = null;
        
        // Redirect to home
        window.location.hash = '#/';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        console.log('📝 Updating profile:', updates);
        await this.delay(800);

        // Update current user
        this.currentUser = { ...this.currentUser, ...updates };

        // Update in all users list
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('cinewave_all_users', JSON.stringify(users));
        }

        // Save to storage
        this.saveUserToStorage(this.currentUser);

        console.log('✅ Profile updated successfully');
        return { success: true, user: this.sanitizeUser(this.currentUser) };
    }

    // Change password
    async changePassword(oldPassword, newPassword) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        console.log('🔒 Changing password');
        
        // Simulate API delay
        await this.delay(800);

        // Verify old password
        if (!this.verifyPassword(oldPassword, this.currentUser.password)) {
            throw new Error('Хуучин нууц үг буруу байна');
        }

        // Update password
        this.currentUser.password = this.hashPassword(newPassword);

        // Update in all users list
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('cinewave_all_users', JSON.stringify(users));
        }

        // Save to storage
        this.saveUserToStorage(this.currentUser);

        console.log('✅ Password changed successfully');
        return { success: true };
    }

    // Add to watchlist
    async addToWatchlist(movieId) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        if (!this.currentUser.watchlist.includes(movieId)) {
            this.currentUser.watchlist.push(movieId);
            await this.updateProfile({ watchlist: this.currentUser.watchlist });
        }
    }

    // Remove from watchlist
    async removeFromWatchlist(movieId) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        this.currentUser.watchlist = this.currentUser.watchlist.filter(id => id !== movieId);
        await this.updateProfile({ watchlist: this.currentUser.watchlist });
    }

    // Add to favorites
    async addToFavorites(movieId) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        if (!this.currentUser.favorites.includes(movieId)) {
            this.currentUser.favorites.push(movieId);
            await this.updateProfile({ favorites: this.currentUser.favorites });
        }
    }

    // Remove from favorites
    async removeFromFavorites(movieId) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== movieId);
        await this.updateProfile({ favorites: this.currentUser.favorites });
    }

    // Rate movie
    async rateMovie(movieId, rating) {
        if (!this.currentUser) {
            throw new Error('Нэвтрээгүй байна');
        }

        this.currentUser.ratings[movieId] = rating;
        await this.updateProfile({ ratings: this.currentUser.ratings });
    }

    // Helper methods
    getAllUsers() {
        try {
            const users = localStorage.getItem('cinewave_all_users');
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('❌ Error loading users:', error);
            return [];
        }
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash for demo - in production, use bcrypt on server
        return btoa(password + 'cinewave_salt');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    sanitizeUser(user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export const authService = new AuthService();

// For debugging
window.authService = authService;