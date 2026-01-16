# 🔧 Railway Deployment Guide - Complete Setup

## Prerequisites
- GitHub repository: `autobotela-sys/zap-trading` ✅ (Already created)
- Vercel frontend: `https://zap-trading.vercel.app` ✅ (Already deployed)

---

## Step-by-Step Instructions

### STEP 1: Create New Railway Project

1. Go to https://railway.app
2. Click **"Login"** (you should already be logged in)
3. Click **"New Project"** button
4. Click **"Deploy from GitHub repo"**
5. Select repository: **autobotela-sys/zap-trading**
6. **IMPORTANT - CRITICAL STEP:**
   - Look for **"Root Directory"** field (or click **"Advanced"**)
   - Set it to: **backend**
7. Click **"Deploy Now"**

⏳ Wait for the initial deployment to finish (it will fail, that's OK)

---

### STEP 2: Add Databases

1. In your Railway project, click **"New Service"**
2. Click **"Database"** → Select **"PostgreSQL"**
3. Click **"Add PostgreSQL"**
4. Wait for it to be created (green dot = ready)

5. Click **"New Service"** again
6. Click **"Database"** → Select **"Redis"**
7. Click **"Add Redis"**
8. Wait for it to be created

---

### STEP 3: Configure Backend Service

1. Click on the **backend** service in your project
2. Go to **"Settings"** tab
3. Verify **Root Directory** is set to: **backend**
   - If not, change it to "backend"

4. Go to **"Variables"** tab
5. Click **"New Variable"** and add these 3 variables:

   ```
   Name: JWT_SECRET
   Value: ZapSecret2024ProductionKey
   ```

   ```
   Name: DEBUG
   Value: False
   ```

   ```
   Name: ALLOWED_ORIGINS
   Value: https://zap-trading.vercel.app
   ```

6. Click **"Deploy"** or **"Restart"** to apply changes

---

### STEP 4: Connect Database to Backend

1. Click on the **PostgreSQL** service
2. Go to **"Variables"** tab
3. Look for **DATABASE_URL** variable
4. Click the **eye icon** to reveal the value
5. Click to copy it

6. Go back to **backend** service → **"Variables"** tab
7. Add variable:
   ```
   Name: DATABASE_URL
   Value: <paste the PostgreSQL DATABASE_URL>
   ```

8. Click on the **Redis** service
9. Go to **"Variables"** tab
10. Copy the **REDIS_URL** value

11. Go back to **backend** service → **"Variables"** tab
12. Add variable:
    ```
    Name: REDIS_URL
    Value: <paste the Redis REDIS_URL>
    ```

---

### STEP 5: Get Backend URL

1. Click on the **backend** service
2. Go to **"Settings"** tab
3. Scroll down to **"Domains"** section
4. Copy your backend URL (e.g., `https://zap-backend.up.railway.app`)

---

### STEP 6: Update Frontend Environment Variable

1. Go to https://vercel.com
2. Open your **zap-trading** project
3. Go to **Settings** → **Environment Variables**
4. Find **VITE_API_URL**
5. Update it to your new backend URL from Step 5
6. Click **Save**
7. Click **"Redeploy"** to apply changes

---

### STEP 7: Verify Everything Works

1. Wait for all Railway services to show **green dots**
2. Go to **https://zap-trading.vercel.app**
3. Try to:
   - Register a new account
   - Login
   - Add a Zerodha account
   - Place a test trade

---

## ✅ Success Checklist

- [ ] Railway project created
- [ ] PostgreSQL service running (green dot)
- [ ] Redis service running (green dot)
- [ ] Backend service running (green dot)
- [ ] Backend root directory set to "backend"
- [ ] JWT_SECRET variable added
- [ ] DEBUG variable added
- [ ] ALLOWED_ORIGINS variable added
- [ ] DATABASE_URL connected
- [ ] REDIS_URL connected
- [ ] Frontend VITE_API_URL updated
- [ ] All services deployed successfully

---

## Troubleshooting

**Backend deployment failed?**
- Check that Root Directory is set to "backend" (not root)
- Make sure your GitHub repo has the "backend" folder

**Can't connect to database?**
- Verify DATABASE_URL is copied correctly to backend service
- Check PostgreSQL service is running (green dot)

**Frontend shows "not found"?**
- Verify VITE_API_URL in Vercel matches your Railway backend URL
- Check backend service is running

**Services showing gray/offline?**
- Click on the service and click "Start"
- Wait a few minutes for it to boot up

---

## Need Help?

Railway Dashboard: https://railway.app
Railway Docs: https://docs.railway.app

Your backend URL will be: `https://<your-service-name>.up.railway.app`
