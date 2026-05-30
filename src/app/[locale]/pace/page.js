'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/pace.json';
import esMsgs from '../../../messages/es/pace.json';
import zhMsgs from '../../../messages/zh/pace.json';
import koMsgs from '../../../messages/ko/pace.json';
import ptMsgs from '../../../messages/pt/pace.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function fmtPace(minPerKm) {
  const totalSec = Math.round(minPerKm * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')} /km`;
}

export default function PacePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/pace'; };

  const [mode, setMode] = useState('pace');
  const [distance, setDistance] = useState('10');
  const [unit, setUnit] = useState('km');
  const [timeH, setTimeH] = useState('0');
  const [timeM, setTimeM] = useState('45');
  const [timeS, setTimeS] = useState('0');
  const [paceM, setPaceM] = useState('5');
  const [paceS, setPaceS] = useState('0');

  const calcDistance = useMemo(() => {
    if (mode !== 'distance') return null;
    const h = parseInt(timeH) || 0;
    const m = parseInt(timeM) || 0;
    const s = parseInt(timeS) || 0;
    const totalMin = h * 60 + m + s / 60;
    const pm = parseInt(paceM) || 0;
    const ps = parseInt(paceS) || 0;
    const paceMin = pm + ps / 60;
    if (totalMin <= 0 || paceMin <= 0) return null;
    return totalMin / paceMin;
  }, [mode, timeH, timeM, timeS, paceM, paceS]);

  const calcTime = useMemo(() => {
    if (mode !== 'time') return null;
    const dist = parseFloat(distance) || 0;
    const pm = parseInt(paceM) || 0;
    const ps = parseInt(paceS) || 0;
    const paceMin = pm + ps / 60;
    if (dist <= 0 || paceMin <= 0) return null;
    const totalMin = dist * paceMin;
    const hh = Math.floor(totalMin / 60);
    const mm = Math.floor(totalMin % 60);
    const ss = Math.round((totalMin * 60) % 60);
    return { h: hh, m: mm, s: ss, label: `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}` };
  }, [mode, distance, paceM, paceS]);

  const calcPace = useMemo(() => {
    if (mode !== 'pace') return null;
    const dist = parseFloat(distance) || 0;
    const h = parseInt(timeH) || 0;
    const m = parseInt(timeM) || 0;
    const s = parseInt(timeS) || 0;
    const totalMin = h * 60 + m + s / 60;
    if (dist <= 0 || totalMin <= 0) return null;
    return fmtPace(totalMin / dist);
  }, [mode, distance, timeH, timeM, timeS]);

  const calcSpeed = useMemo(() => {
    if (mode !== 'speed') return null;
    const dist = parseFloat(distance) || 0;
    const h = parseInt(timeH) || 0;
    const m = parseInt(timeM) || 0;
    const s = parseInt(timeS) || 0;
    const totalH = h + m / 60 + s / 3600;
    if (dist <= 0 || totalH <= 0) return null;
    return (dist / totalH).toFixed(2);
  }, [mode, distance, timeH, timeM, timeS]);

  const paceDisplay = calcPace;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 460, width: '100%' }}>
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

          {/* Mode tabs */}
          <div className="flex gap-1 mb-4 flex-wrap" style={{ justifyContent: 'center' }}>
            {['pace', 'speed', 'time', 'distance'].map(m => (
              <button key={m} className={'os9-btn text-xs flex-1 ' + (mode === m ? 'os9-btn-primary' : '')}
                onClick={() => setMode(m)} style={{ padding: '8px 4px' }}>{t(m)}</button>
            ))}
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{t('distance')} ({unit === 'km' ? 'km' : 'mi'})</label>
              <input className="os9-input w-full" type="number" min="0" step="0.1" value={distance}
                onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('time')} (HH:MM:SS)</label>
              <div className="flex gap-2">
                <input className="os9-input text-center" type="number" min="0" value={timeH}
                  onChange={(e) => setTimeH(e.target.value)} style={{ width: '33%' }} placeholder="HH" />
                <input className="os9-input text-center" type="number" min="0" max="59" value={timeM}
                  onChange={(e) => setTimeM(e.target.value)} style={{ width: '33%' }} placeholder="MM" />
                <input className="os9-input text-center" type="number" min="0" max="59" value={timeS}
                  onChange={(e) => setTimeS(e.target.value)} style={{ width: '33%' }} placeholder="SS" />
              </div>
            </div>
            <div>
              <label className="os9-label">{t('pace')} (MM:SS /km)</label>
              <div className="flex gap-2">
                <input className="os9-input text-center" type="number" min="0" value={paceM}
                  onChange={(e) => setPaceM(e.target.value)} style={{ width: '50%' }} placeholder="MM" />
                <input className="os9-input text-center" type="number" min="0" max="59" value={paceS}
                  onChange={(e) => setPaceS(e.target.value)} style={{ width: '50%' }} placeholder="SS" />
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="os9-result text-center min-h-[60px] flex items-center justify-center">
            {mode === 'pace' && calcPace && <div className="os9-big-number">{calcPace}</div>}
            {mode === 'speed' && calcSpeed && <div><div className="os9-big-number">{calcSpeed}</div><div className="text-xs" style={{ opacity: 0.5 }}>km/h</div></div>}
            {mode === 'time' && calcTime && <div><div className="os9-big-number">{calcTime.label}</div><div className="text-xs" style={{ opacity: 0.5 }}>{t('totalTime')}</div></div>}
            {mode === 'distance' && calcDistance && <div><div className="os9-big-number">{calcDistance.toFixed(2)}</div><div className="text-xs" style={{ opacity: 0.5 }}>{unit === 'km' ? 'km' : 'mi'}</div></div>}
          </div>
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/duration`} className="underline">Time Duration Calculator</a>
                <a href={`/${locale}/timer`} className="underline">Timer</a>
                <a href={`/${locale}/date`} className="underline">Date Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/pace'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Pace</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}