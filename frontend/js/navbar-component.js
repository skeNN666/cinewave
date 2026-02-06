class CineWaveNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
      }

      /* Desktop Navbar */
      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #1e1e1e;
        color: white;
        padding: 12px 30px;
        font-family: "Nunito", sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        gap: 20px;
      }

      .logo {
        font-size: 30px;
        font-weight: 800;
        letter-spacing: 1px;
        text-decoration: none;
        cursor: pointer;
        flex-shrink: 0;
        user-select: none;
      }

      .logo .cine { color: #007bff; }
      .logo .wave { color: #00ffff; }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 25px;
        flex-shrink: 0;
      }

      .nav-links a {
        color: white;
        text-decoration: none;
        font-weight: 600;
        font-size: 15px;
        transition: color 0.2s ease;
        cursor: pointer;
        position: relative;
        white-space: nowrap;
      }

      .nav-links a:hover { color: #00ffff; }
      
      .nav-links a.active { 
        color: #00ffff; 
      }

      .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 2px;
        background: #00ffff;
      }

      .search-group {
        display: flex;
        align-items: center;
        flex: 1;
        position: relative;
        max-width: 600px;
        background-color: #333;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #555;
        transition: border-color 0.2s ease;
      }

      .search-group:focus-within {
        border-color: #00ffff;
      }

      .search-box {
        position: relative;
        flex: 1;
      }

      .search-box input {
        width: 100%;
        border: none;
        outline: none;
        background: none;
        color: white;
        padding: 11px 14px;
        font-family: "Nunito", sans-serif;
        font-size: 15px;
      }

      .search-box input::placeholder {
        color: #999;
      }

      .search-box input:focus { 
        background-color: #444; 
      }

      .hamburger {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: none;
        align-items: center;
        justify-content: center;
      }

      .hamburger svg { 
        transition: transform 0.2s ease; 
      }
      
      .hamburger:hover svg { 
        transform: scale(1.1); 
      }

      .sign-in {
        background-color: #00ffff;
        border: none;
        color: black;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
        font-family: "Nunito", sans-serif;
        font-size: 14px;
        transition: all 0.2s ease;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .sign-in:hover {
        background-color: #007bff;
        color: white;
        transform: translateY(-1px);
      }

      .sign-in:active {
        transform: translateY(0);
      }

      /* Mobile Bottom Navigation */
      .mobile-bottom-nav {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #1e1e1e;
        border-top: 1px solid #333;
        padding: 8px 0;
        z-index: 1000;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
      }

      .mobile-nav-items {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 600px;
        margin: 0 auto;
      }

      .mobile-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #999;
        text-decoration: none;
        font-size: 11px;
        font-weight: 600;
        padding: 6px 12px;
        cursor: pointer;
        transition: color 0.2s ease;
        flex: 1;
        max-width: 80px;
      }

      .mobile-nav-item:hover,
      .mobile-nav-item.active {
        color: #00ffff;
      }

      .mobile-nav-item svg {
        width: 24px;
        height: 24px;
      }

      .mobile-search-wrapper {
        display: none;
        padding: 10px 15px;
        background-color: #1e1e1e;
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        z-index: 999;
        border-bottom: 1px solid #333;
      }

      .mobile-search-wrapper.show {
        display: block;
      }

      .mobile-search-group {
        display: flex;
        align-items: center;
        background-color: #333;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #555;
      }

      .mobile-search-group input {
        width: 100%;
        border: none;
        outline: none;
        background: none;
        color: white;
        padding: 12px 14px;
        font-family: "Nunito", sans-serif;
        font-size: 15px;
      }

      /* Large Desktop - 1920px and above */
      @media (min-width: 1920px) {
        .navbar {
          padding: 15px 60px;
        }

        .logo {
          font-size: 36px;
        }

        .nav-links {
          gap: 35px;
        }

        .nav-links a {
          font-size: 17px;
        }

        .search-group {
          max-width: 800px;
        }

        .search-box input {
          padding: 13px 16px;
          font-size: 16px;
        }

        .sign-in {
          padding: 12px 24px;
          font-size: 16px;
        }
      }

      /* Desktop - 1440px to 1919px */
      @media (min-width: 1440px) and (max-width: 1919px) {
        .navbar {
          padding: 12px 40px;
        }

        .search-group {
          max-width: 700px;
        }
      }

      /* Laptop - 1024px to 1439px */
      @media (min-width: 1024px) and (max-width: 1439px) {
        .navbar {
          padding: 12px 30px;
        }

        .logo {
          font-size: 28px;
        }

        .nav-links {
          gap: 20px;
        }

        .search-group {
          max-width: 500px;
        }
      }

      /* Tablet - 768px to 1023px */
      @media (min-width: 768px) and (max-width: 1023px) {
        .navbar {
          padding: 10px 25px;
        }

        .logo {
          font-size: 26px;
        }

        .nav-links {
          gap: 15px;
        }

        .nav-links a {
          font-size: 14px;
        }

        .search-group {
          max-width: 400px;
        }

        .search-box input {
          padding: 10px 12px;
          font-size: 14px;
        }

        .sign-in {
          padding: 9px 16px;
          font-size: 13px;
        }
      }

      /* Mobile - 900px and below */
      @media (max-width: 900px) {
        .navbar {
          padding: 10px 15px;
          justify-content: space-between;
        }

        .logo {
          font-size: 24px;
        }

        .nav-links {
          display: none;
        }

        .search-group {
          display: none;
        }

        .hamburger {
          display: none;
        }

        .sign-in {
          padding: 8px 16px;
          font-size: 13px;
        }

        .mobile-bottom-nav {
          display: block;
        }

        /* Add padding to body for bottom nav */
        :host {
          --bottom-nav-height: 65px;
        }
      }

      /* Small Mobile - 480px and below */
      @media (max-width: 480px) {
        .navbar {
          padding: 10px 12px;
        }

        .logo {
          font-size: 22px;
        }

        .sign-in {
          padding: 7px 14px;
          font-size: 12px;
        }

        .mobile-nav-item {
          font-size: 10px;
          padding: 4px 8px;
        }

        .mobile-nav-item svg {
          width: 22px;
          height: 22px;
        }
      }

      /* Extra Small Mobile - 375px and below */
      @media (max-width: 375px) {
        .navbar {
          padding: 8px 10px;
        }

        .logo {
          font-size: 20px;
        }

        .sign-in {
          padding: 6px 12px;
          font-size: 11px;
        }

        .mobile-nav-item {
          font-size: 9px;
          gap: 2px;
        }

        .mobile-nav-item svg {
          width: 20px;
          height: 20px;
        }
      }

      :host { 
        display: block; 
      }
    `;

    const html = document.createElement('div');
    html.innerHTML = `
      <!-- Desktop Navbar (Top) -->
      <nav class="navbar">
        <div class="logo">
          <span class="cine">CINE</span><span class="wave">WAVE</span>
        </div>

        <div class="nav-links">
          <a href="/" data-link data-route="home">Нүүр</a>
          <a href="/movies" data-link data-route="movies">Кино</a>
          <a href="/customlist" data-link data-route="customlist">Жагсаалт</a>
          <a href="/reviews" data-link data-route="reviews">Шүүмж</a>
        </div>

        <div class="search-group">
          <div class="search-box">
            <input type="text" placeholder="Хайх..." id="search-input">
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

      <div class="mobile-search-wrapper" id="mobile-search">
        <div class="mobile-search-group">
          <input type="text" placeholder="Хайх..." id="mobile-search-input">
        </div>
      </div>

      <nav class="mobile-bottom-nav">
        <div class="mobile-nav-items">
          <a href="/" class="mobile-nav-item" data-mobile-link data-route="home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Нүүр</span>
          </a>
          
          <a href="/movies" class="mobile-nav-item" data-mobile-link data-route="movies">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            <span>Кино</span>
          </a>
          
          <a href="/customlist" class="mobile-nav-item" data-mobile-link data-route="customlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Жагсаалт</span>
          </a>
          
          <a href="/reviews" class="mobile-nav-item" data-mobile-link data-route="reviews">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Шүүмж</span>
          </a>
          
          <a class="mobile-nav-item" id="mobile-search-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span>Хайх</span>
          </a>
        </div>
      </nav>
    `;

    this.shadowRoot.append(style, html);

    this.hamburger = this.shadowRoot.querySelector('.hamburger');
    this.navLinks = this.shadowRoot.querySelector('.nav-links');
    this.signInBtn = this.shadowRoot.querySelector('.sign-in');
    this.searchInput = this.shadowRoot.querySelector('#search-input');
    this.mobileSearchInput = this.shadowRoot.querySelector('#mobile-search-input');
    this.mobileSearchWrapper = this.shadowRoot.querySelector('#mobile-search');
    this.mobileSearchBtn = this.shadowRoot.querySelector('#mobile-search-btn');
    this.logo = this.shadowRoot.querySelector('.logo');
    this.links = this.shadowRoot.querySelectorAll('a[data-link]');
    this.mobileLinks = this.shadowRoot.querySelectorAll('a[data-mobile-link]');
    
    this.updateNavForAuth();
  }

  connectedCallback() {
    this.logo.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigate('/');
    });

    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigate(path);
      });
    });

    this.mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = link.getAttribute('href');
        this.navigate(path);
        this.mobileSearchWrapper.classList.remove('show');
      });
    });

    this.signInBtn.addEventListener('click', () => {
      this.navigate('/login');
    });

    this.mobileSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.mobileSearchWrapper.classList.toggle('show');
      if (this.mobileSearchWrapper.classList.contains('show')) {
        this.mobileSearchInput.focus();
      }
    });

    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = this.searchInput.value.trim();
        
        if (query) {
          this.dispatchEvent(new CustomEvent('search', {
            detail: { query },
            bubbles: true,
            composed: true
          }));
        }
      }
    });

    this.mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = this.mobileSearchInput.value.trim();
        
        if (query) {
          this.dispatchEvent(new CustomEvent('search', {
            detail: { query },
            bubbles: true,
            composed: true
          }));
          this.mobileSearchWrapper.classList.remove('show');
        }
      }
    });

    this.updateActiveLink();
    window.addEventListener('hashchange', () => {
      this.updateActiveLink();
      this.updateNavForAuth();
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'cinewave_user' || e.key === 'cinewave_token') {
        this.updateNavForAuth();
      }
    });

    setInterval(() => {
      this.updateNavForAuth();
    }, 1000);

    document.addEventListener('click', (e) => {
      if (!this.shadowRoot.contains(e.target)) {
        this.mobileSearchWrapper.classList.remove('show');
      }
    });
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

    this.mobileLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  updateNavForAuth() {
    import('./auth-service.js').then(({ authService }) => {
      const signInBtn = this.shadowRoot.querySelector('.sign-in');
      
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        
        const avatarUrl = user.avatar || this.getDefaultAvatar(user);
        
        signInBtn.innerHTML = `
          <img src="${avatarUrl}" 
               alt="Profile" 
               style="width: 36px; height: 36px; border-radius: 50%; cursor: pointer; object-fit: cover; border: 2px solid #00ffff;">
        `;
        signInBtn.style.padding = '4px';
        signInBtn.style.background = 'rgba(0, 255, 255, 0.1)';
        signInBtn.style.border = 'none';
        signInBtn.style.borderRadius = '50%';
        signInBtn.onclick = () => {
          window.location.hash = '#/profile';
        };
      } else {
        signInBtn.innerHTML = 'Нэвтрэх';
        signInBtn.style.padding = '10px 20px';
        signInBtn.style.background = '#00ffff';
        signInBtn.style.borderRadius = '6px';
        signInBtn.style.border = 'none';
        signInBtn.onclick = () => {
          this.navigate('/login');
        };
      }
    }).catch(() => {
    });
  }

  getDefaultAvatar(user) {
    const initial = (user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase();
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ccircle cx="50" cy="50" r="50" fill="%23007bff"/%3E%3Ctext x="50" y="65" font-size="50" text-anchor="middle" fill="white" font-weight="bold"%3E${initial}%3C/text%3E%3C/svg%3E`;
  }
}

customElements.define('cinewave-navbar', CineWaveNavbar);