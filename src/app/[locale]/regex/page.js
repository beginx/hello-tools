'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/regex.json';
import esMsgs from '../../../messages/es/regex.json';
import zhMsgs from '../../../messages/zh/regex.json';
import koMsgs from '../../../messages/ko/regex.json';
import ptMsgs from '../../../messages/pt/regex.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function RegexPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/regex'; };
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('');
  const [testStr, setTestStr] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const testRegex = useCallback(() => {
    setError('');
    setMatches([]);
    if (!pattern) return;
    try {
      const regex = new RegExp(pattern.slice(1, -1), flags);
      let match;
      const results = [];
      while ((match = regex.exec(testStr)) !== null) {
        results.push({ ...match, index: match.index, groups: match.groups });
        if (!flags.includes('g')) break;
      }
      setMatches(results);
    } catch(e) { setError(t('invalidRegex') || 'Invalid regex'); }
  }, [pattern, flags, testStr]);

  useEffect(() => { testRegex(); }, [testRegex]);

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
                      <label className="os9-label">{t('pattern') || 'Pattern'}</label>
                      <div className="flex gap-2">
                        <input className="os9-input flex-1" type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder={t('patternPlaceholder') || '/pattern/flags'} />
                        <select className="os9-select" value={flags} onChange={(e) => setFlags(e.target.value)}>
                          <option value="">None</option>
                          <option value="g">g (global)</option>
                          <option value="i">i (case-insensitive)</option>
                          <option value="m">m (multiline)</option>
                          <option value="gi">gi</option>
                          <option value="gm">gm</option>
                          <option value="gim">gim</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="os9-label">{t('testString') || 'Test String'}</label>
                      <textarea className="os9-input w-full" rows={4} value={testStr} onChange={(e) => setTestStr(e.target.value)} />
                    </div>
                    {error && <div className="text-xs text-red-600 mb-3">{error}</div>}
                    <div className="mb-3">
                      <label className="os9-label">{t('matches') || 'Matches'}</label>
                      <div className="os9-input w-full min-h-[100px]" style={{ overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                        {matches.length === 0 ? <span style={{ opacity: 0.5 }}>{t('noMatches') || 'No matches'}</span> : matches.map((m, i) => <div key={i}><span className="font-bold">{m[0]}</span> {m.index !== undefined && <span className="text-xs" style={{ opacity: 0.6 }}>@ {m.index}</span>}{m.groups && <pre className="text-xs mt-1">{JSON.stringify(m.groups, null, 2)}</pre>}</div>)}
                      </div>
                    </div>
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