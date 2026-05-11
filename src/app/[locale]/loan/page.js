'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/loan.json';
import esMsgs from '../../../messages/es/loan.json';
import zhMsgs from '../../../messages/zh/loan.json';
import koMsgs from '../../../messages/ko/loan.json';
import ptMsgs from '../../../messages/pt/loan.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function calcLoan(amount, rate, years) {
  const principal = parseFloat(amount);
  const annualRate = parseFloat(rate) / 100;
  const numYears = parseFloat(years);
  if (isNaN(principal) || isNaN(annualRate) || isNaN(numYears) || principal <= 0 || annualRate < 0 || numYears <= 0) return null;
  if (annualRate === 0) {
    const monthly = principal / (numYears * 12);
    return { monthly: Math.round(monthly * 100) / 100, total: principal, interest: 0 };
  }
  const monthlyRate = annualRate / 12;
  const numPayments = numYears * 12;
  const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const total = monthly * numPayments;
  return {
    monthly: Math.round(monthly * 100) / 100,
    total: Math.round(total * 100) / 100,
    interest: Math.round((total - principal) * 100) / 100
  };
}

export default function LoanPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/loan'; };

  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    setResult(calcLoan(amount, rate, years));
  };

  const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

          {/* Loan Amount */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('amount')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('placeholderAmount')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Interest Rate */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('interestRate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={rate} onChange={(e) => setRate(e.target.value)} placeholder={t('placeholderRate')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Loan Term */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('termYears')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={years} onChange={(e) => setYears(e.target.value)} placeholder={t('placeholderTerm')}
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
                <span className="os9-label text-sm">{t('totalPayment')}</span>
                <span className="font-bold">{fmt(result.total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('totalInterest')}</span>
                <span className="font-bold" style={{ color: '#22aa22' }}>{fmt(result.interest)}</span>
              </div>
            </div>
          )}
          {!result && amount && rate && years && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setAmount(''); setRate(''); setYears(''); setResult(null); }}>{t('clear')}</button>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/loan'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Loan</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}