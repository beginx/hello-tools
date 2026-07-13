'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/ascii-art.json';
import esMsgs from '../../../messages/es/ascii-art.json';
import zhMsgs from '../../../messages/zh/ascii-art.json';
import koMsgs from '../../../messages/ko/ascii-art.json';
import ptMsgs from '../../../messages/pt/ascii-art.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function AsciiArtPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/ascii-art'; };
  const [text, setText] = useState('HELLO');
  const [font, setFont] = useState('standard');
  const [art, setArt] = useState('');

  const fonts = {
    standard: { H: ' #    #  ######  #       #  #######', E: ' #######  #       #####   #       #  #######', L: ' #       #       #       #       #  #######', O: '  #####   #     #  #     #  #     #   #####  ' },
    slant: { H: '   #    #   ######   #      #  #######', E: '  ######   #      #   ####    #      #   ######', L: '  #      #      #      #      #      #   #######', O: '   #####   #     #   #     #   #     #   ##### ' },
    banner: { H: '#    #  ######  #    #  #    #  #######', E: '######   #      #     #   ####    #      #  ######', L: '#      #      #      #      #      #      ######', O: ' ####   #    #  #    #  #    #  #    #   #### ' },
    small: { H: '#   #  #####  #   #  #     #####', E: '#####  #      #     ###   #      #   #####', L: '#    #    #    #    #    #    #    #####', O: ' ###  #   #  #   #  #   #  #   #  ### ' }
  };

  const generate = () => {
    if (!text) return;
    const f = fonts[font] || fonts.standard;
    const lines = ['','','','','',''];
    for (const ch of text) {
      const charArt = f[ch] || '       ';
      const parts = charArt.split('  ');
      for (let i = 0; i < 6; i++) lines[i] += (parts[i] || '') + '  ';
    }
    setArt(lines.join('\n'));
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
                      <label className="os9-label">{t('text') || 'Text'}</label>
                      <input className="os9-input w-full" type="text" value={text} onChange={(e) => setText(e.target.value.toUpperCase())} maxLength={10} />
                    </div>
                    <div className="mb-3">
                      <label className="os9-label">{t('font') || 'Font'}</label>
                      <select className="os9-select" value={font} onChange={(e) => setFont(e.target.value)}>
                        <option value="standard">Standard</option>
                        <option value="slant">Slant</option>
                        <option value="banner">Banner</option>
                        <option value="small">Small</option>
                      </select>
                    </div>
                    <button className="os9-btn os9-btn-primary w-full mb-3" onClick={generate}>{t('generate') || 'Generate'}</button>
                    {art && (
                      <div className="mb-3">
                        <label className="os9-label">{t('result') || 'Result'}</label>
                        <pre className="os9-input w-full font-mono text-xs" style={{ whiteSpace: 'pre', overflow: 'auto' }}>{art}</pre>
                      </div>
                    )}
                    <button className="os9-btn w-full text-xs py-2" onClick={() => navigator.clipboard.writeText(art)}>{t('copy') || 'Copy'}</button>
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