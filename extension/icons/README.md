# Extension Icons

This directory contains the extension icons in the following sizes:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon32.png` - 32x32 pixels (Windows)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## 🎨 Generated Icons

The icons have been created with the following design:
- **Shield symbol** representing security and protection
- **Blue to purple gradient** (#2563eb to #7c3aed) matching the brand
- **White checkmark** indicating verification and trust
- **Clean, modern design** optimized for all sizes
- **White background circle** for better visibility on dark backgrounds

## 📁 Files Included

- `icon.svg` - Main SVG source file (128x128)
- `icon-simple.svg` - Simplified version without text
- `generate-icons.html` - Browser-based PNG generator
- `icon-generator.js` - Node.js script for batch generation
- Size-specific SVG files for each required dimension

## 🚀 Quick Generation

### Method 1: Browser Generator (Recommended)
1. Open `generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download each PNG file
4. Save with correct filenames in this directory

### Method 2: Online Converter
1. Use the SVG files with online converters:
   - [CloudConvert](https://cloudconvert.com/svg-to-png)
   - [Convertio](https://convertio.co/svg-png/)
   - [FreeConvert](https://www.freeconvert.com/svg-to-png)
2. Upload each size-specific SVG
3. Download as PNG with correct dimensions

### Method 3: Design Tools
1. Open SVG files in design tools (Figma, Sketch, Illustrator)
2. Export as PNG at required sizes
3. Ensure proper anti-aliasing for smaller sizes

## Icon Requirements

- **Format**: PNG with transparency
- **Design**: Matches Terms Analyzer branding
- **Colors**: Blue/purple gradient (#2563eb to #7c3aed)
- **Symbol**: Shield with checkmark for security/verification
- **Background**: White circle for visibility
- **Optimization**: Crisp rendering at all sizes

## 🔧 Technical Specifications

### Size Requirements:
- **16x16**: Toolbar icon (must be crisp and recognizable)
- **32x32**: Windows taskbar and notifications
- **48x48**: Extension management page
- **128x128**: Chrome Web Store listing and high-DPI displays

### Design Considerations:
- **Scalability**: Design works well from 16px to 128px
- **Contrast**: High contrast for visibility on various backgrounds
- **Simplicity**: Clean design that's recognizable at small sizes
- **Brand Consistency**: Matches the main application's visual identity

## 🎯 Brand Alignment

The icons align with the Terms Analyzer brand:
- **Shield**: Represents protection and security analysis
- **Checkmark**: Indicates verification and trust
- **Gradient**: Matches the main application's color scheme
- **Typography**: "T" symbol for "Terms" on larger icons

## 📱 Usage in Extension

Once generated, the icons will be used for:
- **Toolbar**: 16x16 icon in browser toolbar
- **Badge Overlay**: Risk level indicators (LOW/MED/HIGH)
- **Popup**: 48x48 icon in extension popup header
- **Store Listing**: 128x128 icon for Chrome Web Store
- **Notifications**: Various sizes for system notifications

## ✅ Verification

After generating the icons:
1. Verify all 4 PNG files are created with correct dimensions
2. Check that icons look crisp at all sizes
3. Test in Chrome extension developer mode
4. Ensure proper transparency and no artifacts

The extension will automatically detect and use these icons once they're properly named and placed in this directory.