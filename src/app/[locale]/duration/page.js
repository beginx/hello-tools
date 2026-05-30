'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/duration.json';
import esMsgs from '../../../messages/es/duration.json';
import zhMsgs from '../../../messages/zh/duration.json';
import koMsgs from '../../../messages/ko/duration.json';
import ptMsgs from '../../../messages/pt/duration.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function durationComponents(ms) {
  if (ms < 0) ms = 0;
  const sec = Math.floor(ms / 1000);
  const y = Math.floor(sec / (86400 * 365.25));
  const remAfterY = sec % (86400 * 365.25);
  const d = Math.floor(remAfterY / 86400);
  const remAfterD = remAfterY % 86400;
  const h = Math.floor(remAfterD / 3600);
  const remAfterH = remAfterD % 3600;
  const m = Math.floor(remAfterH / 60);
  const s = remAfterH % 60;
  return { years: y, days: d, hours: h, minutes: m, seconds: s };
}

export default function DurationPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/duration'; };

  // Default: last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const fmtDT = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [startDT, setStartDT] = useState(fmtDT(sevenDaysAgo));
  const [endDT, setEndDT] = useState(fmtDT(now));
  const [result, setResult] = useState(null);

  const calcDuration = () => {
    const s = new Date(startDT);
    const e = new Date(endDT);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return;
    const diffMs = e.getTime() - s.getTime();
    const absMs = Math.abs(diffMs);
    const dc = durationComponents(absMs);
    const totalHours = absMs / 3600000;
    const totalMinutes = absMs / 60000;
    setResult({
      isPast: diffMs < 0,
      years: dc.years,
      days: dc.days,
      hours: dc.hours,
      minutes: dc.minutes,
      seconds: dc.seconds,
      totalHours: totalHours,
      totalMinutes: totalMinutes,
      totalSeconds: absMs / 1000,
    });
  };

  // Quick presets
  const setPreset = (preset) => {
    const now = new Date();
    let s = new Date(now);
    if (preset === 'today') s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    else if (preset === '7days') s = new Date(now.getTime() - 7 * 86400000);
    else if (preset === '30days') s = new Date(now.getTime() - 30 * 86400000);
    else if (preset === '1year') { s.setFullYear(s.getFullYear() - 1); }
    setStartDT(fmtDT(s));
    setEndDT(fmtDT(now));
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
          {/* Language selector */}
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setPreset('today')}>{t('presetToday')}</button>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setPreset('7days')}>{t('preset7days')}</button>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setPreset('30days')}>{t('preset30days')}</button>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setPreset('1year')}>{t('preset1year')}</button>
          </div>

          {/* Start / End datetime */}
          <div className="mb-3">
            <label className="os9-label">{t('startDatetime')}</label>
            <input className="os9-input w-full" type="datetime-local" value={startDT} onChange={(e) => setStartDT(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="os9-label">{t('endDatetime')}</label>
            <input className="os9-input w-full" type="datetime-local" value={endDT} onChange={(e) => setEndDT(e.target.value)} />
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calcDuration}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result">
              {/* Direction indicator */}
              <div className="text-center mb-2">
                <span className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>
                  {result.isPast ? t('resultBefore') : t('resultAfter')}
                </span>
              </div>

              {/* Big components: years + days + hours + minutes + seconds */}
              <div className="flex flex-wrap gap-2 mb-3" style={{ justifyContent: 'center' }}>
                {result.years > 0 && (
                  <div className="text-center" style={{ minWidth: 56 }}>
                    <div className="os9-big-number">{result.years}</div>
                    <div className="text-xs" style={{ opacity: 0.5 }}>{t('years')}</div>
                  </div>
                )}
                <div className="text-center" style={{ minWidth: 56 }}>
                  <div className="os9-big-number">{result.days}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('days')}</div>
                </div>
                <div className="text-center" style={{ minWidth: 56 }}>
                  <div className="os9-big-number">{result.hours}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('hours')}</div>
                </div>
                <div className="text-center" style={{ minWidth: 56 }}>
                  <div className="os9-big-number">{result.minutes}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('minutes')}</div>
                </div>
                <div className="text-center" style={{ minWidth: 56 }}>
                  <div className="os9-big-number">{result.seconds}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('seconds')}</div>
                </div>
              </div>

              {/* Total breakdown */}
              <hr className="os9-divider" />
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>
                    {result.totalHours < 1000 ? Math.round(result.totalHours * 100) / 100 : Math.round(result.totalHours).toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('totalHours')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>
                    {result.totalMinutes < 1000 ? Math.round(result.totalMinutes * 100) / 100 : Math.round(result.totalMinutes).toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('totalMinutes')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>
                    {result.totalSeconds < 1000 ? Math.round(result.totalSeconds * 100) / 100 : Math.round(result.totalSeconds).toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('totalSeconds')}</div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/daysuntil`} className="underline">Days Until Calculator</a>
                <a href={`/${locale}/age`} className="underline">Age Calculator</a>
                <a href={`/${locale}/date`} className="underline">Date Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/duration'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Duration</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Date</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Convert</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}