'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PdfPage() {
  const t = useTranslations('pdf');
  const params = useParams();
  const locale = params?.locale || 'en';
  const changeLang = (l) => { window.location.href = '/' + l + '/pdf'; };

  const [tab, setTab] = useState('compress');
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const TABS = [
    { key: 'compress', label: t('compress') },
    { key: 'merge', label: t('merge') },
    { key: 'split', label: t('split') },
    { key: 'img2pdf', label: t('img2pdf') },
    { key: 'pdf2img', label: t('pdf2img') },
  ];

  const handleFileChange = useCallback((e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter(f => f.size <= MAX_SIZE);
    if (tab === 'merge') {
      setFiles(prev => [...prev, ...valid]);
    } else {
      setFiles(valid);
    }
    setResult(null);
  }, [tab]);

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  // ── compress ──
  const doCompress = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResult(null);
    try {
      const buf = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      // Remove unused objects & compress streams
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();
        page.setSize(width, height); // force re-encode
      }
      const compressed = await pdfDoc.save({ useObjectStreams: true });
      const origSize = files[0].size;
      const pct = Math.round((1 - compressed.byteLength / origSize) * 100);
      setResult({
        blob: new Blob([compressed], { type: 'application/pdf' }),
        name: 'compressed-' + files[0].name.replace('.pdf', '') + '.pdf',
        info: t('compressResult', { size: formatSize(compressed.byteLength), percent: pct }),
        size: compressed.byteLength,
      });
    } catch (e) {
      setResult({ error: true, msg: t('error') + ': ' + e.message });
    }
    setProcessing(false);
  };

  // ── merge ──
  const doMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setResult(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.arrayBuffer();
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
        const idx = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        idx.forEach(p => mergedPdf.addPage(p));
      }
      const merged = await mergedPdf.save({ useObjectStreams: true });
      setResult({
        blob: new Blob([merged], { type: 'application/pdf' }),
        name: 'merged.pdf',
        info: t('pages') + ': ' + mergedPdf.getPageCount() + ' | ' + formatSize(merged.byteLength),
        size: merged.byteLength,
      });
    } catch (e) {
      setResult({ error: true, msg: t('error') + ': ' + e.message });
    }
    setProcessing(false);
  };

  // ── split ──
  const [pageRange, setPageRange] = useState('');
  const doSplit = async () => {
    if (!files.length || !pageRange.trim()) return;
    setProcessing(true);
    setResult(null);
    try {
      const buf = await files[0].arrayBuffer();
      const srcPdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      const total = srcPdf.getPageCount();

      const ranges = [];
      const parts = pageRange.split(',');
      for (const p of parts) {
        const m = p.match(/^(\d+)-(\d+)$/);
        if (m) {
          const start = Math.max(1, parseInt(m[1]));
          const end = Math.min(total, parseInt(m[2]));
          for (let i = start; i <= end; i++) ranges.push(i - 1);
        } else {
          const n = parseInt(p);
          if (n >= 1 && n <= total) ranges.push(n - 1);
        }
      }
      if (!ranges.length) throw new Error('no valid range');

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(srcPdf, [...new Set(ranges)]);
      pages.forEach(p => newPdf.addPage(p));
      const split = await newPdf.save({ useObjectStreams: true });
      setResult({
        blob: new Blob([split], { type: 'application/pdf' }),
        name: 'split-' + files[0].name,
        info: t('pages') + ': ' + newPdf.getPageCount() + ' | ' + formatSize(split.byteLength),
        size: split.byteLength,
      });
    } catch (e) {
      setResult({ error: true, msg: t('error') + ': ' + e.message });
    }
    setProcessing(false);
  };

  // ── img2pdf ──
  const doImg2Pdf = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResult(null);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.arrayBuffer();
        let image;
        if (f.type === 'image/png') {
          image = await pdfDoc.embedPng(buf);
        } else if (f.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(buf);
        } else {
          // WebP / other — convert via canvas
          const img = await createImageBitmap(new Blob([buf], { type: f.type }));
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const jpegBuf = await new Promise(resolve => canvas.toBlob(b => b.arrayBuffer().then(resolve), 'image/jpeg', 0.92));
          image = await pdfDoc.embedJpg(jpegBuf);
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      setResult({
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
        name: 'images-to-pdf.pdf',
        info: t('pages') + ': ' + files.length + ' | ' + formatSize(pdfBytes.byteLength),
        size: pdfBytes.byteLength,
      });
    } catch (e) {
      setResult({ error: true, msg: t('error') + ': ' + e.message });
    }
    setProcessing(false);
  };

  // ── pdf2img ──
  const doPdf2Img = async () => {
    if (!files.length) return;
    setProcessing(true);
    setResult(null);
    try {
      const buf = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      // Use pdfjs-dist for rendering
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;

      const images = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        images.push(blob);
      }

      // Zip multiple images or single download
      if (images.length === 1) {
        setResult({
          blob: images[0],
          name: files[0].name.replace('.pdf', '') + '-page-1.png',
          info: '1 ' + t('pages') + ' → PNG',
          size: images[0].size,
        });
      } else {
        // Download as zip using JSZip-like approach or just provide first page
        // For simplicity, provide each as separate download message
        setResult({
          multi: true,
          images,
          info: images.length + ' ' + t('pages') + ' → PNG',
          namePrefix: files[0].name.replace('.pdf', ''),
        });
      }
    } catch (e) {
      setResult({ error: true, msg: t('error') + ': ' + e.message });
    }
    setProcessing(false);
  };

  const doAction = () => {
    switch (tab) {
      case 'compress': doCompress(); break;
      case 'merge': doMerge(); break;
      case 'split': doSplit(); break;
      case 'img2pdf': doImg2Pdf(); break;
      case 'pdf2img': doPdf2Img(); break;
    }
  };

  const downloadResult = () => {
    if (!result || result.error || !result.blob) return;
    if (result.multi) {
      result.images.forEach((blob, i) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = result.namePrefix + '-page-' + (i + 1) + '.png';
        a.click();
      });
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.blob);
      a.download = result.name;
      a.click();
    }
  };

  const acceptType = tab === 'img2pdf' ? 'image/*' : tab === 'merge' ? '.pdf' : '.pdf';
  const multiple = tab === 'merge' || tab === 'img2pdf';

  // File list component
  const FileList = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      {files.map((f, i) => (
        <div key={i} className="os9-result !py-2 !px-3 text-xs flex items-center gap-2"
          style={{ background: 'var(--os9-surface)' }}>
          <span className="truncate max-w-[150px]">{f.name}</span>
          <span style={{ opacity: 0.5 }}>({formatSize(f.size)})</span>
          <button onClick={() => removeFile(i)} className="text-xs font-bold"
            style={{ color: 'var(--os9-red)' }}>✕</button>
        </div>
      ))}
    </div>
  );

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

          {/* Tabs - align with os9-result border via negative margin */}
          <div className="os9-tab-group w-full" style={{ margin: '0 -2px' }}>
            {TABS.map(t => (
              <button key={t.key}
                className={'os9-tab text-[10px] ' + (tab === t.key ? 'os9-tab-active' : '')}
                onClick={() => { setTab(t.key); setFiles([]); setResult(null); }}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="os9-result" style={{ borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
            {/* Description */}
            <p className="text-xs mb-3" style={{ opacity: 0.7 }}>{t(tab + 'Desc')}</p>

            {/* Upload */}
            <div className="mb-3">
              <input type="file" ref={fileInputRef} accept={acceptType} multiple={multiple}
                onChange={handleFileChange} className="hidden" />
              <div className="flex gap-2 flex-wrap">
                <button className="os9-btn text-xs !py-2" onClick={() => fileInputRef.current?.click()}>
                  {tab === 'merge' ? t('selectFiles') : tab === 'img2pdf' ? t('selectImages') : t('selectFile')}
                </button>
                {(tab === 'merge' && files.length > 0) && (
                  <button className="os9-btn text-xs !py-2" onClick={() => fileInputRef.current?.click()}>
                    {t('addFiles')}
                  </button>
                )}
                {files.length > 0 && (
                  <button className="os9-btn text-xs !py-2" onClick={() => { setFiles([]); setResult(null); }}>
                    {t('clear')}
                  </button>
                )}
              </div>
              <FileList />
            </div>

            {/* Split-specific: page range input */}
            {tab === 'split' && files.length > 0 && (
              <div className="mb-3">
                <label className="os9-label">{t('pageRange')}</label>
                <input className="os9-input" value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)} placeholder={t('pageRangePlaceholder')} />
              </div>
            )}

            {/* Quality selector — only for compress */}
            {tab === 'compress' && files[0] && (
              <div className="mb-3">
                <label className="os9-label">{t('fileSize')}: {formatSize(files[0].size)}</label>
              </div>
            )}

            {/* Action button */}
            <button className="os9-btn os9-btn-primary w-full text-sm py-3"
              onClick={doAction} disabled={processing || !files.length}>
              {processing ? t('processing') : t('upload')}
            </button>

            {/* Result */}
            {result && (
              <div className="mt-4">
                <hr className="os9-divider" />
                {result.error ? (
                  <div className="os9-result text-center" style={{ color: 'var(--os9-red)' }}>
                    <p className="text-sm font-bold">{result.msg}</p>
                  </div>
                ) : (
                  <div className="os9-result text-center">
                    <p className="text-sm font-bold mb-2" style={{ color: 'var(--os9-green)' }}>
                      {t('success')}
                    </p>
                    <p className="text-xs mb-3" style={{ opacity: 0.6 }}>{result.info}</p>
                    <button className="os9-btn os9-btn-primary text-xs !py-2" onClick={downloadResult}>
                      {t('download')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No result placeholder */}
            {!result && files.length > 0 && (
              <p className="text-[10px] text-center mt-3" style={{ opacity: 0.4 }}>{t('maxSizeNote')}</p>
            )}
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 560, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo Editor</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline" style={{ opacity: 0.7 }}>Lotto</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/pdf'} className="underline" style={{ opacity: 0.7 }}>PDF</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}