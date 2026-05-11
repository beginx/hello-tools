'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/discount.json';
import esMsgs from '../../../messages/es/discount.json';
import zhMsgs from '../../../messages/zh/discount.json';
import koMsgs from '../../../messages/ko/discount.json';
import ptMsgs from '../../../messages/pt/discount.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function DiscountPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/discount'; };

  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (isNaN(p) || isNaN(d) || d < 0 || d > 100) {
      setResult(null);
      return;
    }
    const saved = p * d / 100;
    const final = p - saved;
    setResult({ final: Math.round(final * 100) / 100, saved: Math.round(saved * 100) / 100 });
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
          {/* Language selector */}
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Original Price */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('originalPrice')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t('placeholderPrice')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Discount Percent */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('discountPercent')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0" max="100"
              value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder={t('placeholderPercent')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('finalPrice')}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>${result.final.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('youSave')}</span>
                <span className="font-bold text-lg" style={{ color: '#22aa22' }}>${result.saved.toFixed(2)}</span>
              </div>
            </div>
          )}
          {!result && price && discount && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setPrice(''); setDiscount(''); setResult(null); }}>{t('clear')}</button>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/discount'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Discount</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}