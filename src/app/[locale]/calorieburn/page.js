'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/calorieburn.json';
import esMsgs from '../../../messages/es/calorieburn.json';
import zhMsgs from '../../../messages/zh/calorieburn.json';
import koMsgs from '../../../messages/ko/calorieburn.json';
import ptMsgs from '../../../messages/pt/calorieburn.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const MET_VALUES = { running: 8.0, walking: 3.8, cycling: 6.8, swimming: 5.8, yoga: 2.5, jumping: 10.0, weightlifting: 4.5 };

export default function CalorieburnPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/calorieburn'; };

  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [activity, setActivity] = useState('running');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || !d) return;
    const met = MET_VALUES[activity];
    const burned = Math.round(met * 3.5 * w / 200 * d);
    setResult({ burned, duration: d, activity });
  };

  const clear = () => { setWeight(''); setDuration(''); setResult(null); };

  const activities = ['running', 'walking', 'cycling', 'swimming', 'yoga', 'jumping', 'weightlifting'];

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
              <p className="os9-label mb-1">{t('weight')}</p>
              <input className="os9-input" type="number" min="20" max="300" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('activity')}</p>
              <select className="os9-select" value={activity} onChange={(e) => setActivity(e.target.value)}>
                {activities.map(a => (
                  <option key={a} value={a}>{t(a)}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="os9-label mb-1">{t('duration')}</p>
              <input className="os9-input" type="number" min="1" max="600" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" />
            </div>
            <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculate}>{t('calculate')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result space-y-2">
                <div className="flex justify-between"><span>{t('caloriesBurned')}</span><strong>{result.burned} kcal</strong></div>
                <div className="flex justify-between"><span>{t('durationLabel')}</span><strong>{result.duration} min</strong></div>
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
        <a href={'/' + locale + '/tdee'} className="underline">TDEE</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline">BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bodyfat'} className="underline">Body Fat</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/idealweight'} className="underline">Ideal Weight</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/duedate'} className="underline">Due Date</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
