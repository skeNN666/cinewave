document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("dropdown");
  const button = document.getElementById("selected");
  const menu = document.getElementById("menu");

  // Dropdown нээх/хаах
  button.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  // Гадна дарвал хаах
  window.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  // Сонгосон зүйлээ товч дээр харуулах
  menu.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      button.textContent = item.textContent;
      menu.style.display = "none";
    });
  });
});
