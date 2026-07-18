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

function header(tool, extra = '') {
  const name = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return `export default function ${name}Page() {\n  const params = useParams();\n  const locale = params?.locale || 'en';\n  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;\n  const changeLang = (l) => { window.location.href = '/' + l + '/${tool}'; };\n${extra}`;
}

function wrap(tool, body, state, maxW = '520') {
  return `${imports(tool)}\n${header(tool)}\n${state}\n\n  return (\n    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          ${body}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%', textAlign: 'center', fontSize: 10, opacity: 0.6, marginTop: 12 }}>
        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {t('footer') || 'hello-tools 2026'}
      </div>
    </div>
  );\n}\n`;
}

const make = (tool, state, body) => {
  const fp = `${LOCALE_DIR}/${tool}/page.js`;
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, wrap(tool, body, state));
  console.log(`  ✅ ${tool}`);
};

// === Data Size Converter ===
make('datasize', `  const [input, setInput] = useState('1');
  const [fromUnit, setFromUnit] = useState('MB');
  const [toUnit, setToUnit] = useState('KB');
  const [output, setOutput] = useState('');
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const unitToBytes = { 'Bytes': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776, 'PB': 1125899906842624 };`,
  `<div className="grid grid-cols-3 gap-2 mb-3">
    <div className="col-span-3">
      <label className="os9-label">{t('input')}</label>
      <input className="os9-input w-full" type="number" min="0" step="any" value={input} onChange={(e) => setInput(e.target.value)} />
    </div>
    <div>
      <label className="os9-label">{t('from') || 'From'}</label>
      <select className="os9-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
        {units.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
    <div>
      <label className="os9-label">{t('to') || 'To'}</label>
      <select className="os9-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
        {units.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
    <div className="flex items-end">
      <button className="os9-btn os9-btn-primary w-full" onClick={() => { const val = parseFloat(input); if (!isNaN(val)) setOutput((val * unitToBytes[fromUnit] / unitToBytes[toUnit]).toFixed(4)); }}>{t('convert')}</button>
    </div>
  </div>
  {output && <div className="mb-3"><label className="os9-label">{t('result') || 'Result'}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}`
);

// === Standard Deviation Calculator ===
make('standard-deviation', `  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);`,
  `<div className="mb-3">
    <label className="os9-label">{t('inputLabel') || 'Enter numbers'}</label>
    <textarea className="os9-input w-full" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'e.g. 12, 15, 18, 20, 22'} />
  </div>
  <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calculate}>{t('calculate')}</button>
  {result && <div className="os9-result mb-3"><div className="grid grid-cols-2 gap-2 text-sm">
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('count') || 'Count'}</div><div>{result.count}</div></div>
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('sum') || 'Sum'}</div><div>{result.sum.toFixed(4)}</div></div>
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('mean') || 'Mean'}</div><div>{result.mean.toFixed(4)}</div></div>
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('stdPop') || 'Std Dev (Pop)'}</div><div>{result.stdPop.toFixed(4)}</div></div>
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('stdSample') || 'Std Dev (Sample)'}</div><div>{result.stdSample.toFixed(4)}</div></div>
  </div></div>}`,
  `  const calculate = () => {
    const nums = input.split(/[,\\s]+/).map(Number).filter(n => !isNaN(n));
    if (nums.length < 2) return;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const sqDiffs = nums.map(n => Math.pow(n - mean, 2));
    const variancePop = sqDiffs.reduce((a, b) => a + b, 0) / nums.length;
    const varianceSample = sqDiffs.reduce((a, b) => a + b, 0) / (nums.length - 1);
    setResult({ count: nums.length, sum, mean, stdPop: Math.sqrt(variancePop), stdSample: Math.sqrt(varianceSample) });
  };`
);

// === Inflation Calculator ===
make('inflation', `  const [amount, setAmount] = useState('1000');
  const [fromYear, setFromYear] = useState('2020');
  const [toYear, setToYear] = useState('2025');
  const [result, setResult] = useState(null);
  // US CPI data (simplified)
  const cpi = { '2015': 237.0, '2016': 240.0, '2017': 245.1, '2018': 251.1, '2019': 255.7, '2020': 258.8, '2021': 271.0, '2022': 292.7, '2023': 304.7, '2024': 313.0, '2025': 319.0 };`,
  `<div className="grid grid-cols-3 gap-2 mb-3">
    <div className="col-span-3"><label className="os9-label">{t('amount')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
    <div><label className="os9-label">{t('fromYear')}</label><select className="os9-select" value={fromYear} onChange={(e) => setFromYear(e.target.value)}>{Object.keys(cpi).map(y => <option key={y} value={y}>{y}</option>)}</select></div>
    <div><label className="os9-label">{t('toYear')}</label><select className="os9-select" value={toYear} onChange={(e) => setToYear(e.target.value)}>{Object.keys(cpi).map(y => <option key={y} value={y}>{y}</option>)}</select></div>
    <div className="flex items-end"><button className="os9-btn os9-btn-primary w-full" onClick={calc}>{t('calculate')}</button></div>
  </div>
  {result && <div className="os9-result mb-3"><div className="text-sm"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('equivalentValue') || 'Equivalent Value'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>\${result.equivalent.toFixed(2)}</div><div className="text-[10px]" style={{ opacity: 0.6 }}>{t('inflationRate') || 'Inflation Rate'}: {result.rate.toFixed(2)}%</div></div></div>}`,
  `  const calc = () => {
    const amt = parseFloat(amount);
    const fy = cpi[fromYear];
    const ty = cpi[toYear];
    if (!isNaN(amt) && fy && ty) {
      const equivalent = amt * ty / fy;
      const rate = ((ty - fy) / fy) * 100;
      setResult({ equivalent, rate });
    }
  };`
);

// === BAC Calculator ===
make('bac', `  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState('male');
  const [drinks, setDrinks] = useState('3');
  const [hours, setHours] = useState('2');
  const [result, setResult] = useState(null);`,
  `<div className="grid grid-cols-2 gap-3 mb-3">
    <div><label className="os9-label">{t('weight')}</label><input className="os9-input" type="number" min="30" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
    <div><label className="os9-label">{t('gender')}</label>
      <div className="flex gap-2 mt-1">
        <button className={'os9-btn flex-1 text-xs px-1' + (gender === 'male' ? ' os9-btn-primary' : '')} onClick={() => setGender('male')}>{t('male')}</button>
        <button className={'os9-btn flex-1 text-xs px-1' + (gender === 'female' ? ' os9-btn-primary' : '')} onClick={() => setGender('female')}>{t('female')}</button>
      </div>
    </div>
    <div><label className="os9-label">{t('drinks')}</label><input className="os9-input" type="number" min="0" value={drinks} onChange={(e) => setDrinks(e.target.value)} /></div>
    <div><label className="os9-label">{t('hours')}</label><input className="os9-input" type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
  </div>
  <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('calculate')}</button>
  {result !== null && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('bacResult') || 'BAC'}</div><div className="os9-big-number" style={{ fontSize: '2rem', color: result > 0.08 ? '#dc3545' : result > 0.05 ? '#ffc107' : '#28a745' }}>{result.toFixed(3)}%</div></div>}`,
  `  const calc = () => {
    const w = parseFloat(weight);
    const d = parseFloat(drinks);
    const h = parseFloat(hours);
    if (isNaN(w) || isNaN(d) || isNaN(h) || w <= 0) return;
    const r = gender === 'male' ? 0.68 : 0.55;
    const bac = (d * 14 / (w * 453.592 * r)) * 100 - (h * 0.015);
    setResult(Math.max(0, bac));
  };`
);

// === Credit Card Payoff ===
make('creditcard', `  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('18');
  const [payment, setPayment] = useState('200');
  const [result, setResult] = useState(null);`,
  `<div className="mb-3"><label className="os9-label">{t('balance')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={balance} onChange={(e) => setBalance(e.target.value)} /></div>
  <div className="grid grid-cols-2 gap-3 mb-3">
    <div><label className="os9-label">{t('apr')}</label><input className="os9-input" type="number" min="0" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} /></div>
    <div><label className="os9-label">{t('payment')}</label><input className="os9-input" type="number" min="0" step="any" value={payment} onChange={(e) => setPayment(e.target.value)} /></div>
  </div>
  <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('calculate')}</button>
  {result && <div className="os9-result mb-3"><div className="grid grid-cols-2 gap-2 text-sm text-center">
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('months') || 'Months'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>{result.months}</div></div>
    <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalInterest') || 'Total Interest'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>${result.totalInterest.toFixed(2)}</div></div>
  </div></div>}`,
  `  const calc = () => {
    let bal = parseFloat(balance);
    const rate = parseFloat(apr) / 100 / 12;
    const pmt = parseFloat(payment);
    if (isNaN(bal) || isNaN(rate) || isNaN(pmt) || bal <= 0 || pmt <= 0) return;
    let months = 0, totalInterest = 0;
    while (bal > 0 && months < 600) {
      const interest = bal * rate;
      totalInterest += interest;
      bal = bal + interest - pmt;
      months++;
    }
    setResult({ months, totalInterest });
  };`
);

// === Time Calculator ===
make('time-calc', `  const [hours1, setHours1] = useState('2');
  const [mins1, setMins1] = useState('30');
  const [hours2, setHours2] = useState('1');
  const [mins2, setMins2] = useState('45');
  const [result, setResult] = useState(null);`,
  `<div className="grid grid-cols-2 gap-3 mb-3">
    <div><label className="os9-label">{t('hours') || 'Hours'}</label><input className="os9-input" type="number" min="0" value={hours1} onChange={(e) => setHours1(e.target.value)} /></div>
    <div><label className="os9-label">{t('minutes') || 'Minutes'}</label><input className="os9-input" type="number" min="0" max="59" value={mins1} onChange={(e) => setMins1(e.target.value)} /></div>
    <div><label className="os9-label">{t('hours') || 'Hours'}</label><input className="os9-input" type="number" min="0" value={hours2} onChange={(e) => setHours2(e.target.value)} /></div>
    <div><label className="os9-label">{t('minutes') || 'Minutes'}</label><input className="os9-input" type="number" min="0" max="59" value={mins2} onChange={(e) => setMins2(e.target.value)} /></div>
  </div>
  <div className="flex gap-2 mb-3">
    <button className="os9-btn os9-btn-primary flex-1" onClick={add}>{t('add') || 'Add'}</button>
    <button className="os9-btn flex-1" onClick={subtract}>{t('subtract') || 'Subtract'}</button>
  </div>
  {result && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('result')}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>{result.hours}h {result.minutes}m</div><div className="text-xs" style={{ opacity: 0.6 }}>{t('totalMinutes') || 'Total Minutes'}: {result.totalMins}</div></div>}`,
  `  const calc = (op) => {
    const h1 = parseInt(hours1) || 0, m1 = parseInt(mins1) || 0;
    const h2 = parseInt(hours2) || 0, m2 = parseInt(mins2) || 0;
    const t1 = h1 * 60 + m1, t2 = h2 * 60 + m2;
    const total = op === 'add' ? t1 + t2 : Math.max(0, t1 - t2);
    setResult({ hours: Math.floor(total / 60), minutes: total % 60, totalMins: total });
  };
  const add = () => calc('add');
  const subtract = () => calc('subtract');`
);

// === Cooking Converter ===
make('cooking', `  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('ml');
  const [output, setOutput] = useState('');
  const conversions = { 'cup': 240, 'tbsp': 15, 'tsp': 5, 'ml': 1, 'l': 1000, 'floz': 29.574, 'pint': 473.176 };`,
  `<div className="grid grid-cols-3 gap-2 mb-3">
    <div className="col-span-3"><label className="os9-label">{t('amount')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
    <div><label className="os9-label">{t('from') || 'From'}</label><select className="os9-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>{Object.keys(conversions).map(u => <option key={u} value={u}>{u}</option>)}</select></div>
    <div><label className="os9-label">{t('to') || 'To'}</label><select className="os9-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>{Object.keys(conversions).map(u => <option key={u} value={u}>{u}</option>)}</select></div>
    <div className="flex items-end"><button className="os9-btn os9-btn-primary w-full" onClick={() => { const v = parseFloat(amount); if (!isNaN(v)) setOutput((v * conversions[fromUnit] / conversions[toUnit]).toFixed(2)); }}>{t('convert')}</button></div>
  </div>
  {output && <div className="mb-3"><label className="os9-label">{t('result') || 'Result'}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}`
);

// === Timezone Converter ===
make('timezone', `  const [time, setTime] = useState('');
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Europe/London');
  const [result, setResult] = useState('');
  const timezones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Dubai', 'Australia/Sydney', 'Pacific/Auckland', 'UTC'];`,
  `<div className="mb-3"><label className="os9-label">{t('selectTimezone') || 'Time'}</label><input className="os9-input w-full" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
  <div className="grid grid-cols-2 gap-3 mb-3">
    <div><label className="os9-label">{t('from') || 'From'}</label><select className="os9-select" value={fromTz} onChange={(e) => setFromTz(e.target.value)}>{timezones.map(tz => <option key={tz} value={tz}>{tz.split('/').pop()}</option>)}</select></div>
    <div><label className="os9-label">{t('to') || 'To'}</label><select className="os9-select" value={toTz} onChange={(e) => setToTz(e.target.value)}>{timezones.map(tz => <option key={tz} value={tz}>{tz.split('/').pop()}</option>)}</select></div>
  </div>
  <button className="os9-btn os9-btn-primary w-full mb-3" onClick={convert}>{t('convert')}</button>
  {result && <div className="os9-result mb-3 text-center"><div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('convertedTime') || 'Converted Time'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{result}</div></div>}`,
  `  const convert = () => {
    const now = time ? new Date('2024-01-01T' + time) : new Date();
    try {
      const opts = { timeZone: toTz, hour: '2-digit', minute: '2-digit', hour12: true };
      setResult(new Intl.DateTimeFormat('en-US', opts).format(now));
    } catch(e) { setResult(t('error') || 'Error'); }
  };`
);

console.log('\\nDone! Batch 3 complete.');
