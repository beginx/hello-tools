'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/overtime.json';
import esMsgs from '../../../messages/es/overtime.json';
import zhMsgs from '../../../messages/zh/overtime.json';
import koMsgs from '../../../messages/ko/overtime.json';
import ptMsgs from '../../../messages/pt/overtime.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function OvertimePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/overtime'; };

  const [hourlyRate, setHourlyRate] = useState('20');
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('10');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [result, setResult] = useState(null);

  const calc = () => {
    const rate = parseFloat(hourlyRate) || 0;
    const regular = parseFloat(regularHours) || 0;
    const otHours = parseFloat(overtimeHours) || 0;
    const mult = parseFloat(overtimeMultiplier) || 1.5;
    if (rate <= 0) return;

    const regularPay = rate * regular;
    const otRate = rate * mult;
    const otPay = otRate * otHours;
    const totalPay = regularPay + otPay;
    const effectiveRate = totalPay / Math.max(1, regular + otHours);

    setResult({
      regularPay,
      otRate,
      otPay,
      totalPay,
      effectiveRate,
      regularHours: regular,
      otHours,
      totalHours: regular + otHours,
    });
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

          {/* OT multiplier quick presets */}
          <div className="flex gap-2 mb-4" style={{ justifyContent: 'center' }}>
            <button className={'os9-btn text-xs !py-1 !px-3 ' + (overtimeMultiplier === '1.5' ? 'os9-btn-primary' : '')} onClick={() => setOvertimeMultiplier('1.5')}>1.5x</button>
            <button className={'os9-btn text-xs !py-1 !px-3 ' + (overtimeMultiplier === '2' ? 'os9-btn-primary' : '')} onClick={() => setOvertimeMultiplier('2')}>2.0x</button>
            <button className={'os9-btn text-xs !py-1 !px-3 ' + (overtimeMultiplier === '2.5' ? 'os9-btn-primary' : '')} onClick={() => setOvertimeMultiplier('2.5')}>2.5x</button>
            <button className="os9-btn text-xs !py-1 !px-3" onClick={() => setOvertimeMultiplier('1.5')}>{t('reset')}</button>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{t('hourlyRate')}</label>
              <input className="os9-input w-full" type="number" min="0" step="0.5" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('regularHours')}</label>
              <input className="os9-input w-full" type="number" min="0" step="0.5" value={regularHours} onChange={(e) => setRegularHours(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('overtimeHours')}</label>
              <input className="os9-input w-full" type="number" min="0" step="0.5" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="text-center mb-3">
                <div className="os9-big-number">${result.totalPay.toFixed(2)}</div>
                <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalPay')}</div>
                <div className="text-xs mt-1" style={{ opacity: 0.5 }}>{result.totalHours} {t('totalHours')} ({result.regularHours} {t('regular')} + {result.otHours} {t('ot')})</div>
              </div>
              <hr className="os9-divider" />
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-center">
                <div>
                  <div className="font-semibold">${result.regularPay.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('regularPay')}</div>
                </div>
                <div>
                  <div className="font-semibold">${result.otPay.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('otPay')}</div>
                </div>
                <div>
                  <div className="font-semibold">${result.otRate.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('otRate')}</div>
                </div>
                <div>
                  <div className="font-semibold">${result.effectiveRate.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('effectiveRate')}</div>
                </div>
              </div>
            </div>
          )}
                  {/* SEO Description + Related Tools */}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={`/${locale}/salary`} className="underline">Salary Converter</a>
                <a href={`/${locale}/tip`} className="underline">Tip Calculator</a>
                <a href={`/${locale}/fuelcost`} className="underline">Fuel Cost Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/overtime'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Overtime</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}