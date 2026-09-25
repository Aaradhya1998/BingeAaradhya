const puppeteer = require("puppeteer-core");
const path = require("path");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  const url = process.argv[2] || "http://localhost:3000";
  const outputPath = process.argv[3] || path.join(__dirname, "..", "preview.png");
  const width = parseInt(process.argv[4] || "1280", 10);
  const height = parseInt(process.argv[5] || "900", 10);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 35000 });
    // Small delay to ensure animations and images are settled
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Screenshot successfully captured to ${outputPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
