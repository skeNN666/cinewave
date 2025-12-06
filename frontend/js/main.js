const database = [
  // Сүүлд нэмэгдсэн кино
  { name: "The Conjuring: Last Rites", category: "movies", image: "movie1.jpg", yearOrSeason: "2025 • 135 мин" },
  { name: "Tron: Ares", category: "movies", image: "movie2.jpg", yearOrSeason: "2025 • 119 мин" },
  { name: "The Fantastic Four: First Steps", category: "movies", image: "movie3.jpg", yearOrSeason: "2025 • 115 мин" },
  { name: "Mission Impossible: The Final Reckoning", category: "movies", image: "movie4.jpg", yearOrSeason: "2025 • 169 мин" },
  { name: "Superman", category: "movies", image: "movie5.jpg", yearOrSeason: "2025 • 129 мин" },
  { name: "Weapons", category: "movies", image: "movie6.jpg", yearOrSeason: "2025 • 128 мин" },
  { name: "The Woman in Cabin 10", category: "movies", image: "thewomanincabin.jpg", yearOrSeason: "2025 • 95 мин" },

  // Сүүлд нэмэгдсэн TV цуврал
  { name: "Monster", category: "tv", image: "monster.jpg", yearOrSeason: "Улирал: 3 • Анги: 8" },
  { name: "The Chair Company", category: "tv", image: "thechaircompany.jpg", yearOrSeason: "Улирал: 1 • Анги: 1" },
  { name: "Allen Iv3rson", category: "tv", image: "iverson.jpg", yearOrSeason: "Улирал: 1 • Анги: 1" },
  { name: "Nobody Wants This", category: "tv", image: "nobodywantsthis.jpg", yearOrSeason: "Улирал: 2 • Анги: 1" },
  { name: "The Diplomat", category: "tv", image: "thediplomat.jpg", yearOrSeason: "Улирал: 3 • Анги: 8" },
  { name: "Wednesday", category: "tv", image: "wednesday.jpg", yearOrSeason: "Улирал: 2 • Анги: 8" },

  // Тун удахгүй гарах кино, TV цуврал
  { name: "Springsteen: Deliver Me from Nowhere", category: "movies", image: "springsteen.jpg", yearOrSeason: "2025 • 120 мин" },
  { name: "Regretting You", category: "movies", image: "regrettingyou.jpg", yearOrSeason: "2025 • 116 мин" },
  { name: "Physical: 100", category: "tv", image: "physical100.jpg", yearOrSeason: "Улирал: 3 • Анги: 1" },
  { name: "It: Welcome to Derry", category: "tv", image: "welcometoderry.jpg", yearOrSeason: "Улирал: 1 • Анги: 1" },
  { name: "Blue Moon", category: "movies", image: "bluemoon.jpg", yearOrSeason: "2025 • 100 мин" },
  { name: "Talamasca: The Secret Order", category: "tv", image: "talamasca.jpg", yearOrSeason: "Улирал: 1 • Анги: 1" },
  { 
    name: "Oppenheimer", 
    category: "movies", 
    image: "oppenheimer.jpg", 
    yearOrSeason: "2023 • 180 мин",
    genre: ["drama", "biography", "history"]
  },
  { 
    name: "Barbie", 
    category: "movies", 
    image: "barbie.jpg", 
    yearOrSeason: "2023 • 114 мин",
    genre: ["comedy", "adventure", "fantasy"]
  },
  { 
    name: "John Wick: Chapter 4", 
    category: "movies", 
    image: "johnwick4.jpg", 
    yearOrSeason: "2023 • 169 мин",
    genre: ["action", "thriller", "crime"]
  },
  { 
    name: "Avatar: The Way of Water", 
    category: "movies", 
    image: "avatar2.jpg", 
    yearOrSeason: "2022 • 192 мин",
    genre: ["sci-fi", "adventure", "fantasy"]
  },
  { 
    name: "Stranger Things", 
    category: "tv", 
    image: "strangerthings.jpg", 
    yearOrSeason: "Улирал: 4 • Анги: 9",
    genre: ["drama", "fantasy", "horror"]
  },
  { 
    name: "The Last of Us", 
    category: "tv", 
    image: "thelastofus.jpg", 
    yearOrSeason: "Улирал: 1 • Анги: 9",
    genre: ["drama", "adventure", "horror"]
  },
  { 
    name: "The Batman", 
    category: "movies", 
    image: "thebatman.jpg", 
    yearOrSeason: "2022 • 176 мин",
    genre: ["action", "crime", "drama"]
  },
  { 
    name: "Everything Everywhere All at Once", 
    category: "movies", 
    image: "eeaao.jpg", 
    yearOrSeason: "2022 • 139 мин",
    genre: ["action", "adventure", "comedy"]
  },
  { 
    name: "Top Gun: Maverick", 
    category: "movies", 
    image: "topgun.jpg", 
    yearOrSeason: "2022 • 130 мин",
    genre: ["action", "drama"]
  },
  { 
    name: "House of the Dragon", 
    category: "tv", 
    image: "hotd.jpg", 
    yearOrSeason: "Улирал: 2 • Анги: 8",
    genre: ["action", "adventure", "drama"]
  },
  { 
    name: "The Bear", 
    category: "tv", 
    image: "thebear.jpg", 
    yearOrSeason: "Улирал: 3 • Анги: 10",
    genre: ["comedy", "drama"]
  },
  { 
    name: "Succession", 
    category: "tv", 
    image: "succession.jpg", 
    yearOrSeason: "Улирал: 4 • Анги: 10",
    genre: ["drama"]
  }
];

let selectedCategory = "all";
let filteredData = [...database];
let currentIndex = 0;
let isAnimating = false;

const ITEMS_PER_PAGE = 6;
let sectionState = {
    "latest-movies": 1,
    "latest-tv": 1,
    "upcoming-movies": 1
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeCarousel();
    initializeFilters();
    applyFilters();
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
        movieCard.setAttribute('year-or-season', movie.yearOrSeason);
        movieCard.setAttribute('category', movie.category);
        
        container.appendChild(movieCard);
    });

    const button = container.closest(".movies").querySelector(".section-header button");
    button.style.display = "inline-block";
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

    // Take only first 6 items
    const carouselItems = filteredData.slice(0, 6);

    // Create cards and dots dynamically
    carouselItems.forEach((movie, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = i;
        card.innerHTML = `<img src="images/${movie.image}" alt="${movie.name}">`;
        track.appendChild(card);

        const dot = document.createElement("div");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    });

    let currentIndex = 0;
    let isAnimating = false;

    function updateCarousel(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex = (newIndex + carouselItems.length) % carouselItems.length;

        const cards = document.querySelectorAll(".card");
        const dots = document.querySelectorAll(".dot");

        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;

            card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

            if (offset === 0) card.classList.add("center");
            else if (offset === 1) card.classList.add("right-1");
            else if (offset === 2) card.classList.add("right-2");
            else if (offset === cards.length - 1) card.classList.add("left-1");
            else if (offset === cards.length - 2) card.classList.add("left-2");
            else card.classList.add("hidden");
        });

        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));

        if (movieName) {
            movieName.style.opacity = "0";
            setTimeout(() => {
                movieName.textContent = carouselItems[currentIndex]?.name || "No Results Found";
                movieName.style.opacity = "1";
            }, 300);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    if (leftArrow) leftArrow.addEventListener("click", () => updateCarousel(currentIndex - 1));
    if (rightArrow) rightArrow.addEventListener("click", () => updateCarousel(currentIndex + 1));

    const dots = document.querySelectorAll(".dot");
    dots.forEach(dot => {
        dot.addEventListener("click", () => updateCarousel(Number(dot.dataset.index)));
    });

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => updateCarousel(Number(card.dataset.index)));
    });
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
        else if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
    });
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
    document.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });
    updateCarousel(0);
}


function initializeFilters() {
    console.log("Initializing filters...");
    
    const categorySelect = document.getElementById("category-select");
    const searchInput = document.getElementById("search-input");

    console.log("Found filter elements:", {
        categorySelect: !!categorySelect,
        searchInput: !!searchInput
    });

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
    
    filteredData = database.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesQuery = item.name.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    console.log("Filtered data:", filteredData.length, "items");
    console.log("Selected category:", selectedCategory);
    console.log("Search query:", query);

    currentIndex = 0;
    
    if (typeof updateCarousel === 'function' && filteredData.length > 0) {
        updateCarousel(0);
    } else if (filteredData.length === 0) {
        const movieName = document.querySelector(".movie-name");
        if (movieName) {
            movieName.textContent = "No Results Found";
        }
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
                <span class="genre-year">${movie.yearOrSeason}</span>
                <span class="type">${movie.category === 'movies' ? 'Кино' : 'Цуврал'}</span>
            </div>
        </article>
    `).join('');
}

