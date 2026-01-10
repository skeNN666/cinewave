# Cinewave Backend API

Backend server for Cinewave movie application with MongoDB database.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB

You have two options:

#### Option A: Local MongoDB
- Install MongoDB on your machine
- Make sure MongoDB is running on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud - Recommended)
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secret string for JWT tokens (use a strong random string!)
- `PORT` - Server port (default: 3000)

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)
- `PUT /api/auth/change-password` - Change password (requires authentication)

### User Data

- `POST /api/auth/watchlist` - Add/remove movie from watchlist
- `POST /api/auth/favorites` - Add/remove movie from favorites
- `POST /api/auth/rating` - Rate a movie

### Health Check

- `GET /api/health` - Check if server is running

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

Tokens are valid for 7 days.

## Notes

- Passwords are hashed using bcrypt before storage
- User emails must be unique
- All user data is stored in MongoDB
- Frontend automatically saves tokens to localStorage after login/register
