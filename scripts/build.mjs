// Bundles src/ups-card.js into the single file dist/ups-card.js, inlining the integration logos (Network UPS Tools,
// APC UPS Daemon) so the card needs no extra resource.
// Usage: node scripts/build.mjs  (dist/ is not committed: CI and the release workflow build it)
import { mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { splitDist } from "./i18n-split.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
const dataUri = (file) =>
  `data:${file.endsWith(".svg") ? "image/svg+xml" : "image/png"};base64,${readFileSync(`${root}images/${file}`).toString("base64")}`;

const out = readFileSync(`${root}src/ups-card.js`, "utf8")
  .replace("__VERSION__", pkg.version)
  .replace("__IMG_NUT__", dataUri("nut.png"))
  .replace("__IMG_APC__", dataUri("apcupsd.png"));

mkdirSync(`${root}dist`, { recursive: true });
writeFileSync(`${root}dist/ups-card.js`, out);
console.log(`Built dist/ups-card.js (${(out.length / 1024).toFixed(1)} KB)`);

// Translations: English stays in the bundle, each other language goes to dist/ups-card.i18n.<lang>.js,
// fetched when a card needs it (scripts/i18n-split.mjs).
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) splitDist(`${root}dist`, "ups-card.js", { version: pkg.version });
