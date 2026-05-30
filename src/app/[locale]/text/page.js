'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/text.json';
import esMsgs from '../../../messages/es/text.json';
import zhMsgs from '../../../messages/zh/text.json';
import koMsgs from '../../../messages/ko/text.json';
import ptMsgs from '../../../messages/pt/text.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const TABS = ['tabCount', 'tabCase', 'tabBase64'];

function countStats(text) {
  return {
    characters: text.length,
    charNoSpaces: text.replace(/s/g, '').length,
    words: text.trim() ? text.trim().split(/s+/).length : 0,
    sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
    paragraphs: text.split(/ns*n/).filter(p => p.trim()).length,
    lines: text.split('n').length,
    digits: (text.match(/d/g) || []).length,
    letters: (text.match(/[a-zA-Z]/g) || []).length,
  };
}

export default function TextPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/text'; };

  const [tab, setTab] = useState('tabCount');

  // Count tab
  const [input, setInput] = useState('');
  const stats = useMemo(() => countStats(input), [input]);

  // Case tab
  const [caseInput, setCaseInput] = useState('');
  const [caseMode, setCaseMode] = useState('uppercase');
  const caseResult = useMemo(() => {
    switch (caseMode) {
      case 'uppercase': return caseInput.toUpperCase();
      case 'lowercase': return caseInput.toLowerCase();
      case 'titleCase': return caseInput.replace(/wS*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
      case 'toggleCase': return [...caseInput].map(c =>
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      ).join('');
      default: return caseInput;
    }
  }, [caseInput, caseMode]);

  // Base64 tab
  const [base64Input, setBase64Input] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');
  const [base64Result, setBase64Result] = useState('');
  const [base64Error, setBase64Error] = useState('');

  const doBase64 = () => {
    setBase64Error('');
    try {
      if (base64Mode === 'encode') {
        setBase64Result(btoa(unescape(encodeURIComponent(base64Input))));
      } else {
        setBase64Result(decodeURIComponent(escape(atob(base64Input.trim()))));
      }
    } catch {
      setBase64Error(t('base64Error'));
      setBase64Result('');
    }
  };

  // Copy
  const [copied, setCopied] = useState(false);
  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 560, width: '100%' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="os9-tab-group w-full">
            {TABS.map(k => (
              <button key={k}
                className={'os9-tab text-[10px] ' + (tab === k ? 'os9-tab-active' : '')}
                onClick={() => setTab(k)}>
                {t(k)}
              </button>
            ))}
          </div>

          <div className="os9-result" style={{ borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
            {/* ── TAB: Word & Character Count ── */}
            {tab === 'tabCount' && (
              <div>
                <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t('tabDesc')}</p>
                <textarea className="os9-input !resize-y min-h-[120px] !font-sans !text-sm"
                  value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder={t('enterText')} />
                {input && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {Object.entries(stats).map(([key, val]) => (
                      <div key={key} className="os9-result !py-2 !px-3 text-center">
                        <div className="text-lg font-bold">{val.toLocaleString()}</div>
                        <div className="text-[10px]" style={{ opacity: 0.5 }}>{t(key)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Case Converter ── */}
            {tab === 'tabCase' && (
              <div>
                <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t('caseDesc')}</p>
                <div className="flex gap-1 mb-3 flex-wrap">
                  {['uppercase', 'lowercase', 'titleCase', 'toggleCase'].map(m => (
                    <button key={m}
                      className={'os9-btn text-[10px] !py-1 !px-3 ' + (caseMode === m ? 'os9-btn-primary' : '')}
                      onClick={() => setCaseMode(m)}>
                      {t(m)}
                    </button>
                  ))}
                </div>
                <textarea className="os9-input !resize-y min-h-[100px] !font-sans !text-sm mb-3"
                  value={caseInput} onChange={(e) => setCaseInput(e.target.value)}
                  placeholder={t('enterText')} />
                {caseInput && (
                  <div className="os9-result">
                    <div className="text-sm whitespace-pre-wrap break-all">{caseResult}</div>
                    <button className="os9-btn text-xs !py-1 !px-3 mt-2"
                      onClick={() => copyText(caseResult)}>
                      {copied ? t('copied') : t('copy')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Base64 ── */}
            {tab === 'tabBase64' && (
              <div>
                <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t('base64Desc')}</p>
                <div className="flex gap-1 mb-3">
                  <button className={'os9-btn text-xs !py-1 !px-4 ' + (base64Mode === 'encode' ? 'os9-btn-primary' : '')}
                    onClick={() => { setBase64Mode('encode'); setBase64Result(''); setBase64Error(''); }}>
                    {t('encode')}
                  </button>
                  <button className={'os9-btn text-xs !py-1 !px-4 ' + (base64Mode === 'decode' ? 'os9-btn-primary' : '')}
                    onClick={() => { setBase64Mode('decode'); setBase64Result(''); setBase64Error(''); }}>
                    {t('decode')}
                  </button>
                </div>
                <textarea className="os9-input !resize-y min-h-[100px] !font-sans !text-sm mb-3"
                  value={base64Input} onChange={(e) => setBase64Input(e.target.value)}
                  placeholder={base64Mode === 'encode' ? t('enterText') : t('base64Input')} />
                <button className="os9-btn os9-btn-primary w-full text-sm py-2 mb-3" onClick={doBase64}>
                  {base64Mode === 'encode' ? t('encode') : t('decode')}
                </button>
                {base64Error && (
                  <p className="text-xs text-center" style={{ color: 'var(--os9-red)' }}>{base64Error}</p>
                )}
                {base64Result && !base64Error && (
                  <div className="os9-result">
                    <div className="text-xs whitespace-pre-wrap break-all font-mono">{base64Result}</div>
                    <button className="os9-btn text-xs !py-1 !px-3 mt-2"
                      onClick={() => copyText(base64Result)}>
                      {copied ? t('copied') : t('copy')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/wordcounter`} className="underline">Word Counter</a>
                <a href={`/${locale}/pdf`} className="underline">PDF Text Extractor</a>
                <a href={`/${locale}/timer`} className="underline">Timer</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 560, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/text'} className="underline" style={{ opacity: 0.7 }}>Text</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}