// Quick script to check users in MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinewave';

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections in database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Check users collection
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    const users = await User.find({});
    
    console.log(`\n👥 Total users in database: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('📝 User details:');
      console.log('─'.repeat(80));
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Name: ${user.firstName} ${user.lastName}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Phone: ${user.phone || 'N/A'}`);
        console.log(`  Watchlist: ${user.watchlist?.length || 0} movies`);
        console.log(`  Favorites: ${user.favorites?.length || 0} movies`);
        console.log(`  Ratings: ${user.ratings?.length || 0} ratings`);
        console.log(`  Created: ${user.createdAt}`);
      });
    } else {
      console.log('⚠️  No users found in database yet.');
      console.log('   Try registering a user through the frontend or API.');
    }

    // Check reviews collection
    const Review = mongoose.model('Review', new mongoose.Schema({}, { strict: false }), 'reviews');
    const reviews = await Review.find({});
    
    console.log(`\n💬 Total reviews in database: ${reviews.length}\n`);
    
    if (reviews.length > 0) {
      console.log('📝 Review details:');
      console.log('─'.repeat(80));
      reviews.forEach((review, index) => {
        console.log(`\nReview ${index + 1}:`);
        console.log(`  ID: ${review._id}`);
        console.log(`  User ID: ${review.userId}`);
        console.log(`  Movie ID: ${review.movieId} (${review.category})`);
        console.log(`  Username: ${review.username || 'N/A'}`);
        console.log(`  Rating: ${review.rating}/10`);
        console.log(`  Text: ${review.text?.substring(0, 50)}...`);
        console.log(`  Created: ${review.createdAt}`);
      });
    } else {
      console.log('⚠️  No reviews found in database yet.');
      console.log('   Try writing a review through the frontend.');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
