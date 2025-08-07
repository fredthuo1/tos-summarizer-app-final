// Node.js script to generate PNG icons from SVG
// Run with: node icon-generator.js

const fs = require('fs');
const path = require('path');

// SVG content for the icon
const svgContent = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="white" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Shield shape -->
  <path d="M64 20L32 32v24c0 20 32 32 32 32s32-12 32-32V32L64 20z" 
        fill="url(#gradient)" 
        stroke="white" 
        stroke-width="2"/>
  
  <!-- Checkmark -->
  <path d="M52 64l6 6 16-16" 
        stroke="white" 
        stroke-width="4" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
  
  <!-- Small "T" for Terms -->
  <text x="64" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2563eb">T</text>
</svg>
`;

// Icon sizes needed for Chrome extension
const iconSizes = [
  { size: 16, filename: 'icon16.png' },
  { size: 32, filename: 'icon32.png' },
  { size: 48, filename: 'icon48.png' },
  { size: 128, filename: 'icon128.png' }
];

console.log('🎨 Terms Analyzer Extension Icon Generator');
console.log('==========================================');

// Check if we're in a Node.js environment with required packages
try {
  // This would require additional packages like 'sharp' or 'canvas'
  // For now, we'll create the SVG files and provide instructions
  
  console.log('📝 Creating SVG source files...');
  
  // Create base SVG file
  fs.writeFileSync(path.join(__dirname, 'icon-source.svg'), svgContent.trim());
  console.log('✅ Created icon-source.svg');
  
  // Create size-specific SVG files
  iconSizes.forEach(({ size, filename }) => {
    const sizedSvg = svgContent
      .replace(/width="128"/g, `width="${size}"`)
      .replace(/height="128"/g, `height="${size}"`)
      .replace(/viewBox="0 0 128 128"/g, `viewBox="0 0 ${size} ${size}"`);
    
    const svgFilename = filename.replace('.png', '.svg');
    fs.writeFileSync(path.join(__dirname, svgFilename), sizedSvg.trim());
    console.log(`✅ Created ${svgFilename}`);
  });
  
  console.log('\n📋 Next Steps:');
  console.log('1. Open the generate-icons.html file in your browser');
  console.log('2. Click "Generate All Icons" to create PNG files');
  console.log('3. Download each PNG file using the download buttons');
  console.log('4. Save them in the extension/icons/ directory');
  console.log('\nAlternatively, use an online SVG to PNG converter:');
  console.log('- https://cloudconvert.com/svg-to-png');
  console.log('- https://convertio.co/svg-png/');
  console.log('- https://www.freeconvert.com/svg-to-png');
  
} catch (error) {
  console.error('❌ Error generating icons:', error.message);
  console.log('\n💡 To generate PNG files automatically, install required packages:');
  console.log('npm install sharp canvas');
}