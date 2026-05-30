'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/percent.json';
import esMsgs from '../../../messages/es/percent.json';
import zhMsgs from '../../../messages/zh/percent.json';
import koMsgs from '../../../messages/ko/percent.json';
import ptMsgs from '../../../messages/pt/percent.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const TABS = ['whatIs', 'percentOf', 'change'];

export default function PercentPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/percent'; };

  const [tab, setTab] = useState('whatIs');

  // whatIs: X% of Y = ?
  const [pctVal, setPctVal] = useState('20');
  const [ofVal, setOfVal] = useState('200');
  const [r1, setR1] = useState(null);

  // percentOf: X is what % of Y?
  const [isVal, setIsVal] = useState('50');
  const [ofVal2, setOfVal2] = useState('200');
  const [r2, setR2] = useState(null);

  // change: X to Y = ?%
  const [fromVal, setFromVal] = useState('150');
  const [toVal, setToVal] = useState('200');
  const [r3, setR3] = useState(null);

  const calcWhatIs = () => {
    const p = parseFloat(pctVal) || 0;
    const o = parseFloat(ofVal) || 0;
    if (o === 0) return;
    setR1(p * o / 100);
  };

  const calcPercentOf = () => {
    const i = parseFloat(isVal) || 0;
    const o = parseFloat(ofVal2) || 0;
    if (o === 0) return;
    setR2(Math.round(i / o * 10000) / 100);
  };

  const calcChange = () => {
    const f = parseFloat(fromVal) || 0;
    const tVal = parseFloat(toVal) || 0;
    if (f === 0) return;
    setR3(Math.round((tVal - f) / f * 10000) / 100);
  };

  const keyDown = (fn) => (e) => { if (e.key === 'Enter') fn(); };

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

          {/* Tabs */}
          <div className="os9-tab-group w-full">
            {TABS.map(k => (
              <button key={k}
                className={'os9-tab text-[10px] ' + (tab === k ? 'os9-tab-active' : '')}
                onClick={() => { setTab(k); setR1(null); setR2(null); setR3(null); }}>
                {t(k)}
              </button>
            ))}
          </div>

          <div className="os9-result" style={{ borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
            {/* Tab: What is X% of Y */}
            {tab === 'whatIs' && (
              <div>
                <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t('whatIsDesc')}</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="os9-label">X (%)</label>
                    <input className="os9-input" type="number" step="any" value={pctVal}
                      onChange={(e) => setPctVal(e.target.value)} onKeyDown={keyDown(calcWhatIs)} placeholder="20" />
                  </div>
                  <div>
                    <label className="os9-label">Y</label>
                    <input className="os9-input" type="number" step="any" value={ofVal}
                      onChange={(e) => setOfVal(e.target.value)} onKeyDown={keyDown(calcWhatIs)} placeholder="200" />
                  </div>
                </div>
                <button className="os9-btn os9-btn-primary w-full text-sm py-3" onClick={calcWhatIs}>{t('calculate')}</button>
                {r1 !== null && (
                  <div className="mt-4">
                    <hr className="os9-divider" />
                    <div className="os9-result text-center">
                      <p className="text-xs mb-1" style={{ opacity: 0.6 }}>{pctVal}% {t('of')} {ofVal}</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--os9-accent)' }}>{r1.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: X is what % of Y */}
            {tab === 'percentOf' && (
              <div>
                <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t('percentOf')}</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="os9-label">X</label>
                    <input className="os9-input" type="number" step="any" value={isVal}
                      onChange={(e) => setIsVal(e.target.value)} onKeyDown={keyDown(calcPercentOf)} placeholder="50" />
                  </div>
                  <div>
                    <label className="os9-label">Y</label>
                    <input className="os9-input" type="number" step="any" value={ofVal2}
                      onChange={(e) => setOfVal2(e.target.value)} onKeyDown={keyDown(calcPercentOf)} placeholder="200" />
                  </div>
                </div>
                <button className="os9-btn os9-btn-primary w-full text-sm py-3" onClick={calcPercentOf}>{t('calculate')}</button>
                {r2 !== null && (
                  <div className="mt-4">
                    <hr className="os9-divider" />
                    <div className="os9-result text-center">
                      <p className="text-xs mb-1" style={{ opacity: 0.6 }}>{isVal} {t('is')} {t('of')} {ofVal2}</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--os9-accent)' }}>{r2}%</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Percentage Change */}
            {tab === 'change' && (
              <div>
                <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t('changeDesc')}</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="os9-label">{t('from')}</label>
                    <input className="os9-input" type="number" step="any" value={fromVal}
                      onChange={(e) => setFromVal(e.target.value)} onKeyDown={keyDown(calcChange)} placeholder="150" />
                  </div>
                  <div>
                    <label className="os9-label">{t('to')}</label>
                    <input className="os9-input" type="number" step="any" value={toVal}
                      onChange={(e) => setToVal(e.target.value)} onKeyDown={keyDown(calcChange)} placeholder="200" />
                  </div>
                </div>
                <button className="os9-btn os9-btn-primary w-full text-sm py-3" onClick={calcChange}>{t('calculate')}</button>
                {r3 !== null && (
                  <div className="mt-4">
                    <hr className="os9-divider" />
                    <div className="os9-result text-center">
                      <p className="text-xs mb-1" style={{ opacity: 0.6 }}>{fromVal} → {toVal}</p>
                      <p className="text-2xl font-bold" style={{ color: r3 >= 0 ? 'var(--os9-green)' : 'var(--os9-red)' }}>
                        {r3 >= 0 ? '+' : ''}{r3}%
                      </p>
                      <p className="text-xs mt-1" style={{ opacity: 0.6 }}>
                        {r3 >= 0 ? t('increase') : t('decrease')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
)}
          </div>

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/fraction`} className="underline">Fraction Calculator</a>
                <a href={`/${locale}/grade`} className="underline">Grade Calculator</a>
                <a href={`/${locale}/discount`} className="underline">Discount Calculator</a>
                <a href={`/${locale}/tip`} className="underline">Tip Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/text'} className="underline" style={{ opacity: 0.7 }}>Text</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}