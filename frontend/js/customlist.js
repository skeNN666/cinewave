const titles = ["Tron: Ares","Superman","Weapons","Conjuring 4","Fantastic 4"];
const years = ["2023","2022","2025","2024","2021"];
const durations = ["2h 10m","1h 55m","2h 13m","2h 5m","1h 48m"];
const descriptions = [
  "Movie 1-ийн товч тайлбар",
  "Movie 2-ийн тайлбар",
  "Movie 3-ийн тайлбар",
  "Movie 4-ийн тайлбар",
  "Movie 5-ийн тайлбар"
];

const slides = Array.from(document.querySelectorAll(".slide"));
const N = slides.length;
let center = 0;

// Info panel elements
const titleEl = document.querySelector(".title");
const yearEl = document.querySelector(".year-duration");
const descEl = document.querySelector(".description");
const container = document.getElementById("carousel-container");

// Update info
function updateInfo(idx){
  titleEl.textContent = titles[idx];
  yearEl.textContent = `${years[idx]} • ${durations[idx]}`;
  descEl.textContent = descriptions[idx];
}

// Update carousel + info + background
function setClasses(){
  const c = center;
  const mod = i => (i+N)%N;
  slides.forEach(s=>s.className='slide');
  slides[c].classList.add('center');
  slides[mod(c-1)].classList.add('left');
  slides[mod(c+1)].classList.add('right');
  slides[mod(c-2)].classList.add('left-2');
  slides[mod(c+2)].classList.add('right-2');

  updateInfo(c);

  // Background update
  const bgUrl = slides[c].dataset.bg;
  if(bgUrl){
    container.style.backgroundImage = `url('${bgUrl}')`;
  }
}

// Үндсэн хөдөлгөдөг товчлуурууд
document.querySelector(".leftBtn").addEventListener("click", ()=>{ center = (center-1+N)%N; setClasses(); });
document.querySelector(".rightBtn").addEventListener("click", ()=>{ center = (center+1)%N; setClasses(); });

// Keyboard сум ашиглан хөдөлгөх
window.addEventListener("keydown", e=>{
  if(e.key==='ArrowLeft'){ center = (center-1+N)%N; setClasses(); }
  if(e.key==='ArrowRight'){ center = (center+1)%N; setClasses(); }
});

setClasses();

/* ---- Editable Watchlist Name ---- */
const nameSpan = document.getElementById("watchlist-name");
nameSpan.addEventListener("click", () => {
  const currentText = nameSpan.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.style.fontSize = "1.2rem";
  input.style.background = "transparent";
  input.style.color = "white";
  input.style.border = "none";
  input.style.borderBottom = "1px solid white";
  input.style.outline = "none";
  input.style.width = "250px";

  nameSpan.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => {
    const newText = input.value.trim() || currentText;
    nameSpan.textContent = newText;
    input.replaceWith(nameSpan);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
});