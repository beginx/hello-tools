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
];

async function extractMessages(browser, tool) {
  const result = {};
  
  for (const locale of ['en', 'es', 'zh', 'ko', 'pt']) {
    const page = await browser.newPage();
    try {
      await page.goto(`${BASE}/${locale}/${tool}`, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Extract the RSC payload from __next_f pushes
      const rscData = await page.evaluate(() => {
        const scripts = [...document.querySelectorAll('script')];
        const allData = [];
        
        for (const script of scripts) {
          const text = script.textContent || '';
          // Collect all __next_f.push calls
          const pushMatches = [...text.matchAll(/self\.__next_f\.push\(\[1,"([^"]*)"\]\)/g)];
          for (const match of pushMatches) {
            try {
              const decoded = match[1]
                .replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
              allData.push(decoded);
            } catch(e) {}
          }
        }
        
        // Concatenate all data - RSC uses a streaming format
        return allData.join('');
      });
      
      // Try to find messages in the RSC payload using regex
      // The pattern is: messages:{"toolname":{"key":"value",...},"othertool":{...}}
      const msgRegex = /messages:(\{[^]+\}),"now"/;
      const msgMatch = rscData.match(msgRegex);
      
      if (msgMatch) {
        try {
          const msgStr = msgMatch[1]
            .replace(/"now":"[^"]*"/, '')  // Remove "now" timestamp
            .replace(/"timeZone":"[^"]*"/, '');  // Remove timezone
          result[locale] = JSON.parse(msgStr);
        } catch(e) {
          // Try extracting just the tool-specific messages
          const toolRegex = new RegExp(`"${tool}":\\{[^}]+\\}`);
          const toolMatch = rscData.match(toolRegex);
          if (toolMatch) {
            try {
              const fullRegex = new RegExp(`"${tool}":\\{[^}]+\\}[,}]`);
              const fullMatch = rscData.match(fullRegex);
              if (fullMatch) {
                result[locale] = { [tool]: JSON.parse(`{${fullMatch[0]}}`) };
              }
            } catch(e2) {
              result[locale] = { error: 'parse_failed', sample: rscData.slice(0, 500) };
            }
          } else {
            result[locale] = { error: 'not_found', sample: rscData.slice(0, 500) };
          }
        }
      } else {
        result[locale] = { error: 'no_rsc_match', sample: rscData.slice(0, 500) };
      }
      
      console.log(`  ${locale}: ${result[locale]?.error || 'OK'}`);
    } catch (err) {
      console.log(`  ${locale}: FAIL - ${err.message.slice(0,50)}`);
      result[locale] = { error: err.message };
    }
    await page.close();
  }
  
  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  fs.mkdirSync('recovered/rsc', { recursive: true });
  
  for (const tool of tools) {
    console.log(`\n${tool}:`);
    const msg = await extractMessages(browser, tool);
    fs.writeFileSync(`recovered/rsc/${tool}.json`, JSON.stringify(msg, null, 2));
  }
  
  await browser.close();
  console.log('\nDone!');
}

main().catch(console.error);
