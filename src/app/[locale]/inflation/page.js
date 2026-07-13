'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/inflation.json';
import esMsgs from '../../../messages/es/inflation.json';
import zhMsgs from '../../../messages/zh/inflation.json';
import koMsgs from '../../../messages/ko/inflation.json';
import ptMsgs from '../../../messages/pt/inflation.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function InflationPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/inflation'; };
  const [amount, setAmount] = useState('1000');
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
          <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="col-span-3"><label className="os9-label">{t('amount')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
                      <div><label className="os9-label">{t('fromYear')}</label><select className="os9-select" value={fromYear} onChange={(e) => setFromYear(e.target.value)}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                      <div><label className="os9-label">{t('toYear')}</label><select className="os9-select" value={toYear} onChange={(e) => setToYear(e.target.value)}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                      <div className="flex items-end"><button className="os9-btn os9-btn-primary w-full" onClick={calc}>{t('calculate')}</button></div>
                    </div>
                    {result && <div className="os9-result mb-3"><div className="text-sm"><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('equivalentValue') || 'Equivalent Value'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>${result.equivalent.toFixed(2)}</div><div className="text-[10px]" style={{ opacity: 0.6 }}>{t('inflationRate') || 'Inflation Rate'}: {result.rate.toFixed(2)}%</div></div></div>}
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