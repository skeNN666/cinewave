# Cinewave - Movie Application

WEB APPLICATION ICSI301

## Project Structure

- `frontend/` - Frontend application (HTML, CSS, JavaScript)
- `backend/` - Backend API server (Node.js, Express, MongoDB)

## Quick Start

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB (see `backend/SETUP.md` for details)

4. Create `.env` file in `backend/` folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/cinewave
   PORT=3000
   JWT_SECRET=your-secret-key-here
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

Open `index.html` in your browser or use a local server.

## Features

- User registration and authentication
- Movie browsing with TMDB API
- Watchlist and favorites
- Movie ratings and reviews
- User profiles

See `backend/README.md` for detailed API documentation.
