document.addEventListener("DOMContentLoaded", () => {
  const movie = JSON.parse(localStorage.getItem("selectedMovie"));

  if (!movie) {
    document.body.innerHTML = `
      <div style="text-align:center; margin-top:100px;">
        <h2>Кино олдсонгүй 😢</h2>
        <a href="../index.html" style="color:#ffcc00;">Буцах</a>
      </div>`;
    return;
  }

  document.getElementById("movie-poster").src = `../images/${movie.image}`;
  document.getElementById("movie-title").textContent = movie.name;
  document.getElementById("movie-year").textContent = movie.yearOrSeason;
  document.getElementById("movie-category").textContent =
    movie.category === "movies" ? "Кино" : "Цуврал";
  document.getElementById("movie-description").textContent =
    movie.description || "Энэ киноны талаарх дэлгэрэнгүй мэдээлэл одоогоор байхгүй байна.";
});
