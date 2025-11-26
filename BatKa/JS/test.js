const categoryBtn = document.getElementById('categoryBtn');
const dropdownMenu = document.getElementById('dropdownMenu')
const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item')

const container = document.querySelector('.container');
const LoginLink = document.querySelector('.SignInlink');
const RegisterLink = document.querySelector('SignUplink');

const hamburger = document.querySelector('.hamburger');
const burgerMenu = document.querySelector('.burger-menu');


categoryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        categoryBtn.textContent = item.textContent + ' ';
        dropdownMenu.classList.remove('show');
    });
});

document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== categoryBtn) {
        dropdownMenu.classList.remove('show');
    }
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  burgerMenu.classList.toggle('show');
});