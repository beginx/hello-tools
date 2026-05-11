'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/age.json';
import esMsgs from '../../../messages/es/age.json';
import zhMsgs from '../../../messages/zh/age.json';
import koMsgs from '../../../messages/ko/age.json';
import ptMsgs from '../../../messages/pt/age.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

const DAYS = { en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], es: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'], zh: ['周日','周一','周二','周三','周四','周五','周六'], ko: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], pt: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'] };

const MONTHS = { en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], zh: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], ko: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'], pt: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'] };

function calcAge(birth) {
  const now = new Date();
  let y = now.getFullYear() - birth.getFullYear();
  let m = now.getMonth() - birth.getMonth();
  let d = now.getDate() - birth.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const totalDays = Math.round((now.getTime() - birth.getTime()) / 86400000);
  const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
  const daysToBday = Math.round((nextBday.getTime() - now.getTime()) / 86400000);
  return { years: y, months: m, days: d, totalDays, dayOfWeek: birth.getDay(), daysToBday };
}

export default function AgePage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/age'; };

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [result, setResult] = useState(null);
  const dayNames = DAYS[locale] || DAYS.en;
  const monthNames = MONTHS[locale] || MONTHS.en;

  const calc = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d2 = parseInt(day);
    if (!y || !m || !d2 || y < 1900 || y > new Date().getFullYear() || m < 1 || m > 12 || d2 < 1 || d2 > 31) {
      setResult(null);
      return;
    }
    const birth = new Date(y, m - 1, d2);
    if (isNaN(birth.getTime()) || birth >= new Date()) { setResult(null); return; }
    setResult(calcAge(birth));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 420, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          {/* Language */}
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {/* Date of Birth — year / month / day */}
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('dob')}</label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input className="os9-input w-full text-center" type="number" min="1900" max="2100"
                  value={year} onChange={(e) => { const v = e.target.value; if (v.length <= 4) setYear(v); }}
                  placeholder={locale === 'ko' ? '년(YYYY)' : locale === 'zh' ? '年(YYYY)' : locale === 'es' ? 'Año(YYYY)' : locale === 'pt' ? 'Ano(YYYY)' : 'Year(YYYY)'}
                  style={{ fontSize: 16, padding: '10px 4px' }} />
              </div>
              <div className="flex-none" style={{ width: 80 }}>
                <select className="os9-select w-full text-center" value={month} onChange={(e) => setMonth(e.target.value)}
                  style={{ fontSize: 14, padding: '10px 4px' }}>
                  <option value="">{locale === 'ko' ? '월' : locale === 'zh' ? '月' : 'Month'}</option>
                  {monthNames.map((n, i) => (
                    <option key={i} value={i + 1}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex-none" style={{ width: 70 }}>
                <input className="os9-input w-full text-center" type="number" min="1" max="31"
                  value={day} onChange={(e) => { const v = e.target.value; if (v.length <= 2) setDay(v); }}
                  placeholder={locale === 'ko' ? '일' : locale === 'zh' ? '日' : 'Day'}
                  style={{ fontSize: 16, padding: '10px 4px' }} />
              </div>
            </div>
          </div>

          {/* Calculate */}
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }}
            onClick={calc}>{t('calculate')}</button>

          {/* Result */}
          {result && (
            <div className="os9-result" style={{ padding: '16px 12px' }}>
              {/* Main age — large display */}
              <div className="text-center mb-4">
                <div style={{ fontSize: 36, fontWeight: 'bold', color: 'var(--os9-red)', lineHeight: 1.1 }}>
                  {result.years}
                </div>
                <div className="text-xs" style={{ opacity: 0.6 }}>{t('years')}</div>
                <div className="text-xs mt-1" style={{ opacity: 0.8 }}>
                  {result.years} {t('years')}, {result.months} {t('months')}, {result.days} {t('days')}
                </div>
              </div>

              {/* Extra info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2" style={{ background: 'var(--os9-bg)', borderRadius: 6 }}>
                  <div style={{ opacity: 0.5 }}>{t('totalDays')}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 16 }}>{result.totalDays?.toLocaleString()}</div>
                </div>
                <div className="p-2" style={{ background: 'var(--os9-bg)', borderRadius: 6 }}>
                  <div style={{ opacity: 0.5 }}>{t('dayOfWeek')}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 16 }}>{dayNames[result.dayOfWeek]}</div>
                </div>
                <div className="p-2 col-span-2" style={{ background: 'var(--os9-bg)', borderRadius: 6 }}>
                  <div style={{ opacity: 0.5 }}>{t('nextBirthday')}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 16, color: '#22aa22' }}>{result.daysToBday} {t('days')}</div>
                </div>
              </div>
            </div>
          )}
          {!result && year && month && day && (
            <p className="text-xs text-center" style={{ opacity: 0.6 }}>{t('error')}</p>
          )}

          {/* Clear */}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={() => { setYear(''); setMonth(''); setDay(''); setResult(null); }}>{t('clear')}</button>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/age'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Age</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}