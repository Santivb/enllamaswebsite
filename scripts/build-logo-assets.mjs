import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public/assets/logo/en-llamas-87-master.png");
const outDir = path.join(root, "public/assets/logo");

async function main() {
  await mkdir(outDir, { recursive: true });

  const sizes = [
    { name: "favicon-512.png", size: 512 },
    { name: "favicon-192.png", size: 192 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "logo-1024.png", size: 1024 },
    { name: "logo-512.png", size: 512 },
    { name: "logo-256.png", size: 256 },
    { name: "logo-128.png", size: 128 },
  ];

  for (const { name, size } of sizes) {
    await sharp(src)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outDir, name));
    console.log("wrote", name);
  }

  // 32x32 favicon.ico source (PNG, browsers accept PNG-as-.ico via <link> just fine,
  // but we also refresh the app icon PNG at small size for the tab).
  await sharp(src)
    .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "favicon-48.png"));
  console.log("wrote favicon-48.png");

  // Monochrome silhouettes: solid fill using the master's alpha channel as the mask.
  const alphaMask = await sharp(src).ensureAlpha().extractChannel("alpha").toBuffer();
  const { width, height } = await sharp(src).metadata();

  const monoVariants = [
    { name: "logo-mono-cream.png", color: { r: 242, g: 234, b: 217 } }, // for dark backgrounds
    { name: "logo-mono-espresso.png", color: { r: 46, g: 27, b: 18 } }, // for light backgrounds
  ];

  for (const { name, color } of monoVariants) {
    const solid = await sharp({
      create: { width, height, channels: 3, background: color },
    })
      .png()
      .toBuffer();

    await sharp(solid)
      .joinChannel(alphaMask)
      .png()
      .toFile(path.join(outDir, name));
    console.log("wrote", name);
  }

  // Minimal valid .ico wrapping a single 64x64 PNG (modern browsers support PNG-in-ICO).
  const icoPng = await sharp(src)
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(64, 0); // width
  entry.writeUInt8(64, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(icoPng.length, 8); // image data size
  entry.writeUInt32LE(22, 12); // offset (6 header + 16 entry)

  const ico = Buffer.concat([header, entry, icoPng]);
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.join(root, "src/app/favicon.ico"), ico);
  console.log("wrote src/app/favicon.ico");

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
