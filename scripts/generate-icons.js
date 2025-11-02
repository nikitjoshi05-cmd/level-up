// Simple script to generate PWA icons
// This creates SVG icons that can be converted to PNG
// You can also use online tools like https://realfavicongenerator.net/

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Create SVG icon
function createIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">⚡</text>
</svg>`;
}

// Note: This creates SVG icons. For PNG, use an online converter or image tool
console.log('Creating SVG icon templates...');

sizes.forEach(size => {
  const svg = createIcon(size);
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.svg`), svg);
});

console.log(`Created ${sizes.length} SVG icon templates in public/`);
console.log('\nNOTE: For production, convert these SVG files to PNG using:');
console.log('1. Online tool: https://cloudconvert.com/svg-to-png');
console.log('2. Or use a design tool to create proper app icons');
console.log('3. Recommended: Create icons with your app logo/design');

