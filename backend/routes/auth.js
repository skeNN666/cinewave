import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
    expiresIn: '7d'
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: 'Бүх талбарыг бөглөнө үү' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: 'Нууц үг таарахгүй байна' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Энэ и-мейл хаяг аль хэдийн бүртгэгдсэн байна' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Амжилттай бүртгэгдлээ',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        watchlist: user.watchlist,
        favorites: user.favorites,
        ratings: user.ratings
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Энэ и-мейл хаяг аль хэдийн бүртгэгдсэн байна' 
      });
    }
    res.status(500).json({ 
      message: 'Бүртгэл үүсгэхэд алдаа гарлаа' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'И-мейл болон нууц үг оруулна уу' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: 'И-мейл эсвэл нууц үг буруу байна' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'И-мейл эсвэл нууц үг буруу байна' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Амжилттай нэвтэрлээ',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        watchlist: user.watchlist,
        favorites: user.favorites,
        ratings: user.ratings
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Нэвтрэхэд алдаа гарлаа' 
    });
  }
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        watchlist: user.watchlist,
        favorites: user.favorites,
        ratings: user.ratings
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Профайл авахад алдаа гарлаа' 
    });
  }
});

export default router;
