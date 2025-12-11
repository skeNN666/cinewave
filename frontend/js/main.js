// frontend/js/main.js
import { movieDatabase, loadMovieDatabase } from './database.js';

// Data containers (start empty; will be filled after loading)
let database = [];
let selectedCategory = "all";
let filteredData = [];
let currentIndex = 0;
let isAnimating = false;

const ITEMS_PER_PAGE = 6;
let sectionState = {
    "latest-movies": 1,
    "latest-tv": 1,
    "upcoming-movies": 1
};

document.addEventListener('DOMContentLoaded', async function() {
    // Load DB first (database.js handles fallback)
    try {
        console.log('Loading movies database...');
        await loadMovieDatabase();                 // loads and mutates movieDatabase
        database = Array.isArray(movieDatabase) ? [...movieDatabase] : [];
        console.log(`Loaded database: ${database.length} items`);
    } catch (err) {
        console.error('Error during loadMovieDatabase():', err);
        // If anything goes wrong, leave database empty or use a minimal fallback:
        database = [];
    }

    // Initialize the rest of the app
    initializeApp();
});

function initializeApp() {
    initializeCarousel();
    initializeFilters();
    applyFilters();   // this will set filteredData and update carousel
    setupSections();
}

function setupSections() {
    const latestMovies = database.filter(m => m.category === "movies" && !["Springsteen: Deliver Me from Nowhere", "Regretting You", "Blue Moon"].includes(m.name));
    const latestTV = database.filter(m => m.category === "tv" && !["Physical: 100", "It: Welcome to Derry", "Talamasca: The Secret Order"].includes(m.name));
    const upcoming = database.filter(m => ["Springsteen: Deliver Me from Nowhere","Regretting You","Blue Moon","Physical: 100","It: Welcome to Derry","Talamasca: The Secret Order"].includes(m.name));

    renderPaginatedSection("latest-movies", latestMovies, 1);
    renderPaginatedSection("latest-tv", latestTV, 1);
    renderPaginatedSection("upcoming-movies", upcoming, 1);

    document.querySelectorAll(".movies .section-header button").forEach(btn => {
        btn.addEventListener("click", () => {
            const sectionId = btn.closest(".movies").querySelector(".movies-section").id;
            sectionState[sectionId]++;
            const movies = getMoviesBySection(sectionId);
            renderPaginatedSection(sectionId, movies, sectionState[sectionId]);
        });
    });
}

function getMoviesBySection(sectionId) {
    switch(sectionId) {
        case "latest-movies":
            return database.filter(m => m.category === "movies" && !["Springsteen: Deliver Me from Nowhere", "Regretting You", "Blue Moon"].includes(m.name));
        case "latest-tv":
            return database.filter(m => m.category === "tv" && !["Physical: 100", "It: Welcome to Derry", "Talamasca: The Secret Order"].includes(m.name));
        case "upcoming-movies":
            return database.filter(m => ["Springsteen: Deliver Me from Nowhere","Regretting You","Blue Moon","Physical: 100","It: Welcome to Derry","Talamasca: The Secret Order"].includes(m.name));
        default:
            return [];
    }
}

function renderPaginatedSection(containerId, movies, page) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const visibleMovies = movies.slice(startIndex, endIndex);

    container.innerHTML = '';

    visibleMovies.forEach(movie => {
        const movieCard = document.createElement('movie-card');
        movieCard.setAttribute('name', movie.name);
        movieCard.setAttribute('image', movie.image);
        movieCard.setAttribute('year-or-season', movie.yearOrSeason || movie.yearOrSeason || '');
        movieCard.setAttribute('category', movie.category || '');
        
        if (movie.rating) movieCard.setAttribute('rating', movie.rating);
        if (movie.duration) movieCard.setAttribute('duration', movie.duration);
        if (movie.description) movieCard.setAttribute('description', movie.description);
        if (movie.director) movieCard.setAttribute('director', movie.director);
        if (movie.cast) movieCard.setAttribute('cast', JSON.stringify(movie.cast));

        container.appendChild(movieCard);
    });

    const button = container.closest(".movies")?.querySelector(".section-header button");
    if (button) button.style.display = "inline-block";
}

function initializeCarousel() {
    console.log("Initializing carousel...");

    const track = document.querySelector(".carousel-track");
    const dotsContainer = document.querySelector(".dots");
    const movieName = document.querySelector(".movie-name");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");

    if (!track || !dotsContainer) {
        console.error("Carousel track or dots container not found!");
        return;
    }

    // Clear existing cards and dots
    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    // If there is already filteredData from applyFilters use it; otherwise use database
    const sourceForCarousel = (filteredData && filteredData.length > 0) ? filteredData : database;
    const carouselItems = sourceForCarousel.slice(0, 6);

    carouselItems.forEach((movie, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = i;
        card.innerHTML = `<img src="./frontend/images/${movie.image}" alt="${movie.name}">`;
        track.appendChild(card);

        const dot = document.createElement("div");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    });

    let carouselIndex = 0;
    let carouselAnimating = false;

    function updateCarousel(newIndex) {
        if (carouselAnimating) return;
        carouselAnimating = true;

        carouselIndex = (newIndex + carouselItems.length) % carouselItems.length;

        const cards = document.querySelectorAll(".card");
        const dots = document.querySelectorAll(".dot");

        cards.forEach((card, i) => {
            const offset = (i - carouselIndex + cards.length) % cards.length;
            card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

            if (offset === 0) card.classList.add("center");
            else if (offset === 1) card.classList.add("right-1");
            else if (offset === 2) card.classList.add("right-2");
            else if (offset === cards.length - 1) card.classList.add("left-1");
            else if (offset === cards.length - 2) card.classList.add("left-2");
            else card.classList.add("hidden");
        });

        dots.forEach((dot, i) => dot.classList.toggle("active", i === carouselIndex));

        if (movieName) {
            movieName.style.opacity = "0";
            setTimeout(() => {
                movieName.textContent = carouselItems[carouselIndex]?.name || "No Results Found";
                movieName.style.opacity = "1";
            }, 300);
        }

        setTimeout(() => {
            carouselAnimating = false;
        }, 800);
    }

    if (leftArrow) leftArrow.addEventListener("click", () => updateCarousel(carouselIndex - 1));
    if (rightArrow) rightArrow.addEventListener("click", () => updateCarousel(carouselIndex + 1));

    document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click", () => updateCarousel(Number(dot.dataset.index)));
    });

    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => updateCarousel(Number(card.dataset.index)));
    });

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") updateCarousel(carouselIndex - 1);
        else if (e.key === "ArrowRight") updateCarousel(carouselIndex + 1);
    });

    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
    document.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) updateCarousel(diff > 0 ? carouselIndex + 1 : carouselIndex - 1);
    });

    // expose updateCarousel to other functions (applyFilters uses it)
    window.updateCarousel = updateCarousel;

    updateCarousel(0);
}

function initializeFilters() {
    console.log("Initializing filters...");
    
    const categorySelect = document.getElementById("category-select");
    const searchInput = document.getElementById("search-input");

    if (categorySelect) {
        categorySelect.addEventListener("change", function() {
            selectedCategory = this.value;
            applyFilters();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }
}

function applyFilters() {
    console.log("Applying filters...");

    const searchInput = document.getElementById("search-input");
    const query = searchInput?.value.toLowerCase() || "";
    
    filteredData = (database || []).filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesQuery = item.name && item.name.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    console.log("Filtered data count:", filteredData.length);
    currentIndex = 0;
    
    if (typeof window.updateCarousel === 'function' && filteredData.length > 0) {
        // rebuild carousel using filteredData: re-run initializeCarousel to re-render items
        initializeCarousel();
    } else if (filteredData.length === 0) {
        const movieName = document.querySelector(".movie-name");
        if (movieName) movieName.textContent = "No Results Found";
    }
}

function renderMovieSection(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = movies.map(movie => `
        <article class="movie-card">
            <img src="images/${movie.image}" alt="${movie.name}">
            <h3>${movie.name}</h3>
            <div class="neg-yum">
                <span class="genre-year">${movie.yearOrSeason || ''}</span>
                <span class="type">${movie.category === 'movies' ? 'Кино' : 'Цуврал'}</span>
            </div>
        </article>
    `).join('');
}
