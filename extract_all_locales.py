#!/usr/bin/env python3
import json
import os
import re
import subprocess
import tempfile

# The 43 missing tools
MISSING_TOOLS = [
    'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
    'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
    'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
    'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
    'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
    'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
    'about', 'guide'
]

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
BASE_URL = 'https://oxoxox1.com'

# Write a Playwright script that extracts messages from each locale page
script = '''
const { chromium } = require('playwright');
const fs = require('fs');

const tools = %s;
const locales = ['en', 'es', 'zh', 'ko', 'pt'];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const outDir = 'recovered/all_locales';
  fs.mkdirSync(outDir, { recursive: true });
  
  for (const tool of tools) {
    for (const locale of locales) {
      const page = await browser.newPage();
      try {
        await page.goto(`https://oxoxox1.com/${locale}/${tool}`, { 
          waitUntil: 'networkidle', 
          timeout: 15000 
        });
        
        // Get the page content and extract messages from JS
        const content = await page.content();
        
        // Find the unique chunk for this page
        const chunkMatch = content.match(/chunks\\\\/([^"']*?)\\\\.js/g);
        const allChunks = [...new Set(chunkMatch || [])];
        
        // Find the tool-specific chunk (not the shared ones)
        const toolChunk = allChunks.find(c => {
          const name = c.replace('chunks/', '');
          return !['0dbhjjzl8qfwv', '02whdmnm9-uq5', '146b_g8awu01j', 'turbopack-051gkq-d8_ht1', 
                   '0ht900cau6_ur', '02i7dfk78~t~2', '05sqh99f1_wo7', '03~yq9q893hmn', '0n~dq4kpx9xxx']
            .some(shared => c.includes(shared));
        });
        
        if (toolChunk) {
          // Extract chunk ID
          const chunkId = toolChunk.replace('chunks/', '').replace('.js', '');
          fs.writeFileSync(`${outDir}/${locale}_${tool}_chunk.txt`, chunkId);
        }
        
        // Also get the page for RSC data extraction
        // Save the HTML for later processing
        fs.writeFileSync(`${outDir}/${locale}_${tool}.html`, content);
        
        console.log(`OK ${locale}/${tool}`);
      } catch(e) {
        console.log(`FAIL ${locale}/${tool}: ${e.message.slice(0,50)}`);
      }
      await page.close();
    }
  }
  await browser.close();
  console.log('DONE');
}
main().catch(console.error);
''' % json.dumps(MISSING_TOOLS)

# Save script
with open('extract_all.mjs', 'w') as f:
    f.write(script)

print("Script saved. Now extracting all locales...")
print("This will take a while (43 tools x 5 locales = 215 pages)...")
print("Make sure Playwright is installed: npx playwright install chromium")
