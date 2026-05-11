'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/daysuntil.json';
import esMsgs from '../../../messages/es/daysuntil.json';
import zhMsgs from '../../../messages/zh/daysuntil.json';
import koMsgs from '../../../messages/ko/daysuntil.json';
import ptMsgs from '../../../messages/pt/daysuntil.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function fmt(d) {
  return d.toISOString().split('T')[0];
}

export default function DaysUntilPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/daysuntil'; };

  const today = fmt(new Date());

  // Preset dates
  const nextXmas = new Date(new Date().getFullYear(), 11, 25);
  if (nextXmas <= new Date()) nextXmas.setFullYear(nextXmas.getFullYear() + 1);
  const nextNewYear = new Date(new Date().getFullYear() + 1, 0, 1);

  const [targetDate, setTargetDate] = useState(fmt(nextXmas));
  const [result, setResult] = useState(null);

  const presets = [
    { label: t('presetXmas'), date: fmt(nextXmas) },
    { label: t('presetNewYear'), date: fmt(nextNewYear) },
    { label: t('presetBirthday'), date: '' },
  ];

  const calcDaysUntil = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate + 'T00:00:00');
    if (isNaN(target.getTime())) return;
    target.setHours(0, 0, 0, 0);
    const diffMs = target - now;
    const diffDays = Math.round(diffMs / 86400000);
    const isPast = diffDays < 0;
    const absDays = Math.abs(diffDays);
    const weeks = Math.floor(absDays / 7);
    const remDays = absDays % 7;
    const months = Math.floor(absDays / 30.44);
    const years = Math.floor(absDays / 365.25);
    setResult({
      days: absDays,
      weeks,
      remDays,
      months,
      years,
      isPast,
      target: targetDate,
      weekday: target.toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : locale === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'long' }),
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

          {/* Quick presets */}
          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setTargetDate(fmt(nextXmas))}>{t('presetXmas')}</button>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setTargetDate(fmt(nextNewYear))}>{t('presetNewYear')}</button>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setTargetDate(today)}>{t('presetToday')}</button>
          </div>

          <div className="mb-4">
            <label className="os9-label">{t('targetDate')}</label>
            <input className="os9-input w-full" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calcDaysUntil}>{t('calculate')}</button>

          {result && (
            <div className="os9-result text-center">
              <div className="text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.6 }}>
                {result.isPast ? t('resultPast') : t('resultFuture')}
              </div>
              <div className="os9-big-number" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)' }}>
                {result.days.toLocaleString()}
              </div>
              <div className="text-xs uppercase tracking-wider mb-3" style={{ opacity: 0.5 }}>{t('days')}</div>
              <div className="text-sm mb-1" style={{ opacity: 0.7 }}>
                {result.weeks} {t('weeks')} {result.remDays} {t('days')}
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <span style={{ opacity: 0.5 }}>{t('targetDate')}: </span>
                  <span className="font-semibold">{result.target}</span>
                </div>
                <div>
                  <span style={{ opacity: 0.5 }}>{t('weekday')}: </span>
                  <span className="font-semibold">{result.weekday}</span>
                </div>
                <div>
                  <span style={{ opacity: 0.5 }}>{t('months')}: </span>
                  <span className="font-semibold">{result.months}</span>
                </div>
                <div>
                  <span style={{ opacity: 0.5 }}>{t('years')}: </span>
                  <span className="font-semibold">{result.years}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/daysuntil'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Days Until</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Date</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}