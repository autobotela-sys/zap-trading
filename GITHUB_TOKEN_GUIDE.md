# 🔑 GitHub Personal Access Token Guide

## What is a GitHub Token?

A **GitHub Personal Access Token (PAT)** is like a password but more secure. It allows you to perform Git operations (push, pull, etc.) from your computer without using your actual GitHub password.

**Why do you need it?**
- GitHub no longer accepts passwords for Git operations
- You need it to push code from your computer to GitHub
- It's more secure than using your password

---

## 📝 How To Create a GitHub Token

### Step 1: Go to GitHub Settings

1. Go to https://github.com
2. Make sure you're logged in (top right corner should show your avatar)
3. Click your **profile picture** (top right)
4. Click **Settings** from the dropdown menu

### Step 2: Go to Developer Settings

1. Scroll down to the bottom of the left sidebar
2. Click **Developer settings** (last option)
3. Click **Personal access tokens** → **Tokens (classic)**

### Step 3: Generate New Token

1. Click **Generate new token** → **Generate new token (classic)**

### Step 4: Configure Token

1. **Note:** Enter a name like "Zap Trading Deployment"
2. **Expiration:** Choose "90 days" or "No expiration"
3. **Select scopes:** Check these boxes:
   - ✅ **repo** (this gives full control of private repositories)
     - When you check "repo", all sub-items under it will be checked automatically
4. Scroll to the bottom
5. Click **Generate token**

### Step 5: Copy Token (IMPORTANT!)

⚠️ **You will only see this token ONCE!** Make sure to copy it.

1. You'll see a long string of random characters
2. Click the **Copy** icon (📋) next to the token
3. Save it somewhere safe (like a text file)

The token will look something like:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 How To Use The Token

### Option A: Use the Push Script (Easiest)

1. Run this file:
   ```
   C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web\push-to-github.bat
   ```

2. When it asks for "GitHub Token:", paste your token
3. Press Enter
4. Done! ✅

### Option B: Command Line Push

1. Open Command Prompt or PowerShell
2. Run:
   ```bash
   cd C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web
   git push origin main
   ```

3. When it asks for:
   - **Username:** `autobotela-sys`
   - **Password:** `paste your token here`

   Note: When you paste the token, you won't see anything appear on screen (that's normal for security)

### Option C: Save Token Permanently (Recommended)

1. Open Git Credential Manager:
   ```bash
   git config --global credential.helper manager-core
   ```

2. Try to push:
   ```bash
   cd C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web
   git push origin main
   ```

3. A popup window will appear:
   - Username: `autobotela-sys`
   - Password: `paste your token here`

4. Check "Remember my credentials" and click OK

Now you won't need to enter the token again! ✅

---

## 🔒 Security Tips

1. **Never share your token** publicly
2. **Don't commit it to Git** (it's already in .gitignore)
3. **Store it safely** in a password manager
4. **Revoke if compromised** - Go to GitHub Settings → Developer settings → Personal access tokens and click "Delete"

---

## ❓ Troubleshooting

**"Authentication failed"**
- Make sure you copied the entire token
- Check that the token hasn't expired
- Verify you selected the "repo" scope when creating it

**"Invalid username or token"**
- Double-check your GitHub username is: `autobotela-sys`
- Make sure you're pasting the token in the password field (not username)

**"Support for password authentication was removed"**
- This is expected! You MUST use a Personal Access Token now
- Follow the steps above to create one

---

## Quick Link

Go directly to token creation:
https://github.com/settings/tokens/new

When you get there:
1. Note: "Zap Trading Deployment"
2. Expiration: "90 days"
3. Check ✅ **repo**
4. Click "Generate token"
5. Copy the token!

---

## Need Help?

If you're stuck at any step:
1. Take a screenshot of what you see
2. Share it with me
3. I'll guide you through it!
