'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/sleep.json';
import esMsgs from '../../../messages/es/sleep.json';
import zhMsgs from '../../../messages/zh/sleep.json';
import koMsgs from '../../../messages/ko/sleep.json';
import ptMsgs from '../../../messages/pt/sleep.json';
var pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };
var fmtTime = function(hours, mins) {
  var h = hours;
  var ampm = 'AM';
  if (h >= 12) { ampm = 'PM'; if (h > 12) h = h - 12; }
  if (h === 0) { h = 12; ampm = 'AM'; }
  return h + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
};
export default function SleepPage() {
  var params = useParams();
  var locale = params && params.locale ? params.locale : 'en';
  var t = function(k) { return (pageMsgs[locale] || pageMsgs.en)[k] || k; };
  var changeLang = function(l) { window.location.href = '/' + l + '/sleep'; };
  var [mode, setMode] = useState('wake');
  var [hour, setHour] = useState('7');
  var [minute, setMinute] = useState('0');
  var [ampm, setAmpm] = useState('AM');
  var [fallAsleep, setFallAsleep] = useState('15');
  var [results, setResults] = useState(null);
  var calc = function() {
    var h = parseInt(hour);
    var m = parseInt(minute);
    if (isNaN(h) || isNaN(m)) { setResults(null); return; }
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    var baseMinutes = h * 60 + m;
    var fall = parseInt(fallAsleep) || 15;
    var cycleLen = 90;
    var cycleCounts = [6, 5, 4.5, 3.5, 4];
    var res = [];
    for (var i = 0; i < cycleCounts.length; i++) {
      var offset = Math.round(cycleCounts[i] * cycleLen + fall);
      var resultMin = mode === 'wake' ? ((baseMinutes - offset) % 1440 + 1440) % 1440 : (baseMinutes + offset) % 1440;
      var rh = Math.floor(resultMin / 60);
      var rm = Math.round(resultMin % 60);
      res.push({ time: fmtTime(rh, rm), cycles: cycleCounts[i], duration: (cycleCounts[i] * 90 / 60).toFixed(1) + 'h' });
    }
    setResults(res);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 420, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls"><div className="os9-dot os9-dot-close" /><div className="os9-dot os9-dot-minimize" /><div className="os9-dot os9-dot-zoom" /></div>
          <span className="tracking-[0.5px] text-sm">{t('title')}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={function(e) { changeLang(e.target.value); }}>
              <option value="en">English</option><option value="es">Español</option><option value="zh">中文</option><option value="ko">한국어</option><option value="pt">Português</option>
            </select>
          </div>
          <div className="mb-4">
            <div className="flex gap-2 mb-3">
              <button className={'flex-1 py-2 text-xs ' + (mode === 'wake' ? 'os9-btn-primary' : 'text-sm underline')}
                style={mode === 'wake' ? { padding: '8px 0' } : { opacity: 0.6, padding: '8px 0', background: 'transparent', border: 'none' }}
                onClick={function() { setMode('wake'); setResults(null); }}>{t('modeWake')}</button>
              <button className={'flex-1 py-2 text-xs ' + (mode === 'bed' ? 'os9-btn-primary' : 'text-sm underline')}
                style={mode === 'bed' ? { padding: '8px 0' } : { opacity: 0.6, padding: '8px 0', background: 'transparent', border: 'none' }}
                onClick={function() { setMode('bed'); setResults(null); }}>{t('modeBed')}</button>
            </div>
          </div>
          <div className="mb-3">
            <label className="os9-label block text-xs mb-1">{mode === 'wake' ? t('modeWake') : t('modeBed')}</label>
            <div className="flex gap-2">
              <select className="os9-select flex-1 text-sm" value={hour} onChange={function(e) { setHour(e.target.value); }}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(function(h) { return <option key={h} value={h}>{h}</option>; })}
              </select>
              <span className="text-sm self-center">:</span>
              <select className="os9-select flex-1 text-sm" value={minute} onChange={function(e) { setMinute(e.target.value); }}>
                {[0,5,10,15,20,25,30,35,40,45,50,55].map(function(m) { return <option key={m} value={m}>{m < 10 ? '0' + m : '' + m}</option>; })}
              </select>
              <select className="os9-select flex-1 text-sm" value={ampm} onChange={function(e) { setAmpm(e.target.value); }}>
                <option value="AM">AM</option><option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="os9-label block text-xs mb-1">{t('fallAsleep')}</label>
            <input className="os9-input w-full" type="number" step="1" min="0" max="120" value={fallAsleep} onChange={function(e) { setFallAsleep(e.target.value); }} style={{ fontSize: 16, padding: '10px 8px' }} />
          </div>
          <button className="os9-btn-primary w-full mb-4" style={{ padding: '12px 0', fontSize: 16 }} onClick={calc}>{t('calculate')}</button>
          {results && results.length > 0 && (
            <div className="os9-result" style={{ padding: '12px' }}>
              <p className="text-xs font-bold mb-3">{mode === 'wake' ? t('bestBedtimes') : t('bestWaketimes')}</p>
              {results.map(function(r, idx) {
                return (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                    <span className="text-sm font-bold" style={{ color: 'var(--os9-red)' }}>{r.time}</span>
                    <span className="text-xs" style={{ opacity: 0.6 }}>{r.cycles} {t('cyclesLabel')} {String.fromCharCode(0x2014)} {r.duration}</span>
                  </div>
                );
              })}
              <p className="text-xs mt-3 leading-relaxed" style={{ opacity: 0.6 }}>{t('recommendation')}</p>
            </div>
          )}
          <div className="text-center mt-3">
            <button className="text-xs underline" style={{ opacity: 0.5, padding: '6px 12px' }}
              onClick={function() { setResults(null); setFallAsleep('15'); setHour('7'); setMinute('0'); setAmpm('AM'); }}>{t('clear')}</button>
          </div>
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
            <div className="mt-2 text-xs" style={{ opacity: 0.55 }}>
              <span style={{ fontWeight: 600 }}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <a href={'/' + locale + '/duedate'} className="underline">Due Date Calculator</a>
                <a href={'/' + locale + '/pace'} className="underline">Pace Calculator</a>
                <a href={'/' + locale + '/period'} className="underline">Period Calculator</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 420, width: '100%' }}>
        <a href={'/' + locale} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Tools</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        <a href={'/' + locale + '/sleep'} className="underline" style={{ opacity: 0.7, fontSize: 12 }}>Sleep</a>
        <span className="mx-1" style={{ opacity: 0.4 }}>|</span>
        hello-tools 2026
      </div>
    </div>
  );
}
