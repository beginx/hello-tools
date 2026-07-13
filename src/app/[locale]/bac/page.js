'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/bac.json';
import esMsgs from '../../../messages/es/bac.json';
import zhMsgs from '../../../messages/zh/bac.json';
import koMsgs from '../../../messages/ko/bac.json';
import ptMsgs from '../../../messages/pt/bac.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function BacPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/bac'; };
  const [weight, setWeight] = useState('70');
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
                      <div><label className="os9-label">{t('weight')}</label><input className="os9-input" type="number" min="30" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
                      <div><label className="os9-label">{t('gender')}</label><div className="flex gap-2 mt-1">
                        <button className={'os9-btn flex-1 text-xs px-1' + (gender === 'male' ? ' os9-btn-primary' : '')} onClick={() => setGender('male')}>{t('male')}</button>
                        <button className={'os9-btn flex-1 text-xs px-1' + (gender === 'female' ? ' os9-btn-primary' : '')} onClick={() => setGender('female')}>{t('female')}</button>
                      </div></div>
                      <div><label className="os9-label">{t('drinks')}</label><input className="os9-input" type="number" min="0" value={drinks} onChange={(e) => setDrinks(e.target.value)} /></div>
                      <div><label className="os9-label">{t('hours')}</label><input className="os9-input" type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} /></div>
                    </div>
                    <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('calculate')}</button>
                    {result !== null && <div className="os9-result mb-3 text-center"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('bacResult') || 'BAC'}</div><div className="os9-big-number" style={{ fontSize: '2rem', color: result > 0.08 ? '#dc3545' : result > 0.05 ? '#ffc107' : '#28a745' }}>{result.toFixed(3)}%</div></div>}
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