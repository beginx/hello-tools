'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/caseconverter.json';
import esMsgs from '../../../messages/es/caseconverter.json';
import zhMsgs from '../../../messages/zh/caseconverter.json';
import koMsgs from '../../../messages/ko/caseconverter.json';
import ptMsgs from '../../../messages/pt/caseconverter.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CaseconverterPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/caseconverter'; };
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

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
          <div className="flex gap-2 mb-3">
            <button className="os9-btn flex-1" onClick={() => setOutput(input.toUpperCase())}>UPPERCASE</button>
            <button className="os9-btn flex-1" onClick={() => setOutput(input.toLowerCase())}>lowercase</button>
            <button className="os9-btn flex-1" onClick={() => setOutput(input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))}>Title Case</button>
          </div>
          <div className="flex gap-2 mb-3">
            <button className="os9-btn flex-1" onClick={() => setOutput(input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''))}>tOGGLE cASE</button>
            <button className="os9-btn flex-1" onClick={() => setOutput(input.replace(/[A-Z]/g, c => c.toLowerCase()).replace(/[a-z]/g, c => c.toUpperCase()))}>InVeRsE</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('output')}</label>
            <textarea className="os9-input w-full" rows={4} value={output} readOnly />
          </div>
          <button className="os9-btn w-full text-xs py-2" onClick={() => { navigator.clipboard.writeText(output); }}>{t('copy') || 'Copy'}</button>
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
