import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://oxoxox1.com';
const LOCALES = ['en', 'es', 'zh', 'ko', 'pt'];

const tools = [
  'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
  'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
  'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
  'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
  'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
  'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
  'about', 'guide'
];

async function extractToolInfo(browser, tool) {
  const results = { tool };
  
  // Get English page info
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  try {
    await page.goto(`${BASE}/en/${tool}`, { waitUntil: 'networkidle', timeout: 20000 });
    
    // Get all text content, buttons, inputs structure
    results.ui = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')].map(b => ({
        text: b.textContent.trim().slice(0, 100),
        classes: b.className,
        onClick: b.hasAttribute('onclick') || b.getAttribute('onclick')
      }));
      
      const inputs = [...document.querySelectorAll('input, select, textarea')].map(inp => ({
        type: inp.tagName.toLowerCase(),
        inputType: inp.type || '',
        placeholder: inp.placeholder || '',
        id: inp.id || '',
        className: inp.className.slice(0, 100)
      }));
      
      const labels = [...document.querySelectorAll('label, .os9-label, th')].map(l => l.textContent.trim()).slice(0, 30);
      
      return { buttons, inputs, labels };
    });
    
    // Try to extract messages/translations from the page data
    results.messages = await page.evaluate(() => {
      // Check for any JSON-like data in script tags
      const scripts = [...document.scripts].map(s => s.textContent.slice(0, 2000));
      return scripts.filter(s => s.includes('"title"') || s.includes("'title'"));
    });
    
    // Get the raw HTML for analysis
    results.html = await page.content();
    
  } catch (err) {
    results.error = err.message;
  }
  
  await page.close();
  return results;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  fs.mkdirSync('recovered/pages', { recursive: true });
  
  for (const tool of tools) {
    console.log(`\n=== Extracting ${tool} ===`);
    const info = await extractToolInfo(browser, tool);
    
    // Save the extraction data
    fs.writeFileSync(`recovered/pages/${tool}.json`, JSON.stringify(info, null, 2));
    
    if (info.ui) {
      console.log(`  Buttons: ${info.ui.buttons.map(b => b.text).join(', ').slice(0, 100)}`);
      console.log(`  Inputs: ${info.ui.inputs.map(i => i.placeholder || i.type).join(', ').slice(0, 100)}`);
    }
  }
  
  await browser.close();
  console.log('\n=== Extraction complete ===');
}

main().catch(console.error);
