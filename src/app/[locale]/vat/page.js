'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/vat.json';
import esMsgs from '../../../messages/es/vat.json';
import zhMsgs from '../../../messages/zh/vat.json';
import koMsgs from '../../../messages/ko/vat.json';
import ptMsgs from '../../../messages/pt/vat.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const VAT_RATES = [
  { label: 'UK 20%', rate: 20 },
  { label: 'EU Standard 21%', rate: 21 },
  { label: 'Germany 19%', rate: 19 },
  { label: 'France 20%', rate: 20 },
  { label: 'India GST 18%', rate: 18 },
  { label: 'Australia 10%', rate: 10 },
  { label: 'Japan 10%', rate: 10 },
  { label: 'UAE 5%', rate: 5 },
  { label: 'Switzerland 8.1%', rate: 8.1 },
  { label: 'Singapore 9%', rate: 9 },
];

export default function VatPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/vat'; };

  const [amount, setAmount] = useState('100');
  const [vatRate, setVatRate] = useState('20');
  const [mode, setMode] = useState('add'); // add or remove
  const [result, setResult] = useState(null);

  const calc = () => {
    const a = parseFloat(amount) || 0;
    const r = parseFloat(vatRate) || 0;
    if (a <= 0) return;
    if (mode === 'add') {
      const vat = a * (r / 100);
      const total = a + vat;
      setResult({ original: a, vat, total, rate: r });
    } else {
      const net = a / (1 + r / 100);
      const vat = a - net;
      setResult({ original: a, vat, total: net, rate: r });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 440, width: '100%' }}>
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
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn flex-1 text-sm ' + (mode === 'add' ? 'os9-btn-primary' : '')} onClick={() => setMode('add')}>{t('addVat')}</button>
            <button className={'os9-btn flex-1 text-sm ' + (mode === 'remove' ? 'os9-btn-primary' : '')} onClick={() => setMode('remove')}>{t('removeVat')}</button>
          </div>

          <div className="mb-3">
            <label className="os9-label">{mode === 'add' ? t('netAmount') : t('grossAmount')}</label>
            <input className="os9-input w-full" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="os9-label">{t('vatRate')}</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {VAT_RATES.map(v => (
                <button key={v.label} className={'os9-btn text-xs !py-1 ' + (parseFloat(vatRate) === v.rate ? 'os9-btn-primary' : '')}
                  onClick={() => setVatRate(String(v.rate))}>{v.label}</button>
              ))}
            </div>
            <input className="os9-input w-full" type="number" min="0" max="50" step="0.1" value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-semibold">{result.original.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{mode === 'add' ? t('netAmount') : t('grossAmount')}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--os9-accent)' }}>{result.vat.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('vatAmount')} ({result.rate}%)</div>
                </div>
                <div>
                  <div className="font-semibold">{result.total.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{mode === 'add' ? t('grossAmount') : t('netAmount')}</div>
                </div>
              </div>
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/discount`} className="underline">Discount Calculator</a>
                <a href={`/${locale}/tip`} className="underline">Tip Calculator</a>
                <a href={`/${locale}/percent`} className="underline">Percent Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 440, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/vat'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>VAT</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}