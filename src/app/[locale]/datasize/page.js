'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/datasize.json';
import esMsgs from '../../../messages/es/datasize.json';
import zhMsgs from '../../../messages/zh/datasize.json';
import koMsgs from '../../../messages/ko/datasize.json';
import ptMsgs from '../../../messages/pt/datasize.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function DatasizePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/datasize'; };

  const [input, setInput] = useState('1');
  const [fromUnit, setFromUnit] = useState('MB');
  const [toUnit, setToUnit] = useState('KB');
  const [output, setOutput] = useState('');
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const unitToBytes = { 'Bytes': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776, 'PB': 1125899906842624 };

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
          <div className="grid grid-cols-3 gap-2 mb-3">
    <div className="col-span-3">
      <label className="os9-label">{t('input')}</label>
      <input className="os9-input w-full" type="number" min="0" step="any" value={input} onChange={(e) => setInput(e.target.value)} />
    </div>
    <div>
      <label className="os9-label">{t('from') || 'From'}</label>
      <select className="os9-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
        {units.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
    <div>
      <label className="os9-label">{t('to') || 'To'}</label>
      <select className="os9-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
        {units.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
    <div className="flex items-end">
      <button className="os9-btn os9-btn-primary w-full" onClick={() => { const val = parseFloat(input); if (!isNaN(val)) setOutput((val * unitToBytes[fromUnit] / unitToBytes[toUnit]).toFixed(4)); }}>{t('convert')}</button>
    </div>
  </div>
  {output && <div className="mb-3"><label className="os9-label">{t('result') || 'Result'}</label><input className="os9-input w-full" type="text" value={output} readOnly /></div>}
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
