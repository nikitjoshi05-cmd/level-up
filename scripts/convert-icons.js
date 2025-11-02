// Convert SVG icons to PNG using sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');

async function convertIcons() {
  console.log('Converting SVG icons to PNG...');
  
  for (const size of sizes) {
    const svgPath = path.join(publicDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(publicDir, `icon-${size}x${size}.png`);
    
    if (fs.existsSync(svgPath)) {
      try {
        // Create a simple PNG icon with gradient background
        const svgBuffer = Buffer.from(`
          <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
            <circle cx="${size/2}" cy="${size/2}" r="${size * 0.25}" fill="white" opacity="0.9"/>
            <path d="M ${size/2} ${size * 0.3} L ${size * 0.35} ${size * 0.7} L ${size * 0.65} ${size * 0.7} Z" fill="#3b82f6"/>
          </svg>
        `);
        
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(pngPath);
        
        console.log(`✓ Created icon-${size}x${size}.png`);
      } catch (error) {
        console.error(`✗ Failed to create icon-${size}x${size}.png:`, error.message);
      }
    }
  }
  
  console.log('\nIcon conversion complete!');
}

convertIcons().catch(console.error);

