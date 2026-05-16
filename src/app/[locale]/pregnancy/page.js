'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/pregnancy.json';
import esMsgs from '../../../messages/es/pregnancy.json';
import zhMsgs from '../../../messages/zh/pregnancy.json';
import koMsgs from '../../../messages/ko/pregnancy.json';
import ptMsgs from '../../../messages/pt/pregnancy.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function PregnancyPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/pregnancy'; };

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
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
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
        <a href={'/' + locale + '/ovulation'} className="underline">Ovulation</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/duedate'} className="underline">Due Date</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline">BMI</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/tdee'} className="underline">TDEE</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/calorieburn'} className="underline">Calorie Burn</a>
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>
    </div>
  );
}