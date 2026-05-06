'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const CATEGORIES = ['length', 'weight', 'temperature', 'volume', 'area', 'speed', 'pressure'];

const CONVERSIONS = {
  cmToInch:    { cat: 'length', fn: (v) => v / 2.54,            inv: 'inToCm' },
  mToFt:       { cat: 'length', fn: (v) => v * 3.28084,         inv: 'ftToM' },
  kmToMile:    { cat: 'length', fn: (v) => v * 0.621371,        inv: 'mileToKm' },
  kgToLb:      { cat: 'weight', fn: (v) => v * 2.20462,         inv: 'lbToKg' },
  gToOz:       { cat: 'weight', fn: (v) => v * 0.035274,        inv: 'ozToG' },
  cToF:        { cat: 'temperature', fn: (v) => v * 9 / 5 + 32, inv: 'fToC' },
  lToGal:      { cat: 'volume', fn: (v) => v * 0.264172,       inv: 'galToL' },
  mlToFlOz:    { cat: 'volume', fn: (v) => v * 0.033814,       inv: 'flOzToMl' },
  sqmToSqft:   { cat: 'area', fn: (v) => v * 10.7639,          inv: 'sqftToSqm' },
  haToAcre:    { cat: 'area', fn: (v) => v * 2.47105,          inv: 'acreToHa' },
  kmhToMph:    { cat: 'speed', fn: (v) => v * 0.621371,        inv: 'mphToKmh' },
  kpaToPsi:    { cat: 'pressure', fn: (v) => v * 0.145038,     inv: 'psiToKpa' },
};

const INVERSE = {
  inToCm:      (v) => v * 2.54,
  ftToM:       (v) => v / 3.28084,
  mileToKm:    (v) => v / 0.621371,
  lbToKg:      (v) => v / 2.20462,
  ozToG:       (v) => v / 0.035274,
  fToC:        (v) => (v - 32) * 5 / 9,
  galToL:      (v) => v / 0.264172,
  flOzToMl:    (v) => v / 0.033814,
  sqftToSqm:   (v) => v / 10.7639,
  acreToHa:    (v) => v / 2.47105,
  mphToKmh:    (v) => v / 0.621371,
  psiToKpa:    (v) => v / 0.145038,
};

const CONV_LIST = Object.keys(CONVERSIONS);

export default function ConvertPage() {
  const t = useTranslations('convert');
  const params = useParams();
  const locale = params?.locale || 'en';

  const changeLang = (l) => { window.location.href = '/' + l + '/convert'; };

  const [category, setCategory] = useState('length');
  const [convKey, setConvKey] = useState('cmToInch');
  const [direction, setDirection] = useState('forward');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const filtered = CONV_LIST.filter(function(k) { return CONVERSIONS[k].cat === category; });

  const handleCatChange = function(newCat) {
    setCategory(newCat);
    const first = CONV_LIST.find(function(k) { return CONVERSIONS[k].cat === newCat; });
    if (first) setConvKey(first);
    setInput('');
    setResult(null);
  };

  const handleConvChange = function(key) {
    setConvKey(key);
    setInput('');
    setResult(null);
  };

  const doConvert = function() {
    const val = parseFloat(input);
    if (isNaN(val)) return;
    let res;
    if (direction === 'forward') {
      res = CONVERSIONS[convKey].fn(val);
    } else {
      res = INVERSE[CONVERSIONS[convKey].inv](val);
    }
    const rounded = Math.round(res * 1000000) / 1000000;
    setResult(rounded);
    setTimeout(function() { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const keyDown = function(e) { if (e.key === 'Enter') doConvert(); };

  const copyRes = function() {
    if (result === null) return;
    const label = direction === 'forward' ? t(convKey) : t(CONVERSIONS[convKey].inv);
    const txt = label + ': ' + input + ' = ' + result;
    navigator.clipboard.writeText(txt).then(function() { setCopied(true); setTimeout(function() { setCopied(false); }, 2500); });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 520, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="os9-label">{t('category') || 'Category'}</label>
            <select className="os9-select" value={category} onChange={function(e) { handleCatChange(e.target.value); }}>
              {CATEGORIES.map(function(c) { return <option key={c} value={c}>{t(c)}</option>; })}
            </select>
          </div>

          <div className="mb-3">
            <label className="os9-label">{t('conversion') || 'Conversion'}</label>
            <select className="os9-select" value={convKey} onChange={function(e) { handleConvChange(e.target.value); }}>
              {filtered.map(function(k) { return <option key={k} value={k}>{t(k)}</option>; })}
            </select>
          </div>

          <div className="flex gap-2 mb-4">
            <button className={'os9-btn flex-1 text-xs px-1' + (direction === 'forward' ? ' os9-btn-primary' : '')}
              onClick={function() { setDirection('forward'); setResult(null); }}>{t('from')}</button>
            <button className={'os9-btn flex-1 text-xs px-1' + (direction === 'reverse' ? ' os9-btn-primary' : '')}
              onClick={function() { setDirection('reverse'); setResult(null); }}>{t('to')}</button>
          </div>

          <div className="mb-5">
            <label className="os9-label">{t('from')}</label>
            <input className="os9-input" type="number" step="any" value={input}
              onChange={function(e) { setInput(e.target.value); }}
              onKeyDown={keyDown}
              placeholder={direction === 'forward' ? t(convKey) : t(CONVERSIONS[convKey].inv)} />
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={doConvert}>{t('convert')}</button>

          {result !== null && (
            <div ref={ref} className="mt-5">
              <hr className="os9-divider" />
              <div className="os9-result text-center py-4">
                <div className="text-xs uppercase tracking-wider mb-1" style={{ opacity: 0.6 }}>{t('result')}</div>
                <div className="os9-big-number text-3xl">{result}</div>
                <div className="text-xs mt-1" style={{ opacity: 0.6 }}>
                  {direction === 'forward' ? t(convKey) : t(CONVERSIONS[convKey].inv)}
                </div>
              </div>
              <button className="os9-btn w-full text-xs py-2" onClick={copyRes}>{copied ? t('copied') : t('copy')}</button>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo Editor</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline" style={{ opacity: 0.7 }}>Lotto</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/pdf'} className="underline" style={{ opacity: 0.7 }}>PDF</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        {t('footer')}
      </div>
    </div>
  );
}