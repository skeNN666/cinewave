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
        position: fixed;       /* Fixed at top */
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
      }

      .nav-links a:hover { color: #00ffff; }

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

      .all-dropdown { position: relative; display: inline-block; }

      .category-select {
        background: #333;
        color: white;
        border: none;
        padding: 8px 32px 8px 12px;
        cursor: pointer;
        border-radius: 5px;
        min-width: 120px;
        height: 2.75rem;
        font-size: var(--font-size-base);
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 14px;
      }

      .category-select:focus {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 .15rem rgba(201, 13, 48, .18);
        outline: none;
      }

      .category-select::-ms-expand { display: none; }

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
        display: flex;
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
        .nav-links {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background-color: #1e1e1e;
          flex-direction: column;
          max-height: 0;
          overflow: hidden;
        }

        .nav-links.show {
          max-height: 500px;
        }

        .search-group { margin: 10px 0; width: 90%; }
      }

      /* Add spacing to avoid content hidden under fixed navbar */
      :host { display: block; padding-top: 70px; }
    `;

    const html = document.createElement('div');
    html.innerHTML = `
      <nav class="navbar">
        <a href="../../index.html" class="logo">
          <span class="cine">CINE</span><span class="wave">WAVE</span>
        </a>

        <div class="nav-links">
          <a href="./frontend/html/movies.html">Кино</a>
          <a href="./frontend/html/customlist.html">Жагсаалт</a>
          <a href="./frontend/html/help.html">Тусламж</a>

          <div class="search-group">
            <div class="all-dropdown">
              <select id="category-select" class="category-select">
                <option value="all">Бүгд</option>
                <option value="movies">Кино</option>
                <option value="tv">TV цуврал</option>
                <option value="celebs">Алдартнууд</option>
              </select>
            </div>
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
  }

  connectedCallback() {
    this.hamburger.addEventListener('click', () => {
      this.navLinks.classList.toggle('show');
    });

    this.signInBtn.addEventListener('click', () => {
      window.location.href = './frontend/html/login.html';
    });

    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = this.searchInput.value.trim();
        const category = this.categorySelect.value;
        this.dispatchEvent(new CustomEvent('search', {
          detail: { query, category },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
}

customElements.define('cinewave-navbar', CineWaveNavbar);
