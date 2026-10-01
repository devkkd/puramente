# MongoDB Connection Troubleshooting Guide

## Problem
MongoDB connection failing on server startup with:
`
❌ MongoDB connection error
`

## Root Causes (in order of likelihood)

### 1. IP Address Not Whitelisted in MongoDB Atlas ⚠️ MOST LIKELY
MongoDB Atlas blocks connections from IP addresses not on the whitelist.

**Fix:**
1. Go to https://cloud.mongodb.com
2. Select your cluster 'puramentedb'
3. Navigate to: Security → Network Access → IP Whitelist
4. Click "Add IP Address"
5. Either:
   - Add your machine's public IP (get it from https://ifconfig.me)
   - OR add 0.0.0.0/0 to allow all IPs (dev only, not recommended for production)
6. Click "Confirm"

### 2. Credentials Incorrect
Username or password might be wrong.

**Current Credentials:**
- Username: puramenteinter_db_user
- Password: Puramente@1101 (encoded as Puramente%401101 in URL)
- Host: puramentedb.irbq9pg.mongodb.net

**Fix:**
1. Go to MongoDB Atlas dashboard
2. Go to Database Access → Users
3. Verify the username and password match
4. If forgot, reset the password and update .env

### 3. MongoDB Cluster Not Running
The cluster might be paused or stopped.

**Fix:**
1. Go to https://cloud.mongodb.com
2. Check if cluster 'puramentedb' shows as "Running"
3. If paused, click to resume it

### 4. Network/Firewall Issue
Your computer's firewall might be blocking MongoDB connections.

**Fix:**
- Check if port 27017 is open
- Try using MongoDB Compass to test connection
- Temporarily disable firewall to test

## Testing Connection

### Option A: Using Node.js Test Script
Create 	est-mongo.js:
`javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.error('❌ Error:', err.message));
`

Run: 
ode test-mongo.js

### Option B: Using MongoDB Compass
1. Download from: https://www.mongodb.com/products/compass
2. Paste connection string: mongodb+srv://puramenteinter_db_user:Puramente%401101@puramentedb.irbq9pg.mongodb.net/?appName=PuramenteDB
3. Click "Connect"

If Compass connects, but your server doesn't, it's likely a code issue.

## Server Changes Made

Updated server.js with better error handling:
- More detailed error messages showing exact failure reason
- Longer timeout (10 seconds instead of 5)
- Added retry options in connection parameters
- Graceful shutdown handling

Run: 
pm run dev

You should now see either:
✅ MongoDB connected successfully

OR

❌ MongoDB connection error: [SPECIFIC ERROR MESSAGE]

## Quick Checklist

`
☐ MongoDB Atlas cluster is running?
☐ Your IP is whitelisted (or 0.0.0.0/0)?
☐ Credentials in .env are correct?
☐ Internet connection is stable?
☐ No firewall blocking port 27017?
☐ Connection string format is correct?
`

## Getting Help

If still failing, provide the exact error message:
- Run: 
ode backend/server.js
- Copy the full error from ❌ MongoDB connection error
- Check MongoDB Atlas logs in Security → Audit Logs