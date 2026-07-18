import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'en-US' });
  
  // Intercept network to capture RSC data
  let fullHtml = '';
  
  context.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/en/typing-test') && response.headers()['content-type']?.includes('text/html')) {
      try {
        fullHtml = await response.text();
      } catch(e) {}
    }
  });
  
  const page = await context.newPage();
  await page.goto('https://oxoxox1.com/en/typing-test', { waitUntil: 'networkidle', timeout: 20000 });
  
  console.log(`Full HTML size: ${fullHtml.length} bytes`);
  fs.writeFileSync('recovered/full_page.html', fullHtml);
  
  // Now try to extract messages using various methods
  // Method 1: Find Next Intl message data
  const msgMatch = fullHtml.match(/messages:(\{[^]+\}),"now"/);
  if (msgMatch) {
    console.log('Found messages via regex!');
    const msgStr = msgMatch[1];
    console.log(`Messages length: ${msgStr.length} chars`);
    fs.writeFileSync('recovered/messages_raw.json', msgStr);
    
    // Try to reparse as JSON
    try {
      const parsed = JSON.parse(msgStr);
      console.log(`Tools in messages: ${Object.keys(parsed).length}`);
      for (const [tool, msgs] of Object.entries(parsed)) {
        console.log(`  ${tool}: ${Object.keys(msgs).length} keys`);
      }
    } catch(e) {
      console.log(`Parse error: ${e.message}`);
    }
  } else {
    console.log('No messages match found');
    // Print a snippet to debug
    const idx = fullHtml.indexOf('messages');
    if (idx >= 0) {
      console.log(`Found 'messages' at position ${idx}:`);
      console.log(fullHtml.slice(Math.max(0, idx-50), idx + 500));
    } else {
      const idx2 = fullHtml.indexOf('__next_f');
      if (idx2 >= 0) {
        console.log(`Found '__next_f' at position ${idx2}:`);
        console.log(fullHtml.slice(idx2, idx2 + 500));
      } else {
        console.log('First 2000 chars:');
        console.log(fullHtml.slice(0, 2000));
      }
    }
  }
  
  // Method 2: Try to extract RSC payload from the streams
  // The RSC data is encoded in __next_f pushes
  const rscData = await page.evaluate(() => {
    // Try to access React internal data
    const scripts = document.querySelectorAll('script');
    const results = [];
    for (const s of scripts) {
      if (s.textContent && s.textContent.includes('__next_f')) {
        results.push(s.textContent.slice(0, 3000));
      }
    }
    return results;
  });
  
  console.log(`\n=== RSC script tags: ${rscData.length} ===`);
  for (const r of rscData.slice(0, 3)) {
    console.log(r.slice(0, 500));
  }
  
  await browser.close();
}

main().catch(console.error);
