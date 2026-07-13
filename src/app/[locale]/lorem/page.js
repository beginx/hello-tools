'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/lorem.json';
import esMsgs from '../../../messages/es/lorem.json';
import zhMsgs from '../../../messages/zh/lorem.json';
import koMsgs from '../../../messages/ko/lorem.json';
import ptMsgs from '../../../messages/pt/lorem.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function LoremPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/lorem'; };
  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');  const lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  const generate = () => {
    let result = '';
    for (let i = 0; i < count; i++) {
      const words = lipsum.split(' ').sort(() => Math.random() - 0.5).join(' ');
      result += words + '\n\n';
    }
    setOutput(result.trim());
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
            <label className="os9-label">{t('paragraphs') || 'Count'}</label>
            <input className="os9-input" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate')}</button>
          {output && (
            <div className="mb-3">
              <label className="os9-label">{t('result') || 'Result'}</label>
              <textarea className="os9-input w-full" rows={8} value={output} readOnly />
            </div>
          )}
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
