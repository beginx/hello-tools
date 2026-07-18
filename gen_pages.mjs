import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'es', 'zh', 'ko', 'pt'];
const BASE = 'src';
const LOCALE_DIR = `${BASE}/app/[locale]`;

function imports(tool) {
  let s = `'use client';\n\n`;
  s += `import { useState, useCallback } from 'react';\n`;
  s += `import { useParams } from 'next/navigation';\n`;
  for (const loc of LOCALES) {
    s += `import ${loc}Msgs from '../../../messages/${loc}/${tool}.json';\n`;
  }
  s += `const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };\n`;
  return s;
}

function header(tool) {
  const name = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return `
export default function ${name}Page() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/${tool}'; };
`;
}

const LANG_SEL = `          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>`;

function footer(tool) {
  return `      <div className="os9-footer" style={{ maxWidth: 520, width: '100%', textAlign: 'center', fontSize: 10, opacity: 0.6, marginTop: 12 }}>
        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {t('footer') || 'hello-tools 2026'}
      </div>`;
}

function seoFooter(tool) {
  return `          {/* SEO Description */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
          </div>`;
}

function wrapper(tool, body, maxW = '520') {
  return `${imports(tool)}
${header(tool)}
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
          ${LANG_SEL}
          ${body}
          ${seoFooter(tool)}
        </div>
      </div>
      ${footer(tool)}
    </div>
  );
}
`;
}

function writePage(tool, body, stateVars) {
  const full = wrapper(tool, body).replace('  return (', `${stateVars}\n\n  return (`);
  const fp = `${LOCALE_DIR}/${tool}/page.js`;
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, full);
  console.log(`  ✅ ${tool}`);
}

// ========== Generate pages ==========

// 1. base64
writePage('base64', `
          <div className="flex gap-2 mb-3">
            <button className={'os9-btn flex-1' + (mode === 'encode' ? ' os9-btn-primary' : '')} onClick={() => setMode('encode')}>{t('encode')}</button>
            <button className={'os9-btn flex-1' + (mode === 'decode' ? ' os9-btn-primary' : '')} onClick={() => setMode('decode')}>{t('decode')}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={mode === 'encode' ? input : output} onChange={(e) => mode === 'encode' ? setInput(e.target.value) : setOutput(e.target.value)} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={process}>{mode === 'encode' ? t('encode') : t('decode')}</button>
          <div className="mb-3">
            <label className="os9-label">{t('output')}</label>
            <textarea className="os9-input w-full" rows={4} value={mode === 'encode' ? output : input} readOnly />
          </div>
          <button className="os9-btn w-full text-xs py-2" onClick={copyResult}>{copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}</button>`,
  `  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setInput(decodeURIComponent(escape(atob(output))));
      }
    } catch(e) {
      if (mode === 'encode') setOutput(t('error') || 'Invalid input');
      else setInput(t('error') || 'Invalid input');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };`
);

// 2. urlcode (same pattern as base64)
writePage('urlcode', `
          <div className="flex gap-2 mb-3">
            <button className={'os9-btn flex-1' + (mode === 'encode' ? ' os9-btn-primary' : '')} onClick={() => setMode('encode')}>{t('encode')}</button>
            <button className={'os9-btn flex-1' + (mode === 'decode' ? ' os9-btn-primary' : '')} onClick={() => setMode('decode')}>{t('decode')}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={mode === 'encode' ? input : output} onChange={(e) => mode === 'encode' ? setInput(e.target.value) : setOutput(e.target.value)} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={process}>{mode === 'encode' ? t('encode') : t('decode')}</button>
          <div className="mb-3">
            <label className="os9-label">{t('output')}</label>
            <textarea className="os9-input w-full" rows={4} value={mode === 'encode' ? output : input} readOnly />
          </div>
          <button className="os9-btn w-full text-xs py-2" onClick={copyResult}>{copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}</button>`,
  `  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('encode');

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setInput(decodeURIComponent(output));
      }
    } catch(e) {
      if (mode === 'encode') setOutput(t('error') || 'Invalid input');
      else setInput(t('error') || 'Invalid input');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };`
);

// 3. uuid
writePage('uuid', `
          <div className="mb-4">
            <label className="os9-label">{t('count') || 'Count'}</label>
            <input className="os9-input" type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate')}</button>
          <div className="mb-3">
            <label className="os9-label">{t('result') || 'Result'}</label>
            <textarea className="os9-input w-full" rows={6} value={result} readOnly />
          </div>
          <button className="os9-btn w-full text-xs py-2" onClick={copyResult}>{copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}</button>`,
  `  const [count, setCount] = useState(1);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const uuids = [];
    for (let i = 0; i < count; i++) {
      uuids.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      }));
    }
    setResult(uuids.join('\\n'));
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };`
);

// 4. hash
writePage('hash', `
          <div className="mb-3">
            <label className="os9-label">{t('algorithm') || 'Algorithm'}</label>
            <select className="os9-select" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-512">SHA-512</option>
              <option value="SHA-1">SHA-1</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate')}</button>
          <div className="mb-3">
            <label className="os9-label">{t('output') || 'Hash'}</label>
            <input className="os9-input w-full" type="text" value={output} readOnly />
          </div>
          <button className="os9-btn w-full text-xs py-2" onClick={copyResult}>{copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}</button>`,
  `  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!input) { setOutput(''); return; }
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      setOutput(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
    } catch(e) {
      setOutput(t('error') || 'Error');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };`
);

// 5. jwt
writePage('jwt', `
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"eyJhbGciOiJIUzI1NiIs..."} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={decode}>{t('decode')}</button>
          {result && (
            <div>
              <div className="mb-3">
                <label className="os9-label">{t('header') || 'Header'}</label>
                <textarea className="os9-input w-full" rows={4} value={result.header} readOnly />
              </div>
              <div className="mb-3">
                <label className="os9-label">{t('payload') || 'Payload'}</label>
                <textarea className="os9-input w-full" rows={6} value={result.payload} readOnly />
              </div>
            </div>
          )}`,
  `  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const decode = () => {
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) { setResult(null); return; }
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setResult({ header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2) });
    } catch(e) {
      setResult(null);
    }
  };`
);

// 6. json formatter
writePage('json', `
          <div className="flex gap-2 mb-3">
            <button className={'os9-btn flex-1' + (mode === 'format' ? ' os9-btn-primary' : '')} onClick={() => setMode('format')}>{t('format') || 'Format'}</button>
            <button className={'os9-btn flex-1' + (mode === 'minify' ? ' os9-btn-primary' : '')} onClick={() => setMode('minify')}>{t('minify') || 'Minify'}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={process}>{t('format') || 'Format'}</button>
          <div className="mb-3">
            <label className="os9-label">{t('output')}</label>
            <textarea className="os9-input w-full" rows={6} value={output} readOnly />
          </div>
          {valid !== null && (
            <p className="text-xs mb-2" style={{ color: valid ? 'green' : 'red' }}>
              {valid ? (t('valid') || 'Valid JSON') : (t('invalid') || 'Invalid JSON')}
            </p>
          )}
          <button className="os9-btn w-full text-xs py-2" onClick={copyResult}>{copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}</button>`,
  `  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('format');
  const [valid, setValid] = useState(null);
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === 'format' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setValid(true);
    } catch(e) {
      setOutput(t('error') || 'Invalid JSON');
      setValid(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };`
);

console.log('\\nDone! Generated page.js for 6 tools.');
