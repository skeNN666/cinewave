// frontend/js/database.js (UPDATED - TMDB as primary)
import { tmdbService } from './tmdb-service.js';

export let movieDatabase = [];
export let isUsingTMDB = false;
export let dataSource = 'tmdb'; // 'local' or 'tmdb'

export async function loadMovieDatabase(forceTMDB = true) {
  try {
    if (forceTMDB) {
      // Always use TMDB (or switch based on preference)
      console.log('🌐 Loading from TMDB API...');
      return await loadFromTMDB();
    } else {
      // Try local JSON first
      console.log('📂 Trying local database...');
      const jsonUrl = new URL('../data/movies.json', import.meta.url).href;
      const response = await fetch(jsonUrl, { cache: "no-store" });
      
      if (response.ok) {
        const data = await response.json();
        movieDatabase = Array.isArray(data.movies) ? data.movies : [];
        console.log(`✅ Local database loaded: ${movieDatabase.length} movies`);
        dataSource = 'local';
        return movieDatabase;
      } else {
        throw new Error('Local JSON not found');
      }
    }
    
  } catch (error) {
    console.log('⚠️ Falling back to TMDB...', error.message);
    return await loadFromTMDB();
  }
}

async function loadFromTMDB() {
  try {
    console.log('🌐 Fetching fresh data from TMDB...');
    isUsingTMDB = true;
    dataSource = 'tmdb';
    
    // Fetch all data in parallel
    const [popularMovies, popularTV, upcomingMovies] = await Promise.all([
      tmdbService.getPopularMovies(1),
      tmdbService.getPopularTVShows(1),
      tmdbService.getUpcomingMovies(1)
    ]);
    
    // Combine all data
    movieDatabase = [
      ...popularMovies.slice(0, 15), // Top 15 popular movies
      ...popularTV.slice(0, 10),     // Top 10 popular TV shows
      ...upcomingMovies.slice(0, 8)  // Top 8 upcoming movies
    ];
    
    console.log(`✅ TMDB data loaded: ${movieDatabase.length} items`);
    return movieDatabase;
    
  } catch (error) {
    console.error('❌ Error loading from TMDB:', error);
    console.log('⚠️ Using minimal fallback data...');
    movieDatabase = getFallbackData();
    dataSource = 'fallback';
    return movieDatabase;
  }
}

function getFallbackData() {
  return [
    { 
      "name": "The Conjuring: Last Rites", 
      "category": "movies", 
      "image": "movie1.jpg", 
      "yearOrSeason": "2025 • Horror", 
      "genre": ["horror","thriller"],
      "rating": 7.5,
      "description": "A supernatural horror film."
    },
    { 
      "name": "Tron: Ares", 
      "category": "movies", 
      "image": "movie2.jpg", 
      "yearOrSeason": "2025 • Sci-Fi", 
      "genre": ["sci-fi","action","adventure"],
      "rating": 8.2,
      "description": "The next chapter in the Tron franchise."
    }
  ];
}

// Load with TMDB as default
loadMovieDatabase(true);