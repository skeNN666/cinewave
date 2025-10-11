const slider = document.querySelector('.movie-slider');
const track = slider.querySelector('.slider-track');
const movies = Array.from(slider.querySelectorAll('.movie'));
const leftBtn = slider.querySelector('.arrow-btn.left');
const rightBtn = slider.querySelector('.arrow-btn.right');
const movieName = slider.querySelector('.movie-name');

let currentIndex = 3; // middle movie for 7 items

function updateSlider() {
  const movieWidth = 150 + 40; // width + 2*margin
  const viewportWidth = slider.querySelector('.slider-viewport').offsetWidth;
  const offset = currentIndex * movieWidth - viewportWidth / 2 + movieWidth / 2;

  track.style.transform = `translateX(${-offset}px)`;

  movies.forEach((movie, index) => {
    movie.classList.remove('small', 'medium', 'large');

    if (index === currentIndex) movie.classList.add('large');
    else if (index === currentIndex - 1 || index === currentIndex + 1) movie.classList.add('medium');
    else movie.classList.add('small');
  });

  // Movie name stays fixed and always shows current movie
  movieName.textContent = movies[currentIndex].querySelector('img').alt;
}

leftBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

rightBtn.addEventListener('click', () => {
  if (currentIndex < movies.length - 1) {
    currentIndex++;
    updateSlider();
  }
});

updateSlider();
