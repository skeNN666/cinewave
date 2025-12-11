// frontend/js/database.js
export let movieDatabase = [];

export async function loadMovieDatabase() {
  try {
    console.log('📂 Loading database from JSON...');

    // Resolve JSON relative to THIS module file (safe for imports from different HTML dirs)
    const jsonUrl = new URL('../data/movies.json', import.meta.url).href;

    const response = await fetch(jsonUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    movieDatabase = Array.isArray(data.movies) ? data.movies : [];
    console.log(`✅ Database loaded: ${movieDatabase.length} movies`);
    return movieDatabase;
  } catch (error) {
    console.error('❌ Error loading database:', error);
    console.log('⚠️ Using fallback data...');
    movieDatabase = [
      { "name": "The Conjuring: Last Rites", "category": "movies", "image": "movie1.jpg", "yearOrSeason": "2025 • 135 мин", "genre": ["horror","thriller"] },
      { "name": "Tron: Ares", "category": "movies", "image": "movie2.jpg", "yearOrSeason": "2025 • 119 мин", "genre": ["sci-fi","action","adventure"] }
    ];
    return movieDatabase;
  }
}
// Load the database immediately when this module is imported
loadMovieDatabase();    