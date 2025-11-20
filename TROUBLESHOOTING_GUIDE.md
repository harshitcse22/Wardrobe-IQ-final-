# 🔧 Troubleshooting Guide - Items Not Saving

## 🎯 Issue: Jeans/Items Not Saving to Database

### ✅ Step-by-Step Debugging Process:

---

## **STEP 1: Check if Backend Server is Running**

```bash
cd Backend
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

**If NOT running:** Start the server first!

---

## **STEP 2: Check if Frontend is Running**

```bash
cd Frontend
npm run dev
```

**Expected Output:**
```
Local: http://localhost:5173
```

---

## **STEP 3: Open Browser Console**

1. Open your browser (Chrome/Edge)
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Keep it open while testing

---

## **STEP 4: Upload a Test Image**

### **Test File Naming:**
Name your file: `blue-jeans.jpg` or `black-jeans.png`

### **Upload Process:**
1. Go to **Upload** page
2. Click "Choose Image" or drag & drop
3. Select your jeans image
4. Click **"Analyze Using AI"**

### **Watch Console Logs:**

**You should see:**
```
🔵 [UPLOAD] Starting upload...
🔵 [UPLOAD] File: blue-jeans.jpg
🔵 [UPLOAD] Token: Present/Missing
🔵 [UPLOAD] Response status: 200
🔵 [UPLOAD] Response data: { imageUrl: "/uploads/...", detection: {...} }
✅ [UPLOAD] Analysis successful!
✅ [UPLOAD] Detection: { type: "jeans", category: "bottoms", ... }
✅ [UPLOAD] Server Image URL: /uploads/image-123.jpg
✅ [UPLOAD] State updated. Now click "Add to Wardrobe" button!
```

**❌ If you see errors here:** Backend upload is failing
- Check if server is running
- Check uploads folder exists
- Check file permissions

---

## **STEP 5: Click "Add to Wardrobe" Button**

**IMPORTANT:** You MUST click the green "Add to My Wardrobe" button!

### **Watch Console Logs:**

**You should see:**
```
🟢 [ADD] Adding to wardrobe...
🟢 [ADD] Item data: { name: "blue jeans", type: "jeans", category: "bottoms", ... }
🟢 [ADD] Response status: 201
🟢 [ADD] Response data: { message: "Item added...", item: {...} }
✅ [ADD] Item added successfully!
✅ [ADD] Item ID: 691f661b0c9b395bd4ada002
✅ [ADD] Item category: bottoms
```

**❌ If you see:**
```
❌ [ADD] No AI results available!
```
→ You didn't click "Analyze Using AI" first

**❌ If you see:**
```
❌ [ADD] No server image URL available!
```
→ Upload didn't complete properly, try again

---

## **STEP 6: Check Backend Console**

**In your Backend terminal, you should see:**

```
============================================================
🟢 [BACKEND] ADD TO WARDROBE REQUEST RECEIVED
============================================================
🟢 [BACKEND] Request body: {
  "name": "blue jeans",
  "type": "jeans",
  "category": "bottoms",
  "color": { "primary": "blue", "secondary": [] },
  "fabric": "denim",
  "imageUrl": "/uploads/image-123.jpg"
}
🟢 [BACKEND] Creating wardrobe item with data: {...}
✅ [BACKEND] Item saved successfully!
✅ [BACKEND] Item ID: 691f661b0c9b395bd4ada002
✅ [BACKEND] Item details: {
  name: 'blue jeans',
  type: 'jeans',
  category: 'bottoms',
  ...
}
============================================================
```

**❌ If you DON'T see this:** Request not reaching backend
- Check if backend is running
- Check API URL in frontend
- Check CORS settings

---

## **STEP 7: Verify in Database**

Run this command:

```bash
cd Backend
node debug-recommendations.js
```

**Expected Output:**
```
📊 CURRENT DATABASE STATE:
Total items: X

Items by category:
  tops: X
  bottoms: 1  ← Should be at least 1
  shoes: X
```

**❌ If bottoms is still 0:** Item didn't save to database
- Check MongoDB connection
- Check user ID
- Run: `node test-full-upload-flow.js`

---

## **STEP 8: Check "Your Wardrobe" Page**

1. Go to **Your Wardrobe** page
2. You should see your jeans item
3. Check the category badge shows "bottoms"

**❌ If not showing:**
- Refresh the page
- Check browser console for fetch errors
- Check if you're logged in

---

## **Common Issues & Solutions:**

### **Issue 1: "Add to Wardrobe" button not appearing**
**Solution:** Click "Analyze Using AI" first!

### **Issue 2: Upload fails with 500 error**
**Solution:** 
- Check if `uploads` folder exists in Backend
- Check file permissions
- Check multer configuration

### **Issue 3: Items show in console but not in database**
**Solution:**
- Check MongoDB connection string in `.env`
- Check if MongoDB is running
- Check user ID is correct

### **Issue 4: Items save but don't show in wardrobe**
**Solution:**
- Check if you're logged in
- Check user ID matches
- Refresh the page
- Check browser console for errors

### **Issue 5: Detection shows wrong category**
**Solution:**
- Name your file properly: `blue-jeans.jpg`
- Check `complete-upload.js` detection logic
- File name should include type (jeans, shirt, shoes)

---

## **Quick Test Commands:**

### **Test 1: Check Database**
```bash
cd Backend
node debug-recommendations.js
```

### **Test 2: Add Sample Items**
```bash
cd Backend
node add-sample-items.js
```

### **Test 3: Test Direct Save**
```bash
cd Backend
node test-full-upload-flow.js
```

### **Test 4: Test API Endpoints**
```bash
cd Backend
node test-api-endpoints.js
```

---

## **Expected Full Flow:**

1. ✅ User uploads image → File saves to `/uploads/`
2. ✅ Backend detects type → Returns detection + imageUrl
3. ✅ Frontend shows AI results
4. ✅ User clicks "Add to Wardrobe"
5. ✅ Frontend sends data to `/api/wardrobe/add-to-wardrobe`
6. ✅ Backend saves to MongoDB
7. ✅ Item appears in "Your Wardrobe"
8. ✅ Recommendations can now use the item

---

## **Debug Checklist:**

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Browser console open
- [ ] File named properly (e.g., `blue-jeans.jpg`)
- [ ] Clicked "Analyze Using AI"
- [ ] Saw success message in console
- [ ] Clicked "Add to Wardrobe"
- [ ] Saw success alert
- [ ] Checked backend console logs
- [ ] Verified in database with debug script
- [ ] Checked "Your Wardrobe" page

---

## **Still Not Working?**

### **Run Full Diagnostic:**

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Test
cd Backend
node debug-recommendations.js

# Terminal 3 - Frontend
cd Frontend
npm run dev
```

Then:
1. Open browser console (F12)
2. Upload a file named `blue-jeans.jpg`
3. Watch BOTH browser console AND backend terminal
4. Copy all logs and check against this guide

---

**Last Updated:** ${new Date().toLocaleDateString('en-IN')}
