import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'es', 'zh', 'ko', 'pt'];
const BASE = 'src';
const LOCALE_DIR = `${BASE}/app/[locale]`;

function imports(tool) {
  let s = `'use client';\n\nimport { useState, useCallback } from 'react';\nimport { useParams } from 'next/navigation';\n`;
  for (const loc of LOCALES) s += `import ${loc}Msgs from '../../../messages/${loc}/${tool}.json';\n`;
  s += `const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };\n`;
  return s;
}

function header(tool) {
  const name = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return `export default function ${name}Page() {\n  const params = useParams();\n  const locale = params?.locale || 'en';\n  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;\n  const changeLang = (l) => { window.location.href = '/' + l + '/${tool}'; };\n`;
}

const LANG = `<div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>`;

function footer(tool) {
  return `<div className="os9-footer" style={{ maxWidth: 520, width: '100%', textAlign: 'center', fontSize: 10, opacity: 0.6, marginTop: 12 }}>
        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {t('footer') || 'hello-tools 2026'}
      </div>`;
}

function wrap(tool, body, state, maxW = '520') {
  const open = `<div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: ${maxW}, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          ${LANG}
          ${body}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
          </div>
        </div>
      </div>
      ${footer(tool)}
    </div>`;
  
  return `${imports(tool)}\n${header(tool)}${state}\n\n  return (\n${open}\n  );\n}\n`;
}

const tools = {};

// --- Number Base Converter ---
tools.numberbase = {
  state: `  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [output, setOutput] = useState('');`,
  body: `<div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <input className="os9-input w-full" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{t('from') || 'From'}</label>
              <select className="os9-select" value={fromBase} onChange={(e) => setFromBase(parseInt(e.target.value))}>
                <option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hex (16)</option>
              </select>
            </div>
            <div>
              <label className="os9-label">{t('to') || 'To'}</label>
              <select className="os9-select" value={toBase} onChange={(e) => setToBase(parseInt(e.target.value))}>
                <option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hex (16)</option>
              </select>
            </div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={() => { try { setOutput(parseInt(input, fromBase).toString(toBase).toUpperCase()); } catch(e) { setOutput(t('error') || 'Error'); } }}>{t('convert')}</button>
          {output && <div className="mb-3"><label className="os9-label">{t('output')}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}`
};

// --- Roman Numeral Converter ---
tools.roman = {
  state: `  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('toRoman');
  const romanNumerals = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];`,
  body: `<div className="flex gap-2 mb-3">
            <button className={'os9-btn flex-1' + (mode === 'toRoman' ? ' os9-btn-primary' : '')} onClick={() => setMode('toRoman')}>{t('toRoman') || 'To Roman'}</button>
            <button className={'os9-btn flex-1' + (mode === 'toNumber' ? ' os9-btn-primary' : '')} onClick={() => setMode('toNumber')}>{t('toNumber') || 'To Number'}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <input className="os9-input w-full" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'toRoman' ? '2024' : 'MMXXIV'} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={convert}>{t('convert')}</button>
          {output && <div className="mb-3"><label className="os9-label">{t('output')}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}`
};

// --- Case Converter ---
tools.caseconverter = {
  state: `  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');`,
  body: `<div className="flex gap-2 mb-3">
            <button className="os9-btn flex-1" onClick={() => setOutput(input.toUpperCase())}>UPPERCASE</button>
            <button className="os9-btn flex-1" onClick={() => setOutput(input.toLowerCase())}>lowercase</button>
            <button className="os9-btn flex-1" onClick={() => setOutput(input.replace(/\\w\\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))}>Title Case</button>
          </div>
          <div className="flex gap-2 mb-3">
            <button className="os9-btn flex-1" onClick={() => setOutput(input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''))}>tOGGLE cASE</button>
            <button className="os9-btn flex-1" onClick={() => setOutput(input.replace(/[A-Z]/g, c => c.toLowerCase()).replace(/[a-z]/g, c => c.toUpperCase()))}>InVeRsE</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('output')}</label>
            <textarea className="os9-input w-full" rows={4} value={output} readOnly />
          </div>
          <button className="os9-btn w-full text-xs py-2" onClick={() => { navigator.clipboard.writeText(output); }}>{t('copy') || 'Copy'}</button>`
};

// --- Character Counter ---
tools.charcount = {
  state: `  const [text, setText] = useState('');`,
  body: `<div className="mb-3">
            <textarea className="os9-input w-full" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('input')} />
          </div>
          {text && (
            <div className="os9-result mb-3">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('chars') || 'Characters'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.length}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('words') || 'Words'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.match(/\\S+/g)?.length || 0}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('lines') || 'Lines'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.split('\\n').length}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('noSpaces') || 'No Spaces'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.replace(/\\s/g, '').length}</div></div>
              </div>
            </div>
          )}`
};

// --- Lorem Ipsum Generator ---
tools.lorem = {
  state: `  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');`,
  body: `<div className="mb-3">
            <label className="os9-label">{t('paragraphs') || 'Count'}</label>
            <input className="os9-input" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate')}</button>
          {output && (
            <div className="mb-3">
              <label className="os9-label">{t('result') || 'Result'}</label>
              <textarea className="os9-input w-full" rows={8} value={output} readOnly />
            </div>
          )}
          <button className="os9-btn w-full text-xs py-2" onClick={() => { navigator.clipboard.writeText(output); }}>{t('copy') || 'Copy'}</button>`,
  extra: `  const lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  const generate = () => {
    let result = '';
    for (let i = 0; i < count; i++) {
      const words = lipsum.split(' ').sort(() => Math.random() - 0.5).join(' ');
      result += words + '\\n\\n';
    }
    setOutput(result.trim());
  };`
};

// --- Diff Checker ---
tools.diff = {
  state: `  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [result, setResult] = useState(null);`,
  body: `<div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="os9-label">{t('originalLabel') || 'Original'}</label>
              <textarea className="os9-input w-full" rows={6} value={original} onChange={(e) => setOriginal(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('modifiedLabel') || 'Modified'}</label>
              <textarea className="os9-input w-full" rows={6} value={modified} onChange={(e) => setModified(e.target.value)} />
            </div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={compare}>{t('compare') || 'Compare'}</button>
          {result && (
            <div className="mb-3">
              <label className="os9-label">{t('result') || 'Diff'}</label>
              <div className="os9-input w-full" style={{ maxHeight: 200, overflow: 'auto', fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre' }}>
                {result.lines.map((l, i) => (
                  <div key={i} style={{ background: l.type === 'add' ? '#d4edda' : l.type === 'rem' ? '#f8d7da' : 'transparent' }}>{l.text}</div>
                ))}
              </div>
            </div>
          )}`,
  extra: `  const compare = () => {
    const oLines = original.split('\\n');
    const mLines = modified.split('\\n');
    const maxLen = Math.max(oLines.length, mLines.length);
    const lines = [];
    for (let i = 0; i < maxLen; i++) {
      if (i >= oLines.length) lines.push({ type: 'add', text: '+ ' + mLines[i] });
      else if (i >= mLines.length) lines.push({ type: 'rem', text: '- ' + oLines[i] });
      else if (oLines[i] !== mLines[i]) {
        lines.push({ type: 'rem', text: '- ' + oLines[i] });
        lines.push({ type: 'add', text: '+ ' + mLines[i] });
      } else lines.push({ type: 'same', text: '  ' + oLines[i] });
    }
    setResult({ lines });
  };`
};

// Generate all
for (const [tool, config] of Object.entries(tools)) {
  const stateStr = config.state + (config.extra || '');
  const full = wrap(tool, config.body, stateStr, '520');
  const fp = `${LOCALE_DIR}/${tool}/page.js`;
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, full);
  console.log(`  ✅ ${tool}`);
}

console.log(`\nDone! Generated ${Object.keys(tools).length} tools.`);
