// cinewave-footer-component.js
class CineWaveFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
    <style>
        :host {
            display: block;
            --primary-color: #4da3ff;
            --secondary-color: #00ffff;
            --bg-color: #1e1e1e;
            --text-color: #ddd;
            --text-light: #bbb;
            --border-color: #333;
        }

        .footer {
            background-color: var(--bg-color);
            color: var(--text-color);
            padding: 60px 8% 40px;
            padding-left: 2rem;
            font-family: "Nunito", "BBH Sans Bogle", sans-serif;
            width: 100%;
            box-sizing: border-box;
        }

        .footer-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-column h3 {
            font-size: 1.1rem;
            margin-bottom: 15px;
            color: #fff;
            font-weight: 600;
        }

        .footer-column ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-column ul li {
            margin: 8px 0;
        }

        .footer-column ul li a {
            color: var(--text-light);
            text-decoration: none;
            transition: color 0.3s;
            font-size: 0.95rem;
        }

        .footer-column ul li a:hover {
            color: var(--primary-color);
        }

        .brand {
            padding-top: 1rem;
        }

        .brand .cine {
            color: #007bff;
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .brand .wave {
            color: var(--secondary-color);
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .newsletter p {
            margin-bottom: 15px;
            font-size: 0.95rem;
            line-height: 1.4;
            color: var(--text-light);
        }

        .newsletter-form {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .newsletter-form input {
            flex: 1;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background-color: #1a1f25;
            color: #eee;
            font-size: 0.9rem;
            transition: border-color 0.3s;
        }

        .newsletter-form input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .newsletter-form button {
            background-color: var(--primary-color);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 18px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
        }

        .newsletter-form button:hover {
            background-color: #2b85e0;
        }

        .line {
            border: none;
            height: 1px;
            background-color: #333;
            margin: 40px auto 30px;
            max-width: 1200px;
        }

        .footer-bottom {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            font-size: 0.9rem;
            color: #aaa;
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-bottom p {
            margin: 0;
        }

        .footer-socials {
            display: flex;
            gap: 15px;
        }

        .footer-socials a {
            color: var(--text-light);
            font-size: 1rem;
            transition: color 0.3s, transform 0.2s;
            text-decoration: none;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .footer-socials a:hover {
            color: var(--primary-color);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .footer {
                padding: 40px 5%;
            }
            
            .footer-container {
                gap: 30px;
            }
            
            .footer-bottom {
                flex-direction: column;
                text-align: center;
            }
            
            .newsletter-form {
                flex-direction: column;
            }
            
            .newsletter-form button {
                width: 100%;
            }
        }

        @media (max-width: 480px) {
            .footer-container {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .brand {
                padding-top: 0;
            }
        }
    </style>

    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column brand">
                <span class="cine">CINE</span><span class="wave">WAVE</span>
            </div>

            <div class="footer-column">
                <h3>Кино</h3>
                <ul>
                    <li><a href="#">Хайх</a></li>
                    <li><a href="#">Эрэлтэд</a></li>
                    <li><a href="#">Өндөр үнэлгээтэй</a></li>
                    <li><a href="#">Шинэ гаралтууд</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h3>Community</h3>
                <ul>
                    <li><a href="#">Найзууд</a></li>
                    <li><a href="#">Жагсаалт</a></li>
                    <li><a href="#">Хэлэлцүүлэг</a></li>
                    <li><a href="#">Шүүмж</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h3>Компани</h3>
                <ul>
                    <li><a href="#">Бидний тухай</a></li>
                    <li><a href="#">Ажлын байр</a></li>
                    <li><a href="#">Холбоо барих</a></li>
                    <li><a href="#">Биднийг дэмжих</a></li>
                </ul>
            </div>

            <div class="footer-column newsletter">
                <h3>Сонин</h3>
                <p>Сүүлийн үеийн кино урлагийн талаарх мэдлэгийг таны гарт.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>

        <hr class="line">
        <div class="footer-bottom">
            <p>© 2025 CineWave. All rights reserved.</p>

            <div class="footer-socials">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="X (Twitter)"><i class="fab fa-x-twitter"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
        </div>
    </footer>
`;
    }

    connectedCallback() {
        this.setupNewsletterForm();
        this.setupSocialLinks();
    }

    setupNewsletterForm() {
        const form = this.shadowRoot.querySelector('.newsletter-form');
        form.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
    }

    setupSocialLinks() {
        const socialLinks = this.shadowRoot.querySelectorAll('.footer-socials a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.getAttribute('aria-label')?.toLowerCase() || '';
                this.handleSocialClick(platform);
            });
        });

        // Setup navigation links
        const navLinks = this.shadowRoot.querySelectorAll('.footer-column a');
        navLinks.forEach(link => {
            if (!link.closest('.footer-socials')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const linkText = link.textContent;
                    this.handleNavigationClick(linkText);
                });
            }
        });
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const emailInput = this.shadowRoot.querySelector('.newsletter-form input[type="email"]');
        const email = emailInput.value.trim();
        
        if (this.validateEmail(email)) {
            // Dispatch custom event for newsletter subscription
            this.dispatchEvent(new CustomEvent('newsletter-subscribed', {
                detail: { email },
                bubbles: true,
                composed: true
            }));
            
            alert('Таны и-мэйл амжилттай бүртгэгдлээ! Баярлалаа.');
            emailInput.value = '';
        } else {
            alert('Хүчингүй и-мэйл хаяг оруулсан байна.');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    handleSocialClick(platform) {
        // Dispatch custom event for social media clicks
        this.dispatchEvent(new CustomEvent('social-clicked', {
            detail: { platform },
            bubbles: true,
            composed: true
        }));
        
        // You can add platform-specific URLs here
        const urls = {
            'facebook': 'https://facebook.com/cinewave',
            'instagram': 'https://instagram.com/cinewave',
            'x (twitter)': 'https://twitter.com/cinewave',
            'linkedin': 'https://linkedin.com/company/cinewave',
            'youtube': 'https://youtube.com/cinewave'
        };
        
        const url = urls[platform];
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    handleNavigationClick(linkText) {
        // Dispatch custom event for navigation clicks
        this.dispatchEvent(new CustomEvent('nav-clicked', {
            detail: { linkText },
            bubbles: true,
            composed: true
        }));
        
        // Add navigation logic here
        console.log(`Navigating to: ${linkText}`);
        
        // Example: You could add routing logic based on linkText
        const routes = {
            'Хайх': '/search',
            'Эрэлтэд': '/trending',
            'Өндөр үнэлгээтэй': '/top-rated',
            'Шинэ гаралтууд': '/new-releases',
            'Найзууд': '/friends',
            'Жагсаалт': '/lists',
            'Хэлэлцүүлэг': '/discussions',
            'Шүүмж': '/reviews',
            'Бидний тухай': '/about',
            'Ажлын байр': '/careers',
            'Холбоо барих': '/contact',
            'Биднийг дэмжих': '/support'
        };
        
        const route = routes[linkText];
        if (route) {
        }
    }
    updateCopyrightYear(year) {
        const copyrightText = this.shadowRoot.querySelector('.footer-bottom p');
        if (copyrightText) {
            copyrightText.textContent = `© ${year} CineWave. All rights reserved.`;
        }
    }
    setColors(colors) {
        const style = this.shadowRoot.querySelector('style');
        if (colors.primary) {
            style.textContent = style.textContent.replace(
                /--primary-color: #4da3ff;/g,
                `--primary-color: ${colors.primary};`
            );
        }
        if (colors.secondary) {
            style.textContent = style.textContent.replace(
                /--secondary-color: #00ffff;/g,
                `--secondary-color: ${colors.secondary};`
            );
        }
        if (colors.bg) {
            style.textContent = style.textContent.replace(
                /--bg-color: #1e1e1e;/g,
                `--bg-color: ${colors.bg};`
            );
        }
    }
}

customElements.define('cinewave-footer', CineWaveFooter);