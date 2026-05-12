'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/wordcounter.json';
import esMsgs from '../../../messages/es/wordcounter.json';
import zhMsgs from '../../../messages/zh/wordcounter.json';
import koMsgs from '../../../messages/ko/wordcounter.json';
import ptMsgs from '../../../messages/pt/wordcounter.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function WordCounterPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/wordcounter'; };

  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/ns*n/).filter(p => p.trim().length > 0).length : 0;
    const lines = text ? text.split(/n/).length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));
    const speakingTime = Math.max(1, Math.round(words / 150));
    return { words, chars, charsNoSpace, sentences, paragraphs, lines, readingTime, speakingTime };
  }, [text]);

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
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <textarea className="os9-input w-full" rows={10}
            style={{ fontFamily: 'monospace', fontSize: 14, resize: 'vertical' }}
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.words.toLocaleString()}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('words')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.chars.toLocaleString()}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('characters')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.charsNoSpace.toLocaleString()}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('charsNoSpace')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.sentences.toLocaleString()}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('sentences')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.paragraphs.toLocaleString()}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('paragraphs')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.lines.toLocaleString()}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('lines')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.readingTime}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('readingTime')}</div>
            </div>
            <div className="os9-result text-center !py-3">
              <div className="os9-big-number">{stats.speakingTime}</div>
              <div className="text-xs" style={{ opacity: 0.5 }}>{t('speakingTime')}</div>
            </div>
          </div>

          {text.length > 0 && (
            <button className="os9-btn w-full mt-3 text-sm" onClick={() => setText('')} style={{ padding: '8px 0' }}>
              {t('clear')}
            </button>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/text`} className="underline">Text Analyzer</a>
                <a href={`/${locale}/pdf`} className="underline">PDF Text Extractor</a>
                <a href={`/${locale}/timer`} className="underline">Timer</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/wordcounter'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Word Counter</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}