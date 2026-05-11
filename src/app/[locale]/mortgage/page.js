'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/mortgage.json';
import esMsgs from '../../../messages/es/mortgage.json';
import zhMsgs from '../../../messages/zh/mortgage.json';
import koMsgs from '../../../messages/ko/mortgage.json';
import ptMsgs from '../../../messages/pt/mortgage.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function calcMortgage(price, down, ratePct, years, tax, ins) {
  const p = parseFloat(price) || 0;
  const d = parseFloat(down) || 0;
  const r = (parseFloat(ratePct) || 0) / 100;
  const t = parseFloat(years) || 0;
  const taxYr = parseFloat(tax) || 0;
  const insYr = parseFloat(ins) || 0;

  const loanAmt = p - d;
  if (loanAmt <= 0 || t <= 0) return null;

  const monthlyRate = r / 12;
  const numPayments = t * 12;
  let monthlyPI; // principal + interest
  if (r === 0) {
    monthlyPI = loanAmt / numPayments;
  } else {
    monthlyPI = loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const monthlyTI = (taxYr + insYr) / 12; // tax + insurance
  const totalMonthly = monthlyPI + monthlyTI;
  const totalPayment = monthlyPI * numPayments;
  const totalInterest = totalPayment - loanAmt;

  // Year-by-year amortization schedule
  const yearly = [];
  let balance = loanAmt;
  for (let y = 1; y <= t; y++) {
    let yrPrincipal = 0;
    let yrInterest = 0;
    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const intPart = balance * monthlyRate;
      const prinPart = monthlyPI - intPart;
      yrPrincipal += Math.min(prinPart, balance);
      yrInterest += intPart;
      balance -= prinPart;
      if (balance < 0) balance = 0;
    }
    yearly.push({
      year: y,
      principal: Math.round(yrPrincipal * 100) / 100,
      interest: Math.round(yrInterest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return {
    loanAmount: Math.round(loanAmt * 100) / 100,
    monthlyPI: Math.round(monthlyPI * 100) / 100,
    monthlyTI: Math.round(monthlyTI * 100) / 100,
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearly,
  };
}

const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MortgagePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/mortgage'; };

  const [price, setPrice] = useState('');
  const [down, setDown] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [tax, setTax] = useState('');
  const [ins, setIns] = useState('');
  const [result, setResult] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const calc = () => {
    setResult(calcMortgage(price, down, rate, years, tax, ins));
    setShowTable(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 460, width: '100%' }}>
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

          {/* Home Price */}
          <div className="mb-2">
            <label className="os9-label block text-xs mb-1">{t('homePrice')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t('placeholderPrice')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Down Payment */}
          <div className="mb-2">
            <label className="os9-label block text-xs mb-1">{t('downPayment')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={down} onChange={(e) => setDown(e.target.value)} placeholder={t('placeholderDown')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Interest Rate */}
          <div className="mb-2">
            <label className="os9-label block text-xs mb-1">{t('rate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={rate} onChange={(e) => setRate(e.target.value)} placeholder={t('placeholderRate')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Term */}
          <div className="mb-2">
            <label className="os9-label block text-xs mb-1">{t('termYears')}</label>
            <input className="os9-input w-full" type="number" step="any" min="1"
              value={years} onChange={(e) => setYears(e.target.value)} placeholder={t('placeholderTerm')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Property Tax & Insurance in one row */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <label className="os9-label block text-xs mb-1">{t('propertyTax')}</label>
              <input className="os9-input w-full" type="number" step="any" min="0"
                value={tax} onChange={(e) => setTax(e.target.value)} placeholder={t('placeholderTax')}
                style={{ fontSize: 14, padding: '8px 6px' }} />
            </div>
            <div className="flex-1">
              <label className="os9-label block text-xs mb-1">{t('insurance')}</label>
              <input className="os9-input w-full" type="number" step="any" min="0"
                value={ins} onChange={(e) => setIns(e.target.value)} placeholder={t('placeholderInsurance')}
                style={{ fontSize: 14, padding: '8px 6px' }} />
            </div>
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <>
              <div className="os9-result" style={{ padding: '16px 12px', marginBottom: 12 }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="os9-label text-sm">{t('monthlyPayment')}</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>{fmt(result.totalMonthly)}</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-xs" style={{ opacity: 0.7 }}>
                  <span>{t('principalLabel')} + {t('interestLabel')}</span>
                  <span>{fmt(result.monthlyPI)}</span>
                </div>
                <div className="flex justify-between items-center mb-3 text-xs" style={{ opacity: 0.7 }}>
                  <span>{t('taxInsurance')}</span>
                  <span>{fmt(result.monthlyTI)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="os9-label text-sm">{t('totalPayment')}</span>
                  <span className="font-bold">{fmt(result.totalPayment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="os9-label text-sm">{t('totalInterest')}</span>
                  <span className="font-bold" style={{ color: '#22aa22' }}>{fmt(result.totalInterest)}</span>
                </div>
              </div>

              {/* Amortization table */}
              {showTable && result.yearly && result.yearly.length > 0 && (
                <details open>
                  <summary className="text-xs underline cursor-pointer mb-2" style={{ opacity: 0.7 }}>{t('yearTable')} ({result.yearly.length})</summary>
                  <div className="os9-table-wrap" style={{ maxHeight: 240, overflowY: 'auto', fontSize: 11 }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="sticky top-0" style={{ background: 'var(--os9-bg)', borderBottom: '1px solid var(--os9-border)' }}>
                          <th className="text-left p-1">{t('yearTable')}</th>
                          <th className="text-right p-1">{t('principalLabel')}</th>
                          <th className="text-right p-1">{t('interestLabel')}</th>
                          <th className="text-right p-1">{t('balanceTable') || 'Balance'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearly.map((row) => (
                          <tr key={row.year} className="border-b" style={{ borderColor: 'var(--os9-border)', opacity: 0.8 }}>
                            <td className="p-1">{row.year}</td>
                            <td className="text-right p-1">{fmt(row.principal)}</td>
                            <td className="text-right p-1" style={{ color: '#22aa22' }}>{fmt(row.interest)}</td>
                            <td className="text-right p-1 font-bold">{fmt(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </>
          )}
          {!result && showTable && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setPrice(''); setDown(''); setRate(''); setYears(''); setTax(''); setIns(''); setResult(null); setShowTable(false); }}>{t('clear')}</button>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/mortgage'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Mortgage</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}