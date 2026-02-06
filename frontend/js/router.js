class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    window.addEventListener('hashchange', () => this.handleRoute());
    
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[data-link]')) {
        e.preventDefault();
        this.navigateTo(e.target.getAttribute('href'));
      }
    });
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigateTo(path) {
    window.location.hash = path;
  }

  async handleRoute() {
    let fullPath = window.location.hash.slice(1) || '/';
    
    const pathParts = fullPath.split('?');
    let path = pathParts[0];
    
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    this.currentRoute = path;

    let handler = this.routes[path];
    
    if (!handler) {
      for (let route in this.routes) {
        const pattern = new RegExp('^' + route.replace(/:\w+/g, '([^/]+)') + '$');
        const match = path.match(pattern);
        if (match) {
          handler = this.routes[route];
          break;
        }
      }
    }

    if (!handler && path.startsWith('/movie-details/')) {
      const movieDetailsMatch = path.match(/^\/movie-details\/(movies|tv)\/(\d+)$/);
      if (movieDetailsMatch && this.routes['/movie-details/:category/:id']) {
        handler = this.routes['/movie-details/:category/:id'];
      }
    }

    if (!handler && path.startsWith('/movie-reviews/')) {
      const movieReviewsMatch = path.match(/^\/movie-reviews\/(movies|tv)\/(\d+)$/);
      if (movieReviewsMatch && this.routes['/movie-reviews/:category/:id']) {
        handler = this.routes['/movie-reviews/:category/:id'];
      }
    }

    if (handler) {
      await handler();
    } else {
      this.routes['/404']?.() || this.show404();
    }

    document.body.style.overflow = 'auto';
    
    window.scrollTo(0, 0);
  }

  show404() {
    const main = document.querySelector('main');
    main.innerHTML = `
      <div style="text-align: center; padding: 100px 20px; color: white;">
        <h1 style="font-size: 72px; margin: 0;">404</h1>
        <p style="font-size: 24px; margin: 20px 0;">Хуудас олдсонгүй</p>
        <a href="/" data-link style="color: #00ffff; text-decoration: none; font-size: 18px;">
          Нүүр хуудас руу буцах
        </a>
      </div>
    `;
  }

  start() {
    this.handleRoute();
  }
}

const router = new Router();
export default router;