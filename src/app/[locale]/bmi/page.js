'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/app.json';
import esMsgs from '../../../messages/es/app.json';
import zhMsgs from '../../../messages/zh/app.json';
import koMsgs from '../../../messages/ko/app.json';
import ptMsgs from '../../../messages/pt/app.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

function bmiCategory(b, t) {
  if (b < 18.5) return { label: t('underweight'), color: '#3399ff' };
  if (b < 23) return { label: t('normal'), color: '#22aa22' };
  if (b < 25) return { label: t('overweight'), color: '#ccaa00' };
  if (b < 30) return { label: t('obese1'), color: '#cc6600' };
  return { label: t('obese2'), color: '#cc3333' };
}

export default function BMIPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/bmi'; };

  const [unit, setUnit] = useState('metric');
  const [mWeight, setMWeight] = useState('72');
  const [mHeight, setMHeight] = useState('175');
  const [iWeight, setIWeight] = useState('158');
  const [iFt, setIFt] = useState('5');
  const [iIn, setIIn] = useState('9');
  const [result, setResult] = useState(null);

  const calc = () => {
    const wKg = unit === 'metric' ? (parseFloat(mWeight) || 0) : ((parseFloat(iWeight) || 0) * 0.453592);
    const hCm = unit === 'metric' ? (parseFloat(mHeight) || 0) : (((parseFloat(iFt) || 0) * 30.48) + ((parseFloat(iIn) || 0) * 2.54));
    if (wKg <= 0 || hCm <= 0) return;
    const bmi = Math.round((wKg / ((hCm / 100) ** 2)) * 10) / 10;
    const minNormal = Math.round(18.5 * ((hCm / 100) ** 2) * 10) / 10;
    const maxNormal = Math.round(23 * ((hCm / 100) ** 2) * 10) / 10;
    const cat = bmiCategory(bmi, t);
    setResult({ bmi, category: cat, minNormal, maxNormal });
  };

  const keyDown = (e) => { if (e.key === 'Enter') calc(); };

  const barWidth = result ? Math.min(100, Math.max(0, (result.bmi - 10) / 30 * 100)) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 480, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">BMI Calculator</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-3">
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="os9-label" style={{ marginBottom: 0 }}>{t('unit')}</span>
            <div className="os9-unit-toggle">
              <div className={'os9-unit-option' + (unit === 'metric' ? ' os9-unit-option-active' : '')} onClick={() => setUnit('metric')}>{t('metric')}</div>
              <div className={'os9-unit-option' + (unit === 'imperial' ? ' os9-unit-option-active' : '')} onClick={() => setUnit('imperial')}>{t('imperial')}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{unit === 'metric' ? t('weightMetric') : t('weightImperial')}</label>
              <input className="os9-input" type="number" step="0.1" min={20} max={400}
                value={unit === 'metric' ? mWeight : iWeight}
                onChange={(e) => { unit === 'metric' ? setMWeight(e.target.value) : setIWeight(e.target.value); }}
                onKeyDown={keyDown} placeholder={unit === 'metric' ? '72' : '158'} />
            </div>
            {unit === 'metric' ? (
              <div>
                <label className="os9-label">{t('heightMetric')}</label>
                <input className="os9-input" type="number" step="0.1" min={100} max={250}
                  value={mHeight} onChange={(e) => setMHeight(e.target.value)} onKeyDown={keyDown} placeholder="175" />
              </div>
            ) : (
              <div className="flex gap-1">
                <div style={{ flex: 1 }}>
                  <label className="os9-label">{t('heightFt')}</label>
                  <input className="os9-input" type="number" min={3} max={8}
                    value={iFt} onChange={(e) => setIFt(e.target.value)} onKeyDown={keyDown} placeholder="5" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="os9-label">{t('heightIn')}</label>
                  <input className="os9-input" type="number" min={0} max={11}
                    value={iIn} onChange={(e) => setIIn(e.target.value)} onKeyDown={keyDown} placeholder="9" />
                </div>
              </div>
            )}
          </div>

          <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="mt-5">
              <hr className="os9-divider" />
              <div className="os9-result mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>BMI</span>
                  <span className="text-2xl font-bold">{result.bmi}</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: '#ddd' }}>
                  <div style={{ flex: '18.5', background: '#3399ff', height: '100%' }} title="Underweight" />
                  <div style={{ flex: '4.5', background: '#22aa22', height: '100%' }} title="Normal" />
                  <div style={{ flex: '2', background: '#ccaa00', height: '100%' }} title="Overweight" />
                  <div style={{ flex: '5', background: '#cc6600', height: '100%' }} title="Obese 1" />
                  <div style={{ flex: '70', background: '#cc3333', height: '100%' }} title="Obese 2+" />
                </div>
                <div className="relative h-4 mt-1">
                  <div className="absolute text-lg font-bold" style={{ left: barWidth + '%', transform: 'translateX(-50%)', color: result.category.color }}>▼</div>
                </div>
                <div className="flex justify-between text-[9px] mt-1" style={{ opacity: 0.5 }}>
                  <span>10</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>40</span>
                </div>
                <p className="text-center font-bold mt-2" style={{ color: result.category.color, fontSize: '1.1rem' }}>{result.category.label}</p>
              </div>
              <div className="os9-result text-center">
                <p className="text-xs uppercase tracking-wider mb-1" style={{ opacity: 0.6 }}>{t('normalWeightRange') || 'Healthy BMI Range'}</p>
                <p className="text-sm font-bold">18.5 – 23</p>
                <p className="text-xs mt-1" style={{ opacity: 0.6 }}>
                  {t('weightMetric')}: {result.minNormal} – {result.maxNormal} kg
                </p>
              </div>
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>Calculate your Body Mass Index (BMI) instantly using your height and weight. This free BMI calculator tells you whether you are underweight, normal, overweight, or obese based on standard BMI categories. Track your health and fitness progress with accurate BMI measurements.</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/idealweight`} className="underline">Ideal Weight Calculator</a>
                <a href={`/${locale}/bodyfat`} className="underline">Body Fat Calculator</a>
                <a href={`/${locale}/calorieburn`} className="underline">Calorie Burn Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 480, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo Editor</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/password'} className="underline" style={{ opacity: 0.7 }}>Password</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline" style={{ opacity: 0.7 }}>Lotto</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/pdf'} className="underline" style={{ opacity: 0.7 }}>PDF</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/percent'} className="underline" style={{ opacity: 0.7 }}>Percent</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/currency'} className="underline" style={{ opacity: 0.7 }}>Currency</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/random'} className="underline" style={{ opacity: 0.7 }}>Random</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/text'} className="underline" style={{ opacity: 0.7 }}>Text</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}