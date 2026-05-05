'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function QRPage() {
  const t = useTranslations('qr');
  const params = useParams();
  const locale = params?.locale || 'en';

  const changeLang = (l) => { window.location.href = '/' + l + '/qr'; };

  const [input, setInput] = useState('');
  const [size, setSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(function() {
    if (typeof window === 'undefined') return;
    import('qrcode').then(function(mod) {
      window.QRCode = mod;
      if (input.trim()) generate();
    });
  }, []);

  const generate = function() {
    const text = input.trim();
    if (!text) return;
    import('qrcode').then(function(mod) {
      mod.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: '#000000', light: '#ffffff' },
      }, function(err) {
        if (err) return;
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      });
    });
  };

  const keyDown = function(e) {
    if (e.key === 'Enter') generate();
  };

  const download = function() {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="os9-label">{t('placeholder')}</label>
            <input className="os9-input" type="text" value={input}
              onChange={function(e) { setInput(e.target.value); }}
              onKeyDown={keyDown}
              placeholder={t('placeholder')} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="os9-label">{t('size')}</label>
              <select className="os9-select" value={size} onChange={function(e) { setSize(Number(e.target.value)); }}>
                <option value="200">200×200</option>
                <option value="300">300×300</option>
                <option value="400">400×400</option>
                <option value="500">500×500</option>
              </select>
            </div>
            <div>
              <label className="os9-label">{t('errorLevel')}</label>
              <select className="os9-select" value={errorLevel} onChange={function(e) { setErrorLevel(e.target.value); }}>
                <option value="L">{t('low')}</option>
                <option value="M">{t('medium')}</option>
                <option value="Q">{t('quartile')}</option>
                <option value="H">{t('high')}</option>
              </select>
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3 mb-4" onClick={generate}>{t('generate')}</button>

          <div className="flex justify-center mb-4">
            <canvas ref={canvasRef} style={{ display: qrDataUrl ? 'block' : 'none', maxWidth: '100%', imageRendering: 'pixelated' }} />
            {!qrDataUrl && (
              <div className="os9-result text-center py-8 px-8" style={{ minWidth: 200, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>QR Code</span>
              </div>
            )}
          </div>

          {qrDataUrl && (
            <button className="os9-btn w-full text-xs py-2" onClick={download}>{t('download')}</button>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        {t('footer')}
      </div>
    </div>
  );
}