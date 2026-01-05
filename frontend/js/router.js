// router.js - Simple SPA Router with Hash-Based Routing
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Listen for navigation events
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercept all link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[data-link]')) {
        e.preventDefault();
        this.navigateTo(e.target.getAttribute('href'));
      }
    });
  }

  // Register a route
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  // Navigate to a new route
  navigateTo(path) {
    window.location.hash = path;
    this.handleRoute();
  }

  // Handle current route
  async handleRoute() {
    // Get path from hash, default to '/'
    let fullPath = window.location.hash.slice(1) || '/';
    
    // Separate path from query parameters
    const pathParts = fullPath.split('?');
    let path = pathParts[0];
    
    // Remove trailing slash except for root
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    this.currentRoute = path;

    // Find matching route
    let handler = this.routes[path];
    
    // If no exact match, try to find a pattern match
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

    // Execute handler or show 404
    if (handler) {
      await handler();
    } else {
      this.routes['/404']?.() || this.show404();
    }

    // Scroll to top on route change
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

  // Start the router
  start() {
    this.handleRoute();
  }
}

// Export router instance
const router = new Router();
export default router;