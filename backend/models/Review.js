import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  movieId: {
    type: Number, // TMDB movie ID
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['movies', 'tv'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ movieId: 1, category: 1 });
// Index for efficient queries (allow multiple reviews for now, can restrict later)
reviewSchema.index({ userId: 1, movieId: 1, category: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
