'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/emi.json';
import esMsgs from '../../../messages/es/emi.json';
import zhMsgs from '../../../messages/zh/emi.json';
import koMsgs from '../../../messages/ko/emi.json';
import ptMsgs from '../../../messages/pt/emi.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

var fmtNum = function(n, loc) {
  if (loc === 'ko') return Math.round(n).toLocaleString('ko-KR');
  if (loc === 'es') return Math.round(n).toLocaleString('es-ES');
  if (loc === 'pt') return Math.round(n).toLocaleString('pt-BR');
  if (loc === 'zh') return Math.round(n).toLocaleString('zh-CN');
  return Math.round(n).toLocaleString('en-US');
};

export default function EmiPage() {
  var params = useParams();
  var locale = params?.locale || 'en';
  var t = function(k) { return (pageMsgs[locale] || pageMsgs.en)[k] || k; };
  var changeLang = function(l) { window.location.href = '/' + l + '/emi'; };

  var [amount, setAmount] = useState('');
  var [rate, setRate] = useState('');
  var [tenure, setTenure] = useState('');
  var [tenureUnit, setTenureUnit] = useState('years');
  var [result, setResult] = useState(null);

  var calc = function() {
    var p = parseFloat(amount);
    var r = parseFloat(rate) / 100 / 12;
    var n = parseInt(tenure);
    if (tenureUnit === 'years') n = n * 12;
    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) { setResult(null); return; }
    if (parseFloat(rate) === 0) {
      var monthly = p / n;
      setResult({ monthly: Math.round(monthly * 100) / 100, total: Math.round(monthly * n * 100) / 100, interest: 0 });
      return;
    }
    var emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var total = emi * n;
    setResult({
      monthly: Math.round(emi * 100) / 100,
      total: Math.round(total * 100) / 100,
      interest: Math.round((total - p) * 100) / 100
    });
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
            <label className="os9-label block text-xs mb-1">{t('loanAmount')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
              value={amount} onChange={function(e) { setAmount(e.target.value); }}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('interestRate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0" placeholder="0"
              value={rate} onChange={function(e) { setRate(e.target.value); }}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t(tenureUnit === 'years' ? 'tenureYears' : 'tenureMonths')}</label>
            <div className="flex gap-2">
              <input className="os9-input flex-1" type="number" step="1" min="0" placeholder="0"
                value={tenure} onChange={function(e) { setTenure(e.target.value); }}
                style={{ fontSize: 16, padding: '10px 8px' }} />
              <select className="os9-select !w-auto text-sm" value={tenureUnit}
                onChange={function(e) { setTenureUnit(e.target.value); }}>
                <option value="years">{t('tenureYears').replace('Loan Tenure (', '').replace(')','') || 'Years'}</option>
                <option value="months">{t('tenureMonths').replace('Loan Tenure (', '').replace(')','') || 'Months'}</option>
              </select>
            </div>
          </div>

          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('monthlyEmi')}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>${fmtNum(result.monthly, locale)}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="os9-label text-sm">{t('totalInterest')}</span>
                <span className="font-bold" style={{ color: '#22aa22' }}>${fmtNum(result.interest, locale)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('totalPayment')}</span>
                <span className="font-bold">${fmtNum(result.total, locale)}</span>
              </div>
            </div>
          )}
          {!result && amount && rate && tenure && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={function() { setAmount(''); setRate(''); setTenure(''); setTenureUnit('years'); setResult(null); }}>{t('clear')}</button>
          </div>

          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={'/' + locale + '/loan'} className="underline">Loan Calculator</a>
                <a href={'/' + locale + '/mortgage'} className="underline">Mortgage Calculator</a>
                <a href={'/' + locale + '/compound'} className="underline">Compound Interest Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/emi'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>EMI</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}