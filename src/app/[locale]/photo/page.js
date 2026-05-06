'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const TABS = ['resize', 'crop', 'compress', 'convert'];
const TAB_ICONS = ['\uD83D\uDCCD', '\u2702\uFE0F', '\uD83D\uDCE6', '\uD83D\uDD04']; // 📍, ✂️, 📦, 🔄

export default function PhotoPage() {
  const t = useTranslations('photo');
  const params = useParams();
  const locale = params?.locale || 'en';

  const changeLang = (l) => { window.location.href = '/' + l + '/photo'; };

  const [tab, setTab] = useState('resize');
  const [image, setImage] = useState(null);
  const [origSize, setOrigSize] = useState(0);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultSize, setResultSize] = useState(0);
  const [cropBox, setCropBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Resize state
  const [newWidth, setNewWidth] = useState(800);
  const [newHeight, setNewHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const origRatio = useRef(1);

  // Compress state
  const [quality, setQuality] = useState(80);

  // Convert state
  const [outFormat, setOutFormat] = useState('image/jpeg');

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const cropOverlayRef = useRef(null);
  const dragStart = useRef(null);

  const handleFile = useCallback(function(file) {
    setError('');
    setResultUrl(null);
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setError(t('tooLarge'));
      return;
    }
    setOrigSize(file.size);
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        setImage(img);
        setNewWidth(img.width);
        setNewHeight(img.height);
        origRatio.current = img.width / img.height;
        setCropBox({ x: 0, y: 0, w: img.width, h: img.height });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [t]);

  const handleDrop = function(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = function(e) {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = function() { setIsDragging(false); };

  const formatBytes = function(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const handleWidthChange = function(val) {
    const w = parseInt(val) || 1;
    setNewWidth(w);
    if (keepRatio && image) setNewHeight(Math.round(w / origRatio.current));
  };
  const handleHeightChange = function(val) {
    const h = parseInt(val) || 1;
    setNewHeight(h);
    if (keepRatio && image) setNewWidth(Math.round(h * origRatio.current));
  };

  // Crop mouse handlers
  const handleCropMouseDown = function(e) {
    if (!image || !cropOverlayRef.current) return;
    const rect = cropOverlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragStart.current = { x, y };
    setCropBox({ x, y, w: 0, h: 0 });
  };
  const handleCropMouseMove = function(e) {
    if (!dragStart.current || !cropOverlayRef.current) return;
    const rect = cropOverlayRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const x = Math.min(dragStart.current.x, mx);
    const y = Math.min(dragStart.current.y, my);
    const w = Math.abs(mx - dragStart.current.x);
    const h = Math.abs(my - dragStart.current.y);
    setCropBox({ x, y, w, h });
  };
  const handleCropMouseUp = function() {
    dragStart.current = null;
  };

  const doEdit = function() {
    if (!image) return;
    setProcessing(true);
    setResultUrl(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tab === 'resize') {
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
    } else if (tab === 'crop') {
      if (!cropBox || cropBox.w < 5 || cropBox.h < 5) {
        setProcessing(false);
        return;
      }
      // Scale crop box from display to actual image size
      const displayRect = cropOverlayRef.current.getBoundingClientRect();
      const scaleX = image.width / displayRect.width;
      const scaleY = image.height / displayRect.height;
      const sx = cropBox.x * scaleX;
      const sy = cropBox.y * scaleY;
      const sw = cropBox.w * scaleX;
      const sh = cropBox.h * scaleY;
      canvas.width = sw;
      canvas.height = sh;
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    } else if (tab === 'compress') {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    } else if (tab === 'convert') {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    }

    let format = 'image/jpeg';
    let ext = 'jpg';
    if (tab === 'convert') {
      format = outFormat;
      ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    }

    const q = tab === 'compress' ? quality / 100 : 0.92;
    const dataUrl = canvas.toDataURL(format, q);

    const base64 = dataUrl.split(',')[1];
    const byteLength = atob(base64).length;
    setResultSize(byteLength);
    setResultUrl(dataUrl);
    setProcessing(false);
  };

  const download = function() {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = 'edited.' + (outFormat === 'image/png' ? 'png' : outFormat === 'image/webp' ? 'webp' : 'jpg');
    link.click();
  };

  const toggleLangOptions = function() {
    return (
      <select className="os9-select !w-auto" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
        <option value="ko">한국어</option>
        <option value="pt">Português</option>
      </select>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 640, width: '100%' }}>
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
            {toggleLangOptions()}
            <span className="text-[10px]" style={{ opacity: 0.5 }}>{t('maxSizeHint')}</span>
          </div>

          {/* Upload area */}
          {!image && (
            <div
              className="os9-result text-center py-10 px-4 cursor-pointer"
              style={{ border: '2px dashed var(--os9-border)', borderRadius: 8 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={function() { fileInputRef.current?.click(); }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.4 }}>&#128206;</div>
              <p style={{ opacity: 0.6 }}>{isDragging ? '' : t('dropHint')}</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={function(e) { handleFile(e.target.files[0]); }} style={{ display: 'none' }} />
            </div>
          )}

          {error && (
            <div className="os9-result mt-3 py-2 px-3 text-center" style={{ borderColor: '#c44', color: '#c44' }}>
              {error}
            </div>
          )}

          {image && (
            <>
              {/* Tab bar */}
              <div className="flex gap-1 mb-3 mt-2">
                {TABS.map(function(k, i) {
                  return <button key={k}
                    className={'os9-btn text-xs flex-1 px-1' + (tab === k ? ' os9-btn-primary' : '')}
                    onClick={function() { setTab(k); setResultUrl(null); }}
                    style={{ whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.2, paddingTop: 6, paddingBottom: 6 }}>
                    <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: 2 }}>{TAB_ICONS[i]}</span>
                    {t(k)}</button>;
                })}
              </div>

              {/* Controls */}
              <div className="mb-3">
                {tab === 'resize' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="os9-label">{t('width')} (px)</label>
                      <input className="os9-input" type="number" min={1} max={10000} value={newWidth}
                        onChange={function(e) { handleWidthChange(e.target.value); }} />
                    </div>
                    <div>
                      <label className="os9-label">{t('height')} (px)</label>
                      <input className="os9-input" type="number" min={1} max={10000} value={newHeight}
                        onChange={function(e) { handleHeightChange(e.target.value); }} />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <input type="checkbox" id="keepRatio" checked={keepRatio} onChange={function() { setKeepRatio(!keepRatio); }} />
                      <label htmlFor="keepRatio" className="text-xs" style={{ opacity: 0.7 }}>{t('preserveRatio')}</label>
                    </div>
                  </div>
                )}

                {tab === 'crop' && (
                  <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('dragToCrop')}</p>
                )}

                {tab === 'compress' && (
                  <div>
                    <label className="os9-label">{t('quality')}: {quality}%</label>
                    <input type="range" min={5} max={100} value={quality}
                      onChange={function(e) { setQuality(Number(e.target.value)); }}
                      className="w-full" style={{ accentColor: 'var(--os9-accent)' }} />
                    <div className="flex justify-between text-[10px]" style={{ opacity: 0.5 }}>
                      <span>5%</span><span>100%</span>
                    </div>
                  </div>
                )}

                {tab === 'convert' && (
                  <div>
                    <label className="os9-label">{t('format')}</label>
                    <select className="os9-select" value={outFormat} onChange={function(e) { setOutFormat(e.target.value); }}>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="mb-3">
                {tab === 'crop' ? (
                  <div className="relative" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                    <img ref={cropOverlayRef} src={image.src} alt="crop"
                      style={{ maxWidth: '100%', display: 'block', userSelect: 'none' }}
                      draggable={false} />
                    {cropBox && cropBox.w > 0 && cropBox.h > 0 && (
                      <div className="absolute"
                        style={{
                          left: cropBox.x, top: cropBox.y, width: cropBox.w, height: cropBox.h,
                          border: '2px solid #fff', outline: '1px solid rgba(0,0,0,0.3)',
                          background: 'rgba(255,255,255,0.15)', pointerEvents: 'none',
                        }} />
                    )}
                    <div className="absolute inset-0 cursor-crosshair"
                      onMouseDown={handleCropMouseDown}
                      onMouseMove={handleCropMouseMove}
                      onMouseUp={handleCropMouseUp}
                      onMouseLeave={handleCropMouseUp}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                  </div>
                ) : (
                  <img src={image.src} alt="preview" style={{ maxWidth: '100%', maxHeight: 300, display: 'block', margin: '0 auto', borderRadius: 4 }} />
                )}
                <p className="text-[10px] text-center mt-1" style={{ opacity: 0.5 }}>
                  {image.width}×{image.height} &middot; {formatBytes(origSize)}
                </p>
              </div>

              <button className="os9-btn os9-btn-primary w-full text-base py-3 mb-3" onClick={doEdit} disabled={processing}>
                {processing ? t('processing') : t('apply')}
              </button>

              {/* Result */}
              {resultUrl && (
                <div className="os9-result mt-2 p-3">
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ opacity: 0.6 }}>{t('preview')}</p>
                  <img src={resultUrl} alt="result" style={{ maxWidth: '100%', maxHeight: 250, display: 'block', margin: '0 auto', borderRadius: 4 }} />
                  <p className="text-[10px] text-center mt-1" style={{ opacity: 0.5 }}>
                    {formatBytes(resultSize)}
                    {origSize > 0 && (
                      <span> &middot; {Math.round((1 - resultSize / origSize) * 100)}% reduction</span>
                    )}
                  </p>
                  <button className="os9-btn w-full text-xs py-2 mt-2" onClick={download}>{t('download')}</button>
                </div>
              )}

              {/* Hidden canvas for processing */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 640, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline" style={{ opacity: 0.7 }}>Lotto</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/pdf'} className="underline" style={{ opacity: 0.7 }}>PDF</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        {t('footer')}
      </div>
    </div>
  );
}