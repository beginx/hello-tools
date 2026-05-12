'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/bodyfat.json';
import esMsgs from '../../../messages/es/bodyfat.json';
import zhMsgs from '../../../messages/zh/bodyfat.json';
import koMsgs from '../../../messages/ko/bodyfat.json';
import ptMsgs from '../../../messages/pt/bodyfat.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

// U.S. Navy body fat formula
function calcBodyFat(gender, heightCm, neckCm, waistCm, hipCm) {
  const h = parseFloat(heightCm);
  const n = parseFloat(neckCm);
  const w = parseFloat(waistCm);
  const hp = parseFloat(hipCm);
  if (isNaN(h) || isNaN(n) || isNaN(w) || h <= 0 || n <= 0 || w <= 0) return null;
  if (gender === 'female' && (isNaN(hp) || hp <= 0)) return null;

  // Convert cm to inches (U.S. Navy formula uses inches)
  const hIn = h / 2.54;
  const nIn = n / 2.54;
  const wIn = w / 2.54;

  let bf;
  if (gender === 'male') {
    bf = 86.010 * Math.log10(wIn - nIn) - 70.041 * Math.log10(hIn) + 36.76;
  } else {
    const hpIn = hp / 2.54;
    bf = 163.205 * Math.log10(wIn + hpIn - nIn) - 97.684 * Math.log10(hIn) - 78.387;
  }

  bf = Math.max(2, Math.min(bf, 70)); // clamp
  bf = Math.round(bf * 10) / 10;

  const weight_est = (hIn * hIn) / 420.4; // rough lean mass estimate
  const fatMass = weight_est * bf / 100;
  const leanMass = weight_est - fatMass;

  // Categories based on gender
  const categories = gender === 'male'
    ? [{ max: 6, label: 'athlete' }, { max: 14, label: 'fitness' }, { max: 25, label: 'acceptable' }]
    : [{ max: 14, label: 'athlete' }, { max: 21, label: 'fitness' }, { max: 32, label: 'acceptable' }];

  let cat = 'obese';
  for (const c of categories) {
    if (bf <= c.max) { cat = c.label; break; }
  }

  return { bf, fatMass: Math.round(fatMass * 10) / 10, leanMass: Math.round(leanMass * 10) / 10, category: cat };
}

export default function BodyFatPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/bodyfat'; };

  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    setResult(calcBodyFat(gender, height, neck, waist, gender === 'female' ? hip : null));
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

          {/* Gender */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('gender')}</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input type="radio" name="gender" value="male" checked={gender === 'male'}
                  onChange={() => setGender('male')} /> {t('male')}
              </label>
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input type="radio" name="gender" value="female" checked={gender === 'female'}
                  onChange={() => setGender('female')} /> {t('female')}
              </label>
            </div>
          </div>

          {/* Height */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('height')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={height} onChange={(e) => setHeight(e.target.value)} placeholder={t('placeholderHeight')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Neck */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('neck')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={neck} onChange={(e) => setNeck(e.target.value)} placeholder={t('placeholderNeck')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Waist */}
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{t('waist')}</label>
            <input className="os9-input w-full" type="number" step="any" min="0"
              value={waist} onChange={(e) => setWaist(e.target.value)} placeholder={t('placeholderWaist')}
              style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>

          {/* Hip (female only) */}
          {gender === 'female' && (
            <div className="mb-4">
              <label className="os9-label block text-xs mb-1">{t('hip')}</label>
              <input className="os9-input w-full" type="number" step="any" min="0"
                value={hip} onChange={(e) => setHip(e.target.value)} placeholder={t('placeholderHip')}
                style={{ fontSize: 16, padding: '10px 8px' }} />
            </div>
          )}

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              {/* Gauge bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1" style={{ opacity: 0.7 }}>
                  <span>2%</span>
                  <span className="font-bold">{t('bodyFatPct')}: {result.bf}%</span>
                  <span>70%</span>
                </div>
                <div className="w-full h-4 rounded-sm flex overflow-hidden" style={{ background: '#ddd' }}>
                  <div style={{ width: '8%', background: '#22aa22' }} title={t('essentialFat')} />
                  <div style={{ width: '20%', background: '#66cc66' }} title={t('athlete')} />
                  <div style={{ width: '30%', background: '#ffcc00' }} title={t('fitness')} />
                  <div style={{ width: '32%', background: '#ff8844' }} title={t('acceptable')} />
                  <div className="flex-1" style={{ background: '#cc3333' }} title={t('obese')} />
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ opacity: 0.6 }}>
                  <span>{t('essentialFat')}</span>
                  <span>{t('athlete')}</span>
                  <span>{t('fitness')}</span>
                  <span>{t('acceptable')}</span>
                  <span>{t('obese')}</span>
                </div>
              </div>

              {/* Category name */}
              <div className="text-center mb-3">
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-sm"
                  style={{
                    background: result.category === 'athlete' ? '#22aa22' :
                      result.category === 'fitness' ? '#66cc66' :
                      result.category === 'acceptable' ? '#ffcc00' : '#cc3333',
                    color: result.category === 'obese' || result.category === 'acceptable' ? '#000' : '#fff'
                  }}>
                  {t(result.category)}
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('bodyFat')}</span>
                <span className="font-bold">{result.bf}%</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="os9-label text-sm">{t('fatMass')}</span>
                <span className="font-bold">{result.fatMass} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="os9-label text-sm">{t('leanMass')}</span>
                <span className="font-bold">{result.leanMass} kg</span>
              </div>
            </div>
          )}
          {!result && (height || neck || waist) && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setHeight(''); setNeck(''); setWaist(''); setHip(''); setResult(null); }}>{t('clear')}</button>
          </div>
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/bmi`} className="underline">BMI Calculator</a>
                <a href={`/${locale}/idealweight`} className="underline">Ideal Weight Calculator</a>
                <a href={`/${locale}/waterintake`} className="underline">Water Intake Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/bodyfat'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Body Fat</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}