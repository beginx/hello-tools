'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/password.json';
import esMsgs from '../../../messages/es/password.json';
import zhMsgs from '../../../messages/zh/password.json';
import koMsgs from '../../../messages/ko/password.json';
import ptMsgs from '../../../messages/pt/password.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function shuffle(str) {
  const a = str.split('');
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
}

function generatePassword(length, useUpper, useLower, useNumbers, useSymbols) {
  let chars = '';
  if (useUpper) chars += UPPER;
  if (useLower) chars += LOWER;
  if (useNumbers) chars += DIGITS;
  if (useSymbols) chars += SYMBOLS;
  if (!chars) return '';

  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars[buf[i] % chars.length];
  }

  // Ensure at least one char from each selected set
  if (useUpper) {
    const idx = Math.floor(Math.random() * length);
    pwd = pwd.substring(0, idx) + UPPER[Math.floor(Math.random() * UPPER.length)] + pwd.substring(idx + 1);
  }
  if (useLower) {
    const idx = Math.floor(Math.random() * length);
    pwd = pwd.substring(0, idx) + LOWER[Math.floor(Math.random() * LOWER.length)] + pwd.substring(idx + 1);
  }
  if (useNumbers) {
    const idx = Math.floor(Math.random() * length);
    pwd = pwd.substring(0, idx) + DIGITS[Math.floor(Math.random() * DIGITS.length)] + pwd.substring(idx + 1);
  }
  if (useSymbols) {
    const idx = Math.floor(Math.random() * length);
    pwd = pwd.substring(0, idx) + SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] + pwd.substring(idx + 1);
  }

  return shuffle(pwd);
}

function calcStrength(pwd, len) {
  let variety = 0;
  if (/[A-Z]/.test(pwd)) variety++;
  if (/[a-z]/.test(pwd)) variety++;
  if (/[0-9]/.test(pwd)) variety++;
  if (/[^A-Za-z0-9]/.test(pwd)) variety++;
  const score = len * variety;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

export default function PasswordPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/password'; };

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const gen = useCallback(() => {
    setCopied(false);
    setPassword(generatePassword(length, useUpper, useLower, useNumbers, useSymbols));
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const doCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const strength = password ? calcStrength(password, length) : 0;
  const strengthLabels = ['', t('weak'), t('medium'), t('strong'), t('veryStrong')];
  const strengthColors = ['', '#cc3333', '#cc8800', '#3388cc', '#22aa22'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 480, width: '100%' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Length */}
          <div className="mb-4">
            <label className="os9-label">{t('length')}: {length} {t('characters')}</label>
            <input type="range" min={4} max={64} value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full" style={{ accentColor: 'var(--os9-accent)' }} />
            <div className="flex justify-between text-[10px]" style={{ opacity: 0.5 }}>
              <span>4</span><span>16</span><span>32</span><span>48</span><span>64</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mb-4">
            <label className="os9-label mb-2">{t('include')}</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'uppercase', val: useUpper, set: setUseUpper },
                { key: 'lowercase', val: useLower, set: setUseLower },
                { key: 'numbers', val: useNumbers, set: setUseNumbers },
                { key: 'symbols', val: useSymbols, set: setUseSymbols },
              ].map(({ key, val, set }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" checked={val} onChange={() => set(!val)}
                    style={{ accentColor: 'var(--os9-accent)' }} />
                  {t(key)}
                </label>
              ))}
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={gen}>
            {t('generate')}
          </button>

          {password && (
            <div className="mt-5">
              <hr className="os9-divider" />

              {/* Password display */}
              <div className="os9-result mb-3">
                <div className="flex items-center gap-2">
                  <input className="os9-input font-mono text-lg" readOnly value={password}
                    onClick={(e) => e.target.select()} style={{ fontSize: password.length > 30 ? '11px' : '16px' }} />
                  <button className="os9-btn !px-3 !py-2 text-xs whitespace-nowrap" onClick={doCopy}>
                    {copied ? t('copied') : t('copy')}
                  </button>
                </div>
              </div>

              {/* Strength */}
              {strength > 0 && (
                <div className="os9-result text-center">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.6 }}>{t('strength')}</p>
                  <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: '#ddd' }}>
                    <div style={{ flex: '25', background: strength >= 1 ? strengthColors[1] : '#ddd', height: '100%' }} />
                    <div style={{ flex: '25', background: strength >= 2 ? strengthColors[2] : '#ddd', height: '100%' }} />
                    <div style={{ flex: '25', background: strength >= 3 ? strengthColors[3] : '#ddd', height: '100%' }} />
                    <div style={{ flex: '25', background: strength >= 4 ? strengthColors[4] : '#ddd', height: '100%' }} />
                  </div>
                  <p className="text-sm font-bold mt-1" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </p>
                  <p className="text-xs mt-2" style={{ opacity: 0.5 }}>{t('secureNote')}</p>
                </div>
              )}
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/qr`} className="underline">QR Code Generator</a>
                <a href={`/${locale}/random`} className="underline">Random Generator</a>
                <a href={`/${locale}/lotto`} className="underline">Lotto Odds Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo Editor</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
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
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/text'} className="underline" style={{ opacity: 0.7 }}>Text</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}