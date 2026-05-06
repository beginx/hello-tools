'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const TABS = ['tabDaysBetween', 'tabDday', 'tabAddSubtract', 'tabAge', 'tabAnniversary'];
const TAB_KEYS = ['daysBetween', 'dday', 'addSubtract', 'age', 'anniversary'];
const TAB_ICONS = ['\uD83D\uDCC5', '\u23F3', '\u2795', '\uD83C\uDFB1', '\uD83C\uDF89']; // 📅, ⏳, ➕, 🎱, 🎉

function daysBetween(a, b) {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.round(ms / 86400000);
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function fmt(d) {
  return d.toISOString().split('T')[0];
}
function ageFrom(birth) {
  const now = new Date();
  let y = now.getFullYear() - birth.getFullYear();
  let m = now.getMonth() - birth.getMonth();
  let d = now.getDate() - birth.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { years: y, months: m, days: d };
}

export default function DatePage() {
  const t = useTranslations('date');
  const params = useParams();
  const locale = params?.locale || 'en';
  const changeLang = (l) => { window.location.href = '/' + l + '/date'; };

  const [tab, setTab] = useState('daysBetween');

  // Days between
  const [dbStart, setDbStart] = useState(fmt(new Date()));
  const [dbEnd, setDbEnd] = useState(fmt(addDays(new Date(), 7)));
  const [dbResult, setDbResult] = useState(null);

  // D-day
  const [ddayTarget, setDdayTarget] = useState(fmt(addDays(new Date(), 100)));
  const [ddayResult, setDdayResult] = useState(null);

  // Add/Subtract
  const [asDate, setAsDate] = useState(fmt(new Date()));
  const [asAmount, setAsAmount] = useState('30');
  const [asMode, setAsMode] = useState('add');
  const [asResult, setAsResult] = useState(null);

  // Age
  const [ageBirth, setAgeBirth] = useState('1990-01-01');
  const [ageResult, setAgeResult] = useState(null);

  // Anniversary
  const [annivDate, setAnnivDate] = useState(fmt(new Date()));
  const [annivDays, setAnnivDays] = useState('100');
  const [annivResult, setAnnivResult] = useState(null);

  const calcDaysBetween = () => {
    const d = daysBetween(new Date(dbStart), new Date(dbEnd));
    const weeks = Math.floor(d / 7);
    const days = d % 7;
    setDbResult({ total: d, weeks, days });
  };

  const calcDday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(ddayTarget);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - now) / 86400000);
    setDdayResult({ diff, isPast: diff < 0 });
  };

  const calcAddSubtract = () => {
    const n = parseInt(asAmount) || 0;
    const op = asMode === 'add' ? n : -n;
    const r = addDays(new Date(asDate), op);
    setAsResult(fmt(r));
  };

  const calcAge = () => {
    const a = ageFrom(new Date(ageBirth));
    setAgeResult(a);
    // Next birthday
    const now = new Date();
    const nextBday = new Date(now.getFullYear(), parseInt(ageBirth.split('-')[1]) - 1, parseInt(ageBirth.split('-')[2]));
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysToBday = Math.round((nextBday - now) / 86400000);
    setAgeResult({ ...a, nextBday: fmt(nextBday), daysToBday });
  };

  const calcAnniv = () => {
    const n = parseInt(annivDays) || 0;
    const r = addDays(new Date(annivDate), n);
    setAnnivResult(fmt(r));
  };

  const today = fmt(new Date());

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
            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {TABS.map((k, i) => (
              <button key={k} className={'os9-btn text-xs flex-1 px-1' + (tab === TAB_KEYS[i] ? ' os9-btn-primary' : '')}
                onClick={() => setTab(TAB_KEYS[i])}
                style={{ whiteSpace: 'normal', wordBreak: 'keep-all', lineHeight: 1.2, paddingTop: 6, paddingBottom: 6 }}>
                <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: 2 }}>{TAB_ICONS[i]}</span>
                {t(k)}
              </button>
            ))}
          </div>

          {/* Days Between */}
          {tab === 'daysBetween' && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="os9-label">{t('startDate')}</label>
                  <input className="os9-input" type="date" value={dbStart} onChange={(e) => setDbStart(e.target.value)} />
                </div>
                <div>
                  <label className="os9-label">{t('endDate')}</label>
                  <input className="os9-input" type="date" value={dbEnd} onChange={(e) => setDbEnd(e.target.value)} />
                </div>
              </div>
              <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calcDaysBetween}>{t('calculate')}</button>
              {dbResult && (
                <div className="os9-result text-center">
                  <div className="os9-big-number">{dbResult.total.toLocaleString()}</div>
                  <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('days')}</div>
                  <p className="text-xs mt-1" style={{ opacity: 0.5 }}>{dbResult.weeks} {t('weeks')} {dbResult.days} {t('days')}</p>
                </div>
              )}
            </div>
          )}

          {/* D-Day */}
          {tab === 'dday' && (
            <div>
              <div className="mb-3">
                <label className="os9-label">{t('targetDate')}</label>
                <input className="os9-input" type="date" value={ddayTarget} onChange={(e) => setDdayTarget(e.target.value)} />
              </div>
              <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calcDday}>{t('calculate')}</button>
              {ddayResult && (
                <div className="os9-result text-center">
                  <div className="os9-big-number" style={{ color: ddayResult.isPast ? 'var(--os9-red)' : 'var(--os9-accent)' }}>
                    {ddayResult.isPast ? '+' : '-'}{Math.abs(ddayResult.diff).toLocaleString()}
                  </div>
                  <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('ddayResult')}</div>
                  <p className="text-xs mt-1" style={{ opacity: 0.5 }}>
                    {ddayResult.isPast ? t('past') : t('future')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Add / Subtract */}
          {tab === 'addSubtract' && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="os9-label">{t('date')}</label>
                  <input className="os9-input" type="date" value={asDate} onChange={(e) => setAsDate(e.target.value)} />
                </div>
                <div>
                  <label className="os9-label">{t('days')}</label>
                  <input className="os9-input" type="number" value={asAmount} onChange={(e) => setAsAmount(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button className={'os9-btn flex-1 text-xs' + (asMode === 'add' ? ' os9-btn-primary' : '')} onClick={() => setAsMode('add')}>{t('add')}</button>
                <button className={'os9-btn flex-1 text-xs' + (asMode === 'subtract' ? ' os9-btn-primary' : '')} onClick={() => setAsMode('subtract')}>{t('subtract')}</button>
              </div>
              <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calcAddSubtract}>{t('calculate')}</button>
              {asResult && (
                <div className="os9-result text-center">
                  <p className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('result')}</p>
                  <p className="os9-big-number text-lg">{asResult}</p>
                </div>
              )}
            </div>
          )}

          {/* Age */}
          {tab === 'age' && (
            <div>
              <div className="mb-3">
                <label className="os9-label">{t('birthdate')}</label>
                <input className="os9-input" type="date" value={ageBirth} onChange={(e) => setAgeBirth(e.target.value)} />
              </div>
              <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calcAge}>{t('calculate')}</button>
              {ageResult && (
                <div className="os9-result">
                  <div className="text-center">
                    <div className="os9-big-number">{ageResult.years}</div>
                    <div className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('ageResult')}</div>
                    <p className="text-xs mt-1" style={{ opacity: 0.5 }}>{ageResult.years} {t('years')} {ageResult.months} {t('months')} {ageResult.days} {t('days')}</p>
                  </div>
                  <hr className="os9-divider" />
                  <div className="text-center">
                    <p className="text-xs" style={{ opacity: 0.6 }}>{t('nextBirthday')}: {ageResult.nextBday}</p>
                    <p className="text-xs" style={{ opacity: 0.5 }}>({ageResult.daysToBday} {t('days')} {t('future')})</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Anniversary */}
          {tab === 'anniversary' && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="os9-label">{t('anniversaryDate')}</label>
                  <input className="os9-input" type="date" value={annivDate} onChange={(e) => setAnnivDate(e.target.value)} />
                </div>
                <div>
                  <label className="os9-label">{t('anniversaryDays')}</label>
                  <input className="os9-input" type="number" value={annivDays} onChange={(e) => setAnnivDays(e.target.value)} />
                </div>
              </div>
              <button className="os9-btn os9-btn-primary w-full py-2 mb-3" onClick={calcAnniv}>{t('calculate')}</button>
              {annivResult && (
                <div className="os9-result text-center">
                  <p className="text-xs uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('result')}</p>
                  <p className="os9-big-number text-lg">{annivResult}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7 }}>Calorie Calculator</a>
        <span className="mx-2">|</span>
        <a href={'/' + locale + '/bmi'} className="underline" style={{ opacity: 0.7 }}>BMI Calculator</a>
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
        {t('footer')}
      </div>
    </div>
  );
}