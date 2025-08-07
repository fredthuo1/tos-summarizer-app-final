# Testing the Terms Analyzer Browser Extension

## 🚀 Quick Start Testing

### Step 1: Generate Icons (Required)
1. Visit: `http://localhost:3000/extension/generate-icons.html`
2. Click "Generate All Icons"
3. Download all 4 PNG files:
   - `icon16.png`
   - `icon32.png` 
   - `icon48.png`
   - `icon128.png`
4. Save them in the `extension/icons/` folder

### Step 2: Load Extension in Chrome
1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension/` folder from your project
6. Extension should appear in the list

### Step 3: Pin Extension to Toolbar
1. Click the puzzle piece icon in Chrome toolbar
2. Find "Terms Analyzer Extension"
3. Click the pin icon to pin it to toolbar
4. You should see the extension icon appear

## 🧪 Testing Scenarios

### Test 1: High Risk Website
1. Visit: `https://facebook.com/legal/terms`
2. Wait 2-3 seconds for analysis
3. **Expected**: Red "HIGH" badge on extension icon
4. **Expected**: Notification popup with risk warning
5. Click extension icon to see detailed analysis

### Test 2: Medium Risk Website  
1. Visit: `https://amazon.com/gp/help/customer/display.html`
2. Wait for analysis
3. **Expected**: Yellow "MED" badge on extension icon
4. **Expected**: Moderate risk notification
5. Check popup for category breakdown

### Test 3: Low Risk Website
1. Visit: `https://signal.org/legal/`
2. Wait for analysis
3. **Expected**: Green "LOW" badge on extension icon
4. **Expected**: Minimal or no notification
5. Popup should show positive aspects

### Test 4: No Terms Found
1. Visit: `https://example.com`
2. **Expected**: Gray "?" badge
3. **Expected**: No notification
4. Popup shows "No terms found" message

## 🔍 Debugging

### Check Console Logs
1. **Background Script**: 
   - Go to `chrome://extensions/`
   - Click "Service Worker" under your extension
   - Check console for logs

2. **Content Script**:
   - Open developer tools on any webpage (F12)
   - Check console for extension messages

3. **Popup Script**:
   - Right-click extension icon → "Inspect popup"
   - Check console in popup developer tools

### Common Issues & Solutions

**❌ Extension not loading:**
- Ensure all files are in correct locations
- Check manifest.json syntax
- Verify icons are generated and saved

**❌ No analysis happening:**
- Check if your Terms Analyzer API is running on port 3000
- Verify TOGETHER_API_KEY is set in your environment
- Check browser console for network errors

**❌ Icons not showing:**
- Generate PNG icons using the generator page
- Ensure exact filenames: icon16.png, icon32.png, etc.
- Reload extension after adding icons

**❌ Notifications not appearing:**
- Check if website has detectable terms/privacy links
- Look for console errors in content script
- Verify notification permissions

## 📊 Test Results Checklist

- [ ] Extension loads without errors
- [ ] Icons display correctly in toolbar
- [ ] Automatic detection finds terms/privacy links
- [ ] Risk badges appear on extension icon
- [ ] Notifications show for high/medium risk sites
- [ ] Popup displays detailed analysis
- [ ] "View Full Analysis" button opens main app
- [ ] Cache works (second visit shows cached results)
- [ ] Floating action button appears on pages

## 🌐 Test Websites

### High Risk (Should show RED badge):
- facebook.com/legal/terms
- twitter.com/tos
- instagram.com/terms

### Medium Risk (Should show YELLOW badge):
- amazon.com (terms page)
- google.com/policies/terms
- microsoft.com/servicesagreement

### Low Risk (Should show GREEN badge):
- signal.org/legal
- apple.com/legal
- mozilla.org/about/legal

### No Terms (Should show GRAY badge):
- example.com
- httpbin.org
- jsonplaceholder.typicode.com

## 🔧 Development Tips

1. **Reload Extension**: After code changes, click reload button in chrome://extensions/
2. **Clear Cache**: Use "Clear storage" in extension details for fresh testing
3. **Network Tab**: Monitor API calls in browser developer tools
4. **Permissions**: Ensure extension has access to all websites

## 📈 Performance Testing

- Test with slow internet connection
- Test with multiple tabs open
- Test cache behavior (visit same site twice)
- Test rate limiting (multiple requests quickly)
- Test with very long terms documents

## 🚨 Error Scenarios

- Test with invalid URLs
- Test with websites that block requests
- Test with API server down
- Test with malformed responses
- Test with network timeouts