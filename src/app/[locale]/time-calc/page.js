'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/time-calc.json';
import esMsgs from '../../../messages/es/time-calc.json';
import zhMsgs from '../../../messages/zh/time-calc.json';
import koMsgs from '../../../messages/ko/time-calc.json';
import ptMsgs from '../../../messages/pt/time-calc.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function TimeCalcPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/time-calc'; };
  const [h1, setH1] = useState('2');
  const [m1, setM1] = useState('30');
  const [h2, setH2] = useState('1');
  const [m2, setM2] = useState('45');
  const [result, setResult] = useState(null);

  const calc = (op) => {
    const t1 = (parseInt(h1)||0)*60 + (parseInt(m1)||0);
    const t2 = (parseInt(h2)||0)*60 + (parseInt(m2)||0);
    const total = op === "add" ? t1 + t2 : Math.max(0, t1 - t2);
    setResult({ h: Math.floor(total/60), m: total%60 });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><label className="os9-label">{t('hours') || 'Hours'}</label><input className="os9-input" type="number" min="0" value={h1} onChange={(e) => setH1(e.target.value)} /></div>
                      <div><label className="os9-label">{t('minutes') || 'Minutes'}</label><input className="os9-input" type="number" min="0" max="59" value={m1} onChange={(e) => setM1(e.target.value)} /></div>
                      <div><label className="os9-label">{t('hours') || 'Hours'}</label><input className="os9-input" type="number" min="0" value={h2} onChange={(e) => setH2(e.target.value)} /></div>
                      <div><label className="os9-label">{t('minutes') || 'Minutes'}</label><input className="os9-input" type="number" min="0" max="59" value={m2} onChange={(e) => setM2(e.target.value)} /></div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button className="os9-btn os9-btn-primary flex-1" onClick={() => calc("add")}>{t('add') || 'Add'}</button>
                      <button className="os9-btn flex-1" onClick={() => calc("subtract")}>{t('subtract') || 'Subtract'}</button>
                    </div>
                    {result !== null && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('result')}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>{result.h}h {result.m}m</div></div>}
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
  );
}