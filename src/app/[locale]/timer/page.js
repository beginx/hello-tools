'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { OS9Window, SEODescription, Footer, LanguageSelector } from '../../../components';
import enMsg from '../../../messages/en/timer.json';
import esMsg from '../../../messages/es/timer.json';
import zhMsg from '../../../messages/zh/timer.json';
import koMsg from '../../../messages/ko/timer.json';
import ptMsg from '../../../messages/pt/timer.json';
const pageMsgs = { en: enMsg, es: esMsg, zh: zhMsg, ko: koMsg, pt: ptMsg };

function formatMs(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  const pad = (n, d) => String(n).padStart(d, '0');
  if (h > 0) return `${pad(h,2)}:${pad(m,2)}:${pad(s,2)}.${pad(cs,2)}`;
  return `${pad(m,2)}:${pad(s,2)}.${pad(cs,2)}`;
}

export default function TimerPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => { window.location.href = '/' + l + '/timer'; };

  const [mode, setMode] = useState('stopwatch'); // stopwatch | timer
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const [countdownH, setCountdownH] = useState('0');
  const [countdownM, setCountdownM] = useState('5');
  const [countdownS, setCountdownS] = useState('0');
  const [countdownDone, setCountdownDone] = useState(false);

  const startRef = useRef(0);
  const intervalRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startStopwatch = useCallback(() => {
    startRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 20);
    setRunning(true);
  }, [elapsed]);

  const startCountdown = useCallback(() => {
    const h = parseInt(countdownH) || 0;
    const m = parseInt(countdownM) || 0;
    const s = parseInt(countdownS) || 0;
    const total = (h * 3600 + m * 60 + s) * 1000;
    if (total <= 0) return;
    setCountdownDone(false);
    // If resuming from pause, use remaining time from elapsed
    const remainingMs = elapsed > 0 ? total - elapsed : total;
    if (remainingMs <= 0) return;
    const endTime = Date.now() + remainingMs;
    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setElapsed(total);
        setRunning(false);
        setCountdownDone(true);
        stopTimer();
      } else {
        setElapsed(total - remaining);
      }
    }, 50);
    setRunning(true);
  }, [countdownH, countdownM, countdownS, elapsed, stopTimer]);

  const handleStart = useCallback(() => {
    if (mode === 'stopwatch') startStopwatch();
    else startCountdown();
  }, [mode, startStopwatch, startCountdown]);

  const handleStop = useCallback(() => {
    stopTimer();
    setRunning(false);
    if (mode === 'timer') {
      setCountdownDone(false);
    }
  }, [mode, stopTimer]);

  const handleReset = useCallback(() => {
    stopTimer();
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    setCountdownDone(false);
  }, [stopTimer]);

  const handleLap = useCallback(() => {
    if (mode === 'stopwatch' && running) {
      const prevTotal = laps.length > 0 ? laps.reduce((a, b) => a + b, 0) : 0;
      setLaps(prev => [...prev, elapsed - prevTotal]);
    }
  }, [mode, running, elapsed, laps]);

  // Cleanup on unmount
  useEffect(() => { return () => stopTimer(); }, [stopTimer]);

  const displayTime = mode === 'timer' && !running && countdownDone
    ? '00:00.00'
    : formatMs(elapsed);

  // Determine display mode for countdown: show full time if not started, or remaining
  // When countdownDone and not running, show alarm state
  const showCountdownInput = mode === 'timer' && !running && !countdownDone && elapsed === 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-2" style={{ background: 'var(--os9-bg)' }}>
      <OS9Window title={t('title')}>
          {/* Language selector */}
          <div className="flex justify-between items-center mb-4">
            <LanguageSelector locale={locale} onChange={changeLang} />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-3 mb-5" style={{ justifyContent: 'center' }}>
            <button
              className={mode === 'stopwatch' ? 'os9-btn-primary' : 'os9-btn'}
              style={{ flex: 1, maxWidth: 160, padding: '10px 0', fontSize: 15 }}
              onClick={() => { setMode('stopwatch'); handleReset(); }}
            >
              {t('stopwatch')}
            </button>
            <button
              className={mode === 'timer' ? 'os9-btn-primary' : 'os9-btn'}
              style={{ flex: 1, maxWidth: 160, padding: '10px 0', fontSize: 15 }}
              onClick={() => { setMode('timer'); handleReset(); }}
            >
              {t('timer')}
            </button>
          </div>

          {/* Time Display */}
          <div className="os9-result text-center" style={{ padding: '16px 8px', marginBottom: 16 }}>
            <div className="font-mono" style={{
              fontSize: 'clamp(2rem, 10vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              lineHeight: 1.2,
            }}>
              {displayTime}
            </div>
          </div>

          {/* Countdown input */}
          {showCountdownInput && (
            <div className="flex gap-2 mb-4" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <label className="os9-label block text-xs mb-1">{t('hours')}</label>
                <input className="os9-input text-center" type="number" min="0" max="99"
                  value={countdownH} onChange={(e) => setCountdownH(e.target.value)}
                  style={{ width: 60, fontSize: 16, padding: '8px 4px' }} />
              </div>
              <span style={{ fontSize: 20, marginTop: 16, opacity: 0.5 }}>:</span>
              <div style={{ textAlign: 'center' }}>
                <label className="os9-label block text-xs mb-1">{t('minutes')}</label>
                <input className="os9-input text-center" type="number" min="0" max="59"
                  value={countdownM} onChange={(e) => setCountdownM(e.target.value)}
                  style={{ width: 60, fontSize: 16, padding: '8px 4px' }} />
              </div>
              <span style={{ fontSize: 20, marginTop: 16, opacity: 0.5 }}>:</span>
              <div style={{ textAlign: 'center' }}>
                <label className="os9-label block text-xs mb-1">{t('seconds')}</label>
                <input className="os9-input text-center" type="number" min="0" max="59"
                  value={countdownS} onChange={(e) => setCountdownS(e.target.value)}
                  style={{ width: 60, fontSize: 16, padding: '8px 4px' }} />
              </div>
            </div>
          )}

          {/* Alarm message */}
          {countdownDone && (
            <div className="text-center mb-4" style={{ color: 'var(--os9-red)', fontWeight: 700, fontSize: 18 }}>
              ⏰ {t('alarm')}
              <button className="os9-btn ml-3 text-sm !py-1 !px-4" onClick={() => setCountdownDone(false)}>
                {t('alarmDone')}
              </button>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3 mb-4" style={{ justifyContent: 'center' }}>
            {!running ? (
              <button className="os9-btn-primary" style={{ flex: 1, maxWidth: 140, padding: '12px 0', fontSize: 16 }}
                onClick={handleStart}
                disabled={mode === 'timer' && showCountdownInput && !parseInt(countdownH) && !parseInt(countdownM) && !parseInt(countdownS)}>
                {t('start')}
              </button>
            ) : (
              <button className="os9-btn" style={{ flex: 1, maxWidth: 140, padding: '12px 0', fontSize: 16 }}
                onClick={handleStop}>
                {mode === 'timer' ? t('stop') : t('pause')}
              </button>
            )}
            {running && mode === 'stopwatch' && (
              <button className="os9-btn" style={{ flex: 1, maxWidth: 140, padding: '12px 0', fontSize: 16 }}
                onClick={handleLap}>
                {t('lap')}
              </button>
            )}
            {running && mode === 'timer' && (
              <button className="os9-btn" style={{ flex: 1, maxWidth: 140, padding: '12px 0', fontSize: 16 }}
                onClick={handleStop}>
                {t('pause')}
              </button>
            )}
          </div>
          {elapsed > 0 && !running && (
            <div className="flex justify-center mb-4">
              <button className="os9-btn" style={{ padding: '10px 32px', fontSize: 15 }}
                onClick={handleReset}>
                {t('reset')}
              </button>
            </div>
          )}

          {/* Laps */}
          {mode === 'stopwatch' && laps.length > 0 && (
            <div className="mt-2">
              <hr className="os9-divider" />
              <div className="flex justify-between items-center mb-2 mt-2">
                <span className="os9-label text-sm" style={{ marginBottom: 0 }}>{t('laps')}</span>
                <button className="text-xs underline" style={{ opacity: 0.5, padding: '4px 8px' }}
                  onClick={() => setLaps([])}>{t('clearLaps')}</button>
              </div>
              <div className="space-y-1" style={{ maxHeight: 200, overflowY: 'auto' }}>
                {laps.map((lap, i) => (
                  <div key={i} className="os9-result !py-2 !px-3 text-sm flex items-center justify-between"
                    style={{ background: 'var(--os9-surface)' }}>
                    <span style={{ opacity: 0.5 }}>Lap {laps.length - i}</span>
                    <span className="font-mono">{formatMs(lap)}</span>
                  </div>
                )).reverse()}
              </div>
            </div>
          )}

          {/* SEO Description + Related Tools */}
          <SEODescription
            description={t('seoDescription')}
            locale={locale}
            relatedTools={[
              { href: '/duration', name: 'Time Duration Calculator' },
              { href: '/date', name: 'Date Calculator' },
              { href: '/daysuntil', name: 'Days Until Calculator' },
            ]}
          />
      </OS9Window>

      {/* Rich Content Section for SEO */}
      <div className="os9-window mt-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="os9-titlebar">
          <span className="tracking-[0.5px] text-sm">How to Use</span>
        </div>
        <div className="os9-window-body">
          <h2 className="text-lg font-bold mb-3">How to Use This Timer</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">Step 1: Choose Your Mode</h3>
            <p className="text-sm" style={{ opacity: 0.85, lineHeight: 1.6 }}>
              Select between Stopwatch and Timer modes. Use Stopwatch to measure elapsed time going up from zero. Use Timer for a countdown that goes down to zero.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Step 2: Set Time (Countdown Mode)</h3>
            <p className="text-sm" style={{ opacity: 0.85, lineHeight: 1.6 }}>
              In Timer mode, set your desired countdown time using the hours, minutes, and seconds inputs. Use the up/down arrows to adjust values quickly.
            </p>
            <ul className="text-sm mt-2 list-disc pl-5" style={{ opacity: 0.8 }}>
              <li>5-minute timer: Set minutes to 5</li>
              <li>10-minute timer: Set minutes to 10</li>
              <li>1-hour timer: Set hours to 1</li>
              <li>30-second timer: Set seconds to 30</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Step 3: Start & Control</h3>
            <p className="text-sm" style={{ opacity: 0.85, lineHeight: 1.6 }}>
              Click the Start button to begin. You can pause at any time, then resume from where you left off. Click Reset to clear all time and start fresh.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Key Features</h3>
            <ul className="text-sm list-disc pl-5" style={{ opacity: 0.85, lineHeight: 1.8 }}>
              <li>Dual mode: Stopwatch and Countdown Timer</li>\              <li>Precision timing to 1/100th second</li>
              <li>Lap time recording for stopwatch</li>
              <li>Mobile-optimized responsive design</li>
              <li>No installation required - works in browser</li>
              <li>Completely free with no limitations</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Common Uses</h3>
            <ul className="text-sm list-disc pl-5" style={{ opacity: 0.85, lineHeight: 1.8 }}>
              <li><strong>Fitness:</strong> Interval training, stretching timers, running pace</li>
              <li><strong>Study:</strong> Pomodoro technique, exam practice, reading time</li>
              <li><strong>Cooking:</strong> Boiling, baking, fermentation timing</li>
              <li><strong>Work:</strong> Meeting timers, focus sessions, break management</li>
            </ul>
          </div>

          <div className="mb-2">
            <h3 className="font-bold mb-2">Frequently Asked Questions</h3>
            <div className="text-sm" style={{ opacity: 0.85, lineHeight: 1.6 }}>
              <p className="mb-2"><strong>Q: Can I turn off the timer sound?</strong><br/>A: Yes, disable browser notifications or mute your system volume.</p>
              <p className="mb-2"><strong>Q: Does it work on mobile?</strong><br/>A: Yes, fully optimized for smartphones and tablets.</p>
              <p className="mb-2"><strong>Q: Is the timing accurate?</strong><br/>A: Yes, uses high-precision browser timers accurate to milliseconds.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer locale={locale} />
    </div>
  );
}