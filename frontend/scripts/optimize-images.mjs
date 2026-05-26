/**
 * Generates WebP (and optional JPEG fallback) from SVG sources in public/.
 * Run: npm run optimize-images
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const TARGETS = [
  {
    input: "og-image.svg",
    outputs: [
      { file: "og-image.webp", width: 1200, quality: 82 },
      { file: "og-image.jpg", width: 1200, quality: 85 },
    ],
  },
];

async function optimize({ input, outputs }) {
  const inputPath = join(publicDir, input);
  const buffer = await readFile(inputPath);

  for (const { file, width, quality } of outputs) {
    const pipeline = sharp(buffer).resize(width, null, { withoutEnlargement: true });

    const out =
      file.endsWith(".webp")
        ? await pipeline.webp({ quality }).toBuffer()
        : await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();

    const outPath = join(publicDir, file);
    await writeFile(outPath, out);
    const kb = (out.byteLength / 1024).toFixed(1);
    console.log(`  ✓ ${file} (${kb} KB)`);
  }
}

console.log("Optimizing images…\n");
for (const target of TARGETS) {
  console.log(`${target.input} →`);
  await optimize(target);
}
console.log("\nDone.");
