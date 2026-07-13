'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/whatismyip.json';
import esMsgs from '../../../messages/es/whatismyip.json';
import zhMsgs from '../../../messages/zh/whatismyip.json';
import koMsgs from '../../../messages/ko/whatismyip.json';
import ptMsgs from '../../../messages/pt/whatismyip.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function WhatismyipPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/whatismyip'; };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIP = async () => {
    setLoading(true); setError('');
    try {
      const r = await fetch('https://ipapi.co/json/');
      const d = await r.json();
      setData({ ip: d.ip, location: d.city + ', ' + d.country_name, isp: d.org });
    } catch(e) {
      setError(t('error') || 'Failed to fetch');
    }
    setLoading(false);
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
          <div className="text-center mb-4">
                      <button className="os9-btn os9-btn-primary" onClick={fetchIP}>{t('refetch') || 'Check My IP'}</button>
                    </div>
                    {loading && <div className="text-center text-sm" style={{ opacity: 0.6 }}>{t('loading') || 'Loading...'}</div>}
                    {data && <div className="os9-result mb-3"><div className="grid grid-cols-1 gap-2 text-sm">
                      <div><span className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('ipAddress') || 'IP Address'}: </span><span className="font-bold">{data.ip}</span></div>
                      {data.location && <div><span className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('location') || 'Location'}: </span><span>{data.location}</span></div>}
                      {data.isp && <div><span className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('isp') || 'ISP'}: </span><span>{data.isp}</span></div>}
                    </div></div>}
                    {error && <div className="text-sm text-center" style={{ color: 'red' }}>{t('error') || 'Error loading data'}</div>}
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