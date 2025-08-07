# Extension Testing Checklist

## 🔧 Pre-Testing Setup

### Prerequisites
- [ ] Terms Analyzer API running on `http://localhost:3000`
- [ ] `TOGETHER_API_KEY` environment variable set
- [ ] Chrome browser with developer mode enabled
- [ ] Extension icons generated (PNG files)

### Icon Generation
- [ ] Visit `http://localhost:3000/extension/generate-icons.html`
- [ ] Click "Generate All Icons" 
- [ ] Download all 4 PNG files:
  - [ ] `icon16.png` (16×16)
  - [ ] `icon32.png` (32×32) 
  - [ ] `icon48.png` (48×48)
  - [ ] `icon128.png` (128×128)
- [ ] Save files in `extension/icons/` directory

## 📦 Extension Installation

### Load Extension
- [ ] Open Chrome and go to `chrome://extensions/`
- [ ] Enable "Developer mode" toggle (top right)
- [ ] Click "Load unpacked" button
- [ ] Select the `extension/` folder
- [ ] Extension appears in list without errors
- [ ] Pin extension to toolbar (puzzle piece → pin icon)

### Verify Installation
- [ ] Extension icon visible in toolbar
- [ ] No error messages in extension list
- [ ] Extension badge shows correctly
- [ ] Popup opens when clicking icon

## 🧪 Functional Testing

### Automatic Detection
- [ ] Visit test websites (see test-sites.json)
- [ ] Extension detects terms/privacy links automatically
- [ ] Background analysis starts within 2-3 seconds
- [ ] Console shows detection messages

### Risk Assessment
- [ ] **High Risk Sites**: Red "HIGH" badge appears
- [ ] **Medium Risk Sites**: Yellow "MED" badge appears  
- [ ] **Low Risk Sites**: Green "LOW" badge appears
- [ ] **No Terms Sites**: Gray "?" badge appears

### Notifications
- [ ] High risk sites show notification popup
- [ ] Medium risk sites show notification popup
- [ ] Low risk sites show minimal/no notification
- [ ] Notifications auto-dismiss after 10 seconds
- [ ] Manual dismiss button works
- [ ] "View Full Analysis" opens main app

### Popup Interface
- [ ] Click extension icon opens popup
- [ ] Website info displays correctly
- [ ] Risk assessment shows proper colors
- [ ] Found links section populates
- [ ] Key concerns display (if any)
- [ ] Positive aspects display (if any)
- [ ] "Refresh" button triggers new analysis
- [ ] "Full Analysis" opens main website

### Caching System
- [ ] First visit triggers fresh analysis
- [ ] Second visit shows "(CACHED)" indicator
- [ ] Cache persists for 24 hours
- [ ] Refresh button bypasses cache
- [ ] Cache clears after 24 hours

## 🌐 Website Testing

### High Risk Websites
Test these sites for HIGH risk detection:
- [ ] `facebook.com/legal/terms` → Should show 70-85 score
- [ ] `twitter.com/tos` → Should show 75-90 score
- [ ] `instagram.com/terms` → Should show 70-85 score

### Medium Risk Websites  
Test these sites for MEDIUM risk detection:
- [ ] `amazon.com` (terms page) → Should show 40-60 score
- [ ] `google.com/policies/terms/` → Should show 45-65 score
- [ ] `microsoft.com/servicesagreement/` → Should show 40-60 score

### Low Risk Websites
Test these sites for LOW risk detection:
- [ ] `signal.org/legal/` → Should show 15-30 score
- [ ] `apple.com/legal/` → Should show 20-35 score
- [ ] `mozilla.org/legal/` → Should show 15-30 score

### Edge Cases
- [ ] `example.com` → No terms found
- [ ] `localhost:3000` → Should not analyze own site
- [ ] Invalid URLs → Graceful error handling
- [ ] Very slow websites → Timeout handling

## 🐛 Debugging Checklist

### Console Logs
- [ ] **Background Script**: Check service worker console
  - Go to `chrome://extensions/` → Extension Details → Service Worker
- [ ] **Content Script**: Check webpage console (F12)
- [ ] **Popup Script**: Right-click extension icon → Inspect popup

### Network Requests
- [ ] API calls to `localhost:3000/api/analyze` succeed
- [ ] Proper request headers and body
- [ ] Response parsing works correctly
- [ ] Error responses handled gracefully

### Performance
- [ ] Extension doesn't slow down browsing
- [ ] Memory usage remains reasonable
- [ ] No memory leaks after extended use
- [ ] API rate limiting works (10 requests/hour per domain)

## 🔒 Security Testing

### Permissions
- [ ] Extension only requests necessary permissions
- [ ] No access to sensitive browser data
- [ ] Secure communication with API
- [ ] No data leakage to third parties

### Privacy
- [ ] No personal browsing data collected
- [ ] Only analyzes public legal documents
- [ ] Local caching only (no server storage)
- [ ] Proper data cleanup

## 📱 Cross-Browser Testing

### Chrome/Chromium
- [ ] Extension loads correctly
- [ ] All features work as expected
- [ ] Performance is acceptable
- [ ] No compatibility issues

### Edge (Chromium-based)
- [ ] Extension works with minimal changes
- [ ] Manifest v3 compatibility
- [ ] Feature parity with Chrome

## 🚨 Error Scenarios

### API Failures
- [ ] API server down → Shows error message
- [ ] Invalid API key → Graceful fallback
- [ ] Network timeout → Retry mechanism
- [ ] Rate limit exceeded → Proper error message

### Website Issues
- [ ] CORS blocked requests → Fallback handling
- [ ] Malformed HTML → Parser doesn't crash
- [ ] No terms links found → Appropriate message
- [ ] Very large documents → Chunking works

## ✅ Success Criteria

The extension passes testing when:
- [ ] Loads without errors in Chrome
- [ ] Automatically detects terms on 80%+ of test sites
- [ ] Risk assessment accuracy matches web app
- [ ] Notifications appear for appropriate risk levels
- [ ] Popup provides useful information
- [ ] Performance impact is minimal
- [ ] No privacy or security concerns
- [ ] Ready for Chrome Web Store submission

## 🎯 Next Steps After Testing

1. **Fix Issues**: Address any bugs found during testing
2. **Optimize Performance**: Improve speed and memory usage
3. **User Testing**: Get feedback from real users
4. **Chrome Web Store**: Prepare for publication
5. **Documentation**: Update user guides and help content

## 📞 Support During Testing

If you encounter issues:
1. Check console logs in all three contexts (background, content, popup)
2. Verify API connectivity and environment variables
3. Test with known working websites first
4. Use the test sites provided in test-sites.json
5. Check network tab for failed requests

Remember: The extension integrates with your existing Terms Analyzer API, so make sure your main application is running and properly configured before testing the extension.