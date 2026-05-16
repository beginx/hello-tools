'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/speed.json';
import esMsgs from '../../../messages/es/speed.json';
import zhMsgs from '../../../messages/zh/speed.json';
import koMsgs from '../../../messages/ko/speed.json';
import ptMsgs from '../../../messages/pt/speed.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function SpeedPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/speed'; };

  const [mode, setMode] = useState('speed');
  const [distVal, setDistVal] = useState('');
  const [timeVal, setTimeVal] = useState('');
  const [speedVal, setSpeedVal] = useState('');
  const [distUnit, setDistUnit] = useState('km');
  const [timeUnit, setTimeUnit] = useState('h');
  const [speedUnit, setSpeedUnit] = useState('kmh');
  const [result, setResult] = useState(null);

  function toBaseKmH(val, unit) {
    if (unit === 'km') return val;
    if (unit === 'mi') return val * 1.60934;
    if (unit === 'm') return val / 1000;
    return val;
  }

  function fromBaseKmH(val, unit) {
    if (unit === 'km') return val;
    if (unit === 'mi') return val / 1.60934;
    if (unit === 'm') return val * 1000;
    return val;
  }

  function toBaseH(val, unit) {
    if (unit === 'h') return val;
    if (unit === 'min') return val / 60;
    if (unit === 's') return val / 3600;
    return val;
  }

  function fromBaseH(val, unit) {
    if (unit === 'h') return val;
    if (unit === 'min') return val * 60;
    if (unit === 's') return val * 3600;
    return val;
  }

  function formatVal(val) {
    if (val > 1000000 || (val < 0.001 && val !== 0)) return val.toExponential(3);
    if (val > 1000) return val.toFixed(0);
    if (val > 100) return val.toFixed(1);
    if (val > 1) return val.toFixed(2);
    return val.toFixed(4);
  }

  const calculate = () => {
    if (mode === 'speed') {
      const d = parseFloat(distVal);
      const t = parseFloat(timeVal);
      if (d > 0 && t > 0) {
        setResult({ type: 'speed', value: toBaseKmH(d, distUnit) / toBaseH(t, timeUnit) });
      }
    } else if (mode === 'distance') {
      const s = parseFloat(speedVal);
      const t = parseFloat(timeVal);
      if (s > 0 && t > 0) {
        let sBase = s;
        if (speedUnit === 'mph') sBase = s * 1.60934;
        else if (speedUnit === 'ms') sBase = s * 3.6;
        setResult({ type: 'distance', value: sBase * toBaseH(t, timeUnit) });
      }
    } else if (mode === 'time') {
      const d = parseFloat(distVal);
      const s = parseFloat(speedVal);
      if (d > 0 && s > 0) {
        let sBase = s;
        if (speedUnit === 'mph') sBase = s * 1.60934;
        else if (speedUnit === 'ms') sBase = s * 3.6;
        setResult({ type: 'time', value: toBaseKmH(d, distUnit) / sBase });
      }
    }
  };

  const clear = () => { setDistVal(''); setTimeVal(''); setSpeedVal(''); setResult(null); };

  const speedUnitLabel = speedUnit === 'kmh' ? t('unitKmph') : speedUnit === 'mph' ? t('unitMiph') : t('unitMs');

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

          <div className="os9-tab-group mb-3">
            {['speed', 'distance', 'time'].map(m => (
              <button key={m} className={'os9-tab text-xs ' + (mode === m ? 'os9-tab-active' : '')}
                onClick={() => { setMode(m); setResult(null); }}>
                {t(m === 'speed' ? 'speedLabel' : m === 'distance' ? 'distanceLabel' : 'timeLabel')}
              </button>
            ))}
          </div>

          {mode === 'speed' && (
            <>
              <div className="mb-3"><label className="os9-label">{t('distanceLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={distVal} onChange={(e) => setDistVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={distUnit} onChange={(e) => setDistUnit(e.target.value)}>
                    <option value="km">{t('unitKm')}</option><option value="mi">{t('unitMi')}</option><option value="m">{t('unitM')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-3"><label className="os9-label">{t('timeLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                    <option value="h">{t('unitH')}</option><option value="min">{t('unitMin')}</option><option value="s">{t('unitS')}</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {mode === 'distance' && (
            <>
              <div className="mb-3"><label className="os9-label">{t('speedLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={speedVal} onChange={(e) => setSpeedVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}>
                    <option value="kmh">{t('unitKmh')}</option><option value="mph">{t('unitMph')}</option><option value="ms">{t('unitMs')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-3"><label className="os9-label">{t('timeLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                    <option value="h">{t('unitH')}</option><option value="min">{t('unitMin')}</option><option value="s">{t('unitS')}</option>
                  </select>
                </div>
              </div>
            </>
          )}
          {mode === 'time' && (
            <>
              <div className="mb-3"><label className="os9-label">{t('distanceLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={distVal} onChange={(e) => setDistVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={distUnit} onChange={(e) => setDistUnit(e.target.value)}>
                    <option value="km">{t('unitKm')}</option><option value="mi">{t('unitMi')}</option><option value="m">{t('unitM')}</option>
                  </select>
                </div>
              </div>
              <div className="mb-3"><label className="os9-label">{t('speedLabel')}</label>
                <div className="flex gap-2">
                  <input className="os9-input flex-1" type="number" min={0} step="any" value={speedVal} onChange={(e) => setSpeedVal(e.target.value)} placeholder="0" />
                  <select className="os9-select !w-auto" value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}>
                    <option value="kmh">{t('unitKmh')}</option><option value="mph">{t('unitMph')}</option><option value="ms">{t('unitMs')}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 mb-4">
            <button className="os9-btn os9-btn-primary flex-1 text-base py-3" onClick={calculate}>{t('calculate')}</button>
            <button className="os9-btn !px-4" onClick={clear}>{t('clear')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <div className="os9-result text-center">
                <p className="os9-label mb-1">{mode === 'speed' ? t('speedLabel') : mode === 'distance' ? t('distanceLabel') : t('timeLabel')}</p>
                {result.type === 'speed' && <><p className="os9-big-number">{formatVal(result.value)}</p><p className="text-xs mt-1" style={{opacity:0.6}}>{speedUnitLabel}</p></>}
                {result.type === 'distance' && <><p className="os9-big-number">{formatVal(fromBaseKmH(result.value, distUnit))}</p><p className="text-xs mt-1" style={{opacity:0.6}}>{distUnit === 'km' ? t('unitKm') : distUnit === 'mi' ? t('unitMi') : t('unitM')}</p></>}
                {result.type === 'time' && <><p className="os9-big-number">{formatVal(fromBaseH(result.value, 'h'))}</p><p className="text-xs mt-1" style={{opacity:0.6}}>{t('unitH')}</p></>}
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
        <a href={'/' + locale + '/ohm'} className="underline">Ohm</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
