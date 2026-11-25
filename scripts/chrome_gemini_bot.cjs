#!/usr/bin/env node

/**
 * Autonomous Gemini Pro Image Generation Bot using Chrome DevTools Protocol & Puppeteer
 * Configured for Google Pro account (kalyanjit@gmail.com)
 *
 * Requirements:
 *   Start Google Chrome with remote debugging:
 *   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &
 *
 * Usage:
 *   node scripts/chrome_gemini_bot.cjs
 *   node scripts/chrome_gemini_bot.cjs --force
 *   node scripts/chrome_gemini_bot.cjs --port=9222
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BASE_DIR = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(BASE_DIR, 'scripts', 'image_prompts.json');
const ASSETS_DIR = path.join(BASE_DIR, 'public', 'assets');

const args = process.argv.slice(2);
let port = 9222;
let filterChapter = null;
let filterFilename = null;
let forceOverwrite = false;

args.forEach(arg => {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.replace('--port=', '').trim(), 10);
  } else if (arg.startsWith('--chapter=')) {
    filterChapter = parseInt(arg.replace('--chapter=', '').trim(), 10);
  } else if (arg.startsWith('--filename=')) {
    filterFilename = arg.replace('--filename=', '').trim();
  } else if (arg === '--force') {
    forceOverwrite = true;
  }
});

if (!fs.existsSync(PROMPTS_FILE)) {
  console.error(`❌ Error: Prompts file not found at ${PROMPTS_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const allPrompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
const allowedFiles = filterFilename ? filterFilename.split(',').map(s => s.trim()) : null;
const queue = allPrompts.filter(item => {
  if (allowedFiles && !allowedFiles.includes(item.filename)) return false;
  if (filterChapter !== null && item.chapter !== filterChapter) return false;
  const targetPath = path.join(ASSETS_DIR, item.filename);
  if (fs.existsSync(targetPath) && !forceOverwrite) {
    return false;
  }
  return true;
});

console.log('\n=============================================================');
console.log('🤖 CHROME GEMINI PRO AUTOMATION BOT (kalyanjit@gmail.com)');
console.log('=============================================================');
console.log(`🔌 Target Chrome Port      : ${port}`);
console.log(`📁 Target Assets Directory : ${ASSETS_DIR}`);
console.log(`📋 Total Prompts in Queue  : ${queue.length} of ${allPrompts.length}`);
console.log('=============================================================\n');

if (queue.length === 0) {
  console.log('✨ All 9 infographics already exist in public/assets/! Use --force to regenerate.\n');
  process.exit(0);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let browser;
  try {
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${port}`,
      defaultViewport: null
    });
    console.log('✅ Connected successfully to Google Chrome!');
  } catch (err) {
    console.error(`\n❌ Could not connect to Google Chrome on port ${port}.`);
    console.error(`\n👉 Start Chrome in debugging mode (logged in as kalyanjit@gmail.com):`);
    console.log(`   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=${port} &\n`);
    process.exit(1);
  }

  const pages = await browser.pages();
  let geminiPage = pages.find(p => p.url().includes('gemini.google.com'));

  if (!geminiPage) {
    geminiPage = await browser.newPage();
    await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
  } else {
    await geminiPage.bringToFront();
  }

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const targetFile = path.join(ASSETS_DIR, item.filename);
    console.log(`[${i + 1}/${queue.length}] 🎨 Generating ${item.filename}...`);

    try {
      await geminiPage.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });
      await sleep(2000);
      await geminiPage.waitForSelector('rich-textarea, div[contenteditable="true"], textarea', { timeout: 20000 }).catch(() => {});

      const existingImageUrls = await geminiPage.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(Boolean);
      });

      const promptFull = `Generate a high-quality 16:9 widescreen infographic image: ${item.prompt}`;
      await geminiPage.evaluate((text) => {
        const input = document.querySelector('rich-textarea p, rich-textarea div[contenteditable="true"], div[contenteditable="true"] p, div[contenteditable="true"], textarea');
        if (input) {
          input.focus();
          input.innerText = text;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, promptFull);

      await sleep(1000);
      const clicked = await geminiPage.evaluate(() => {
        const sendBtn = document.querySelector('button[aria-label="Send message"], button.send-button, mat-icon[data-mat-icon-name="send"]')?.closest('button');
        if (sendBtn && !sendBtn.disabled) {
          sendBtn.click();
          return true;
        }
        return false;
      });
      if (!clicked) await geminiPage.keyboard.press('Enter');

      let imageBuffer = null;
      let waitAttempts = 0;
      while (!imageBuffer && waitAttempts < 35) {
        await sleep(3000);
        waitAttempts++;
        const newImageData = await geminiPage.evaluate((existingUrls) => {
          const candidates = Array.from(document.querySelectorAll('img')).filter(img =>
            img.src && !existingUrls.includes(img.src) &&
            (img.src.includes('googleusercontent.com') || img.src.startsWith('blob:') || img.src.startsWith('data:image')) &&
            img.naturalWidth > 350
          );
          if (candidates.length > 0) {
            const latest = candidates[candidates.length - 1];
            return { src: latest.src, width: latest.naturalWidth, height: latest.naturalHeight };
          }
          return null;
        }, existingImageUrls);

        if (newImageData) {
          const base64Data = await geminiPage.evaluate((imgSrc) => {
            const img = Array.from(document.querySelectorAll('img')).find(i => i.src === imgSrc);
            if (!img || !img.complete || img.naturalWidth === 0) return null;
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
          }, newImageData.src);
          if (base64Data) imageBuffer = Buffer.from(base64Data, 'base64');
        }
      }

      if (imageBuffer) {
        fs.writeFileSync(targetFile, imageBuffer);
        console.log(`   ✅ Saved ${item.filename}`);
      } else {
        console.error(`   ⚠️ Timed out waiting for ${item.filename}`);
      }
    } catch (err) {
      console.error(`   ⚠️ Error: ${err.message}`);
    }
    if (i < queue.length - 1) await sleep(5000);
  }

  browser.disconnect();
}

main().catch(err => {
  console.error(`\n❌ Fatal Error: ${err.message}\n`);
  process.exit(1);
});
