const database = [
  { name: "The Conjuring: Last Rites", category: "movies" },
  { name: "Tron: Ares", category: "movies" },
  { name: "The Fantastic Four: First Steps", category: "movies" },
  { name: "Mission Impossible: The Last Reckoning", category: "movies" },
  { name: "Superman", category: "movies" },
  { name: "Weapons", category: "movies" },
  { name: "Monster", category: "tv" },
  { name: "The Chair Company", category: "tv" },
  { name: "Nobody Wants This", category: "tv" },
  { name: "The Diplomat", category: "tv" },
  { name: "Wednesday", category: "tv" },
  { name: "Springsteen: Deliver Me from Nowhere", category: "movies" },
  { name: "Regretting You", category: "movies" },
  { name: "Physical: 100", category: "tv" },
  { name: "It: Welcome to Derry", category: "tv" },
  { name: "Blue Moon", category: "movies" },
  { name: "Talamasca: The Secret Order", category: "tv" },	
];

// Global variables
let selectedCategory = "all";
let filteredData = [...database];
let currentIndex = 0;
let isAnimating = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log("Initializing app...");
    
    // Initialize carousel
    initializeCarousel();
    
    // Initialize filters (select + search)
    initializeFilters();
    
    // Apply initial filters
    applyFilters();
}

function initializeCarousel() {
    console.log("Initializing carousel...");
    
    const cards = document.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");
    const movieName = document.querySelector(".movie-name");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");

    console.log("Found elements:", {
        cards: cards.length,
        dots: dots.length,
        movieName: !!movieName,
        leftArrow: !!leftArrow,
        rightArrow: !!rightArrow
    });

    if (cards.length === 0) {
        console.error("No cards found!");
        return;
    }

    // Carousel functions
    window.updateCarousel = function(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex = (newIndex + cards.length) % cards.length;

        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;

            card.classList.remove(
                "center",
                "left-1",
                "left-2",
                "right-1",
                "right-2",
                "hidden"
            );

            if (offset === 0) {
                card.classList.add("center");
            } else if (offset === 1) {
                card.classList.add("right-1");
            } else if (offset === 2) {
                card.classList.add("right-2");
            } else if (offset === cards.length - 1) {
                card.classList.add("left-1");
            } else if (offset === cards.length - 2) {
                card.classList.add("left-2");
            } else {
                card.classList.add("hidden");
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

        if (movieName) {
            movieName.style.opacity = "0";
            setTimeout(() => {
                movieName.textContent = filteredData[currentIndex]?.name || "No Results Found";
                movieName.style.opacity = "1";
            }, 300);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    };

    // Event listeners for carousel
    if (leftArrow) {
        leftArrow.addEventListener("click", () => {
            updateCarousel(currentIndex - 1);
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener("click", () => {
            updateCarousel(currentIndex + 1);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            updateCarousel(i);
        });
    });

    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            updateCarousel(i);
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            updateCarousel(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
            updateCarousel(currentIndex + 1);
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateCarousel(currentIndex + 1);
            } else {
                updateCarousel(currentIndex - 1);
            }
        }
    }

    // Initial carousel update
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

    // Event listeners for filters
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

    // Reset to first item when filtering
    currentIndex = 0;
    
    // Update carousel with filtered data
    if (typeof updateCarousel === 'function' && filteredData.length > 0) {
        updateCarousel(0);
    } else if (filteredData.length === 0) {
        const movieName = document.querySelector(".movie-name");
        if (movieName) {
            movieName.textContent = "No Results Found";
        }
    }
}