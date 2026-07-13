'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/creditcard.json';
import esMsgs from '../../../messages/es/creditcard.json';
import zhMsgs from '../../../messages/zh/creditcard.json';
import koMsgs from '../../../messages/ko/creditcard.json';
import ptMsgs from '../../../messages/pt/creditcard.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CreditcardPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/creditcard'; };
  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('18');
  const [payment, setPayment] = useState('200');
  const [result, setResult] = useState(null);

  const calc = () => {
    let bal = parseFloat(balance);
    const rate = parseFloat(apr) / 100 / 12;
    const pmt = parseFloat(payment);
    if (isNaN(bal) || isNaN(rate) || isNaN(pmt) || bal <= 0 || pmt <= 0) return;
    let months = 0, totalInterest = 0;
    while (bal > 0 && months < 600) {
      const interest = bal * rate;
      totalInterest += interest;
      bal = bal + interest - pmt;
      months++;
    }
    setResult({ months, totalInterest });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 520, width: '100%' }}>
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
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div className="mb-3"><label className="os9-label">{t('balance')}</label><input className="os9-input w-full" type="number" min="0" step="any" value={balance} onChange={(e) => setBalance(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><label className="os9-label">{t('apr')}</label><input className="os9-input" type="number" min="0" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} /></div>
                      <div><label className="os9-label">{t('payment')}</label><input className="os9-input" type="number" min="0" step="any" value={payment} onChange={(e) => setPayment(e.target.value)} /></div>
                    </div>
                    <button className="os9-btn os9-btn-primary w-full mb-3" onClick={calc}>{t('calculate')}</button>
                    {result && <div className="os9-result mb-3"><div className="grid grid-cols-2 gap-2 text-sm text-center">
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('months') || 'Months'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>{result.months}</div></div>
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalInterest') || 'Total Interest'}</div><div className="os9-big-number" style={{ fontSize: '1.5rem' }}>${result.totalInterest.toFixed(2)}</div></div>
                    </div></div>}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%', textAlign: 'center', fontSize: 10, opacity: 0.6, marginTop: 12 }}>
        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {t('footer') || 'hello-tools 2026'}
      </div>
    </div>
  );
}