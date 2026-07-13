'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/jwt.json';
import esMsgs from '../../../messages/es/jwt.json';
import zhMsgs from '../../../messages/zh/jwt.json';
import koMsgs from '../../../messages/ko/jwt.json';
import ptMsgs from '../../../messages/pt/jwt.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };


export default function JwtPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/jwt'; };

  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const decode = () => {
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) { setResult(null); return; }
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setResult({ header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2) });
    } catch(e) {
      setResult(null);
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
          
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"eyJhbGciOiJIUzI1NiIs..."} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={decode}>{t('decode')}</button>
          {result && (
            <div>
              <div className="mb-3">
                <label className="os9-label">{t('header') || 'Header'}</label>
                <textarea className="os9-input w-full" rows={4} value={result.header} readOnly />
              </div>
              <div className="mb-3">
                <label className="os9-label">{t('payload') || 'Payload'}</label>
                <textarea className="os9-input w-full" rows={6} value={result.payload} readOnly />
              </div>
            </div>
          )}
                    {/* SEO Description */}
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
