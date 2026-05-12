'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/markup.json';
import esMsgs from '../../../messages/es/markup.json';
import zhMsgs from '../../../messages/zh/markup.json';
import koMsgs from '../../../messages/ko/markup.json';
import ptMsgs from '../../../messages/pt/markup.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function MarkupPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/markup'; };

  const [cost, setCost] = useState('50');
  const [markupPercent, setMarkupPercent] = useState('30');
  const [result, setResult] = useState(null);

  const calc = () => {
    const c = parseFloat(cost) || 0;
    const m = parseFloat(markupPercent) || 0;
    if (c <= 0) return;
    const sellingPrice = c * (1 + m / 100);
    const profit = sellingPrice - c;
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    setResult({ cost: c, markup: m, sellingPrice, profit, margin });
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
              <label className="os9-label">{t('cost')}</label>
              <input className="os9-input w-full" type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('markupPercent')} (%)</label>
              <input className="os9-input w-full" type="number" min="0" max="1000" step="0.5" value={markupPercent} onChange={(e) => setMarkupPercent(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">{result.sellingPrice.toFixed(2)}</div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('sellingPrice')}</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-sm">
                <div>
                  <div className="font-semibold">{result.cost.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('cost')}</div>
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--os9-accent)' }}>{result.profit.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('profit')}</div>
                </div>
                <div>
                  <div className="font-semibold">{result.margin.toFixed(1)}%</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('margin')}</div>
                </div>
              </div>
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/discount`} className="underline">Discount Calculator</a>
                <a href={`/${locale}/percent`} className="underline">Percent Calculator</a>
                <a href={`/${locale}/vat`} className="underline">VAT Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/markup'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Markup</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}