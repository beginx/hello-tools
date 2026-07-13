'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/timezone.json';
import esMsgs from '../../../messages/es/timezone.json';
import zhMsgs from '../../../messages/zh/timezone.json';
import koMsgs from '../../../messages/ko/timezone.json';
import ptMsgs from '../../../messages/pt/timezone.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function TimezonePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/timezone'; };
  const [time, setTime] = useState('');
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Europe/London');
  const [converted, setConverted] = useState('');
  const tzList = ['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Europe/Berlin','Asia/Tokyo','Asia/Seoul','Asia/Shanghai','Asia/Dubai','Australia/Sydney','Pacific/Auckland','UTC'];

  const doConvert = () => {
    const now = time ? new Date('2024-01-01T' + time) : new Date();
    try { setConverted(new Intl.DateTimeFormat('en-US', { timeZone: toTz, hour: '2-digit', minute: '2-digit', hour12: true }).format(now)); }
    catch(e) { setConverted(t('error') || 'Error'); }
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
          <div className="mb-3"><label className="os9-label">{t('selectTimezone') || 'Time'}</label><input className="os9-input w-full" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><label className="os9-label">{t('from') || 'From'}</label><select className="os9-select" value={fromTz} onChange={(e) => setFromTz(e.target.value)}>{tzList.map(tz => <option key={tz} value={tz}>{tz.split('/').pop()}</option>)}</select></div>
                      <div><label className="os9-label">{t('to') || 'To'}</label><select className="os9-select" value={toTz} onChange={(e) => setToTz(e.target.value)}>{tzList.map(tz => <option key={tz} value={tz}>{tz.split('/').pop()}</option>)}</select></div>
                    </div>
                    <button className="os9-btn os9-btn-primary w-full mb-3" onClick={doConvert}>{t('convert')}</button>
                    {converted && <div className="os9-result mb-3 text-center"><div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('convertedTime') || 'Converted Time'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{converted}</div></div>}
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