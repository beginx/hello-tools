import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://oxoxox1.com';

// All 43 tools
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
  
  // Navigate to any page to get the full messages payload
  // The layout loads ALL messages for ALL tools
  console.log('Fetching page with full messages...');
  await page.goto(`${BASE}/en/typing-test`, { waitUntil: 'networkidle', timeout: 20000 });
  
  // Extract the __next_f data
  const rawRsc = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script')];
    const allPushes = [];
    
    for (const script of scripts) {
      const text = script.textContent || '';
      // Extract all push data
      let idx = 0;
      while (true) {
        const startIdx = text.indexOf('self.__next_f.push(', idx);
        if (startIdx === -1) break;
        const contentStart = text.indexOf('"', startIdx + 20);
        if (contentStart === -1) break;
        const contentEnd = text.indexOf('"', contentStart + 1);
        if (contentEnd === -1) break;
        const raw = text.slice(contentStart + 1, contentEnd);
        // Unescape
        const decoded = raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)))
                          .replace(/\\"/g, '"')
                          .replace(/\\\\/g, '\\');
        allPushes.push(decoded);
        idx = contentEnd + 1;
      }
    }
    return allPushes.join('\n---\n');
  });
  
  console.log(`Extracted ${rawRsc.length} chars of RSC data`);
  
  // Save raw data
  fs.writeFileSync('recovered/rsc_raw.txt', rawRsc);
  
  // Try to find the messages object
  // Pattern: messages:{...}
  const msgMatch = rawRsc.match(/messages:({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})/);
  if (msgMatch) {
    const msgStr = msgMatch[1];
    console.log(`\nFound messages object: ${msgStr.slice(0, 200)}...`);
    console.log(`Length: ${msgStr.length} chars`);
    
    // Try to extract individual tool messages
    // Split into individual tool entries
    const toolRegex = /"([a-zA-Z0-9_-]+)":({(?:[^{}]|{[^{}]*})*})/g;
    let tMatch;
    const allMessages = {};
    while ((tMatch = toolRegex.exec(msgStr)) !== null) {
      allMessages[tMatch[1]] = tMatch[2];
    }
    
    console.log(`\nFound ${Object.keys(allMessages).length} tools with messages`);
    
    // Save each tool's messages
    fs.mkdirSync('recovered/msgs_v2', { recursive: true });
    for (const [tool, msgData] of Object.entries(allMessages)) {
      try {
        const parsed = JSON.parse(msgData);
        fs.writeFileSync(`recovered/msgs_v2/${tool}.json`, JSON.stringify(parsed, null, 2));
        console.log(`  ${tool}: ${Object.keys(parsed).length} keys`);
      } catch (e) {
        console.log(`  ${tool}: parse error - ${msgData.slice(0, 100)}`);
      }
    }
  } else {
    console.log('No messages object found. Checking raw data pattern...');
    console.log(rawRsc.slice(0, 1000));
  }
  
  await browser.close();
  console.log('\nDone!');
}

main().catch(console.error);
