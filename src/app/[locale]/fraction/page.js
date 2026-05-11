'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/fraction.json';
import esMsgs from '../../../messages/es/fraction.json';
import zhMsgs from '../../../messages/zh/fraction.json';
import koMsgs from '../../../messages/ko/fraction.json';
import ptMsgs from '../../../messages/pt/fraction.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }

function calcFraction(n1, d1, n2, d2, op, w1, w2, useMixed) {
  const a = (parseInt(w1) || 0) * (useMixed ? 1 : 0);
  const b = (parseInt(w2) || 0) * (useMixed ? 1 : 0);
  let num1 = parseInt(n1) || 0;
  let den1 = parseInt(d1) || 1;
  let num2 = parseInt(n2) || 0;
  let den2 = parseInt(d2) || 1;

  if (den1 === 0 || den2 === 0) return null;

  // Convert mixed numbers to improper
  if (useMixed) {
    num1 = a * den1 + (a < 0 ? -num1 : num1);
    num2 = b * den2 + (b < 0 ? -num2 : num2);
  }

  let resultNum, resultDen;
  switch (op) {
    case 'add':
      resultNum = num1 * den2 + num2 * den1;
      resultDen = den1 * den2;
      break;
    case 'subtract':
      resultNum = num1 * den2 - num2 * den1;
      resultDen = den1 * den2;
      break;
    case 'multiply':
      resultNum = num1 * num2;
      resultDen = den1 * den2;
      break;
    case 'divide':
      if (num2 === 0) return null;
      resultNum = num1 * den2;
      resultDen = den1 * num2;
      break;
    default: return null;
  }

  // Simplify
  const g = gcd(resultNum, resultDen);
  const simpNum = resultNum / g;
  const simpDen = resultDen / g;
  const decimal = resultNum / resultDen;

  // Mixed number conversion
  const absNum = Math.abs(simpNum);
  const wholePart = Math.floor(absNum / simpDen);
  const remainder = absNum % simpDen;
  let mixedStr = '';
  if (wholePart > 0) {
    mixedStr = (simpNum < 0 ? '-' : '') + wholePart;
    if (remainder > 0) mixedStr += ' ' + remainder + '/' + simpDen;
  } else {
    mixedStr = simpNum + '/' + simpDen;
  }

  return {
    display: simpNum + '/' + simpDen,
    decimal: Math.round(decimal * 1000000) / 1000000,
    mixed: mixedStr,
    simplified: simpDen === 1 ? String(simpNum) : simpNum + '/' + simpDen,
  };
}

export default function FractionPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/fraction'; };

  const [op, setOp] = useState('add');
  const [useMixed, setUseMixed] = useState(false);
  const [n1, setN1] = useState('');
  const [d1, setD1] = useState('');
  const [w1, setW1] = useState('');
  const [n2, setN2] = useState('');
  const [d2, setD2] = useState('');
  const [w2, setW2] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    setResult(calcFraction(n1, d1, n2, d2, op, w1, w2, useMixed));
  };

  const ops = ['add', 'subtract', 'multiply', 'divide'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 460, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          {/* Language selector */}
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Mixed numbers toggle */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={useMixed} onChange={() => setUseMixed(!useMixed)} />
              {t('useMixed')}
            </label>
          </div>

          {/* Fraction 1 */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">1{t('result')}</label>
            <div className="flex items-center gap-2">
              {useMixed && (
                <input className="os9-input !w-16 text-center" type="number"
                  value={w1} onChange={(e) => setW1(e.target.value)} placeholder={t('whole1')}
                  style={{ fontSize: 14, padding: '8px 4px' }} />
              )}
              <input className="os9-input !w-20 text-center" type="number"
                value={n1} onChange={(e) => setN1(e.target.value)} placeholder={t('placeholderNum')}
                style={{ fontSize: 16, padding: '10px 4px' }} />
              <span className="text-sm" style={{ opacity: 0.6 }}>/</span>
              <input className="os9-input !w-20 text-center" type="number"
                value={d1} onChange={(e) => setD1(e.target.value)} placeholder={t('placeholderDen')}
                style={{ fontSize: 16, padding: '10px 4px' }} />
            </div>
          </div>

          {/* Operator buttons */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {ops.map((o) => (
              <button key={o} className={`text-xs px-3 py-1 rounded-sm ${op === o ? 'font-bold' : ''}`}
                style={{
                  background: op === o ? 'var(--os9-red)' : 'var(--os9-bg)',
                  color: op === o ? '#fff' : 'inherit',
                  border: '1px solid var(--os9-border)',
                  flex: 1, minWidth: 60
                }}
                onClick={() => setOp(o)}>{t(o)}</button>
            ))}
          </div>

          {/* Fraction 2 */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">2{t('result')}</label>
            <div className="flex items-center gap-2">
              {useMixed && (
                <input className="os9-input !w-16 text-center" type="number"
                  value={w2} onChange={(e) => setW2(e.target.value)} placeholder={t('whole2')}
                  style={{ fontSize: 14, padding: '8px 4px' }} />
              )}
              <input className="os9-input !w-20 text-center" type="number"
                value={n2} onChange={(e) => setN2(e.target.value)} placeholder={t('placeholderNum')}
                style={{ fontSize: 16, padding: '10px 4px' }} />
              <span className="text-sm" style={{ opacity: 0.6 }}>/</span>
              <input className="os9-input !w-20 text-center" type="number"
                value={d2} onChange={(e) => setD2(e.target.value)} placeholder={t('placeholderDen')}
                style={{ fontSize: 16, padding: '10px 4px' }} />
            </div>
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('result')}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--os9-red)', fontSize: 22 }}>{result.display}</span>
              </div>
              {result.mixed !== result.display && (
                <div className="flex justify-between items-center mb-2 text-xs" style={{ opacity: 0.7 }}>
                  <span>{t('mixedNumber')}</span>
                  <span>{result.mixed}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-2 text-xs" style={{ opacity: 0.7 }}>
                <span>{t('asDecimal')}</span>
                <span>{result.decimal}</span>
              </div>
            </div>
          )}
          {!result && (n1 || n2) && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setN1(''); setD1(''); setN2(''); setD2(''); setW1(''); setW2(''); setResult(null); }}>{t('clear')}</button>
          </div>
        </div>
      </div>

      {/* SEO Content Section — hidden on small screens, visible on desktop below the calculator */}
      <div className="mt-6" style={{ maxWidth: 460, width: '100%' }}>
        <article className="text-xs leading-relaxed" style={{ opacity: 0.75, lineHeight: 1.7 }}>
          <h2 className="text-sm font-bold mb-2">{t('seoH1')}</h2>
          <p className="mb-3">{t('seoDesc')}</p>

          <h3 className="font-bold mb-1">{t('seoSections')}</h3>
          <p className="mb-2">{t('seoAddDesc')}</p>
          <p className="mb-2">{t('seoSubtractDesc')}</p>
          <p className="mb-2">{t('seoMultiplyDesc')}</p>
          <p className="mb-2">{t('seoDivideDesc')}</p>
          <p className="mb-2">{t('seoSimplify')}</p>
        </article>
      </div>

      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/fraction'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Fraction</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}