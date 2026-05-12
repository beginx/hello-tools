'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/salary.json';
import esMsgs from '../../../messages/es/salary.json';
import zhMsgs from '../../../messages/zh/salary.json';
import koMsgs from '../../../messages/ko/salary.json';
import ptMsgs from '../../../messages/pt/salary.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function SalaryPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/salary'; };

  const [annualSalary, setAnnualSalary] = useState('50000');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [result, setResult] = useState(null);

  const calc = () => {
    const annual = parseFloat(annualSalary) || 0;
    const hw = parseFloat(hoursPerWeek) || 40;
    const dw = parseFloat(daysPerWeek) || 5;
    if (annual <= 0) return;
    const weeksPerYear = 52;
    const monthsPerYear = 12;
    const hPerDay = hw / dw;
    const hourly = annual / (hw * weeksPerYear);
    const daily = hourly * hPerDay;
    const weekly = hourly * hw;
    const monthly = annual / monthsPerYear;
    const biweekly = annual / 26;
    setResult({
      hourly: hourly,
      daily: daily,
      weekly: weekly,
      biweekly: biweekly,
      monthly: monthly,
      annual: annual,
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

          <div className="space-y-3 mb-4">
            <div>
              <label className="os9-label">{t('annualSalary')}</label>
              <input className="os9-input w-full" type="number" min="0" value={annualSalary} onChange={(e) => setAnnualSalary(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('hoursPerWeek')}</label>
              <input className="os9-input w-full" type="number" min="1" max="168" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} />
            </div>
            <div>
              <label className="os9-label">{t('daysPerWeek')}</label>
              <input className="os9-input w-full" type="number" min="1" max="7" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} />
            </div>
          </div>

          <button className="os9-btn os9-btn-primary w-full py-2 mb-4" onClick={calc}>{t('calculate')}</button>

          {result && (
            <div className="os9-result">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.hourly.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('perHour')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.daily.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('perDay')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.weekly.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('perWeek')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.biweekly.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('biweekly')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.monthly.toFixed(2)}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('perMonth')}</div>
                </div>
                <div>
                  <div className="os9-big-number" style={{ fontSize: '1.3rem' }}>{result.annual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  <div className="text-xs" style={{ opacity: 0.5 }}>{t('perYear')}</div>
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
                <a href={`/${locale}/overtime`} className="underline">Overtime Calculator</a>
                <a href={`/${locale}/tip`} className="underline">Tip Calculator</a>
                <a href={`/${locale}/vat`} className="underline">VAT Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 460, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/salary'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Salary</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}