'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/charcount.json';
import esMsgs from '../../../messages/es/charcount.json';
import zhMsgs from '../../../messages/zh/charcount.json';
import koMsgs from '../../../messages/ko/charcount.json';
import ptMsgs from '../../../messages/pt/charcount.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CharcountPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/charcount'; };
  const [text, setText] = useState('');

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
            <textarea className="os9-input w-full" rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('input')} />
          </div>
          {text && (
            <div className="os9-result mb-3">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('chars') || 'Characters'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.length}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('words') || 'Words'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.match(/\S+/g)?.length || 0}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('lines') || 'Lines'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.split('\n').length}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('noSpaces') || 'No Spaces'}</div><div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{text.replace(/\s/g, '').length}</div></div>
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
