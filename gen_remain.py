#!/usr/bin/env python3
"""Generate remaining page.js files using Python (no template literal issues)"""
import os, json

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
LOCALE_DIR = 'src/app/[locale]'

def write_page(tool, body, state_extra=""):
    """Write a page.js file"""
    lines = ["'use client';", "",
             "import { useState, useCallback } from 'react';",
             "import { useParams } from 'next/navigation';"]
    for loc in LOCALES:
        lines.append(f"import {loc}Msgs from '../../../messages/{loc}/{tool}.json';")
    lines.append(f"const pageMsgs = {{ en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs }};")
    
    name = ''.join(w.capitalize() for w in tool.replace('-', ' ').split())
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
    lines.append('      <div className="os9-window" style={{ maxWidth: 520, width: \'100%\' }}>')
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
    
    # Body
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

# Now create all remaining tools

# 1. Inflation Calculator
write_page('inflation', '''<div className="grid grid-cols-3 gap-2 mb-3">
            <div className="col-span-3"><label className="os9-label">{t('amount')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div><label className="os9-label">{t('fromYear')}</label><select className="os9-select" value={fromYear} onChange={(e) => setFromYear(e.target.value)}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div><label className="os9-label">{t('toYear')}</label><select className="os9-select" value={toYear} onChange={(e) => setToYear(e.target.value)}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div className="flex items-end"><button className="os9-btn os9-btn-primary w-full" onClick={calc}>{t('calculate')}</button></div>
          </div>
          {result && <div className="os9-result mb-3"><div className="text-sm"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('equivalentValue') || 'Equivalent Value'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>${result.equivalent.toFixed(2)}</div><div className="text-[10px]" style={{ opacity: 0.6 }}>{t('inflationRate') || 'Inflation Rate'}: {result.rate.toFixed(2)}%</div></div></div>}''',
    '''  const [amount, setAmount] = useState('1000');
  const [fromYear, setFromYear] = useState('2020');
  const [toYear, setToYear] = useState('2025');
  const [result, setResult] = useState(null);
  const years = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const cpi = {2015:237.0,2016:240.0,2017:245.1,2018:251.1,2019:255.7,2020:258.8,2021:271.0,2022:292.7,2023:304.7,2024:313.0,2025:319.0};

  const calc = () => {
    const amt = parseFloat(amount);
    const fy = cpi[fromYear];
    const ty = cpi[toYear];
    if (!isNaN(amt) && fy && ty) {
      const equivalent = amt * ty / fy;
      const rate = ((ty - fy) / fy) * 100;
      setResult({ equivalent, rate });
    }
  };'''
)

# 2. BAC Calculator
write_page('bac', '''<div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="os9-label">{t('weight')}</label><input className="os9-input" type="number" min="30" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
            <div><label className="os9-label">{t('gender')}</label><div className="flex gap-2 mt-1">
              <button className={'os9-btn flex-1 text-xs px-1' + (gender === 'male' ? ' os9-btn-primary' : '')} onClick={() => setGender('male')}>{t('male')}</button>
              <button className={'os9-btn flex-1 text-xs px-1' + (gender === 'female' ? ' os9-btn-primary' : '')} onClick={() => setGender('female')}>{t('female')}</button>
            </div></div>
            <div><label className="os9-label">{t('drinks')}</label><input className="os9-input" type="number" min="0" value={drinks} onChange={(e) => setDrinks(e.target.value)} /></div>
            <div><label className="os9-label">{t('hours')}</label><input className="os9-input" type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('calculate')}</button>
          {result !== null && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('bacResult') || 'BAC'}</div><div className="os9-big-number" style={{ fontSize: '2rem', color: result > 0.08 ? '#dc3545' : result > 0.05 ? '#ffc107' : '#28a745' }}>{result.toFixed(3)}%</div></div>}''',
    '''  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState('male');
  const [drinks, setDrinks] = useState('3');
  const [hours, setHours] = useState('2');
  const [result, setResult] = useState(null);

  const calc = () => {
    const w = parseFloat(weight);
    const d = parseFloat(drinks);
    const h = parseFloat(hours);
    if (isNaN(w) || isNaN(d) || isNaN(h) || w <= 0) return;
    const r = gender === 'male' ? 0.68 : 0.55;
    const bac = (d * 14 / (w * 453.592 * r)) * 100 - (h * 0.015);
    setResult(Math.max(0, bac));
  };'''
)

# 3. Credit Card Payoff
write_page('creditcard', '''<div className="mb-3"><label className="os9-label">{t('balance')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={balance} onChange={(e) => setBalance(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="os9-label">{t('apr')}</label><input className="os9-input" type="number" min="0" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} /></div>
            <div><label className="os9-label">{t('payment')}</label><input className="os9-input" type="number" min="0" step="any" value={payment} onChange={(e) => setPayment(e.target.value)} /></div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('calculate')}</button>
          {result && <div className="os9-result mb-3"><div className="grid grid-cols-2 gap-2 text-sm text-center">
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('months') || 'Months'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>{result.months}</div></div>
            <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalInterest') || 'Total Interest'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>${result.totalInterest.toFixed(2)}</div></div>
          </div></div>}''',
    '''  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('18');
  const [payment, setPayment] = useState('200');
  const [result, setResult] = useState(null);

  const calc = () => {
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
  };'''
)

print("\nDone!")
