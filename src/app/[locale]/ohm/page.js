'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/ohm.json';
import esMsgs from '../../../messages/es/ohm.json';
import zhMsgs from '../../../messages/zh/ohm.json';
import koMsgs from '../../../messages/ko/ohm.json';
import ptMsgs from '../../../messages/pt/ohm.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function OhmPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/ohm'; };

  const [v, setV] = useState('');
  const [i, setI] = useState('');
  const [r, setR] = useState('');
  const [p, setP] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const nV = parseFloat(v);
    const nI = parseFloat(i);
    const nR = parseFloat(r);
    const nP = parseFloat(p);
    let filled = 0;
    if (v !== '' && !isNaN(nV)) filled++;
    if (i !== '' && !isNaN(nI)) filled++;
    if (r !== '' && !isNaN(nR)) filled++;
    if (p !== '' && !isNaN(nP)) filled++;
    if (filled < 2) return;

    let res = {};
    if (v !== '' && i !== '' && !isNaN(nV) && !isNaN(nI) && nI !== 0) {
      res.rv = nV / nI; res.pv = nV * nI;
    }
    if (v !== '' && r !== '' && !isNaN(nV) && !isNaN(nR) && nR !== 0) {
      res.iv = nV / nR; res.pv2 = (nV * nV) / nR;
    }
    if (v !== '' && p !== '' && !isNaN(nV) && !isNaN(nP) && nV !== 0) {
      res.iv2 = nP / nV; res.rv2 = (nV * nV) / nP;
    }
    if (i !== '' && r !== '' && !isNaN(nI) && !isNaN(nR)) {
      res.vv = nI * nR; res.pv3 = (nI * nI) * nR;
    }
    if (i !== '' && p !== '' && !isNaN(nI) && !isNaN(nP) && nI !== 0) {
      res.vv2 = nP / nI; res.rv3 = nP / (nI * nI);
    }
    if (r !== '' && p !== '' && !isNaN(nR) && !isNaN(nP)) {
      res.vv3 = Math.sqrt(nP * nR); res.iv3 = Math.sqrt(nP / nR);
    }
    setResult(res);
  };

  const clear = () => { setV(''); setI(''); setR(''); setP(''); setResult(null); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
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
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <p className="text-xs mb-4 text-center" style={{ opacity: 0.6 }}>{t('selectTwo')}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="os9-label">{t('voltage')}</label><input className="os9-input" type="number" step="any" min={0} value={v} onChange={(e) => setV(e.target.value)} placeholder="0" /></div>
            <div><label className="os9-label">{t('current')}</label><input className="os9-input" type="number" step="any" min={0} value={i} onChange={(e) => setI(e.target.value)} placeholder="0" /></div>
            <div><label className="os9-label">{t('resistance')}</label><input className="os9-input" type="number" step="any" min={0} value={r} onChange={(e) => setR(e.target.value)} placeholder="0" /></div>
            <div><label className="os9-label">{t('power')}</label><input className="os9-input" type="number" step="any" min={0} value={p} onChange={(e) => setP(e.target.value)} placeholder="0" /></div>
          </div>

          <div className="flex gap-2">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={calc}>{t('calculate')}</button>
            <button className="os9-btn !px-4" onClick={clear}>{t('clear')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2">
                {(result.vv !== undefined || result.vv2 !== undefined || result.vv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultVoltage')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.vv || result.vv2 || result.vv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitV')}</p>
                  </div>
                )}
                {(result.iv !== undefined || result.iv2 !== undefined || result.iv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultCurrent')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.iv || result.iv2 || result.iv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitI')}</p>
                  </div>
                )}
                {(result.rv !== undefined || result.rv2 !== undefined || result.rv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultResistance')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.rv || result.rv2 || result.rv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitR')}</p>
                  </div>
                )}
                {(result.pv !== undefined || result.pv2 !== undefined || result.pv3 !== undefined) && (
                  <div className="os9-result text-center">
                    <p className="text-[10px] uppercase" style={{opacity:0.6}}>{t('resultPower')}</p>
                    <p className="os9-big-number" style={{fontSize:'1.25rem'}}>{(result.pv || result.pv2 || result.pv3 || 0).toFixed(3)}</p>
                    <p className="text-[10px]" style={{opacity:0.5}}>{t('unitP')}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="os9-window" style={{maxWidth:440,width:'100%',marginTop:12}}>
        <div className="os9-window-body" style={{padding:'10px 14px'}}>
          <p className="text-xs leading-relaxed" style={{opacity:0.65}}>{t('seoDescription')}</p>
        </div>
      </div>
      <div className="os9-footer" style={{maxWidth:440,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/coinflip'} className="underline">Coin Flip</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/dice'} className="underline">Dice Roller</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/ratio'} className="underline">Ratio</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/speed'} className="underline">Speed</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
