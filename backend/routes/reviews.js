import express from 'express';
import Review from '../models/Review.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews (for all reviews page)
router.get('/', async (req, res) => {
  try {
    console.log('📖 Fetching all reviews');
    
    const reviews = await Review.find({})
      .populate('userId', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${reviews.length} reviews in database`);

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => {
      const userIdObj = review.userId;
      let userId = review.userId?.toString();
      let username = review.username || 'Хэрэглэгч';
      let avatar = review.avatar || null;

      if (userIdObj && typeof userIdObj === 'object' && !userIdObj._id) {
        userId = userIdObj._id?.toString() || userIdObj.toString();
        if (userIdObj.firstName || userIdObj.lastName) {
          username = `${userIdObj.firstName || ''} ${userIdObj.lastName || ''}`.trim() || 
                     userIdObj.email?.split('@')[0] || username;
        }
        avatar = avatar || userIdObj.avatar || null;
      } else if (userIdObj && typeof userIdObj === 'object' && userIdObj._id) {
        userId = userIdObj._id.toString();
        username = `${userIdObj.firstName || ''} ${userIdObj.lastName || ''}`.trim() || 
                   userIdObj.email?.split('@')[0] || username;
        avatar = avatar || userIdObj.avatar || null;
      }

      return {
        id: review._id.toString(),
        userId: userId,
        username: username,
        avatar: avatar,
        rating: review.rating,
        text: review.text,
        movieId: review.movieId,
        category: review.category,
        date: review.createdAt ? new Date(review.createdAt).toISOString() : (review.date || new Date().toISOString()),
        isAdmin: false
      };
    });

    console.log(`📤 Sending ${formattedReviews.length} formatted reviews to frontend`);
    res.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('❌ Get all reviews error:', error);
    res.status(500).json({ 
      message: 'Сэтгэгдлүүдийг авахад алдаа гарлаа',
      error: error.message 
    });
  }
});

// Get all reviews for a specific user (for profile page)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    console.log(`📖 Fetching reviews for user: ${req.userId}`);
    
    const reviews = await Review.find({ 
      userId: req.userId 
    })
      .populate('userId', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${reviews.length} reviews for user`);

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => {
      const userIdObj = review.userId;
      let userId = review.userId?.toString();
      let username = review.username || 'Хэрэглэгч';
      let avatar = review.avatar || null;

      if (userIdObj && typeof userIdObj === 'object' && !userIdObj._id) {
        userId = userIdObj._id?.toString() || userIdObj.toString();
        if (userIdObj.firstName || userIdObj.lastName) {
          username = `${userIdObj.firstName || ''} ${userIdObj.lastName || ''}`.trim() || 
                     userIdObj.email?.split('@')[0] || username;
        }
        avatar = avatar || userIdObj.avatar || null;
      } else if (userIdObj && typeof userIdObj === 'object' && userIdObj._id) {
        userId = userIdObj._id.toString();
        username = `${userIdObj.firstName || ''} ${userIdObj.lastName || ''}`.trim() || 
                   userIdObj.email?.split('@')[0] || username;
        avatar = avatar || userIdObj.avatar || null;
      }

      return {
        id: review._id.toString(),
        userId: userId,
        username: username,
        avatar: avatar,
        rating: review.rating,
        text: review.text,
        movieId: review.movieId,
        category: review.category,
        date: review.createdAt ? new Date(review.createdAt).toISOString() : (review.date || new Date().toISOString()),
        isAdmin: false
      };
    });

    console.log(`📤 Sending ${formattedReviews.length} formatted reviews to frontend`);
    res.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('❌ Get user reviews error:', error);
    res.status(500).json({ 
      message: 'Хэрэглэгчийн сэтгэгдлүүдийг авахад алдаа гарлаа',
      error: error.message 
    });
  }
});

// Get all reviews for a specific movie
router.get('/movie/:category/:movieId', async (req, res) => {
  try {
    const { category, movieId } = req.params;
    const parsedMovieId = parseInt(movieId);
    
    console.log(`📖 Fetching reviews for movieId: ${parsedMovieId}, category: ${category}`);
    
    const reviews = await Review.find({ 
      movieId: parsedMovieId, 
      category 
    })
    .populate('userId', 'firstName lastName email avatar')
    .sort({ createdAt: -1 })
    .lean();

    console.log(`✅ Found ${reviews.length} reviews in database`);

    // Format reviews for frontend
    const formattedReviews = reviews.map(review => {
      // Handle populated userId (object) or just ObjectId
      const userIdObj = review.userId;
      let userId = review.userId?.toString();
      let username = review.username || 'Хэрэглэгч';
      let avatar = review.avatar || null;

      // If userId is populated (object with user data)
      if (userIdObj && typeof userIdObj === 'object' && !userIdObj._id) {
        // It's already an object with user fields
        userId = userIdObj._id?.toString() || userIdObj.toString();
        if (userIdObj.firstName || userIdObj.lastName) {
          username = `${userIdObj.firstName || ''} ${userIdObj.lastName || ''}`.trim() || 
                     userIdObj.email?.split('@')[0] || username;
        }
        avatar = avatar || userIdObj.avatar || null;
      } else if (userIdObj && typeof userIdObj === 'object' && userIdObj._id) {
        // Populated mongoose document
        userId = userIdObj._id.toString();
        username = `${userIdObj.firstName || ''} ${userIdObj.lastName || ''}`.trim() || 
                   userIdObj.email?.split('@')[0] || username;
        avatar = avatar || userIdObj.avatar || null;
      }

      return {
        id: review._id.toString(),
        userId: userId,
        username: username,
        avatar: avatar,
        rating: review.rating,
        text: review.text,
        date: review.createdAt ? new Date(review.createdAt).toISOString() : (review.date || new Date().toISOString()),
        isAdmin: false
      };
    });

    console.log(`📤 Sending ${formattedReviews.length} formatted reviews to frontend`);
    res.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('❌ Get reviews error:', error);
    res.status(500).json({ 
      message: 'Сэтгэгдлүүдийг авахад алдаа гарлаа',
      error: error.message 
    });
  }
});

// Create a new review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { movieId, category, rating, text } = req.body;

    if (!movieId || !category || !rating || !text) {
      return res.status(400).json({ 
        message: 'Бүх талбарыг бөглөнө үү' 
      });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ 
        message: 'Үнэлгээ 1-10 хооронд байх ёстой' 
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      userId: req.userId,
      movieId: parseInt(movieId),
      category
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Та энэ кинонд аль хэдийн сэтгэгдэл үлдээсэн байна' 
      });
    }

    // Get user info for username and avatar
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Хэрэглэгч олдсонгүй' 
      });
    }

    const username = `${user.firstName} ${user.lastName}`.trim() || 
                     user.email?.split('@')[0] || 'Хэрэглэгч';

    // Create new review
    const review = new Review({
      userId: req.userId,
      movieId: parseInt(movieId),
      category,
      rating,
      text: text.trim(),
      username,
      avatar: user.avatar || null
    });

    await review.save();

    // Populate and format response
    await review.populate('userId', 'firstName lastName email avatar');
    
    res.status(201).json({
      message: 'Сэтгэгдэл амжилттай үлдээгдлээ',
      review: {
        id: review._id.toString(),
        userId: review.userId._id?.toString() || review.userId.toString(),
        username,
        avatar: review.avatar || review.userId.avatar || null,
        rating: review.rating,
        text: review.text,
        date: review.createdAt
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Та энэ кинонд аль хэдийн сэтгэгдэл үлдээсэн байна' 
      });
    }
    res.status(500).json({ 
      message: 'Сэтгэгдэл үлдээхэд алдаа гарлаа' 
    });
  }
});

// Update a review (user can edit their own review)
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        message: 'Сэтгэгдэл олдсонгүй' 
      });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        message: 'Та зөвхөн өөрийн сэтгэгдлийг засах боломжтой' 
      });
    }

    if (rating) {
      if (rating < 1 || rating > 10) {
        return res.status(400).json({ 
          message: 'Үнэлгээ 1-10 хооронд байх ёстой' 
        });
      }
      review.rating = rating;
    }

    if (text) {
      review.text = text.trim();
    }

    await review.save();
    await review.populate('userId', 'firstName lastName email avatar');

    res.json({
      message: 'Сэтгэгдэл амжилттай шинэчлэгдлээ',
      review: {
        id: review._id.toString(),
        userId: review.userId._id?.toString() || review.userId.toString(),
        username: review.username,
        avatar: review.avatar || review.userId.avatar || null,
        rating: review.rating,
        text: review.text,
        date: review.createdAt
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ 
      message: 'Сэтгэгдэл шинэчлэхэд алдаа гарлаа' 
    });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        message: 'Сэтгэгдэл олдсонгүй' 
      });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        message: 'Та зөвхөн өөрийн сэтгэгдлийг устгах боломжтой' 
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      message: 'Сэтгэгдэл амжилттай устгагдлаа'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      message: 'Сэтгэгдэл устгахад алдаа гарлаа' 
    });
  }
});

export default router;
