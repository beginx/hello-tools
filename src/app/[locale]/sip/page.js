'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/sip.json';
import esMsgs from '../../../messages/es/sip.json';
import zhMsgs from '../../../messages/zh/sip.json';
import koMsgs from '../../../messages/ko/sip.json';
import ptMsgs from '../../../messages/pt/sip.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function SipPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/sip'; };

  const [monthly, setMonthly] = useState('1000');
  const [years, setYears] = useState('10');
  const [rate, setRate] = useState('12');
  const [result, setResult] = useState(null);

  const calc = () => {
    const m = parseFloat(monthly) || 0;
    const y = parseInt(years) || 0;
    const r = (parseFloat(rate) || 12) / 100;
    if (m <= 0 || y <= 0) return;

    const n = y * 12;
    const monthlyRate = r / 12;
    const totalInvested = m * n;
    const futureValue = m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    const estimatedReturns = futureValue - totalInvested;

    const breakdown = [];
    let balance = 0;
    for (let yr = 1; yr <= y; yr++) {
      for (let mo = 0; mo < 12; mo++) {
        balance = (balance + m) * (1 + monthlyRate);
      }
      breakdown.push({ year: yr, invested: m * yr * 12, value: Math.round(balance) });
    }

    setResult({ futureValue, totalInvested, estimatedReturns, breakdown });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 480, width: '100%' }}>
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
              <label className="os9-label">{t('monthly')}</label>
              <input className="os9-input w-full" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('years')}</label>
              <input className="os9-input w-full" type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('rate')} (%)</label>
              <input className="os9-input w-full" type="number" min="0" max="50" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">${Math.round(result.futureValue).toLocaleString()}</div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('maturity')}</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2 mt-3 text-center text-sm">
                <div>
                  <div className="font-semibold">${Math.round(result.totalInvested).toLocaleString()}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('invested')}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--os9-accent)' }}>${Math.round(result.estimatedReturns).toLocaleString()}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('returns')}</div>
                </div>
              </div>

              {result.breakdown.length > 0 && (
                <>
                  <hr className="os9-divider" />
                  <div className="mt-3">
                    <div className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('yearByYear')}</div>
                    <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                      <table className="w-full text-xs">
                        <thead><tr><th className="text-left pb-1" style={{ opacity: 0.5 }}>{t('year')}</th><th className="text-right pb-1" style={{ opacity: 0.5 }}>{t('invested')}</th><th className="text-right pb-1" style={{ opacity: 0.5 }}>{t('value')}</th></tr></thead>
                        <tbody>
                          {result.breakdown.map((row, i) => (
                            <tr key={i} className="border-t" style={{ borderColor: 'var(--os9-border)' }}>
                              <td className="py-1">{row.year}</td>
                              <td className="text-right py-1">${row.invested.toLocaleString()}</td>
                              <td className="text-right py-1 font-mono">${row.value.toLocaleString()}</td>
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
                <a href={`/${locale}/retirement`} className="underline">Retirement Calculator</a>
                <a href={`/${locale}/simpleinterest`} className="underline">Simple Interest Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/sip'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>SIP</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}