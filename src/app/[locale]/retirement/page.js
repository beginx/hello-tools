'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/retirement.json';
import esMsgs from '../../../messages/es/retirement.json';
import zhMsgs from '../../../messages/zh/retirement.json';
import koMsgs from '../../../messages/ko/retirement.json';
import ptMsgs from '../../../messages/pt/retirement.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function RetirementPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/retirement'; };

  const [currentAge, setCurrentAge] = useState('30');
  const [retireAge, setRetireAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [result, setResult] = useState(null);

  const calc = () => {
    const cAge = parseInt(currentAge) || 0;
    const rAge = parseInt(retireAge) || 0;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = (parseFloat(annualReturn) || 7) / 100;
    const years = rAge - cAge;
    if (years <= 0 || rate <= 0) return;

    const monthlyRate = rate / 12;
    const totalMonths = years * 12;

    // Future value of current savings
    const fvLumpSum = savings * Math.pow(1 + rate, years);
    // Future value of monthly contributions
    const fvAnnuity = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalFV = fvLumpSum + fvAnnuity;

    // 4% safe withdrawal rule
    const annualWithdrawal = totalFV * 0.04;
    const monthlyWithdrawal = annualWithdrawal / 12;

    // Year-by-year breakdown
    const breakdown = [];
    let balance = savings;
    for (let y = 1; y <= years && y <= 40; y++) {
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyRate) + monthly;
      }
      breakdown.push({ year: cAge + y, balance: Math.round(balance) });
    }

    setResult({
      totalFV,
      annualWithdrawal,
      monthlyWithdrawal,
      totalContributions: savings + monthly * totalMonths,
      years,
      breakdown,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 500, width: '100%' }}>
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

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{t('currentAge')}</label>
              <input className="os9-input w-full" type="number" min="18" max="80" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('retireAge')}</label>
              <input className="os9-input w-full" type="number" min="30" max="100" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('currentSavings')}</label>
              <input className="os9-input w-full" type="number" min="0" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('monthlyContribution')}</label>
              <input className="os9-input w-full" type="number" min="0" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('annualReturn')} (%)</label>
              <input className="os9-input w-full" type="number" min="0" max="30" step="0.5" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">${Math.round(result.totalFV).toLocaleString()}</div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalAtRetirement')}</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-sm">
                <div>
                  <div className="font-semibold">${Math.round(result.monthlyWithdrawal).toLocaleString()}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('monthlySafe')}</div>
                </div>
                <div>
                  <div className="font-semibold">${Math.round(result.annualWithdrawal).toLocaleString()}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('annualSafe')}</div>
                </div>
                <div>
                  <div className="font-semibold">${Math.round(result.totalContributions).toLocaleString()}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('totalContributions')}</div>
                </div>
              </div>

              {result.breakdown.length > 0 && (
                <>
                  <hr className="os9-divider" />
                  <div className="mt-3">
                    <div className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('yearByYear')}</div>
                    <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                      <table className="w-full text-xs">
                        <thead><tr><th className="text-left pb-1" style={{ opacity: 0.5 }}>{t('age')}</th><th className="text-right pb-1" style={{ opacity: 0.5 }}>{t('balance')}</th></tr></thead>
                        <tbody>
                          {result.breakdown.map((row, i) => (
                            <tr key={i} className="border-t" style={{ borderColor: 'var(--os9-border)' }}>
                              <td className="py-1">{row.year}</td>
                              <td className="text-right py-1 font-mono">${row.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/compound`} className="underline">Compound Interest Calculator</a>
                <a href={`/${locale}/sip`} className="underline">SIP Calculator</a>
                <a href={`/${locale}/simpleinterest`} className="underline">Simple Interest Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 500, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/retirement'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Retirement</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}