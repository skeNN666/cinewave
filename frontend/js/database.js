import { tmdbService } from './tmdb-service.js';
export let movieDatabase = [];
export let isUsingTMDB = false;
export let dataSource = 'tmdb'; 

export async function loadMovieDatabase(forceTMDB = true) {
  try {
    if (forceTMDB) {
      return await loadFromTMDB();
    } else {
      const jsonUrl = new URL('../data/movies.json', import.meta.url).href;
      const response = await fetch(jsonUrl, { cache: "no-store" });
      
      if (response.ok) {
        const data = await response.json();
        movieDatabase = Array.isArray(data.movies) ? data.movies : [];
        dataSource = 'local';
        return movieDatabase;
      } else {
        throw new Error('Local JSON not found');
      }
    }
    
  } catch (error) {
    return await loadFromTMDB();
  }
}

async function loadFromTMDB() {
  try {
    isUsingTMDB = true;
    dataSource = 'tmdb';
    
    const [popularMovies, popularTV, upcomingMovies] = await Promise.all([
      tmdbService.getPopularMovies(1),
      tmdbService.getPopularTVShows(1),
      tmdbService.getUpcomingMovies(1)
    ]);
    
    movieDatabase = [
      ...popularMovies.slice(0, 15), 
      ...popularTV.slice(0, 10),     
      ...upcomingMovies.slice(0, 8)  
    ];
    
    return movieDatabase;
    
  } catch (error) {
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

loadMovieDatabase(true);