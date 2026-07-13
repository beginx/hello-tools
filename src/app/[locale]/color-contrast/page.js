'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/color-contrast.json';
import esMsgs from '../../../messages/es/color-contrast.json';
import zhMsgs from '../../../messages/zh/color-contrast.json';
import koMsgs from '../../../messages/ko/color-contrast.json';
import ptMsgs from '../../../messages/pt/color-contrast.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function ColorContrastPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/color-contrast'; };
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [ratio, setRatio] = useState(21);

  const luminance = (hex) => {
    const c = hex.replace('#', ''); const r = parseInt(c.slice(0,2),16)/255; const g = parseInt(c.slice(2,4),16)/255; const b = parseInt(c.slice(4,6),16)/255;
    const srgb = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
  };

  useEffect(() => {
    const l1 = luminance(fg), l2 = luminance(bg);
    setRatio(Math.round((Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05) * 10) / 10);
  }, [fg, bg]);

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
          <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="os9-label">{t('foreground') || 'Foreground'}</label>
                        <input className="os9-input" type="color" value={fg} onChange={(e) => setFg(e.target.value)} />
                        <input className="os9-input mt-1" type="text" value={fg} onChange={(e) => setFg(e.target.value)} />
                      </div>
                      <div>
                        <label className="os9-label">{t('background') || 'Background'}</label>
                        <input className="os9-input" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
                        <input className="os9-input mt-1" type="text" value={bg} onChange={(e) => setBg(e.target.value)} />
                      </div>
                    </div>
                    <div className="h-20 flex items-center justify-center mb-3 border" style={{ background: bg, color: fg }}>
                      <span className="px-4 py-2 text-lg" style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 4 }}>Sample Text</span>
                    </div>
                    <div className="os9-result mb-3">
                      <div className="grid grid-cols-2 gap-2 text-sm text-center">
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('contrastRatio') || 'Contrast Ratio'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem', color: ratio >= 7 ? '#28a745' : ratio >= 4.5 ? '#ffc107' : '#dc3545' }}>{ratio}:1</div></div>
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wcagAA') || 'WCAG AA'}</div><div className="font-bold" style={{ color: ratio >= 4.5 ? '#28a745' : '#dc3545' }}>{ratio >= 4.5 ? '✓ Pass' : '✗ Fail'}</div></div>
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('wcagAAA') || 'WCAG AAA'}</div><div className="font-bold" style={{ color: ratio >= 7 ? '#28a745' : '#dc3545' }}>{ratio >= 7 ? '✓ Pass' : '✗ Fail'}</div></div>
                        <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('largeText') || 'Large Text'}</div><div className="font-bold" style={{ color: ratio >= 3 ? '#28a745' : '#dc3545' }}>{ratio >= 3 ? '✓ Pass' : '✗ Fail'}</div></div>
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