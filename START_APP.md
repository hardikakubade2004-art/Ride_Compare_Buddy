# 🚀 START RIDECOMPARE APP - QUICK GUIDE

## ⚡ Quick Start (3 Steps)

### **STEP 1: Start Backend Server**

Open **Command Prompt** (WIN + R, type `cmd`, press Enter)

```bash
cd C:\fymca sem 2\New folder\backend
npm start
```

Wait for this message:
```
Server running on port 5000
```

✅ **LEAVE THIS WINDOW OPEN**

---

### **STEP 2: Start Frontend Dev Server**

Open a **SECOND Command Prompt** (NEW WINDOW!)

```bash
cd C:\fymca sem 2\New folder
npm run dev
```

Wait for this message:
```
➜  Local:   http://localhost:5173/
```

---

### **STEP 3: Open in Browser**

Click this link or paste in browser:
```
http://localhost:5173
```

---

## 📱 What You'll See

### **Homepage**
- Menu, Location, Profile buttons at top
- "Plan your ride" section
- Passenger selector (1-6)
- Ride mode selector (Bike, Auto, Mini, Sedan)

### **Search Page** (Click "Plan your ride")
- Pickup location (auto-filled)
- "Where to?" input
- Recent searches below (after 1st search)

### **Results Page** (After searching)
- **AI RECOMMENDATION BOX** with gradient
- **RIDE OPTIONS** from Rapido, Ola, Uber
- **FARES** displayed for each option
- **BOOK BUTTON** at bottom

---

## 🔴 If Not Working

### **No Fares Showing?**

1. **Check if backend is running:**
   ```
   Open Command Prompt
   Run: curl http://localhost:5000/api/health
   Should show: {"status":"ok","message":"RideCompare Backend is running"}
   ```

2. **If error, go back to STEP 1 and restart backend**

3. **Check browser console (F12 → Console):**
   - Look for red errors
   - Should say: `Ride data received: {...}`

### **Recent Searches Not Showing?**

1. Do a search (enter pickup + destination + press Enter)
2. Go back to Search page
3. You should see it in "Recent Places"

### **CSS/Tailwind Errors?**

1. Hard refresh: **Ctrl + Shift + Delete** (or Ctrl + F5)
2. Clear browser cache
3. Restart dev server: Stop and run `npm run dev` again

---

## 📋 Exact Commands to Copy-Paste

**Terminal 1 (Backend):**
```
cd C:\fymca sem 2\New folder\backend
npm start
```

**Terminal 2 (Frontend):**
```
cd C:\fymca sem 2\New folder
npm run dev
```

**Browser:**
```
http://localhost:5173
```

---

## 🎯 Expected Results

| Screen | Should Show |
|--------|------------|
| Home | ✅ Passenger + Ride Mode selectors |
| Search | ✅ Location inputs + Recent searches |
| Results | ✅ AI Recommendation box |
| Results | ✅ 3 Ride options with fares |
| Results | ✅ Cheapest/Fastest badges |

---

## ⚠️ Common Mistakes

❌ **Mistake:** Only running frontend, no backend
✅ **Fix:** You NEED 2 terminals - one for backend, one for frontend

❌ **Mistake:** Closing the backend terminal
✅ **Fix:** Backend needs to stay running the whole time

❌ **Mistake:** Opening wrong URL
✅ **Fix:** Use `http://localhost:5173` (not 5000)

---

## 🆘 Full Diagnostic

Run this to check everything:
```
cd C:\fymca sem 2\New folder
DIAGNOSE.bat
```

This will check:
- ✅ Node.js installed
- ✅ npm installed  
- ✅ Dependencies installed
- ✅ Ready to start

---

## 💡 Tips

- Keep both terminals (backend + frontend) open while testing
- Use F12 to open browser developer tools to see errors
- If something breaks, restart both servers
- Clear browser cache if CSS looks weird

---

**You're all set! 🎉**

Go to http://localhost:5173 and enjoy RideCompare!
