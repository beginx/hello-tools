'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/diff.json';
import esMsgs from '../../../messages/es/diff.json';
import zhMsgs from '../../../messages/zh/diff.json';
import koMsgs from '../../../messages/ko/diff.json';
import ptMsgs from '../../../messages/pt/diff.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function DiffPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/diff'; };
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [result, setResult] = useState(null);  const compare = () => {
    const oLines = original.split('\n');
    const mLines = modified.split('\n');
    const maxLen = Math.max(oLines.length, mLines.length);
    const lines = [];
    for (let i = 0; i < maxLen; i++) {
      if (i >= oLines.length) lines.push({ type: 'add', text: '+ ' + mLines[i] });
      else if (i >= mLines.length) lines.push({ type: 'rem', text: '- ' + oLines[i] });
      else if (oLines[i] !== mLines[i]) {
        lines.push({ type: 'rem', text: '- ' + oLines[i] });
        lines.push({ type: 'add', text: '+ ' + mLines[i] });
      } else lines.push({ type: 'same', text: '  ' + oLines[i] });
    }
    setResult({ lines });
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
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="os9-label">{t('originalLabel') || 'Original'}</label>
              <textarea className="os9-input w-full" rows={6} value={original} onChange={(e) => setOriginal(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('modifiedLabel') || 'Modified'}</label>
              <textarea className="os9-input w-full" rows={6} value={modified} onChange={(e) => setModified(e.target.value)} />
            </div>
          </div>
          <button className="os9-btn os9-btn-primary w-full mb-3" onClick={compare}>{t('compare') || 'Compare'}</button>
          {result && (
            <div className="mb-3">
              <label className="os9-label">{t('result') || 'Diff'}</label>
              <div className="os9-input w-full" style={{ maxHeight: 200, overflow: 'auto', fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre' }}>
                {result.lines.map((l, i) => (
                  <div key={i} style={{ background: l.type === 'add' ? '#d4edda' : l.type === 'rem' ? '#f8d7da' : 'transparent' }}>{l.text}</div>
                ))}
              </div>
            </div>
          )}
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
