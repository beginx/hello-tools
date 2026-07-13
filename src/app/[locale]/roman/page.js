'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/roman.json';
import esMsgs from '../../../messages/es/roman.json';
import zhMsgs from '../../../messages/zh/roman.json';
import koMsgs from '../../../messages/ko/roman.json';
import ptMsgs from '../../../messages/pt/roman.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function RomanPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/roman'; };
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('toRoman');
  const romanNumerals = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];

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
            <button className={'os9-btn flex-1' + (mode === 'toRoman' ? ' os9-btn-primary' : '')} onClick={() => setMode('toRoman')}>{t('toRoman') || 'To Roman'}</button>
            <button className={'os9-btn flex-1' + (mode === 'toNumber' ? ' os9-btn-primary' : '')} onClick={() => setMode('toNumber')}>{t('toNumber') || 'To Number'}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <input className="os9-input w-full" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'toRoman' ? '2024' : 'MMXXIV'} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={convert}>{t('convert')}</button>
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
