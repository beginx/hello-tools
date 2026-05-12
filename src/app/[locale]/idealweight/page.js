'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/idealweight.json';
import esMsgs from '../../../messages/es/idealweight.json';
import zhMsgs from '../../../messages/zh/idealweight.json';
import koMsgs from '../../../messages/ko/idealweight.json';
import ptMsgs from '../../../messages/pt/idealweight.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

// Ideal weight formulas (all return kg)
function devine(gender, heightFeet, heightInches) {
  const totalInches = heightFeet * 12 + heightInches;
  const baseKg = gender === 'female' ? 45.5 : 50.0;
  return baseKg + 2.3 * (totalInches - 60);
}
function hamwi(gender, heightFeet, heightInches) {
  const totalInches = heightFeet * 12 + heightInches;
  const baseKg = gender === 'female' ? 45.5 : 48.0;
  return baseKg + (gender === 'female' ? 2.2 : 2.7) * (totalInches - 60);
}
function robinson(gender, heightFeet, heightInches) {
  const totalInches = heightFeet * 12 + heightInches;
  const baseKg = gender === 'female' ? 49.0 : 52.0;
  return baseKg + 1.7 * (totalInches - 60);
}
function miller(gender, heightFeet, heightInches) {
  const totalInches = heightFeet * 12 + heightInches;
  const baseKg = gender === 'female' ? 53.1 : 56.2;
  return baseKg + (gender === 'female' ? 1.36 : 1.41) * (totalInches - 60);
}
function bmiIdeal(heightCm) {
  const bmiMin = 18.5;
  const bmiMax = 24.9;
  const hM = heightCm / 100;
  return { min: Math.round(bmiMin * hM * hM * 10) / 10, max: Math.round(bmiMax * hM * hM * 10) / 10 };
}

export default function IdealWeightPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/idealweight'; };

  const [gender, setGender] = useState('male');
  const [unit, setUnit] = useState('metric');
  const [heightCm, setHeightCm] = useState('175');
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('9');
  const [result, setResult] = useState(null);

  const calc = () => {
    let hFeet, hInches;
    if (unit === 'metric') {
      const totalCm = parseFloat(heightCm) || 0;
      if (totalCm <= 0) return;
      const totalInches = totalCm / 2.54;
      hFeet = Math.floor(totalInches / 12);
      hInches = totalInches % 12;
    } else {
      hFeet = parseInt(heightFeet) || 0;
      hInches = parseFloat(heightInches) || 0;
    }
    if (hFeet < 3 || (hFeet === 3 && hInches < 0)) return;
    const d = devine(gender, hFeet, hInches);
    const h = hamwi(gender, hFeet, hInches);
    const r = robinson(gender, hFeet, hInches);
    const m = miller(gender, hFeet, hInches);
    const totalCm = unit === 'metric' ? parseFloat(heightCm) : (hFeet * 12 + hInches) * 2.54;
    const bmi = bmiIdeal(totalCm);
    const avg = (d + h + r + m) / 4;
    setResult({ devine: d, hamwi: h, robinson: r, miller: m, average: avg, bmiMin: bmi.min, bmiMax: bmi.max });
  };

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

          {/* Gender toggle */}
          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn !px-6 ' + (gender === 'male' ? 'os9-btn-primary' : '')} onClick={() => setGender('male')}>{t('male')}</button>
            <button className={'os9-btn !px-6 ' + (gender === 'female' ? 'os9-btn-primary' : '')} onClick={() => setGender('female')}>{t('female')}</button>
          </div>

          {/* Unit toggle */}
          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn text-xs ' + (unit === 'metric' ? 'os9-btn-primary' : '')} onClick={() => setUnit('metric')}>{t('metric')}</button>
            <button className={'os9-btn text-xs ' + (unit === 'imperial' ? 'os9-btn-primary' : '')} onClick={() => setUnit('imperial')}>{t('imperial')}</button>
          </div>

          {unit === 'metric' ? (
            <div className="mb-4">
              <label className="os9-label">{t('heightCm')}</label>
              <input className="os9-input w-full" type="number" min="100" max="250" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="os9-label">{t('heightFeet')}</label>
                <input className="os9-input w-full" type="number" min="3" max="8" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} />
              </div>
              <div>
                <label className="os9-label">{t('heightInches')}</label>
                <input className="os9-input w-full" type="number" min="0" max="11" step="0.5" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
              </div>
            </div>
          )}

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">{Math.round(result.average * 10) / 10}<span style={{ fontSize: '1rem', opacity: 0.5 }}> kg</span></div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('avgIdeal')}</div>
                <div className="text-xs mt-1" style={{ opacity: 0.5 }}>{t('bmiRange')}: {result.bmiMin} – {result.bmiMax} kg</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div><span style={{ opacity: 0.5 }}>Devine: </span><span className="font-semibold">{Math.round(result.devine * 10) / 10} kg</span></div>
                <div><span style={{ opacity: 0.5 }}>Hamwi: </span><span className="font-semibold">{Math.round(result.hamwi * 10) / 10} kg</span></div>
                <div><span style={{ opacity: 0.5 }}>Robinson: </span><span className="font-semibold">{Math.round(result.robinson * 10) / 10} kg</span></div>
                <div><span style={{ opacity: 0.5 }}>Miller: </span><span className="font-semibold">{Math.round(result.miller * 10) / 10} kg</span></div>
              </div>
            </div>
          )}

          {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/bmi`} className="underline">BMI Calculator</a>
                <a href={`/${locale}/bodyfat`} className="underline">Body Fat Calculator</a>
                <a href={`/${locale}/calorie`} className="underline">Calorie Calculator</a>
                <a href={`/${locale}/waterintake`} className="underline">Water Intake Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/idealweight'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Ideal Weight</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}