/* Galaxy Enterprises logo → transparent marks.
   The client's file (scripts/source/galaxy-logo.png) is gold line
   art on a dark grey gradient, which cannot sit on this site's light ground.
   The ground is neutral grey (R≈G≈B) and the art is saturated gold, so
   R − B separates them cleanly: it becomes the alpha, and each variant is
   filled with one flat colour from the site's gold scale.
   Run: node scripts/company-logo.mjs */
import sharp from 'sharp';

const SRC = 'scripts/source/galaxy-logo.png';
const OUT = 'public/images/company';

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

const alpha = Buffer.alloc(width * height);
for (let i = 0; i < width * height; i++) {
  const r = data[i * 3], b = data[i * 3 + 2];
  const a = Math.max(0, Math.min(1, (r - b - 18) / 110));
  alpha[i] = Math.round(a * 255);
}

const VARIANTS = {
  'galaxy-gold': [180, 139, 62], // gold-600, for light grounds
  'galaxy-light': [223, 194, 134], // gold-300, for dark grounds
};

for (const [name, [r, g, b]] of Object.entries(VARIANTS)) {
  const px = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    px[i * 4] = r; px[i * 4 + 1] = g; px[i * 4 + 2] = b; px[i * 4 + 3] = alpha[i];
  }
  const img = sharp(px, { raw: { width, height, channels: 4 } }).trim({ threshold: 1 });
  const buf = await img.png().toBuffer();
  const meta = await sharp(buf).metadata();
  await sharp(buf).png({ compressionLevel: 9 }).toFile(`${OUT}/${name}.png`);
  await sharp(buf).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/${name}.webp`);
  console.log(name, meta.width, meta.height);
}
