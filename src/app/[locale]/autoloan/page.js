'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/autoloan.json';
import esMsgs from '../../../messages/es/autoloan.json';
import zhMsgs from '../../../messages/zh/autoloan.json';
import koMsgs from '../../../messages/ko/autoloan.json';
import ptMsgs from '../../../messages/pt/autoloan.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function AutoloanPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/autoloan'; };

  const [price, setPrice] = useState('');
  const [down, setDown] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [result, setResult] = useState(null);

  const fmt = (n) => {
    if (locale === 'ko') return '\u20a9' + Math.round(n).toLocaleString('ko-KR');
    if (locale === 'es' || locale === 'pt') {
      const opts = { style: 'currency', currency: locale === 'es' ? 'EUR' : 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 };
      return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'pt-BR', opts).format(n);
    }
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calc = () => {
    const p = parseFloat(price);
    const d = parseFloat(down) || 0;
    const r = parseFloat(rate);
    const y = parseFloat(term);
    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || r < 0 || y <= 0 || d < 0 || d >= p) {
      setResult(null);
      return;
    }
    const principal = p - d;
    const annualRate = r / 100;
    if (annualRate === 0) {
      const monthly = principal / (y * 12);
      setResult({
        monthly: Math.round(monthly * 100) / 100,
        total: Math.round((monthly * y * 12) * 100) / 100,
        interest: 0,
        financed: principal,
        downAmt: d
      });
      return;
    }
    const monthlyRate = annualRate / 12;
    const numPayments = y * 12;
    const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const total = monthly * numPayments;
    setResult({
      monthly: Math.round(monthly * 100) / 100,
      total: Math.round((total) * 100) / 100,
      interest: Math.round((total - principal) * 100) / 100,
      financed: Math.round(principal * 100) / 100,
      downAmt: d
    });
  };

  const clearAll = () => {
    setPrice(''); setDown(''); setRate(''); setTerm(''); setResult(null);
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

          {/* Vehicle Price */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('vehiclePrice')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={price} onChange={(e) => { setPrice(e.target.value); setResult(null); }}
              placeholder={t('placeholderPrice')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Down Payment */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('downPayment')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={down} onChange={(e) => { setDown(e.target.value); setResult(null); }}
              placeholder={t('placeholderDown')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Interest Rate */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('interestRate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={rate} onChange={(e) => { setRate(e.target.value); setResult(null); }}
              placeholder={t('placeholderRate')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Loan Term */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('loanTerm')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={term} onChange={(e) => { setTerm(e.target.value); setResult(null); }}
              placeholder={t('placeholderTerm')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('monthlyPayment')}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>{fmt(result.monthly)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('amountFinanced')}</span>
                <span className="font-bold">{fmt(result.financed)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('totalPayment')}</span>
                <span className="font-bold">{fmt(result.total)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('totalInterest')}</span>
                <span className="font-bold" style={{ color: '#22aa22' }}>{fmt(result.interest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('downPaymentAmount')}</span>
                <span className="font-bold" style={{ opacity: 0.7 }}>{fmt(result.downAmt)}</span>
              </div>
            </div>
          )}
          {!result && price && rate && term && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={clearAll}>{t('clear')}</button>
          </div>

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/loan`} className="underline">Loan Calculator</a>
                <a href={`/${locale}/mortgage`} className="underline">Mortgage Calculator</a>
                <a href={`/${locale}/compound`} className="underline">Compound Interest Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/autoloan'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Auto Loan</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
