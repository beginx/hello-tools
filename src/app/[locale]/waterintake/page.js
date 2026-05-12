'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/waterintake.json';
import esMsgs from '../../../messages/es/waterintake.json';
import zhMsgs from '../../../messages/zh/waterintake.json';
import koMsgs from '../../../messages/ko/waterintake.json';
import ptMsgs from '../../../messages/pt/waterintake.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function WaterIntakePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/waterintake'; };

  const [weight, setWeight] = useState('70');
  const [unit, setUnit] = useState('metric');
  const [exercise, setExercise] = useState('0');
  const [result, setResult] = useState(null);

  const calc = () => {
    const w = parseFloat(weight) || 0;
    const ex = parseFloat(exercise) || 0;
    if (w <= 0) return;
    const kg = unit === 'metric' ? w : w * 0.453592;
    const baseMl = kg * 33;
    const exerciseMl = ex * 300;
    const totalMl = baseMl + exerciseMl;
    const cups = totalMl / 240;
    const oz = totalMl / 29.574;
    setResult({ ml: Math.round(totalMl), cups: Math.round(cups * 10) / 10, oz: Math.round(oz), base: Math.round(baseMl), exercise: Math.round(exerciseMl), kg: Math.round(kg) });
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

          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn text-xs ' + (unit === 'metric' ? 'os9-btn-primary' : '')} onClick={() => setUnit('metric')}>{t('metric')}</button>
            <button className={'os9-btn text-xs ' + (unit === 'imperial' ? 'os9-btn-primary' : '')} onClick={() => setUnit('imperial')}>{t('imperial')}</button>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{unit === 'metric' ? t('weightKg') : t('weightLb')}</label>
              <input className="os9-input w-full" type="number" min="1" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('exercise')} ({t('dailyMin')})</label>
              <input className="os9-input w-full" type="number" min="0" step="5" value={exercise} onChange={(e) => setExercise(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">{result.ml.toLocaleString()} <span style={{ fontSize: '1rem', opacity: 0.5 }}>ml</span></div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('dailyIntake')}</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-2 mt-3 text-center text-sm">
                <div>
                  <div className="font-semibold">{result.cups} {t('cups')}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>240ml {t('cupsAbbr')}</div>
                </div>
                <div>
                  <div className="font-semibold">{result.oz} oz</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('fluidOz')}</div>
                </div>
                <div>
                  <div className="font-semibold">{result.base.toLocaleString()} ml</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('baseIntake')}</div>
                </div>
                <div>
                  <div className="font-semibold">{result.exercise.toLocaleString()} ml</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('exerciseExtra')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/waterintake'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Water Intake</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}