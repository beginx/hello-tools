import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://oxoxox1.com';

const tools = [
  'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
  'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
  'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
  'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
  'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
  'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
  'about', 'guide'
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // First, check all 5 locales for each tool
  for (const tool of tools) {
    const dir = `recovered/messages/${tool}`;
    fs.mkdirSync(dir, { recursive: true });
    
    for (const locale of ['en', 'es', 'zh', 'ko', 'pt']) {
      try {
        await page.goto(`${BASE}/${locale}/${tool}`, { waitUntil: 'networkidle', timeout: 15000 });
        
        // Extract all messages from the __next_f data
        const messages = await page.evaluate(() => {
          const result = {};
          const scripts = document.querySelectorAll('script');
          
          for (const script of scripts) {
            const text = script.textContent || '';
            // Look for messages object pattern in __next_f pushes
            const match = text.match(/messages:\{([^}]+)\}/);
            if (match) {
              // Try to find the full messages object
              const msgMatch = text.match(/"messages":(\{[^}]+\})/);
              if (msgMatch) {
                try {
                  Object.assign(result, JSON.parse(msgMatch[1]));
                } catch(e) {}
              }
            }
          }
          return result;
        });
        
        // Also get the rendered page state - check what keys are used
        const usedKeys = await page.evaluate(() => {
          const body = document.body?.innerText || '';
          const html = document.body?.innerHTML || '';
          // Find t('key') patterns or translated text
          const potentialKeys = [];
          // Check for data attributes or React props
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            for (const attr of el.attributes || []) {
              if (attr.value.includes("t(") || attr.value.includes("t (")) {
                potentialKeys.push(attr.value);
              }
            }
          }
          return potentialKeys;
        });
        
        // Get the title for this locale
        const title = await page.title();
        
        fs.writeFileSync(`${dir}/${locale}.json`, JSON.stringify({
          title,
          messages,
          usedKeys
        }, null, 2));
        
        console.log(`${locale}/${tool}: ${title.slice(0,50)}`);
      } catch (err) {
        console.log(`FAIL ${locale}/${tool}: ${err.message.slice(0,50)}`);
        fs.writeFileSync(`${dir}/${locale}.json`, JSON.stringify({ error: err.message }));
      }
    }
  }
  
  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
