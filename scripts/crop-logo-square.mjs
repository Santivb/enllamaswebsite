import sharp from "sharp";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public/assets/logo/en-llamas-87-master.png");

async function main() {
  const { data, info } = await sharp(src)
    .extractChannel("alpha")
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[y * w + x] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const contentW = maxX - minX;
  const contentH = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const size = Math.max(contentW, contentH) + 40; // small breathing margin
  let left = Math.round(cx - size / 2);
  let top = Math.round(cy - size / 2);
  left = Math.max(0, Math.min(w - size, left));
  top = Math.max(0, Math.min(h - size, top));

  console.log("content bbox", minX, maxX, minY, maxY);
  console.log("square crop", { left, top, size });

  const tmp = src + ".tmp.png";
  await sharp(src)
    .extract({ left, top, width: size, height: size })
    .png()
    .toFile(tmp);

  const { rename } = await import("node:fs/promises");
  await rename(tmp, src);
  console.log("wrote cropped master");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
