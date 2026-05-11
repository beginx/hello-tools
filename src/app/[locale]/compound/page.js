'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/compound.json';
import esMsgs from '../../../messages/es/compound.json';
import zhMsgs from '../../../messages/zh/compound.json';
import koMsgs from '../../../messages/ko/compound.json';
import ptMsgs from '../../../messages/pt/compound.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function calcCompound(principal, monthly, ratePct, years) {
  const p = parseFloat(principal) || 0;
  const m = parseFloat(monthly) || 0;
  const r = (parseFloat(ratePct) || 0) / 100;
  const t = parseFloat(years) || 0;
  if (t <= 0) return null;

  const n = 12; // monthly compounding
  const ratePerPeriod = r / n;
  const totalPeriods = t * n;

  // FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)]
  let fvLumpSum = 0;
  if (p > 0) {
    fvLumpSum = p * Math.pow(1 + ratePerPeriod, totalPeriods);
  }
  let fvContributions = 0;
  if (m > 0 && r > 0) {
    fvContributions = m * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
  } else if (m > 0 && r === 0) {
    fvContributions = m * totalPeriods;
  }
  const futureValue = fvLumpSum + fvContributions;
  const totalContribs = p + m * totalPeriods;
  const totalInt = Math.max(0, futureValue - totalContribs);

  // Year-by-year breakdown
  const yearly = [];
  let bal = p;
  let cumContribs = p;
  for (let y = 1; y <= t; y++) {
    const startBal = bal;
    const yearDeposits = m * 12;
    cumContribs += yearDeposits;
    // compound monthly for this year
    for (let mo = 0; mo < 12; mo++) {
      if (r > 0) {
        bal = bal * (1 + ratePerPeriod) + m;
      } else {
        bal = bal + m;
      }
    }
    if (r === 0) bal = cumContribs;
    const yearInterest = bal - startBal - yearDeposits;
    yearly.push({
      year: y,
      deposits: Math.round(yearDeposits * 100) / 100,
      interest: Math.round(yearInterest * 100) / 100,
      balance: Math.round(bal * 100) / 100,
    });
  }

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    totalInterest: Math.round(totalInt * 100) / 100,
    totalContributions: Math.round(totalContribs * 100) / 100,
    yearly,
  };
}

const fmt = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CompoundPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/compound'; };

  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const calc = () => {
    setResult(calcCompound(initial, monthly, rate, years));
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

          {/* Initial Investment */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('initial')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={initial} onChange={(e) => setInitial(e.target.value)} placeholder={t('placeholderInitial')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Monthly Contribution */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('monthly')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder={t('placeholderMonthly')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Rate */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('rate')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={rate} onChange={(e) => setRate(e.target.value)} placeholder={t('placeholderRate')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Years */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('years')}</label>
            <input className="os9-input w-full" type="number" step="any" min="1"
              value={years} onChange={(e) => setYears(e.target.value)} placeholder={t('placeholderYears')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <>
              <div className="os9-result" style={{ padding: '16px 12px', marginBottom: 12 }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="os9-label text-sm">{t('futureValue')}</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--os9-red)' }}>{fmt(result.futureValue)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="os9-label text-sm">{t('totalContributions')}</span>
                  <span className="font-bold">{fmt(result.totalContributions)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="os9-label text-sm">{t('totalInterest')}</span>
                  <span className="font-bold" style={{ color: '#22aa22' }}>{fmt(result.totalInterest)}</span>
                </div>
              </div>

              {/* Year-by-year table */}
              {showTable && result.yearly && result.yearly.length > 0 && (
                <details open>
                  <summary className="text-xs underline cursor-pointer mb-2" style={{ opacity: 0.7 }}>{t('yearTable')} ({result.yearly.length})</summary>
                  <div className="os9-table-wrap" style={{ maxHeight: 240, overflowY: 'auto', fontSize: 11 }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="sticky top-0" style={{ background: 'var(--os9-bg)', borderBottom: '1px solid var(--os9-border)' }}>
                          <th className="text-left p-1">{t('yearTable')}</th>
                          <th className="text-right p-1">{t('depositTable')}</th>
                          <th className="text-right p-1">{t('interestTable')}</th>
                          <th className="text-right p-1">{t('balanceTable')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearly.map((row) => (
                          <tr key={row.year} className="border-b" style={{ borderColor: 'var(--os9-border)', opacity: 0.8 }}>
                            <td className="p-1">{row.year}</td>
                            <td className="text-right p-1">{fmt(row.deposits)}</td>
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
          {!result && (initial || monthly || rate || years) && showTable && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setInitial(''); setMonthly(''); setRate(''); setYears(''); setResult(null); setShowTable(false); }}>{t('clear')}</button>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/compound'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Compound</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}