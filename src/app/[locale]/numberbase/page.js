'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/numberbase.json';
import esMsgs from '../../../messages/es/numberbase.json';
import zhMsgs from '../../../messages/zh/numberbase.json';
import koMsgs from '../../../messages/ko/numberbase.json';
import ptMsgs from '../../../messages/pt/numberbase.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function NumberbasePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/numberbase'; };
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
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
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <input className="os9-input w-full" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{t('from') || 'From'}</label>
              <select className="os9-select" value={fromBase} onChange={(e) => setFromBase(parseInt(e.target.value))}>
                <option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hex (16)</option>
              </select>
            </div>
            <div>
              <label className="os9-label">{t('to') || 'To'}</label>
              <select className="os9-select" value={toBase} onChange={(e) => setToBase(parseInt(e.target.value))}>
                <option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hex (16)</option>
              </select>
            </div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={() => { try { setOutput(parseInt(input, fromBase).toString(toBase).toUpperCase()); } catch(e) { setOutput(t('error') || 'Error'); } }}>{t('convert')}</button>
          {output && <div className="mb-3"><label className="os9-label">{t('output')}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}
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
