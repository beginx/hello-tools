import os

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']

# Page.js template for each tool
PAGES = {
    'tdee': r"""'use client';

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
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
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
        <a href={'/' + locale + '/dice'} className="underline">Dice</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
""",
    'calorieburn': r"""'use client';

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
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
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
        <a href={'/' + locale + '/dice'} className="underline">Dice</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
""",
    'duedate': r"""'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/duedate.json';
import esMsgs from '../../../messages/es/duedate.json';
import zhMsgs from '../../../messages/zh/duedate.json';
import koMsgs from '../../../messages/ko/duedate.json';
import ptMsgs from '../../../messages/pt/duedate.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function DuedatePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/duedate'; };

  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!lmpDate) return;
    const lmp = new Date(lmpDate);
    const cycleDays = parseInt(cycleLength) || 28;
    const offset = cycleDays - 28;
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280 + offset);
    const conception = new Date(lmp);
    conception.setDate(conception.getDate() + 14 + offset);
    const today = new Date();
    const msPregnant = today - lmp;
    const daysPregnant = Math.floor(msPregnant / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysPregnant / 7);
    const trimester = weeks <= 13 ? t('firstTri') : weeks <= 27 ? t('secondTri') : t('thirdTri');
    setResult({
      dueDate: dueDate.toLocaleDateString(),
      conception: conception.toLocaleDateString(),
      weeks: weeks >= 0 ? weeks : 0,
      trimester: weeks >= 0 ? trimester : '-'
    });
  };

  const clear = () => { setLmpDate(''); setCycleLength('28'); setResult(null); };

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
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <p className="os9-label mb-1">{t('lmp')}</p>
              <input className="os9-input" type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} />
            </div>
            <div>
              <p className="os9-label mb-1">{t('cycleLength')}</p>
              <input className="os9-input" type="number" min="20" max="45" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} />
            </div>
            <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculate}>{t('calculate')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result space-y-2">
                <div className="flex justify-between"><span>{t('results')}</span><strong>{result.dueDate}</strong></div>
                <div className="flex justify-between"><span>{t('conception')}</span><strong>{result.conception}</strong></div>
                <div className="flex justify-between"><span>{t('weeksPregnant')}</span><strong>{result.weeks} weeks</strong></div>
                <div className="flex justify-between"><span>{t('trimester')}</span><strong>{result.trimester}</strong></div>
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
        <a href={'/' + locale + '/dice'} className="underline">Dice</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
""",
    'ovulation': r"""'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/ovulation.json';
import esMsgs from '../../../messages/es/ovulation.json';
import zhMsgs from '../../../messages/zh/ovulation.json';
import koMsgs from '../../../messages/ko/ovulation.json';
import ptMsgs from '../../../messages/pt/ovulation.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function OvulationPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/ovulation'; };

  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!lmpDate) return;
    const lmp = new Date(lmpDate);
    const cycle = parseInt(cycleLength) || 28;
    const period = parseInt(periodLength) || 5;
    const offset = cycle - 28;
    const ovulationDay = new Date(lmp);
    ovulationDay.setDate(ovulationDay.getDate() + 14 + offset);
    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);
    setResult({
      ovulationDay: ovulationDay.toLocaleDateString(),
      fertileStart: fertileStart.toLocaleDateString(),
      fertileEnd: fertileEnd.toLocaleDateString(),
      nextPeriod: nextPeriod.toLocaleDateString()
    });
  };

  const clear = () => { setLmpDate(''); setCycleLength('28'); setPeriodLength('5'); setResult(null); };

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
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <p className="os9-label mb-1">{t('lmp')}</p>
              <input className="os9-input" type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} />
            </div>
            <div>
              <p className="os9-label mb-1">{t('cycleLength')}</p>
              <input className="os9-input" type="number" min="20" max="45" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} />
            </div>
            <div>
              <p className="os9-label mb-1">{t('periodLength')}</p>
              <input className="os9-input" type="number" min="1" max="10" value={periodLength} onChange={(e) => setPeriodLength(e.target.value)} />
            </div>
            <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculate}>{t('calculate')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result space-y-2">
                <div className="flex justify-between"><span>{t('ovulationDay')}</span><strong>{result.ovulationDay}</strong></div>
                <div className="flex justify-between"><span>{t('fertileStart')}</span><strong>{result.fertileStart}</strong></div>
                <div className="flex justify-between"><span>{t('fertileEnd')}</span><strong>{result.fertileEnd}</strong></div>
                <div className="flex justify-between"><span>{t('nextPeriod')}</span><strong>{result.nextPeriod}</strong></div>
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
        <a href={'/' + locale + '/dice'} className="underline">Dice</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
""",
    'cagr': r"""'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/cagr.json';
import esMsgs from '../../../messages/es/cagr.json';
import zhMsgs from '../../../messages/zh/cagr.json';
import koMsgs from '../../../messages/ko/cagr.json';
import ptMsgs from '../../../messages/pt/cagr.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function CagrPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/cagr'; };

  const [initialValue, setInitialValue] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const iv = parseFloat(initialValue);
    const fv = parseFloat(finalValue);
    const y = parseFloat(years);
    if (!iv || !fv || !y || iv <= 0 || y <= 0) return;
    const cagr = Math.pow(fv / iv, 1 / y) - 1;
    const totalReturn = ((fv - iv) / iv) * 100;
    setResult({
      cagr: (cagr * 100).toFixed(2),
      totalReturn: totalReturn.toFixed(2)
    });
  };

  const clear = () => { setInitialValue(''); setFinalValue(''); setYears(''); setResult(null); };

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
              <option value="es">Espa\u00f1ol</option>
              <option value="zh">\u4e2d\u6587</option>
              <option value="ko">\ud55c\uad6d\uc5b4</option>
              <option value="pt">Portugu\u00eas</option>
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <p className="os9-label mb-1">{t('initialValue')}</p>
              <input className="os9-input" type="number" min="0" step="any" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} placeholder="1000" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('finalValue')}</p>
              <input className="os9-input" type="number" min="0" step="any" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} placeholder="2000" />
            </div>
            <div>
              <p className="os9-label mb-1">{t('years')}</p>
              <input className="os9-input" type="number" min="1" max="100" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" />
            </div>
            <button className="os9-btn os9-btn-primary w-full text-base py-3" onClick={calculate}>{t('calculate')}</button>
          </div>

          {result && (
            <>
              <hr className="os9-divider" />
              <p className="os9-label mb-2">{t('results')}</p>
              <div className="os9-result space-y-2">
                <div className="flex justify-between"><span>{t('cagrLabel')}</span><strong>{result.cagr}%</strong></div>
                <div className="flex justify-between"><span>{t('totalReturn')}</span><strong>{result.totalReturn}%</strong></div>
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
        <a href={'/' + locale + '/dice'} className="underline">Dice</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/lotto'} className="underline">Lotto</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
"""
}

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

for tool_key, page_source in PAGES.items():
    dir_path = os.path.join(PAGES_DIR, tool_key)
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, 'page.js')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(page_source)
    print(f'Created: {file_path}')

print('\nAll 5 page.js files created successfully!')