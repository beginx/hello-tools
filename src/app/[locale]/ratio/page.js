'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/ratio.json';
import esMsgs from '../../../messages/es/ratio.json';
import zhMsgs from '../../../messages/zh/ratio.json';
import koMsgs from '../../../messages/ko/ratio.json';
import ptMsgs from '../../../messages/pt/ratio.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export default function RatioPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/ratio'; };

  const [mode, setMode] = useState('simplify');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (mode === 'simplify') {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      if (numA <= 0 || numB <= 0) return;
      const g = gcd(numA, numB);
      setResult({ type: 'simplify', a: numA / g, b: numB / g });
    } else {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      const numC = parseInt(c) || 0;
      const numD = parseInt(d) || 0;
      let filled = null;
      if (numA > 0 && numB > 0 && numC > 0 && numD <= 0) {
        filled = { label: 'D', value: (numB * numC) / numA };
      } else if (numA > 0 && numB > 0 && numD > 0 && numC <= 0) {
        filled = { label: 'C', value: (numA * numD) / numB };
      } else if (numA > 0 && numC > 0 && numD > 0 && numB <= 0) {
        filled = { label: 'B', value: (numA * numD) / numC };
      } else if (numB > 0 && numC > 0 && numD > 0 && numA <= 0) {
        filled = { label: 'A', value: (numB * numC) / numD };
      }
      if (filled) {
        setResult({ type: 'find', ...filled, a: numA || filled.value, b: numB || filled.value, c: numC || filled.value, d: numD || filled.value });
      }
    }
  };

  const clear = () => { setA(''); setB(''); setC(''); setD(''); setResult(null); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 420, width: '100%' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="os9-label">{t('modeLabel')}</label>
            <div className="flex gap-2">
              <button className={'os9-btn flex-1 !px-2 !py-2 text-xs ' + (mode === 'simplify' ? 'os9-btn-primary' : '')}
                onClick={() => { setMode('simplify'); setResult(null); }}>{t('modeSimplify')}</button>
              <button className={'os9-btn flex-1 !px-2 !py-2 text-xs ' + (mode === 'find' ? 'os9-btn-primary' : '')}
                onClick={() => { setMode('find'); setResult(null); }}>{t('modeFind')}</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="os9-label">{t('aLabel')}</label>
              <input className="os9-input" type="number" min={0} value={a} onChange={(e) => setA(e.target.value)} placeholder="0" />
            </div>
            <span className="text-lg font-bold mt-5" style={{ opacity: 0.6 }}>:</span>
            <div className="flex-1">
              <label className="os9-label">{t('bLabel')}</label>
              <input className="os9-input" type="number" min={0} value={b} onChange={(e) => setB(e.target.value)} placeholder="0" />
            </div>
          </div>

          {mode === 'find' && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="os9-label">{t('cLabel')}</label>
                <input className="os9-input" type="number" min={0} value={c} onChange={(e) => setC(e.target.value)} placeholder="0" />
              </div>
              <span className="text-lg font-bold mt-5" style={{ opacity: 0.6 }}>:</span>
              <div className="flex-1">
                <label className="os9-label">{t('dLabel')}</label>
                <input className="os9-input" type="number" min={0} value={d} onChange={(e) => setD(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={calculate}>{t('calculate')}</button>
            <button className="os9-btn !px-4" onClick={clear}>{t('clear')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <div className="os9-result text-center">
                {result.type === 'simplify' && (
                  <>
                    <p className="os9-label mb-1">{t('resultSimplify')}</p>
                    <p className="os9-big-number">{Math.round(result.a)}:{Math.round(result.b)}</p>
                  </>
                )}
                {result.type === 'find' && (
                  <>
                    <p className="os9-label mb-1">{t('resultFind')}</p>
                    <p className="os9-big-number">{Math.round(result.a)}:{Math.round(result.b)} = {Math.round(result.c)}:{Math.round(result.d)}</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:420,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:420,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/coinflip'} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/dice'} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/speed'} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ohm'} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
