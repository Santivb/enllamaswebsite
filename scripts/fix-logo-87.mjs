import sharp from "sharp";
import path from "node:path";

const scratch =
  "C:/Users/santi/AppData/Local/Temp/claude/C--Users-santi-claude/e816a134-f8ca-45cf-9e62-233e98364a64/scratchpad/logo";
const root = path.resolve(import.meta.dirname, "..");

// The AI background-remover silently dropped the "87" numeral (it's spatially
// detached from the main badge silhouette). We patch it back in locally from
// the original opaque generation, using a plain white-background threshold to
// key just that small region — cheap and safe since ring/ribbon pixels that
// overlap the crop are identical to what's already in the base, so redrawing
// them is a visual no-op.
const SOURCE = path.join(scratch, "candidate1.png"); // opaque 1024x1024, has 87
const BASE = path.join(scratch, "first_bg_removed.png"); // correct alpha, missing 87
const OUT = path.join(root, "public/assets/logo/en-llamas-87-master-1024.png");

const CROP = { left: 665, top: 425, width: 230, height: 185 };

async function main() {
  const { data, info } = await sharp(SOURCE)
    .extract(CROP)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // distance from pure white; feather over a small band for anti-aliased edges
    const dist = 255 - Math.min(r, g, b);
    let alpha = Math.max(0, Math.min(255, Math.round((dist - 10) * 8)));
    if (alpha < 45) alpha = 0; // drop faint near-white edge fringe entirely
    data[idx + 3] = alpha;

    // Un-premultiply against the known white background so partially
    // transparent edge pixels don't carry a whitish halo into the composite.
    if (alpha > 0 && alpha < 255) {
      const a = alpha / 255;
      data[idx] = Math.max(0, Math.min(255, Math.round((r - (1 - a) * 255) / a)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - a) * 255) / a)));
      data[idx + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - a) * 255) / a)));
    }
  }

  const sprite = sharp(data, { raw: { width, height, channels } }).png();
  const spriteBuffer = await sprite.toBuffer();

  await sharp(BASE)
    .composite([{ input: spriteBuffer, left: CROP.left, top: CROP.top }])
    .png()
    .toFile(OUT);

  console.log("wrote", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
