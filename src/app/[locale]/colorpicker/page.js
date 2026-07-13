'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/colorpicker.json';
import esMsgs from '../../../messages/es/colorpicker.json';
import zhMsgs from '../../../messages/zh/colorpicker.json';
import koMsgs from '../../../messages/ko/colorpicker.json';
import ptMsgs from '../../../messages/pt/colorpicker.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function ColorpickerPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/colorpicker'; };
  const [hue, setHue] = useState(200);
  const [hueColor, setHueColor] = useState('hsl(200, 100%, 50%)');
  const [sv, setSv] = useState({ s: 0.5, v: 1 });
  const [hex, setHex] = useState('#007bff');
  const [rgb, setRgb] = useState('rgb(0, 123, 255)');
  const [hsl, setHsl] = useState('hsl(200, 100%, 50%)');

  const hsvToRgb = (h, s, v) => {
    let r, g, b; const i = Math.floor(h * 6); const f = h * 6 - i; const p = v * (1 - s); const q = v * (1 - f * s); const t = v * (1 - (1 - f) * s);
    switch(i % 6) { case 0: r=v,g=t,b=p; break; case 1: r=q,g=v,b=p; break; case 2: r=p,g=v,b=t; break; case 3: r=p,g=q,b=v; break; case 4: r=t,g=p,b=v; break; case 5: r=v,g=p,b=q; break; }
    return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
  };

  const updateFromHsv = () => {
    const { r, g, b } = hsvToRgb(hue/360, sv.s, sv.v);
    const h = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    setHex(h);
    setRgb(`rgb(${r}, ${g}, ${b})`);
    setHsl(`hsl(${hue}, ${Math.round(sv.s*100)}%, ${Math.round(sv.v*100)}%)`);
  };

  useEffect(() => { updateFromHsv(); }, [hue, sv]);
  useEffect(() => { setHueColor(`hsl(${hue}, 100%, 50%)`); }, [hue]);

  const setFromHex = (h) => { if (!/^#[0-9a-fA-F]{6}$/.test(h)) return; const r=parseInt(h.slice(1,3),16), g=parseInt(h.slice(3,5),16), b=parseInt(h.slice(5,7),16); const max=Math.max(r,g,b)/255, min=Math.min(r,g,b)/255; let h=0, s=0; if(max!==min){ const d=max-min; s=d/max; switch(max){ case r/255: h=(g-b)/255/d%6; break; case g/255: h=(b-r)/255/d+2; break; case b/255: h=(r-g)/255/d+4; break; } h/=6; if(h<0) h+=1; } setHue(Math.round(h*360)); setSv({s, v:max}); updateFromHsv(); };

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
                      <div className="relative w-full h-40 mb-2 rounded border" style={{ background: `linear-gradient(to right, ${hueColor}, white), linear-gradient(to bottom, transparent, black)` }}>
                        <div className="absolute w-4 h-4 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${sv.s * 100}%`, top: `${(1 - sv.v) * 100}%`, pointerEvents: 'none' }} />
                      </div>
                      <input type="range" className="w-full h-4" min="0" max="360" value={hue} onChange={(e) => { setHue(Number(e.target.value)); setHueColor(`hsl(${e.target.value}, 100%, 50%)`); }} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>HEX</div><input className="os9-input text-center font-mono" value={hex} onChange={(e) => setFromHex(e.target.value)} /></div>
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>RGB</div><input className="os9-input text-center font-mono" value={rgb} readOnly /></div>
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>HSL</div><input className="os9-input text-center font-mono" value={hsl} readOnly /></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="os9-btn flex-1" onClick={() => navigator.clipboard.writeText(hex)}>{t('copyHex') || 'Copy HEX'}</button>
                      <button className="os9-btn flex-1" onClick={() => navigator.clipboard.writeText(rgb)}>{t('copyRgb') || 'Copy RGB'}</button>
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