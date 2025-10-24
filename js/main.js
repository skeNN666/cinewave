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


const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const movieName = document.querySelector(".movie-name");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");
let currentIndex = 0;
let isAnimating = false;

function updateCarousel(newIndex) {
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

	movieName.style.opacity = "0";

	setTimeout(() => {
		movieName.textContent = database[currentIndex].name;
		movieName.style.opacity = "1";
	}, 300);

	setTimeout(() => {
		isAnimating = false;
	}, 800);
}

leftArrow.addEventListener("click", () => {
	updateCarousel(currentIndex - 1);
});

rightArrow.addEventListener("click", () => {
	updateCarousel(currentIndex + 1);
});

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

updateCarousel(0);

(function() {
  const dropdown = document.getElementById('dropdown');
  const button = document.getElementById('selected');
  const menu = document.getElementById('menu');

  button.addEventListener('click', (e) => {
    e.stopPropagation(); 
    menu.classList.toggle('show');
  });

  menu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const value = item.textContent;
      button.textContent = value + " ▼"; 
      menu.classList.remove('show');

      const category = item.getAttribute('data-category');
      console.log("Selected category:", category);

      const cards = document.querySelectorAll('.movie-card');
      cards.forEach(card => {
        const type = card.querySelector('.type').textContent.toLowerCase();
        if (category === 'all' || type === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
  });
})();
