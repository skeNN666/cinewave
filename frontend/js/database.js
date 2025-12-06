// frontend/js/database.js

let movieDatabase = [];

// Load movies from JSON file
async function loadMovieDatabase() {
    try {
        console.log('📂 Loading database from JSON...');
        const response = await fetch('../data/movies.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        movieDatabase = data.movies;
        console.log(`✅ Database loaded: ${movieDatabase.length} movies`);
        
        return movieDatabase;
    } catch (error) {
        console.error('❌ Error loading database:', error);
        
        // Fallback to hardcoded data
        console.log('⚠️ Using fallback data...');
        movieDatabase = getFallbackData();
        return movieDatabase;
    }
}

// Fallback data
function getFallbackData() {
    return [
        {
            "name": "The Conjuring: Last Rites",
            "category": "movies",
            "image": "movie1.jpg",
            "yearOrSeason": "2025 • 135 мин",
            "genre": ["horror", "thriller"]
        },
        {
            "name": "Tron: Ares",
            "category": "movies",
            "image": "movie2.jpg",
            "yearOrSeason": "2025 • 119 мин",
            "genre": ["sci-fi", "action", "adventure"]
        }
        // Add more if you want, but JSON should work
    ];
}

// Export functions
export { movieDatabase, loadMovieDatabase };