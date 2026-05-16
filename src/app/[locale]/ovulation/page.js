'use client';

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
