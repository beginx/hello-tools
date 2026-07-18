import fs from 'fs';

const tools = [
  'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
  'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
  'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
  'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
  'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
  'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
];

// Map of tool -> chunk filename
const chunkFiles = {
  'typing-test': 'chunks_07jm9wqg3b6wq.js',
  'solitaire': 'chunks_0w~2dpqg2-wo4.js',
  'minesweeper': 'chunks_001vr.g0eljfe.js',
  'checkers': 'chunks_0w~.exosunibe.js',
  'artillery': 'chunks_0xmcsnimk0bil.js',
  'video-poker': 'chunks_15a.bt-1d46e5.js',
  'pomodoro': 'chunks_0at2sxqs93g6d.js',
  'scientific-calc': 'chunks_0l6x-mky~p8qs.js',
  'ascii-art': 'chunks_0gljg957v-z~m.js',
  'base64': 'chunks_0mu2e-.x2aa7r.js',
  'urlcode': 'chunks_0ljb4xylbky8j.js',
  'uuid': 'chunks_10ef3p29fp9g9.js',
  'hash': 'chunks_028ewe8yd~8ch.js',
  'jwt': 'chunks_0kgpocvbu2q_e.js',
  'json': 'chunks_0j~0u2spyph_b.js',
  'regex': 'chunks_0j7-712dthay_.js',
  'diff': 'chunks_0p8~r6mp16~la.js',
  'lorem': 'chunks_0ueify3s5gmlz.js',
  'markdown-preview': 'chunks_0l~1-aojymxp3.js',
  'caseconverter': 'chunks_0_ex5snz.9qio.js',
  'charcount': 'chunks_0hb_f.jel13x_.js',
  'colorpicker': 'chunks_0z99m2-02wbub.js',
  'color-contrast': 'chunks_0s5074j3qcw3t.js',
  'qreader': 'chunks_08_fyfg4___fi.js',
  'namegen': 'chunks_0_-o2kjbftdh-.js',
  'numberbase': 'chunks_1213q37t_h470.js',
  'roman': 'chunks_0~xl6apvi0.6~.js',
  'time-calc': 'chunks_0yxz1ob19vm2f.js',
  'timezone': 'chunks_0lniz6m2.n6ww.js',
  'datasize': 'chunks_010bsef46pc~7.js',
  'standard-deviation': 'chunks_0t7q3225tt3~d.js',
  'inflation': 'chunks_0hyc~7x89t8bf.js',
  'creditcard': 'chunks_02wjz-3-q_qe4.js',
  'bac': 'chunks_0opb5u6u505y4.js',
  'cooking': 'chunks_08rw_.9nqu.1f.js',
  'whatismyip': 'chunks_0rb8a8zxchcet.js',
  'mbti': 'chunks_0dma7vrrlcihs.js',
  'zodiac': 'chunks_029tg.njun3fi.js',
  'tarot': 'chunks_16pf7v_b7gmmk.js',
  'emoji': 'chunks_0s6izs-58ob1_.js',
};

for (const [tool, chunkFile] of Object.entries(chunkFiles)) {
  const filepath = `recovered/chunks/${chunkFile}`;
  if (!fs.existsSync(filepath)) {
    console.log(`${tool}: chunk not found`);
    continue;
  }
  
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Extract all message-like string key-value pairs
  const pairs = content.match(/"([a-zA-Z]+)":"((?:[^"\\]|\\.)*)"/g);
  const messages = {};
  
  if (pairs) {
    for (const p of pairs) {
      const match = p.match(/"([a-zA-Z]+)":"((?:[^"\\]|\\.)*)"/);
      if (match) {
        const key = match[1];
        const val = match[2].replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
        // Skip CSS class names and other non-message strings
        if (key.length > 0 && val.length > 0 && !key.startsWith('os9') && !key.startsWith('solitaire') && !key.startsWith('flex') && !key.startsWith('grid')) {
          messages[key] = val;
        }
      }
    }
  }
  
  if (Object.keys(messages).length > 0) {
    console.log(`\n=== ${tool} (${Object.keys(messages).length} keys) ===`);
    for (const [k, v] of Object.entries(messages).slice(0, 40)) {
      console.log(`  "${k}": "${v.slice(0, 60)}"`);
    }
    if (Object.keys(messages).length > 40) {
      console.log(`  ... and ${Object.keys(messages).length - 40} more`);
    }
    
    // Save extracted messages
    fs.mkdirSync(`recovered/msgs/${tool}`, { recursive: true });
    fs.writeFileSync(`recovered/msgs/${tool}/en.json`, JSON.stringify(messages, null, 2));
  } else {
    console.log(`${tool}: no messages found`);
  }
}
