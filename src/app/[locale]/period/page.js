'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/period.json';
import esMsgs from '../../../messages/es/period.json';
import zhMsgs from '../../../messages/zh/period.json';
import koMsgs from '../../../messages/ko/period.json';
import ptMsgs from '../../../messages/pt/period.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmt(d) { return d.toISOString().split('T')[0]; }

export default function PeriodPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/period'; };

  const today = new Date();
  const [lastPeriod, setLastPeriod] = useState(fmt(addDays(today, -14)));
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [result, setResult] = useState(null);

  const calc = () => {
    const lp = new Date(lastPeriod + 'T00:00:00');
    if (isNaN(lp.getTime())) return;
    const cycle = parseInt(cycleLength) || 28;
    const pd = parseInt(periodLength) || 5;

    const nextPeriod = addDays(lp, cycle);
    const ovulation = addDays(lp, cycle - 14);
    const fertileStart = addDays(lp, cycle - 18);
    const fertileEnd = addDays(lp, cycle - 11);
    const nextPeriodEnd = addDays(nextPeriod, pd);
    const safeAfter = addDays(nextPeriodEnd, 1);
    const safeBefore = addDays(ovulation, -3);

    const daysUntilNext = Math.round((nextPeriod - today) / 86400000);

    setResult({
      nextPeriod: fmt(nextPeriod),
      nextPeriodEnd: fmt(nextPeriodEnd),
      ovulation: fmt(ovulation),
      fertileStart: fmt(fertileStart),
      fertileEnd: fmt(fertileEnd),
      safeAfter: fmt(safeAfter),
      safeBefore: fmt(safeBefore),
      daysUntilNext: Math.max(0, daysUntilNext),
      phase: daysUntilNext < 0 ? t('phasePeriod') : daysUntilNext < 7 ? t('phaseOvulating') : t('phaseSafe'),
    });
  };

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
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{t('lastPeriod')}</label>
              <input className="os9-input w-full" type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="os9-label">{t('cycleLength')}</label>
                <input className="os9-input w-full" type="number" min="20" max="45" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} />
              </div>
              <div>
                <label className="os9-label">{t('periodLength')}</label>
                <input className="os9-input w-full" type="number" min="1" max="10" value={periodLength} onChange={(e) => setPeriodLength(e.target.value)} />
              </div>
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">{result.daysUntilNext}</div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('daysUntilNext')}</div>
                <div className="text-xs mt-1 font-semibold">{result.phase}</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div><span style={{ opacity: 0.5 }}>{t('nextPeriod')}: </span><span className="font-semibold">{result.nextPeriod}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('nextPeriodEnd')}: </span><span className="font-semibold">{result.nextPeriodEnd}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('ovulation')}: </span><span className="font-semibold">{result.ovulation}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('fertileWindow')}: </span><span className="font-semibold">{result.fertileStart} – {result.fertileEnd}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/period'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Period</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}