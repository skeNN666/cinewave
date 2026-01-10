# How to Check Users in MongoDB

There are several ways to verify that users are being saved in MongoDB. Choose the method that's easiest for you:

## Method 1: Using MongoDB Compass (GUI - Easiest! ⭐)

**MongoDB Compass** is a visual tool that makes it easy to browse your database.

### Step 1: Download MongoDB Compass
- Go to: https://www.mongodb.com/try/download/compass
- Download and install MongoDB Compass (it's free)

### Step 2: Connect to Your Database
1. Open MongoDB Compass
2. Enter your connection string:
   - **Local MongoDB**: `mongodb://localhost:27017`
   - **MongoDB Atlas**: Get your connection string from Atlas dashboard (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

3. Click "Connect"

### Step 3: Browse Your Data
1. In the left sidebar, click on the `cinewave` database
2. Click on the `users` collection
3. You'll see all registered users with their data!

## Method 2: Using MongoDB Shell (mongosh)

### Step 1: Open MongoDB Shell
```bash
mongosh
```

### Step 2: Switch to Your Database
```bash
use cinewave
```

### Step 3: View All Users
```bash
db.users.find().pretty()
```

This will display all users in a readable format.

### Other Useful Commands:
```bash
# Count total users
db.users.countDocuments()

# Find specific user by email
db.users.findOne({ email: "test@example.com" })

# Find user and show only certain fields
db.users.find({}, { firstName: 1, lastName: 1, email: 1 })
```

## Method 3: Using the Check Script (Quick & Easy)

We've created a script that you can run:

```bash
cd backend
npm run check-db
```

This will:
- Connect to your database
- Show all collections
- Display all users with their details
- Show user count

## Method 4: Check Backend Logs

When you register a user, check your backend server console. You should see:
```
✅ Connected to MongoDB
📝 Registering new user: user@example.com
✅ User registered successfully
```

If you see errors, that means there's a connection issue.

## Method 5: Test with API Response

When you register via the frontend or API, the response includes the user `_id`:
```json
{
  "user": {
    "_id": "696273292ef337395e86bfb4",
    "firstName": "Test",
    ...
  }
}
```

If you get an `_id` back, the user was successfully saved to MongoDB!

## Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running (if using local MongoDB)
- Check your `MONGODB_URI` in the `.env` file
- For MongoDB Atlas, check your IP whitelist and connection string

### "Database not found"
- This is normal! MongoDB creates the database and collection automatically when you insert the first document
- Try registering a user first, then check again

### "Collection is empty"
- Make sure you've actually registered a user through the frontend or API
- Check browser console for any errors during registration
- Verify the backend server is running and connected

## Quick Verification Checklist

✅ Backend server is running (`npm run dev`)
✅ MongoDB is connected (check server logs)
✅ User registration succeeds (check frontend/browser console)
✅ No errors in backend console
✅ Run `npm run check-db` or use MongoDB Compass to view users
