'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const AM = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };
const AS = { sedentary: 0, light: 1, moderate: 2, active: 3, extra: 4 };
const LK = ['sedentary', 'light', 'moderate', 'active', 'extra'];
const GK = ['lose', 'maintain', 'gain'];

function bmiCat(b, t) {
  if (b < 18.5) return t('underweight');
  if (b < 23) return t('normal');
  if (b < 25) return t('overweight');
  if (b < 30) return t('obese1');
  return t('obese2');
}
function calcBMR(g, w, h, a) {
  if (g === 'male') return 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
  return 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
}
function calcMacros(cal, goal) {
  let pr, fr;
  if (goal === 'lose') { pr = 0.35; fr = 0.25; }
  else if (goal === 'maintain') { pr = 0.30; fr = 0.25; }
  else { pr = 0.30; fr = 0.20; }
  const cr = 1 - pr - fr;
  return { protein: Math.round(cal * pr / 4), carbs: Math.round(cal * cr / 4), fat: Math.round(cal * fr / 9) };
}
function goalAdj(goal, tdee) {
  if (goal === 'lose') return tdee - 500;
  if (goal === 'gain') return tdee + 300;
  return tdee;
}

export default function CalorieCalculatorPage() {
  const t = useTranslations('app');
  const params = useParams();
  const locale = params?.locale || 'en';

  const changeLang = (l) => { window.location.href = '/' + l; };

  const [gender, setGender] = useState('male');
  const [unit, setUnit] = useState('metric');
  const [mWeight, setMWeight] = useState('72');
  const [mHeight, setMHeight] = useState('175');
  const [iWeight, setIWeight] = useState('158');
  const [iFt, setIFt] = useState('5');
  const [iIn, setIIn] = useState('9');
  const [age, setAge] = useState('30');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  const wKg = unit === 'metric' ? (parseFloat(mWeight) || 0) : ((parseFloat(iWeight) || 0) * 0.453592);
  const hCm = unit === 'metric' ? (parseFloat(mHeight) || 0) : (((parseFloat(iFt) || 0) * 30.48) + ((parseFloat(iIn) || 0) * 2.54));

  const calc = useCallback(() => {
    const w = wKg, h = hCm, a = parseInt(age) || 30;
    if (w <= 0 || h <= 0) return;
    const bmr = Math.round(calcBMR(gender, w, h, a));
    const tdee = Math.round(bmr * AM[activity]);
    const tc = Math.round(goalAdj(goal, tdee));
    const m = calcMacros(tc, goal);
    const bmi = Math.round((w / ((h / 100) ** 2)) * 10) / 10;
    setResults({ bmr, tdee, targetCalories: tc, ...m, bmi, bmiCategory: bmiCat(bmi, t) });
    setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }, [gender, wKg, hCm, age, activity, goal, t]);

  const keyDown = (e) => { if (e.key === 'Enter') calc(); };

  const copyRes = () => {
    if (!results) return;
    const r = results;
    const txt = [t('title'), 'BMI: ' + r.bmi + ' (' + r.bmiCategory + ')', 'BMR: ' + r.bmr.toLocaleString() + ' kcal', 'TDEE: ' + r.tdee.toLocaleString() + ' kcal', t('target') + ': ' + r.targetCalories.toLocaleString() + ' kcal', t('protein') + ': ' + r.protein + 'g | ' + t('carbs') + ': ' + r.carbs + 'g | ' + t('fat') + ': ' + r.fat + 'g'].join('\n');
    navigator.clipboard.writeText(txt).then(function() { setCopied(true); setTimeout(function() { setCopied(false); }, 2500); });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 520, width: '100%' }}>
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
            <select className="os9-select !w-auto" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div className="flex justify-between items-center mb-5">
            <span className="os9-label" style={{ marginBottom: 0 }}>{t('unit')}</span>
            <div className="os9-unit-toggle">
              <div className={'os9-unit-option' + (unit === 'metric' ? ' os9-unit-option-active' : '')} onClick={function() { setUnit('metric'); }}>{t('metric')}</div>
              <div className={'os9-unit-option' + (unit === 'imperial' ? ' os9-unit-option-active' : '')} onClick={function() { setUnit('imperial'); }}>{t('imperial')}</div>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <button className={'os9-btn flex-1' + (gender === 'male' ? ' os9-btn-primary' : '')} onClick={function() { setGender('male'); }}>{t('male')}</button>
            <button className={'os9-btn flex-1' + (gender === 'female' ? ' os9-btn-primary' : '')} onClick={function() { setGender('female'); }}>{t('female')}</button>
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('age')}</label>
            <input className="os9-input" type="number" min={10} max={120} value={age} onChange={function(e) { setAge(e.target.value); }} onKeyDown={keyDown} placeholder="30" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="os9-label">{unit === 'metric' ? t('weightMetric') : t('weightImperial')}</label>
              <input className="os9-input" type="number" step="0.1" min={20} max={400}
                value={unit === 'metric' ? mWeight : iWeight}
                onChange={function(e) { if (unit === 'metric') setMWeight(e.target.value); else setIWeight(e.target.value); }}
                onKeyDown={keyDown}
                placeholder={unit === 'metric' ? '72' : '158'} />
            </div>
            {unit === 'metric' ? (
              <div>
                <label className="os9-label">{t('heightMetric')}</label>
                <input className="os9-input" type="number" step="0.1" min={100} max={250} value={mHeight}
                  onChange={function(e) { setMHeight(e.target.value); }} onKeyDown={keyDown} placeholder="175" />
              </div>
            ) : (
              <div className="flex gap-1">
                <div style={{ flex: 1 }}>
                  <label className="os9-label">{t('heightFt')}</label>
                  <input className="os9-input" type="number" min={3} max={8} value={iFt}
                    onChange={function(e) { setIFt(e.target.value); }} onKeyDown={keyDown} placeholder="5" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="os9-label">{t('heightIn')}</label>
                  <input className="os9-input" type="number" min={0} max={11} value={iIn}
                    onChange={function(e) { setIIn(e.target.value); }} onKeyDown={keyDown} placeholder="9" />
                </div>
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="os9-label">{t('activity')}</label>
            <select className="os9-select" value={activity} onChange={function(e) { setActivity(e.target.value); }}>
              {LK.map(function(k) { return <option key={k} value={k}>{t(k)}</option>; })}
            </select>
          </div>
          <div className="mb-5">
            <label className="os9-label">{t('goal')}</label>
            <div className="flex gap-2">
              {GK.map(function(k) {
                return <button key={k} className={'os9-btn flex-1 text-xs px-1' + (goal === k ? ' os9-btn-primary' : '')}
                  onClick={function() { setGoal(k); }}>{t(k)}</button>;
              })}
            </div>
          </div>
          <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calc}>{t('calculate')}</button>

          {results && (
            <div ref={ref} className="mt-5">
              <hr className="os9-divider" />
              <div className="os9-result mb-3 flex justify-between items-center">
                <div>
                  <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>BMI</div>
                  <div className="text-sm font-bold">{results.bmiCategory}</div>
                </div>
                <div className="os9-big-number">{results.bmi}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="os9-result text-center">
                  <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('bmr')}</div>
                  <div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{results.bmr.toLocaleString()}</div>
                  <div className="text-[10px]" style={{ opacity: 0.6 }}>kcal</div>
                </div>
                <div className="os9-result text-center" style={{ borderColor: 'var(--os9-accent)' }}>
                  <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('tdee')}</div>
                  <div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{results.tdee.toLocaleString()}</div>
                  <div className="text-[10px]" style={{ opacity: 0.6 }}>kcal</div>
                </div>
                <div className="os9-result text-center">
                  <div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('target')}</div>
                  <div className="os9-big-number" style={{ fontSize: '1.25rem' }}>{results.targetCalories.toLocaleString()}</div>
                  <div className="text-[10px]" style={{ opacity: 0.6 }}>kcal</div>
                </div>
              </div>
              <div className="os9-result mb-3">
                <div className="text-xs uppercase tracking-wider mb-2" style={{ opacity: 0.6 }}>{t('macros')}</div>
                <div className="flex gap-2 text-center">
                  <div className="flex-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,165,0,0.15)' }}>
                    <div className="text-lg font-bold">{results.carbs}g</div>
                    <div className="text-[10px]" style={{ opacity: 0.6 }}>{t('carbs')}</div>
                  </div>
                  <div className="flex-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,0,0,0.15)' }}>
                    <div className="text-lg font-bold">{results.protein}g</div>
                    <div className="text-[10px]" style={{ opacity: 0.6 }}>{t('protein')}</div>
                  </div>
                  <div className="flex-1 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,200,0,0.15)' }}>
                    <div className="text-lg font-bold">{results.fat}g</div>
                    <div className="text-[10px]" style={{ opacity: 0.6 }}>{t('fat')}</div>
                  </div>
                </div>
              </div>
              <button className="os9-btn w-full text-xs py-2" onClick={copyRes}>{copied ? t('copied') : t('copy')}</button>
              <p className="text-[10px] text-center mt-3 whitespace-pre-line" style={{ opacity: 0.5 }}>{t('note')}</p>
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/date'} className="underline" style={{ opacity: 0.7 }}>Date Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/convert'} className="underline" style={{ opacity: 0.7 }}>Unit Converter</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/photo'} className="underline" style={{ opacity: 0.7 }}>Photo Editor</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/qr'} className="underline" style={{ opacity: 0.7 }}>QR Code</a>
        <span className="mx-2">|</span>
        <span className="mx-2">|</span>
        {t('footer')}
      </div>
    </div>
  );
}