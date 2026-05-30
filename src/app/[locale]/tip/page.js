'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/tip.json';
import esMsgs from '../../../messages/es/tip.json';
import zhMsgs from '../../../messages/zh/tip.json';
import koMsgs from '../../../messages/ko/tip.json';
import ptMsgs from '../../../messages/pt/tip.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function TipPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/tip'; };
  const fmt = (n) => {
    if (locale === 'ko') return '₩' + Math.round(n).toLocaleString('ko-KR');
    if (locale === 'es' || locale === 'pt') {
      const opts = { style: 'currency', currency: locale === 'es' ? 'EUR' : 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 };
      return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'pt-BR', opts).format(n);
    }
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('15');
  const [split, setSplit] = useState('1');
  const [result, setResult] = useState(null);

  const calc = () => {
    const b = parseFloat(bill);
    const tp = parseFloat(tipPct);
    const sp = parseInt(split) || 1;
    if (isNaN(b) || isNaN(tp) || b <= 0 || sp < 1) {
      setResult(null);
      return;
    }
    const tipAmt = b * tp / 100;
    const total = b + tipAmt;
    const perPerson = sp > 1 ? total / sp : null;
    setResult({
      tip: Math.round(tipAmt * 100) / 100,
      total: Math.round(total * 100) / 100,
      perPerson: perPerson !== null ? Math.round(perPerson * 100) / 100 : null,
      splitBy: sp,
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

          {/* Bill Amount */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('bill')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={bill} onChange={(e) => setBill(e.target.value)} placeholder={t('placeholderBill')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Tip Percentage */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('tipPercent')}</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {['10', '15', '18', '20'].map((pct) => (
                <button key={pct} className={`text-xs px-3 py-1 rounded-sm ${tipPct === pct ? 'font-bold' : ''}`}
                  style={{
                    background: tipPct === pct ? 'var(--os9-red)' : 'var(--os9-bg)',
                    color: tipPct === pct ? '#fff' : 'inherit',
                    border: '1px solid var(--os9-border)',
                    flex: 1, minWidth: 50,
                  }}
                  onClick={() => setTipPct(pct)}>{pct}%</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ opacity: 0.6 }}>{t('tip')}</span>
              <input className="os9-input flex-1 text-center" type="number" step="any" min="0" max="100"
                value={tipPct} onChange={(e) => setTipPct(e.target.value)} placeholder={t('placeholderTip')}
                style={{ fontSize: 14, padding: '8px 4px' }} />
            </div>
          </div>

          {/* Split */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('split')}</label>
            <div className="flex items-center gap-2">
              <input className="os9-input w-20 text-center" type="number" min="1" max="100"
                value={split} onChange={(e) => setSplit(e.target.value)} placeholder={t('placeholderSplit')}
                style={{ fontSize: 16, padding: '10px 4px' }} />
              <span className="text-xs" style={{ opacity: 0.6 }}>{t('people')}</span>
            </div>
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('tipAmount')}</span>
                <span className="font-bold" style={{ color: 'var(--os9-red)', fontSize: 20 }}>{fmt(result.tip)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('totalBill')}</span>
                <span className="font-bold" style={{ fontSize: 20 }}>{fmt(result.total)}</span>
              </div>
              {result.perPerson !== null && (
                <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid var(--os9-border)' }}>
                  <span className="os9-label text-sm">{t('perPerson')} ({result.splitBy} {t('people')})</span>
                  <span className="font-bold" style={{ color: '#22aa22', fontSize: 20 }}>{fmt(result.perPerson)}</span>
                </div>
              )}
            </div>
          )}
          {!result && bill && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setBill(''); setTipPct('15'); setSplit('1'); setResult(null); }}>{t('clear')}</button>
          </div>

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/discount`} className="underline">Discount Calculator</a>
                <a href={`/${locale}/salary`} className="underline">Salary Converter</a>
                <a href={`/${locale}/vat`} className="underline">VAT Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/tip'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tip</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}