const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const targetUrl = process.argv[2] || "http://localhost:3000";
const destFile = process.argv[3] || path.join(__dirname, "..", "preview.png");
const width = process.argv[4] || "1280";
const height = process.argv[5] || "900";

const tempFile = path.join("C:\\Users\\lenovo\\AppData\\Local\\Temp", `shot_${Date.now()}.png`);

const args = [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--window-size=${width},${height}`,
  `--screenshot=${tempFile}`,
  targetUrl,
];

console.log("Running Edge screenshot to:", tempFile);
const res = spawnSync(edgePath, args, { timeout: 25000, encoding: "utf8" });
console.log("Edge exit status:", res.status);
if (res.stderr) console.log("Stderr:", res.stderr);

if (fs.existsSync(tempFile)) {
  const stats = fs.statSync(tempFile);
  console.log(`Temp file created (${stats.size} bytes). Copying to ${destFile}...`);
  fs.copyFileSync(tempFile, destFile);
  try { fs.unlinkSync(tempFile); } catch {}
  console.log(`SUCCESS: Screenshot saved to ${destFile}`);
  process.exit(0);
} else {
  console.error("FAILED: Temp file was not created.");
  process.exit(1);
}
