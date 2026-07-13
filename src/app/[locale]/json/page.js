'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/json.json';
import esMsgs from '../../../messages/es/json.json';
import zhMsgs from '../../../messages/zh/json.json';
import koMsgs from '../../../messages/ko/json.json';
import ptMsgs from '../../../messages/pt/json.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };


export default function JsonPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/json'; };

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('format');
  const [valid, setValid] = useState(null);
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === 'format' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setValid(true);
    } catch(e) {
      setOutput(t('error') || 'Invalid JSON');
      setValid(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          
          <div className="flex gap-2 mb-3">
            <button className={'os9-btn flex-1' + (mode === 'format' ? ' os9-btn-primary' : '')} onClick={() => setMode('format')}>{t('format') || 'Format'}</button>
            <button className={'os9-btn flex-1' + (mode === 'minify' ? ' os9-btn-primary' : '')} onClick={() => setMode('minify')}>{t('minify') || 'Minify'}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('input')}</label>
            <textarea className="os9-input w-full" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={process}>{t('format') || 'Format'}</button>
          <div className="mb-3">
            <label className="os9-label">{t('output')}</label>
            <textarea className="os9-input w-full" rows={6} value={output} readOnly />
          </div>
          {valid !== null && (
            <p className="text-xs mb-2" style={{ color: valid ? 'green' : 'red' }}>
              {valid ? (t('valid') || 'Valid JSON') : (t('invalid') || 'Invalid JSON')}
            </p>
          )}
          <button className="os9-btn w-full text-xs py-2" onClick={copyResult}>{copied ? (t('copied') || 'Copied!') : (t('copy') || 'Copy')}</button>
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
