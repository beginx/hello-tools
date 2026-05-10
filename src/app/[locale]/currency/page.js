'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/currency.json';
import esMsgs from '../../../messages/es/currency.json';
import zhMsgs from '../../../messages/zh/currency.json';
import koMsgs from '../../../messages/ko/currency.json';
import ptMsgs from '../../../messages/pt/currency.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const CURRENCIES = [
  'USD','EUR','GBP','JPY','KRW','CNY','CAD','AUD','CHF',
  'HKD','SGD','INR','MXN','BRL','TRY','SEK','NOK','NZD','ZAR',
];

export default function CurrencyPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/currency'; };

  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KRW');
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.result === 'success') {
          setRates(data.rates);
          setLastUpdated(data.time_last_update_utc);
        } else {
          setError(t('fetchError'));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setError(t('fetchError')); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [t]);

  const doConvert = useCallback(() => {
    if (!rates || !amount) { setResult(null); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setResult(null); return; }
    const inUsd = from === 'USD' ? amt : amt / rates[from];
    const converted = inUsd * (rates[to] || 1);
    setResult(Math.round(converted * 100) / 100);
  }, [rates, amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const keyDown = (e) => { if (e.key === 'Enter') doConvert(); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
            {loading && <span className="text-[10px]" style={{ opacity: 0.5 }}>{t('loading')}</span>}
          </div>

          <div className="os9-result">
            {/* Amount */}
            <div className="mb-3">
              <label className="os9-label">{t('amount')}</label>
              <input className="os9-input" type="number" step="any" min="0" value={amount}
                onChange={(e) => setAmount(e.target.value)} onKeyDown={keyDown}
                placeholder="100" />
            </div>

            {/* From */}
            <div className="mb-3">
              <label className="os9-label">{t('from')}</label>
              <select className="os9-select" value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}>
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{c} — {t(c.toLowerCase())}</option>
                ))}
              </select>
            </div>

            {/* Swap button */}
            <div className="flex justify-center mb-3">
              <button className="os9-btn !rounded-full !px-4 !py-1 text-xs" onClick={swap} title="Swap currencies">⇅</button>
            </div>

            {/* To */}
            <div className="mb-3">
              <label className="os9-label">{t('to')}</label>
              <select className="os9-select" value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}>
                {CURRENCIES.map(c => (
                  <option key={c} value={c}>{c} — {t(c.toLowerCase())}</option>
                ))}
              </select>
            </div>

            {/* Convert button */}
            <button className="os9-btn os9-btn-primary w-full text-sm py-3"
              onClick={doConvert} disabled={loading || !!error}>
              {t('convert')}
            </button>

            {/* Error */}
            {error && (
              <p className="text-xs text-center mt-3" style={{ color: 'var(--os9-red)' }}>{error}</p>
            )}

            {/* Result */}
            {result !== null && !error && (
              <div className="mt-4">
                <hr className="os9-divider" />
                <div className="os9-result text-center">
                  <p className="text-xs mb-1" style={{ opacity: 0.6 }}>
                    {amount} {from} = 
                  </p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--os9-accent)' }}>
                    {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
                  </p>
                  {lastUpdated && (
                    <p className="text-[10px] mt-2" style={{ opacity: 0.4 }}>{t('lastUpdated')}: {lastUpdated}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/text'} className="underline" style={{ opacity: 0.7 }}>Text</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}