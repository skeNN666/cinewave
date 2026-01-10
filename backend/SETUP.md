# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the `backend` folder with:

```
MONGODB_URI=mongodb://localhost:27017/cinewave
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Change `JWT_SECRET` to a random strong string for security!

## Step 3: Install and Start MongoDB

### Option A: Local MongoDB
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017` by default

### Option B: MongoDB Atlas (Cloud - Easier!)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env` file

## Step 4: Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Testing

Open your browser and go to:
- `http://localhost:3000/api/health` - Should show `{"status":"ok"}`

Your frontend should now be able to connect to the backend!
