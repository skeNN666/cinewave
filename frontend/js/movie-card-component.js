// movie-card-component.js
class MovieCard extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({ mode: 'open' });
        
       this.shadowRoot.innerHTML = `
    <style>
        .movie-card {
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-align: center;
            height: 400px;
            width: 100%;
            display: block;
            position: relative;
        }

        :host(.poster-mode) .movie-card {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 15px !important;
            height: 500px !important; /* FIXED HEIGHT FOR POSTER */
            width: 100% !important;
        }

        :host(.poster-mode) .title-container,
        :host(.poster-mode) .neg-yum {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        :host(.poster-mode) .movie-card img {
            border-radius: 15px !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5) !important;
            height: 90% !important;
            width: 100% !important;
            object-fit: cover !important; /* COVER FOR PROPORTIONS */
            position: relative !important;
            top: auto !important;
            left: auto !important;
        }

        .movie-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        /* REGULAR CARD STYLES (NON-POSTER MODE) */
        .movie-card img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
        }

        .title-container {
            height: 35px;
            display: block;
            position: absolute;
            top: 305px;
            left: 0;
            right: 0;
            padding: 1rem 1rem;
            overflow: hidden;
        }

        .movie-card h3 {
            font-size: 1rem;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            width: 100%;
            line-height: 1.2;
            padding: 0;
            display: block;
        }

        .neg-yum {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: black;
            padding: 1rem;
            height: 30px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .genre-year {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
        }

        .type {
            font-weight: bold;
            flex-shrink: 0;
            margin-left: 10px;
        }
    </style>

    <article class="movie-card">
        <img src="" alt="">
        <div class="title-container">
            <h3></h3>
        </div>
        <div class="neg-yum">
            <span class="genre-year"></span>
            <span class="type"></span>
        </div>
    </article>
`;
    }

    connectedCallback() {
        this.updateContent();
        this.addClickHandler();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.updateContent();
    }

    static get observedAttributes() {
        return ['name', 'image', 'year-or-season', 'category'];
    }

updateContent() {
    const shadow = this.shadowRoot;
    
    // SMART PATH DETECTION THAT WORKS LOCALLY
    const currentPath = window.location.pathname;
    console.log('📍 Current path:', currentPath);
    
    let imageBasePath;
    
    if (currentPath.includes('/html/') || currentPath.includes('movie-detail.html')) {
        // WE'RE IN HTML FOLDER - GO UP ONE LEVEL
        imageBasePath = '../images/';
        console.log('📁 Detected: Detail page - using ../images/');
    } else {
        // WE'RE ON HOMEPAGE (ROOT LEVEL)
        imageBasePath = 'images/';
        console.log('🏠 Detected: Homepage - using images/');
    }
    
    const imagePath = `${imageBasePath}${this.getAttribute('image')}`;
    console.log('🖼️ Final image path:', imagePath);
    
    shadow.querySelector('h3').textContent = this.getAttribute('name') || 'Unknown Movie';
    shadow.querySelector('img').src = imagePath;
    shadow.querySelector('img').alt = this.getAttribute('name') || 'Movie Poster';
    shadow.querySelector('.genre-year').textContent = this.getAttribute('year-or-season') || 'Unknown';
    
    const category = this.getAttribute('category');
    shadow.querySelector('.type').textContent = category === 'movies' ? 'Кино' : 'Цуврал';
    
    // DEBUG IMAGE LOADING
    shadow.querySelector('img').onload = () => console.log('✅ Image loaded successfully from:', imagePath);
    shadow.querySelector('img').onerror = () => console.log('❌ Image failed to load from:', imagePath);
}

    addClickHandler() {
    this.shadowRoot.querySelector('.movie-card').addEventListener('click', () => {
        const isClickable = this.getAttribute('clickable') !== 'false';
        
        if (isClickable) {
            const movieName = this.getAttribute('name');
            const movieImage = this.getAttribute('image');
            const movieYear = this.getAttribute('year-or-season');
            const movieCategory = this.getAttribute('category');
            
            this.redirectToMovieDetail(movieName, movieImage, movieYear, movieCategory);
        }
    });
}

    redirectToMovieDetail(name, image, year, category) {
        const params = new URLSearchParams({
            name: encodeURIComponent(name),
            image: image,
            year: encodeURIComponent(year),
            category: category
        });
        
        window.location.href = `html/movie-detail.html?${params.toString()}`;
    }
}

customElements.define('movie-card', MovieCard);