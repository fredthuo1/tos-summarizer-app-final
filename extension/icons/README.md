# Extension Icons

This directory should contain the extension icons in the following sizes:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon32.png` - 32x32 pixels (Windows)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Icon Requirements

- **Format**: PNG with transparency
- **Design**: Should match your Terms Analyzer branding
- **Colors**: Use your brand colors (blue/purple gradient)
- **Symbol**: Shield icon to represent security/protection
- **Background**: Transparent or solid color

## Creating Icons

You can create these icons using:

1. **Design Tools**: Figma, Sketch, Adobe Illustrator
2. **Online Tools**: Canva, Favicon.io
3. **AI Tools**: Generate with DALL-E, Midjourney
4. **Icon Libraries**: Heroicons, Lucide, Feather

## Recommended Design

```
Shield icon with:
- Blue to purple gradient (#2563eb to #7c3aed)
- White or light accent
- Clean, minimal design
- Good contrast for small sizes
```

## Example SVG (convert to PNG)

```svg
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <path d="M64 118s42.67-21.33 42.67-53.33V32L64 16 21.33 32v32.67C21.33 96.67 64 118 64 118z" 
        fill="url(#gradient)" 
        stroke="white" 
        stroke-width="2"/>
  <path d="M54.67 64L58.67 68L73.33 53.33" 
        stroke="white" 
        stroke-width="4" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
</svg>
```

Once you have the icons, place them in this directory with the correct filenames.