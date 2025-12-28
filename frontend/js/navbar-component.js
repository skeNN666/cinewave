// navbar-component.js - Updated for SPA
class CineWaveNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #1e1e1e;
        color: white;
        padding: 10px 25px;
        font-family: "Nunito", sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }

      .logo {
        font-size: 30px;
        font-weight: 800;
        letter-spacing: 1px;
        text-decoration: none;
        margin-right: 30px;
        cursor: pointer;
      }

      .logo .cine { color: #007bff; }
      .logo .wave { color: #00ffff; }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 20px;
        flex: 1;
        margin-right: 20px;
        transition: max-height 0.3s ease;
      }

      .nav-links a {
        color: white;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;
        cursor: pointer;
      }

      .nav-links a:hover { color: #00ffff; }
      .nav-links a.active { color: #00ffff; border-bottom: 2px solid #00ffff; }

      .search-group {
        display: flex;
        align-items: center;
        flex: 1;
        position: relative;
        max-width: 1000px;
        background-color: #333;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #555;
      }

      .search-box {
        position: relative;
        z-index: 1000;
        flex: 1;
      }

      .search-box input {
        width: 100%;
        border: none;
        outline: none;
        background: none;
        color: white;
        padding: 10px 12px;
        font-family: "Nunito", sans-serif;
        font-size: 15px;
      }

      .search-box input:focus { background-color: #444; }

      .hamburger {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: none;
        align-items: center;
        justify-content: center;
      }

      .hamburger svg { transition: transform 0.2s ease; }
      .hamburger:hover svg { transform: scale(1.1); }

      .sign-in {
        background-color: #00ffff;
        border: none;
        color: black;
        padding: 8px 14px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 700;
        font-family: "Nunito", sans-serif;
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      .sign-in:hover {
        background-color: #007bff;
        color: white;
      }

      @media (max-width: 900px) {
        .hamburger { display: flex; }
        
        .nav-links {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background-color: #1e1e1e;
          flex-direction: column;
          max-height: 0;
          overflow: hidden;
          padding: 0;
        }

        .nav-links.show {
          max-height: 500px;
          padding: 10px 0;
        }

        .search-group { margin: 10px 0; width: 90%; }
      }

      :host { display: block; }
    `;

    const html = document.createElement('div');
    html.innerHTML = `
      <nav class="navbar">
        <div class="logo">
          <span class="cine">CINE</span><span class="wave">WAVE</span>
        </div>

        <div class="nav-links">
          <a href="/" data-link data-route="home">Нүүр</a>
          <a href="/movies" data-link data-route="movies">Кино</a>
          <a href="/customlist" data-link data-route="customlist">Жагсаалт</a>
          <a href="/reviews" data-link data-route="reviews">Шүүмж</a>

          <div class="search-group">
            <div class="search-box">
              <input type="text" placeholder="Хайх..." id="search-input">
            </div>
          </div>
        </div>

        <button class="hamburger" aria-label="Menu">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7L20 7" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M4 12H20" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M4 17H20" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>

        <button class="sign-in">Нэвтрэх</button>
      </nav>
    `;

    this.shadowRoot.append(style, html);

    // Elements
    this.hamburger = this.shadowRoot.querySelector('.hamburger');
    this.navLinks = this.shadowRoot.querySelector('.nav-links');
    this.signInBtn = this.shadowRoot.querySelector('.sign-in');
    this.searchInput = this.shadowRoot.querySelector('#search-input');
    this.categorySelect = this.shadowRoot.querySelector('#category-select');
    this.logo = this.shadowRoot.querySelector('.logo');
    this.links = this.shadowRoot.querySelectorAll('a[data-link]');
  }

  connectedCallback() {
    // Toggle mobile menu
    this.hamburger.addEventListener('click', () => {
      this.navLinks.classList.toggle('show');
    });

    // Handle logo click
    this.logo.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigate('/');
    });

    // Handle navigation clicks
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigate(path);
        this.navLinks.classList.remove('show'); // Close mobile menu
      });
    });

    // Sign in button
    this.signInBtn.addEventListener('click', () => {
      this.navigate('/login');
    });

    // Search functionality
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = this.searchInput.value.trim();
        const category = this.categorySelect.value;
        
        if (query) {
          this.dispatchEvent(new CustomEvent('search', {
            detail: { query, category },
            bubbles: true,
            composed: true
          }));
        }
      }
    });

    // Update active link on route change
    this.updateActiveLink();
    window.addEventListener('hashchange', () => this.updateActiveLink());
  }

  navigate(path) {
    window.location.hash = path;
  }

  updateActiveLink() {
    const currentPath = window.location.hash.slice(1) || '/';
    this.links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

customElements.define('cinewave-navbar', CineWaveNavbar);