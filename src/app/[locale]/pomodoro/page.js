'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/pomodoro.json';
import esMsgs from '../../../messages/es/pomodoro.json';
import zhMsgs from '../../../messages/zh/pomodoro.json';
import koMsgs from '../../../messages/ko/pomodoro.json';
import ptMsgs from '../../../messages/pt/pomodoro.json';
const pageMsgs = { en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs };

export default function PomodoroPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/pomodoro'; };
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef(null);

  const durations = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false);
            setCompleted(c => c + 1);
            setTotalTime(t => t + durations[mode]);
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=');
            audio.play().catch(() => {});
            return durations[mode];
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const start = () => { setRunning(true); };
  const pause = () => { setRunning(false); };
  const reset = () => { setRunning(false); setTimeLeft(durations[mode]); };
  const formatTime = (s) => { const m = Math.floor(s/60).toString().padStart(2,'0'); const sec = (s%60).toString().padStart(2,'0'); return `${m}:${sec}`; };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
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
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div className="text-center mb-4">
                      <div className="text-[5rem] font-mono tabular-nums" style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</div>
                      <div className="text-xs mt-1" style={{ opacity: 0.6 }}>{t('mode') || 'Mode'}: {mode}</div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button className={'os9-btn flex-1' + (mode === 'pomodoro' ? ' os9-btn-primary' : '')} onClick={() => setMode('pomodoro')}>{t('pomodoro') || 'Pomodoro'}</button>
                      <button className={'os9-btn flex-1' + (mode === 'short' ? ' os9-btn-primary' : '')} onClick={() => setMode('short')}>{t('shortBreak') || 'Short Break'}</button>
                      <button className={'os9-btn flex-1' + (mode === 'long' ? ' os9-btn-primary' : '')} onClick={() => setMode('long')}>{t('longBreak') || 'Long Break'}</button>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button className="os9-btn os9-btn-primary flex-1" onClick={running ? pause : start}>{running ? (t('pause') || 'Pause') : (t('start') || 'Start')}</button>
                      <button className="os9-btn flex-1" onClick={reset}>{t('reset') || 'Reset'}</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('completed') || 'Completed'}</div><div className="font-bold">{completed}</div></div>
                      <div><div className="text-[10px] uppercase tracking-wider" style={{ opacity: 0.6 }}>{t('totalTime') || 'Total Time'}</div><div className="font-bold">{formatTime(totalTime)}</div></div>
                    </div>
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{ opacity: 0.65 }}>{t('seoDescription')}</p>
          </div>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 520, width: '100%', textAlign: 'center', fontSize: 10, opacity: 0.6, marginTop: 12 }}>
        <a href={"/" + locale} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {t('footer') || 'hello-tools 2026'}
      </div>
    </div>
  );
}