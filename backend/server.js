// server.js - Express Server with MongoDB
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinewave', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: function() {
            return `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}&background=007bff&color=fff&size=200`;
        }
    },
    watchlist: [{
        type: Number,
        ref: 'Movie'
    }],
    favorites: [{
        type: Number,
        ref: 'Movie'
    }],
    ratings: {
        type: Map,
        of: Number,
        default: {}
    },
    reviews: [{
        movieId: Number,
        rating: Number,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cinewave_secret_key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        
        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password
        });
        
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'cinewave_secret_key',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: user.toJSON()
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'cinewave_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            user: user.toJSON()
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== USER ROUTES ====================

// Update profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, phone, avatar } = req.body;
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (avatar) user.avatar = avatar;
        
        await user.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.toJSON()
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password
app.put('/api/user/password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Both old and new passwords are required' });
        }
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
        
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== WATCHLIST ROUTES ====================

// Get watchlist
app.get('/api/user/watchlist', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({
            success: true,
            watchlist: user.watchlist
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to watchlist
app.post('/api/user/watchlist/:movieId', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.userId);
        
        if (!user.watchlist.includes(parseInt(movieId))) {
            user.watchlist.push(parseInt(movieId));
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'Added to watchlist',
            watchlist: user.watchlist
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from watchlist
app.delete('/api/user/watchlist/:movieId', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.userId);
        
        user.watchlist = user.watchlist.filter(id => id !== parseInt(movieId));
        await user.save();
        
        res.json({
            success: true,
            message: 'Removed from watchlist',
            watchlist: user.watchlist
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== FAVORITES ROUTES ====================

// Get favorites
app.get('/api/user/favorites', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({
            success: true,
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to favorites
app.post('/api/user/favorites/:movieId', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.userId);
        
        if (!user.favorites.includes(parseInt(movieId))) {
            user.favorites.push(parseInt(movieId));
            await user.save();
        }
        
        res.json({
            success: true,
            message: 'Added to favorites',
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from favorites
app.delete('/api/user/favorites/:movieId', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.userId);
        
        user.favorites = user.favorites.filter(id => id !== parseInt(movieId));
        await user.save();
        
        res.json({
            success: true,
            message: 'Removed from favorites',
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== RATINGS ROUTES ====================

// Rate movie
app.post('/api/user/rate/:movieId', authenticateToken, async (req, res) => {
    try {
        const { movieId } = req.params;
        const { rating } = req.body;
        
        if (rating < 1 || rating > 10) {
            return res.status(400).json({ error: 'Rating must be between 1 and 10' });
        }
        
        const user = await User.findById(req.userId);
        user.ratings.set(movieId, rating);
        await user.save();
        
        res.json({
            success: true,
            message: 'Rating saved',
            ratings: Object.fromEntries(user.ratings)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user ratings
app.get('/api/user/ratings', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({
            success: true,
            ratings: Object.fromEntries(user.ratings)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== DELETE ACCOUNT ====================

app.delete('/api/user/account', authenticateToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.userId);
        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
});