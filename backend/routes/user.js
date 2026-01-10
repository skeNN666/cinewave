import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.userId }
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Энэ и-мейл хаяг аль хэдийн ашиглагдаж байна' 
        });
      }
      updates.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    res.json({
      message: 'Профайл амжилттай шинэчлэгдлээ',
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
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Профайл шинэчлэхэд алдаа гарлаа' 
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Хуучин болон шинэ нууц үг оруулна уу' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Хуучин нууц үг буруу байна' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Нууц үг амжилттай өөрчлөгдлөө'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Нууц үг өөрчлөхөд алдаа гарлаа' 
    });
  }
});

// Watchlist management
router.post('/watchlist', authenticateToken, async (req, res) => {
  try {
    const { movieId, action } = req.body;

    if (!movieId || !action) {
      return res.status(400).json({ 
        message: 'Киноны ID болон үйлдэл оруулна уу' 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    if (action === 'add') {
      if (!user.watchlist.includes(movieId)) {
        user.watchlist.push(movieId);
      }
    } else if (action === 'remove') {
      user.watchlist = user.watchlist.filter(id => id !== movieId);
    } else {
      return res.status(400).json({ 
        message: 'Буруу үйлдэл' 
      });
    }

    await user.save();

    res.json({
      message: action === 'add' ? 'Хадгалсан жагсаалтад нэмэгдлээ' : 'Хадгалсан жагсаалтаас устгалаа',
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Watchlist error:', error);
    res.status(500).json({ 
      message: 'Хадгалсан жагсаалт шинэчлэхэд алдаа гарлаа' 
    });
  }
});

// Favorites management
router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { movieId, action } = req.body;

    if (!movieId || !action) {
      return res.status(400).json({ 
        message: 'Киноны ID болон үйлдэл оруулна уу' 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    if (action === 'add') {
      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
      }
    } else if (action === 'remove') {
      user.favorites = user.favorites.filter(id => id !== movieId);
    } else {
      return res.status(400).json({ 
        message: 'Буруу үйлдэл' 
      });
    }

    await user.save();

    res.json({
      message: action === 'add' ? 'Дуртай жагсаалтад нэмэгдлээ' : 'Дуртай жагсаалтаас устгалаа',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Favorites error:', error);
    res.status(500).json({ 
      message: 'Дуртай жагсаалт шинэчлэхэд алдаа гарлаа' 
    });
  }
});

// Rating management
router.post('/rating', authenticateToken, async (req, res) => {
  try {
    const { movieId, rating } = req.body;

    if (!movieId || !rating) {
      return res.status(400).json({ 
        message: 'Киноны ID болон үнэлгээ оруулна уу' 
      });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ 
        message: 'Үнэлгээ 1-10 хооронд байх ёстой' 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    // Update or add rating
    const existingRatingIndex = user.ratings.findIndex(r => r.movieId === movieId);
    if (existingRatingIndex >= 0) {
      user.ratings[existingRatingIndex].rating = rating;
      user.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      user.ratings.push({ movieId, rating });
    }

    await user.save();

    res.json({
      message: 'Үнэлгээ амжилттай хадгалагдлаа',
      ratings: user.ratings
    });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ 
      message: 'Үнэлгээ хадгалахад алдаа гарлаа' 
    });
  }
});

export default router;
