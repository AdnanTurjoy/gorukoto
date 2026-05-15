import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1200, H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0b3420"/>
      <stop offset="50%"  stop-color="#0f4a2a"/>
      <stop offset="100%" stop-color="#0c3a22"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
    </linearGradient>
    <pattern id="diamond" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M26 2 L50 26 L26 50 L2 26 Z" fill="none" stroke="#d4a817" stroke-width="1" opacity="0.13"/>
      <circle cx="26" cy="26" r="2" fill="#d4a817" opacity="0.1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#diamond)"/>

  <!-- Top-right glow orb -->
  <ellipse cx="${W}" cy="0" rx="340" ry="280" fill="url(#glow)"/>

  <!-- Bottom-left green orb -->
  <ellipse cx="80" cy="${H}" rx="240" ry="180" fill="#22c55e" opacity="0.08"/>

  <!-- Amber accent bar at top -->
  <rect x="60" y="52" width="80" height="4" rx="2" fill="#fbbf24" opacity="0.7"/>

  <!-- GoruKoi Latin text -->
  <text x="60" y="120" font-family="Georgia, serif" font-size="52" font-weight="900"
        letter-spacing="-1" fill="white" opacity="0.95">GoruKoi</text>

  <!-- Divider dot -->
  <circle cx="64" cy="160" r="4" fill="#fbbf24" opacity="0.8"/>
  <circle cx="80" cy="160" r="4" fill="#fbbf24" opacity="0.55"/>
  <circle cx="96" cy="160" r="4" fill="#fbbf24" opacity="0.3"/>

  <!-- Tagline line 1 -->
  <text x="60" y="235" font-family="Georgia, 'Noto Serif', serif" font-size="38" font-weight="700"
        fill="white" opacity="0.92">Bangladesh Cattle Market Finder</text>

  <!-- Tagline line 2 -->
  <text x="60" y="295" font-family="Georgia, serif" font-size="26" font-weight="400"
        fill="white" opacity="0.55">Live prices · Crowd levels · Community reviews</text>

  <!-- Large decorative circle right side -->
  <circle cx="960" cy="315" r="190" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.15"/>
  <circle cx="960" cy="315" r="130" fill="#ffffff" opacity="0.03"/>

  <!-- Rotating dashed ring effect (static approximation) -->
  <circle cx="960" cy="315" r="160" fill="none" stroke="#fbbf24" stroke-width="1"
          stroke-dasharray="12 8" opacity="0.2"/>

  <!-- COW symbol inside circle -->
  <text x="960" y="340" text-anchor="middle" font-family="serif" font-size="100"
        fill="#fbbf24" opacity="0.65">&#x1F402;</text>

  <!-- Bottom bar -->
  <rect x="0" y="${H - 72}" width="${W}" height="72" fill="#000000" opacity="0.25"/>

  <!-- URL pill -->
  <rect x="52" y="${H - 54}" width="260" height="36" rx="18"
        fill="#fbbf24" opacity="0.15"/>
  <text x="182" y="${H - 30}" text-anchor="middle" font-family="Georgia, monospace"
        font-size="18" font-weight="600" fill="#fbbf24" opacity="0.9">gorukoi.vercel.app</text>

  <!-- Eid badge -->
  <rect x="${W - 290}" y="${H - 54}" width="238" height="36" rx="18"
        fill="#ffffff" opacity="0.08"/>
  <text x="${W - 171}" y="${H - 30}" text-anchor="middle" font-family="Georgia, serif"
        font-size="17" fill="white" opacity="0.7">Eid-ul-Adha 2026</text>
</svg>
`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: { loadSystemFonts: true },
});

const png = resvg.render().asPng();
const out = join(__dirname, '../public/og-image.png');
writeFileSync(out, png);
console.log(`✓ og-image.png written (${png.byteLength} bytes)`);
