import fs from 'fs';

const html = fs.readFileSync('recovered/full_page.html', 'utf8');

// The messages are embedded as: "messages":{...}
// Find the start position
const msgIdx = html.indexOf('"messages":');
if (msgIdx === -1) {
  console.log('No messages found');
  process.exit(1);
}

// From msgIdx, extract the JSON value after "messages":
// We need to find the matching closing brace
let start = msgIdx + '"messages":'.length;
let depth = 0;
let inString = false;
let escaped = false;
let end = start;

for (let i = start; i < html.length; i++) {
  const ch = html[i];
  
  if (escaped) {
    escaped = false;
    continue;
  }
  
  if (ch === '\\' && inString) {
    escaped = true;
    continue;
  }
  
  if (ch === '"') {
    inString = !inString;
    continue;
  }
  
  if (!inString) {
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
}

const msgStr = html.slice(start, end);
console.log(`Extracted messages: ${msgStr.length} chars`);

// Save raw
fs.writeFileSync('recovered/messages_clean.json', msgStr);

// Try to parse
try {
  const parsed = JSON.parse(msgStr);
  console.log(`\nTop-level keys: ${Object.keys(parsed).length}`);
  for (const [tool, msgs] of Object.entries(parsed)) {
    if (typeof msgs === 'object' && msgs !== null) {
      const keys = Object.keys(msgs);
      console.log(`  ${tool}: ${keys.length} keys`);
      if (keys.length > 0) {
        console.log(`    Sample: ${keys.slice(0, 5).join(', ')}`);
      }
    }
  }
  
  // Save individual tool message files
  const outputDir = 'recovered/final_msgs';
  fs.mkdirSync(outputDir, { recursive: true });
  
  for (const [tool, msgs] of Object.entries(parsed)) {
    if (typeof msgs === 'object' && msgs !== null) {
      fs.writeFileSync(`${outputDir}/${tool}.json`, JSON.stringify(msgs, null, 2));
    }
  }
  
  console.log(`\nSaved ${Object.keys(parsed).length} message files to ${outputDir}/`);
  
} catch(e) {
  console.log(`Parse error: ${e.message}`);
  // Save the problematic area
  fs.writeFileSync('recovered/messages_debug.txt', msgStr.slice(0, 5000));
}
