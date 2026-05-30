'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/cagr.json';
import esMsgs from '../../../messages/es/cagr.json';
import zhMsgs from '../../../messages/zh/cagr.json';
import koMsgs from '../../../messages/ko/cagr.json';
import ptMsgs from '../../../messages/pt/cagr.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CagrPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/cagr'; };

  const [initialValue, setInitialValue] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const iv = parseFloat(initialValue);
    const fv = parseFloat(finalValue);
    const y = parseFloat(years);
    if (!iv || !fv || !y || iv <= 0 || y <= 0) return;
    const cagr = Math.pow(fv / iv, 1 / y) - 1;
    const totalReturn = ((fv - iv) / iv) * 100;
    setResult({
      cagr: (cagr * 100).toFixed(2),
      totalReturn: totalReturn.toFixed(2)
    });
  };

  const clear = () => { setInitialValue(''); setFinalValue(''); setYears(''); setResult(null); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 400, width: '100%' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <p className="os9-label mb-1">{t('initialValue')}</p>
              <input className="os9-input" type="number" min="0" step="any" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} placeholder="1000" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('finalValue')}</p>
              <input className="os9-input" type="number" min="0" step="any" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} placeholder="2000" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('years')}</p>
              <input className="os9-input" type="number" min="1" max="100" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" />
            </div>
            <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculate}>{t('calculate')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result space-y-2">
                <div className="flex justify-between"><span>{t('cagrLabel')}</span><strong>{result.cagr}%</strong></div>
                <div className="flex justify-between"><span>{t('totalReturn')}</span><strong>{result.totalReturn}%</strong></div>
              </div>
              <button className="os9-btn !px-4 text-xs mt-2" onClick={clear}>{t('clear')}</button>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:400,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:400,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/sip'} className="underline">SIP</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/compound'} className="underline">Compound</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/simpleinterest'} className="underline">Simple Interest</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/loan'} className="underline">Loan</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/mortgage'} className="underline">Mortgage</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
