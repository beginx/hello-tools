'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/tdee.json';
import esMsgs from '../../../messages/es/tdee.json';
import zhMsgs from '../../../messages/zh/tdee.json';
import koMsgs from '../../../messages/ko/tdee.json';
import ptMsgs from '../../../messages/pt/tdee.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function TdeePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/tdee'; };

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('sedentary');
  const [result, setResult] = useState(null);

  const calcBMR = (g, w, h, a) => {
    if (g === 'male') return 10 * w + 6.25 * h - 5 * a + 5;
    return 10 * w + 6.25 * h - 5 * a - 161;
  };

  const activityMultiplier = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extra: 1.9 };

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !h || !a) return;
    const bmr = Math.round(calcBMR(gender, w, h, a));
    const tdeeVal = Math.round(bmr * activityMultiplier[activity]);
    setResult({ bmr, tdee: tdeeVal });
  };

  const clear = () => { setAge(''); setWeight(''); setHeight(''); setResult(null); };

  const activityOpts = ['sedentary', 'light', 'moderate', 'active', 'extra'];

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
              <p className="os9-label mb-1">{t('gender')}</p>
              <div className="flex gap-3">
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input type="radio" name="gender" value="male" checked={gender==='male'} onChange={() => setGender('male')} /> {t('male')}
                </label>
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input type="radio" name="gender" value="female" checked={gender==='female'} onChange={() => setGender('female')} /> {t('female')}
                </label>
              </div>
            </div>
            <div>
              <p className="os9-label mb-1">{t('age')}</p>
              <input className="os9-input" type="number" min="10" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('weight')}</p>
              <input className="os9-input" type="number" min="20" max="300" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('height')}</p>
              <input className="os9-input" type="number" min="100" max="250" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('activity')}</p>
              <select className="os9-select" value={activity} onChange={(e) => setActivity(e.target.value)}>
                {activityOpts.map(a => (
                  <option key={a} value={a}>{t(a)}</option>
                ))}
              </select>
            </div>
            <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculate}>{t('calculate')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result space-y-2">
                <div className="flex justify-between"><span>{t('bmrLabel')}</span><strong>{result.bmr} kcal/day</strong></div>
                <div className="flex justify-between"><span>{t('tdeeLabel')}</span><strong>{result.tdee} kcal/day</strong></div>
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
        <a href={'/' + locale + '/calorieburn'} className="underline">Calorie Burn</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline">BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bodyfat'} className="underline">Body Fat</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/duedate'} className="underline">Due Date</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/pregnancy'} className="underline">Pregnancy</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
