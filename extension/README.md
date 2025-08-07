# Terms Analyzer Browser Extension

A browser extension that automatically analyzes terms of service and privacy policies on websites you visit, providing instant risk assessments and insights.

## Features

- **Automatic Detection**: Automatically finds terms of service, privacy policy, and cookie policy links on websites
- **AI-Powered Analysis**: Uses the Terms Analyzer API to provide comprehensive risk assessments
- **Real-time Notifications**: Shows non-intrusive notifications for high-risk websites
- **Detailed Popup**: Click the extension icon for detailed analysis results
- **Caching**: Caches analysis results for 24 hours to improve performance
- **Risk Indicators**: Visual risk level indicators (Low, Medium, High)
- **Quick Access**: Floating action button for easy access to analysis

## Installation

### Development Installation

1. **Clone or download** the extension files to a local directory
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer mode** (toggle in the top right)
4. **Click "Load unpacked"** and select the extension directory
5. **Pin the extension** to your toolbar for easy access

### Production Installation

1. **Package the extension** into a .crx file
2. **Upload to Chrome Web Store** (requires developer account)
3. **Install from Chrome Web Store** once approved

## Configuration

### API Endpoint

The extension is configured to use your Terms Analyzer API:

- **Development**: `http://localhost:3000`
- **Production**: Update `API_BASE_URL` in `background.js` and `popup.js`

### Environment Variables

Make sure your Terms Analyzer API has the required environment variables:

```env
TOGETHER_API_KEY=your_together_ai_api_key
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## How It Works

### 1. Automatic Detection

When you visit a website, the extension:
- Scans the page for terms of service and privacy policy links
- Uses common selectors and text patterns to find relevant documents
- Categorizes found links (terms, privacy, cookie, legal)

### 2. Analysis Process

For each found document:
- Sends the URL to your Terms Analyzer API
- Receives comprehensive risk assessment
- Caches results for 24 hours
- Updates extension badge with risk level

### 3. User Interface

**Notifications**: 
- Appear for medium/high risk websites
- Show key concerns and risk level
- Auto-dismiss after 10 seconds
- Can be manually dismissed

**Popup Interface**:
- Click extension icon for detailed view
- Shows website info and risk assessment
- Lists found documents
- Displays key concerns and positive aspects
- Links to full analysis on main website

**Floating Button**:
- Appears on websites after 2 seconds
- Provides quick access to analysis
- Unobtrusive design

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── content.js            # Content script for page interaction
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16, 32, 48, 128px)
└── README.md             # This file
```

## Permissions

The extension requires these permissions:

- **activeTab**: Access current tab for analysis
- **storage**: Cache analysis results
- **scripting**: Inject content scripts
- **background**: Run background service worker
- **host_permissions**: Access your API and all websites

## Privacy

- **No Data Collection**: Extension doesn't collect personal data
- **Local Storage**: Analysis results cached locally only
- **API Communication**: Only sends URLs to your own API
- **No Tracking**: No analytics or tracking in extension

## Development

### Testing

1. **Load extension** in developer mode
2. **Visit test websites** with known terms/privacy policies
3. **Check console** for debugging information
4. **Test popup** functionality
5. **Verify notifications** appear correctly

### Debugging

- **Background Script**: Check `chrome://extensions/` → Extension Details → Service Worker
- **Content Script**: Use browser developer tools on any webpage
- **Popup**: Right-click extension icon → Inspect popup

### Customization

**Styling**: Modify `popup.css` and inline styles in `content.js`
**Detection**: Update selectors and patterns in `findTermsAndPrivacyLinks()`
**API Integration**: Modify API calls in `background.js`
**Notifications**: Customize notification appearance in `content.js`

## Deployment

### Chrome Web Store

1. **Create developer account** ($5 fee)
2. **Package extension** as .zip file
3. **Upload to Chrome Web Store**
4. **Fill out store listing** (description, screenshots, etc.)
5. **Submit for review** (typically 1-3 days)

### Enterprise Deployment

1. **Package as .crx file**
2. **Host on internal server**
3. **Deploy via Group Policy** or MDM
4. **Configure enterprise policies** if needed

## Support

For issues or questions:

1. **Check browser console** for error messages
2. **Verify API connectivity** to your Terms Analyzer service
3. **Test with known working websites**
4. **Check extension permissions** are granted

## Updates

To update the extension:

1. **Modify version** in `manifest.json`
2. **Test changes** thoroughly
3. **Package new version**
4. **Upload to Chrome Web Store** (if published)
5. **Users receive automatic updates**

## License

This extension is part of the Terms Analyzer project and follows the same licensing terms.