'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/duedate.json';
import esMsgs from '../../../messages/es/duedate.json';
import zhMsgs from '../../../messages/zh/duedate.json';
import koMsgs from '../../../messages/ko/duedate.json';
import ptMsgs from '../../../messages/pt/duedate.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmt(d) { return d.toISOString().split('T')[0]; }

export default function DueDatePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/duedate'; };

  const today = new Date();
  const [lmp, setLmp] = useState(fmt(addDays(today, -180)));
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState(null);

  // Naegele's rule: LMP + 280 days (40 weeks)
  // Fertile window: ~14 days before next period
  const calc = () => {
    const lmpDate = new Date(lmp + 'T00:00:00');
    if (isNaN(lmpDate.getTime())) return;
    const cycle = parseInt(cycleLength) || 28;

    const dueDate = addDays(lmpDate, 280);
    const conception = addDays(lmpDate, 14);
    const fertileStart = addDays(lmpDate, cycle - 18);
    const fertileEnd = addDays(lmpDate, cycle - 11);
    const firstTrimesterEnd = addDays(lmpDate, 84);   // 12 weeks
    const secondTrimesterEnd = addDays(lmpDate, 196); // 28 weeks

    const weeksPregnant = Math.floor((today - lmpDate) / 86400000 / 7);
    const daysPregnant = Math.round((today - lmpDate) / 86400000);

    setResult({
      dueDate: fmt(dueDate),
      conception: fmt(conception),
      fertileStart: fmt(fertileStart),
      fertileEnd: fmt(fertileEnd),
      firstTrimesterEnd: fmt(firstTrimesterEnd),
      secondTrimesterEnd: fmt(secondTrimesterEnd),
      weeksPregnant: Math.max(0, weeksPregnant),
      daysPregnant: Math.max(0, daysPregnant),
      trimester: daysPregnant <= 84 ? 1 : daysPregnant <= 196 ? 2 : 3,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
              <label className="os9-label">{t('lmp')}</label>
              <input className="os9-input w-full" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('cycleLength')}</label>
              <input className="os9-input w-full" type="number" min="20" max="45" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>{result.dueDate}</div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('dueDate')}</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div><span style={{ opacity: 0.5 }}>{t('conception')}: </span><span className="font-semibold">{result.conception}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('currentWeek')}: </span><span className="font-semibold">{result.weeksPregnant} {t('weeks')} {result.daysPregnant % 7} {t('days')}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('fertileWindow')}: </span><span className="font-semibold">{result.fertileStart} – {result.fertileEnd}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('trimester')}: </span><span className="font-semibold">{t('trimester' + result.trimester)}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('firstTrimesterEnd')}: </span><span className="font-semibold">{result.firstTrimesterEnd}</span></div>
                <div><span style={{ opacity: 0.5 }}>{t('secondTrimesterEnd')}: </span><span className="font-semibold">{result.secondTrimesterEnd}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/duedate'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Due Date</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}