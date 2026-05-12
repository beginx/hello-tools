'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/simpleinterest.json';
import esMsgs from '../../../messages/es/simpleinterest.json';
import zhMsgs from '../../../messages/zh/simpleinterest.json';
import koMsgs from '../../../messages/ko/simpleinterest.json';
import ptMsgs from '../../../messages/pt/simpleinterest.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function SimpleInterestPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/simpleinterest'; };

  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [period, setPeriod] = useState('3');
  const [periodUnit, setPeriodUnit] = useState('years');
  const [result, setResult] = useState(null);

  const calc = () => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(period) || 0;
    if (p <= 0 || r <= 0 || t <= 0) return;

    const years = periodUnit === 'months' ? t / 12 : periodUnit === 'days' ? t / 365 : t;
    const interest = p * r * years;
    const total = p + interest;
    setResult({ principal: p, rate: parseFloat(rate) || 0, interest, total, years });
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

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{t('principal')}</label>
              <input className="os9-input w-full" type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('rate')} (%)</label>
              <input className="os9-input w-full" type="number" min="0" max="100" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('period')}</label>
              <div className="flex gap-2">
                <input className="os9-input" type="number" min="0" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ flex: 3, minWidth: 0 }} />
                <select className="os9-select" value={periodUnit} onChange={(e) => setPeriodUnit(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
                  <option value="years">{t('years')}</option>
                  <option value="months">{t('months')}</option>
                  <option value="days">{t('days')}</option>
                </select>
              </div>
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-semibold">{result.principal.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('principal')}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--os9-accent)' }}>{result.interest.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('interest')}</div>
                </div>
                <div>
                  <div className="font-semibold">{result.total.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('total')}</div>
                </div>
              </div>
              <hr className="os9-divider" />
              <p className="text-xs mt-2 text-center" style={{ opacity: 0.5 }}>{result.rate}% {t('apr')} {t('over')} {result.years.toFixed(2)} {t('years')}</p>
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
                <a href={`/${locale}/loan`} className="underline">Loan Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 440, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/simpleinterest'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Simple Interest</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}