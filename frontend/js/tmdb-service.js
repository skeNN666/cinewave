// frontend/js/tmdb-service.js
export class TMDBService {
    constructor() {
        this.API_KEY = '744f024b4bfcd231abca3a0a3e21c84e';
        this.BASE_URL = 'https://api.themoviedb.org/3';
        this.IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
        this.PROFILE_IMAGE_URL = 'https://image.tmdb.org/t/p/w185';
        this.LANGUAGE = 'en-US';
    }

    async fetchFromTMDB(endpoint, params = {}) {
        try {
            const queryParams = new URLSearchParams({
                api_key: this.API_KEY,
                language: this.LANGUAGE,
                ...params
            });

            const response = await fetch(`${this.BASE_URL}${endpoint}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`TMDB API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching from TMDB:', error);
            throw error;
        }
    }
    async getNowPlayingMovies(page = 1) {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        
        const data = await this.fetchFromTMDB('/discover/movie', {
            page,
            'release_date.gte': sixMonthsAgo.toISOString().split('T')[0],
            'release_date.lte': today.toISOString().split('T')[0],
            sort_by: 'release_date.desc',
            'vote_count.gte': 50
        });
        
        console.log(`📅 Latest movies date range: ${sixMonthsAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`);
        return data.results.map(movie => this.mapMovieData(movie));
    }

    // Get popular movies (backup method)
    async getPopularMovies(page = 1) {
        const data = await this.fetchFromTMDB('/movie/popular', { page });
        return data.results.map(movie => this.mapMovieData(movie));
    }

    // Get RECENT TV shows (currently airing and recently aired)
    // Includes all TV shows (reality, scripted, etc.)
    async getAiringTodayTV(page = 1) {
        // Use /tv/on_the_air endpoint which returns shows currently on the air (latest)
        const data = await this.fetchFromTMDB('/tv/on_the_air', { page });
        
        console.log(`📺 Found ${data.results.length} TV shows from /tv/on_the_air endpoint`);
        
        // Sort by first_air_date descending to get newest first
        const sortedResults = [...data.results].sort((a, b) => {
            const dateA = a.first_air_date ? new Date(a.first_air_date) : new Date(0);
            const dateB = b.first_air_date ? new Date(b.first_air_date) : new Date(0);
            return dateB - dateA; // Descending (newest first)
        });
        
        console.log(`✅ Returning ${sortedResults.length} latest TV shows (all types included)`);
        
        // Log sample results
        if (sortedResults.length > 0) {
            console.log('Sample latest TV shows:', sortedResults.slice(0, 5).map(tv => ({
                name: tv.name,
                first_air_date: tv.first_air_date,
                popularity: tv.popularity
            })));
        }
        
        return sortedResults.map(tv => this.mapTVData(tv));
    }

    async getOnTheAirTV(page = 1) {
        const data = await this.fetchFromTMDB('/tv/on_the_air', { page });
        
        console.log(`📺 On The Air TV shows: ${data.results.length} (all types included)`);
        return data.results.map(tv => this.mapTVData(tv));
    }

    // Get popular TV shows (backup method)
    // Includes all TV shows (reality, scripted, etc.)
    async getPopularTVShows(page = 1) {
        const data = await this.fetchFromTMDB('/tv/popular', { page });
        
        console.log(`📺 Popular TV shows: ${data.results.length} (all types included)`);
        return data.results.map(tv => this.mapTVData(tv));
    }

    async getUpcomingMovies(page = 1) {
        try {
            const data = await this.fetchFromTMDB('/movie/upcoming', { 
                page,
                region: 'US'  
            });
            
            console.log(`🔮 Upcoming movies from /movie/upcoming: ${data.results.length} results`);
            
            if (data.results.length > 0) {
                console.log('Sample upcoming movies:', data.results.slice(0, 5).map(m => ({
                    title: m.title,
                    release_date: m.release_date
                })));
                
                const sortedResults = data.results.sort((a, b) => {
                    const dateA = new Date(a.release_date || '9999-12-31');
                    const dateB = new Date(b.release_date || '9999-12-31');
                    return dateA - dateB;
                });
                
                return sortedResults.map(movie => this.mapMovieData(movie));
            }
            
            console.warn('⚠️ No upcoming movies found from TMDB endpoint');
            return [];
            
        } catch (error) {
            console.error('❌ Error fetching upcoming movies:', error);
            return [];
        }
    }

    // Discover movies by genre
    async discoverMoviesByGenre(genreId, page = 1) {
        try {
            // Ensure genreId is a number
            const genreIdNum = parseInt(genreId);
            if (isNaN(genreIdNum)) {
                console.error(`❌ Invalid genre ID for movies: ${genreId}`);
                return [];
            }
            
            console.log(`🔍 Discovering movies with genre ID: ${genreIdNum} (page ${page})`);
            const data = await this.fetchFromTMDB('/discover/movie', {
                page: page,
                with_genres: genreIdNum,
                sort_by: 'popularity.desc',
                'vote_count.gte': 50
            });
            
            if (!data || !data.results) {
                console.warn(`⚠️ No results in response for genre ID ${genreIdNum}`);
                return [];
            }
            
            console.log(`✅ Discovered ${data.results.length} movies for genre ID ${genreIdNum}`);
            return data.results.map(movie => this.mapMovieData(movie));
        } catch (error) {
            console.error(`❌ Error discovering movies by genre ${genreId}:`, error);
            return [];
        }
    }

    // Discover TV shows by genre
    async discoverTVByGenre(genreId, page = 1) {
        try {
            // Ensure genreId is a number
            const genreIdNum = parseInt(genreId);
            if (isNaN(genreIdNum)) {
                console.error(`❌ Invalid genre ID for TV: ${genreId}`);
                return [];
            }
            
            console.log(`🔍 Discovering TV shows with genre ID: ${genreIdNum} (page ${page})`);
            const data = await this.fetchFromTMDB('/discover/tv', {
                page: page,
                with_genres: genreIdNum,
                sort_by: 'popularity.desc',
                'vote_count.gte': 50
            });
            
            if (!data || !data.results) {
                console.warn(`⚠️ No results in response for genre ID ${genreIdNum}`);
                return [];
            }
            
            console.log(`✅ Discovered ${data.results.length} TV shows for genre ID ${genreIdNum}`);
            return data.results.map(tv => this.mapTVData(tv));
        } catch (error) {
            console.error(`❌ Error discovering TV shows by genre ${genreId}:`, error);
            return [];
        }
    }

    // Search for movies and TV shows
    async search(query, page = 1) {
        try {
            if (!query || !query.trim()) {
                return [];
            }

            const data = await this.fetchFromTMDB('/search/multi', {
                query: query.trim(),
                page
            });

            console.log(`🔍 Search results for "${query}": ${data.results.length} items`);

            // Map results based on media_type
            return data.results
                .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
                .map(item => {
                    if (item.media_type === 'movie') {
                        return this.mapMovieData(item);
                    } else {
                        return this.mapTVData(item);
                    }
                });
        } catch (error) {
            console.error('❌ Error searching TMDB:', error);
            return [];
        }
    }

    async getMovieDetails(movieId) {
        const data = await this.fetchFromTMDB(`/movie/${movieId}`, {
            append_to_response: 'credits,videos,release_dates'
        });
        return this.mapMovieDetails(data);
    }
    async getTVDetails(tvId) {
        const data = await this.fetchFromTMDB(`/tv/${tvId}`, {
            append_to_response: 'credits,videos,content_ratings'
        });
        return this.mapTVDetails(data);
    }
    mapMovieData(movie) {
        return {
            id: movie.id,
            name: movie.title,
            original_name: movie.original_title,
            category: 'movies',
            image: movie.poster_path ? `${this.IMAGE_BASE_URL}${movie.poster_path}` : 'movie-placeholder.jpg',
            backdrop: movie.backdrop_path ? `${this.IMAGE_BASE_URL}${movie.backdrop_path}` : null,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            rating_value: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
            yearOrSeason: movie.release_date ? `${movie.release_date.split('-')[0]} • ${movie.vote_average ? movie.vote_average.toFixed(1) + '/10' : 'N/A'}` : 'N/A',
            genre_ids: movie.genre_ids || [],
            description: movie.overview,
            rating: movie.vote_average,
            vote_count: movie.vote_count,
            popularity: movie.popularity,
            release_date: movie.release_date,
            original_language: movie.original_language,
            tmdb_id: movie.id,
            media_type: 'movie'
        };
    }
    mapTVData(tv) {
        return {
            id: tv.id,
            name: tv.name,
            original_name: tv.original_name,
            category: 'tv',
            image: tv.poster_path ? `${this.IMAGE_BASE_URL}${tv.poster_path}` : 'tv-placeholder.jpg',
            backdrop: tv.backdrop_path ? `${this.IMAGE_BASE_URL}${tv.backdrop_path}` : null,
            year: tv.first_air_date ? tv.first_air_date.split('-')[0] : 'N/A',
            rating_value: tv.vote_average ? tv.vote_average.toFixed(1) : '0.0',
            yearOrSeason: tv.first_air_date ? `${tv.first_air_date.split('-')[0]} • ${tv.vote_average ? tv.vote_average.toFixed(1) + '/10' : 'N/A'}` : 'N/A',
            genre_ids: tv.genre_ids || [],
            description: tv.overview,
            rating: tv.vote_average,
            vote_count: tv.vote_count,
            popularity: tv.popularity,
            first_air_date: tv.first_air_date,
            original_language: tv.original_language,
            tmdb_id: tv.id,
            media_type: 'tv'
        };
    }

    // Map detailed movie data with rich information
    mapMovieDetails(details) {
        const baseData = this.mapMovieData(details);
        
        // Format runtime
        let durationText = 'Тодорхойгүй';
        if (details.runtime) {
            const hours = Math.floor(details.runtime / 60);
            const minutes = details.runtime % 60;
            durationText = hours > 0 ? `${hours}ц ${minutes}м` : `${minutes}м`;
        }
        let certification = 'Тодорхойгүй';
        if (details.release_dates && details.release_dates.results) {
            const usRelease = details.release_dates.results.find(r => r.iso_3166_1 === 'US');
            if (usRelease && usRelease.release_dates[0]) {
                certification = usRelease.release_dates[0].certification || 'Тодорхойгүй';
            }
        }
        
        return {
            ...baseData,
            duration: durationText,
            runtime: details.runtime,
            certification: certification,
            director: details.credits?.crew?.find(person => person.job === 'Director')?.name || 'Тодорхойгүй',
            cast: details.credits?.cast?.map(actor => ({
                id: actor.id,
                name: actor.name,
                character: actor.character || 'Тодорхойгүй',
                profile_path: actor.profile_path ? `${this.PROFILE_IMAGE_URL}${actor.profile_path}` : null,
                order: actor.order
            })) || [],
            full_cast: details.credits?.cast || [],
            crew: details.credits?.crew || [],
            trailer: details.videos?.results?.find(video => 
                video.type === 'Trailer' && video.site === 'YouTube'
            )?.key || null,
            genres: details.genres?.map(genre => genre.name) || [],
            budget: details.budget ? `$${details.budget.toLocaleString()}` : 'Тодорхойгүй',
            revenue: details.revenue ? `$${details.revenue.toLocaleString()}` : 'Тодорхойгүй',
            status: this.translateStatus(details.status),
            tagline: details.tagline || 'Тодорхойгүй',
            production_companies: details.production_companies?.map(company => company.name) || [],
            spoken_languages: details.spoken_languages?.map(lang => lang.english_name) || [],
            production_countries: details.production_countries?.map(country => country.name) || [],
            homepage: details.homepage,
            imdb_id: details.imdb_id
        };
    }

    mapTVDetails(details) {
        const baseData = this.mapTVData(details);
        let certification = 'Тодорхойгүй';
        if (details.content_ratings && details.content_ratings.results) {
            const usRating = details.content_ratings.results.find(r => r.iso_3166_1 === 'US');
            if (usRating) {
                certification = usRating.rating || 'Тодорхойгүй';
            }
        }
        
        return {
            ...baseData,
            seasons: details.number_of_seasons,
            episodes: details.number_of_episodes,
            certification: certification,
            cast: details.credits?.cast?.map(actor => ({
                id: actor.id,
                name: actor.name,
                character: actor.character || 'Тодорхойгүй',
                profile_path: actor.profile_path ? `${this.PROFILE_IMAGE_URL}${actor.profile_path}` : null,
                order: actor.order
            })) || [],
            full_cast: details.credits?.cast || [],
            trailer: details.videos?.results?.find(video => 
                video.type === 'Trailer' && video.site === 'YouTube'
            )?.key || null,
            genres: details.genres?.map(genre => genre.name) || [],
            created_by: details.created_by?.map(creator => creator.name) || [],
            networks: details.networks?.map(network => network.name) || [],
            last_air_date: details.last_air_date,
            episode_runtime: details.episode_run_time?.[0] || 0,
            status: this.translateStatus(details.status),
            type: details.type,
            in_production: details.in_production,
            last_episode_to_air: details.last_episode_to_air,
            next_episode_to_air: details.next_episode_to_air
        };
    }

    translateStatus(status) {
        const statusMap = {
            'Released': 'Гарсан',
            'Post Production': 'Пост продюсер',
            'In Production': 'Хийгдэж байгаа',
            'Planned': 'Төлөвлөгдсөн',
            'Canceled': 'Цуцлагдсан',
            'Returning Series': 'Үргэлжлэл бий',
            'Ended': 'Дууссан',
            'Rumored': 'Яриатай'
        };
        return statusMap[status] || status;
    }

    // Get YouTube trailer URL
    getTrailerUrl(trailerKey) {
        return trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null;
    }
}

// Create a singleton instance
export const tmdbService = new TMDBService();

// Also expose globally for non-module scripts
if (typeof window !== 'undefined') {
    window.tmdbService = tmdbService;
}