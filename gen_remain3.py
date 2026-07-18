#!/usr/bin/env python3
"""Generate remaining simpler page.js files - batch 3"""
import os

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
LOCALE_DIR = 'src/app/[locale]'

def write_page(tool, body, state_extra="", maxW="520"):
    name = ''.join(w.capitalize() for w in tool.replace('-', ' ').split())
    lines = ["'use client';", "",
             "import { useState, useCallback, useRef, useEffect } from 'react';",
             "import { useParams } from 'next/navigation';"]
    for loc in LOCALES:
        lines.append(f"import {loc}Msgs from '../../../messages/{loc}/{tool}.json';")
    lines.append(f"const pageMsgs = {{ en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs }};")
    lines.append(f"")
    lines.append(f"export default function {name}Page() {{")
    lines.append(f"  const params = useParams();")
    lines.append(f"  const locale = params?.locale || 'en';")
    lines.append(f"  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;")
    lines.append(f"  const changeLang = (l) => {{ window.location.href = '/' + l + '/{tool}'; }};")
    if state_extra:
        lines.append(state_extra)
    lines.append("")
    lines.append("  return (")
    lines.append('    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: \'var(--os9-bg)\' }}>')
    lines.append(f'      <div className="os9-window" style={{ maxWidth: {maxW}, width: \'100%\' }}>')
    lines.append('        <div className="os9-titlebar relative">')
    lines.append('          <div className="os9-window-controls">')
    lines.append('            <div className="os9-dot os9-dot-close" />')
    lines.append('            <div className="os9-dot os9-dot-minimize" />')
    lines.append('            <div className="os9-dot os9-dot-zoom" />')
    lines.append('          </div>')
    lines.append('          <span className="tracking-[0.5px] text-sm">{t(\'title\')}</span>')
    lines.append('        </div>')
    lines.append('        <div className="os9-window-body">')
    lines.append('          <div className="flex justify-between items-center mb-4">')
    lines.append('            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>')
    lines.append('              <option value="en">English</option>')
    lines.append('              <option value="es">Español</option>')
    lines.append('              <option value="zh">中文</option>')
    lines.append('              <option value="ko">한국어</option>')
    lines.append('              <option value="pt">Português</option>')
    lines.append('            </select>')
    lines.append('          </div>')
    for line in body.split('\n'):
        lines.append('          ' + line)
    lines.append('          <div className="mt-4 px-1">')
    lines.append('            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t(\'seoDescription\')}</p>')
    lines.append('          </div>')
    lines.append('        </div>')
    lines.append('      </div>')
    lines.append('      <div className="os9-footer" style={{ maxWidth: 520, width: \'100%\', textAlign: \'center\', fontSize: 10, opacity: 0.6, marginTop: 12 }}>')
    lines.append('        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>')
    lines.append('        <span className="mx-2">|</span>')
    lines.append('        {t(\'footer\') || \'hello-tools 2026\'}')
    lines.append('      </div>')
    lines.append('    </div>')
    lines.append('  );')
    lines.append('}')
    
    fp = f'{LOCALE_DIR}/{tool}/page.js'
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f'  ✅ {tool}')

# === Pomodoro Timer ===
write_page('pomodoro', '''<div className="text-center mb-4">
            <div className="text-[5rem] font-mono tabular-nums" style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</div>
            <div className="text-xs mt-1" style={{ opacity: 0.6 }}>{t('mode') || 'Mode'}: {mode}</div>
          </div>
          <div className="flex gap-2 mb-3">
            <button className={'os9-btn flex-1' + (mode === 'pomodoro' ? ' os9-btn-primary' : '')} onClick={() => setMode('pomodoro')}>{t('pomodoro') || 'Pomodoro'}</button>
            <button className={'os9-btn flex-1' + (mode === 'short' ? ' os9-btn-primary' : '')} onClick={() => setMode('short')}>{t('shortBreak') || 'Short Break'}</button>
            <button className={'os9-btn flex-1' + (mode === 'long' ? ' os9-btn-primary' : '')} onClick={() => setMode('long')}>{t('longBreak') || 'Long Break'}</button>
          </div>
          <div className="flex gap-2 mb-3">
            <button className="os9-btn os9-btn-primary flex-1" onClick={running ? pause : start}>{running ? (t('pause') || 'Pause') : (t('start') || 'Start')}</button>
            <button className="os9-btn flex-1" onClick={reset}>{t('reset') || 'Reset'}</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('completed') || 'Completed'}</div><div className="font-bold">{completed}</div></div>
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalTime') || 'Total Time'}</div><div className="font-bold">{formatTime(totalTime)}</div></div>
          </div>''',
    '''  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef(null);

  const durations = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false);
            setCompleted(c => c + 1);
            setTotalTime(t => t + durations[mode]);
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=');
            audio.play().catch(() => {});
            return durations[mode];
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const start = () => { setRunning(true); };
  const pause = () => { setRunning(false); };
  const reset = () => { setRunning(false); setTimeLeft(durations[mode]); };
  const formatTime = (s) => { const m = Math.floor(s/60).toString().padStart(2,'0'); const sec = (s%60).toString().padStart(2,'0'); return `${m}:${sec}`; };'''
)

# === Scientific Calculator ===
write_page('scientific-calc', '''<div className="mb-3">
            <input className="os9-input w-full text-right text-lg" type="text" value={display} readOnly />
          </div>
          <div className="grid grid-cols-4 gap-1 mb-1">
            {['C','⌫','(',')','sin','cos','tan','π','ln','log','e','^','7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map((btn, i) => (
              <button key={i} className="os9-btn h-10 text-sm" + (['=','C'].includes(btn) ? ' os9-btn-primary' : '') + (btn === '0' ? ' col-span-2' : '') onClick={() => handle(btn)}>{btn}</button>
            ))}
          </div>''',
    '''  const [display, setDisplay] = useState('0');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handle = (btn) => {
    if ('0123456789.'.includes(btn)) {
      if (waitingForOperand || display === '0') { setDisplay(btn === '.' ? '0.' : btn); setWaitingForOperand(false); }
      else { setDisplay(display + btn); }
    } else if (btn === 'C') { setDisplay('0'); setWaitingForOperand(false); }
    else if (btn === '⌫') { setDisplay(display.length > 1 ? display.slice(0,-1) : '0'); }
    else if (btn === '=') { try { setDisplay(String(eval(display.replace('π','Math.PI').replace('e','Math.E').replace('sin','Math.sin').replace('cos','Math.cos').replace('tan','Math.tan').replace('ln','Math.log').replace('log','Math.log10').replace('^','**')))); } catch(e) { setDisplay('Error'); } setWaitingForOperand(true); }
    else if (['+','-','*','/','^'].includes(btn)) { setDisplay(display + btn); setWaitingForOperand(false); }
    else if (['sin','cos','tan','ln','log','π','e'].includes(btn)) { setDisplay(display + (btn === 'π' ? 'Math.PI' : btn === 'e' ? 'Math.E' : btn + '(')); setWaitingForOperand(false); }
    else if (btn === '(' || btn === ')') { setDisplay(display + btn); setWaitingForOperand(false); }
  };'''
)

# === Regex Tester ===
write_page('regex', '''<div className="mb-3">
            <label className="os9-label">{t('pattern') || 'Pattern'}</label>
            <div className="flex gap-2">
              <input className="os9-input flex-1" type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder={t('patternPlaceholder') || '/pattern/flags'} />
              <select className="os9-select" value={flags} onChange={(e) => setFlags(e.target.value)}>
                <option value="">None</option>
                <option value="g">g (global)</option>
                <option value="i">i (case-insensitive)</option>
                <option value="m">m (multiline)</option>
                <option value="gi">gi</option>
                <option value="gm">gm</option>
                <option value="gim">gim</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('testString') || 'Test String'}</label>
            <textarea className="os9-input w-full" rows={4} value={testStr} onChange={(e) => setTestStr(e.target.value)} />
          </div>
          {error && <div className="text-xs text-red-600 mb-3">{error}</div>}
          <div className="mb-3">
            <label className="os9-label">{t('matches') || 'Matches'}</label>
            <div className="os9-input w-full min-h-[100px]" style={{ overflow: 'auto', whiteSpace: 'pre-wrap' }}>
              {matches.length === 0 ? <span style={{ opacity: 0.5 }}>{t('noMatches') || 'No matches'}</span> : matches.map((m, i) => <div key={i}><span className="font-bold">{m[0]}</span> {m.index !== undefined && <span className="text-xs" style={{ opacity: 0.6 }}>@ {m.index}</span>}{m.groups && <pre className="text-xs mt-1">{JSON.stringify(m.groups, null, 2)}</pre>}</div>)}
            </div>
          </div>''',
    '''  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('');
  const [testStr, setTestStr] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const testRegex = useCallback(() => {
    setError('');
    setMatches([]);
    if (!pattern) return;
    try {
      const regex = new RegExp(pattern.slice(1, -1), flags);
      let match;
      const results = [];
      while ((match = regex.exec(testStr)) !== null) {
        results.push({ ...match, index: match.index, groups: match.groups });
        if (!flags.includes('g')) break;
      }
      setMatches(results);
    } catch(e) { setError(t('invalidRegex') || 'Invalid regex'); }
  }, [pattern, flags, testStr]);

  useEffect(() => { testRegex(); }, [testRegex]);'''
)

# === Markdown Preview ===
write_page('markdown-preview', '''<div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="os9-label">{t('markdown') || 'Markdown'}</label>
              <textarea className="os9-input w-full" rows={12} value={md} onChange={(e) => setMd(e.target.value)} placeholder={t('placeholder') || '# Heading\\n\\n**Bold** and *italic*'} />
            </div>
            <div className="os9-input w-full h-[300px] overflow-auto p-3" style={{ background: 'white', color: 'black' }} dangerouslySetInnerHTML={{ __html: html }} />
          </div>''',
    '''  const [md, setMd] = useState('# Hello\\n\\n**Bold** and *italic*\\n\\n- Item 1\\n- Item 2');
  const [html, setHtml] = useState('');

  useEffect(() => {
    const h = md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\\n/g, '<br>');
    setHtml(h);
  }, [md]);'''
)

# === Color Picker ===
write_page('colorpicker', '''<div className="mb-3">
            <div className="relative w-full h-40 mb-2 rounded border" style={{ background: `linear-gradient(to right, ${hueColor}, white), linear-gradient(to bottom, transparent, black)` }}>
              <div className="absolute w-4 h-4 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${sv.s * 100}%`, top: `${(1 - sv.v) * 100}%`, pointerEvents: 'none' }} />
            </div>
            <input type="range" className="w-full h-4" min="0" max="360" value={hue} onChange={(e) => { setHue(Number(e.target.value)); setHueColor(`hsl(${e.target.value}, 100%, 50%)`); }} />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3 text-center">
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>HEX</div><input className="os9-input text-center font-mono" value={hex} onChange={(e) => setFromHex(e.target.value)} /></div>
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>RGB</div><input className="os9-input text-center font-mono" value={rgb} readOnly /></div>
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>HSL</div><input className="os9-input text-center font-mono" value={hsl} readOnly /></div>
          </div>
          <div className="flex gap-2">
            <button className="os9-btn flex-1" onClick={() => navigator.clipboard.writeText(hex)}>{t('copyHex') || 'Copy HEX'}</button>
            <button className="os9-btn flex-1" onClick={() => navigator.clipboard.writeText(rgb)}>{t('copyRgb') || 'Copy RGB'}</button>
          </div>''',
    '''  const [hue, setHue] = useState(200);
  const [hueColor, setHueColor] = useState('hsl(200, 100%, 50%)');
  const [sv, setSv] = useState({ s: 0.5, v: 1 });
  const [hex, setHex] = useState('#007bff');
  const [rgb, setRgb] = useState('rgb(0, 123, 255)');
  const [hsl, setHsl] = useState('hsl(200, 100%, 50%)');

  const hsvToRgb = (h, s, v) => {
    let r, g, b; const i = Math.floor(h * 6); const f = h * 6 - i; const p = v * (1 - s); const q = v * (1 - f * s); const t = v * (1 - (1 - f) * s);
    switch(i % 6) { case 0: r=v,g=t,b=p; break; case 1: r=q,g=v,b=p; break; case 2: r=p,g=v,b=t; break; case 3: r=p,g=q,b=v; break; case 4: r=t,g=p,b=v; break; case 5: r=v,g=p,b=q; break; }
    return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
  };

  const updateFromHsv = () => {
    const { r, g, b } = hsvToRgb(hue/360, sv.s, sv.v);
    const h = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    setHex(h);
    setRgb(`rgb(${r}, ${g}, ${b})`);
    setHsl(`hsl(${hue}, ${Math.round(sv.s*100)}%, ${Math.round(sv.v*100)}%)`);
  };

  useEffect(() => { updateFromHsv(); }, [hue, sv]);
  useEffect(() => { setHueColor(`hsl(${hue}, 100%, 50%)`); }, [hue]);

  const setFromHex = (h) => { if (!/^#[0-9a-fA-F]{6}$/.test(h)) return; const r=parseInt(h.slice(1,3),16), g=parseInt(h.slice(3,5),16), b=parseInt(h.slice(5,7),16); const max=Math.max(r,g,b)/255, min=Math.min(r,g,b)/255; let h=0, s=0; if(max!==min){ const d=max-min; s=d/max; switch(max){ case r/255: h=(g-b)/255/d%6; break; case g/255: h=(b-r)/255/d+2; break; case b/255: h=(r-g)/255/d+4; break; } h/=6; if(h<0) h+=1; } setHue(Math.round(h*360)); setSv({s, v:max}); updateFromHsv(); };'''
)

# === Color Contrast Checker ===
write_page('color-contrast', '''<div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{t('foreground') || 'Foreground'}</label>
              <input className="os9-input" type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
              <input className="os9-input mt-1" type="text" value={fg} onChange={(e) => setFg(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('background') || 'Background'}</label>
              <input className="os9-input" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
              <input className="os9-input mt-1" type="text" value={bg} onChange={(e) => setBg(e.target.value)} />
            </div>
          </div>
          <div className="h-20 flex items-center justify-center mb-3 border" style={{ background: bg, color: fg }}>
            <span className="px-4 py-2 text-lg" style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>Sample Text</span>
          </div>
          <div className="os9-result mb-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-center">
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('contrastRatio') || 'Contrast Ratio'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem', color: ratio >= 7 ? '#28a745' : ratio >= 4.5 ? '#ffc107' : '#dc3545' }}>{ratio}:1</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wcagAA') || 'WCAG AA'}</div><div className="font-bold" style={{ color: ratio >= 4.5 ? '#28a745' : '#dc3545' }}>{ratio >= 4.5 ? '✓ Pass' : '✗ Fail'}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wcagAAA') || 'WCAG AAA'}</div><div className="font-bold" style={{ color: ratio >= 7 ? '#28a745' : '#dc3545' }}>{ratio >= 7 ? '✓ Pass' : '✗ Fail'}</div></div>
              <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('largeText') || 'Large Text'}</div><div className="font-bold" style={{ color: ratio >= 3 ? '#28a745' : '#dc3545' }}>{ratio >= 3 ? '✓ Pass' : '✗ Fail'}</div></div>
            </div>
          </div>''',
    '''  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [ratio, setRatio] = useState(21);

  const luminance = (hex) => {
    const c = hex.replace('#', ''); const r = parseInt(c.slice(0,2),16)/255; const g = parseInt(c.slice(2,4),16)/255; const b = parseInt(c.slice(4,6),16)/255;
    const srgb = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
  };

  useEffect(() => {
    const l1 = luminance(fg), l2 = luminance(bg);
    setRatio(Math.round((Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05) * 10) / 10);
  }, [fg, bg]);'''
)

# === QR Code Reader ===
write_page('qreader', '''<div className="mb-3">
            <label className="os9-label">{t('uploadImage') || 'Upload Image'}</label>
            <input className="os9-input w-full" type="file" accept="image/*" onChange={handleFile} />
          </div>
          {img && <div className="mb-3"><canvas ref={canvasRef} className="max-w-full" /></div>}
          <div className="mb-3">
            <label className="os9-label">{t('result') || 'Result'}</label>
            <textarea className="os9-input w-full" rows={4} value={result} readOnly />
          </div>
          {result && <button className="os9-btn w-full text-xs py-2" onClick={() => navigator.clipboard.writeText(result)}>{t('copy') || 'Copy'}</button>}''',
    '''  const [img, setImg] = useState(null);
  const [result, setResult] = useState('');
  const canvasRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgEl = new Image();
      imgEl.onload = () => {
        setImg(imgEl);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = imgEl.width;
          canvas.height = imgEl.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgEl, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          try {
            const jsQR = (window.jsQR || ({ locate: () => null }));
            const code = jsQR.locate ? jsQR(imageData.data, imageData.width, imageData.height) : null;
            if (code) setResult(code.data);
            else setResult(t('noQrFound') || 'No QR code found');
          } catch(err) { setResult(t('error') || 'Error reading QR'); }
        }
      };
      imgEl.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };'''
)

# === Name Generator ===
write_page('namegen', '''<div className="mb-3">
            <label className="os9-label">{t('type') || 'Type'}</label>
            <select className="os9-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="fantasy">{t('fantasy') || 'Fantasy'}</option>
              <option value="scifi">{t('scifi') || 'Sci-Fi'}</option>
              <option value="realistic">{t('realistic') || 'Realistic'}</option>
              <option value="japanese">{t('japanese') || 'Japanese'}</option>
              <option value="business">{t('business') || 'Business'}</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('count') || 'Count'}</label>
            <input className="os9-input" type="number" min="1" max="50" value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate') || 'Generate'}</button>
          {names.length > 0 && (
            <div className="mb-3">
              <label className="os9-label">{t('results') || 'Results'}</label>
              <textarea className="os9-input w-full" rows={8} value={names.join('\\n')} readOnly />
            </div>
          )}
          <button className="os9-btn w-full text-xs py-2" onClick={() => navigator.clipboard.writeText(names.join('\\n'))}>{t('copy') || 'Copy All'}</button>''',
    '''  const [type, setType] = useState('fantasy');
  const [count, setCount] = useState(10);
  const [names, setNames] = useState([]);

  const generators = {
    fantasy: () => `${['Ael','Bry','Cor','Dae','Ely','Fyn','Gor','Hyl','Ith','Jor','Kel','Lyr','Myr','Nym','Oryn','Pyr','Qyl','Ryn','Syl','Tyr','Val','Wyn','Xyl','Yrn','Zor'][Math.floor(Math.random()*26)]}${['a','e','i','o','u','ia','ea','io','ae','ui'][Math.floor(Math.random()*10)]}${['n','r','l','s','th','rd','ld','rn','rn','rth'][Math.floor(Math.random()*10)]}`,
    scifi: () => `${['X','Z','Q','V','K','J','R','T','N','M'][Math.floor(Math.random()*10)]}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
    realistic: () => `${['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth','David','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen'][Math.floor(Math.random()*20)]} ${['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez'][Math.floor(Math.random()*10)]}`,
    japanese: () => `${['Sato','Suzuki','Takahashi','Tanaka','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato'][Math.floor(Math.random()*10)]} ${['Hiroshi','Takashi','Kenji','Yuki','Sakura','Haruka','Akira','Daiki','Ren','Sora'][Math.floor(Math.random()*10)]}`,
    business: () => `${['Apex','Nova','Zenith','Prime','Core','Flux','Vibe','Nexus','Pulse','Spark'][Math.floor(Math.random()*10)]} ${['Labs','Systems','Tech','Solutions','Group','Works','Studio','Hub','Collective','Dynamics'][Math.floor(Math.random()*10)]}`,
  };

  const generate = () => {
    const results = [];
    for (let i = 0; i < count; i++) results.push(generators[type]());
    setNames(results);
  };'''
)

# === ASCII Art Generator ===
write_page('ascii-art', '''<div className="mb-3">
            <label className="os9-label">{t('text') || 'Text'}</label>
            <input className="os9-input w-full" type="text" value={text} onChange={(e) => setText(e.target.value.toUpperCase())} maxLength={10} />
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('font') || 'Font'}</label>
            <select className="os9-select" value={font} onChange={(e) => setFont(e.target.value)}>
              <option value="standard">Standard</option>
              <option value="slant">Slant</option>
              <option value="banner">Banner</option>
              <option value="small">Small</option>
            </select>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate') || 'Generate'}</button>
          {art && (
            <div className="mb-3">
              <label className="os9-label">{t('result') || 'Result'}</label>
              <pre className="os9-input w-full font-mono text-xs" style={{ whiteSpace: 'pre', overflow: 'auto' }}>{art}</pre>
            </div>
          )}
          <button className="os9-btn w-full text-xs py-2" onClick={() => navigator.clipboard.writeText(art)}>{t('copy') || 'Copy'}</button>''',
    '''  const [text, setText] = useState('HELLO');
  const [font, setFont] = useState('standard');
  const [art, setArt] = useState('');

  const fonts = {
    standard: { H: ' #    #  ######  #       #  #######', E: ' #######  #       #####   #       #  #######', L: ' #       #       #       #       #  #######', O: '  #####   #     #  #     #  #     #   #####  ' },
    slant: { H: '   #    #   ######   #      #  #######', E: '  ######   #      #   ####    #      #   ######', L: '  #      #      #      #      #      #   #######', O: '   #####   #     #   #     #   #     #   ##### ' },
    banner: { H: '#    #  ######  #    #  #    #  #######', E: '######   #      #     #   ####    #      #  ######', L: '#      #      #      #      #      #      ######', O: ' ####   #    #  #    #  #    #  #    #   #### ' },
    small: { H: '#   #  #####  #   #  #     #####', E: '#####  #      #     ###   #      #   #####', L: '#    #    #    #    #    #    #    #####', O: ' ###  #   #  #   #  #   #  #   #  ### ' }
  };

  const generate = () => {
    if (!text) return;
    const f = fonts[font] || fonts.standard;
    const lines = ['','','','','',''];
    for (const ch of text) {
      const charArt = f[ch] || '       ';
      const parts = charArt.split('  ');
      for (let i = 0; i < 6; i++) lines[i] += (parts[i] || '') + '  ';
    }
    setArt(lines.join('\\n'));
  };'''
)

print("\nBatch 3 complete!")