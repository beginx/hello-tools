'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/sqft.json';
import esMsgs from '../../../messages/es/sqft.json';
import zhMsgs from '../../../messages/zh/sqft.json';
import koMsgs from '../../../messages/ko/sqft.json';
import ptMsgs from '../../../messages/pt/sqft.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

var fmtNum = function(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function SqftPage() {
  var params = useParams();
  var locale = params?.locale || 'en';
  var t = function(k) { return (pageMsgs[locale] || pageMsgs.en)[k] || k; };
  var changeLang = function(l) { window.location.href = '/' + l + '/sqft'; };

  var [shape, setShape] = useState('rectangle');
  var [length, setLength] = useState('');
  var [width, setWidth] = useState('');
  var [radius, setRadius] = useState('');
  var [base, setBase] = useState('');
  var [height, setHeight] = useState('');
  var [area, setArea] = useState(null);

  var calc = function() {
    var a = null;
    if (shape === 'rectangle') {
      var l = parseFloat(length);
      var w = parseFloat(width);
      if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) a = l * w;
    } else if (shape === 'circle') {
      var r = parseFloat(radius);
      if (!isNaN(r) && r > 0) a = Math.PI * r * r;
    } else if (shape === 'triangle') {
      var b = parseFloat(base);
      var h = parseFloat(height);
      if (!isNaN(b) && !isNaN(h) && b > 0 && h > 0) a = 0.5 * b * h;
    }
    setArea(a !== null ? Math.round(a * 100) / 100 : null);
  };

  var clearAll = function() {
    setLength(''); setWidth(''); setRadius(''); setBase(''); setHeight(''); setArea(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 420, width: '100%' }}>
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
            <select className="os9-select !w-auto text-sm" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('selectShape')}</label>
            <select className="os9-select w-full text-sm" value={shape}
              onChange={function(e) { setShape(e.target.value); clearAll(); }}>
              <option value="rectangle">{t('rectangle')}</option>
              <option value="circle">{t('circle')}</option>
              <option value="triangle">{t('triangle')}</option>
            </select>
          </div>

          {shape === 'rectangle' && (
            <>
              <div className="mb-4">
                <label className="os9-label block text-xs mb-1">{t('length')}</label>
                <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
                  value={length} onChange={function(e) { setLength(e.target.value); }}
                  style={{ fontSize: 16, padding: '10px 8px' }} />
              </div>
              <div className="mb-4">
                <label className="os9-label block text-xs mb-1">{t('width')}</label>
                <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
                  value={width} onChange={function(e) { setWidth(e.target.value); }}
                  style={{ fontSize: 16, padding: '10px 8px' }} />
              </div>
            </>
          )}

          {shape === 'circle' && (
            <div className="mb-4">
              <label className="os9-label block text-xs mb-1">{t('radius')}</label>
              <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
                value={radius} onChange={function(e) { setRadius(e.target.value); }}
                style={{ fontSize: 16, padding: '10px 8px' }} />
            </div>
          )}

          {shape === 'triangle' && (
            <>
              <div className="mb-4">
                <label className="os9-label block text-xs mb-1">{t('base')}</label>
                <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
                  value={base} onChange={function(e) { setBase(e.target.value); }}
                  style={{ fontSize: 16, padding: '10px 8px' }} />
              </div>
              <div className="mb-4">
                <label className="os9-label block text-xs mb-1">{t('height')}</label>
                <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
                  value={height} onChange={function(e) { setHeight(e.target.value); }}
                  style={{ fontSize: 16, padding: '10px 8px' }} />
              </div>
            </>
          )}

          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {area !== null && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('areaResult')}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>{fmtNum(area)} {t('sqft')}</span>
              </div>
            </div>
          )}
          {area === null && ((shape === 'rectangle' && (length || width)) || (shape === 'circle' && radius) || (shape === 'triangle' && (base || height))) && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>Please enter valid positive numbers</p>
          )}

          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={clearAll}>{t('clear')}</button>
          </div>

          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={'/' + locale + '/convert'} className="underline">Unit Converter</a>
                <a href={'/' + locale + '/fuelcost'} className="underline">Fuel Cost Calculator</a>
                <a href={'/' + locale + '/discount'} className="underline">Discount Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/sqft'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Sq Ft</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}